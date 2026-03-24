import React, { useState, useRef, useEffect } from 'react';

const TRACKS = [
  { id: 1, title: "DATA_STREAM_01", artist: "SYS.OP", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: 2, title: "MEM_LEAK_02", artist: "SYS.OP", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id: 3, title: "NULL_PTR_03", artist: "SYS.OP", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    } else if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const playNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const playPrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleTrackEnd = () => {
    playNext();
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - bounds.left) / bounds.width;
      audioRef.current.currentTime = percent * audioRef.current.duration;
      setProgress(percent * 100);
    }
  };

  return (
    <div className="w-full bg-black border-4 border-cyan-400 p-6 shadow-[8px_8px_0_#ff00ff] flex flex-col items-center relative">
      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
      />

      <div className="w-full border-b-2 border-fuchsia-500 pb-2 mb-4 flex justify-between items-center">
        <span className="text-[10px] text-fuchsia-500">AUDIO_SUBROUTINE</span>
        <span className="text-[10px] text-cyan-400 animate-pulse">{isPlaying ? 'ACTIVE' : 'IDLE'}</span>
      </div>

      <div className="text-center mb-6 w-full">
        <h3 className="text-sm text-cyan-400 truncate px-2">{currentTrack.title}</h3>
        <p className="text-[10px] text-fuchsia-500 mt-2">BY: {currentTrack.artist}</p>
      </div>

      <div 
        className="w-full h-4 bg-gray-900 border-2 border-cyan-400 mb-6 cursor-pointer relative"
        onClick={handleProgressClick}
      >
        <div 
          className="absolute top-0 left-0 h-full bg-fuchsia-500 transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="flex items-center justify-center gap-4 mb-6">
        <button 
          onClick={playPrev}
          className="px-3 py-2 bg-black border-2 border-cyan-400 text-cyan-400 text-[10px] hover:bg-cyan-400 hover:text-black transition-colors"
        >
          [PREV]
        </button>
        
        <button 
          onClick={togglePlay}
          className="px-4 py-2 bg-fuchsia-500 border-2 border-fuchsia-500 text-black text-xs hover:bg-black hover:text-fuchsia-500 transition-colors"
        >
          {isPlaying ? '[PAUSE]' : '[PLAY]'}
        </button>
        
        <button 
          onClick={playNext}
          className="px-3 py-2 bg-black border-2 border-cyan-400 text-cyan-400 text-[10px] hover:bg-cyan-400 hover:text-black transition-colors"
        >
          [NEXT]
        </button>
      </div>

      <div className="flex items-center gap-4 w-full px-2 border-t-2 border-cyan-900 pt-4">
        <button onClick={() => setIsMuted(!isMuted)} className="text-[10px] text-fuchsia-500 hover:text-cyan-400">
          {isMuted || volume === 0 ? 'VOL:MUTE' : 'VOL:LVL'}
        </button>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={isMuted ? 0 : volume}
          onChange={(e) => {
            setVolume(parseFloat(e.target.value));
            setIsMuted(false);
          }}
          className="flex-1 h-2 bg-gray-900 border border-cyan-400 appearance-none cursor-pointer accent-fuchsia-500"
        />
      </div>
    </div>
  );
}
