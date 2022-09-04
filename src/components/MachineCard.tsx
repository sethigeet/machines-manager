import {
  ArrowUpIcon,
  ArrowDownIcon,
  ClockIcon,
  ArrowPathIcon,
  UserIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";

import { Machine, MachineStatus } from "../types";

type Props = {
  machine: Machine;
};

export const MachineCard = ({ machine: { name, user, ip } }: Props) => {
  // TODO: Replace these with actual values
  const status = MachineStatus.Up;
  const ping = 80;

  const iconClassNames = "rounded-2xl p-2";
  const btnClassNames =
    "w-7 aspect-square p-1 rounded-full bg-blue-100 flex justify-center items-center hover:bg-blue-200 transition-colors";

  return (
    <div className="p-5 bg-blue-50 rounded-lg w-80 flex flex-col drop-shadow-md">
      <div className="flex justify-between">
        <div>
          <span className="text-3xl text-slate-800">{name}</span>
          <div className="flex">
            <div className="flex">
              <UserIcon className="w-4" />
              <span className="text-xs text-slate-700 ml-1 font-semibold">
                {user}
              </span>
            </div>
            <div className="flex ml-2">
              <GlobeAltIcon className="w-[0.75rem]" />
              <span className="text-xs text-slate-700 ml-1 font-semibold">
                {ip}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <button className={btnClassNames}>
            <svg
              viewBox="64 64 896 896"
              focusable="false"
              data-icon="poweroff"
              width="1em"
              height="1em"
              fill="currentColor"
              aria-hidden="true"
              className="text-red-600"
            >
              <path d="M705.6 124.9a8 8 0 00-11.6 7.2v64.2c0 5.5 2.9 10.6 7.5 13.6a352.2 352.2 0 0162.2 49.8c32.7 32.8 58.4 70.9 76.3 113.3a355 355 0 0127.9 138.7c0 48.1-9.4 94.8-27.9 138.7a355.92 355.92 0 01-76.3 113.3 353.06 353.06 0 01-113.2 76.4c-43.8 18.6-90.5 28-138.5 28s-94.7-9.4-138.5-28a353.06 353.06 0 01-113.2-76.4A355.92 355.92 0 01184 650.4a355 355 0 01-27.9-138.7c0-48.1 9.4-94.8 27.9-138.7 17.9-42.4 43.6-80.5 76.3-113.3 19-19 39.8-35.6 62.2-49.8 4.7-2.9 7.5-8.1 7.5-13.6V132c0-6-6.3-9.8-11.6-7.2C178.5 195.2 82 339.3 80 506.3 77.2 745.1 272.5 943.5 511.2 944c239 .5 432.8-193.3 432.8-432.4 0-169.2-97-315.7-238.4-386.7zM480 560h64c4.4 0 8-3.6 8-8V88c0-4.4-3.6-8-8-8h-64c-4.4 0-8 3.6-8 8v464c0 4.4 3.6 8 8 8z"></path>
            </svg>
          </button>
          <button className={`${btnClassNames} mt-2`}>
            <ArrowPathIcon className="text-blue-900" />
          </button>
        </div>
      </div>
      <div className="mt-4 self-center w-3/4 text-center">
        <div className="flex justify-evenly">
          <div>
            <div className="w-14 aspect-square rounded-2xl">
              {status === MachineStatus.Up ? (
                <div className={`bg-green-400 ${iconClassNames}`}>
                  <ArrowUpIcon className="rounded-2xl" />
                </div>
              ) : (
                <div className={`bg-red-400 ${iconClassNames}`}>
                  <ArrowDownIcon className="rounded-2xl" />
                </div>
              )}
            </div>
            <span className="text-sm text-slate-700 font-semibold">
              {status}
            </span>
          </div>

          <div>
            <div className="w-14 aspect-square rounded-2xl">
              <div className={`bg-blue-200 ${iconClassNames}`}>
                <ClockIcon className="rounded-2xl" />
              </div>
            </div>
            <span className="text-sm text-slate-700 font-semibold">
              {ping}ms
            </span>
          </div>
        </div>
        <span className="text-xs text-slate-600">(Refreshed 5s ago!)</span>
      </div>
    </div>
  );
};
