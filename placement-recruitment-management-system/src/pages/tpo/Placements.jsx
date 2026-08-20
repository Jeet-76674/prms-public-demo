import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { tpoService } from '../../services/tpoService';
import toast from 'react-hot-toast';
import {
  Briefcase,
  Search,
  Filter,
  Eye,
  ChevronLeft,
  ChevronRight,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  Users,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import Pagination from '../../components/Pagination';
import { formatStudentName } from '../../utils/nameHelper';

export default function TpoPlacements() {
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [companyFilter, setCompanyFilter] = useState(searchParams.get('company') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('offerStatus') || '');

  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newPlacement, setNewPlacement] = useState({
    studentId: '',
    jobId: '',
    companyName: '',
    jobTitle: '',
    packageAmount: '',
    employmentType: 'Full Time',
    workLocation: '',
    offerDate: '',
    joiningDate: '',
    offerStatus: 'OFFERED',
    remarks: ''
  });

  const [showPendingModal, setShowPendingModal] = useState(false);
  const [pendingConversions, setPendingConversions] = useState([]);
  const [pendingLoading, setPendingLoading] = useState(false);

  useEffect(() => {
    loadPlacements();
  }, [page, companyFilter, statusFilter]);

  // Debounced search effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setPage(0);
      loadPlacements();
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    const sId = searchParams.get('studentId');
    const jId = searchParams.get('jobId');
    const jTitle = searchParams.get('jobTitle');
    const cName = searchParams.get('companyName');
    
    if (sId && jId) {
      setNewPlacement(prev => ({
        ...prev,
        studentId: sId,
        jobId: jId,
        jobTitle: jTitle || '',
        companyName: cName || ''
      }));
      setShowCreateModal(true);

      const newParams = new URLSearchParams(searchParams);
      newParams.delete('studentId');
      newParams.delete('jobId');
      newParams.delete('jobTitle');
      newParams.delete('companyName');
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const loadPendingConversions = async () => {
    setPendingLoading(true);
    try {
      const response = await tpoService.getPendingConversions({ page: 0, size: 50 });
      setPendingConversions(response.content || []);
    } catch (err) {
      toast.error('Failed to load pending conversions');
    } finally {
      setPendingLoading(false);
    }
  };

  const handleOpenPending = () => {
    setShowPendingModal(true);
    loadPendingConversions();
  };

  const handleConvert = async (app) => {
    // Show a loading state if desired, or just fetch directly
    let packageAmt = '';
    let loc = '';
    let empType = 'Full Time';
    const today = new Date().toISOString().split('T')[0];

    try {
      const jobDetails = await tpoService.getJobById(app.jobId);
      packageAmt = jobDetails.maximumSalary || jobDetails.minimumSalary || '';
      loc = jobDetails.location || '';
      
      // Map job employment type to placement employment type format
      if (jobDetails.employmentType) {
        if (jobDetails.employmentType === 'FULL_TIME') empType = 'Full Time';
        else if (jobDetails.employmentType === 'INTERNSHIP') empType = 'Internship';
        else if (jobDetails.employmentType === 'CONTRACT') empType = 'Contract';
        else if (jobDetails.employmentType === 'PART_TIME') empType = 'Part Time';
      }
    } catch(err) {
      console.error('Failed to fetch job details for pre-filling', err);
    }

    setNewPlacement(prev => ({
      ...prev,
      studentId: app.studentId,
      jobId: app.jobId,
      jobTitle: app.jobTitle || '',
      companyName: app.companyName || '',
      packageAmount: packageAmt,
      workLocation: loc,
      employmentType: empType,
      offerDate: today,
      joiningDate: app.joiningDate || ''
    }));
    setShowPendingModal(false);
    setShowCreateModal(true);
  };

  const loadPlacements = async () => {
    setLoading(true);
    try {
      const params = { page, size };
      if (search) params.search = search;
      if (companyFilter) params.company = companyFilter;
      if (statusFilter) params.offerStatus = statusFilter;

      const response = await tpoService.getPlacements(params);
      setPlacements(response.content || []);
      setTotalPages(response.totalPages || 1);
      setTotalElements(response.totalElements || 0);

      // Update URL silently
      const urlParams = new URLSearchParams();
      if (search) urlParams.set('search', search);
      if (companyFilter) urlParams.set('company', companyFilter);
      if (statusFilter) urlParams.set('offerStatus', statusFilter);
      setSearchParams(urlParams, { replace: true });
    } catch (err) {
      console.error('Failed to load placements', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlacement = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      // parse numeric fields
      const payload = {
        ...newPlacement,
        studentId: parseInt(newPlacement.studentId, 10),
        jobId: parseInt(newPlacement.jobId, 10),
        packageAmount: parseFloat(newPlacement.packageAmount),
        joiningDate: newPlacement.joiningDate || null,
        offerDate: newPlacement.offerDate || null
      };
      await tpoService.createPlacement(payload);
      toast.success('Placement created successfully');
      setShowCreateModal(false);
      setNewPlacement({
        studentId: '',
        jobId: '',
        companyName: '',
        jobTitle: '',
        packageAmount: '',
        employmentType: 'Full Time',
        workLocation: '',
        offerDate: '',
        joiningDate: '',
        offerStatus: 'OFFERED',
        remarks: ''
      });
      loadPlacements();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create placement');
    } finally {
      setCreating(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'OFFERED':
        return <span className="badge bg-primary bg-opacity-10 text-primary border border-primary px-2 py-1"><Clock size={12} className="me-1" /> OFFERED</span>;
      case 'ACCEPTED':
        return <span className="badge bg-success bg-opacity-10 text-success border border-success px-2 py-1"><CheckCircle size={12} className="me-1" /> ACCEPTED</span>;
      case 'DECLINED':
        return <span className="badge bg-danger bg-opacity-10 text-danger border border-danger px-2 py-1"><XCircle size={12} className="me-1" /> DECLINED</span>;
      case 'JOINED':
        return <span className="badge bg-purple bg-opacity-10 text-purple border border-purple px-2 py-1" style={{ color: '#8b5cf6', backgroundColor: '#ede9fe', borderColor: '#c4b5fd' }}><CheckCircle size={12} className="me-1" /> JOINED</span>;
      default:
        return <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary px-2 py-1">{status}</span>;
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container-fluid p-0">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold text-dark mb-1">Placement Management</h4>
          <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>Track offers and placement records across the campus.</p>
        </div>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-primary d-flex align-items-center gap-2 shadow-sm"
            onClick={handleOpenPending}
            style={{ borderRadius: '8px' }}
          >
            <AlertCircle size={18} />
            <span className="d-none d-sm-inline">Pending Conversions</span>
          </button>
          <button
            className="btn btn-primary d-flex align-items-center gap-2 shadow-sm"
            onClick={() => setShowCreateModal(true)}
            style={{ borderRadius: '8px' }}
          >
            <Plus size={18} />
            <span className="d-none d-sm-inline">Create Placement</span>
          </button>
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
                  placeholder="Search by student, enrollment, company..."
                  className="form-control ps-5 focus-ring focus-ring-primary py-2 text-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="col-12 col-md-4 col-lg-3">
              <div className="position-relative">
                <span className="position-absolute translate-middle-y text-muted" style={{ left: '1rem', top: '50%' }}>
                  <Briefcase size={18} />
                </span>
                <input
                  type="text"
                  placeholder="Filter by company"
                  className="form-control ps-5 focus-ring focus-ring-primary py-2 text-sm"
                  value={companyFilter}
                  onChange={(e) => {
                    setCompanyFilter(e.target.value);
                    setPage(0);
                  }}
                />
              </div>
            </div>

            <div className="col-12 col-md-4 col-lg-4">
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
                  <option value="OFFERED">Offered</option>
                  <option value="ACCEPTED">Accepted</option>
                  <option value="DECLINED">Declined</option>
                  <option value="JOINED">Joined</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 bg-white shadow-sm overflow-hidden" style={{ borderRadius: '12px' }}>
        {loading && placements.length === 0 ? (
          <div className="d-flex flex-column align-items-center justify-content-center py-5 my-5">
            <Loader2 className="spinner-border text-primary border-0" size={30} style={{ animation: 'spin 1s linear infinite' }} />
            <h6 className="mt-3 text-muted">Loading placements...</h6>
          </div>
        ) : placements.length === 0 ? (
          <div className="text-center p-5">
            <div className="d-inline-flex bg-light text-muted rounded-circle p-4 mb-3 mx-auto">
              <Users size={40} />
            </div>
            <h5 className="fw-bold">No Placements Found</h5>
            <p className="text-muted text-xs mx-auto mb-4" style={{ maxWidth: '380px' }}>
              No placement records match your current search or filter criteria.
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light text-secondary" style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>
                <tr>
                  <th className="px-4 py-3">STUDENT</th>
                  <th className="py-3">ROLE & COMPANY</th>
                  <th className="py-3">PACKAGE</th>
                  <th className="py-3">STATUS</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: '0.85rem' }}>
                {placements.map((placement) => (
                  <tr 
                    key={placement.id}
                    onClick={() => navigate(`/tpo/placements/${placement.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td className="px-4 py-3">
                      <div className="fw-bold text-dark">{formatStudentName(placement.studentName)}</div>
                      {placement.enrollmentNumber && (
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>{placement.enrollmentNumber}</div>
                      )}
                    </td>
                    <td>
                      <div className="fw-semibold text-secondary">{placement.jobTitle}</div>
                      <div className="text-dark fw-bold" style={{ fontSize: '0.8rem' }}>{placement.companyName}</div>
                    </td>
                    <td>
                      <div className="fw-medium text-success">
                        ₹{placement.packageAmount ? placement.packageAmount.toLocaleString('en-IN') : 'N/A'}
                      </div>
                      <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                        Joining: {placement.joiningDate || 'N/A'}
                      </div>
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

        {totalPages > 0 && !loading && placements.length > 0 && (
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

      {/* Create Placement Modal */}
      {showCreateModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
            <div className="modal-content border-0 shadow" style={{ borderRadius: '16px' }}>
              <div className="modal-header border-0 bg-light py-3 px-4">
                <h5 className="modal-title fw-bold">Create Placement Record</h5>
                <button type="button" className="btn-close" onClick={() => setShowCreateModal(false)}></button>
              </div>
              <form onSubmit={handleCreatePlacement}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label text-sm fw-medium text-secondary">Student ID *</label>
                      <input
                        type="number"
                        className="form-control"
                        required
                        value={newPlacement.studentId}
                        onChange={(e) => setNewPlacement({ ...newPlacement, studentId: e.target.value })}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label text-sm fw-medium text-secondary">Job ID *</label>
                      <input
                        type="number"
                        className="form-control"
                        required
                        value={newPlacement.jobId}
                        onChange={(e) => setNewPlacement({ ...newPlacement, jobId: e.target.value })}
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label text-sm fw-medium text-secondary">Company Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={newPlacement.companyName}
                        onChange={(e) => setNewPlacement({ ...newPlacement, companyName: e.target.value })}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label text-sm fw-medium text-secondary">Job Title *</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={newPlacement.jobTitle}
                        onChange={(e) => setNewPlacement({ ...newPlacement, jobTitle: e.target.value })}
                      />
                    </div>

                    <div className="col-12 col-md-4">
                      <label className="form-label text-sm fw-medium text-secondary">Package Amount (₹) *</label>
                      <input
                        type="number"
                        className="form-control"
                        required
                        value={newPlacement.packageAmount}
                        onChange={(e) => setNewPlacement({ ...newPlacement, packageAmount: e.target.value })}
                      />
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label text-sm fw-medium text-secondary">Employment Type *</label>
                      <select
                        className="form-select"
                        required
                        value={newPlacement.employmentType}
                        onChange={(e) => setNewPlacement({ ...newPlacement, employmentType: e.target.value })}
                      >
                        <option value="Full Time">Full Time</option>
                        <option value="Internship">Internship</option>
                        <option value="Contract">Contract</option>
                        <option value="Part Time">Part Time</option>
                      </select>
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label text-sm fw-medium text-secondary">Work Location *</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={newPlacement.workLocation}
                        onChange={(e) => setNewPlacement({ ...newPlacement, workLocation: e.target.value })}
                      />
                    </div>

                    <div className="col-12 col-md-4">
                      <label className="form-label text-sm fw-medium text-secondary">Offer Date *</label>
                      <input
                        type="date"
                        className="form-control"
                        required
                        value={newPlacement.offerDate}
                        onChange={(e) => setNewPlacement({ ...newPlacement, offerDate: e.target.value })}
                      />
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label text-sm fw-medium text-secondary">Joining Date *</label>
                      <input
                        type="date"
                        className="form-control"
                        required
                        value={newPlacement.joiningDate}
                        onChange={(e) => setNewPlacement({ ...newPlacement, joiningDate: e.target.value })}
                      />
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label text-sm fw-medium text-secondary">Offer Status *</label>
                      <select
                        className="form-select"
                        required
                        value={newPlacement.offerStatus}
                        onChange={(e) => setNewPlacement({ ...newPlacement, offerStatus: e.target.value })}
                      >
                        <option value="OFFERED">Offered</option>
                        <option value="ACCEPTED">Accepted</option>
                        <option value="DECLINED">Declined</option>
                        <option value="JOINED">Joined</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label className="form-label text-sm fw-medium text-secondary">Remarks</label>
                      <textarea
                        className="form-control"
                        rows="2"
                        value={newPlacement.remarks}
                        onChange={(e) => setNewPlacement({ ...newPlacement, remarks: e.target.value })}
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 px-4 py-3 bg-light">
                  <button type="button" className="btn btn-light shadow-sm" onClick={() => setShowCreateModal(false)} disabled={creating}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary px-4 shadow-sm d-flex align-items-center gap-2" disabled={creating}>
                    {creating ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                    <span>Create Record</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Pending Conversions Modal */}
      {showPendingModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
            <div className="modal-content border-0 shadow" style={{ borderRadius: '16px' }}>
              <div className="modal-header border-0 bg-light py-3 px-4">
                <h5 className="modal-title fw-bold">Pending Placement Conversions</h5>
                <button type="button" className="btn-close" onClick={() => setShowPendingModal(false)}></button>
              </div>
              <div className="modal-body p-0">
                {pendingLoading ? (
                  <div className="d-flex flex-column align-items-center justify-content-center py-5">
                    <Loader2 className="spinner-border text-primary border-0 mb-3" size={30} style={{ animation: 'spin 1s linear infinite' }} />
                    <span className="text-muted small">Loading candidates...</span>
                  </div>
                ) : pendingConversions.length === 0 ? (
                  <div className="text-center p-5">
                    <div className="d-inline-flex bg-success bg-opacity-10 text-success rounded-circle p-3 mb-3">
                      <CheckCircle size={32} />
                    </div>
                    <h6 className="fw-bold text-dark">All caught up!</h6>
                    <p className="text-muted small mb-0">There are no 'Selected' candidates waiting to be converted into placements.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-4 py-3 text-slate-500" style={{ fontSize: '0.75rem' }}>STUDENT</th>
                          <th className="py-3 text-slate-500" style={{ fontSize: '0.75rem' }}>JOB & COMPANY</th>
                          <th className="px-4 py-3 text-end text-slate-500" style={{ fontSize: '0.75rem' }}>ACTION</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingConversions.map((app) => (
                          <tr key={app.applicationId}>
                            <td className="px-4 py-3">
                              <div className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>{formatStudentName(app.studentName, app.studentEmail)}</div>
                              <div className="text-muted" style={{ fontSize: '0.75rem' }}>ID: {app.studentId}</div>
                            </td>
                            <td className="py-3">
                              <div className="fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>{app.jobTitle}</div>
                              <div className="text-dark fw-bold" style={{ fontSize: '0.8rem' }}>{app.companyName || 'Unknown Company'}</div>
                            </td>
                            <td className="px-4 py-3 text-end">
                              <button
                                className="btn btn-success btn-sm text-white d-inline-flex align-items-center gap-1 shadow-sm"
                                style={{ borderRadius: '6px' }}
                                onClick={() => handleConvert(app)}
                              >
                                <span>Convert</span>
                                <ArrowRight size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <div className="modal-footer border-top px-4 py-3 bg-white">
                <button type="button" className="btn btn-light shadow-sm" onClick={() => setShowPendingModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
