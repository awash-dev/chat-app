import React, { useState } from "react";
import { auth, storage, db } from "../firebase.config";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import "./Index.scss";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    if (!file) {
      setErr("Please upload a profile picture.");
      return;
    }

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const storageRef = ref(storage, `profilePictures/${displayName}`);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        (error) => {
          setErr("File upload failed, please try again.");
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              password,
              photoURL: downloadURL,
            });
            await setDoc(doc(db, "userChats", res.user.uid), {});
            navigate('/');
          });
        }
      );
    } catch (error) {
      setErr(error.message || "Something went wrong, try again!");
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrepper">
        <span className="logos">Awash Chat</span>
        <span className="wrapper-logo">Registration</span>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="name" required />
          <input type="email" placeholder="email" required />
          <input type="password" placeholder="password" required />
          <input type="file" id="file" required />
          <label htmlFor="file">
            <img src="/images.png" width={30} height={30} alt="" />
            <span>Profile</span>
          </label>
          <button>Sign Up</button>
          {err && <p>{err}</p>}
        </form>
        <p>
          Do you have an account? <a href="/Login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
