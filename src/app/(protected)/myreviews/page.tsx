'use client'
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import EditReview from "../../components/EditReview";
import { authClient } from "@/lib/auth-client";

interface ReviewType {
    listingId: {
        houseImageUrl: string[],
        description: string,
        title: string,
        _id: string
    },
    bookingId: {
        checkIn: string,
        checkOut: string
    },
    rating: number,
    comment: string,
    _id: string
}

export default function MyReviews() {
    const router = useRouter();
    const {data: session} = authClient.useSession();
    const [myReviews, setMyReviews] = useState<ReviewType[]>([]);
    const [showEdit, setShowEdit] = useState(false);
    const [comment, setComment] = useState<string>();
    const [reviewId, setReviewId] = useState<string>();
    const [rating, setRating] = useState<number>();


    if(!session){
        redirect("/sign-in")
    }
    const gatherReviews = async () => {
        const res = await fetch("/api/review/user");
        if (!res.ok) {
            return;
        }

        const data = await res.json();
        setMyReviews(data);
    }
    useEffect(() => {
        gatherReviews();
    }, [])

    const handleDelete = async(id: string) => {
        try {
            const result = confirm("Are you sure you want to delete the review");
            if(!result){
                return;
            }

            const res = await fetch("/api/review", {
                method: "DELETE",
                headers:{
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    reviewId: id,
                })
            })

            const data = await res.json();
            gatherReviews();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="relative">
            <div className="lg:mx-30 lg:px-10 pt-10 mx-4">
                <div className="text-3xl font-bold">Reviews</div>
                <div>
                    <div className="flex text-[18px] gap-8 items-center mt-10">
                        <span className={`relative cursor-pointer font-semibold after:absolute after:bottom-0 after:left-0 after:h-px after:content-[''] after:w-full after:bg-black`}>My Reviews</span>
                    </div>
                    <div className="bg-gray-300 h-px w-full shadow-2xl shadow-black"></div>
                </div>
                {myReviews.length !== 0 ? (
                    myReviews.map((items) => (
                        <div className="md:min-h-72 md:flex-row w-full rounded-2xl overflow-hidden shadow-2xl bg-gray-50 my-5 flex flex-col-reverse">
                            <div className="md:w-[60%] p-5 flex flex-col justify-between">
                                <div >
                                    <h1 className="text-2xl font-semibold">{items.listingId.title}</h1>
                                    <div className='text-xl'>{items.bookingId.checkIn.split("T")[0]}-{items.bookingId.checkOut.split("T")[0]}</div>
                                    <div className='flex'>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star width={20} className={star <= items.rating ? "fill-yellow-400" : ""} />
                                        ))}
                                    </div>
                                    <p>{items.comment}</p>
                                </div>
                                <div className="gap-5 max-md:mt-2 flex font-semibold">
                                    <button onClick={() => router.push(`rooms/${items.listingId._id}`)} className="cursor-pointer hover:underline">Book again</button>
                                    <button onClick={() => { setComment(items.comment); setRating(items.rating); setReviewId(items._id); setShowEdit(true) }} className="cursor-pointer hover:underline">Edit</button>
                                    <button onClick={() => handleDelete(items._id)} className="cursor-pointer hover:underline">Delete</button>
                                </div>
                            </div>
                            <div className="md:w-[40%] h-full relative">
                                <img className="object-cover w-full h-full md:max-h-72 border border-white" src={items.listingId.houseImageUrl[0]} alt="" />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="mt-10 text-2xl">No reviews to show</div>
                )}
                <div>
                    {/* <ShowReservations setReviewBooking={setReviewBooking} line={line} upcoming={} complete={} /> */}
                </div>
            </div>
            {showEdit && <div className="fixed z-100 inset-0 bg-black/50 h-full" />}
            {showEdit && (
                <div className="z-100 fixed bg-gray-100 p-4 rounded-2xl overflow-y-auto
                                    top-2 bottom-2 left-2 right-2
                                    sm:left-6 sm:right-6
                                    md:left-12 md:right-12 md:top-8 md:bottom-8
                                    lg:w-1/2 lg:h-auto lg:top-1/2 lg:left-1/2 lg:right-auto lg:bottom-auto lg:-translate-x-1/2 lg:-translate-y-3/7">
                    <EditReview comment={comment!} rating={rating!} setShowEdit={setShowEdit} reviewId={reviewId!} onSuccess={gatherReviews} />
                </div>
            )}
        </div>
    )
}