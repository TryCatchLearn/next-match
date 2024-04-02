import { auth } from '@/auth';
import { pusherServer } from '@/lib/pusher';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return new Response('Unauthorised', {status: 401})
        }

        const body = await request.formData();

        const socketId = body.get('socket_id') as string;
        const channel = body.get('channel_name') as string;
        const data = {
            user_id: session.user.id
        }

        const authResonse = pusherServer.authorizeChannel(socketId, channel, data);

        return NextResponse.json(authResonse);
    } catch (error) {
        
    }
}