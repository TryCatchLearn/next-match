import Link from "next/link";
import { Member } from "../../../generated/prisma/client";
import { Card, CardFooter } from "@heroui/react";
import Image from "next/image";
import { calculateAge } from "@/lib/util";

type Props = {
    member: Member;
}

export default function MemberCard({member}: Props) {
  return (
    <Link href={`/members/${member.userId}`}>
        <Card className="p-0 transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <Image 
                alt={member.name}
                width={500}
                height={500}
                loading="eager"
                sizes="(max-width: 768px) 100vw, 33vw"
                src={member?.image || '/images/user.png'}
                className="aspect-square object-cover relative"
            />
            <CardFooter className="flex w-full z-10 justify-start absolute bottom-0 overflow-hidden bg-linear-to-t from-black">
                <div className="flex flex-col text-white p-2">
                    <span className="font-semibold">{member.name}, {calculateAge(member.dateOfBirth)}</span>
                    <span className="text-sm">{member.city}</span>
                </div>
            </CardFooter>
        </Card>
    </Link>
  )
}