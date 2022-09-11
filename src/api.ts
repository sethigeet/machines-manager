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
export const getAutoRefresh = async () =>
  await invoke<boolean>("get_auto_refresh");
export const setAutoRefresh = async (autoRefresh: boolean) =>
  await invoke<null>("set_auto_refresh", { autoRefresh });
export const addMachine = async (machine: Machine) =>
  await invoke<null>("add_machine", { machine });
export const editMachine = async (machine: Machine) =>
  await invoke<null>("edit_machine", { machine });
export const deleteMachine = async (machineName: string) =>
  await invoke<null>("delete_machine", { machineName });
export const shutdownMachine = async ({
  machineName,
  password,
}: {
  machineName: string;
  password: string;
}) => await invoke<null>("shutdown_machine", { machineName, password });
