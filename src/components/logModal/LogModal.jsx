"use client"
const LogModal = ({ showModal, setShowModal, logData }) => {
    if (!showModal || !logData) return null;

    let parsedData = logData;

    try {
        if (typeof logData.data === 'string') {
            const innerData = JSON.parse(logData.data);
            parsedData = Array.isArray(innerData) && innerData.length === 1 ? innerData[0] : innerData;
        }
    } catch (err) {
        console.error('Error parsing logData.data:', err);
    }

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-start z-50 pt-12">
        <div className="bg-white rounded-lg p-6 w-11/12 md:w-8/12 lg:w-1/2 max-w-4xl relative">
            <button
                onClick={() => setShowModal(false)}
                aria-label="Close modal"
                className="absolute top-2 right-2 text-2xl font-bold text-gray-500 hover:text-gray-700 focus:outline-none focus:ring"
            >
                &times;
            </button>
    
            <h2 className="text-2xl font-semibold mb-4">
                {logData?.remarks || 'Log Data'}
            </h2>
    
            <div className="overflow-x-auto max-h-[500px]">
                <pre className="whitespace-pre-wrap text-sm text-white bg-gray-800 p-4 rounded-lg text-left">
                    {parsedData ? JSON.stringify(parsedData, null, 2) : 'No log data available.'}
                </pre>
            </div>
        </div>
    </div>
    
    );
};

export default LogModal;
