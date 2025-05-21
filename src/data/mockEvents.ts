
import { Event } from "../types/event";

export const mockEvents: Event[] = [
  {
    id: "1",
    title: "Tech Meetup: AI Revolution",
    description: "Join us for an exciting discussion about the latest developments in Artificial Intelligence and how they are shaping our future. Network with industry professionals and enthusiasts.",
    date: "2025-06-10",
    time: "18:00",
    startTime: "18:00",
    endTime: "20:00",
    price: 25,
    location: "Tech Hub, Downtown",
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee23481e1f5b",
    capacity: 50,
    attendees: 32,
    categories: ["Tech", "Networking", "Educational"],
    creator: {
      id: "101",
      name: "Alex Johnson"
    },
    matchScore: 92
  },
  {
    id: "2",
    title: "Yoga in the Park",
    description: "Start your weekend with a rejuvenating yoga session in the park. All levels welcome. Bring your own mat and water bottle.",
    date: "2025-06-12",
    time: "09:00",
    startTime: "09:00",
    endTime: "10:30",
    price: 15,
    location: "Central Park",
    imageUrl: "https://images.unsplash.com/photo-1588286840104-8957b019727f",
    capacity: 30,
    attendees: 18,
    categories: ["Fitness", "Wellness", "Outdoor"],
    creator: {
      id: "102",
      name: "Emma Wilson"
    },
    matchScore: 78
  },
  {
    id: "3",
    title: "Craft Beer Tasting",
    description: "Sample a variety of local craft beers while mingling with other beer enthusiasts. Includes food pairings and a guided tasting experience.",
    date: "2025-06-15",
    time: "19:30",
    startTime: "19:30",
    endTime: "22:00",
    price: 35,
    location: "Brewtown Brewery",
    imageUrl: "https://images.unsplash.com/photo-1575367439058-6096bb9cf5e2",
    capacity: 40,
    attendees: 35,
    categories: ["Food & Drink", "Social", "Cultural"],
    creator: {
      id: "103",
      name: "Ryan Mitchell"
    },
    matchScore: 85
  },
  {
    id: "4",
    title: "Photography Workshop",
    description: "Learn the basics of photography from professional photographers. Topics include composition, lighting, and editing. Bring your own camera.",
    date: "2025-06-18",
    time: "14:00",
    startTime: "14:00",
    endTime: "17:00",
    price: 50,
    location: "Arts Center",
    imageUrl: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e",
    capacity: 20,
    attendees: 12,
    categories: ["Arts", "Educational", "Creative"],
    creator: {
      id: "104",
      name: "Sophia Lee"
    },
    matchScore: 70
  },
  {
    id: "5",
    title: "Business Networking Breakfast",
    description: "Expand your professional network at this early morning event. Exchange ideas and make valuable connections while enjoying a continental breakfast.",
    date: "2025-06-20",
    time: "07:30",
    startTime: "07:30",
    endTime: "09:30",
    price: 30,
    location: "Grand Hotel Conference Room",
    imageUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7",
    capacity: 60,
    attendees: 45,
    categories: ["Business", "Networking", "Professional"],
    creator: {
      id: "105",
      name: "James Taylor"
    },
    matchScore: 88
  },
  {
    id: "6",
    title: "Charity Fun Run",
    description: "Run or walk 5K to raise funds for local children's hospital. Registration includes t-shirt, refreshments, and entertainment after the race.",
    date: "2025-06-22",
    time: "09:00",
    startTime: "09:00",
    endTime: "12:00",
    price: 40,
    location: "Riverside Park",
    imageUrl: "https://images.unsplash.com/photo-1533560904424-b280a914c0e1",
    capacity: 200,
    attendees: 124,
    categories: ["Sports", "Charity", "Outdoor"],
    creator: {
      id: "106",
      name: "Olivia Martinez"
    },
    matchScore: 65
  }
];
