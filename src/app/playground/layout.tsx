"use client";
import PlaygroundLayout from "@/components/features/layouts/playgroundLayout";

export default function PlaygroundRouteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950/90 via-black to-green-950/90">
      <PlaygroundLayout>
        {children}
      </PlaygroundLayout>
    </div>
  );
}
