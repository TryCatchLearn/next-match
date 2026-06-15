'use client';

import { chatSchema, ChatSchema } from "@/lib/schemas/chatSchema"
import { createMessage } from "@/server/actions/messages";
import { Button, InputGroup, toast } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useParams } from "next/navigation";
import { ChangeEvent } from "react";
import { useForm } from "react-hook-form"
import { HiPaperAirplane } from "react-icons/hi2";

type Props = {
    triggerTyping: () => void;
}

export default function ChatForm({triggerTyping}: Props) {
    const params = useParams<{userId: string}>();
    const {register, handleSubmit, resetField, formState: {isValid, isSubmitting}} = useForm<ChatSchema>({
        resolver: zodResolver(chatSchema)
    });

    const onSubmit = async (data: ChatSchema) => {
        const result = await createMessage(params.userId, data);
        if (result.status === 'error') toast.danger(result.error as string);
        else {
            resetField('text');
        }
    }

    const {onChange, ...registerProps} = register('text');

    const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
        await onChange(e);
        triggerTyping();
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full items-center gap-2 flex flex-col">
            <InputGroup variant="secondary" className='w-full py-2 focus-within:ring-0'>
                <InputGroup.Input 
                    aria-label="chat input"
                    placeholder="Enter your message"
                    className='w-full'
                    {...registerProps}
                    onChange={handleChange}
                />
                <InputGroup.Suffix>
                    <Button
                        isIconOnly
                        type="submit"
                        isPending={isSubmitting}
                        isDisabled={!isValid}
                        className='rounded-full'
                    >
                        <HiPaperAirplane size={18} />
                    </Button>
                </InputGroup.Suffix>
            </InputGroup>
        </form>
    )
}