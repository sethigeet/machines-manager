import { Fragment } from "react";

import { Dialog, Transition } from "@headlessui/react";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

type Props = {
  error?: string;
  onClose?: () => void;
  btnText?: string;
};

export const ErrorDisplay = ({ error, onClose, btnText = "Retry" }: Props) => {
  function handleClose() {
    if (onClose) {
      onClose();
    }
  }

  return (
    <Transition appear show={!!error} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={handleClose}>
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="flex items-center text-lg font-medium leading-6 text-slate-900"
                >
                  <ExclamationCircleIcon className="text-red-300 w-10 mr-2" />
                  An error occurred!
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-slate-500">{error}</p>
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="primary-btn"
                    onClick={handleClose}
                  >
                    {btnText}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
