export const Navbar = () => {
  return (
    <div className="px-10 py-2 w-full flex justify-between items-center bg-blue-900 text-white">
      <div className="flex items-center">
        <img src="/icon.png" className="w-12 mr-4" alt="icon" />
        <h1 className="text-3xl font-bold">Machines Manager</h1>
      </div>
      <div>
        <input type="checkbox" />
        <span>Auto Refresh</span>
      </div>
    </div>
  );
};
