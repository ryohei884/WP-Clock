export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const numberOfPeriods = (await searchParams).nop;
  const shotClock = (await searchParams).shot;
  const exclusionClock = (await searchParams).ex;
  const shootReset = (await searchParams).shoot;

  return (
    <div>
      <h1>Number of Periods: {numberOfPeriods}</h1>
      <h1>Shot Clock: {shotClock}</h1>
      <h1>Exclusion Clock: {exclusionClock}</h1>
      <h1>Shoot Reset: {shootReset}</h1>
    </div>
  );
}
