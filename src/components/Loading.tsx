type Props = {
  loading?: boolean;
};

export const Loading = ({ loading }: Props) => {
  if (loading !== undefined && !loading) {
    return <></>;
  }

  return (
    <div className="absolute inset-0 bg-black/50 z-50 grid place-items-center">
      <div className="w-14 aspect-square border-[6px] border-blue-900 border-b-transparent rounded-full animate-spin" />
    </div>
  );
};
