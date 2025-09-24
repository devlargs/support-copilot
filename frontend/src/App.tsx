function App() {
  return (
    <div className="min-h-screen bg-red-500">
      <div className="flex h-screen items-center justify-center">
        <div className="text-center space-y-6">
          <h1 className="text-6xl font-bold text-white mb-4">
            TAILWIND IS WORKING! 🎉
          </h1>
          <p className="text-xl text-white mb-8">
            If you see a red background, Tailwind CSS is working!
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg">
              Primary Button
            </button>
            <button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold py-3 px-6 rounded-lg transition-all duration-200">
              Secondary Button
            </button>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-2">Card 1</h3>
              <p className="text-gray-300">
                This card uses Tailwind's backdrop blur and transparency
                utilities.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-2">Card 2</h3>
              <p className="text-gray-300">
                Responsive grid layout with beautiful styling.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-2">Card 3</h3>
              <p className="text-gray-300">
                All powered by Tailwind CSS classes!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
