import { requireAuthUser } from "@/lib/auth";
import { cloudinary } from "@/lib/cloudinary";

export async function POST(request: Request) {
    await requireAuthUser();

    const {paramsToSign} = await request.json();

    const signature = cloudinary.v2.utils.api_sign_request(paramsToSign, 
        process.env.CLOUDINARY_API_SECRET as string);

    return Response.json({signature});
}