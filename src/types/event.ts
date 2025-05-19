
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
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
