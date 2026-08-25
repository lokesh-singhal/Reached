import { DoorOpen, House, IndianRupee, Users } from "lucide-react"

export default function OverviewCards({ stats, listingCount }: any) {
    const occupancy = stats && Number(((stats.occupiedNights / (listingCount*30))*100).toFixed(1));
    const options = [
        { icon: <Users size={30} strokeWidth={2.75} />, label: "Total New Reservations", value: stats && stats.reservations },
        { icon: <DoorOpen size={30} strokeWidth={2.75} />, label: "Total Check-Ins", value: stats && stats.checkIns },
        { icon: <DoorOpen size={30} strokeWidth={2.75} />, label: "Total Check-Outs", value: stats && stats.checkOuts },
        { icon: <House size={30} strokeWidth={2.75} />, label: "Occupancy Rate", value: occupancy },
        { icon: <DoorOpen size={30} strokeWidth={2.75} />, label: "Average Booking Value", value: stats && stats.finance.averageBooking.toLocaleString("en-IN") },
        { icon: <IndianRupee size={30} strokeWidth={2.75} />, label: "Total Commissions", value: stats && stats.finance.commission.toLocaleString("en-IN") },
        { icon: <IndianRupee size={30} strokeWidth={2.75} />, label: "Total Net Received", value: stats && (stats.finance.grossInvoiced - stats.finance.commission).toLocaleString("en-IN") },
        { icon: <IndianRupee size={30} strokeWidth={2.75} />, label: "Total Gross Invoiced", value: stats && stats.finance.grossInvoiced.toLocaleString("en-IN") },
    ]
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 w-full">
            {options.map((item, index) => (
                <div key={index} className="bg-gray-200 p-6 rounded-xs">
                    <div className="flex gap-2 items-center">
                        <span className="">{item.icon}</span>
                        <span className="md:text-3xl font-semibold">{item.value || 0}</span>
                    </div>
                    <div className="max-sm:text-sm mt-2 font-semibold text-black/60">
                        {item.label}
                    </div>
                </div>

            ))}
        </div>
    )
}