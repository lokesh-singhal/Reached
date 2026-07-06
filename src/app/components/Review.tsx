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
        <div className="w-full p-6">
            <img onClick={() => setReviewBooking(null)} className='absolute w-10 cursor-pointer right-6 top-6 bg-gray-300 rounded-full' src="cross.svg" alt="" />
            <form onSubmit={handleSubmit} className='mt-6' action="">
                <div className="w-full flex flex-col gap-6 items-center">
                    <MessageSquareText strokeWidth={1} className="w-40 h-40 fill-yellow-400" />
                    <div className='flex flex-col items-center justify-center w-1/2'>
                        <h1 className="text-4xl font-semibold">Submit Your Feedback</h1>
                        <p className='text-center'>Your feedback helps future guests make informed decisions and helps hosts create even better experiences.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className='flex gap-3'>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    type="button"
                                    className="border-0 p-3 rounded-xl bg-gray-200"
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
                    <textarea maxLength={600} placeholder='Your Message...(600 words)' className='h-40 rounded-2xl p-2 bg-gray-200 w-full focus:outline-none focus:ring-1 focus:ring-black' name="comment" id=""></textarea>
                    <button className='w-full cursor-pointer bg-green-400 rounded-2xl p-4 text-xl font-semibold text-white' type='submit'>SEND FEEDBACK</button>
                </div>
            </form>
        </div>
    )
}

