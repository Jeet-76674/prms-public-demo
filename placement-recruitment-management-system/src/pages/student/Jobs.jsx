import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { studentService } from '../../services/studentService';
import api from '../../services/api';
import Pagination from '../../components/Pagination';
import CompanyProfileModal from '../../components/CompanyProfileModal';
import { Search, Briefcase, MapPin, IndianRupee, Calendar, Filter, RotateCcw, ArrowRight, CheckCircle, Building2, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

export default function StudentJobs() {
  const [allJobs, setAllJobs] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [appliedJobsList, setAppliedJobsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [modeFilter, setModeFilter] = useState('');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      // Fetch open jobs catalog
      const data = await studentService.getJobs({ page: 0, size: 100 });
      const openJobs = (data.content || []).filter(j => j.status === 'OPEN');
      setAllJobs(openJobs);

      // fetch applications to cross check applied jobs
      try {
        const apps = await studentService.getApplications();
        const appliedIds = (apps.content || []).map(app => app.jobId);
        setAppliedJobsList(appliedIds);
      } catch (err) {
        console.error("Failed to load applications for applied status check", err);
      }
    } catch (err) {
      toast.error('Failed to load jobs list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Multi-field smart filtering engine
  const filteredJobs = useMemo(() => {
    return allJobs.filter((job) => {
      // Search query across Title, Company, Skills, Department, and Description
      if (search.trim()) {
        const query = search.toLowerCase().trim();
        const matchTitle = job.title?.toLowerCase().includes(query);
        const matchCompany = job.companyName?.toLowerCase().includes(query);
        const matchSkills = job.requiredSkills?.toLowerCase().includes(query);
        const matchDept = job.department?.toLowerCase().includes(query);
        const matchDesc = job.description?.toLowerCase().includes(query);
        if (!matchTitle && !matchCompany && !matchSkills && !matchDept && !matchDesc) {
          return false;
        }
      }

      // Location Filter
      if (locationFilter.trim()) {
        const locQuery = locationFilter.toLowerCase().trim();
        if (!job.location?.toLowerCase().includes(locQuery)) {
          return false;
        }
      }

      // Department Filter
      if (deptFilter.trim()) {
        const deptQuery = deptFilter.toLowerCase().trim();
        if (!job.department?.toLowerCase().includes(deptQuery)) {
          return false;
        }
      }

      // Employment Type Filter (Internship, Full Time, Part Time)
      if (typeFilter) {
        const normFilter = typeFilter.toLowerCase().replace(/[^a-z]/g, '');
        const normJobType = (job.employmentType || '').toLowerCase().replace(/[^a-z]/g, '');
        if (!normJobType.includes(normFilter) && !normFilter.includes(normJobType)) {
          return false;
        }
      }

      // Work Mode Filter (On-site, Hybrid, Remote)
      if (modeFilter) {
        const normMode = modeFilter.toLowerCase().replace(/[^a-z]/g, '');
        const normJobMode = (job.workMode || '').toLowerCase().replace(/[^a-z]/g, '');
        if (!normJobMode.includes(normMode) && !normMode.includes(normJobMode)) {
          return false;
        }
      }

      return true;
    });
  }, [allJobs, search, locationFilter, deptFilter, typeFilter, modeFilter]);

  // Pagination on filtered subset
  const totalElements = filteredJobs.length;
  const totalPages = Math.ceil(totalElements / size) || 1;
  const paginatedJobs = useMemo(() => {
    const start = page * size;
    return filteredJobs.slice(start, start + size);
  }, [filteredJobs, page, size]);

  const resetFilters = () => {
    setSearch('');
    setLocationFilter('');
    setDeptFilter('');
    setTypeFilter('');
    setModeFilter('');
    setPage(0);
  };

  const hasActiveFilters = Boolean(search || locationFilter || deptFilter || typeFilter || modeFilter);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="container py-4"
    >
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">Career Placements</h3>
          <p className="text-secondary mb-0">Discover top tier technical roles curated for university candidates.</p>
        </div>
      </div>

      {/* Modern Filter Card */}
      <div className="card border-0 p-3 bg-white shadow-sm mb-4" style={{ borderRadius: '12px' }}>
        <div className="row g-3">
          {/* Main search bar */}
          <div className="col-12 col-md-5">
            <div className="position-relative">
              <span className="position-absolute translate-middle-y text-muted" style={{ left: '1rem', top: '50%' }}>
                <Search size={18} />
              </span>
              <input
                type="text"
                placeholder="Search job title, company, skills..."
                className="form-control ps-5 focus-ring focus-ring-primary"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(0);
                }}
              />
            </div>
          </div>

          {/* Location filter */}
          <div className="col-12 col-md-3">
            <div className="position-relative">
              <span className="position-absolute translate-middle-y text-muted" style={{ left: '1rem', top: '50%' }}>
                <MapPin size={18} />
              </span>
              <input
                type="text"
                placeholder="Filter by location..."
                className="form-control ps-5 focus-ring focus-ring-primary"
                value={locationFilter}
                onChange={(e) => {
                  setLocationFilter(e.target.value);
                  setPage(0);
                }}
              />
            </div>
          </div>

          {/* Department dropdown */}
          <div className="col-6 col-md-2">
            <input
              type="text"
              placeholder="Department"
              className="form-control focus-ring focus-ring-primary"
              value={deptFilter}
              onChange={(e) => {
                setDeptFilter(e.target.value);
                setPage(0);
              }}
            />
          </div>

          {/* Clear Button */}
          <div className="col-6 col-md-2">
            <button
              onClick={resetFilters}
              className={`btn w-100 d-flex align-items-center justify-content-center gap-2 ${hasActiveFilters ? 'btn-primary' : 'btn-outline-secondary'}`}
            >
              <RotateCcw size={16} />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Dynamic Filter Chips */}
        <div className="d-flex flex-wrap gap-2 mt-3 pt-3 border-top align-items-center">
          <div className="d-flex align-items-center gap-2 text-secondary fw-semibold me-2" style={{ fontSize: '0.8rem' }}>
            <Filter size={14} /> Quick Filters:
          </div>

          {/* Job Type Chips */}
          {['Internship', 'Full Time', 'Part Time'].map(type => (
            <button
              key={type}
              onClick={() => {
                setTypeFilter(typeFilter === type ? '' : type);
                setPage(0);
              }}
              className={`btn btn-sm py-1 px-3 ${typeFilter === type ? 'btn-primary shadow-xs fw-semibold' : 'btn-light border text-secondary'}`}
              style={{ fontSize: '0.78rem', borderRadius: '20px' }}
            >
              {type}
            </button>
          ))}

          <div className="vr mx-1"></div>

          {/* Work Mode Chips */}
          {['On-site', 'Hybrid', 'Remote'].map(mode => (
            <button
              key={mode}
              onClick={() => {
                setModeFilter(modeFilter === mode ? '' : mode);
                setPage(0);
              }}
              className={`btn btn-sm py-1 px-3 ${modeFilter === mode ? 'btn-primary shadow-xs fw-semibold' : 'btn-light border text-secondary'}`}
              style={{ fontSize: '0.78rem', borderRadius: '20px' }}
            >
              {mode}
            </button>
          ))}

          {hasActiveFilters && (
            <span className="badge bg-primary-subtle text-primary ms-auto px-2.5 py-1 rounded-pill" style={{ fontSize: '0.72rem' }}>
              {filteredJobs.length} {filteredJobs.length === 1 ? 'role' : 'roles'} found
            </span>
          )}
        </div>
      </div>

      {/* Skeletons/Cards list */}
      {loading ? (
        <div className="row g-4">
          {[1, 2, 3].map(n => (
            <div key={n} className="col-12">
              <div className="card p-4 border-0 shadow-sm" style={{ height: '140px', overflow: 'hidden', borderRadius: '12px' }}>
                <div className="d-flex gap-3 align-items-center mb-3">
                  <div className="bg-light rounded-3 placeholder placeholder-glow" style={{ width: '48px', height: '48px' }}></div>
                  <div className="flex-grow-1">
                    <div className="bg-light rounded placeholder placeholder-glow" style={{ height: '16px', width: '200px', marginBottom: '8px' }}></div>
                    <div className="bg-light rounded placeholder placeholder-glow" style={{ height: '12px', width: '120px' }}></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : paginatedJobs.length === 0 ? (
        <div className="card text-center p-5 border-0 bg-white shadow-sm" style={{ borderRadius: '12px' }}>
          <div className="d-inline-flex bg-light text-muted rounded-circle p-4 mb-3 mx-auto">
            <Briefcase size={40} />
          </div>
          <h5 className="fw-bold text-slate-900">No Openings Match the Criteria</h5>
          <p className="text-secondary mx-auto mb-4" style={{ maxWidth: '420px', fontSize: '0.9rem' }}>
            We could not locate any placement listings that fit your active filtering queries. Try resetting or adjusting the search keywords.
          </p>
          <button onClick={resetFilters} className="btn btn-primary px-4 mx-auto shadow-sm" style={{ borderRadius: '8px' }}>
            Reset Filters & View All
          </button>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {paginatedJobs.map((job) => {
            const hasApplied = appliedJobsList.includes(job.id);
            return (
              <div key={job.id} className="card p-4 border-0 card-hover bg-white shadow-sm" style={{ borderRadius: '14px' }}>
                <div className="row g-3 align-items-start align-items-md-center">

                  {/* Left Column Logo */}
                  <div className="col-12 col-md-auto text-start">
                    <div className="rounded-3 border border-light d-flex align-items-center justify-content-center text-primary shadow-2xs" style={{ width: '56px', height: '56px', backgroundColor: '#F8FAFC' }}>
                      <Building2 size={26} />
                    </div>
                  </div>

                  {/* Mid Column details */}
                  <div className="col-12 col-md flex-grow-1 text-start">
                    <div className="d-flex align-items-center gap-2 flex-wrap mb-1.5">
                      <Link to={`/student/jobs/${job.id}`} className="text-decoration-none text-dark hover-text-primary">
                        <h5 className="fw-bold mb-0 text-slate-900" style={{ letterSpacing: '-0.01em' }}>{job.title}</h5>
                      </Link>
                      <span className="badge bg-primary bg-opacity-10 text-primary border-0 px-2.5 py-1 rounded-pill">{job.employmentType}</span>
                      <span className="badge bg-info bg-opacity-10 text-info border-0 px-2.5 py-1 rounded-pill">{job.workMode}</span>
                      {hasApplied && (
                        <span className="badge bg-success-subtle text-success border border-success d-flex align-items-center gap-1 px-2.5 py-1 rounded-pill">
                          <CheckCircle size={12} /> Applied
                        </span>
                      )}
                    </div>

                    <div className="d-flex align-items-center gap-2 mb-2 flex-wrap" style={{ fontSize: '0.875rem' }}>
                      <span
                        onClick={() => setSelectedCompany({ name: job.companyName, location: job.location })}
                        className="fw-semibold text-primary d-inline-flex align-items-center gap-1 cursor-pointer"
                        style={{ cursor: 'pointer' }}
                        title="Click to view company details"
                      >
                        <span className="hover-underline">{job.companyName}</span>
                        <ExternalLink size={12} className="opacity-75" />
                      </span>
                      <span className="text-muted" style={{ opacity: 0.6 }}>•</span>
                      <span className="text-secondary">{job.department}</span>
                    </div>

                    <div className="d-flex flex-wrap gap-3 text-secondary" style={{ fontSize: '0.85rem' }}>
                      <span className="d-flex align-items-center gap-1"><MapPin size={15} /> {job.location}</span>
                      <span className="d-flex align-items-center gap-1"><IndianRupee size={15} /> ₹{job.minimumSalary ? Number(job.minimumSalary).toLocaleString('en-IN') : '0'} - ₹{job.maximumSalary ? Number(job.maximumSalary).toLocaleString('en-IN') : '0'}</span>
                      <span className="d-flex align-items-center gap-1"><Calendar size={15} /> Deadline: {job.applicationDeadline}</span>
                    </div>
                  </div>

                  {/* Right Column Action */}
                  <div className="col-12 col-md-auto text-start text-md-end pt-3 pt-md-0 border-top border-top-md-0 border-light">
                    <div className="d-flex flex-md-column align-items-center align-items-md-end gap-2 justify-content-between">
                      <Link to={`/student/jobs/${job.id}`} className="btn btn-outline-primary d-flex align-items-center gap-2 px-4 shadow-sm" style={{ borderRadius: '8px' }}>
                        <span>View Details</span>
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && filteredJobs.length > 0 && (
        <div className="mt-4">
          <Pagination
            page={page}
            totalPages={totalPages}
            totalElements={totalElements}
            size={size}
            setPage={setPage}
          />
        </div>
      )}

      {/* Company Profile Modal */}
      <CompanyProfileModal 
        companyName={selectedCompany?.name}
        location={selectedCompany?.location}
        isOpen={Boolean(selectedCompany)}
        onClose={() => setSelectedCompany(null)}
      />
    </motion.div>
  );
}
