
"""
@file ai.py
@author Huy Le (huyisme-005)
@organization Gathr
AI Module for Personality Analysis and Event Matching

This module contains AI-powered functionality for:
1. Analyzing personality test results
2. Calculating match scores between users and events
3. Calculating compatibility between users
4. Recommending events based on personality traits
5. Recommending connections for the Gathr Circle
"""
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import MinMaxScaler

def analyze_personality(answers):
    """
    Analyzes personality test answers to determine traits
    
    Args:
        answers: Dictionary mapping question IDs to selected trait values
    
    Returns:
        List of personality traits that best describe the user
    """
    # In a real implementation, this would use a more sophisticated algorithm
    # For now, we'll just extract the most frequent traits from answers
    
    if not answers:
        return []
    
    # Count trait occurrences
    trait_counts = {}
    for trait in answers.values():
        trait_counts[trait] = trait_counts.get(trait, 0) + 1
    
    # Get top traits (traits with highest counts)
    sorted_traits = sorted(trait_counts.items(), key=lambda x: x[1], reverse=True)
    
    # Return the traits that appear most frequently
    # In a real app, this would include more sophisticated analysis
    top_traits = [trait for trait, _ in sorted_traits[:5]]
    
    return top_traits

def calculate_match_score(user_traits, event_categories):
    """
    Calculates compatibility score between user and event
    
    Args:
        user_traits: List of personality traits of the user
        event_categories: List of categories/tags of the event
    
    Returns:
        Match score as an integer from 0-100
    """
    if not user_traits or not event_categories:
        return 50  # Default middle score when no data available
    
    # In a real implementation, this would use a more sophisticated algorithm
    # with trained models for personality-event compatibility
    
    # Simple approach: Convert traits and categories to word vectors
    # and calculate cosine similarity
    
    # Combine all texts for vectorization
    all_texts = user_traits + event_categories
    
    # Create vectorizer
    vectorizer = CountVectorizer()
    
    try:
        # Create word vectors
        vectors = vectorizer.fit_transform(all_texts)
        
        # Get user vector (average of trait vectors)
        user_vector = np.mean(vectors[:len(user_traits)].toarray(), axis=0).reshape(1, -1)
        
        # Get event vector (average of category vectors)
        event_vector = np.mean(vectors[len(user_traits):].toarray(), axis=0).reshape(1, -1)
        
        # Calculate similarity
        similarity = cosine_similarity(user_vector, event_vector)[0][0]
        
        # Convert to scale of 0-100
        match_score = int(similarity * 100)
        
        # Ensure the score is between 0 and 100
        match_score = max(0, min(100, match_score))
    except:
        # Fallback if vectorization fails
        match_score = 50
    
    return match_score

def calculate_user_compatibility(user1_traits, user2_traits):
    """
    Calculates compatibility score between two users
    
    Args:
        user1_traits: List of personality traits of the first user
        user2_traits: List of personality traits of the second user
    
    Returns:
        Compatibility score as an integer from 0-100
    """
    if not user1_traits or not user2_traits:
        return 50  # Default middle score when no data available
    
    # Calculate direct trait matches
    common_traits = set(user1_traits).intersection(set(user2_traits))
    direct_match_score = len(common_traits) / max(len(user1_traits), len(user2_traits)) * 100
    
    # Calculate semantic similarity using word vectors
    try:
        # Combine all traits for vectorization
        all_traits = user1_traits + user2_traits
        
        # Create vectorizer
        vectorizer = CountVectorizer()
        vectors = vectorizer.fit_transform(all_traits)
        
        # Get user vectors (average of trait vectors)
        user1_vector = np.mean(vectors[:len(user1_traits)].toarray(), axis=0).reshape(1, -1)
        user2_vector = np.mean(vectors[len(user1_traits):].toarray(), axis=0).reshape(1, -1)
        
        # Calculate similarity
        similarity_score = cosine_similarity(user1_vector, user2_vector)[0][0] * 100
        
        # Combine direct matches and semantic similarity
        final_score = (direct_match_score * 0.7) + (similarity_score * 0.3)
        
        # Ensure the score is between 0 and 100
        compatibility_score = max(0, min(100, int(final_score)))
    except:
        # Fallback if vectorization fails
        compatibility_score = int(direct_match_score)
    
    return compatibility_score

def recommend_events(user_traits, events, limit=10):
    """
    Recommends events for a user based on personality traits
    
    Args:
        user_traits: List of personality traits of the user
        events: List of event objects
        limit: Maximum number of events to recommend
    
    Returns:
        List of event IDs sorted by match score
    """
    if not user_traits or not events:
        return []
    
    # Calculate match score for each event
    scored_events = []
    for event in events:
        match_score = calculate_match_score(user_traits, event.categories)
        scored_events.append((event.id, match_score))
    
    # Sort events by match score (descending)
    sorted_events = sorted(scored_events, key=lambda x: x[1], reverse=True)
    
    # Return top N event IDs
    recommended_event_ids = [event_id for event_id, _ in sorted_events[:limit]]
    
    return recommended_event_ids

def recommend_connections(user_traits, other_users, limit=10):
    """
    Recommends potential connections for a user based on personality traits
    
    Args:
        user_traits: List of personality traits of the user
        other_users: List of other user objects with personality traits
        limit: Maximum number of connections to recommend
    
    Returns:
        List of user IDs sorted by compatibility score
    """
    if not user_traits or not other_users:
        return []
    
    # Calculate compatibility score for each user
    scored_users = []
    for other_user in other_users:
        if not other_user.personality_tags:
            continue
            
        compatibility = calculate_user_compatibility(user_traits, other_user.personality_tags)
        scored_users.append((other_user.id, compatibility))
    
    # Sort users by compatibility score (descending)
    sorted_users = sorted(scored_users, key=lambda x: x[1], reverse=True)
    
    # Return top N user IDs
    recommended_user_ids = [user_id for user_id, _ in sorted_users[:limit]]
    
    return recommended_user_ids

def select_message_recipients(attendees, percentage=10, min_count=1):
    """
    Selects a percentage of attendees that can be messaged
    
    Args:
        attendees: List of attendee objects
        percentage: Percentage of attendees that can be messaged (default 10%)
        min_count: Minimum number of attendees to select
    
    Returns:
        List of attendee IDs that can be messaged
    """
    if not attendees:
        return []
    
    # Calculate number of attendees to select
    count = max(min_count, int(len(attendees) * percentage / 100))
    
    # Limit to actual attendee count
    count = min(count, len(attendees))
    
    # Select random attendees
    selected_indices = np.random.choice(len(attendees), count, replace=False)
    
    # Return selected attendee IDs
    return [attendees[i].id for i in selected_indices]

def process_event_feedback(event_id, user_ratings, content_ratings, enjoyment_factors):
    """
    Process feedback data for an event to improve future recommendations
    
    Args:
        event_id: ID of the event
        user_ratings: Dictionary mapping user IDs to their numeric ratings
        content_ratings: Dictionary mapping content aspects to their average ratings
        enjoyment_factors: Dictionary counting what users enjoyed most
        
    Returns:
        Dictionary with processed insights
    """
    # In a real implementation, this would update machine learning models
    # and store the processed data for future recommendations
    
    # Calculate average rating
    avg_rating = np.mean(list(user_ratings.values()))
    
    # Get most enjoyed aspects
    enjoyment_sorted = sorted(enjoyment_factors.items(), key=lambda x: x[1], reverse=True)
    top_enjoyment = [factor for factor, _ in enjoyment_sorted[:2]]
    
    # In a real app, we'd use this data to:
    # 1. Update event category weights in the recommendation algorithm
    # 2. Adjust personality trait to event category mappings
    # 3. Provide analytics to event creators
    
    return {
        "event_id": event_id,
        "average_rating": avg_rating,
        "content_ratings": content_ratings,
        "top_enjoyment_factors": top_enjoyment
    }
