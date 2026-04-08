import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import { ModeProvider } from "./app/contexts/ModeContext.tsx";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <ModeProvider>
    <App />
  </ModeProvider>
);
