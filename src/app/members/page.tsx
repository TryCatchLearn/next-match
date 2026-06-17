import { getMembers } from "@/server/actions/members";
import MemberCard from "./MemberCard";
import { fetchCurrentUserLikeIds } from "@/server/actions/likes";
import Filters from "./Filters";
import { UserFilters } from "@/lib/types";
import EmptyState from "./EmptyState";
import MembersPagination from "./MembersPagination";

export default async function MembersPage({ searchParams }: { searchParams: Promise<UserFilters> }) {
  const params = await searchParams;
  const {items: members, totalCount} = await getMembers(params);
  const likeIds = await fetchCurrentUserLikeIds();

  return (
    <>
      {!members || members.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex flex-col flex-1 h-screen -mt-24">
          <Filters totalCount={totalCount} />
          <div className="p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {members && members.map(member => (
              <MemberCard key={member.id} member={member} likeIds={likeIds} />
            ))}
          </div>
          <MembersPagination 
            totalCount={totalCount}
          />
        </div>
      )}

    </>
  )
}