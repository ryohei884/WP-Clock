"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { ChangeEvent } from "react";
import { Button } from "@/src/components/button";
import useSound from "use-sound";
import ShotTimeOver from "@/public/sounds/ShotTimeOver.mp3";
import BallKeepStart from "@/public/sounds/BallKeepStart.mp3";
import BallKeepPause from "@/public/sounds/BallKeepPause.mp3";
import Go from "@/public/sounds/Go.mp3";
import Yon from "@/public/sounds/Yon.mp3";
import San from "@/public/sounds/San.mp3";
import Ni from "@/public/sounds/Ni.mp3";
import Ichi from "@/public/sounds/Ichi.mp3";
import { AvatarButton } from "@/src/components/avatar";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowRightEndOnRectangleIcon,
  ArrowLeftEndOnRectangleIcon,
} from "@heroicons/react/24/solid";
import { ClockIcon } from "@heroicons/react/20/solid";

// periods: period in a game
// actualPlay: the exact periods of actual play
// timeout:  the exact periods of timeout
// intervals: intervals between the periods
// possession: the periods of continuous possession of the ball by each team
// reEntry: re-entry times (expiration of the period of exclusion) of excluded players or their subsitutes
// const lengthOfTimeout = [60, 45]; // [length of timeout, timing of signal]
// const intervalsOfPeriods = [120, 180, 120]; // [intervals after 1st, 2nd, 3rd periods]
const lengthOfPossetion = [30, 20]; // [continuous possession of the ball, after shoot]
// const lengthOfExclusion = [20, 240]; // [exclusion, excluded for violent actions]

export default function Controller({
  periods, actualPlay, timeout
}: {
  periods: number; actualPlay: number; timeout: number;
}) {
  const [playGo] = useSound(Go, { volume: 0.5 });
  const [playYon] = useSound(Yon, { volume: 0.5 });
  const [playSan] = useSound(San, { volume: 0.5 });
  const [playNi] = useSound(Ni, { volume: 0.5 });
  const [playIchi] = useSound(Ichi, { volume: 0.5 });
  const [playBallKeepStart] = useSound(BallKeepStart, { volume: 0.1 });
  const [playBallKeepPause] = useSound(BallKeepPause, { volume: 0.1 });
  const [playShotTimeOver] = useSound(ShotTimeOver, { volume: 1 });

  const actualPlayLeft = Number(240);
  const possessionLeft = Number(30);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 600);
    const seconds = Math.floor((time % 600) / 10);
    const msec = (time % 600) - seconds * 10;
    return `${String(minutes).padStart(1, "0")}:${String(seconds).padStart(2, "0")}.${String(msec)}`;
  };


  const [durations, setDurations] = useState<number[]>([
    actualPlay,
    lengthOfPossetion[0],
    lengthOfPossetion[1],
  ]);
  const [timeLefts, setTimeLefts] = useState<number[]>([
    actualPlay * 10,
    lengthOfPossetion[0] * 10,
    lengthOfPossetion[1] * 10,
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
    window.open(`http://localhost:3000/subwindow`, "Child1", "popup");
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="grid grid-cols-3 gap-2 items-center justify-items-center">
        <Button
          className="h-16 items-center justify-items-center transition duration-initial ease-in-out active:scale-110 w-3xs"
          color="light"
        >
          <ArrowLeftEndOnRectangleIcon />
          退水
        </Button>
        <div className="text-9xl font-bold text-gray-800 dark:text-gray-200 text-center">
          {formatTime(actualPlayLeft)}
        </div>
        <Button
          className="h-16  items-center justify-items-center transition duration-initial ease-in-out active:scale-110 w-3xs"
          color="light"
        >
          退水
          <ArrowRightEndOnRectangleIcon />
        </Button>

        <AvatarButton
          className="size-32 text-black bg-white font-bold m-4 transition duration-initial ease-in-out active:scale-110"
          initials="白"
        />
        <AvatarButton
          className="size-32 text-white font-bold m-4 transition duration-initial ease-in-out active:scale-110 bg-linear-135 from-white to-blue-300"
          initials="Nu"
        />
        <AvatarButton
          className="size-32 text-white bg-blue-600 font-bold m-4 transition duration-initial ease-in-out active:scale-110"
          initials="青"
        />

        <Button
          className="h-16 items-center justify-items-center transition duration-initial ease-in-out active:scale-110 w-3xs"
          color="light"
        >
          シュート
          <ArrowRightIcon />
        </Button>
        <div className="text-9xl font-bold text-gray-800 dark:text-gray-200 text-center">
          {formatTime(possessionLeft)}
        </div>
        <Button
          className="h-16 items-center justify-items-centertransition duration-initial ease-in-out active:scale-110 w-3xs"
          color="light"
        >
          <ArrowLeftIcon />
          シュート
        </Button>
      </div>

      <div className="rounded-md bg-blue-50 p-4">
        <div className="flex">
          <div className="shrink-0">
            <ClockIcon aria-hidden="true" className="size-5 text-blue-400" />
          </div>
          <div className="ml-3 flex-1 md:flex md:justify-between">
            <p className="text-sm text-blue-700">
              白５番：再入水エリアに向かわせます。
            </p>
            <p className="mt-3 text-sm md:mt-0 md:ml-6">
              <a
                href="#"
                className="font-medium whitespace-nowrap text-blue-700 hover:text-blue-600"
              >
                再入水エリア到達
                <span aria-hidden="true"> &rarr;</span>
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-md bg-blue-50 p-4">
        <div className="flex">
          <div className="shrink-0">
            <ClockIcon aria-hidden="true" className="size-5 text-blue-400" />
          </div>
          <div className="ml-3 flex-1 md:flex md:justify-between">
            <p className="text-sm text-blue-700">
              白５番：入水まであと{formatTime(possessionLeft)}秒です。
            </p>
            <p className="mt-3 text-sm md:mt-0 md:ml-6">
              <a
                href="#"
                className="font-medium whitespace-nowrap text-blue-700 hover:text-blue-600"
              >
                入水
                <span aria-hidden="true"> &rarr;</span>
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-md bg-blue-50 p-4">
        <div className="flex">
          <div className="shrink-0">
            <ClockIcon aria-hidden="true" className="size-5 text-blue-400" />
          </div>
          <div className="ml-3 flex-1 md:flex md:justify-between">
            <p className="text-sm text-blue-700">
              白５番：入水まであと{formatTime(possessionLeft)}
              秒です。(入水指示/白旗)
            </p>
            <p className="mt-3 text-sm md:mt-0 md:ml-6">
              <a
                href="#"
                className="font-medium whitespace-nowrap text-blue-700 hover:text-blue-600"
              >
                入水確認
                <span aria-hidden="true"> &rarr;</span>
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
