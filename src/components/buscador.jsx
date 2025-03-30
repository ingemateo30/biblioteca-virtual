export default function Buscador({ value, onChange }) {
    return (
      <div className="w-full md:w-1/2">
        <div className="relative group">
          <input
            type="text"
            placeholder="Buscar por título o autor..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-5 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm hover:shadow-md"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 pointer-events-none group-hover:text-indigo-500 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          {value && (
            <button
              onClick={() => onChange("")}
              className="absolute inset-y-0 right-10 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-2 ml-1">
          Busca por título, autor o palabras clave
        </p>
      </div>
    );
  }
  