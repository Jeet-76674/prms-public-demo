import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { studentService } from '../../services/studentService';
import {
  Briefcase,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  Loader2,
  IndianRupee
} from 'lucide-react';
import toast from 'react-hot-toast';
import Pagination from '../../components/Pagination';

export default function StudentPlacements() {
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
      const data = await studentService.getPlacements({ page, size: 10 });
      setPlacements(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      console.error('Failed to load placements', err);
      toast.error('Failed to load placement history');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'OFFERED':
        return <span className="badge bg-primary bg-opacity-10 text-primary border border-primary px-3 py-2" style={{ fontSize: '0.8rem' }}><Clock size={14} className="me-1" /> OFFERED</span>;
      case 'ACCEPTED':
        return <span className="badge bg-success bg-opacity-10 text-success border border-success px-3 py-2" style={{ fontSize: '0.8rem' }}><CheckCircle size={14} className="me-1" /> ACCEPTED</span>;
      case 'DECLINED':
        return <span className="badge bg-danger bg-opacity-10 text-danger border border-danger px-3 py-2" style={{ fontSize: '0.8rem' }}><XCircle size={14} className="me-1" /> DECLINED</span>;
      case 'JOINED':
        return <span className="badge bg-purple bg-opacity-10 text-purple border border-purple px-3 py-2" style={{ color: '#8b5cf6', backgroundColor: '#ede9fe', borderColor: '#c4b5fd', fontSize: '0.8rem' }}><Award size={14} className="me-1" /> JOINED</span>;
      default:
        return <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary px-3 py-2" style={{ fontSize: '0.8rem' }}>{status}</span>;
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container-fluid p-0">
      <div className="mb-4">
        <h4 className="fw-bold text-dark mb-1">My Placements</h4>
        <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>View your placement offers and records.</p>
      </div>

      {loading ? (
        <div className="d-flex flex-column align-items-center justify-content-center py-5 my-5">
          <Loader2 className="spinner-border text-primary border-0" size={30} style={{ animation: 'spin 1s linear infinite' }} />
          <h6 className="mt-3 text-muted">Loading placements...</h6>
        </div>
      ) : placements.length === 0 ? (
        <div className="card border-0 bg-white shadow-sm p-5 text-center" style={{ borderRadius: '12px' }}>
          <div className="d-inline-flex bg-light text-muted rounded-circle p-4 mb-3 mx-auto">
            <Briefcase size={40} />
          </div>
          <h5 className="fw-bold">No Placements Found</h5>
          <p className="text-muted text-xs mx-auto mb-4" style={{ maxWidth: '380px' }}>
            You do not have any placement records yet. Keep applying to jobs!
          </p>
        </div>
      ) : (
        <div className="row g-4">
          {placements.map((placement) => (
            <div key={placement.id} className="col-12 col-md-6 col-lg-4">
              <div className="card border-0 bg-white shadow-sm h-100" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h5 className="fw-bold text-dark mb-1">{placement.jobTitle}</h5>
                      <p className="text-primary fw-semibold mb-0" style={{ fontSize: '0.9rem' }}>{placement.companyName}</p>
                    </div>
                    {getStatusBadge(placement.offerStatus)}
                  </div>
                  
                  <div className="d-flex flex-column gap-2 mt-4 pt-3 border-top">
                    <div className="d-flex align-items-center gap-2 text-secondary text-sm">
                      <IndianRupee size={16} className="text-primary" />
                      <span className="fw-medium text-dark">₹{placement.packageAmount ? placement.packageAmount.toLocaleString('en-IN') : 'N/A'}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2 text-secondary text-sm">
                      <Calendar size={16} />
                      <span className="text-muted">Joining:</span>
                      <span className="fw-medium text-dark">{placement.joiningDate || 'TBD'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
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
