import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import AuthContextProvider from "./context/AuthContextProvider.jsx";
import { SocketContextProvider } from "./context/SocketContextProvider.jsx";
import { ChatContextProvider } from "./context/ChatContextProvider.jsx";
import TabSwitchContextProvider from "./context/TabSwitchContextProvider.jsx";
import { ThemeProvider } from "./context/ThemeProvider.jsx";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
    <ThemeProvider>
      <AuthContextProvider>
        <ChatContextProvider>
          <SocketContextProvider>
            <TabSwitchContextProvider>
              <App />
            </TabSwitchContextProvider>
          </SocketContextProvider>
        </ChatContextProvider>
      </AuthContextProvider>
    </ThemeProvider>
  // </StrictMode>
);
