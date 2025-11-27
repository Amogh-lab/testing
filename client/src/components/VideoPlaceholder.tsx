import { Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VideoPlaceholderProps {
  isGenerating?: boolean;
  hasVideo?: boolean;
  prompt?: string;
  videoUrl?: string;
  onWatchAgain?: () => void;
}

export function VideoPlaceholder({
  isGenerating = false,
  hasVideo = false,
  prompt,
  videoUrl,
  onWatchAgain,
}: VideoPlaceholderProps) {
  if (isGenerating) {
    return (
      <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border bg-gradient-to-br from-primary/5 via-accent/10 to-primary/5 flex flex-col items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
          <div className="relative w-16 h-16 rounded-full bg-gradient-to-r from-primary to-primary/60 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border-4 border-white/30 border-t-white animate-spin" />
          </div>
        </div>
        <div className="text-center px-4 mt-4">
          <p className="text-lg font-semibold text-foreground">Generating Animation</p>
          <p className="text-sm text-muted-foreground mt-1">
            Creating visualization for "{prompt}"
          </p>
        </div>
        <div className="flex gap-1 mt-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-primary animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (hasVideo && videoUrl) {
    return (
      <div className="relative w-full" data-testid="video-player-container">
        <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black">
          <video
            src={videoUrl}
            className="w-full h-full object-cover"
            controls
            autoPlay
            loop
            muted
            playsInline
          />
          {prompt && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-white font-medium text-sm md:text-base line-clamp-2">
                {prompt}
              </p>
            </div>
          )}
        </div>
        {onWatchAgain && (
          <div className="mt-4 flex justify-end">
            <Button
              variant="outline"
              onClick={onWatchAgain}
              className="bg-white/90 hover:bg-white text-foreground"
              data-testid="button-watch-again"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Watch Again
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Default placeholder state when no video is loaded
  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border bg-gradient-to-br from-primary/5 via-accent/10 to-primary/5 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className={cn(
          "w-24 h-24 rounded-full flex items-center justify-center",
          "bg-gradient-to-br from-muted to-muted/50 border-2 border-dashed border-muted-foreground/30"
        )}>
          <Play className="w-10 h-10 text-muted-foreground/50" />
        </div>
        <div className="text-center px-4">
          <p className="text-muted-foreground">Enter a prompt to generate a visualization</p>
          <p className="text-sm text-muted-foreground/70 mt-1">
            e.g., "Visualize the Doppler effect"
          </p>
        </div>
      </div>
      
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" className="text-foreground"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
    </div>
  );
}
