import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Switch } from "@headlessui/react";

import { ErrorDisplay, Loading } from "./";
import { getAutoRefresh, setAutoRefresh } from "../api";

export const Navbar = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["getAutoRefresh"],
    queryFn: getAutoRefresh,
  });

  const {
    mutate,
    isPending: isSetPending,
    error: setError,
  } = useMutation({
    mutationKey: ["setAutoRefresh"],
    mutationFn: setAutoRefresh,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAutoRefresh"] });
    },
  });

  return (
    <div className="px-10 py-2 w-full flex justify-between items-center bg-blue-900 text-white">
      <Loading loading={isLoading || isSetPending} />
      <ErrorDisplay
        error={error?.toString() || setError?.toString()}
        onClose={refetch}
      />

      <div className="flex items-center">
        <img src="/icon.png" className="w-12 mr-4" alt="icon" />
        <h1 className="text-3xl font-bold">Machines Manager</h1>
      </div>
      <div className="flex items-center">
        <span className="mr-2 font-semibold text-sm">Auto Refresh</span>
        {data !== undefined && (
          <Switch
            checked={data}
            onChange={() => mutate(!data)}
            className={`${
              data ? "bg-blue-600" : "bg-gray-200"
            } relative inline-flex h-6 w-11 items-center rounded-full`}
          >
            <span className="sr-only">Auto Refresh</span>
            <span
              className={`${
                data ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white transition`}
            />
          </Switch>
        )}
      </div>
    </div>
  );
};
