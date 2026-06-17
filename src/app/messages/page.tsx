import { getMessagesByContainer } from "@/server/actions/messages";
import MessageTable from "./MessageTable";

export default async function MessagesPage(props: PageProps<"/messages">) {
  const {container} = await props.searchParams;
  const containerValue = (container as string) ?? 'inbox';

  const {messages, nextCursor} = await getMessagesByContainer(container as string);

  return (
    <MessageTable 
      key={containerValue} 
      initialMessages={messages ?? []} 
      container={containerValue}
      initNextCursor={nextCursor} 
    />
  )
}