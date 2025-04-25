"use client";

import { useState, useRef, useEffect } from "react";
export default function NowClock() {
    const [timeNow, setTimeNow] = useState<string>("");
    const timerNowRef = useRef<NodeJS.Timeout | null>(null);
    const showCurrentTime = () => {
        const now = new Date();
        const hour = now.getHours();
        const minute = String(now.getMinutes()).padStart(2, "0");
        const second = String(now.getSeconds()).padStart(2, "0");
        const time = `現在の時刻は${hour}時${minute}分${second}秒です。`;
        return time;
      };

      useEffect(() => {
        timerNowRef.current = setInterval(() => {
          setTimeNow(() => {
            const nextTimeNow = showCurrentTime();
            return nextTimeNow;
          });
        }, 100);
    
        return () => {
          if (timerNowRef.current) {
            clearInterval(timerNowRef.current);
          }
        };
      }, []);

      return (
        <div>{timeNow}</div>
      )
}