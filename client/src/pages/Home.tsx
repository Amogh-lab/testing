import { useState } from "react";
import { useLocation } from "wouter";
import { Sparkles, Play, GraduationCap, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { VideoPlaceholder } from "@/components/VideoPlaceholder";
import { NotesPanel } from "@/components/NotesPanel";
import { useApp } from "@/context/AppContext";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const {
    generateVideo,
    isGenerating,
    setIsGenerating,
    currentVideo,
    currentNotes,
    markNotesDownloaded
  } = useApp();

  const [, setLocation] = useLocation();
  const { toast } = useToast();

const handleGenerate = async () => {
  if (isGenerating) return;
  setIsGenerating(true);

  if (!prompt.trim()) {
    toast({
      title: "Please enter a prompt",
      description: "Describe what you'd like to visualize",
      variant: "destructive",
    });
    setIsGenerating(false); // Make sure to set isGenerating to false
    return;
  }

  try {
    const res = await fetch("http://127.0.0.1:5000/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
      cache: 'no-store' // Prevent any caching of the request
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Backend responded with ${res.status} ${text}`);
    }

    const data = await res.json();
    if (!data.video_url) throw new Error("Missing video_url");

    const backendUrl = data.video_url.startsWith("http")
      ? data.video_url
      : `http://127.0.0.1:5000${data.video_url}`;

    await generateVideo(prompt, backendUrl);

    toast({
      title: "Animation Generated!",
      description: "Your visualization is ready to watch",
    });
  } catch (err) {
    console.error("handleGenerate error:", err);
    toast({
      title: "Generation failed",
      description: err instanceof Error ? err.message : "Please try again",
      variant: "destructive",
    });
  } finally {
    setIsGenerating(false);
  }
};

  const handleWatchAgain = () => {
    console.log("Playing video again...");
    toast({
      title: "Replaying Animation",
      description: "Starting from the beginning",
    });
  };

  const handleTakeQuiz = () => {
    setLocation("/quiz");
  };

  const handleExit = () => {
    setPrompt("");
    toast({
      title: "Session Cleared",
      description: "Ready for a new visualization",
    });
  };

  const handleDownloadNotes = async () => {
    if (currentNotes) {
      await markNotesDownloaded(currentNotes.id);
    }
  };

  return (
    <div className="min-h-full">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            AI-Powered Visual Learning
          </div>
          <h1 className="text-4xl font-bold text-foreground">
            Transform Concepts into
            <span className="text-primary"> Visual Animations</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Enter any topic and watch as we generate an educational animation to help you understand complex concepts visually.
          </p>
        </div>

        <Card className="border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="p-6">
            <div className="flex gap-3">
                <Input
                  placeholder="e.g., Visualize the Doppler effect..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !isGenerating) {
                      handleGenerate();
                    }
                  }}
                  className="flex-1 h-12 text-base"
                  disabled={isGenerating}
                  data-testid="input-prompt"
                />

              <Button
                size="lg"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="h-12 px-6"
                data-testid="button-generate"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Generate Animation
                  </>
                )}
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <span className="text-sm text-muted-foreground">Try:</span>
              {["Doppler effect", "DNA replication", "Black holes", "Quantum tunneling"].map((topic) => (
                <button
                  key={topic}
                  onClick={() => setPrompt(`Visualize ${topic}`)}
                  className="text-sm px-3 py-1 rounded-full bg-muted text-muted-foreground hover-elevate"
                  data-testid={`suggestion-${topic.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <VideoPlaceholder
          isGenerating={isGenerating}
          hasVideo={!!currentVideo}
          // prompt={currentVideo?.prompt || prompt}
          videoUrl={currentVideo?.videoUrl}
          onWatchAgain={handleWatchAgain}
        />

        {currentVideo && currentNotes && (
          <>
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                variant="outline"
                onClick={handleWatchAgain}
                data-testid="button-watch-again-main"
              >
                <Play className="w-4 h-4 mr-2" />
                Watch Again
              </Button>
              <Button onClick={handleTakeQuiz} data-testid="button-take-quiz">
                <GraduationCap className="w-4 h-4 mr-2" />
                Take Quiz
              </Button>
              <Button
                variant="secondary"
                onClick={handleExit}
                data-testid="button-exit"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Exit
              </Button>
            </div>

            <NotesPanel 
              notes={currentNotes.notesText} 
              prompt={currentVideo.prompt}
              onDownload={handleDownloadNotes}
            />
          </>
        )}

        {!currentVideo && !isGenerating && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: "Enter a Topic", desc: "Type any scientific concept or phenomenon you want to understand" },
              { title: "Watch & Learn", desc: "AI generates a visual animation explaining the concept step by step" },
              { title: "Test Your Knowledge", desc: "Take a quiz to reinforce what you've learned" },
            ].map((step, i) => (
              <Card key={i} className="text-center">
                <CardContent className="p-6">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center mx-auto mb-3">
                    {i + 1}
                  </div>
                  <h3 className="font-semibold text-foreground">{step.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{step.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
