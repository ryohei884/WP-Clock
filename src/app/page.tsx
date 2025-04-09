"use client";

import { useState, useRef,createRef, useEffect } from "react";
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
  const [timeLefts, setTimeLefts] = useState<number[]>([240*10, 30*10, 20*10]);
  const [isActives, setIsActives] = useState<boolean[]>([false, false, false]);
  const [isPauseds, setIsPauseds] = useState<boolean[]>([false, false, false]);
  const [timerRefs, setTimerRefs] = useState<Array<NodeJS.Timeout | null>>([null, null, null]);
//  const timerRefs = useRef<Array<NodeJS.Timeout | null>>([null, null, null]);

  const handleSetDuration = (index: number): void => {
    if (durations[index] > 0) {

      const nextDurations = durations.map((d, i) => {
        if (i === index) {
          return d;
        } else {
          return d;
        }
      });
      setDurations(nextDurations);

      const nextTimeLefts = nextDurations.map((d, i) => {
        if (i === index) {
          return d * 10;
        } else {
          return d;
        }
      });
      setTimeLefts(nextTimeLefts);

      const nextIsActives = isActives.map((d, i) => {
        if (i === index) {
          return false;
        } else {
          return d;
        }
      });     
      setIsActives(nextIsActives);

      const nextIsPauseds = isPauseds.map((d, i) => {
        if (i === index) {
          return false;
        } else {
          return d;
        }
      });     
      setIsPauseds(nextIsPauseds);

      const nextTimerRefs = timerRefs.map((d, i) => {
        if (i === index) {
          if (d !== null) {
            clearInterval(d);
                }
                return null;
        } else {
          return d;
        }
      });
      setTimerRefs(nextTimerRefs);
    }
  };

  const handleStart = (index: number): void => {
    if (timeLefts[index] > 0) {
      const nextIsActives = isActives.map((d, i) => {
        if (i === index) {
          return true;
        } else {
          return d;
        }
      });     
      setIsActives(nextIsActives);
      const nextIsPauseds = isPauseds.map((d, i) => {
        if (i === index) {
          return false;
        } else {
          return d;
        }
      });     
      setIsPauseds(nextIsPauseds);
    }
    playBallKeepStart();
  };

  const handlePause = (index: number): void => {
    if (isActives[index]) {
      const nextIsPauseds = isPauseds.map((d, i) => {
        if (i === index) {
          return true;
        } else {
          return d;
        }
      });     
      setIsPauseds(nextIsPauseds);

      const nextIsActives = isActives.map((d, i) => {
        if (i === index) {
          return false;
        } else {
          return d;
        }
      });     
      setIsActives(nextIsActives);

      const nextTimerRefs = timerRefs.map((d, i) => {
        if (i === index) {
          if (d !== null) {
            clearInterval(d);
                }
                return null;
        } else {
          return d;
        }
      });
      setTimerRefs(nextTimerRefs);
    }
    playBallKeepPause();
  };

  const handleReset = (index: number): void => {
      const nextIsActives = isActives.map((d, i) => {
        if (i === index) {
          return false;
        } else {
          return d;
        }
      });     
      setIsActives(nextIsActives);

      const nextIsPauseds = isPauseds.map((d, i) => {
        if (i === index) {
          return false;
        } else {
          return d;
        }
      });     
      setIsPauseds(nextIsPauseds);

      const nextTimeLefts = durations.map((d, i) => {
        if (i === index) {
          return typeof d === "number" ? d * 10 : 0;
        } else {
          return d;
        }
      });
      setTimeLefts(nextTimeLefts);

            const nextTimerRefs = timerRefs.map((d, i) => {
        if (i === index) {
          if (d !== null) {
            clearInterval(d);
                }
                return null;
        } else {
          return d;
        }
      });
      setTimerRefs(nextTimerRefs);
  };

  const handleDurationChange = (index: number, e: ChangeEvent<HTMLInputElement>): void => {
    const nextDurations = durations.map((d, i) => {
      if (i === index) {
        return Number(e.target.value);
      } else {
        return d;
      }
    });
    setDurations(nextDurations);
  };

  useEffect(() => {
    if (isActive && !isPaused) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            playShotTimeOver();
            clearInterval(timerRef.current!);
            return 0;
          }
          return prevTime - 1;
        });
      }, 100);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      const nextTimerRefs = timerRefs.map((d, i) => {
          if (d !== null) {
            clearInterval(d);
                }
                return null;
              })
      setTimerRefs(nextTimerRefs);
    };
  }, [isActives, isPauseds, playShotTimeOver]);

  const OpenSubWindow = () => {
    window.open(`http://localhost:3000/subwindow`, "Child1", "popup");
  };
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Button onClick={OpenSubWindow}>Save changes</Button>
        {/* <ShotClock defaultDuration={4 * 60} /> */}
        <ShotClock
          index={0}
          duration={durations[0]}
          timeLeft={timeLefts[0]}
          isPaused={isPauseds[0]}
          handleSetDuration={handleSetDuration}
          handleStart={handleStart}
          handlePause={handlePause}
          handleReset={handleReset}
          handleDurationChange={handleDurationChange}
        />
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center"></footer>
    </div>
  );
}
