
"""
AI Module for Personality Analysis and Event Matching

This module contains AI-powered functionality for:
1. Analyzing personality test results
2. Calculating match scores between users and events
3. Recommending events based on personality traits
"""
import numpy as np
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

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
