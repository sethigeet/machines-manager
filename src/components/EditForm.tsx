import { Fragment, useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, Transition } from "@headlessui/react";
import {
  GlobeAltIcon,
  PencilSquareIcon,
  TrashIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

import { Machine } from "../types";
import { deleteMachine, editMachine } from "../api";
import { ErrorDisplay } from "./";

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
    isLoading: isLoadingEdit,
    error: errorEdit,
    reset: resetEdit,
  } = useMutation(["editMachine", initialData.name], editMachine, {
    onSuccess: () => {
      queryClient.invalidateQueries(["getMachines"]);
      onClose();
    },
  });
  const {
    mutate: mutateDelete,
    isLoading: isLoadingDelete,
    error: errorDelete,
    reset: resetDelete,
  } = useMutation(["deleteMachine", initialData.name], deleteMachine, {
    onSuccess: () => {
      queryClient.invalidateQueries(["getMachines"]);
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
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="flex flex-col w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="mx-auto flex items-center text-2xl font-medium leading-6 text-slate-900 border-b-2 border-b-slate-300"
                  >
                    <PencilSquareIcon className="w-8 mr-2" />
                    Edit Machine
                  </Dialog.Title>
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
                        className="icon-btn primary-btn"
                        disabled={isLoadingEdit || isLoadingDelete}
                      >
                        Edit
                        {isLoadingEdit ? (
                          <div className="w-4 aspect-square border-2 border-blue-900 border-b-transparent rounded-full animate-spin" />
                        ) : (
                          <PencilSquareIcon className="w-4" />
                        )}
                      </button>
                      <button
                        type="button"
                        className="icon-btn danger-btn ml-3"
                        disabled={isLoadingEdit || isLoadingDelete}
                        onClick={() => mutateDelete(initialData.name)}
                      >
                        Delete
                        {isLoadingDelete ? (
                          <div className="w-4 aspect-square border-2 border-red-900 border-b-transparent rounded-full animate-spin" />
                        ) : (
                          <TrashIcon className="w-4" />
                        )}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

type InputProps = {
  label: string;
  value: string;
  setValue: (newVal: string) => void;
  icon: JSX.Element;
  className?: string;
};

function Input({ label, value, setValue, icon, className }: InputProps) {
  return (
    <div className={`text-left ${className}`}>
      <label
        htmlFor={label}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <div className="relative mt-1 rounded-md shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <span className="text-gray-500 sm:text-sm">{icon}</span>
        </div>
        <input
          type="text"
          name={label}
          id={label}
          className="block w-full rounded-md border-gray-300 pl-9 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    </div>
  );
}
