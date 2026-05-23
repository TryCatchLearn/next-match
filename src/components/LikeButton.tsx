'use client';

import { toggleLikeMember } from "@/server/actions/likes";
import { useTransition } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { PiSpinnerGap } from "react-icons/pi";

type Props = {
    targetUserId: string;
    hasLiked?: boolean;
}

export default function LikeButton({ targetUserId, hasLiked }: Props) {
    const [isPending, startTransition] = useTransition();

    const toggleLike = () => {
        startTransition(async () => {
            await toggleLikeMember(targetUserId, hasLiked);
        })
    }

    return (
        <div onClick={e => {
            e.preventDefault();
            toggleLike();
        }} className="relative hover:opacity-70 transition cursor-pointer">
            {!isPending ? (
                <>
                    <AiOutlineHeart size={28} className="fill-white absolute -top-0.5 -right-0.5" />
                    <AiFillHeart size={24} className={hasLiked ? 'fill-rose-500' : 'fill-neutral-500/70'} />
                </>
            ) : (
                <PiSpinnerGap size={32} className="fill-white animate-spin" />
            )}
        </div>
    )
}