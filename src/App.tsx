/* import { invoke } from "@tauri-apps/api/tauri"; */

import { MachineCard, Navbar } from "./components";
import { Machine } from "./types";

const MACHINES: Machine[] = [
  {
    name: "My Test",
    ip: "127.0.0.1",
    user: "Test User",
  },
];

function App() {
  return (
    <div>
      <Navbar />
      <div className="mx-auto my-5 grid place-items-center">
        <h1 className="text-center text-5xl">Machines</h1>
        <br />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 place-items-center">
          <MachineCard machine={MACHINES[0]} />
          <MachineCard machine={MACHINES[0]} />
          <MachineCard machine={MACHINES[0]} />
          <MachineCard machine={MACHINES[0]} />
          <MachineCard machine={MACHINES[0]} />
          <MachineCard machine={MACHINES[0]} />
          <MachineCard machine={MACHINES[0]} />
          <MachineCard machine={MACHINES[0]} />
          <MachineCard machine={MACHINES[0]} />
          <MachineCard machine={MACHINES[0]} />
          <MachineCard machine={MACHINES[0]} />
        </div>
      </div>
    </div>
  );
}

export default App;
