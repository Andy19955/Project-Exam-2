import { Media } from "@/types/media";
import { Profile } from "@/types/profile";

export interface Venue {
  id: string;
  name: string;
  description: string;
  media?: Media[];
  price: number;
  maxGuests: number;
  rating: number;
  created: string;
  updated: string;
  meta: {
    wifi: boolean;
    parking: boolean;
    breakfast: boolean;
    pets: boolean;
  };
  location: {
    address: string;
    city: string;
    zip: string;
    country: string;
    continent: string;
    lat: number;
    long: number;
  };
  owner: Profile;
}
