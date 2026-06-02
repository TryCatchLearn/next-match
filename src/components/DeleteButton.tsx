import { AiFillDelete, AiOutlineDelete } from "react-icons/ai";
import { PiSpinner } from "react-icons/pi";

type Props = {
    loading: boolean;
    disabled: boolean;
}

export default function DeleteButton({ loading, disabled }: Props) {
    if (disabled) return null;
    return (
        <div className="relative hover:opacity-80 transition cursor-pointer">
            {!loading ? (
                <>
                    <AiOutlineDelete size={32} className="fill-white absolute -top-0.5 -right-0.5" />
                    <AiFillDelete size={28} className='fill-red-600' />
                </>
            ) : (
                <PiSpinner size={32} className="fill-white animate-spin" />
            )}
        </div>
    )
}