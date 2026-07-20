import NoReservations from './NoReservations';

export default function ShowReservations({ line, upcoming, complete, setReviewBooking }: { line: string, upcoming: any, complete: any, setReviewBooking:any }) {

    return (
        <>
            {line == "upcoming" && (
                upcoming.length > 0 ? (
                    upcoming.map((items: any) => {
                        return (
                            <div className="md:h-72 md:flex-row w-full rounded-2xl overflow-hidden shadow-2xl bg-gray-50 my-5 flex flex-col-reverse">
                                <div className="md:w-[60%] p-5">
                                    <h1 className="text-2xl font-semibold">{items.listing.title}</h1>
                                    <p>{new Date(items.checkIn).toLocaleDateString("en-US", {month:"short", day:"numeric"})} - 
                                        {new Date(items.checkOut).toLocaleDateString("en-US", {month:"short", day:"numeric"})}</p>
                                    <div className="mt-6">
                                        <h3>Hosted by {items.user.name}</h3>
                                        <p>{items.listing.address}, {items.listing.state}</p>
                                        <p>{items.listing.state}</p>
                                    </div>
                                </div>
                                <div className="md:w-[40%] h-full relative">
                                    <img className="object-cover w-full h-full border border-white" src={items.listing.houseImageUrl[0]} alt="" />
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <NoReservations />
                )
            )
            }
            {line == "complete" && (
                complete.length > 0 ? (
                    complete.map((items: any) => {
                        return (
                            <div className="md:h-72 md:flex-row w-full rounded-2xl overflow-hidden shadow-2xl bg-gray-50 my-5 flex flex-col-reverse">
                                <div className="md:w-[60%] p-5">
                                    <h1 className="text-2xl font-semibold">{items.listing.title}</h1>
                                    <p>{new Date(items.checkIn).toLocaleDateString("en-US", {month:"short", day:"numeric"})} - 
                                        {new Date(items.checkOut).toLocaleDateString("en-US", {month:"short", day:"numeric"})}</p>
                                    <div className="mt-6">
                                        <h3>Hosted by {items.user.name}</h3>
                                        <p>{items.listing.address}, {items.listing.state}</p>
                                        <p>{items.listing.state}</p>
                                    </div>
                                    {!items.isReviewed && 
                                    <button onClick={() => setReviewBooking({bookingId:items._id, listingId: items.listing._id})} className='mt-6 font-semibold text-white bg-green-600 cursor-pointer p-4 rounded-2xl'>
                                        Share your experience
                                    </button>
                                    }
                                </div>
                                <div className="md:w-[40%] h-full relative">
                                    <img className="object-cover w-full h-full border border-white" src={items.listing.houseImageUrl[0]} alt="" />
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <NoReservations />
                )
            )
            }
        </>
    )
}

