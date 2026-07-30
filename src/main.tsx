import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppRouter } from "@/app/router";
import { AppProviders } from "@/app/providers";
import { SplashGate } from "@/app/SplashGate";
import "@/index.css";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <SplashGate>
        <AppRouter />
      </SplashGate>
    </AppProviders>
  </StrictMode>,
);
