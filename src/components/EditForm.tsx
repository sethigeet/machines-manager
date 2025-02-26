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
import {
  GlobeAltIcon,
  PencilSquareIcon,
  TrashIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

import { Machine } from "../types";
import { deleteMachine, editMachine } from "../api";
import { ErrorDisplay, Input } from "./";

type Props = {
  open: boolean;
  onClose: () => void;
  initialData: Machine;
};

export const EditForm = ({ initialData, open, onClose }: Props) => {
  const [machine, setMachine] = useState<Machine>(initialData);

  const queryClient = useQueryClient();
  const {
    mutate: mutateEdit,
    isPending: isPendingEdit,
    error: errorEdit,
    reset: resetEdit,
  } = useMutation({
    mutationKey: ["editMachine", initialData.name],
    mutationFn: editMachine,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getMachines"] });
      onClose();
    },
  });
  const {
    mutate: mutateDelete,
    isPending: isPendingDelete,
    error: errorDelete,
    reset: resetDelete,
  } = useMutation({
    mutationKey: ["deleteMachine", initialData.name],
    mutationFn: deleteMachine,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getMachines"] });
      onClose();
    },
  });

  return (
    <>
      <ErrorDisplay
        error={errorEdit?.toString() || errorDelete?.toString()}
        btnText="Ok"
        onClose={() => {
          resetEdit();
          resetDelete();
        }}
      />
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
                    <PencilSquareIcon className="w-8 mr-2" />
                    Edit Machine
                  </DialogTitle>
                  <form
                    className="mt-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      mutateEdit(machine);
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
                        disabled={isPendingEdit || isPendingDelete}
                      >
                        Edit
                        {isPendingEdit ? (
                          <div className="w-4 aspect-square border-2 border-blue-900 border-b-transparent rounded-full animate-spin" />
                        ) : (
                          <PencilSquareIcon className="w-4" />
                        )}
                      </button>
                      <button
                        type="button"
                        className="btn icon-btn danger-btn ml-3"
                        disabled={isPendingEdit || isPendingDelete}
                        onClick={() => mutateDelete(initialData.name)}
                      >
                        Delete
                        {isPendingDelete ? (
                          <div className="w-4 aspect-square border-2 border-red-900 border-b-transparent rounded-full animate-spin" />
                        ) : (
                          <TrashIcon className="w-4" />
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
