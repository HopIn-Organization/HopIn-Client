import { PropsWithChildren, useEffect, useState } from "react";
import { SplashScreen } from "@/ui/SplashScreen";

const SPLASH_DURATION_MS = 2100;

export function SplashGate({ children }: PropsWithChildren) {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), SPLASH_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return children;
}
