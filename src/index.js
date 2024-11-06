import { StrictMode } from "react";
import "./index.scss";
import App from "./App.jsx"; // Keep this import
import { AuthContextProvider } from "./context/AuthContext.js";
import { ChatContextProvider } from "./context/ChatsContext.js";

import React from "react";
import ReactDOM from "react-dom/client";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthContextProvider>
    <ChatContextProvider>
      <StrictMode>
        <App />
      </StrictMode>
    </ChatContextProvider>
  </AuthContextProvider>
);
