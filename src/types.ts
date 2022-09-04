export enum MachineStatus {
  Up,
  Down,
}

export type Machine = {
  name: string;
  ip: string;
  user: string;
  status?: MachineStatus;
};
