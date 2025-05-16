"use client"

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#121212] text-white">
      <h2 className="text-2xl font-bold">Something went wrong!</h2>
      <button 
        onClick={() => reset()}
        className="mt-4 px-4 py-2 bg-orange-500 rounded"
      >
        Try again
      </button>
    </div>
  )
}