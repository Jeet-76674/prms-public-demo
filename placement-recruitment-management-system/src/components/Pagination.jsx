import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, totalPages, totalElements, size, setPage }) {
  if (totalPages <= 1) return null;

  return (
    <div className="d-flex flex-wrap align-items-center justify-content-between py-3 px-4 border-top bg-white">
      <div className="text-muted text-sm mb-3 mb-md-0 fw-medium">
        Showing <span className="fw-bold text-dark">{page * size + 1}</span> to <span className="fw-bold text-dark">{Math.min((page + 1) * size, totalElements)}</span> of <span className="fw-bold text-dark">{totalElements}</span> entries
      </div>
      <div className="d-flex align-items-center gap-1">
        <button
          className="btn btn-outline-secondary btn-sm p-1.5 d-flex align-items-center"
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
        >
          <ChevronLeft size={16} />
        </button>
        <div className="d-flex align-items-center px-3 text-sm fw-bold text-secondary">
          Page {page + 1} of {totalPages}
        </div>
        <button
          className="btn btn-outline-secondary btn-sm p-1.5 d-flex align-items-center"
          disabled={page >= totalPages - 1}
          onClick={() => setPage(page + 1)}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
