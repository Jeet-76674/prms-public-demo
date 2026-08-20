import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { recruiterService } from '../../services/recruiterService';
import {
  Users,
  Briefcase,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  Award
} from 'lucide-react';
import toast from 'react-hot-toast';
import Pagination from '../../components/Pagination';
import { formatStudentName } from '../../utils/nameHelper';

export default function RecruiterPlacements() {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    loadPlacements();
  }, [page]);

  const loadPlacements = async () => {
    try {
      const data = await recruiterService.getPlacements({ page, size: 10 });
      setPlacements(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      console.error('Failed to load placements', err);
      toast.error('Failed to load placement records');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'OFFERED':
        return <span className="badge bg-primary bg-opacity-10 text-primary border border-primary px-2 py-1" style={{ fontSize: '0.75rem' }}><Clock size={12} className="me-1" /> OFFERED</span>;
      case 'ACCEPTED':
        return <span className="badge bg-success bg-opacity-10 text-success border border-success px-2 py-1" style={{ fontSize: '0.75rem' }}><CheckCircle size={12} className="me-1" /> ACCEPTED</span>;
      case 'DECLINED':
        return <span className="badge bg-danger bg-opacity-10 text-danger border border-danger px-2 py-1" style={{ fontSize: '0.75rem' }}><XCircle size={12} className="me-1" /> DECLINED</span>;
      case 'JOINED':
        return <span className="badge bg-purple bg-opacity-10 text-purple border border-purple px-2 py-1" style={{ color: '#8b5cf6', backgroundColor: '#ede9fe', borderColor: '#c4b5fd', fontSize: '0.75rem' }}><Award size={12} className="me-1" /> JOINED</span>;
      default:
        return <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary px-2 py-1" style={{ fontSize: '0.75rem' }}>{status}</span>;
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container-fluid p-0">
      <div className="mb-4">
        <h4 className="fw-bold text-dark mb-1">Company Placements</h4>
        <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>View students placed in your company.</p>
      </div>

      <div className="card border-0 bg-white shadow-sm overflow-hidden" style={{ borderRadius: '12px' }}>
        {loading ? (
          <div className="d-flex flex-column align-items-center justify-content-center py-5 my-5">
            <Loader2 className="spinner-border text-primary border-0" size={30} style={{ animation: 'spin 1s linear infinite' }} />
            <h6 className="mt-3 text-muted">Loading placement records...</h6>
          </div>
        ) : placements.length === 0 ? (
          <div className="text-center p-5">
            <div className="d-inline-flex bg-light text-muted rounded-circle p-4 mb-3 mx-auto">
              <Users size={40} />
            </div>
            <h5 className="fw-bold">No Placements Found</h5>
            <p className="text-muted text-xs mx-auto mb-4" style={{ maxWidth: '380px' }}>
              No students have been placed in your company yet.
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light text-secondary" style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>
                <tr>
                  <th className="px-4 py-3">STUDENT</th>
                  <th className="py-3">ROLE</th>
                  <th className="py-3">STATUS</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: '0.85rem' }}>
                {placements.map((placement) => (
                  <tr key={placement.id}>
                    <td className="px-4 py-3">
                      <div className="fw-bold text-dark">{formatStudentName(placement.studentName)}</div>
                    </td>
                    <td>
                      <div className="fw-semibold text-secondary">{placement.jobTitle}</div>
                    </td>
                    <td>
                      {getStatusBadge(placement.offerStatus)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!loading && placements.length > 0 && (
        <div className="mt-4">
          <Pagination 
            page={page} 
            totalPages={totalPages} 
            totalElements={totalElements} 
            size={10} 
            setPage={setPage} 
          />
        </div>
      )}
    </motion.div>
  );
}
