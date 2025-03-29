export default function Pagination({ currentPage, totalPages, onPageChange }) {
    const pages = [];
    
    // Determinar qué páginas mostrar
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    
    // Añadir las páginas al array
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
  
    if (totalPages <= 1) return null;
  
    return (
      <div className="flex justify-center mt-8">
        <nav className="flex items-center space-x-1">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded ${
              currentPage === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-indigo-100'
            }`}
          >
            &laquo;
          </button>
          
          {startPage > 1 && (
            <>
              <button
                onClick={() => onPageChange(1)}
                className={`px-3 py-1 rounded hover:bg-indigo-100 ${
                  currentPage === 1 ? 'bg-indigo-600 text-white' : 'text-gray-700'
                }`}
              >
                1
              </button>
              {startPage > 2 && <span className="px-2">...</span>}
            </>
          )}
          
          {pages.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 rounded ${
                currentPage === page
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-700 hover:bg-indigo-100'
              }`}
            >
              {page}
            </button>
          ))}
          
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="px-2">...</span>}
              <button
                onClick={() => onPageChange(totalPages)}
                className={`px-3 py-1 rounded hover:bg-indigo-100 ${
                  currentPage === totalPages ? 'bg-indigo-600 text-white' : 'text-gray-700'
                }`}
              >
                {totalPages}
              </button>
            </>
          )}
          
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded ${
              currentPage === totalPages
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-indigo-100'
            }`}
          >
            &raquo;
          </button>
        </nav>
      </div>
    );
  }