import { onSnapshot, doc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { db } from "../firebase.config";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatsContext";

const Chates = () => {
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);
  const [chats, setChats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(
        doc(db, "userChats", currentUser.uid),
        (doc) => {
          setChats(doc.data() || {});
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching chats: ", error);
          setError("Failed to load chats. Please try again.");
          setLoading(false);
        }
      );
      return () => {
        unsub();
      };
    };

    if (currentUser?.uid) {
      getChats();
    }
  }, [currentUser]);

  const handleUser = (user) => {
    dispatch({ type: "CHANGE_USER", payload: user });
  };

  if (loading) return <div>Loading chats...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="chats">
      {Object.entries(chats)?.map(([key, chat]) => {
        const userInfo = chat?.userInfo || {};

        // Check if userInfo is valid
        if (!userInfo.displayName) return null; // Skip rendering if displayName is missing

        const lastMessage = chat.userInfo.lastMessage?.text || "No messages yet";
        const displayName = userInfo.displayName || "Unknown User";
        const photoURL = userInfo.photoURL || "/pp.png"; // Fallback image

        return (
          <div
            className="userChat"
            key={key}
            onClick={() => handleUser(chat?.userInfo)}
          >
            <img src={photoURL} width={40} height={40} alt={displayName} />
            <div className="userChatInfo">
              <span>{displayName}</span>
              <p>{lastMessage}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Chates;
