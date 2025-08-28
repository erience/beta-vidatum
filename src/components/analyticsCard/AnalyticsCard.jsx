// Tailwind-based responsive grid layout using your existing AnalyticsCard and StatusCard

export const GridSection = ({ children }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
    {children}
  </div>
);

export const AnalyticsCard = ({
  title,
  count,
  color = "yellow",
  icon,
  onCheckNow,
}) => {
  const btnColors = {
    yellow: "bg-yellow-500 hover:bg-yellow-600 text-white",
    green: "bg-green-500 hover:bg-green-600 text-white",
    red: "bg-red-500 hover:bg-red-600 text-white",
    black: "bg-gray-800 hover:bg-gray-900 text-white",
    orange: "bg-orange-500 hover:bg-orange-600 text-white",
  };

  return (
    <div className="rounded-lg shadow p-4 border bg-white">
      <h3 className="font-semibold text-sm text-gray-700 mb-2">{title}</h3>
      <h2 className="text-2xl font-bold mb-4 text-black">
        {count} {icon && <span className="ml-1">{icon}</span>}
      </h2>
      <button
        className={`px-4 py-2 text-sm rounded ${btnColors[color]} transition`}
        onClick={onCheckNow}
      >
        Check now
      </button>
    </div>
  );
};

export const StatusCard = ({ title, color, count, onCheckNow }) => {
  const bgColors = {
    green: "bg-green-500",
    red: "bg-red-500",
    orange: "bg-orange-400",
  };

  return (
    <div
      onClick={onCheckNow}
      className={`rounded-lg shadow text-white p-6 flex flex-col items-center justify-center cursor-pointer ${bgColors[color]}`}
    >
      <h2 className="text-3xl font-semibold mb-1">{count}</h2>
      <h6 className="font-medium text-lg mb-2 text-center">{title}</h6>
      <svg
        viewBox="0 0 24 24"
        width="24"
        height="24"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-white"
      >
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </div>
  );
};
