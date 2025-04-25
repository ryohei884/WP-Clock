import NowClock from "@/src/components/clock/now-clock";
import Controller from "@/src/components/clock/controller"

const defaultPeriods = 4;
const defaultActualPlay = 480; // 8 min
const defaultTimeout = 2;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const periods = (await searchParams).p;
  const actualPlay = (await searchParams).a;
  const timeout = (await searchParams).t;

  const check_periods = (periods: string | string[] | undefined):number => {
    const checkedPeriods:number = Number(periods) ? Number(periods) : defaultPeriods;
    return checkedPeriods;
  }

  const check_actual_play = (actualPlay: string | string[] | undefined):number => {
    const checkedActualPlay:number = Number(actualPlay) ? Number(actualPlay) :  defaultActualPlay;
    return checkedActualPlay;
  }

  const check_timeout = (timeout: string | string[] | undefined):number => {
    const checkedTimeout:number = Number(timeout) ? Number(timeout) :  defaultTimeout;
    return checkedTimeout;
  }

  return (
    <div>
      <NowClock />
      <Controller periods={check_periods(periods)} actualPlay={check_actual_play(actualPlay)} timeout={check_timeout(timeout)} />
    </div>
  );
}
