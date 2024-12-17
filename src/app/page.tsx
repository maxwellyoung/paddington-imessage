import { ConversationsList } from "@/components/conversations-list";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f2f2f7] dark:bg-black">
      <ConversationsList />
    </div>
  );
}
