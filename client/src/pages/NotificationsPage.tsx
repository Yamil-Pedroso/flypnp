import { createElement } from 'react'
import { useNotifications } from '../lib/hooks'
import { Link } from 'react-router-dom'
import {
  Bell,
  Check,
  CheckCircle2,
  Clock3,
  Gift,
  MessageSquareText,
  Trash2,
  XCircle,
  type LucideIcon,
} from 'lucide-react'
import { toast } from 'sonner'
import { getErrorMessage } from '../services'
import type { Notification } from '../services'
import { useTranslation } from 'react-i18next'

const notificationIcon = (notification: Notification): LucideIcon => {
  switch (notification.type) {
    case 'service_quote':
      return MessageSquareText
    case 'service_confirmed':
      return CheckCircle2
    case 'service_cancelled':
      return XCircle
    default:
      break
  }
  const text = `${notification.title ?? ''} ${notification.message}`.toLowerCase()
  if (text.includes('gift card') || text.includes('balance')) return Gift
  return Bell
}

const NotificationsPage = () => {
  const { notifications, deleteNotification, markAsRead } = useNotifications()
  const { t, i18n } = useTranslation('app', { keyPrefix: 'notifications' })

  const handleDeleteNotification = async (id: string) => {
    try {
      await deleteNotification(id)
      toast.success(t('deleted'), { icon: <Trash2 className="size-4" /> })
    } catch (cause) {
      toast.error(getErrorMessage(cause, t('deleteError')))
    }
  }

  return (
    <main className="mx-auto min-h-[32rem] w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">{t('inbox')}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
          {notifications.length === 0 ? t('empty') : t('title')}
        </h1>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {notifications.map((notification) => (
          <article className={`relative min-h-44 rounded-2xl border bg-white p-5 shadow-sm ${notification.read ? 'border-slate-200' : 'border-emerald-200 ring-4 ring-emerald-50'}`} key={notification._id}>
            <div className="flex items-start gap-3 pr-10">
              <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${notification.read ? 'bg-slate-100 text-slate-500' : 'bg-emerald-100 text-emerald-700'}`}>
                <Bell className="size-5" />
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold text-slate-950">{notification.title || t('defaultTitle')}</h2>
                  {!notification.read && <span className="size-2 rounded-full bg-emerald-500" aria-label={t('unread')} />}
                </div>
                <p className="mt-1 flex items-start gap-2 text-sm leading-6 text-slate-600">
                  {createElement(notificationIcon(notification), { className: 'mt-0.5 size-4 shrink-0 text-slate-400' })}
                  <span>{notification.message}</span>
                </p>
              </div>
            </div>
            {notification.createdAt && (
              <p className="mt-4 flex items-center gap-1.5 text-xs text-slate-400">
                <Clock3 className="size-3.5" />
                {new Intl.DateTimeFormat(i18n.resolvedLanguage, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(notification.createdAt))}
              </p>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {notification.actionUrl && (
                <Link to={notification.actionUrl} onClick={() => void markAsRead(notification._id)} className="rounded-full bg-slate-950 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-700">
                  {t('viewDetails')}
                </Link>
              )}
              {!notification.read && (
                <button type="button" onClick={() => void markAsRead(notification._id)} className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 transition hover:text-emerald-700">
                  <Check className="size-3.5" /> {t('markRead')}
                </button>
              )}
            </div>
            <button type="button" aria-label={t('delete')} onClick={() => void handleDeleteNotification(notification._id)} className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-rose-50 hover:text-rose-600">
              <Trash2 className="size-4" />
            </button>
          </article>
        ))}
      </div>
    </main>
  )
}

export default NotificationsPage
