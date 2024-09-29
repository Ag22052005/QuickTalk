import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import AuthContextProvider from "./context/AuthContext.jsx";
import { SocketContextProvider } from "./context/SocketContextProvider.jsx";
import { ChatContextProvider } from "./context/ChatContextProvider.jsx";
import TabSwitchContextProvider from "./context/TabSwitchContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthContextProvider>
      <ChatContextProvider>
        <SocketContextProvider>
          <TabSwitchContextProvider>
            <App />
          </TabSwitchContextProvider>
        </SocketContextProvider>
      </ChatContextProvider>
    </AuthContextProvider>
  </StrictMode>
);
