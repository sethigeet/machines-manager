import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
  ErrorDisplay,
  Loading,
  MachineCard,
  Navbar,
  PowerOffIcon,
  RefreshIcon,
} from "./components";
import { getMachines } from "./api";
import { MachineStatus, MachineStatusResponse } from "./types";

function App() {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery(
    ["getMachines"],
    getMachines
  );

  return (
    <div>
      <Navbar />
      <div className="mx-auto my-5 grid place-items-center">
        <h1 className="text-center text-5xl mb-3 border-b-2 border-b-slate-300">
          Machines
        </h1>
        <div className="mb-10 flex gap-3">
          <button
            className="icon-btn primary-btn"
            onClick={() => queryClient.invalidateQueries(["getMachineStatus"])}
          >
            <RefreshIcon />
            Refresh All
          </button>
          <button
            className="icon-btn danger-btn"
            onClick={() => {
              if (!data) {
                return;
              }

              const queryData =
                queryClient.getQueriesData<MachineStatusResponse>([
                  "getMachineStatus",
                ]);
              const onMachineNames = queryData.reduce((acc, machine) => {
                const [[, name], { status }] = machine;
                if (status === MachineStatus.Up) {
                  acc.push(name as string);
                }

                return acc;
              }, [] as string[]);

              // TODO: Shutdown all the fltered machines here!
              console.log(onMachineNames);
            }}
          >
            <PowerOffIcon />
            Shutdown All
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
