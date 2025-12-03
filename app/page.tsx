export default function Home() {
  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Welcome to Your Boat Logbook
        </h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold text-blue-600 mb-4">
              Boat Information
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Name:</span>
                <span>Your Boat Name</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Type:</span>
                <span>Sailing Yacht</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Length:</span>
                <span>12m</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Registration:</span>
                <span>ABC-123</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Year:</span>
                <span>2018</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-blue-600 mb-4">
              Quick Stats
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Total Trips:</span>
                <span className="text-green-600 font-semibold">-</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Last Trip:</span>
                <span>-</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Favorite Location:</span>
                <span>-</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            Getting Started
          </h3>
          <p className="text-blue-700">
            Start documenting your boat trips by visiting the{" "}
            <a href="/logbook" className="underline font-medium">
              Logbook
            </a>{" "}
            section. You can add new entries, track locations, weather conditions, and more.
          </p>
        </div>
      </div>
    </div>
  );
}
