import Reservations from "@/app/reservations/page";
import BookingModel from "@/models/Booking";
import ListingModel from "@/models/Listing";
import mongoose from "mongoose";


interface Summary {
    startDate: Date,
    endDate: Date,
    hostId: string,
}

function getGroupId(groupBy:string) {
  if (groupBy === "day") {
    return {
      $dateToString: {
        format: "%Y-%m-%d",
        date: "$checkIn",
      },
    };
  }

  if (groupBy === "month") {
    return {
      $dateToString: {
        format: "%Y-%m",
        date: "$checkIn",
      },
    };
  }
}


class DashboardService {
    static async getSummary(startDate: Date, endDate: Date, hostId: string) {
        const listingCounts = await ListingModel.countDocuments({
            host: hostId,
            status: "ACTIVE"
        });

        const summary = await BookingModel.aggregate([
            {
                $lookup: {
                    from: "listings",
                    foreignField: "_id",
                    localField: "listing",
                    as: "listing",
                }
            },
            {
                $unwind: "$listing",
            },
            {
                $match: {
                    "listing.host": new mongoose.Types.ObjectId(hostId),
                    "listing.status": "ACTIVE",
                }
            },
            {
                $facet: {
                    reservations: [
                        {
                            $match: {
                                createdAt: {
                                    $gte: startDate,
                                    $lte: endDate,
                                }
                            }
                        },
                        {
                            $count: "count"
                        }
                    ],
                    checkIns: [
                        {
                            $match: {
                                checkIn: {
                                    $lte: endDate,
                                    $gte: startDate,
                                },

                            }
                        },
                        {
                            $count: "count",
                        }
                    ],
                    checkOuts: [
                        {
                            $match: {
                                checkOut: {
                                    $lte: endDate,
                                    $gte: startDate,
                                }
                            }
                        },
                        {
                            $count: "count",
                        }
                    ],
                    occupiedNights: [
                        {
                            $match: {
                                checkIn: {
                                    $lt: endDate,
                                },
                                checkOut: {
                                    $gt: startDate,
                                }
                            }
                        },
                        {
                            $project: {
                                occupiedNights: {
                                    $dateDiff: {
                                        startDate: {
                                            $max: [startDate, "$checkIn"]
                                        },
                                        endDate: {
                                            $min: [endDate, "$checkOut"],
                                        },
                                        unit: "day",
                                    }
                                }
                            },
                        },
                        {
                            $group: {
                                _id: null,
                                occupiedNights: {
                                    $sum: "$occupiedNights"
                                }
                            }
                        }
                    ],
                    finance: [
                        {
                            $match: {
                                checkIn: {
                                    $lte: endDate,
                                    $gte: startDate,
                                },

                            }
                        },
                        {
                            $group: {
                                _id: null,

                                grossInvoiced: {
                                    $sum: "$totalPrice"
                                },
                                averageBooking: {
                                    $avg: "$totalPrice"
                                },

                                commission: {
                                    $sum: {
                                        $round: [
                                            { $multiply: ["$totalPrice", 0.13] },
                                            1
                                        ]
                                    }
                                },

                                bookings: {
                                    $sum: 1
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                grossInvoiced: 1,
                                bookings: 1,
                                commission: {
                                    $round: ["$commission", 1]
                                },
                                averageBooking: {
                                    $round: ["$averageBooking", 1]
                                }
                            }
                        }
                    ]
                }
            },
            {
                $project: {
                    reservations: {
                        $ifNull: [
                            { $arrayElemAt: ["$reservations.count", 0] },
                            0
                        ]
                    },
                    checkIns: {
                        $ifNull: [
                            { $arrayElemAt: ["$checkIns.count", 0] },
                            0
                        ]
                    },
                    checkOuts: {
                        $ifNull: [
                            { $arrayElemAt: ["$checkOuts.count", 0] },
                            0
                        ]
                    },
                    occupiedNights: {
                        $ifNull: [
                            { $arrayElemAt: ["$occupiedNights.occupiedNights", 0] },
                            0
                        ]
                    },
                    finance: {
                        $ifNull: [
                            { $arrayElemAt: ["$finance", 0] },
                            {
                                grossInvoiced: 0,
                                averageBooking: 0,
                                commission: 0,
                                bookings: 0,
                            }
                        ]
                    }
                }
            }
        ]);

        return { summary, listingCounts };
    }

    static async getTransaction(startDate: Date, endDate: Date, hostId: string){
        const transaction = await BookingModel.aggregate([
            {
                $match: {
                    "createdAt": {
                        $gte: startDate,
                        $lte: endDate
                    }
                }
            },
            {
                $lookup: {
                    from: "listings",
                    foreignField: "_id",
                    localField: "listing",
                    as: "listing"
                },
            },
            {
                $unwind: "$listing"
            },
            {
                $match: {
                    "listing.host": new mongoose.Types.ObjectId(hostId),
                }
            },
            {
                $lookup: {
                    from: "user",
                    foreignField: "_id",
                    localField: "user",
                    as: "user",
                }
            },
            {
                $unwind: "$user",
            },
            {
                $project: {
                    "listing.title": 1,
                    "checkIn": 1,
                    "totalPrice": 1,
                    "user.name": 1,
                    "razorpay": 1,
                    "createdAt": 1
                }
            }
        ])

        return transaction;
    }
    static async getGroupSummary(startDate: Date, endDate: Date, hostId: string) {
        const diffDays = (endDate.getTime() - startDate.getTime()) / (60 * 60 * 24 * 1000);
        let groupBy;
        if (diffDays <= 31) {
            groupBy = "day";
        } else if (diffDays <= 365) {
            groupBy = "month";
        } else {
            groupBy = "month";
        }

        const groupSummary = await BookingModel.aggregate([
            {
                $match:{
                    checkIn: {
                        $gte: startDate,
                        $lte: endDate
                    }
                }
            },
            {
                $lookup: {
                    from: "listings",
                    foreignField: "_id",
                    localField: "listing",
                    as: "listing",
                }
            },
            {
                $unwind: "$listing"
            },
            {
                $match: {
                    "listing.host": new mongoose.Types.ObjectId(hostId),
                }
            },
            {
                $group: {
                    _id: getGroupId(groupBy),
                    grossRevenue: {
                        $sum: "$totalPrice",
                    },
                    earning: {
                        $sum: {
                            $round: [
                                { $multiply: ["$totalPrice", 0.87] },
                                1
                            ]
                        }
                    },
                    booking: {
                        $sum: 1,
                    }
                }
            },
            {
                $sort: {
                    _id: 1,
                }
            }
        ]);

        return groupSummary;

    }

    static async getIncomebyProperty(startDate: Date, endDate: Date, hostId: string) {
        const propertySummary = await BookingModel.aggregate([
            {
                $lookup: {
                    from: "listings",
                    foreignField: "_id",
                    localField: "listing",
                    as: "listing"
                }
            },
            {
                $unwind: "$listing"
            },
            {
                $match: {
                    "listing.host": new mongoose.Types.ObjectId(hostId),
                    "listing.status": "ACTIVE",
                    checkOut: {
                        $gte: startDate,
                        $lte: endDate,
                    }
                }
            },
            {
                $group: {
                    _id: "$listing._id",

                    title: {
                        $first: "$listing.title",
                    },
                    location: {
                        $first: "$listing.address"
                    },

                    grossRevenue: {
                        $sum: "$totalPrice"
                    },

                    commission: {
                        $sum: {
                            $round: [
                                { $multiply: ["$totalPrice", 0.13] },
                                1
                            ]
                        }
                    },

                    income: {
                        $sum: {
                            $round: [
                                { $multiply: ["$totalPrice", 0.87] },
                                1
                            ]
                        }
                    },

                    bookings: {
                        $sum: 1,
                    }
                }
            },
            {
                $sort: {
                    income: -1,
                }
            }
        ]);

        return propertySummary;
    }

    static async getIncomeByMonth(hostId: string) {
        const incomeByMonth = await BookingModel.aggregate([
            {
                $lookup: {
                    from: "listings",
                    foreignField: "_id",
                    localField: "listing",
                    as: "listing",
                }
            },
            {
                $unwind: "$listing"
            },
            {
                $match: {
                    "listing.host": new mongoose.Types.ObjectId(hostId),
                    checkOut: {
                        $lt: new Date(Date.now()),
                    }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    income: {
                        $sum: "$totalPrice",
                    }
                }
            },
            {
                $sort: {
                    _id: -1,
                }
            }
        ]);

        return incomeByMonth;
    }

    static async getBookingByMonths(hostId: string) {
        const bookingByMonths = await BookingModel.aggregate([
            {
                $lookup: {
                    from: "listings",
                    foreignField: "_id",
                    localField: "listing",
                    as: "listing",
                }
            },
            {
                $unwind: "$listing"
            },
            {
                $match: {
                    "listing.host": new mongoose.Types.ObjectId(hostId),
                    checkOut: {
                        $lt: new Date(Date.now()),
                    }
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$checkOut" },
                        month: { $month: "$checkOut" }
                    },
                    bookings: { $sum: 1 }
                }
            },
            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1
                }
            }
        ])

        return bookingByMonths;
    }

}

export default DashboardService