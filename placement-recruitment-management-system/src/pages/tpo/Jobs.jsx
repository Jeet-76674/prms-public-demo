import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Search, Filter, Loader2, Building2, MapPin, ChevronRight, X } from 'lucide-react';
import { tpoService } from '../../services/tpoService';
import toast from 'react-hot-toast';

export default function TpoJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    title: '',
    status: 'OPEN'
  });
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await tpoService.getJobs({ ...filters, page, size: 10 });
      setJobs(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [page, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(0);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'OPEN':
        return <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill">Open</span>;
      case 'CLOSED':
        return <span className="badge bg-danger bg-opacity-10 text-danger px-3 py-2 rounded-pill">Closed</span>;
      case 'DRAFT':
        return <span className="badge bg-secondary bg-opacity-10 text-secondary px-3 py-2 rounded-pill">Draft</span>;
      default:
        return <span className="badge bg-secondary bg-opacity-10 text-secondary px-3 py-2 rounded-pill">{status}</span>;
    }
  };

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="h4 mb-1 fw-bold text-slate-800">Jobs Dashboard</h2>
          <p className="text-muted mb-0 small">Monitor all recruitment jobs and open roles.</p>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body p-4">
          <div className="row g-3">
            <div className="col-md-5">
              <div className="position-relative">
                <Search className="position-absolute top-50 translate-middle-y text-muted" style={{ left: '1rem' }} size={18} />
                <input
                  type="text"
                  className="form-control form-control-lg bg-slate-50 border-0 ps-5"
                  placeholder="Search by job title..."
                  name="title"
                  value={filters.title}
                  onChange={handleFilterChange}
                  style={{ fontSize: '0.95rem' }}
                />
              </div>
            </div>
            <div className="col-md-3">
              <select
                className="form-select form-select-lg bg-slate-50 border-0"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                style={{ fontSize: '0.95rem' }}
              >
                <option value="">All Statuses</option>
                <option value="OPEN">Open</option>
                <option value="CLOSED">Closed</option>
                <option value="DRAFT">Draft</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        {loading ? (
          <div className="text-center p-5">
            <Loader2 className="animate-spin text-primary mx-auto mb-3" size={32} />
            <p className="text-muted">Loading jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center p-5">
            <div className="bg-slate-50 rounded-circle d-inline-flex p-4 mb-3">
              <Briefcase size={32} className="text-muted" />
            </div>
            <h5 className="text-slate-800 fw-semibold">No Jobs Found</h5>
            <p className="text-muted">No jobs match your current filters.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-uppercase text-slate-500 fw-semibold py-3 ps-4" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>Job Role</th>
                  <th className="text-uppercase text-slate-500 fw-semibold py-3" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>Company</th>
                  <th className="text-uppercase text-slate-500 fw-semibold py-3" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>Type</th>
                  <th className="text-uppercase text-slate-500 fw-semibold py-3" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>Status</th>
                  <th className="text-uppercase text-slate-500 fw-semibold py-3 pe-4 text-end" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/tpo/jobs/${job.id}`)}>
                    <td className="ps-4 py-3">
                      <div className="fw-semibold text-slate-800">{job.title}</div>
                      <div className="text-muted small d-flex align-items-center gap-1 mt-1">
                        <MapPin size={12} /> {job.location}
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="d-flex align-items-center gap-2">
                        <div className="bg-primary bg-opacity-10 text-primary rounded d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px' }}>
                          <Building2 size={12} />
                        </div>
                        <span className="text-slate-700 fw-medium">{job.companyName || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="py-3 text-slate-600">
                      {job.employmentType.replace('_', ' ')}
                    </td>
                    <td className="py-3">
                      {getStatusBadge(job.status)}
                    </td>
                    <td className="pe-4 py-3 text-end">
                      <button 
                        className="btn btn-light btn-sm rounded-circle p-2 text-primary hover-bg-primary hover-text-white transition-all"
                        onClick={(e) => { e.stopPropagation(); navigate(`/tpo/jobs/${job.id}`); }}
                      >
                        <ChevronRight size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <ul className="pagination pagination-sm gap-2">
            <li className={`page-item ${page === 0 ? 'disabled' : ''}`}>
              <button className="page-link rounded-3 border-0 bg-white shadow-sm text-slate-700 px-3" onClick={() => setPage(p => p - 1)}>Previous</button>
            </li>
            {[...Array(totalPages)].map((_, i) => (
              <li key={i} className={`page-item ${page === i ? 'active' : ''}`}>
                <button className={`page-link rounded-3 border-0 shadow-sm px-3 ${page === i ? 'bg-primary text-white' : 'bg-white text-slate-700'}`} onClick={() => setPage(i)}>{i + 1}</button>
              </li>
            ))}
            <li className={`page-item ${page === totalPages - 1 ? 'disabled' : ''}`}>
              <button className="page-link rounded-3 border-0 bg-white shadow-sm text-slate-700 px-3" onClick={() => setPage(p => p + 1)}>Next</button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
