
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";

// Sample personality test questions
const questions = [
  {
    id: 1,
    question: "How do you typically spend your free time?",
    options: [
      { id: "a", text: "Socializing with friends", trait: "extrovert" },
      { id: "b", text: "Relaxing at home", trait: "introvert" },
      { id: "c", text: "Exploring new activities", trait: "adventurous" },
      { id: "d", text: "Learning new skills", trait: "curious" },
    ],
  },
  {
    id: 2,
    question: "What kind of events do you prefer?",
    options: [
      { id: "a", text: "Large gatherings and festivals", trait: "social" },
      { id: "b", text: "Small, intimate get-togethers", trait: "intimate" },
      { id: "c", text: "Active, sports-related events", trait: "active" },
      { id: "d", text: "Cultural or educational events", trait: "cultural" },
    ],
  },
  {
    id: 3,
    question: "How do you approach new social situations?",
    options: [
      { id: "a", text: "I dive right in and talk to everyone", trait: "extrovert" },
      { id: "b", text: "I observe first and engage selectively", trait: "thoughtful" },
      { id: "c", text: "I bring a friend for support", trait: "supportive" },
      { id: "d", text: "I research ahead of time", trait: "prepared" },
    ],
  },
  {
    id: 4,
    question: "What matters most to you in an event?",
    options: [
      { id: "a", text: "Meeting new people", trait: "networker" },
      { id: "b", text: "The atmosphere and ambiance", trait: "experiential" },
      { id: "c", text: "Learning or gaining something", trait: "growth-minded" },
      { id: "d", text: "The people I'm going with", trait: "relational" },
    ],
  },
  {
    id: 5,
    question: "How do you make decisions?",
    options: [
      { id: "a", text: "Quickly, based on instinct", trait: "intuitive" },
      { id: "b", text: "After careful analysis", trait: "analytical" },
      { id: "c", text: "Considering how it affects others", trait: "empathetic" },
      { id: "d", text: "Based on past experiences", trait: "experiential" },
    ],
  },
];

/**
 * PersonalityTest Component
 * 
 * This component implements the personality quiz that users take after registration.
 * It presents a series of questions and records user responses to determine personality traits.
 * After completion, the results are stored in the user's profile for event matching.
 */
const PersonalityTest = () => {
  // Current question index
  const [currentQuestion, setCurrentQuestion] = useState(0);
  // Object to store user's answers, keyed by question ID
  const [answers, setAnswers] = useState<Record<number, string>>({});
  // Array to store selected personality traits
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  // Access auth context for completing the personality test
  const { completePersonalityTest, user } = useAuth();
  // React Router navigation
  const navigate = useNavigate();
  
  /**
   * Handle user selecting an answer option
   * Stores the selected trait in answers state
   * 
   * @param questionId - The ID of the current question
   * @param trait - The personality trait associated with the selected option
   */
  const handleAnswer = (questionId: number, trait: string) => {
    setAnswers({
      ...answers,
      [questionId]: trait,
    });
  };
  
  /**
   * Handle next button click
   * Advances to the next question if an answer is selected
   */
  const handleNext = () => {
    if (currentQuestion < questions.length - 1 && answers[questions[currentQuestion].id]) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (!answers[questions[currentQuestion].id]) {
      toast({
        title: "Please select an option",
        description: "You need to select an answer before proceeding.",
        variant: "destructive"
      });
    }
  };
  
  /**
   * Handle previous button click
   * Returns to the previous question
   */
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  
  /**
   * Submit personality test results
   * Calculates traits based on answers and navigates to events page
   */
  const handleSubmit = () => {
    // Ensure current question is answered
    if (!answers[questions[currentQuestion].id]) {
      toast({
        title: "Please select an option",
        description: "You need to select an answer before completing the test.",
        variant: "destructive"
      });
      return;
    }
    
    // Calculate personality traits based on answers
    const traits = Object.values(answers);
    setSelectedTraits(traits);
    
    // Complete the personality test in auth context
    completePersonalityTest(traits);
    
    // Show completion toast
    toast({
      title: "Personality test completed!",
      description: "Your profile has been updated with your personality traits.",
    });
    
    // Navigate to find events page
    navigate("/find-events");
  };
  
  // Get current question data
  const question = questions[currentQuestion];
  // Calculate progress percentage
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  // Check if all questions have been answered
  const hasAnsweredAllQuestions = Object.keys(answers).length >= questions.length;
  // Check if current question has been answered (for Next button)
  const currentQuestionAnswered = answers[question.id] !== undefined;
  
  // Determine if this is a retake 
  const isRetake = user?.personalityTags && user.personalityTags.length > 0;
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-gathr-coral">
          {isRetake ? "Retake Personality Test" : "Personality Test"}
        </CardTitle>
        <CardDescription className="text-center">
          Help us understand your preferences to suggest events and connections that match your personality
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Progress value={progress} className="h-2 bg-gray-200" />
        
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-4">
            {question.question}
          </h3>
          
          <RadioGroup 
            className="space-y-3"
            value={answers[question.id]}
            onValueChange={(value) => handleAnswer(question.id, value)}
          >
            {question.options.map((option) => (
              <div key={option.id} className={`flex items-center space-x-2 p-3 rounded-md ${
                answers[question.id] === option.trait ? "bg-gathr-coral/10 border border-gathr-coral" : "border border-transparent hover:bg-muted"
              }`}>
                <RadioGroupItem
                  value={option.trait}
                  id={`q${question.id}-${option.id}`}
                  className={answers[question.id] === option.trait ? "text-gathr-coral" : ""}
                />
                <Label 
                  htmlFor={`q${question.id}-${option.id}`} 
                  className={`flex-1 cursor-pointer ${
                    answers[question.id] === option.trait ? "font-medium text-gathr-coral" : ""
                  }`}
                >
                  {option.text}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          disabled={currentQuestion === 0}
          onClick={handlePrevious}
        >
          Previous
        </Button>
        
        {currentQuestion === questions.length - 1 ? (
          <Button 
            className="bg-gathr-coral hover:bg-gathr-coral/90" 
            onClick={handleSubmit}
            disabled={!currentQuestionAnswered}
          >
            Complete
          </Button>
        ) : (
          <Button 
            onClick={handleNext}
            className="bg-gathr-coral hover:bg-gathr-coral/90"
          >
            Next
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default PersonalityTest;
