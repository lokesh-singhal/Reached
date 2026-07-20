import { Star, MessageSquareText, X } from 'lucide-react';
import { useEffect, useState } from "react";
import { json } from 'zod';


type Inputs = {
    example: string
    exampleRequired: string
    comment: string
}


export default function Review({ reviewBooking, setReviewBooking, setComplete }: { reviewBooking: any, setReviewBooking:any, setComplete:any}) {
    const [hover, setHover] = useState(0);
    const [rating, setRating] = useState(0);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        }
    }, [])


    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const comment = formData.get("comment");
        const res = await fetch("/api/review", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                comment,
                rating,
                listingId: reviewBooking.listingId,
                bookingId: reviewBooking.bookingId,
            })
        })

        const result = await res.json();
        if(result.status == 200){
            setReviewBooking(null);
            setComplete((prev:any) => 
                prev.map((booking:any) =>
                booking._id === reviewBooking.bookingId
                ? {...booking, isReviewed: true}
                :booking
                )
            );
        }
    }

    return (
        <div className="w-full p-4 sm:p-6 overflow-y-auto max-h-[90vh]">
            <img onClick={() => setReviewBooking(null)} className='absolute w-8 h-8 sm:w-10 sm:h-10 cursor-pointer right-4 top-4 sm:right-6 sm:top-6 bg-gray-300 rounded-full' src="cross.svg" alt="" />
            <form onSubmit={handleSubmit} className='mt-6' action="">
                <div className="w-full flex flex-col gap-6 items-center">
                    <MessageSquareText strokeWidth={1} className="w-20 h-20 sm:w-28 sm:h-28 lg:w-40 lg:h-40 fill-yellow-400" />
                    <div className='flex flex-col items-center text-center max-w-xl'>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">Submit Your Feedback</h1>
                        <p className='text-center'>Your feedback helps future guests make informed decisions and helps hosts create even better experiences.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className='flex flex-wrap justify-center gap-2 sm:gap-3'>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    type="button"
                                    className="p-2 sm:p-3 rounded-xl bg-gray-200"
                                    onMouseEnter={() => setHover(star)}
                                    onMouseLeave={() => setHover(0)}
                                    onClick={() => setRating(star)}
                                >
                                    <Star
                                        className={`h-7 w-7 stroke-3 transition-colors ${star <= (hover || rating)
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-gray-300"

                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                    <textarea maxLength={600} placeholder='Your Message...(600 words)' className='sm:min-h-40 min-h-32 w-full rounded-2xl p-3 bg-gray-200 resize-none focus:outline-none focus:ring-1 focus:ring-black' name="comment" id=""></textarea>
                    <button className='w-full cursor-pointer bg-green-400 rounded-2xl sm:p-4 p-3 text-lg sm:text-xl font-semibold text-white' type='submit'>SEND FEEDBACK</button>
                </div>
            </form>
        </div>
    )
}

