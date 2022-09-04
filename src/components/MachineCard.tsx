import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";

import { Machine, MachineStatus } from "../types";

type Props = {
  machine: Machine;
};

export const MachineCard = ({ machine: { name, user, ip, status } }: Props) => {
  return (
    <div className="p-5 bg-slate-200 rounded-lg flex w-80 justify-between">
      <div>
        <h1 className="text-2xl text-slate-800">{name}</h1>
        <h2>{user}</h2>
        <span>{ip}</span>
      </div>
      <div className="w-14 aspect-square rounded-full">
        {status === MachineStatus.Up ? (
          <div className="bg-green-400 rounded-full">
            <ArrowUpIcon className="rounded-full" />
          </div>
        ) : (
          <div className="bg-red-400 rounded-full p-2">
            <ArrowDownIcon className="rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
};
