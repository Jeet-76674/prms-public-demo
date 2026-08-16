import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { tpoService } from '../../services/tpoService';
import {
  Building2,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  Filter,
  Eye,
  Mail
} from 'lucide-react';
import Pagination from '../../components/Pagination';

export default function TpoRecruiters() {
  const navigate = useNavigate();
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const timer = setTimeout(async () => {
      try {
        const params = { page, size };
        if (search) params.search = search;
        if (statusFilter) params.status = statusFilter;

        const response = await tpoService.getRecruiters(params);
        if (isMounted) {
          setRecruiters(response.content || []);
          setTotalPages(response.totalPages || 1);
          setTotalElements(response.totalElements || 0);
        }
      } catch (err) {
        console.error('Failed to load recruiters', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }, search ? 400 : 0);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [page, search, statusFilter, size]);

  const getStatusBadge = (verified, status) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="badge bg-success bg-opacity-10 text-success border border-success">ACTIVE</span>;
      case 'PENDING':
        return <span className="badge bg-warning bg-opacity-10 text-warning border border-warning">PENDING VC APPROVAL</span>;
      case 'INACTIVE':
        return <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary">INACTIVE</span>;
      case 'REJECTED':
        return <span className="badge bg-danger bg-opacity-10 text-danger border border-danger">REJECTED</span>;
      default:
        if (verified === true) return <span className="badge bg-success bg-opacity-10 text-success border border-success">ACTIVE</span>;
        if (verified === false) return <span className="badge bg-warning bg-opacity-10 text-warning border border-warning">PENDING VC APPROVAL</span>;
        return <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary">UNKNOWN</span>;
    }
  };

  const getAvatar = () => {
    return (
      <div className="bg-light rounded-3 d-flex align-items-center justify-content-center text-primary border" style={{ width: '42px', height: '42px', backgroundColor: '#EFF6FF' }}>
        <Building2 size={20} />
      </div>
    );
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="container-fluid p-0">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold text-dark mb-1">Corporate Recruiter Directory</h4>
          <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
            Browse registered corporate companies, HR coordinators, and campus job openings.
          </p>
        </div>
      </div>

      <div className="card border-0 bg-white shadow-sm mb-4" style={{ borderRadius: '12px' }}>
        <div className="card-body p-4">
          <div className="row g-3">
            <div className="col-12 col-md-6 col-lg-5">
              <div className="position-relative">
                <span className="position-absolute translate-middle-y text-muted" style={{ left: '1rem', top: '50%' }}>
                  <Search size={18} />
                </span>
                <input
                  type="text"
                  placeholder="Search by company, HR name, or email..."
                  className="form-control ps-5 focus-ring focus-ring-primary py-2 text-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            
            <div className="col-12 col-md-4 col-lg-3">
              <div className="d-flex align-items-center gap-2">
                <Filter size={18} className="text-secondary" />
                <select 
                  className="form-select focus-ring focus-ring-primary text-sm py-2"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(0);
                  }}
                >
                  <option value="">All Statuses</option>
                  <option value="ACTIVE">Active</option>
                  <option value="PENDING">Pending VC Approval</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 bg-white shadow-sm overflow-hidden" style={{ borderRadius: '12px' }}>
        {loading && recruiters.length === 0 ? (
          <div className="d-flex flex-column align-items-center justify-content-center py-5 my-5">
            <Loader2 className="spinner-border text-primary border-0" size={30} style={{ animation: 'spin 1s linear infinite' }} />
            <h6 className="mt-3 text-muted">Loading recruiters...</h6>
          </div>
        ) : recruiters.length === 0 ? (
          <div className="text-center p-5">
            <div className="d-inline-flex bg-light text-muted rounded-circle p-4 mb-3 mx-auto">
              <Building2 size={40} />
            </div>
            <h5 className="fw-bold">No Recruiters Found</h5>
            <p className="text-muted text-xs mx-auto mb-4" style={{ maxWidth: '380px' }}>
              No companies match your current search or filter criteria.
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light text-secondary" style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>
                <tr>
                  <th className="px-4 py-3">COMPANY</th>
                  <th className="py-3">HR CONTACT</th>
                  <th className="py-3">INDUSTRY</th>
                  <th className="py-3">STATUS</th>
                  <th className="px-4 py-3 text-end">DETAILS</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: '0.85rem' }}>
                {recruiters.map((recruiter) => (
                  <tr
                    key={recruiter.id}
                    onClick={() => navigate(`/tpo/recruiters/${recruiter.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td className="px-4 py-3">
                      <div className="d-flex align-items-center gap-3">
                        {getAvatar()}
                        <div>
                          <h6 className="fw-bold mb-0 text-dark hover-text-primary transition-all">{recruiter.companyName}</h6>
                          <div className="text-muted text-xs d-flex align-items-center gap-1 mt-1">
                            <Mail size={12} /> {recruiter.companyEmail}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="fw-semibold text-secondary">{recruiter.hrName}</div>
                      <div className="text-muted" style={{ fontSize: '0.75rem' }}>{recruiter.hrDesignation}</div>
                    </td>
                    <td className="text-muted">{recruiter.industry || '-'}</td>
                    <td>
                      {getStatusBadge(recruiter.verified, recruiter.accountStatus)}
                    </td>
                    <td className="px-4 py-3 text-end" onClick={(e) => e.stopPropagation()}>
                      <button
                        className="btn btn-outline-primary btn-sm px-3 fw-semibold d-inline-flex align-items-center gap-1"
                        onClick={() => navigate(`/tpo/recruiters/${recruiter.id}`)}
                      >
                        <Eye size={14} />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {totalPages > 0 && !loading && recruiters.length > 0 && (
          <div className="card-footer bg-white border-top py-3 px-4">
            <Pagination 
              page={page} 
              totalPages={totalPages} 
              totalElements={totalElements} 
              size={size} 
              setPage={setPage} 
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}
