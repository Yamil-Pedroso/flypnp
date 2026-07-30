const requiredEnv = (name) => {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is required`);
  return value;
};

const apiBaseUrl = requiredEnv("API_BASE_URL").replace(/\/$/, "");
const userToken = requiredEnv("USER_TOKEN");
const adminToken = requiredEnv("ADMIN_TOKEN");
const includePayment = process.env.SMOKE_INCLUDE_PAYMENT === "true";

const apiRequest = async (path, token, options = {}) => {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`${options.method ?? "GET"} ${path} failed (${response.status}): ${body.message ?? "Unknown error"}`);
  }
  return body;
};

const futureDate = new Date();
futureDate.setUTCDate(futureDate.getUTCDate() + 7);
const date = futureDate.toISOString().slice(0, 10);
let serviceRequestId = "";

try {
  const created = await apiRequest("/service-requests", userToken, {
    method: "POST",
    body: JSON.stringify({
      serviceType: "airport-transfer",
      destination: "Zurich smoke test",
      date,
      time: "14:30",
      participants: 1,
      notes: "Automated staging smoke test. Safe to cancel.",
      details: {
        pickup: "Zurich Airport",
        dropoff: "Zurich HB",
        flightNumber: "SMOKE1",
      },
    }),
  });
  serviceRequestId = created.data._id;

  const adminList = await apiRequest("/admin/service-requests", adminToken);
  if (!adminList.data.some((request) => request._id === serviceRequestId)) {
    throw new Error("The new request was not visible to the administrator");
  }

  await apiRequest(`/admin/service-requests/${serviceRequestId}/quote`, adminToken, {
    method: "PATCH",
    body: JSON.stringify({
      quotePrice: 45,
      provider: {
        name: "Flypnp Staging Provider",
        email: "staging-provider@example.com",
        phone: "+41000000000",
      },
      adminMessage: "Automated staging quote.",
    }),
  });

  const userList = await apiRequest("/service-requests", userToken);
  const quoted = userList.data.find((request) => request._id === serviceRequestId);
  if (!quoted || quoted.status !== "quoted") throw new Error("The quote was not returned to the traveler");
  if (quoted.provider?.email || quoted.provider?.phone) {
    throw new Error("Provider contact details leaked before payment confirmation");
  }

  if (includePayment) {
    const payment = await apiRequest("/create-payment", userToken, {
      method: "POST",
      body: JSON.stringify({ serviceRequestId, currency: "chf" }),
    });
    if (!payment.clientSecret || payment.data.amount !== 4950 || payment.data.currency !== "chf") {
      throw new Error("Stripe did not create the expected CHF 49.50 payment intent");
    }
  }

  console.log(`Services smoke test passed for request ${serviceRequestId}`);
} finally {
  if (serviceRequestId) {
    await apiRequest(`/service-requests/${serviceRequestId}`, userToken, { method: "DELETE" })
      .then(() => console.log(`Smoke-test request ${serviceRequestId} cancelled`))
      .catch((error) => console.error(`Cleanup warning: ${error.message}`));
  }
}
