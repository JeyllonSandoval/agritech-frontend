"use client";
import PlaygroundLayout from "@/components/features/layouts/playgroundLayout";

export default function PlaygroundRouteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-h-screen">
      <PlaygroundLayout>
        {children}
      </PlaygroundLayout>
    </div>
  );
}
