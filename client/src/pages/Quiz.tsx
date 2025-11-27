import { useState, useMemo, useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuizCard } from "@/components/QuizCard";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: string;
  question: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
}

export default function Quiz() {
  const { currentPrompt, submitQuiz, currentNotes } = useApp();
  const [, setLocation] = useLocation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{ passed: boolean; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const prompt = currentPrompt || "Doppler Effect";
  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/quiz/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, notesText: currentNotes?.notesText ?? null }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data?.questions && Array.isArray(data.questions)) {
          setQuestions(data.questions);
          setCurrentIndex(0);
          setAnswers({});
          return;
        }
        throw new Error("Malformed quiz payload");
      } catch (err) {
        toast({
          title: "Failed to load quiz",
          description: "Using fallback questions.",
          variant: "destructive",
        });
        // Fallback to empty set to avoid inconsistent UI
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prompt]);

  const handleSelect = (optionId: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const score = questions.filter(
        (q) => answers[q.id] === q.correctAnswer
      ).length;
      
      const response = await submitQuiz(prompt, score, questions.length);
      setResult(response);
      setSubmitted(true);
      
      toast({
        title: response.passed ? "Quiz Passed!" : "Quiz Complete",
        description: response.message,
      });
    } catch (error) {
      toast({
        title: "Failed to submit quiz",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setCurrentIndex(0);
    setSubmitted(false);
    setResult(null);
  };

  const score = questions.filter((q) => answers[q.id] === q.correctAnswer).length;
  const passed = score >= 3;
  const allAnswered = Object.keys(answers).length === questions.length;

  if (submitted && result) {
    return (
      <div className="min-h-full flex items-center justify-center p-6">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <div
              className={cn(
                "w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-6",
                passed ? "bg-green-500/10" : "bg-red-500/10"
              )}
            >
              {passed ? (
                <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
              ) : (
                <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
              )}
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-2">
              {result.passed ? "Congratulations, You Passed!" : "Keep Learning!"}
            </h2>
            <p className="text-muted-foreground mb-6">
              {result.message}
            </p>

            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="text-4xl font-bold">{score}</span>
              <span className="text-2xl text-muted-foreground">/ {questions.length}</span>
            </div>

            <div className="w-full bg-muted rounded-full h-3 mb-6 overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  passed ? "bg-green-500" : "bg-red-500"
                )}
                style={{ width: `${(score / questions.length) * 100}%` }}
              />
            </div>

            <div className="flex flex-col gap-3">
              <Button onClick={handleRetry} variant="outline" data-testid="button-retry-quiz">
                <RotateCcw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button onClick={() => setLocation("/")} data-testid="button-go-home">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-full p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="mb-4"
            data-testid="button-back-home"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-2xl font-bold text-foreground">
            Quiz: {prompt}
          </h1>
          <p className="text-muted-foreground mt-1">
            Answer all questions and score at least 3/5 to pass
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="sr-only">Question {currentIndex + 1}</CardTitle>
          </CardHeader>
          <CardContent>
            {loading || !currentQuestion ? (
              <div className="text-muted-foreground">Loading questions...</div>
            ) : (
              <QuizCard
                questionNumber={currentIndex + 1}
                totalQuestions={questions.length}
                question={currentQuestion.question}
                options={currentQuestion.options}
                correctAnswer={currentQuestion.correctAnswer}
                selectedAnswer={answers[currentQuestion.id] || null}
                onSelect={handleSelect}
              />
            )}

            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                data-testid="button-prev-question"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <div className="text-sm text-muted-foreground">
                {Object.keys(answers).length} of {questions.length} answered
              </div>

              {currentIndex === questions.length - 1 ? (
                <Button
                  onClick={handleSubmit}
                  disabled={!allAnswered || isSubmitting || questions.length === 0}
                  data-testid="button-submit-quiz"
                >
                  {isSubmitting ? "Submitting..." : "Submit Quiz"}
                </Button>
              ) : (
                <Button onClick={handleNext} disabled={questions.length === 0} data-testid="button-next-question">
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
