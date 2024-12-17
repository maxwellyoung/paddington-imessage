import { ChatForm } from "@/components/chat-form";

export default function ChatPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f2f2f7] dark:bg-black">
      <main className="flex-1 bg-white dark:bg-[#000000]">
        <ChatForm />
      </main>
    </div>
  );
}
