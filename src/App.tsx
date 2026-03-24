import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-cyan-400 flex flex-col items-center justify-center p-4 overflow-hidden selection:bg-fuchsia-500 selection:text-black">
      <div className="static-noise"></div>
      <div className="scanlines"></div>
      
      <header className="mb-8 text-center z-10 mt-4 screen-tear">
        <h1 className="text-4xl md:text-6xl glitch-text" data-text="SYS.SNAKE_">
          SYS.SNAKE_
        </h1>
        <p className="text-fuchsia-500 text-[10px] md:text-xs mt-4 tracking-widest bg-black inline-block px-2 border border-fuchsia-500">
          [ PROTOCOL: GLITCH_ART ]
        </p>
      </header>

      <main className="flex flex-col xl:flex-row gap-8 items-center xl:items-start justify-center w-full max-w-6xl z-10 pb-12 screen-tear" style={{animationDelay: '0.5s'}}>
        <div className="flex-1 flex justify-center w-full">
          <SnakeGame />
        </div>
        <div className="w-full max-w-md xl:w-96 flex-shrink-0">
          <MusicPlayer />
        </div>
      </main>
    </div>
  );
}
