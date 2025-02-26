import { useState } from "react";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
  AddForm,
  ErrorDisplay,
  Loading,
  MachineCard,
  Navbar,
  PowerOffIcon,
} from "./components";
import { getMachines } from "./api";
import { MachineStatus, MachineStatusResponse } from "./types";
import { ArrowPathIcon, PlusIcon } from "@heroicons/react/24/outline";

function App() {
  const [addFormOpen, setAddFormOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["getMachines"],
    queryFn: getMachines,
  });

  return (
    <div>
      <Navbar />
      <AddForm open={addFormOpen} onClose={() => setAddFormOpen(false)} />
      <div className="mx-auto my-5 grid place-items-center">
        <h1 className="text-center text-5xl mb-3 border-b-2 border-b-slate-300">
          Machines
        </h1>
        <div className="mb-10 flex gap-3">
          <button
            className="btn icon-btn primary-btn"
            onClick={() =>
              queryClient.invalidateQueries({ queryKey: ["getMachineStatus"] })
            }
          >
            <ArrowPathIcon className="w-4" />
            Refresh All
          </button>
          <button
            className="btn icon-btn danger-btn"
            onClick={() => {
              if (!data) {
                return;
              }

              const queryData =
                queryClient.getQueriesData<MachineStatusResponse>({
                  queryKey: ["getMachineStatus"],
                });
              const onMachineNames = queryData.reduce((acc, machine) => {
                //@ts-ignore
                const [[, name], { status }] = machine;
                if (status === MachineStatus.Up) {
                  acc.push(name as string);
                }

                return acc;
              }, [] as string[]);

              // TODO: Shutdown all the fltered machines here!
              alert(
                `NOT IMPLEMENTED!\nShutdown: ${JSON.stringify(onMachineNames)}`
              );
            }}
          >
            <PowerOffIcon />
            Shutdown All
          </button>
          <button
            className="btn icon-btn success-btn"
            onClick={() => setAddFormOpen(true)}
          >
            <PlusIcon className="w-4" />
            Add Machine
          </button>
        </div>
        <Loading loading={isLoading} />
        <ErrorDisplay error={error?.toString()} onClose={refetch} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 place-items-center">
          {data?.map((machine) => (
            <MachineCard key={machine.name} machine={machine} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
