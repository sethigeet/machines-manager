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
import { PowerOffIcon, RefreshIcon } from "./icons";

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
            <PowerOffIcon />
          </button>
          <button
            className={`${btnClassNames} mt-2 text-blue-600`}
            onClick={() => refetch()}
          >
            <RefreshIcon />
          </button>
        </div>
      </div>
      <div className="mt-4 self-center w-3/4 text-center">
        <div className="flex justify-evenly">
          {isLoading || isRefetching ? (
            <div>
              <div className="w-14 aspect-square rounded-2xl">
                <div className={`bg-amber-300 ${iconClassNames}`}>
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
