'use client'

import { Button } from '@/src/components/button'
import { ShotClock } from '@/src/components/clock/shot-clock';


export default function Home() {
  const OpenSubWindow = () => {
      window.open(
        `http://localhost:3000/subwindow`,
        'Child1',
        'popup'
      )
  }
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Button onClick={OpenSubWindow} >Save changes</Button>
        <ShotClock />
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
      </footer>
    </div>
  );
}
