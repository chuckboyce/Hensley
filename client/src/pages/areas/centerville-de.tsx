import { useEffect } from "react";

export default function CentrevilleDe() {
  useEffect(() => {
    window.location.href = "/areas/centreville-de";
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting...</h1>
        <p className="text-muted-foreground">Moving to the correct spelling: Centreville, DE</p>
      </div>
    </div>
  );
}
