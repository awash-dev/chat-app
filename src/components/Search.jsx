import { useContext, useState } from "react";
import { db } from "../firebase.config";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  serverTimestamp,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";

const Search = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const { currentUser } = useContext(AuthContext);

  const handleSearch = async () => {
    if (username.trim() === "") {
      setError("Please enter a username");
      return;
    }

    setError(null); // Clear previous errors
    const q = query(
      collection(db, "users"),
      where("displayName", "==", username)
    );

    try {
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const users = [];
        querySnapshot.forEach((doc) => {
          users.push(doc.data());
        });
        setUser(users[0]); // Set the first user found
      } else {
        setError("User not found");
      }
    } catch (error) {
      setError("Unable to fetch user details. Please try again.");
      console.error(error);
    }
  };

  const handleKey = (e) => {
    if (e.code === "Enter") {
      handleSearch();
    }
  };

  const handleSelector = async () => {
    if (!user) return; // Prevent action if no user is selected

    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;

    try {
      const res = await getDoc(doc(db, "chats", combinedId));
      if (!res.exists()) {
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + " date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + " date"]: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error("Error creating chat:", error);
    }
    setUser(null);
    setUsername('');
  };

  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          placeholder="Find User"
          value={username}
          onKeyDown={handleKey}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      {error && <p className="error">{error}</p>}
      {user && (
        <div className="userChat" onClick={handleSelector}>
          <img
            src={user.photoURL}
            width={30}
            height={30}
            alt={user.displayName}
          />
          <div className="userChatInfo">
            <span>
              {user.displayName} {user.uid}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
