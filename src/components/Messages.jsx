import { useContext, useEffect, useState } from "react";
import Message from "../components/Message";
import { ChatContext } from "../context/ChatsContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase.config";

const Messages = () => {
  const [messages, setMessages] = useState([]);

  const { data } = useContext(ChatContext);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });

    return () => {
      unSub();
    };
  }, [data.chatId]);
  console.log(messages);

  return (
    <div className="messages">
      {messages.map((m) => {
        <Message message={m} key={m.id} />;
      })}
      <Message />
    </div>
  );
};

export default Messages;
