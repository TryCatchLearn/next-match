import { requireAdminUser } from "@/lib/auth"
import { getPendingPhotos } from "@/server/actions/admin";
import ModerationCard from "./ModerationCard";

export default async function page() {
    await requireAdminUser();
    const photos = await getPendingPhotos();
    
    return (
        <div className="container mx-auto mt-16">
            <h2 className="text-2xl font-bold mb-6">
                Photo Moderation
                <span className="ml-2 text-lg text-muted font-normal">
                    ({photos.length} pending)
                </span>
            </h2>
            {photos.length === 0 ? (
                <p className="text-muted">No photos awaiting moderation</p>
            ) : (
                <div className="grid grid-cols-6 gap-4">
                    {photos.map(photo => (
                        <ModerationCard key={photo.id} photo={photo} />
                    ))}
                </div>
            )}
        </div>
    )
}