export enum MachineStatus {
  Up = "UP",
  Down = "DOWN",
}

export type Machine = {
  name: string;
  ip: string;
  user: string;
};
