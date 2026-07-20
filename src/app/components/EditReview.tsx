import { MessageSquareText, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function EditReview({ comment, rating, setShowEdit, reviewId, onSuccess }
    : { comment: string, rating: number, setShowEdit: React.Dispatch<React.SetStateAction<boolean>>, reviewId: string, onSuccess: () => Promise<void> }) {
    const [hover, setHover] = useState<number>();
    const [rcomment, setRcomment] = useState<string>(comment);
    const [rrating, setRrating] = useState<number>(rating);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        }
    }, [])

    const handleSubmit = async () => {
        try {
            const res = await fetch("/api/review", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    reviewId: reviewId,
                    comment: rcomment,
                    rating: rrating
                })
            })

            if (!res.ok) {
                toast.error(res.text);
                return;
            }
            onSuccess();
            setShowEdit(false);

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="sm:p-6 overflow-y-auto max-h-[90vh] w-full p-4">
            <img onClick={() => setShowEdit(false)} className='absolute w-8 h-8 sm:w-10 sm:h-10 cursor-pointer right-4 top-4 sm:right-6 sm:top-6 bg-gray-300 rounded-full' src="/cross.svg" alt="" />
            <div className='mt-6'>
                <div className="w-full flex flex-col gap-6 items-center">
                    <MessageSquareText strokeWidth={1} className="w-20 h-20 sm:w-28 sm:h-28 lg:w-40 lg:h-40 fill-yellow-400" />
                    <div className='flex flex-col items-center text-center max-w-xl'>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">Edit Your Feedback</h1>
                        <p className='text-center'>Your feedback helps future guests make informed decisions and helps hosts create even better experiences.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className='flex gap-3'>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    type="button"
                                    className="p-2 sm:p-3 rounded-xl bg-gray-200"
                                    onMouseEnter={() => setHover(star)}
                                    onMouseLeave={() => setHover(0)}
                                    onClick={() => setRrating(star)}
                                >
                                    <Star
                                        className={`h-7 w-7 stroke-3 transition-colors ${star <= (hover || rrating)
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-gray-300"

                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                    <textarea value={rcomment} onChange={(e) => setRcomment(e.target.value)} maxLength={600} placeholder='Your Message...(600 words)' className='sm:min-h-40 min-h-32 w-full rounded-2xl p-3 bg-gray-200 resize-none focus:outline-none focus:ring-1 focus:ring-black' name="comment" id=""></textarea>
                    <button onClick={handleSubmit} className='w-full cursor-pointer bg-green-400 rounded-2xl sm:p-4 p-3 text-lg sm:text-xl font-semibold text-white'>EDIT FEEDBACK</button>
                </div>
            </div>
        </div>
    )
}