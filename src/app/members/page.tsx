import Link from "next/link";

export default function MembersPage() {
  return (
    <div>
        <h3 className="text-2xl">This will be a members page</h3>
        <Link href='/'>
            Go back home
        </Link>
    </div>
  )
}