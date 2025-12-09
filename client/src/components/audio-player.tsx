import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AudioPlayerProps {
  src: string;
  title?: string;
  duration?: string;
}

export default function AudioPlayer({ src, title = "Property Tour", duration = "2:00" }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setTotalTime(audioRef.current.duration || 0);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = percent * totalTime;
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Volume2 className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        </div>
        
        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          onLoadedMetadata={handleTimeUpdate}
        >
          <source src={src} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>

        <div className="space-y-4">
          {/* Play Button */}
          <Button
            onClick={handlePlayPause}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            data-testid="button-audio-play"
          >
            {isPlaying ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Pause Tour
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Play Tour
              </>
            )}
          </Button>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div
              onClick={handleProgressClick}
              className="w-full bg-muted rounded-full h-2 cursor-pointer hover:h-3 transition-all"
              data-testid="audio-progress-bar"
            >
              <div
                className="bg-primary h-full rounded-full transition-all"
                style={{ width: `${totalTime ? (currentTime / totalTime) * 100 : 0}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span data-testid="text-audio-current-time">{formatTime(currentTime)}</span>
              <span data-testid="text-audio-duration">{totalTime ? formatTime(totalTime) : duration}</span>
            </div>
          </div>

          {/* Info Text */}
          <p className="text-sm text-muted-foreground text-center">
            Take a 2-minute guided tour of this property
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
