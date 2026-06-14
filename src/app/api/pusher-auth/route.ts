import { getCurrentUser } from "@/lib/auth"
import { pusherServer } from "@/lib/pusher";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const user = await getCurrentUser();

        if (!user?.id || !user.email) {
            return new Response('Unauthorized', { status: 401 })
        }

        const body = await request.formData();
        const socketId = body.get('socket_id') as string;
        const channel = body.get('channel_name') as string;

        if (channel.startsWith('presence-')) {
            const data = {
                user_id: user.id,
                user_info: {
                    name: user.name,
                    email: user.email
                }
            }

            const authResponse = pusherServer.authorizeChannel(socketId, channel, data);
            return NextResponse.json(authResponse);
        }

        const authResponse = pusherServer.authorizeChannel(socketId, channel);
        return NextResponse.json(authResponse);
    } catch (error) {
        console.log(error);
        return new Response('Something went wrong', { status: 500 })
    }
}