export default function CheckoutLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#121212] text-white">
      <div className="animate-pulse space-y-4">
        <div className="h-12 w-48 bg-gray-700 rounded"></div>
        <div className="h-6 w-72 bg-gray-700 rounded"></div>
        <div className="h-6 w-64 bg-gray-700 rounded"></div>
      </div>
    </div>
  );
} 