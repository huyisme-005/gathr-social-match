
/**
 * Event interface - Defines the structure of event objects throughout the application
 * This type is used for consistent event data representation across components
 */
export interface Event {
  id: string;                 // Unique identifier for the event
  title: string;              // Title/name of the event
  description: string;        // Detailed description of the event
  date: string;               // Date when the event takes place
  time: string;               // Time when the event starts
  location: string;           // Physical location of the event
  imageUrl: string;           // URL to the event's cover image
  capacity: number;           // Maximum number of attendees allowed
  attendees: number;          // Current number of attendees
  categories: string[];       // Categories/tags associated with the event
  creator: {                  // Information about the event creator
    id: string;               // Creator's unique identifier
    name: string;             // Creator's name
  };
  matchScore: number;         // Compatibility score between event and user (0-100)
}
