import Lottie from "lottie-react";
import loadingAnimation from "@/assets/lottie/loading.json";

export function SplashScreen() {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-surface">
      <Lottie animationData={loadingAnimation} loop={true} />
    </div>
  );
}
