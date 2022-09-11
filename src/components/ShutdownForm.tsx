import { Fragment, useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, Transition } from "@headlessui/react";
import { UserIcon } from "@heroicons/react/24/outline";

import { shutdownMachine } from "../api";
import { ErrorDisplay, PowerOffIcon, Input } from "./";

type Props = {
  open: boolean;
  onClose: () => void;
  machineName: string;
};

export const ShutdownForm = ({ open, onClose, machineName }: Props) => {
  const [password, setPassword] = useState("");

  const queryClient = useQueryClient();
  const { mutate, isLoading, error, reset } = useMutation(
    ["shutdownMachine", machineName],
    shutdownMachine,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["getMachineStatus", machineName]);
        onClose();
      },
    }
  );

  return (
    <>
      <ErrorDisplay error={error?.toString()} onClose={reset} btnText="Ok" />
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
                    <PowerOffIcon className="w-8 mr-2" />
                    Shutdown {machineName}?
                  </Dialog.Title>
                  <form
                    className="mt-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      mutate({ machineName, password });
                    }}
                  >
                    <Input
                      label="Password"
                      type="password"
                      value={password}
                      setValue={(val) => setPassword(val)}
                      icon={<UserIcon className="w-4" />}
                    />
                    <div className="mt-4">
                      <button
                        type="submit"
                        className="icon-btn danger-btn"
                        disabled={isLoading}
                      >
                        Shutdown
                        {isLoading ? (
                          <div className="w-4 aspect-square border-2 border-blue-900 border-b-transparent rounded-full animate-spin" />
                        ) : (
                          <PowerOffIcon className="w-4" />
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
