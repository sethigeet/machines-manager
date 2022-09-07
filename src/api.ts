import { QueryClient } from "@tanstack/react-query";

import { invoke } from "@tauri-apps/api/tauri";
import { Machine, MachineStatusResponse } from "./types";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 300 * 1000, // 5 mins
    },
  },
});

export const getMachines = async () => await invoke<Machine[]>("get_machines");
export const getMachineStatus = async (ip: string) =>
  await invoke<MachineStatusResponse>("get_machine_status", { ip });