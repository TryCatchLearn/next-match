import MemberImage from "@/components/MemberImage";
import { getCurrentUser } from "@/lib/auth";
import { getMemberPhotosByUserId } from "@/server/actions/members";
import PhotoButtons from "./PhotoButtons";

export default async function PhotosPage(props: PageProps<"/members/[userId]/photos">) {
  const { userId } = await props.params;
  const photos = await getMemberPhotosByUserId(userId);
  const currentUser = await getCurrentUser();
  const isOwner = currentUser?.id === userId;

  return (
    <div className="grid grid-cols-5 gap-3 p-5">
      {photos?.map(photo => (
        <div key={photo.id} className="relative">
          <MemberImage photo={photo} />
          {isOwner && (
            <PhotoButtons photo={photo} user={currentUser} />
          )}
        </div>
      ))}
    </div>
  )
}