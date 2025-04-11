"use client";

import type { ChangeEvent, MouseEvent } from "react";
import { Input } from "@/src/components/input";
import { Button } from "@/src/components/button";
import useSound from "use-sound";
import Go from "@/public/sounds/Go.mp3";
import Yon from "@/public/sounds/Yon.mp3";
import San from "@/public/sounds/San.mp3";
import Ni from "@/public/sounds/Ni.mp3";
import Ichi from "@/public/sounds/Ichi.mp3";

export function ShotClock({
  index,
  duration,
  timeLeft,
  isPaused,
  handleSetDuration,
  handleStart,
  handlePause,
  handleReset,
  handleDurationChange,
}: {
  index: number;
  duration: number;
  timeLeft: number;
  isPaused: boolean;
  handleSetDuration: (index: number) => void;
  handleStart: (index: number) => void;
  handlePause: (index: number) => void;
  handleReset: (index: number) => void;
  handleDurationChange: (
    index: number,
    e: ChangeEvent<HTMLInputElement>,
  ) => void;
}) {
  const [playGo] = useSound(Go, { volume: 0.5 });
  const [playYon] = useSound(Yon, { volume: 0.5 });
  const [playSan] = useSound(San, { volume: 0.5 });
  const [playNi] = useSound(Ni, { volume: 0.5 });
  const [playIchi] = useSound(Ichi, { volume: 0.5 });

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 600);
    const seconds = Math.floor((time % 600) / 10);
    const msec = (time % 600) - seconds * 10;
    switch (time) {
      case 50:
        playGo();
        break;
      case 40:
        playYon();
        break;
      case 30:
        playSan();
        break;
      case 20:
        playNi();
        break;
      case 10:
        playIchi();
        break;
      default:
        break;
    }
    return `${String(minutes).padStart(1, "0")}:${String(seconds).padStart(2, "0")}.${String(msec)}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md">
      {/* Title of the countdown timer */}
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200 text-center">
        Countdown Timer
      </h1>
      {/* Input and set button container */}
      <div className="flex items-center mb-6">
        <Input
          type="number"
          id="duration"
          placeholder="Enter duration in seconds"
          value={duration}
          onChange={(e) => {
            handleDurationChange(index, e);
          }}
          className="flex-1 mr-4 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
        />
        <Button
          onClick={() => handleSetDuration(index)}
          className="text-gray-800 dark:text-gray-200"
        >
          Set
        </Button>
      </div>
      {/* Display the formatted time left */}
      <div className="text-6xl font-bold text-gray-800 dark:text-gray-200 mb-8 text-center">
        {formatTime(timeLeft)}
      </div>
      {/* Buttons to start, pause, and reset the timer */}
      <div className="flex justify-center gap-4">
        <Button
          onMouseDown={() => handleStart(index)}
          onMouseUp={() => handlePause(index)}
          onContextMenu={(e: MouseEvent) => {
            e.preventDefault();
          }}
          onTouchStart={() => handleStart(index)}
          onTouchEnd={() => handlePause(index)}
          className="text-gray-800 dark:text-gray-200"
        >
          {isPaused ? "Resume" : "Start"}
        </Button>
        <Button
          onClick={() => handleReset(index)}
          className="text-gray-800 dark:text-gray-200"
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
