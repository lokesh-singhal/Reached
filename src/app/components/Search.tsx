import { MapPinHouse } from "lucide-react";

interface searchType {
    _id: string
}
export default function Search({ search, setQuery, setIsDestination }: { search: searchType[], setQuery:React.Dispatch<React.SetStateAction<string>>, setIsDestination:React.Dispatch<React.SetStateAction<boolean>> }) {
    return (
        <>
            <div className="flex flex-col gap-3 bg-gray-50 shadow-md w-90 p-4 px-8 rounded-2xl">
                {search.length > 0 ? (
                    search.map((item: any) => (
                        <button onClick={() => {setQuery(item._id); setIsDestination(false)}} className="text-2xl flex px-3 rounded-xl gap-8 items-center truncate hover:bg-gray-200">
                            <div className="bg-gray-200 rounded-xl p-1">
                                <MapPinHouse size={40} />
                            </div>
                            {item._id}
                        </button>
                    ))
                ) : (
                    <div>
                        No suggestions...
                    </div>
                )}

            </div>
        </>
    )
}