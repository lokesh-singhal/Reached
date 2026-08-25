import { Star, UserRound } from "lucide-react";


type Review = {
    id: string;
    user: {
        name: string,
    }
    listing: {
        title: string,
        _id: string
    }
    rating: number;
    comment: string;
    updatedAt: string;
    createdAt: string;
    booking: {
        checkIn: string;
        checkOut: string;
    }
};


export default function ReviewCard({
    review,
}: {
    review: Review;
}) {
    return (
        <div className="p-5 md:p-6">

            <div className="flex gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-muted">
                    <UserRound className="h-5 w-5 text-muted-foreground" />
                </div>

                <div className="min-w-0 flex-1">

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">

                        <div>
                            <h3 className="font-medium">
                                {review.user.name}
                            </h3>

                            <p className="mt-1 text-sm text-muted-foreground">
                                {review.booking.checkIn.split("T")[0]} – {review.booking.checkOut.split("T")[0]}
                            </p>
                        </div>

                        <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="text-sm font-medium">
                                {review.rating}.0
                            </span>
                        </div>

                    </div>

                    <p className="mt-4 text-sm font-medium">
                        {review.listing.title}
                    </p>

                    <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                        {review.comment}
                    </p>

                    <p className="mt-4 text-xs text-muted-foreground">
                        Reviewed on {review.updatedAt.split("T")[0]}
                    </p>

                </div>

            </div>

        </div>
    );
}