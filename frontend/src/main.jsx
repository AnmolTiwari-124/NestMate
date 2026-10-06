import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./index.css";

import AuthProvider from "./context/AuthContext";
import MessageNotificationsProvider from "./context/MessageNotificationsContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <MessageNotificationsProvider>
        <App />
      </MessageNotificationsProvider>
    </AuthProvider>
  </BrowserRouter>
);
