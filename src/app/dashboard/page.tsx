'use client'
import { SubmitHandler, useForm } from "react-hook-form";

export default function dashboard() {

    const mockdata = [
        {
            "title": "Connaught Place Modern Stay",
            "description": "Modern apartment near Rajiv Chowk metro",
            "houseImageUrl": [
                "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
                "https://images.unsplash.com/photo-1493809842364-78817add7ffb"
            ],
            "address": "Connaught Place",
            "city": "Delhi",
            "state": "Delhi",
            "location": { "type": "Point", "coordinates": [77.2197, 28.6328] },
            "maxGuests": 3,
            "price": 3200
        },
        {
            "title": "Hauz Khas Designer Flat",
            "description": "Designer interior near Deer Park",
            "houseImageUrl": [
                "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
                "https://images.unsplash.com/photo-1560185127-6ed189bf02f4"
            ],
            "address": "Hauz Khas",
            "city": "Delhi",
            "state": "Delhi",
            "location": { "type": "Point", "coordinates": [77.1926, 28.5494] },
            "maxGuests": 4,
            "price": 2900
        },
        {
            "title": "Saket Luxury Studio",
            "description": "Premium stay near Select Citywalk",
            "houseImageUrl": [
                "https://images.unsplash.com/photo-1615874959474-d609969a20ed",
                "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6"
            ],
            "address": "Saket",
            "city": "Delhi",
            "state": "Delhi",
            "location": { "type": "Point", "coordinates": [77.2066, 28.5245] },
            "maxGuests": 2,
            "price": 3400
        },
        {
            "title": "Karol Bagh Budget Room",
            "description": "Comfort stay near market",
            "houseImageUrl": [
                "https://images.unsplash.com/photo-1523217582562-09d0def993a6",
                "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c"
            ],
            "address": "Karol Bagh",
            "city": "Delhi",
            "state": "Delhi",
            "location": { "type": "Point", "coordinates": [77.19, 28.6519] },
            "maxGuests": 3,
            "price": 2200
        },
        {
            "title": "Dwarka Family Apartment",
            "description": "Spacious family-friendly flat",
            "houseImageUrl": [
                "https://images.unsplash.com/photo-1507089947368-19c1da9775ae",
                "https://images.unsplash.com/photo-1505691723518-36a5ac3be353"
            ],
            "address": "Dwarka Sector 12",
            "city": "Delhi",
            "state": "Delhi",
            "location": { "type": "Point", "coordinates": [77.0409, 28.5921] },
            "maxGuests": 5,
            "price": 2600
        },
        {
            "title": "Lajpat Nagar Cozy Stay",
            "description": "Near Central Market",
            "houseImageUrl": [
                "https://images.unsplash.com/photo-1572120360610-d971b9d7767c"
            ],
            "address": "Lajpat Nagar",
            "city": "Delhi",
            "state": "Delhi",
            "location": { "type": "Point", "coordinates": [77.2435, 28.5677] },
            "maxGuests": 3,
            "price": 2100
        },
        {
            "title": "South Ex Premium Flat",
            "description": "Prime South Delhi location",
            "houseImageUrl": [
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
            ],
            "address": "South Extension",
            "city": "Delhi",
            "state": "Delhi",
            "location": { "type": "Point", "coordinates": [77.2195, 28.5689] },
            "maxGuests": 2,
            "price": 3600
        },
        {
            "title": "Rohini Peaceful Home",
            "description": "Quiet and comfortable area",
            "houseImageUrl": [
                "https://images.unsplash.com/photo-1600607687644-c7f34b5063c8"
            ],
            "address": "Rohini",
            "city": "Delhi",
            "state": "Delhi",
            "location": { "type": "Point", "coordinates": [77.1177, 28.7203] },
            "maxGuests": 4,
            "price": 2300
        },
        {
            "title": "Janakpuri Comfort Stay",
            "description": "Family-friendly locality",
            "houseImageUrl": [
                "https://images.unsplash.com/photo-1599423300746-b62533397364"
            ],
            "address": "Janakpuri",
            "city": "Delhi",
            "state": "Delhi",
            "location": { "type": "Point", "coordinates": [77.0888, 28.6219] },
            "maxGuests": 4,
            "price": 2400
        },
        {
            "title": "Pitampura Apartment",
            "description": "Close to NSP metro",
            "houseImageUrl": [
                "https://images.unsplash.com/photo-1600566752227-8f6c2d33e8c3"
            ],
            "address": "Pitampura",
            "city": "Delhi",
            "state": "Delhi",
            "location": { "type": "Point", "coordinates": [77.1313, 28.6996] },
            "maxGuests": 3,
            "price": 2500
        },
        {
            "title": "Juhu Beachside Room",
            "description": "Walking distance from Juhu beach",
            "houseImageUrl": [
                "https://images.unsplash.com/photo-1523217582562-09d0def993a6"
            ],
            "address": "Juhu",
            "city": "Mumbai",
            "state": "Maharashtra",
            "location": { "type": "Point", "coordinates": [72.8266, 19.1075] },
            "maxGuests": 2,
            "price": 3900
        },
        {
            "title": "Powai Lake View Stay",
            "description": "Overlooking Powai lake",
            "houseImageUrl": [
                "https://images.unsplash.com/photo-1572120360610-d971b9d7767c"
            ],
            "address": "Powai",
            "city": "Mumbai",
            "state": "Maharashtra",
            "location": { "type": "Point", "coordinates": [72.9081, 19.1197] },
            "maxGuests": 4,
            "price": 3700
        },
        {
            "title": "Dadar Central Apartment",
            "description": "Well connected and comfortable",
            "houseImageUrl": [
                "https://images.unsplash.com/photo-1599423300746-b62533397364"
            ],
            "address": "Dadar",
            "city": "Mumbai",
            "state": "Maharashtra",
            "location": { "type": "Point", "coordinates": [72.8420, 19.0178] },
            "maxGuests": 3,
            "price": 3100
        },
        {
            "title": "Lower Parel Luxury Stay",
            "description": "Premium stay near malls and offices",
            "houseImageUrl": [
                "https://images.unsplash.com/photo-1600607687644-c7f34b5063c8"
            ],
            "address": "Lower Parel",
            "city": "Mumbai",
            "state": "Maharashtra",
            "location": { "type": "Point", "coordinates": [72.8300, 18.9988] },
            "maxGuests": 2,
            "price": 4800
        },
        {
            "title": "Goregaon Comfort Home",
            "description": "Peaceful stay near Film City",
            "houseImageUrl": [
                "https://images.unsplash.com/photo-1600566752227-8f6c2d33e8c3"
            ],
            "address": "Goregaon East",
            "city": "Mumbai",
            "state": "Maharashtra",
            "location": { "type": "Point", "coordinates": [72.8720, 19.1663] },
            "maxGuests": 4,
            "price": 2800
        },
        {
            "title": "Worli Sea Breeze Apartment",
            "description": "Sea breeze and skyline views",
            "houseImageUrl": [
                "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"
            ],
            "address": "Worli",
            "city": "Mumbai",
            "state": "Maharashtra",
            "location": { "type": "Point", "coordinates": [72.8174, 19.0150] },
            "maxGuests": 3,
            "price": 4100
        },
        {
            "title": "Baga Beach Villa",
            "description": "Private villa near Baga shoreline",
            "houseImageUrl": [
                "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
                "https://images.unsplash.com/photo-1600585154526-990dced4db0d"
            ],
            "address": "Baga Beach",
            "city": "Goa",
            "state": "Goa",
            "location": { "type": "Point", "coordinates": [73.7517, 15.5553] },
            "maxGuests": 5,
            "price": 5200
        },
        {
            "title": "Calangute Holiday Apartment",
            "description": "Cozy stay near Calangute market",
            "houseImageUrl": [
                "https://images.unsplash.com/photo-1505691938895-1758d7feb511"
            ],
            "address": "Calangute",
            "city": "Goa",
            "state": "Goa",
            "location": { "type": "Point", "coordinates": [73.7553, 15.5439] },
            "maxGuests": 3,
            "price": 2600
        },
        {
            "title": "Anjuna Sunset Villa",
            "description": "Villa with sunset views",
            "houseImageUrl": [
                "https://images.unsplash.com/photo-1613977257363-707ba9348227"
            ],
            "address": "Anjuna",
            "city": "Goa",
            "state": "Goa",
            "location": { "type": "Point", "coordinates": [73.7400, 15.5730] },
            "maxGuests": 6,
            "price": 6100
        },
        {
            "title": "Candolim Comfort Room",
            "description": "Peaceful stay near beach",
            "houseImageUrl": [
                "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"
            ],
            "address": "Candolim",
            "city": "Goa",
            "state": "Goa",
            "location": { "type": "Point", "coordinates": [73.7625, 15.5153] },
            "maxGuests": 2,
            "price": 2400
        },
        {
            "title": "Vagator Cliffside Stay",
            "description": "Cliffside apartment with ocean breeze",
            "houseImageUrl": [
                "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c"
            ],
            "address": "Vagator",
            "city": "Goa",
            "state": "Goa",
            "location": { "type": "Point", "coordinates": [73.7447, 15.6010] },
            "maxGuests": 3,
            "price": 3300
        },
        {
            "title": "Colva Beach Studio",
            "description": "Studio near Colva sands",
            "houseImageUrl": [
                "https://images.unsplash.com/photo-1572120360610-d971b9d7767c"
            ],
            "address": "Colva",
            "city": "Goa",
            "state": "Goa",
            "location": { "type": "Point", "coordinates": [73.9110, 15.2797] },
            "maxGuests": 2,
            "price": 2200
        },

        {
            "title": "Pink City Heritage Room",
            "description": "Traditional Rajasthani interior",
            "houseImageUrl": [
                "https://images.unsplash.com/photo-1580587771525-78b9dba3b914"
            ],
            "address": "Johari Bazaar",
            "city": "Jaipur",
            "state": "Rajasthan",
            "location": { "type": "Point", "coordinates": [75.8267, 26.9255] },
            "maxGuests": 3,
            "price": 2400
        },
        {
            "title": "Hawa Mahal View Stay",
            "description": "Balcony view of old city",
            "houseImageUrl": [
                "https://images.unsplash.com/photo-1600607687644-c7f34b5063c8"
            ],
            "address": "Badi Choupad",
            "city": "Jaipur",
            "state": "Rajasthan",
            "location": { "type": "Point", "coordinates": [75.8289, 26.9239] },
            "maxGuests": 2,
            "price": 2600
        },
        {
            "title": "Amer Road Royal Suite",
            "description": "Royal style room near Amer Fort",
            "houseImageUrl": [
                "https://images.unsplash.com/photo-1613977257363-707ba9348227"
            ],
            "address": "Amer Road",
            "city": "Jaipur",
            "state": "Rajasthan",
            "location": { "type": "Point", "coordinates": [75.8520, 26.9855] },
            "maxGuests": 4,
            "price": 3000
        },
        {
            "title": "C-Scheme Luxury Flat",
            "description": "Premium modern stay",
            "houseImageUrl": [
                "https://images.unsplash.com/photo-1560448204-603b3fc33ddc"
            ],
            "address": "C-Scheme",
            "city": "Jaipur",
            "state": "Rajasthan",
            "location": { "type": "Point", "coordinates": [75.7873, 26.9124] },
            "maxGuests": 2,
            "price": 3400
        },
        {
            "title": "Malviya Nagar Apartment",
            "description": "Modern and peaceful",
            "houseImageUrl": [
                "https://images.unsplash.com/photo-1507089947368-19c1da9775ae"
            ],
            "address": "Malviya Nagar",
            "city": "Jaipur",
            "state": "Rajasthan",
            "location": { "type": "Point", "coordinates": [75.8056, 26.8470] },
            "maxGuests": 3,
            "price": 2100
        },
        {
            "title": "Jal Mahal Lake View",
            "description": "Peaceful lake-facing stay",
            "houseImageUrl": [
                "https://images.unsplash.com/photo-1572120360610-d971b9d7767c"
            ],
            "address": "Jal Mahal Road",
            "city": "Jaipur",
            "state": "Rajasthan",
            "location": { "type": "Point", "coordinates": [75.8497, 26.9536] },
            "maxGuests": 3,
            "price": 2800
        },
        {
            "title": "Vaishali Nagar Comfort Home",
            "description": "Family friendly locality",
            "houseImageUrl": [
                "https://images.unsplash.com/photo-1600566752227-8f6c2d33e8c3"
            ],
            "address": "Vaishali Nagar",
            "city": "Jaipur",
            "state": "Rajasthan",
            "location": { "type": "Point", "coordinates": [75.7439, 26.9115] },
            "maxGuests": 4,
            "price": 2300
        },
        {
            "title": "Tonk Road Studio",
            "description": "Cozy studio near airport road",
            "houseImageUrl": [
                "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"
            ],
            "address": "Tonk Road",
            "city": "Jaipur",
            "state": "Rajasthan",
            "location": { "type": "Point", "coordinates": [75.7930, 26.8381] },
            "maxGuests": 2,
            "price": 2000
        },
        {
            "title": "Civil Lines Premium Stay",
            "description": "Spacious premium apartment",
            "houseImageUrl": [
                "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6"
            ],
            "address": "Civil Lines",
            "city": "Jaipur",
            "state": "Rajasthan",
            "location": { "type": "Point", "coordinates": [75.7820, 26.9120] },
            "maxGuests": 3,
            "price": 2700
        },
        {
            "title": "Bapu Nagar Cozy Flat",
            "description": "Comfort stay in central Jaipur",
            "houseImageUrl": [
                "https://images.unsplash.com/photo-1523217582562-09d0def993a6"
            ],
            "address": "Bapu Nagar",
            "city": "Jaipur",
            "state": "Rajasthan",
            "location": { "type": "Point", "coordinates": [75.8150, 26.8898] },
            "maxGuests": 3,
            "price": 2200
        }

    ]
    const handleSubmit = async () => {
        for (const item of mockdata) {
            const res = await fetch("/api/listings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(item),
            });

            if (!res.ok) {
                throw new Error("Failed to create listing");
            }

            const data = await res.json();
            console.log(data);
        }
    };


    return (

        <button onClick={handleSubmit}>Sumbit</button>
    )
}