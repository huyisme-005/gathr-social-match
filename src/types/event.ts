
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  startTime?: string;
  endTime?: string;
  price?: number;
  location: string;
  imageUrl: string;
  capacity: number;
  attendees: number;
  categories: string[];
  creator: {
    id: string;
    name: string;
  };
  matchScore: number;
}

export interface EventCreationInput {
  title: string;
  description: string;
  date: string;
  time: string;
  startTime?: string;
  endTime?: string;
  price: number;
  location: string;
  capacity: number;
  categories: string[];
  imageUrl?: string;
}
