import React, { useState } from "react";
import { auth } from "../firebase.config";
import { signInWithEmailAndPassword } from "firebase/auth";
import "./Index.scss";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const [err, setErr] = useState(null);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      setErr(error.message || "Something went wrong, try again!");
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrepper">
        <span className="logos">Awash Chat</span>
        <span className="wrapper-logo"> Login</span>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="email" />
          <input type="password" placeholder="pasword" />

          <button>Log in</button>
          {err && <p>{err}</p>}
        </form>
        <p>
          Do you have an account ? <a href="/register">register</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
