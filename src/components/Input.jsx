import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatsContext";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase.config";
import { v4 as uuid } from "uuid";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const Input = () => {
  const [err, setErr] = useState(null);
  const [img, setImg] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSend = async () => {
    setLoading(true); // Start loading
    setErr(null); // Reset error state

    try {
      if (img) {
        const storageRef = ref(storage, uuid());
        const uploadTask = uploadBytesResumable(storageRef, img);

        uploadTask.on(
          (error) => {
            setErr("File upload failed, please try again.");
            setLoading(false); // Stop loading on error
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid, // Ensure you're using uid for senderId
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
            setText('');
            setImg(null);
            setLoading(false); // Stop loading after successful send
          }
        );
      } else {
        await updateDoc(doc(db, "chats", data.chatId), {
          messages: arrayUnion({
            id: uuid(),
            text,
            senderId: currentUser.uid, // Ensure you're using uid for senderId
            date: Timestamp.now(),
          }),
        });
        setText('');
        setImg(null);
        setLoading(false); // Stop loading after successful send
      }
    } catch (error) {
      setErr("An error occurred while sending the message.");
      setLoading(false); // Stop loading on catch
    }
  };

  return (
    <div className="Input">
      {err && <div className="error">{err}</div>} {/* Display error message */}
      <input
        type="text"
        placeholder="Type a message"
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={loading} // Disable input while loading
        aria-label="Message input"
      />

      <div className="input-send">
        <input
          type="file"
          id="file"
          style={{ display: "none" }}
          onChange={(e) => setImg(e.target.files[0])}
          aria-label="Upload image"
        />
        <label htmlFor="file">
          <img src="/images.png" width={30} height={30} alt="Upload" />
        </label>
        <button onClick={handleSend} disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default Input;
