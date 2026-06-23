import { Venue } from "@/types/venue";
import VenueCard from "@/components/Venues/VenueCard";

const tempVenues: Venue[] = [
  {
    id: "1",
    name: "Venue 1",
    description: "Description for Venue 1",
    media: [
      {
        url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1175&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        alt: "Venue 1 Image",
      },
    ],
    price: 100,
  },
  {
    id: "2",
    name: "Venue 2",
    description: "Description for Venue 2",
    media: [
      {
        url: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        alt: "Venue 2 Image",
      },
    ],
    price: 150.5,
  },
  {
    id: "3",
    name: "Venue 3",
    description: "Description for Venue 3",
    media: [
      {
        url: "https://plus.unsplash.com/premium_photo-1661915661139-5b6a4e4a6fcc?q=80&w=1267&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        alt: "Venue 3 Image",
      },
    ],
    price: 200,
  },
];

export default function VenueGrid() {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
      {tempVenues.map((venue) => (
        <VenueCard key={venue.id} venue={venue} />
      ))}
    </div>
  );
}
