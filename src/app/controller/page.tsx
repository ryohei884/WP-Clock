import { AvatarButton } from "@/src/components/avatar";
import { Button } from "@/src/components/button";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowRightEndOnRectangleIcon,
  ArrowLeftEndOnRectangleIcon,
} from "@heroicons/react/24/solid";
import { ClockIcon } from "@heroicons/react/20/solid";

export default async function Page(/*{
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}*/) {
  // const periods = (await searchParams).p;
  // const actualPlay = (await searchParams).a;
  // const timeout = (await searchParams).t;
  const actualPlayLeft = Number(240);
  const possessionLeft = Number(30);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 600);
    const seconds = Math.floor((time % 600) / 10);
    const msec = (time % 600) - seconds * 10;
    return `${String(minutes).padStart(1, "0")}:${String(seconds).padStart(2, "0")}.${String(msec)}`;
  };

  return (
    <div>
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
