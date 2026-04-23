import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)' }}>
      <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
        Hiển thị <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}</span> đến <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{Math.min(currentPage * itemsPerPage, totalItems)}</span> trong <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{totalItems}</span> kết quả
      </div>
      <div style={{ display: 'flex', gap: '4px' }}>
        <button 
          className="btn btn-outline" 
          style={{ padding: '6px', opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft size={16} />
        </button>
        
        {Array.from({ length: totalPages }).map((_, idx) => (
          <button 
            key={idx + 1}
            className={`btn ${currentPage === idx + 1 ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '6px 12px', fontWeight: currentPage === idx + 1 ? '600' : '400' }}
            onClick={() => onPageChange(idx + 1)}
          >
            {idx + 1}
          </button>
        ))}

        <button 
          className="btn btn-outline" 
          style={{ padding: '6px', opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
