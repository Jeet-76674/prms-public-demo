import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { tpoService } from '../../services/tpoService';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { formatStudentName } from '../../utils/nameHelper';
import {
  ArrowLeft,
  Loader2,
  Briefcase,
  Building2,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Save,
  User,
  Mail,
  FileText
} from 'lucide-react';

export default function TpoPlacementDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [placement, setPlacement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  
  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    packageAmount: '',
    joiningDate: '',
    remarks: ''
  });

  useEffect(() => {
    loadPlacement();
  }, [id]);

  const loadPlacement = async () => {
    try {
      const data = await tpoService.getPlacementById(id);
      setPlacement(data);
      setEditForm({
        packageAmount: data.packageAmount || '',
        joiningDate: data.joiningDate || '',
        remarks: data.remarks || ''
      });
    } catch (err) {
      console.error('Failed to load placement details', err);
      toast.error('Placement not found');
      navigate('/tpo/placements');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePlacement = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      const payload = {
        ...editForm,
        packageAmount: editForm.packageAmount ? parseFloat(editForm.packageAmount) : null
      };
      await tpoService.updatePlacement(id, payload);
      toast.success('Placement updated successfully');
      setIsEditing(false);
      loadPlacement();
    } catch (err) {
      toast.error('Failed to update placement');
    } finally {
      setProcessing(false);
    }
  };

  const handleUpdateOfferStatus = async (status) => {
    setProcessing(true);
    try {
      await tpoService.updateOfferStatus(id, status);
      toast.success(`Offer status updated to ${status}`);
      loadPlacement();
    } catch (err) {
      toast.error('Failed to update offer status');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-5 my-5">
        <Loader2 className="spinner-border text-primary border-0" size={40} style={{ animation: 'spin 1s linear infinite' }} />
        <h6 className="mt-3 text-muted">Loading placement details...</h6>
      </div>
    );
  }

  if (!placement) return null;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'OFFERED':
        return <span className="badge bg-primary bg-opacity-10 text-primary border border-primary px-3 py-2" style={{ fontSize: '0.8rem' }}><Clock size={14} className="me-1" /> OFFERED</span>;
      case 'ACCEPTED':
        return <span className="badge bg-success bg-opacity-10 text-success border border-success px-3 py-2" style={{ fontSize: '0.8rem' }}><CheckCircle size={14} className="me-1" /> ACCEPTED</span>;
      case 'DECLINED':
        return <span className="badge bg-danger bg-opacity-10 text-danger border border-danger px-3 py-2" style={{ fontSize: '0.8rem' }}><XCircle size={14} className="me-1" /> DECLINED</span>;
      case 'JOINED':
        return <span className="badge bg-purple bg-opacity-10 text-purple border border-purple px-3 py-2" style={{ color: '#8b5cf6', backgroundColor: '#ede9fe', borderColor: '#c4b5fd', fontSize: '0.8rem' }}><CheckCircle size={14} className="me-1" /> JOINED</span>;
      default:
        return <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary px-3 py-2" style={{ fontSize: '0.8rem' }}>{status}</span>;
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container-fluid p-0">
      {/* Back Button */}
      <Link
        to="/tpo/placements"
        className="btn-back mb-4"
      >
        <ArrowLeft size={18} className="text-primary" />
        <span>Back to Placement Audit</span>
      </Link>

      <div className="row g-4">
        {/* Left Column: Basic Info */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 bg-white shadow-sm p-4 h-100" style={{ borderRadius: '12px' }}>
            <h5 className="fw-bold text-dark mb-4 border-bottom pb-3">Placement Overview</h5>
            
            <div className="d-flex flex-column align-items-center text-center mb-4">
              <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center text-dark border shadow-sm mb-3" style={{ width: '80px', height: '80px' }}>
                <Building2 size={32} />
              </div>
              <h4 className="fw-bold text-dark mb-1">{placement.companyName}</h4>
              <p className="text-muted fw-medium mb-2">{placement.jobTitle}</p>
              <div>{getStatusBadge(placement.offerStatus)}</div>
            </div>
            
            <div className="d-flex flex-column gap-3 pt-3 border-top">
              <div className="d-flex align-items-center gap-3">
                <div className="bg-light p-2 rounded text-primary"><User size={18} /></div>
                <div>
                  <div className="text-xs text-muted fw-semibold">Student</div>
                  <div className="fw-medium text-dark">{formatStudentName(placement.studentName, placement.studentEmail)}</div>
                </div>
              </div>
              <div className="d-flex align-items-center gap-3">
                <div className="bg-light p-2 rounded text-secondary"><Mail size={18} /></div>
                <div>
                  <div className="text-xs text-muted fw-semibold">Email</div>
                  <div className="fw-medium text-dark">{placement.studentEmail}</div>
                </div>
              </div>
              <div className="d-flex align-items-center gap-3">
                <div className="bg-light p-2 rounded text-success"><Briefcase size={18} /></div>
                <div>
                  <div className="text-xs text-muted fw-semibold">Employment Type</div>
                  <div className="fw-medium text-dark">{placement.employmentType}</div>
                </div>
              </div>
              <div className="d-flex align-items-center gap-3">
                <div className="bg-light p-2 rounded text-danger"><MapPin size={18} /></div>
                <div>
                  <div className="text-xs text-muted fw-semibold">Location</div>
                  <div className="fw-medium text-dark">{placement.workLocation}</div>
                </div>
              </div>
              <div className="d-flex align-items-center gap-3">
                <div className="bg-light p-2 rounded text-info"><Calendar size={18} /></div>
                <div>
                  <div className="text-xs text-muted fw-semibold">Offer Date</div>
                  <div className="fw-medium text-dark">{placement.offerDate}</div>
                </div>
              </div>
              {placement.offerLetterUrl && (
                <div className="d-flex align-items-center gap-3 mt-2">
                  <div className="bg-light p-2 rounded text-dark"><FileText size={18} /></div>
                  <div>
                    <a href={placement.offerLetterUrl.startsWith('http') ? placement.offerLetterUrl : `${api.defaults.baseURL}${placement.offerLetterUrl}`} target="_blank" rel="noreferrer" className="text-primary text-decoration-none fw-medium text-sm">
                      View Offer Letter
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Editable Details & Status Management */}
        <div className="col-12 col-lg-8">
          
          <div className="card border-0 bg-white shadow-sm p-4 mb-4" style={{ borderRadius: '12px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold text-dark m-0">Placement Details</h5>
              {!isEditing ? (
                <button 
                  className="btn btn-outline-primary btn-sm" 
                  onClick={() => setIsEditing(true)}
                  style={{ borderRadius: '6px' }}
                >
                  Edit Details
                </button>
              ) : (
                <button 
                  className="btn btn-outline-secondary btn-sm" 
                  onClick={() => {
                    setIsEditing(false);
                    setEditForm({
                      packageAmount: placement.packageAmount || '',
                      joiningDate: placement.joiningDate || '',
                      remarks: placement.remarks || ''
                    });
                  }}
                  style={{ borderRadius: '6px' }}
                >
                  Cancel Edit
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleUpdatePlacement}>
                <div className="row g-4">
                  <div className="col-12 col-md-6">
                    <label className="form-label text-sm fw-medium text-secondary">Package Amount (₹)</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      value={editForm.packageAmount}
                      onChange={(e) => setEditForm({...editForm, packageAmount: e.target.value})}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label text-sm fw-medium text-secondary">Joining Date</label>
                    <input 
                      type="date" 
                      className="form-control" 
                      value={editForm.joiningDate}
                      onChange={(e) => setEditForm({...editForm, joiningDate: e.target.value})}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label text-sm fw-medium text-secondary">Remarks</label>
                    <textarea 
                      className="form-control" 
                      rows="3"
                      value={editForm.remarks}
                      onChange={(e) => setEditForm({...editForm, remarks: e.target.value})}
                    ></textarea>
                  </div>
                  <div className="col-12 text-end mt-4">
                    <button type="submit" disabled={processing} className="btn btn-primary d-inline-flex align-items-center gap-2" style={{ borderRadius: '8px' }}>
                      {processing ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                      <span>Save Changes</span>
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="row g-4">
                <div className="col-12 col-md-6">
                  <div className="p-3 bg-light rounded text-center">
                    <span className="d-block text-muted text-xs fw-semibold mb-1">Package Amount</span>
                    <h4 className="fw-bold text-success mb-0">₹{placement.packageAmount ? placement.packageAmount.toLocaleString('en-IN') : 'N/A'}</h4>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="p-3 bg-light rounded text-center">
                    <span className="d-block text-muted text-xs fw-semibold mb-1">Joining Date</span>
                    <h4 className="fw-bold text-dark mb-0">{placement.joiningDate || 'N/A'}</h4>
                  </div>
                </div>
                <div className="col-12 mt-4">
                  <span className="d-block text-muted text-xs fw-semibold mb-2">Remarks</span>
                  <div className="p-3 bg-light rounded text-dark text-sm">
                    {placement.remarks || 'No remarks provided.'}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Offer Status Management Area */}
          <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '12px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0 !important' }}>
            <h5 className="fw-bold text-dark mb-3">Offer Status Management</h5>
            <div className="d-flex flex-wrap gap-3 align-items-end">
              <div className="flex-grow-1" style={{ maxWidth: '300px' }}>
                <label className="form-label text-muted text-xs fw-semibold">Update Status</label>
                <select 
                  className="form-select focus-ring focus-ring-primary"
                  value={placement.offerStatus}
                  onChange={(e) => handleUpdateOfferStatus(e.target.value)}
                  disabled={processing}
                >
                  <option value="OFFERED">Offered</option>
                  <option value="ACCEPTED">Accepted</option>
                  <option value="DECLINED">Declined</option>
                  <option value="JOINED">Joined</option>
                </select>
              </div>
            </div>
            <p className="text-muted mt-3 mb-0" style={{ fontSize: '0.8rem' }}>
              Updating the offer status will automatically trigger relevant email notifications to the student and recruiter.
            </p>
          </div>

        </div>
      </div>

    </motion.div>
  );
}
