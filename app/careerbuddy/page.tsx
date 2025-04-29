import Chatbox from "@/components/Chatbox";
import Sidebar from "@/components/Sidebar";

export default function CareerBuddyPage() {
  return (
    <div className="flex min-h-screen w-full bg-gray-900">
      {/* Sidebar komponen akan menangani positioning dan toggle */}
      <Sidebar />

      {/* Main content mengisi seluruh layar */}
      <main className="flex-1 min-h-screen w-full">
        <Chatbox />
      </main>
    </div>
  );
}
