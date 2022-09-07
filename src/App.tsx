import { useQuery } from "@tanstack/react-query";

import { ErrorDisplay, Loading, MachineCard, Navbar } from "./components";
import { getMachines } from "./api";

function App() {
  const { data, isLoading, error, refetch } = useQuery(
    ["getMachines"],
    getMachines
  );

  return (
    <div>
      <Navbar />
      <div className="mx-auto my-5 grid place-items-center">
        <h1 className="text-center text-5xl mb-10 border-b-2 border-b-slate-300">
          Machines
        </h1>
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
