
export default interface CreateInputListing {
    hostId: string,
    title: string,
    description?: string,
    houseImageUrl: string[];
    address: string,
    city: string,
    state: string,
    location: {
        type: "Point";
        coordinates: [number, number];
    };
    maxGuests: number,
    status: string,
    price: number,
}