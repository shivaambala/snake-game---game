import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const INITIAL_SPEED = 90;

type Point = { x: number; y: number };

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 15, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const directionRef = useRef<Point>(INITIAL_DIRECTION);
  const nextDirectionRef = useRef<Point>(INITIAL_DIRECTION);
  const gameLoopRef = useRef<number | null>(null);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    let isOccupied = true;
    while (isOccupied) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      isOccupied = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    }
    return newFood!;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    directionRef.current = INITIAL_DIRECTION;
    nextDirectionRef.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setGameOver(false);
    setScore(0);
    setHasStarted(true);
    setIsPaused(false);
  };

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused || !hasStarted) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      directionRef.current = nextDirectionRef.current;
      const newHead = {
        x: head.x + directionRef.current.x,
        y: head.y + directionRef.current.y,
      };

      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE ||
        prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setGameOver(true);
        setHasStarted(false);
        if (score > highScore) setHighScore(score);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, gameOver, isPaused, hasStarted, score, highScore, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' && hasStarted && !gameOver) {
        setIsPaused(p => !p);
        return;
      }

      if (!hasStarted && !gameOver && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d"].includes(e.key)) {
         setHasStarted(true);
      }

      const { x, y } = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (y !== 1) nextDirectionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (y !== -1) nextDirectionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (x !== 1) nextDirectionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (x !== -1) nextDirectionRef.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasStarted, gameOver]);

  useEffect(() => {
    if (hasStarted && !isPaused && !gameOver) {
      const speed = Math.max(30, INITIAL_SPEED - Math.floor(score / 50) * 5);
      gameLoopRef.current = window.setInterval(moveSnake, speed);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, hasStarted, isPaused, gameOver, score]);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex justify-between w-full max-w-md mb-4 px-4 py-2 bg-black border-4 border-cyan-400 shadow-[4px_4px_0_#ff00ff]">
        <div className="flex flex-col">
          <span className="text-[10px] text-fuchsia-500 mb-1">SCORE</span>
          <span className="text-xl text-cyan-400">{score.toString().padStart(4, '0')}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-fuchsia-500 mb-1">HI_SCORE</span>
          <span className="text-xl text-cyan-400">{highScore.toString().padStart(4, '0')}</span>
        </div>
      </div>

      <div className="relative p-1 bg-black border-4 border-fuchsia-500 shadow-[8px_8px_0_#00ffff]">
        <div 
          className="grid bg-black"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            width: 'min(85vw, 400px)',
            height: 'min(85vw, 400px)'
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const snakeIndex = snake.findIndex(segment => segment.x === x && segment.y === y);
            const isSnake = snakeIndex !== -1;
            const isHead = snakeIndex === 0;
            const isFood = food.x === x && food.y === y;

            return (
              <div 
                key={i} 
                className="w-full h-full border-[1px] border-cyan-900/30 flex items-center justify-center"
              >
                {isHead && <div className="w-full h-full bg-cyan-400" />}
                {isSnake && !isHead && (
                  <div 
                    className="w-full h-full bg-cyan-400" 
                    style={{ 
                      opacity: Math.max(0.3, 1 - (snakeIndex / snake.length)),
                      transform: `scale(${Math.max(0.6, 1 - (snakeIndex / (snake.length * 2)))})`
                    }}
                  />
                )}
                {isFood && <div className="w-4/5 h-4/5 bg-fuchsia-500 animate-pulse" />}
              </div>
            );
          })}
        </div>

        {(!hasStarted && !gameOver) && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20">
            <div className="text-center">
              <p className="text-cyan-400 text-sm md:text-base mb-2 animate-pulse">INSERT COIN</p>
              <p className="text-fuchsia-500 text-[10px]">[PRESS ANY KEY]</p>
            </div>
          </div>
        )}

        {isPaused && hasStarted && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20">
            <p className="text-fuchsia-500 text-2xl glitch-text" data-text="PAUSED">PAUSED</p>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-20 border-4 border-red-500">
            <p className="text-red-500 text-2xl mb-4 glitch-text" data-text="FATAL_ERR">FATAL_ERR</p>
            <p className="text-cyan-400 text-xs mb-6">SCORE: {score}</p>
            <button 
              onClick={resetGame}
              className="px-4 py-2 bg-black border-2 border-fuchsia-500 text-fuchsia-500 text-xs hover:bg-fuchsia-500 hover:text-black transition-colors"
            >
              [ REBOOT ]
            </button>
          </div>
        )}
      </div>
      
      <div className="mt-6 flex flex-col items-center gap-2 text-[10px] text-cyan-600">
        <span>[WASD/ARROWS] : MOVE</span>
        <span>[SPACE] : PAUSE</span>
      </div>
    </div>
  );
}
