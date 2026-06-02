import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { PiSpinner } from "react-icons/pi";

type Props = {
    selected: boolean;
    loading: boolean;
}

export default function StarButton({selected, loading}: Props) {
  return (
    <div className="relative hover:opacity-80 transition cursor-pointer">
        {!loading ? (
            <>
                <AiOutlineStar size={32} className="fill-white absolute -top-0.5 -right-0.5" />
                <AiFillStar size={28} className={selected ? 'fill-yellow-200' : 'fill-neutral-500/70'} />
            </>
        ) : (
            <PiSpinner size={32} className="fill-white animate-spin" />
        )}
    </div>
  )
}