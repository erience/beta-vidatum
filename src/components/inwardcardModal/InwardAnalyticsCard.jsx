export const GridSection = ({ children }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {children}
  </div>
);


const InwardAnalyticsCard = ({
  title,
  count,
  color = "black",
  onCheckNow,
}) => {
  return (
    <div className="rounded-lg shadow p-4 border bg-white w-full">
      <h3 className="font-semibold text-sm text-gray-700 mb-2">{title}</h3>
      <h2 className="text-2xl font-bold mb-4 text-black">{count}</h2>
      {onCheckNow && (
        <button
          className="px-4 py-2 text-sm rounded bg-black text-white hover:bg-gray-900"
          onClick={onCheckNow}
        >
          Check now
        </button>
      )}
    </div>
  );
};

export default InwardAnalyticsCard;
