import { Button } from "@heroui/react";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl">Hello app!</h1>
      <Button>
        <Link href='/members'>
          Go to members
        </Link>

      </Button>
    </div>
  );
}
