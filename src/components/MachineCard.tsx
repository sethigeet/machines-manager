import {
  ArrowUpIcon,
  ArrowDownIcon,
  ClockIcon,
  UserIcon,
  GlobeAltIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import formatDistance from "date-fns/formatDistance";

import { Machine, MachineStatus } from "../types";
import { getMachineStatus } from "../api";

type Props = {
  machine: Machine;
};

export const MachineCard = ({ machine: { name, user, ip } }: Props) => {
  const {
    data,
    isLoading,
    isRefetching,
    isError,
    isRefetchError,
    refetch,
    dataUpdatedAt,
  } = useQuery(["getMachineStatus", ip], () => getMachineStatus(ip));

  const iconClassNames = "rounded-2xl p-2";
  const btnClassNames = `small-circular-btn bg-blue-100 hover:bg-blue-200 focus-visible:ring-blue-500`;

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
          <button
            className={`text-red-600 ${btnClassNames}`}
            disabled={!data || data.status !== MachineStatus.Up}
          >
            <svg
              viewBox="64 64 896 896"
              focusable="false"
              data-icon="poweroff"
              width="1em"
              height="1em"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M705.6 124.9a8 8 0 00-11.6 7.2v64.2c0 5.5 2.9 10.6 7.5 13.6a352.2 352.2 0 0162.2 49.8c32.7 32.8 58.4 70.9 76.3 113.3a355 355 0 0127.9 138.7c0 48.1-9.4 94.8-27.9 138.7a355.92 355.92 0 01-76.3 113.3 353.06 353.06 0 01-113.2 76.4c-43.8 18.6-90.5 28-138.5 28s-94.7-9.4-138.5-28a353.06 353.06 0 01-113.2-76.4A355.92 355.92 0 01184 650.4a355 355 0 01-27.9-138.7c0-48.1 9.4-94.8 27.9-138.7 17.9-42.4 43.6-80.5 76.3-113.3 19-19 39.8-35.6 62.2-49.8 4.7-2.9 7.5-8.1 7.5-13.6V132c0-6-6.3-9.8-11.6-7.2C178.5 195.2 82 339.3 80 506.3 77.2 745.1 272.5 943.5 511.2 944c239 .5 432.8-193.3 432.8-432.4 0-169.2-97-315.7-238.4-386.7zM480 560h64c4.4 0 8-3.6 8-8V88c0-4.4-3.6-8-8-8h-64c-4.4 0-8 3.6-8 8v464c0 4.4 3.6 8 8 8z"></path>
            </svg>
          </button>
          <button
            className={`${btnClassNames} mt-2 text-blue-600`}
            onClick={() => refetch()}
          >
            <svg
              viewBox="64 64 896 896"
              focusable="false"
              data-icon="reload"
              width="1em"
              height="1em"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M909.1 209.3l-56.4 44.1C775.8 155.1 656.2 92 521.9 92 290 92 102.3 279.5 102 511.5 101.7 743.7 289.8 932 521.9 932c181.3 0 335.8-115 394.6-276.1 1.5-4.2-.7-8.9-4.9-10.3l-56.7-19.5a8 8 0 00-10.1 4.8c-1.8 5-3.8 10-5.9 14.9-17.3 41-42.1 77.8-73.7 109.4A344.77 344.77 0 01655.9 829c-42.3 17.9-87.4 27-133.8 27-46.5 0-91.5-9.1-133.8-27A341.5 341.5 0 01279 755.2a342.16 342.16 0 01-73.7-109.4c-17.9-42.4-27-87.4-27-133.9s9.1-91.5 27-133.9c17.3-41 42.1-77.8 73.7-109.4 31.6-31.6 68.4-56.4 109.3-73.8 42.3-17.9 87.4-27 133.8-27 46.5 0 91.5 9.1 133.8 27a341.5 341.5 0 01109.3 73.8c9.9 9.9 19.2 20.4 27.8 31.4l-60.2 47a8 8 0 003 14.1l175.6 43c5 1.2 9.9-2.6 9.9-7.7l.8-180.9c-.1-6.6-7.8-10.3-13-6.2z"></path>
            </svg>
          </button>
        </div>
      </div>
      <div className="mt-4 self-center w-3/4 text-center">
        <div className="flex justify-evenly">
          {isLoading || isRefetching ? (
            <div>
              <div className="w-14 aspect-square rounded-2xl">
                <div className={`bg-blue-400 ${iconClassNames}`}>
                  <div className="w-10 aspect-square border-4 border-white border-b-transparent rounded-full animate-spin" />
                </div>
              </div>
              <span className="text-sm text-slate-700 font-semibold">
                Loading...
              </span>
            </div>
          ) : isError || isRefetchError ? (
            <div>
              <div className="w-14 aspect-square rounded-2xl">
                <div className={`bg-red-400 ${iconClassNames}`}>
                  <ExclamationCircleIcon className="rounded-2xl" />
                </div>
              </div>
              <span className="text-sm text-slate-700 font-semibold">
                Errored
              </span>
            </div>
          ) : (
            data && (
              <>
                <div>
                  <div className="w-14 aspect-square rounded-2xl">
                    {data.status === MachineStatus.Up ? (
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
                    {data.status}
                  </span>
                </div>

                <div>
                  <div className="w-14 aspect-square rounded-2xl">
                    <div className={`bg-blue-200 ${iconClassNames}`}>
                      <ClockIcon className="rounded-2xl" />
                    </div>
                  </div>
                  <span className="text-sm text-slate-700 font-semibold">
                    {data.ping !== null ? `${data.ping}ms` : "-"}
                  </span>
                </div>
              </>
            )
          )}
        </div>
        <span className="text-xs text-slate-600">
          (Refreshed {formatDistance(Date.now(), dataUpdatedAt)} ago!)
        </span>
      </div>
    </div>
  );
};
