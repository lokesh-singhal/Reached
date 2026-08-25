"use client";

import { useEffect, useMemo, useState } from "react";
import { Star, ChevronDown, SlidersHorizontal, UserRound } from "lucide-react";
import StatCard from "@/app/components/StatCard";
import FilterButton from "@/app/components/FilterButton";
import ReviewCard from "@/app/components/ReviewCard";
import { endOfMonth, isWithinInterval, startOfMonth } from "date-fns";

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


export default function HostReviewsPage() {
    const [ratingFilter, setRatingFilter] = useState<number | null>(null);
    const [listingFilter, setListingFilter] = useState("All properties");
    const [reviews, setReviews] = useState<Review[]>([]);

    useEffect(() => {
        const getReviews = async () => {
            const res = await fetch("/api/review/host");
            const data = await res.json();
            console.log(data);
            setReviews(data);
        }

        getReviews();
    }, [])

    const ratingCounts = {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
    };

    if (reviews) {
        for (const review of reviews) {
            if (review.rating >= 1 && review.rating <= 5) {
                ratingCounts[review.rating as 1 | 2 | 3 | 4 | 5] += 1;
            }
        }
    }
    const totalReviews = reviews && reviews.length;
    const now = new Date();
    const reviewThisMonth = reviews && reviews.filter((review) => 
        isWithinInterval(new Date(review.createdAt), {
            start: startOfMonth(now),
            end: endOfMonth(now)
        })
    ).length;
    const averageRating = totalReviews > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews : 0;

    const listings = [
        "All properties",
        ...Array.from(new Set(reviews.map((review) => review.listing.title))),
    ];

    const filteredReviews = useMemo(() => {
        return reviews.filter((review) => {
            const ratingMatch =
                ratingFilter === null || review.rating === ratingFilter;

            const listingMatch =
                listingFilter === "All properties" ||
                review.listing.title === listingFilter;

            return ratingMatch && listingMatch;
        });
    }, [reviews, ratingFilter, listingFilter]);

    return (
        <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl space-y-6">

                <div>
                    <h1 className="text-3xl font-semibold tracking-tight">
                        Reviews
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        See what guests think about your properties.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

                    <StatCard
                        title="Overall Rating"
                        value={averageRating.toString()}
                        icon={<Star className="h-5 w-5 fill-current" />}
                    />

                    <StatCard
                        title="Total Reviews"
                        value={totalReviews.toString()}
                    />

                    <StatCard
                        title="Reviews This Month"
                        value={reviewThisMonth.toString()}
                    />

                    <StatCard
                        title="5-Star Reviews"
                        value={ratingCounts[5].toString()}
                    />

                </div>

                <div className="grid min-w-0 gap-6 lg:grid-cols-2">

                    <div className="rounded-xl border bg-background sm:p-6 p-2">

                        <h2 className="text-lg font-semibold">
                            Rating breakdown
                        </h2>

                        <div className="mt-6 space-y-4">

                            {[5, 4, 3, 2, 1].map((rating) => {
                                const count =
                                    ratingCounts[rating as keyof typeof ratingCounts];

                                const percentage = (count / totalReviews) * 100;

                                return (
                                    <div
                                        key={rating}
                                        className="flex items-center gap-3"
                                    >
                                        <span className="sm:w-6 w-2 text-sm font-medium">
                                            {rating}
                                        </span>

                                        <Star className="h-4 w-4 sm:w-2 fill-current" />

                                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                                            <div
                                                className="h-full rounded-full bg-foreground"
                                                style={{
                                                    width: `${percentage}%`,
                                                }}
                                            />
                                        </div>

                                        <span className="sm:w-8 w-6 text-right text-sm text-muted-foreground">
                                            {count}
                                        </span>
                                    </div>
                                );
                            })}

                        </div>
                    </div>

                    <div className="rounded-xl min-w-0 border bg-background sm:p-6 p-2">

                        <h2 className="text-lg font-semibold">
                            Rating overview
                        </h2>

                        <div className="mt-6 min-w-0 flex sm:flex-row flex-col gap-3 items-center sm:gap-8">

                            <div className="text-center shrink-0">
                                <p className="text-5xl font-semibold">
                                    {averageRating}
                                </p>

                                <div className="mt-2 flex justify-center">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className="h-4 w-4 fill-current"
                                        />
                                    ))}
                                </div>

                                <p className="mt-2 whitespace-nowrap text-sm text-muted-foreground">
                                    {totalReviews} reviews
                                </p>
                            </div>

                            <div className="h-24 max-sm:hidden shrink-0 w-px bg-border" />

                            <div className="space-y-3 w-full min-w-0 mt-3 text-sm">

                                <div className="flex min-w-0 justify-between gap-8">
                                    <span className="text-muted-foreground truncate">
                                        5-star ratings
                                    </span>
                                    <span className="font-medium">
                                        {Number(((ratingCounts[5] / totalReviews) * 100).toFixed(1)) || 0}%
                                    </span>
                                </div>

                                <div className="flex justify-between gap-8">
                                    <span className="text-muted-foreground">
                                        4-star ratings
                                    </span>
                                    <span className="font-medium">
                                        {Number(((ratingCounts[4] / totalReviews) * 100).toFixed(1)) || 0}%
                                    </span>
                                </div>

                                <div className="flex justify-between gap-8">
                                    <span className="text-muted-foreground">
                                        3-star or lower
                                    </span>
                                    <span className="font-medium">
                                        {Number((((ratingCounts[3] + ratingCounts[2] + ratingCounts[1]) / totalReviews) * 100).toFixed(1)) || 0}%
                                    </span>
                                </div>

                            </div>

                        </div>
                    </div>

                </div>

                <div className="rounded-xl border bg-background">

                    <div className="border-b p-5">

                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                            <div>
                                <h2 className="text-lg font-semibold">
                                    Guest reviews
                                </h2>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    {filteredReviews.length} reviews
                                </p>
                            </div>

                            <div className="flex flex-col flex-wrap gap-2 min-w-0">

                                <div className="relative min-w-0 w-full sm:w-auto">

                                    <select
                                        value={listingFilter}
                                        onChange={(e) =>
                                            setListingFilter(e.target.value)
                                        }
                                        className="h-10 w-full max-w-full min-w-0 appearance-none rounded-lg border bg-background pl-3 sm:pr-9 text-sm outline-none focus:ring-2 focus:ring-ring"
                                    >
                                        {listings.map((listing) => (
                                            <option key={listing} value={listing}>
                                                {listing}
                                            </option>
                                        ))}
                                    </select>

                                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                                </div>

                            </div>

                        </div>

                        <div className="mt-5 flex gap-2 overflow-x-auto">

                            <FilterButton
                                active={ratingFilter === null}
                                onClick={() => setRatingFilter(null)}
                            >
                                All
                            </FilterButton>

                            {[5, 4, 3, 2, 1].map((rating) => (
                                <FilterButton
                                    key={rating}
                                    active={ratingFilter === rating}
                                    onClick={() => setRatingFilter(rating)}
                                >
                                    <Star className="h-3.5 w-3.5 fill-current" />
                                    {rating}
                                </FilterButton>
                            ))}

                        </div>
                    </div>

                    <div className="divide-y">

                        {filteredReviews.length > 0 ? (
                            filteredReviews.map((review) => (
                                <ReviewCard
                                    key={review.id}
                                    review={review}
                                />
                            ))
                        ) : (
                            <div className="flex min-h-60 items-center justify-center p-6 text-sm text-muted-foreground">
                                No reviews found.
                            </div>
                        )}

                    </div>

                </div>

            </div>
        </div>
    );
}
