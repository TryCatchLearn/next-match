import { getMessageThread } from "@/server/actions/messages";
import { getCurrentUser } from "@/lib/auth";
import MessageList from "./MessageList";
import { unauthorized } from "next/navigation";
import { createChatId } from "@/lib/util";

export default async function ChatPage(props: PageProps<"/members/[userId]/chat">) {
  const {userId} = await props.params;
  const {messages, readCount} = await getMessageThread(userId);
  const currentUser = await getCurrentUser();

  if (!currentUser) return unauthorized();

  const chatId = createChatId(userId, currentUser.id)

  return (
    <div className="flex flex-col h-full">
      <MessageList 
        initialMessages={messages}
        currentUser={currentUser}
        chatId={chatId}
        readCount={readCount}
      />
    </div>
  )
}