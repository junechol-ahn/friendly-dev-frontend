import type React from "react"

type PaginationProps = {
  totalPages: number,
  currentPage: number,
  setCurrentPage: (newPage: number)=>void
}

const Pagination: React.FC<PaginationProps> = ({totalPages, currentPage, setCurrentPage}) => {
  if (totalPages <=1) return null

  return (    
    <div className='flex justify-center gap-2 mt-8'>
      { Array.from({length: totalPages}, (_, idx) => (
        <button key={idx+1}
          className={`px-3 py-1 cursor-pointer rounded ${currentPage === idx+1 ? 'bg-blue-600 text-white' :'bg-gray-700 text-gray-200' }`}
          onClick={()=>setCurrentPage(idx+1)}
        >
          {idx + 1}
        </button>
      ))}
    </div>
  )
};
export default Pagination;
