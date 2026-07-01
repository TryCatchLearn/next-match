import { buttonVariants } from "@heroui/react";
import Link from "next/link";
import { GiMatchTip } from "react-icons/gi";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-6rem)]">
      <section className="flex flex-col items-center text-center gap-6 max-w-2xl">
        <GiMatchTip size={150} className="text-accent" />
        <h1 className="text-5xl font-bold">
          Welcome to {" "}
          <span className="text-accent">
            NextMatch
          </span>
        </h1>

        <p className="text-muted text-xl">
          A demo app built with next.js.  Browse members, send likes and chat in real time
        </p>

        <div className="flex gap-4 justify-center">
          <Link href='/members' className={buttonVariants({variant: 'primary', size: 'lg'})}>
            Get started
          </Link>
          <Link href='/members' className={buttonVariants({variant: 'secondary', size: 'lg'})}>
            Browse members
          </Link>
        </div>
      </section>
    </div>
  );
}
