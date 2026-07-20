'use client'
import { Star, UserRound } from "lucide-react";
import { useEffect } from "react";

export default function AllReviews({ allReviews, setShowAllReview, averageRating }: { allReviews: any, setShowAllReview: React.Dispatch<React.SetStateAction<boolean>>, averageRating: number }) {
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        }
    }, [])

    if(allReviews.length === 0){
        return (
            <div className="relative max-h-screen md:max-h-[80vh] flex flex-col w-full pt-15 p-3 text-3xl">
                No reviews to Show
            </div>
        )
    }
    return (
        <div>
            <div className="relative max-h-screen md:max-h-[80vh] flex flex-col w-full pt-15 p-3 ">
                <img onClick={() => setShowAllReview(false)} className="h-8 w-8 absolute cursor-pointer top-6 right-6" src="/cross.svg" alt="" />
                <div className="flex items-center gap-1">
                    <Star className="fill-black" />
                    <h1 className="text-5xl font-bold">{averageRating}</h1>
                </div>
                <div className="mt-8 mb-4">
                    <h1 className="text-2xl">{allReviews.length} review{allReviews.length > 1 ? "s": ""}</h1>
                </div>
                <div className="overflow-y-auto">
                    {allReviews.map((item:any) => (
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <UserRound size={40} className="w-10 h-10 bg-gray-300 rounded-full" />
                                <span className="text-xl">{item.reviewerId.name}</span>
                            </div>
                            <div className="flex items-center">
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star size={15} className={`${star <= item.rating ? "fill-yellow-300" : ""}`}/>
                                    ))}
                                </div>
                                <span className="mx-1">●</span>
                                <span>{item.createdAt.split("T")[0]}</span>
                            </div>
                            <div>
                                {item.comment}
                            </div>
                            <div className="w-full h-px bg-gray-300 mb-3"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}