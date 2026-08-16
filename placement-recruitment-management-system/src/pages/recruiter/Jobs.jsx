import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { recruiterService } from '../../services/recruiterService';
import Pagination from '../../components/Pagination';
import { Briefcase, Search, PlusCircle, Trash2, Edit3, Users, Play, Pause, AlertTriangle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RecruiterJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  
  // State for delete modal
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, [page]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await recruiterService.getJobs({ page, size: 10 });
      setJobs(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      toast.error('Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => 
    job.title?.toLowerCase().includes(search.toLowerCase()) || 
    job.department?.toLowerCase().includes(search.toLowerCase())
  );

  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus === 'OPEN' ? 'CLOSED' : 'OPEN';
    try {
      await recruiterService.updateJobStatus(id, newStatus);
      toast.success(`Job marked as ${newStatus}`);
      fetchJobs();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteTargetId(id);
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      await recruiterService.deleteJob(deleteTargetId);
      toast.success('Job deleted successfully');
      setJobs(jobs.filter(j => j.id !== deleteTargetId));
      setDeleteTargetId(null);
    } catch (err) {
      toast.error('Failed to delete job');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Loader2 className="spinner" size={32} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="container py-4"
    >
      <div className="mb-4">
        <div className="row align-items-end g-3">
          <div className="col-12 col-md-5">
            <h3 className="fw-bold text-dark mb-1">Company Placements</h3>
            <p className="text-secondary mb-0 text-xs">Manage active listings, view applicant databases, and archive completed schedules.</p>
          </div>
          
          <div className="col-12 col-md-7 d-flex flex-wrap gap-2 justify-content-md-end">
            <div className="position-relative flex-grow-1 flex-md-grow-0" style={{ maxWidth: '300px' }}>
              <span className="position-absolute translate-middle-y text-muted" style={{ left: '0.75rem', top: '50%' }}>
                <Search size={16} />
              </span>
              <input
                type="text"
                placeholder="Search jobs..."
                className="form-control ps-5 py-2 text-xs focus-ring focus-ring-primary"
                style={{ fontSize: '0.85rem' }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <Link to="/recruiter/jobs/create" className="btn btn-success text-white border-0 d-flex align-items-center gap-2 px-3 shadow-sm bg-success">
              <PlusCircle size={16} />
              <span style={{ fontSize: '0.85rem' }}>Post Opening</span>
            </Link>
          </div>
        </div>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="card text-center p-5 border-0 bg-white shadow-sm" style={{ borderRadius: '12px' }}>
          <div className="d-inline-flex bg-light text-muted rounded-circle p-4 mb-3 mx-auto">
            <Briefcase size={40} />
          </div>
          <h5 className="fw-bold">No Openings Listed</h5>
          <p className="text-muted text-xs mx-auto mb-4" style={{ maxWidth: '380px' }}>
            You haven't listed any positions for student placement cycles yet. Post a new opening with required CGPA filters.
          </p>
          <Link to="/recruiter/jobs/create" className="btn btn-success text-white border-0 px-4 py-2 mx-auto btn-sm bg-success shadow-sm">
            Post First Role
          </Link>
        </div>
      ) : (
        <div className="card border-0 bg-white shadow-sm overflow-hidden" style={{ borderRadius: '12px' }}>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light text-secondary" style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>
                <tr>
                  <th className="px-4 py-3">PLACEMENT OPENING</th>
                  <th className="py-3">DEPARTMENT</th>
                  <th className="py-3">CRITERIA</th>
                  <th className="py-3">VACANCIES</th>
                  <th className="py-3">DEADLINE</th>
                  <th className="py-3">STATUS</th>
                  <th className="px-4 py-3 text-end">ACTIONS</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: '0.85rem' }}>
                {filteredJobs.map((job) => (
                  <tr
                    key={job.id}
                    onClick={() => navigate(`/recruiter/jobs/${job.id}/applicants`)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Opening Title */}
                    <td className="px-4 py-3">
                      <div>
                        <div className="fw-bold text-secondary mb-0.5 hover-text-primary transition-all">{job.title}</div>
                        <span className="text-muted text-xs" style={{ fontSize: '0.75rem' }}>
                          {job.location} • {job.workMode}
                        </span>
                      </div>
                    </td>
                    
                    {/* Department */}
                    <td className="text-muted">{job.department}</td>
                    
                    {/* Criteria GPA */}
                    <td>
                      <div>
                        <div className="fw-bold" style={{ fontSize: '0.8rem' }}>GPA ≥ {job.minimumCgpa ?? job.minimumCGPA ?? 0}</div>
                        <div className="text-muted" style={{ fontSize: '0.7rem' }}>Backlogs ≤ {job.allowedBacklogs}</div>
                      </div>
                    </td>

                    {/* Vacancies */}
                    <td className="fw-semibold text-secondary">{job.vacancies} open</td>

                    {/* Deadline */}
                    <td className="text-muted">{job.applicationDeadline}</td>

                    {/* Status badge */}
                    <td>
                      <span className={`badge ${job.status === 'OPEN' ? 'bg-success bg-opacity-10 text-success' : job.status === 'CLOSED' ? 'bg-secondary bg-opacity-10 text-secondary' : 'bg-warning bg-opacity-10 text-warning'}`}>
                        {job.status}
                      </span>
                    </td>

                    {/* Actions button list */}
                    <td className="px-4 py-3 text-end" onClick={(e) => e.stopPropagation()}>
                      <div className="d-flex align-items-center gap-1.5 justify-content-end">
                        
                        {/* Toggle Open/Closed status */}
                        {(job.status === 'OPEN' || job.status === 'CLOSED') && (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleStatusChange(job.id, job.status); }}
                            className="btn btn-light btn-sm p-1.5 text-secondary border d-flex align-items-center justify-content-center"
                            title={job.status === 'OPEN' ? 'Pause / Close Job' : 'Open / Publish Job'}
                          >
                            {job.status === 'OPEN' ? <Pause size={14} /> : <Play size={14} />}
                          </button>
                        )}

                        {/* View Applicants */}
                        <Link
                          to={`/recruiter/jobs/${job.id}/applicants`}
                          onClick={(e) => e.stopPropagation()}
                          className="btn btn-light btn-sm p-1.5 text-primary border d-flex align-items-center justify-content-center"
                          title="View Applicant Pipeline"
                        >
                          <Users size={14} />
                        </Link>
                        
                        {/* Edit job fields */}
                        <Link
                          to={`/recruiter/jobs/edit/${job.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="btn btn-light btn-sm p-1.5 text-warning border d-flex align-items-center justify-content-center"
                          title="Edit Specifications"
                        >
                          <Edit3 size={14} />
                        </Link>
                        
                        {/* Delete Job */}
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteClick(job.id); }}
                          className="btn btn-light btn-sm p-1.5 text-danger border d-flex align-items-center justify-content-center"
                          title="Delete Listing"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && jobs.length > 0 && (
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

      {/* Delete confirmation modal */}
      {deleteTargetId && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '420px' }}>
            <div className="modal-content border-0" style={{ borderRadius: '16px', overflow: 'hidden' }}>
              <div className="modal-header bg-danger text-white py-3 border-0">
                <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                  <AlertTriangle size={20} />
                  <span>Delete Placement?</span>
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setDeleteTargetId(null)}></button>
              </div>
              <div className="modal-body p-4 text-start bg-white">
                <p className="text-secondary mb-0" style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>
                  Are you absolutely sure you want to delete this placement listing? This will completely archive the opening, remove candidate matches, and close the pipeline.
                </p>
              </div>
              <div className="modal-footer bg-light py-3 border-0">
                <button type="button" className="btn btn-light shadow-sm" onClick={() => setDeleteTargetId(null)}>
                  Keep active
                </button>
                <button type="button" disabled={deleting} className="btn btn-danger px-4 shadow-sm" onClick={handleDeleteConfirm}>
                  {deleting ? 'Removing...' : 'Delete Permanently'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
