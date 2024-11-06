import React, { useContext } from "react";
import { auth } from "../firebase.config"; // Ensure this path is correct
import { signOut } from "firebase/auth";
import { AuthContext } from "../context/AuthContext"; // Make sure the path is correct

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="Navbar">
      <span className="logo">Awash Chat</span>

      <div className="user">
        {currentUser?.photoURL ? (
          <img src={currentUser.photoURL} alt="User Profile" />
        ) : (
          <img src="/pp.jfif" alt="Default Profile" />
        )}
        <span>{currentUser?.displayName || "User"}</span>
        <button onClick={handleLogout}>Log out</button>
      </div>
    </div>
  );
};

export default Navbar;
