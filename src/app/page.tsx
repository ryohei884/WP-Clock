"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { ChangeEvent } from "react";
import { Button } from "@/src/components/button";
import { ShotClock } from "@/src/components/clock/shot-clock";
import useSound from "use-sound";
import ShotTimeOver from "@/public/sounds/ShotTimeOver.mp3";
import BallKeepStart from "@/public/sounds/BallKeepStart.mp3";
import BallKeepPause from "@/public/sounds/BallKeepPause.mp3";
import Go from "@/public/sounds/Go.mp3";
import Yon from "@/public/sounds/Yon.mp3";
import San from "@/public/sounds/San.mp3";
import Ni from "@/public/sounds/Ni.mp3";
import Ichi from "@/public/sounds/Ichi.mp3";
import { Link } from "@/src/components/link";

export default function Home() {
  const [playGo] = useSound(Go, { volume: 0.5 });
  const [playYon] = useSound(Yon, { volume: 0.5 });
  const [playSan] = useSound(San, { volume: 0.5 });
  const [playNi] = useSound(Ni, { volume: 0.5 });
  const [playIchi] = useSound(Ichi, { volume: 0.5 });
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
  const [timeNow, setTimeNow] = useState<string>("");
  const timerNowRef = useRef<NodeJS.Timeout | null>(null);

  const changeIsActives = useCallback(
    (index: number, value: boolean): void => {
      const nextIsActives = isActives.map((v, i) => {
        if (i === index) {
          return value;
        } else {
          return v;
        }
      });
      setIsActives(nextIsActives);
    },
    [isActives],
  );

  const changeIsPauseds = useCallback(
    (index: number, value: boolean): void => {
      const nextIsPauseds = isPauseds.map((v, i) => {
        if (i === index) {
          return value;
        } else {
          return v;
        }
      });
      setIsPauseds(nextIsPauseds);
    },
    [isPauseds],
  );

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

  const showCurrentTime = () => {
    const now = new Date();
    const hour = now.getHours();
    const minute = String(now.getMinutes()).padStart(2, "0");
    const second = String(now.getSeconds()).padStart(2, "0");
    // const msec = String(Math.floor(now.getMilliseconds() / 100)).padStart(
    //   1,
    //   "0",
    // );
    const time = `現在の時刻は${hour}時${minute}分${second}秒です。`;
    return time;
  };

  useEffect(() => {
    if (timerActive && !timerPaused) {
      timerRef.current = setInterval(() => {
        setTimeLefts((prevTime) => {
          const nextTimeLefts = prevTime.map((v, i) => {
            if (isActives[i] && !isPauseds[i]) {
              switch (v) {
                case 50:
                  playGo();
                  return v - 1;
                case 40:
                  playYon();
                  return v - 1;
                case 30:
                  playSan();
                  return v - 1;
                case 20:
                  playNi();
                  return v - 1;
                case 10:
                  playIchi();
                  return v - 1;
                case 0:
                  if (isActives[i] && !isPauseds[i]) {
                    playShotTimeOver();
                    changeIsActives(i, false);
                    changeIsPauseds(i, true);
                  }
                  return 0;
                default:
                  return v - 1;
              }
            } else {
              if (v <= 0) {
                return 0;
              } else {
                return v - 1;
              }
            }
          });
          return nextTimeLefts;
        });
      }, 100);
    }

    timerNowRef.current = setInterval(() => {
      setTimeNow(() => {
        const nextTimeNow = showCurrentTime();
        return nextTimeNow;
      });
    }, 100);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (timerNowRef.current) {
        clearInterval(timerNowRef.current);
      }
    };
  }, [
    timerActive,
    timerPaused,
    playShotTimeOver,
    changeIsActives,
    changeIsPauseds,
    playGo,
    playIchi,
    playNi,
    playSan,
    playYon,
    isActives,
    isPauseds,
  ]);

  const OpenSubWindow = () => {
    window.open(`/subwindow`, "Child1", "popup");
  };

  // periods: period in a game
  // actualPlay: the exact periods of actual play
  // timeout:  the exact periods of timeout
  // intervals: intervals between the periods
  // possession: the periods of continuous possession of the ball by each team
  // reEntry: re-entry times (expiration of the period of exclusion) of excluded players or their subsitutes

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Button onClick={OpenSubWindow}>Save changes</Button>
        <Link href="/controller?p=4&a=480&t=2">
          正式競技時間
        </Link>
        <Link href="/controller?p=2&a=240&t=0">
          A区分予選競技時間
        </Link>
        <Link href="/controller?p=4&a=240&t=2">
          A区分決勝競技時間
        </Link>
        <div>
          periods: 4, actualPlay: 8min, timeout: 1min, signal45sec, intervals:
          2min,3min,2min, possession: 20 or 30, reEntry: 20sec of actual play,
          excluded for violent actions=4min
        </div>
        <div>{timeNow}</div>
        <div>ピリオド数(p):4ピリオド(4)</div>
        <div>正味競技時間(a)：8分(480)</div>
        {/* <div>ボール保持時間(b):30秒(30)</div>
        <div>シュート後リセット時間(r):20秒(20)</div> */}
        <div>タイムアウト回数(t):2回(2)</div>
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
