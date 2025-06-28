import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react"; // <-- импорт Play-иконки

export function AudioOnDemand({ audioId }: { audioId: string }) {
  const [visible, setVisible] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    setVisible(false);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeAttribute("src");
      audioRef.current.load();
    }
  }, [audioId]);

  return (
    <div >
      {!visible ? (
        <button
          onClick={() => setVisible(true)}
          className="p-3 text-white rounded-full cursor-pointer bg-white/20 backdrop-blur-md transition-colors hover:bg-primary"
        >
          <Play className="w-6 h-6" />
        </button>
      ) : (
        <audio
          ref={audioRef}
          controls
          controlsList="nodownload"
          preload="none"
          src={`https://backend.avtotest-begzod.uz/api/v1/file/download/audio/${audioId}`}
          autoPlay
        />
      )}
    </div>
  );
}
