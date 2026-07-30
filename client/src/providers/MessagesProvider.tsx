import {
  MessagesContext,
  useMessagesController,
} from "../lib/hooks/useMessages";

const MessagesProvider = ({ children }: { children: React.ReactNode }) => {
  const value = useMessagesController();
  return (
    <MessagesContext.Provider value={value}>{children}</MessagesContext.Provider>
  );
};

export default MessagesProvider;
