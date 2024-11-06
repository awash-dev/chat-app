import { useContext } from "react";
import Input from "./Input"; 
import Messages from "./Messages";
import { ChatContext } from "../context/ChatsContext";

const Chat = () => {
  const {data} = useContext(ChatContext)
  return (
    <div className="Chat">
      <div className="chatInfo">
        <span>{data.user?.displayName}</span>
        <div className="chatIcon">
          <img src="/phone.jpg" alt="" width={40} height={40} />
          <img src="/add.png" alt="" width={40} height={40} />
        </div>
      </div>
      <Messages />
      <Input/>
    </div>
  );
};

export default Chat;
