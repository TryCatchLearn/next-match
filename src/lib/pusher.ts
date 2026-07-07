import PusherServer from 'pusher';

declare global {
    var pusherServerInstance: PusherServer | undefined;
}

if (!global.pusherServerInstance) {
    global.pusherServerInstance = new PusherServer({
        appId: process.env.PUSHER_APP_ID!,
        key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
        secret: process.env.PUSHER_SECRET!,
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
        useTLS: true
    })
}

export const pusherServer = global.pusherServerInstance;