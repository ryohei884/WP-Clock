"use client";

import { useState, useRef, useEffect } from "react";
import type { ChangeEvent } from "react";
import { Button } from "@/src/components/button";
import { ShotClock } from "@/src/components/clock/shot-clock";
import useSound from "use-sound";
import ShotTimeOver from "@/public/sounds/ShotTimeOver.mp3";
import BallKeepStart from "@/public/sounds/BallKeepStart.mp3";
import BallKeepPause from "@/public/sounds/BallKeepPause.mp3";

export default function Home() {
  const [playBallKeepStart] = useSound(BallKeepStart, { volume: 0.1 });
  const [playBallKeepPause] = useSound(BallKeepPause, { volume: 0.1 });
  const [playShotTimeOver] = useSound(ShotTimeOver, { volume: 1 });

  const [durations, setDurations] = useState<number[]>([240, 30, 20]);
  const [timeLefts, setTimeLefts] = useState<number[]>([
    240 * 10,
    30 * 10,
    20 * 10,
  ]);
  const [isActives, setIsActives] = useState<boolean[]>([false, false, false]);
  const [isPauseds, setIsPauseds] = useState<boolean[]>([false, false, false]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [timerPaused, setTimerPaused] = useState<boolean>(false);

  const changeIsActives = (index: number, value: boolean): void => {
    const nextIsActives = isActives.map((v, i) => {
      if (i === index) {
        return value;
      } else {
        return v;
      }
    });
    setIsActives(nextIsActives);
  };

  const changeIsPauseds = (index: number, value: boolean): void => {
    const nextIsPauseds = isPauseds.map((v, i) => {
      if (i === index) {
        return value;
      } else {
        return v;
      }
    });
    setIsPauseds(nextIsPauseds);
  };

  const changeTimeLefts = (index: number, value: number): void => {
    const nextTimeLefts = timeLefts.map((v, i) => {
      if (i === index) {
        return value;
      } else {
        return v;
      }
    });
    setTimeLefts(nextTimeLefts);
  };

  const changeDurations = (index: number, value: number): void => {
    const nextDurations = durations.map((v, i) => {
      if (i === index) {
        return value;
      } else {
        return v;
      }
    });
    setDurations(nextDurations);
  };

  const handleSetDuration = (index: number): void => {
    if (durations[index] > 0) {
      changeTimeLefts(index, durations[index] * 10);
      changeIsActives(index, false);
      changeIsPauseds(index, false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const handleStart = (index: number): void => {
    if (timeLefts[index] > 0) {
      changeIsActives(index, true);
      changeIsPauseds(index, false);
    }
    setTimerActive(true);
    setTimerPaused(false);
    playBallKeepStart();
  };

  const handlePause = (index: number): void => {
    if (isActives[index]) {
      changeIsPauseds(index, true);
      changeIsActives(index, false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setTimerActive(false);
      setTimerPaused(true);
      playBallKeepPause();
    }
  };

  const handleReset = (index: number): void => {
    changeIsActives(index, false);
    changeIsPauseds(index, false);
    changeTimeLefts(index, durations[index] * 10);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setTimerActive(false);
    setTimerPaused(false);
  };

  const handleDurationChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement>,
  ): void => {
    changeDurations(index, Number(e.target.value));
  };

  useEffect(() => {
    if (timerActive && !timerPaused) {
      timerRef.current = setInterval(() => {
        setTimeLefts((prevTime) => {
          const nextTimeLefts = prevTime.map((v) => {
            if (v <= 1) {
              playShotTimeOver();
              return 0;
            } else {
              return v - 1;
            }
          });
          return nextTimeLefts;
        });
      }, 100);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timerActive, timerPaused, playShotTimeOver]);

  const OpenSubWindow = () => {
    window.open(`http://localhost:3000/subwindow`, "Child1", "popup");
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Button onClick={OpenSubWindow}>Save changes</Button>
        {timeLefts.map((v, i) => {
          return (
            <ShotClock
              key={i.toString()}
              index={i}
              duration={durations[i]}
              timeLeft={timeLefts[i]}
              isPaused={isPauseds[i]}
              handleSetDuration={(i) => handleSetDuration(i)}
              handleStart={(i) => handleStart(i)}
              handlePause={(i) => handlePause(i)}
              handleReset={(i) => handleReset(i)}
              handleDurationChange={(i, e) => handleDurationChange(i, e)}
            />
          );
        })}
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
    </div>
  );
}
