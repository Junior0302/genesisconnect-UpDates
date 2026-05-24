"use client";

import dynamic from "next/dynamic";

const Scene = dynamic(() => import("./Scene"), {
  ssr: false,
  loading: () => <div className="fixed inset-0 z-[-1] bg-[#2A1C15]" />,
});

export default function SceneWrapper() {
  return <Scene />;
}
