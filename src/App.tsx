/* import { invoke } from "@tauri-apps/api/tauri"; */

import { MachineCard } from "./components/MachineCard";
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
    <div className="mx-10 my-5 max-w-3xl">
      <h1 className="text-3xl">Machines</h1>
      <br />
      <MachineCard machine={MACHINES[0]} />
    </div>
  );
}

export default App;
