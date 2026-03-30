// Test Commit
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@/i18n";
import "./index.css"; // ← ADD THIS — loads Tailwind + all styles
import "@styles/variables.css";
import "@styles/global.css";

import { LanguageProvider } from "@context/LanguageContext";
import { AppProvider } from "@context/AppContext";
import { UserProvider } from "@context/UserContext";
import { OrderProvider } from "@context/OrderContext";

import App from "./App";

const container = document.getElementById("root");

if (!container) {
  throw new Error(
    "[main.jsx] Root element #root not found. Check your index.html.",
  );
}

createRoot(container).render(
  <StrictMode>
    <LanguageProvider>
      <AppProvider>
        <UserProvider>
          <OrderProvider>
            <App />
          </OrderProvider>
        </UserProvider>
      </AppProvider>
    </LanguageProvider>
  </StrictMode>,
);
