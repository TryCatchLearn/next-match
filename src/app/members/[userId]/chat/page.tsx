import { getMessageThread } from "@/server/actions/messages";
import ChatForm from "./ChatForm";
import MessageBox from "./MessageBox";
import { getCurrentUser } from "@/lib/auth";

export default async function ChatPage(props: PageProps<"/members/[userId]/chat">) {
  const {userId} = await props.params;
  const messages = await getMessageThread(userId);
  const currentUser = await getCurrentUser();

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        {messages?.length === 0 ? (
          <p>No messages yet.  Start the conversation</p>
        ) : (
          <>
            {messages?.map(message => (
              <MessageBox 
                key={message.id}
                message={message}
                currentUserId={currentUser?.id}
              />
            ))}
          </>
        )}
      </div>
      <ChatForm />
    </div>
  )
}