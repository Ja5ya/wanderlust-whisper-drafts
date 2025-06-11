
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SpeechToTextProps {
  onTranscript: (text: string) => void;
  placeholder?: string;
}

const SpeechToText = ({ onTranscript, placeholder = "Click microphone to start recording..." }: SpeechToTextProps) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognition = useRef<any>(null);
  const { toast } = useToast();

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Not Supported",
        description: "Speech recognition is not supported in this browser.",
        variant: "destructive"
      });
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognition.current = new SpeechRecognition();
    
    recognition.current.continuous = true;
    recognition.current.interimResults = true;
    recognition.current.lang = 'en-US';

    recognition.current.onstart = () => {
      setIsListening(true);
      toast({
        title: "Listening",
        description: "Speak now to add your notes..."
      });
    };

    recognition.current.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setTranscript(prev => prev + ' ' + finalTranscript);
        onTranscript(transcript + ' ' + finalTranscript);
      }
    };

    recognition.current.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      toast({
        title: "Recognition Error",
        description: "There was an error with speech recognition. Please try again.",
        variant: "destructive"
      });
    };

    recognition.current.onend = () => {
      setIsListening(false);
    };

    recognition.current.start();
  };

  const stopListening = () => {
    if (recognition.current) {
      recognition.current.stop();
      setIsListening(false);
    }
  };

  const clearTranscript = () => {
    setTranscript("");
    onTranscript("");
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Button
          onClick={isListening ? stopListening : startListening}
          variant={isListening ? "destructive" : "outline"}
          size="sm"
        >
          {isListening ? (
            <>
              <MicOff className="h-4 w-4 mr-2" />
              Stop Recording
            </>
          ) : (
            <>
              <Mic className="h-4 w-4 mr-2" />
              Start Recording
            </>
          )}
        </Button>
        {transcript && (
          <Button onClick={clearTranscript} variant="ghost" size="sm">
            Clear
          </Button>
        )}
      </div>
      {isListening && (
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Volume2 className="h-4 w-4 animate-pulse" />
          <span>Listening...</span>
        </div>
      )}
    </div>
  );
};

export default SpeechToText;
