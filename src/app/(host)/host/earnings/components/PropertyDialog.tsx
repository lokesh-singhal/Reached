
interface PropertyProps {
    _id: string,
    title: string,
    income: number,
    bookings: number,
    grossRevenue: number,
    commission: number,
    location: string
}

export default function PropertyDialog({ earnings }: {earnings:PropertyProps[]}) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b text-left text-muted-foreground">
                        <th className="px-5 py-3 font-medium">Property</th>
                        <th className="px-5 py-3 font-medium">Bookings</th>
                        <th className="px-5 py-3 font-medium">Gross revenue</th>
                        <th className="px-5 py-3 font-medium">Commission</th>
                        <th className="px-5 py-3 text-right font-medium">
                            Net earnings
                        </th>
                    </tr>
                </thead>

                {earnings.length === 0 ? (
                    <tbody>
                        <tr>
                            <td className="p-4">
                                No listing earning to show
                            </td>
                        </tr>
                    </tbody>
                ) : (
                    <tbody>
                        {earnings.map((property) => (
                            <tr
                                key={property._id}
                                className="border-b last:border-0 hover:bg-muted/40"
                            >
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        <div>
                                            <p className="font-medium">{property.title}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {property.location}
                                            </p>
                                        </div>
                                    </div>
                                </td>

                                <td className="px-5 py-4">
                                    {property.bookings}
                                </td>

                                <td className="px-5 py-4">
                                    ₹{property.grossRevenue.toLocaleString("en-IN")}
                                </td>

                                <td className="px-5 py-4 text-muted-foreground">
                                    ₹{property.commission.toLocaleString("en-IN")}
                                </td>

                                <td className="px-5 py-4 text-right font-medium">
                                    ₹{property.income.toLocaleString("en-IN")}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                )}
            </table>
        </div>
    )
}