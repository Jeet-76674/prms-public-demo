import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { tpoService } from '../../services/tpoService';
import {
  Users,
  Search,
  Filter,
  Eye,
  Mail,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Loader2,
  CheckCircle,
  XCircle,
  Award
} from 'lucide-react';
import toast from 'react-hot-toast';
import Pagination from '../../components/Pagination';

export default function TpoStudents() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [departmentFilter, setDepartmentFilter] = useState(searchParams.get('department') || '');
  const [placementFilter, setPlacementFilter] = useState(searchParams.get('placementStatus') || '');
  
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const loadStudents = async () => {
    try {
      const params = { page, size };
      if (search) params.search = search;
      if (departmentFilter) params.department = departmentFilter;
      if (placementFilter) params.placementStatus = placementFilter;
      const response = await tpoService.getStudents(params);
      setStudents(response.content || []);
      setTotalPages(response.totalPages || 1);
      setTotalElements(response.totalElements || 0);
    } catch (err) {
      console.error('Failed to load students', err);
    }
  };

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const timer = setTimeout(async () => {
      try {
        const params = { page, size };
        if (search) params.search = search;
        if (departmentFilter) params.department = departmentFilter;
        if (placementFilter) params.placementStatus = placementFilter;

        const response = await tpoService.getStudents(params);
        if (isMounted) {
          setStudents(response.content || []);
          setTotalPages(response.totalPages || 1);
          setTotalElements(response.totalElements || 0);
        }
      } catch (err) {
        console.error('Failed to load students', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }, search ? 400 : 0);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [page, search, departmentFilter, placementFilter, size]);

  const handleUpdateStatus = async (id, status) => {
    try {
      setProcessingId(id);
      await tpoService.updateStudentAccountStatus(id, status);
      toast.success(`Student status updated to ${status}`);
      loadStudents();
    } catch (err) {
      toast.error('Failed to update status');
      console.error('Failed to update status', err);
    } finally {
      setProcessingId(null);
    }
  };

  const getPlacementBadge = (status) => {
    switch (status) {
      case 'PLACED':
        return <span className="badge bg-success bg-opacity-10 text-success border border-success">PLACED</span>;
      case 'HIGHER_STUDIES':
        return <span className="badge bg-info bg-opacity-10 text-info border border-info">HIGHER STUDIES</span>;
      case 'SELF_EMPLOYED':
        return <span className="badge bg-purple bg-opacity-10 text-purple border border-purple" style={{ color: '#8b5cf6', backgroundColor: '#ede9fe', borderColor: '#c4b5fd' }}>SELF EMPLOYED</span>;
      case 'NOT_PLACED':
      default:
        return <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary">NOT PLACED</span>;
    }
  };

  const getProfileBadge = (isCompleted) => {
    return isCompleted ? (
      <span className="text-success d-inline-flex align-items-center gap-1" style={{ fontSize: '0.75rem' }}>
        <CheckCircle size={12} /> Complete
      </span>
    ) : (
      <span className="text-warning d-inline-flex align-items-center gap-1" style={{ fontSize: '0.75rem' }}>
        <XCircle size={12} /> Incomplete
      </span>
    );
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container-fluid p-0">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold text-dark mb-1">Student Management</h4>
          <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>View, track, and manage student profiles and placements.</p>
        </div>
      </div>

      <div className="card border-0 bg-white shadow-sm mb-4" style={{ borderRadius: '12px' }}>
        <div className="card-body p-4">
          <div className="row g-3">
            <div className="col-12 col-md-4 col-lg-5">
              <div className="position-relative">
                <span className="position-absolute translate-middle-y text-muted" style={{ left: '1rem', top: '50%' }}>
                  <Search size={18} />
                </span>
                <input
                  type="text"
                  placeholder="Search by name, email, enrollment..."
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
                  value={departmentFilter}
                  onChange={(e) => {
                    setDepartmentFilter(e.target.value);
                    setPage(0);
                  }}
                >
                  <option value="">All Departments</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Civil">Civil</option>
                </select>
              </div>
            </div>

            <div className="col-12 col-md-4 col-lg-3">
              <div className="d-flex align-items-center gap-2">
                <Award size={18} className="text-secondary" />
                <select 
                  className="form-select focus-ring focus-ring-primary text-sm py-2"
                  value={placementFilter}
                  onChange={(e) => {
                    setPlacementFilter(e.target.value);
                    setPage(0);
                  }}
                >
                  <option value="">All Statuses</option>
                  <option value="NOT_PLACED">Not Placed</option>
                  <option value="PLACED">Placed</option>
                  <option value="HIGHER_STUDIES">Higher Studies</option>
                  <option value="SELF_EMPLOYED">Self Employed</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 bg-white shadow-sm overflow-hidden" style={{ borderRadius: '12px' }}>
        {loading && students.length === 0 ? (
          <div className="d-flex flex-column align-items-center justify-content-center py-5 my-5">
            <Loader2 className="spinner-border text-primary border-0" size={30} style={{ animation: 'spin 1s linear infinite' }} />
            <h6 className="mt-3 text-muted">Loading students...</h6>
          </div>
        ) : students.length === 0 ? (
          <div className="text-center p-5">
            <div className="d-inline-flex bg-light text-muted rounded-circle p-4 mb-3 mx-auto">
              <Users size={40} />
            </div>
            <h5 className="fw-bold">No Students Found</h5>
            <p className="text-muted text-xs mx-auto mb-4" style={{ maxWidth: '380px' }}>
              No students match your current search or filter criteria.
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light text-secondary" style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>
                <tr>
                  <th className="px-4 py-3">STUDENT</th>
                  <th className="py-3">ACADEMICS</th>
                  <th className="py-3">PROFILE</th>
                  <th className="py-3">PLACEMENT</th>
                  <th className="px-4 py-3 text-end">ACTIONS</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: '0.85rem' }}>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td className="px-4 py-3">
                      <div className="d-flex align-items-center gap-3">
                        <div className="bg-light rounded-circle d-flex align-items-center justify-content-center text-primary fw-bold border" style={{ width: '40px', height: '40px' }}>
                          {student.firstName?.[0]}{student.lastName?.[0]}
                        </div>
                        <div>
                          <h6 className="fw-bold mb-0 text-dark">{student.firstName} {student.lastName}</h6>
                          <div className="text-muted text-xs mt-1">
                            {student.enrollmentNumber}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="fw-semibold text-secondary">{student.department || '-'}</div>
                      <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                        CGPA: <span className="fw-bold text-dark">{student.cgpa || 'N/A'}</span> • {student.passingYear}
                      </div>
                    </td>
                    <td>
                      <div className="d-flex flex-column gap-1">
                        {getProfileBadge(student.profileCompleted)}
                        {student.resumeUploaded ? (
                           <span className="text-primary d-inline-flex align-items-center gap-1" style={{ fontSize: '0.75rem' }}>
                             <CheckCircle size={12} /> Resume
                           </span>
                        ) : (
                          <span className="text-muted d-inline-flex align-items-center gap-1" style={{ fontSize: '0.75rem' }}>
                             <XCircle size={12} /> No Resume
                           </span>
                        )}
                      </div>
                    </td>
                    <td>
                      {getPlacementBadge(student.placementStatus)}
                    </td>
                    <td className="px-4 py-3 text-end">
                      <div className="d-flex justify-content-end gap-2">
                        {(!student.accountStatus || student.accountStatus === 'ACTIVE') ? (
                          <button
                            className="btn btn-warning btn-sm text-dark"
                            onClick={() => handleUpdateStatus(student.id, 'INACTIVE')}
                            title="Deactivate"
                            disabled={processingId === student.id}
                          >
                            Deactivate
                          </button>
                        ) : (
                          <button
                            className="btn btn-success btn-sm text-white"
                            onClick={() => handleUpdateStatus(student.id, 'ACTIVE')}
                            title="Activate"
                            disabled={processingId === student.id}
                          >
                            Activate
                          </button>
                        )}
                        <Link
                          to={`/tpo/students/${student.id}`}
                          className="btn btn-light btn-sm text-primary border d-inline-flex align-items-center gap-2"
                          title="View Details"
                          style={{ borderRadius: '8px' }}
                        >
                          <Eye size={14} />
                          <span>View</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {totalPages > 0 && !loading && students.length > 0 && (
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
