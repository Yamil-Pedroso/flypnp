interface NotificationsProps {
  text: string;
}

const Notifications = ({ text }: NotificationsProps) => {
  return (
    <div className="fixed top-4 right-4 z-[1000] flex flex-col gap-4 items-end">
      <p className="bg-neutral-800 text-white px-4 py-2 rounded-md shadow-md">
        {text}
      </p>
    </div>
  );
};

export default Notifications;
