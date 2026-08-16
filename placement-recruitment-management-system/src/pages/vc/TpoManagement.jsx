import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { vcService } from '../../services/vcService';
import toast from 'react-hot-toast';
import {
  Users,
  UserPlus,
  Key,
  PowerOff,
  CheckCircle,
  Loader2,
  Mail,
  Phone,
  Calendar,
  Lock,
  Eye,
  EyeOff,
  Search,
  ShieldCheck
} from 'lucide-react';

export default function VcTpoManagement() {
  const [tpos, setTpos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [selectedTpo, setSelectedTpo] = useState(null);

  // Form states - Create
  const [createForm, setCreateForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
  });
  const [createShowPassword, setCreateShowPassword] = useState(false);
  const [submittingCreate, setSubmittingCreate] = useState(false);

  // Form states - Reset Password
  const [newPassword, setNewPassword] = useState('');
  const [resetShowPassword, setResetShowPassword] = useState(false);
  const [submittingReset, setSubmittingReset] = useState(false);

  const [togglingId, setTogglingId] = useState(null);

  const loadTpos = async () => {
    try {
      const data = await vcService.getAllTpos();
      setTpos(data || []);
    } catch (err) {
      console.error('Failed to load TPO accounts', err);
      toast.error('Failed to load TPO accounts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTpos();
  }, []);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!createForm.firstName || !createForm.lastName || !createForm.email || !createForm.phoneNumber || !createForm.password) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (createForm.password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    setSubmittingCreate(true);
    try {
      await vcService.createTpo(createForm);
      toast.success('TPO officer account created successfully');
      setShowCreateModal(false);
      setCreateForm({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
      });
      loadTpos();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create TPO account');
    } finally {
      setSubmittingCreate(false);
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long');
      return;
    }

    setSubmittingReset(true);
    try {
      await vcService.resetTpoPassword(selectedTpo.id, newPassword);
      toast.success(`Password reset successfully for ${selectedTpo.firstName} ${selectedTpo.lastName}`);
      setShowResetModal(false);
      setNewPassword('');
      setSelectedTpo(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setSubmittingReset(false);
    }
  };

  const handleToggleStatus = async (tpo) => {
    const newStatus = tpo.accountStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    setTogglingId(tpo.id);
    try {
      await vcService.updateTpoStatus(tpo.id, newStatus);
      toast.success(`TPO account ${newStatus === 'ACTIVE' ? 'activated' : 'deactivated'}`);
      loadTpos();
    } catch (err) {
      toast.error('Failed to update TPO account status');
    } finally {
      setTogglingId(null);
    }
  };

  const filteredTpos = tpos.filter((tpo) => {
    const query = search.toLowerCase();
    const fullName = `${tpo.firstName || ''} ${tpo.lastName || ''}`.toLowerCase();
    const email = (tpo.email || '').toLowerCase();
    const phone = (tpo.phoneNumber || '').toLowerCase();
    return fullName.includes(query) || email.includes(query) || phone.includes(query);
  });

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="container-fluid p-0">
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold text-dark mb-1">Training & Placement Officers (TPO)</h4>
          <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
            Create TPO accounts, govern administrative access, and securely reset passwords.
          </p>
        </div>
        <div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary d-flex align-items-center gap-2 fw-semibold px-3.5 py-2 shadow-sm"
            style={{ borderRadius: '8px' }}
          >
            <UserPlus size={18} />
            <span>Create New TPO</span>
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="card border-0 bg-white shadow-sm mb-4" style={{ borderRadius: '12px' }}>
        <div className="card-body p-3">
          <div className="position-relative" style={{ maxWidth: '400px' }}>
            <span className="position-absolute translate-middle-y text-muted" style={{ left: '1rem', top: '50%' }}>
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Search by TPO name, email, or phone..."
              className="form-control ps-5 focus-ring focus-ring-primary py-2 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* TPO Accounts Table */}
      <div className="card border-0 bg-white shadow-sm overflow-hidden" style={{ borderRadius: '12px' }}>
        {loading ? (
          <div className="d-flex flex-column align-items-center justify-content-center py-5 my-5">
            <Loader2 className="spinner-border text-primary border-0" size={30} style={{ animation: 'spin 1s linear infinite' }} />
            <h6 className="mt-3 text-muted">Loading TPO officers...</h6>
          </div>
        ) : filteredTpos.length === 0 ? (
          <div className="text-center p-5">
            <div className="d-inline-flex bg-light text-muted rounded-circle p-4 mb-3 mx-auto">
              <Users size={40} />
            </div>
            <h5 className="fw-bold">No TPO Officers Found</h5>
            <p className="text-muted text-xs mx-auto mb-4" style={{ maxWidth: '380px' }}>
              No Training & Placement Officers match your search or have been added yet.
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light text-secondary" style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>
                <tr>
                  <th className="px-4 py-3">OFFICER</th>
                  <th className="py-3">CONTACT</th>
                  <th className="py-3">ROLE</th>
                  <th className="py-3">STATUS</th>
                  <th className="px-4 py-3 text-end">VC ACTIONS</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: '0.85rem' }}>
                {filteredTpos.map((tpo) => (
                  <tr key={tpo.id}>
                    <td className="px-4 py-3">
                      <div className="d-flex align-items-center gap-3">
                        <div className="bg-purple-100 text-purple-600 rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-xs" style={{ width: '38px', height: '38px', backgroundColor: '#F3E8FF', color: '#7C3AED' }}>
                          {(tpo.firstName?.[0] || 'T')}{(tpo.lastName?.[0] || 'P')}
                        </div>
                        <div>
                          <h6 className="fw-bold mb-0 text-dark">{tpo.firstName} {tpo.lastName}</h6>
                          <div className="text-muted text-xs d-flex align-items-center gap-1 mt-0.5">
                            <Mail size={12} /> {tpo.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="text-dark fw-medium d-flex align-items-center gap-1.5">
                        <Phone size={13} className="text-muted" /> {tpo.phoneNumber}
                      </div>
                    </td>
                    <td>
                      <span className="badge px-2.5 py-1 text-purple-700 bg-purple-100 border border-purple-200" style={{ backgroundColor: '#F3E8FF', color: '#6B21A8' }}>
                        TPO
                      </span>
                    </td>
                    <td>
                      {tpo.accountStatus === 'ACTIVE' ? (
                        <span className="badge bg-success bg-opacity-10 text-success border border-success">ACTIVE</span>
                      ) : (
                        <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary">INACTIVE</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-end">
                      <div className="d-flex justify-content-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedTpo(tpo);
                            setNewPassword('');
                            setShowResetModal(true);
                          }}
                          className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1.5 fw-semibold px-2.5 py-1.5"
                          title="Reset TPO Password"
                        >
                          <Key size={14} />
                          <span>Reset Password</span>
                        </button>
                        <button
                          onClick={() => handleToggleStatus(tpo)}
                          disabled={togglingId === tpo.id}
                          className={`btn btn-sm d-flex align-items-center gap-1.5 fw-semibold px-2.5 py-1.5 ${
                            tpo.accountStatus === 'ACTIVE'
                              ? 'btn-outline-warning text-dark'
                              : 'btn-outline-success'
                          }`}
                          title={tpo.accountStatus === 'ACTIVE' ? 'Deactivate TPO' : 'Activate TPO'}
                        >
                          {tpo.accountStatus === 'ACTIVE' ? (
                            <>
                              <PowerOff size={14} />
                              <span>Deactivate</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle size={14} />
                              <span>Activate</span>
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Create TPO */}
      {showCreateModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '500px' }}>
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '16px', overflow: 'hidden' }}>
              <div className="modal-header py-3 px-4 text-white" style={{ backgroundColor: '#0F172A' }}>
                <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                  <UserPlus size={20} />
                  <span>Create New TPO Officer</span>
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowCreateModal(false)}></button>
              </div>
              <form onSubmit={handleCreateSubmit}>
                <div className="modal-body p-4 bg-white">
                  <div className="row g-3">
                    <div className="col-6">
                      <label className="form-label fw-semibold text-slate-700 text-xs mb-1">FIRST NAME</label>
                      <input
                        type="text"
                        required
                        placeholder="John"
                        className="form-control text-sm"
                        value={createForm.firstName}
                        onChange={(e) => setCreateForm({ ...createForm, firstName: e.target.value })}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label fw-semibold text-slate-700 text-xs mb-1">LAST NAME</label>
                      <input
                        type="text"
                        required
                        placeholder="Doe"
                        className="form-control text-sm"
                        value={createForm.lastName}
                        onChange={(e) => setCreateForm({ ...createForm, lastName: e.target.value })}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold text-slate-700 text-xs mb-1">OFFICIAL EMAIL</label>
                      <input
                        type="email"
                        required
                        placeholder="tpo.officer@indus.edu"
                        className="form-control text-sm"
                        value={createForm.email}
                        onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold text-slate-700 text-xs mb-1">PHONE NUMBER (10 DIGITS)</label>
                      <input
                        type="tel"
                        required
                        pattern="^[0-9]{10}$"
                        placeholder="9876543210"
                        className="form-control text-sm"
                        value={createForm.phoneNumber}
                        onChange={(e) => setCreateForm({ ...createForm, phoneNumber: e.target.value })}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold text-slate-700 text-xs mb-1">INITIAL PASSWORD (MIN 8 CHARS)</label>
                      <div className="position-relative">
                        <input
                          type={createShowPassword ? 'text' : 'password'}
                          required
                          minLength={8}
                          placeholder="••••••••"
                          className="form-control text-sm pe-5"
                          value={createForm.password}
                          onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                        />
                        <button
                          type="button"
                          onClick={() => setCreateShowPassword(!createShowPassword)}
                          className="btn border-0 position-absolute end-0 top-0 h-100 px-3 d-flex align-items-center text-muted"
                          style={{ background: 'transparent' }}
                        >
                          {createShowPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer bg-light py-3 px-4 border-0">
                  <button type="button" className="btn btn-light shadow-sm" onClick={() => setShowCreateModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" disabled={submittingCreate} className="btn btn-primary px-4 shadow-sm fw-semibold">
                    {submittingCreate ? 'Creating...' : 'Create TPO Account'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Reset TPO Password */}
      {showResetModal && selectedTpo && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '420px' }}>
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '16px', overflow: 'hidden' }}>
              <div className="modal-header py-3 px-4 text-white" style={{ backgroundColor: '#0F172A' }}>
                <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
                  <Key size={18} />
                  <span>Reset TPO Password</span>
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowResetModal(false)}></button>
              </div>
              <form onSubmit={handleResetPasswordSubmit}>
                <div className="modal-body p-4 bg-white">
                  <p className="text-secondary text-sm mb-3">
                    Set a new secure password for <strong>{selectedTpo.firstName} {selectedTpo.lastName}</strong> ({selectedTpo.email}).
                  </p>
                  <div>
                    <label className="form-label fw-semibold text-slate-700 text-xs mb-1">NEW PASSWORD (MIN 8 CHARS)</label>
                    <div className="position-relative">
                      <input
                        type={resetShowPassword ? 'text' : 'password'}
                        required
                        minLength={8}
                        placeholder="••••••••"
                        className="form-control text-sm pe-5"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setResetShowPassword(!resetShowPassword)}
                        className="btn border-0 position-absolute end-0 top-0 h-100 px-3 d-flex align-items-center text-muted"
                        style={{ background: 'transparent' }}
                      >
                        {resetShowPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="modal-footer bg-light py-3 px-4 border-0">
                  <button type="button" className="btn btn-light shadow-sm" onClick={() => setShowResetModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" disabled={submittingReset} className="btn btn-primary px-4 shadow-sm fw-semibold">
                    {submittingReset ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
