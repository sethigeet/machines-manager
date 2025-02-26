import { Fragment, useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogTitle,
  DialogPanel,
  Transition,
  TransitionChild,
  DialogBackdrop,
} from "@headlessui/react";
import { GlobeAltIcon, PlusIcon, UserIcon } from "@heroicons/react/24/outline";

import { Machine } from "../types";
import { addMachine } from "../api";
import { ErrorDisplay, Input } from "./";

type Props = {
  open: boolean;
  onClose: () => void;
};

export const AddForm = ({ open, onClose }: Props) => {
  const [machine, setMachine] = useState<Machine>({} as Machine);

  const queryClient = useQueryClient();
  const { mutate, isPending, error, reset } = useMutation({
    mutationKey: ["addMachine"],
    mutationFn: addMachine,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getMachines"] });
      onClose();
    },
  });

  return (
    <>
      <ErrorDisplay error={error?.toString()} onClose={reset} btnText="Ok" />
      <Transition appear show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={onClose}>
          <DialogBackdrop className="fixed inset-0 bg-black/30" />
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="flex flex-col w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 align-middle shadow-xl transition-all">
                  <DialogTitle
                    as="h3"
                    className="mx-auto flex items-center text-2xl font-medium leading-6 text-slate-900 border-b-2 border-b-slate-300"
                  >
                    <PlusIcon className="w-8 mr-2" />
                    Add a New Machine
                  </DialogTitle>
                  <form
                    className="mt-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      mutate(machine);
                    }}
                  >
                    <Input
                      label="Name"
                      value={machine.name}
                      setValue={(val) =>
                        setMachine((m) => ({ ...m, name: val }))
                      }
                      icon={<UserIcon className="w-4" />}
                    />
                    <Input
                      label="User"
                      value={machine.user}
                      setValue={(val) =>
                        setMachine((m) => ({ ...m, user: val }))
                      }
                      icon={<UserIcon className="w-4" />}
                      className="mt-2"
                    />
                    <Input
                      label="IP / Hostname"
                      value={machine.ip}
                      setValue={(val) => setMachine((m) => ({ ...m, ip: val }))}
                      icon={<GlobeAltIcon className="w-4" />}
                      className="mt-2"
                    />
                    <div className="mt-4">
                      <button
                        type="submit"
                        className="btn icon-btn primary-btn"
                        disabled={isPending}
                      >
                        Add
                        {isPending ? (
                          <div className="w-4 aspect-square border-2 border-blue-900 border-b-transparent rounded-full animate-spin" />
                        ) : (
                          <PlusIcon className="w-4" />
                        )}
                      </button>
                    </div>
                  </form>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
