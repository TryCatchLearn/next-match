import { Card, Separator } from "@heroui/react";
import { buttonVariants } from "@heroui/styles";
import Link from "next/link";
import SectionTitle from "./SectionTitle";
import MessageNav from "./MessageNav";

export default function Layout(props: LayoutProps<"/messages">) {
    return (
        <div className="grid grid-cols-12 gap-5 h-[80vh]">
            <div className="col-span-3">
                <Card className="w-full mt-6 items-center h-[80vh]">
                    <Card.Content>
                        <MessageNav />
                    </Card.Content>
                    <Card.Footer className="w-full">
                        <Link href='/members' className={buttonVariants({ variant: 'primary', className: 'w-full' })}>
                            Go back
                        </Link>
                    </Card.Footer>
                </Card>
            </div>
            <div className="col-span-9">
                <Card className="w-full mt-6 h-[80vh]">
                    <Card.Header>
                        <SectionTitle />
                    </Card.Header>
                    <Separator />
                    <Card.Content className="overflow-y-auto">
                        {props.children}
                    </Card.Content>
                </Card>
            </div>
        </div>
    )
}