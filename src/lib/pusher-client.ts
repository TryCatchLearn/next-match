import PusherClient from 'pusher-js';

declare global {
    var pusherClientInstance: PusherClient | undefined;
}

export function getPusherClient(): PusherClient {
    if (!global.pusherClientInstance) {
        global.pusherClientInstance = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
            channelAuthorization: {
                endpoint: '/api/pusher-auth',
                transport: 'ajax'
            },
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!
        })
    }

    return global.pusherClientInstance;
}