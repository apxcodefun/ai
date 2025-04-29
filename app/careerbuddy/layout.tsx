import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buddy AI - Career Assistant",
  description: "AI Career Consultant",
};

export default function CareerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex min-h-screen">{children}</div>;
}
