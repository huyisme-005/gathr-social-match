
/**
 * Gathr API Client
 * 
 * This module provides functions to interact with the Gathr backend API.
 * It includes methods for authentication, personality test, and event management.
 */

import axios from 'axios';

// Base API URL - should be environment variable in production
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authentication token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('gathr_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Authentication API
 */
export const authApi = {
  /**
   * Register a new user
   * 
   * @param name - User's full name
   * @param email - User's email address
   * @param password - User's password
   * @returns User object and authentication token
   */
  register: async (name: string, email: string, password: string) => {
    try {
      const response = await apiClient.post('/register', { name, email, password });
      // Store token in local storage
      localStorage.setItem('gathr_token', response.data.token);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  /**
   * Login existing user
   * 
   * @param email - User's email address
   * @param password - User's password
   * @returns User object and authentication token
   */
  login: async (email: string, password: string) => {
    try {
      const response = await apiClient.post('/login', { email, password });
      // Store token in local storage
      localStorage.setItem('gathr_token', response.data.token);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  /**
   * Logout current user
   * Removes authentication token from local storage
   */
  logout: () => {
    localStorage.removeItem('gathr_token');
  },
};

/**
 * Personality Test API
 */
export const personalityApi = {
  /**
   * Submit personality test answers
   * 
   * @param answers - Object mapping question IDs to selected trait values
   * @returns Analyzed personality traits
   */
  submitTest: async (answers: Record<number, string>) => {
    try {
      const response = await apiClient.post('/personality-test', { answers });
      return response.data;
    } catch (error) {
      console.error('Personality test submission error:', error);
      throw error;
    }
  },
};

/**
 * Events API
 */
export const eventsApi = {
  /**
   * Get events with pagination and optional filtering
   * 
   * @param page - Page number for pagination
   * @param limit - Number of events per page
   * @param category - Optional category to filter by
   * @returns List of events with match scores and pagination metadata
   */
  getEvents: async (page = 1, limit = 10, category?: string) => {
    try {
      const params = { page, limit, ...(category && { category }) };
      const response = await apiClient.get('/events', { params });
      return response.data;
    } catch (error) {
      console.error('Get events error:', error);
      throw error;
    }
  },

  /**
   * Create a new event
   * 
   * @param eventData - Event data object
   * @returns Created event object
   */
  createEvent: async (eventData: any) => {
    try {
      const response = await apiClient.post('/events', eventData);
      return response.data;
    } catch (error) {
      console.error('Create event error:', error);
      throw error;
    }
  },

  /**
   * Book attendance for an event
   * 
   * @param eventId - ID of the event to book
   * @returns Booking confirmation
   */
  bookEvent: async (eventId: string) => {
    try {
      const response = await apiClient.post(`/events/${eventId}/book`);
      return response.data;
    } catch (error) {
      console.error('Book event error:', error);
      throw error;
    }
  },

  /**
   * Get user's upcoming events (both attending and created)
   * 
   * @returns Object with attendingEvents and createdEvents arrays
   */
  getUpcomingEvents: async () => {
    try {
      const response = await apiClient.get('/events/upcoming');
      return response.data;
    } catch (error) {
      console.error('Get upcoming events error:', error);
      throw error;
    }
  },
};

/**
 * User Profile API
 */
export const userApi = {
  /**
   * Get current user profile
   * 
   * @returns User profile data
   */
  getProfile: async () => {
    try {
      const response = await apiClient.get('/profile');
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  /**
   * Update user profile
   * 
   * @param profileData - Updated profile data
   * @returns Updated user profile
   */
  updateProfile: async (profileData: any) => {
    try {
      const response = await apiClient.put('/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },
};

// Export default API object
const gathrApi = {
  auth: authApi,
  personality: personalityApi,
  events: eventsApi,
  user: userApi,
};

export default gathrApi;
