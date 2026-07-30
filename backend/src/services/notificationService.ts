import { EmailDelivery } from "../models/EmailDelivery";
import { Notification } from "../models/Notification";
import { User } from "../models/User";

type NotificationType = "general" | "service_quote" | "service_confirmed" | "service_cancelled";

interface NotifyUserInput {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  actionUrl: string;
  dedupeKey: string;
  emailSubject: string;
  emailText: string;
}

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;",
  })[character] ?? character);

const absoluteClientUrl = (path: string) =>
  new URL(path, process.env.CLIENT_URL ?? "http://localhost:5173").toString();

const emailHtml = (name: string, title: string, message: string, actionUrl: string) => {
  const appName = escapeHtml(process.env.APP_NAME ?? "Flypnp");
  return `<!doctype html>
<html lang="en">
  <body style="margin:0;background:#f8fafc;font-family:Arial,sans-serif;color:#0f172a">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:32px 16px;background:#f8fafc">
      <tr><td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border:1px solid #e2e8f0;border-radius:24px;padding:32px">
          <tr><td>
            <p style="margin:0 0 24px;color:#059669;font-weight:700">${appName}</p>
            <p style="margin:0 0 8px;color:#475569">Hello ${escapeHtml(name)},</p>
            <h1 style="margin:0 0 16px;font-size:28px;line-height:1.2">${escapeHtml(title)}</h1>
            <p style="margin:0 0 24px;color:#475569;line-height:1.7">${escapeHtml(message)}</p>
            <a href="${escapeHtml(actionUrl)}" style="display:inline-block;border-radius:999px;background:#0f172a;color:#ffffff;text-decoration:none;font-weight:700;padding:13px 22px">View in ${appName}</a>
            <p style="margin:28px 0 0;color:#94a3b8;font-size:12px;line-height:1.6">If you did not make this request, contact Flypnp support.</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
};

const ignoreDuplicate = (error: unknown) => {
  if ((error as Error & { code?: number }).code !== 11000) throw error;
};

export const notifyUser = async (input: NotifyUserInput) => {
  const user = await User.findById(input.userId).select("name email");
  if (!user) return;

  await Notification.create({
    user: user._id,
    type: input.type,
    title: input.title,
    message: input.message,
    actionUrl: input.actionUrl,
    dedupeKey: input.dedupeKey,
    read: false,
  }).catch(ignoreDuplicate);

  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) return;

  const actionUrl = absoluteClientUrl(input.actionUrl);
  await EmailDelivery.create({
    recipient: user.email,
    subject: input.emailSubject,
    text: `${input.emailText}\n\n${actionUrl}`,
    html: emailHtml(user.name, input.title, input.emailText, actionUrl),
    dedupeKey: input.dedupeKey,
    status: "pending",
    attempts: 0,
    nextAttemptAt: new Date(),
  }).catch(ignoreDuplicate);
};

const claimNextEmail = () => {
  const now = new Date();
  const staleLock = new Date(Date.now() - 10 * 60_000);
  return EmailDelivery.findOneAndUpdate(
    {
      $or: [
        { status: "pending", nextAttemptAt: { $lte: now } },
        { status: "processing", lockedAt: { $lte: staleLock } },
      ],
    },
    {
      $set: { status: "processing", lockedAt: now },
      $inc: { attempts: 1 },
    },
    { new: true, sort: { nextAttemptAt: 1 } },
  ).select("+recipient +text +html");
};

const sendWithResend = async (delivery: Awaited<ReturnType<typeof claimNextEmail>>) => {
  if (!delivery) return;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
      "Idempotency-Key": delivery.dedupeKey,
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM,
      to: [delivery.recipient],
      subject: delivery.subject,
      text: delivery.text,
      html: delivery.html,
      ...(process.env.EMAIL_REPLY_TO ? { reply_to: process.env.EMAIL_REPLY_TO } : {}),
    }),
    signal: AbortSignal.timeout(10_000),
  });

  const result = await response.json().catch(() => ({})) as { id?: string; message?: string };
  if (!response.ok || !result.id) {
    throw new Error(result.message || `Email provider returned HTTP ${response.status}`);
  }

  delivery.status = "sent";
  delivery.sentAt = new Date();
  delivery.providerMessageId = result.id;
  delivery.lastError = undefined;
  delivery.lockedAt = undefined;
  await delivery.save();
};

const markDeliveryForRetry = async (
  delivery: NonNullable<Awaited<ReturnType<typeof claimNextEmail>>>,
  cause: unknown,
) => {
  const maximumAttempts = 5;
  const retryDelay = Math.min(60 * 60_000, 30_000 * 2 ** Math.max(0, delivery.attempts - 1));
  delivery.status = delivery.attempts >= maximumAttempts ? "failed" : "pending";
  delivery.nextAttemptAt = new Date(Date.now() + retryDelay);
  delivery.lastError = (cause instanceof Error ? cause.message : "Unknown email delivery error").slice(0, 1000);
  delivery.lockedAt = undefined;
  await delivery.save();
};

export const processEmailDeliveries = async (batchSize = 10) => {
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) return 0;
  let processed = 0;

  while (processed < batchSize) {
    const delivery = await claimNextEmail();
    if (!delivery) break;
    try {
      await sendWithResend(delivery);
    } catch (cause) {
      await markDeliveryForRetry(delivery, cause);
    }
    processed += 1;
  }

  return processed;
};

export const startEmailDeliveryWorker = () => {
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) return;
  const intervalMs = Number(process.env.EMAIL_WORKER_INTERVAL_MS) || 30_000;
  void processEmailDeliveries().catch(console.error);
  const timer = setInterval(() => {
    void processEmailDeliveries().catch(console.error);
  }, Math.max(5_000, intervalMs));
  timer.unref();
};
