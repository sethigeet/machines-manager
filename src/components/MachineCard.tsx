import { useState } from "react";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ClockIcon,
  UserIcon,
  GlobeAltIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { formatDistance } from "date-fns/formatDistance";

import { Machine, MachineStatus } from "../types";
import { getMachineStatus } from "../api";
import { EditForm, ShutdownForm, PowerOffIcon } from "./";

type Props = {
  machine: Machine;
};

export const MachineCard = ({ machine }: Props) => {
  const [editOpen, setEditOpen] = useState(false);
  const [shutdownOpen, setShutdownOpen] = useState(false);

  const {
    data,
    isLoading,
    isRefetching,
    isError,
    isRefetchError,
    refetch,
    dataUpdatedAt,
  } = useQuery({
    queryKey: ["getMachineStatus", machine.name],
    queryFn: () => getMachineStatus(machine.ip),
  });

  const iconClassNames = "rounded-2xl p-2";
  const btnClassNames = `small-circular-btn bg-blue-100 hover:bg-blue-200 focus-visible:ring-blue-500`;

  return (
    <>
      <EditForm
        initialData={machine}
        open={editOpen}
        onClose={() => setEditOpen(false)}
      />
      <ShutdownForm
        machineName={machine.name}
        open={shutdownOpen}
        onClose={() => setShutdownOpen(false)}
      />
      <div className="p-5 bg-blue-50 rounded-lg w-80 flex flex-col drop-shadow-md">
        <div className="flex justify-between">
          <div>
            <span className="flex items-end text-3xl text-slate-800">
              {machine.name}
              <button onClick={() => setEditOpen(true)}>
                <PencilSquareIcon className="w-5 text-slate-400 mb-1 ml-2" />
              </button>
            </span>
            <div className="flex">
              <div className="flex">
                <UserIcon className="w-4" />
                <span className="text-xs text-slate-700 ml-1 font-semibold">
                  {machine.user}
                </span>
              </div>
              <div className="flex ml-2">
                <GlobeAltIcon className="w-[0.75rem]" />
                <span className="text-xs text-slate-700 ml-1 font-semibold">
                  {machine.ip}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <button
              className={`text-red-600 ${btnClassNames}`}
              onClick={() => setShutdownOpen(true)}
              disabled={!data || data.status !== MachineStatus.Up}
            >
              <PowerOffIcon />
            </button>
            <button
              className={`${btnClassNames} mt-2 text-blue-600`}
              onClick={() => refetch()}
            >
              <ArrowPathIcon className="w-5" />
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
                      {data.ping !== null ? `${data.ping?.toFixed(1)}ms` : "-"}
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
    </>
  );
};
