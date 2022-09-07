export enum MachineStatus {
  Up = "Up",
  Down = "Down",
}

export type MachineStatusResponse = {
  status: MachineStatus;
  ping?: number;
};

export type Machine = {
  name: string;
  ip: string;
  user: string;
};
