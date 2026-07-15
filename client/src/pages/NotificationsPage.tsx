import { useNotifications } from '../lib/hooks'
import { AiFillDelete } from 'react-icons/ai'

const NotificationsPage = () => {
  const { notifications, deleteNotification } = useNotifications()

  const handleDeleteNotification = async (id: string) => {
    await deleteNotification(id)
  }

  return (
    <main className="mx-auto min-h-[32rem] w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">Inbox</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
          {notifications.length === 0 ? 'No notifications yet' : 'Your notifications'}
        </h1>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {notifications.map((notification) => (
          <article className="relative min-h-28 rounded-2xl border border-slate-200 bg-white p-5 pr-12 shadow-sm" key={notification._id}>
            <p className="leading-6 text-slate-700">{notification.message}</p>
            <button type="button" aria-label="Delete notification" onClick={() => void handleDeleteNotification(notification._id)} className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-rose-50 hover:text-rose-600">
              <AiFillDelete size={18} />
            </button>
          </article>
        ))}
      </div>
    </main>
  )
}

export default NotificationsPage
