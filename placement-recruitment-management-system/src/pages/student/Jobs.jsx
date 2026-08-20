import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { studentService } from '../../services/studentService';
import api from '../../services/api';
import Pagination from '../../components/Pagination';
import { Search, Briefcase, MapPin, IndianRupee, Calendar, Filter, RotateCcw, ArrowRight, CheckCircle, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function StudentJobs() {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [appliedJobsList, setAppliedJobsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const baseURL = api.defaults.baseURL || 'http://localhost:8080';

  // Filters
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [modeFilter, setModeFilter] = useState('');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await studentService.getJobs({
        title: search,
        location: locationFilter,
        department: deptFilter,
        employmentType: typeFilter,
        workMode: modeFilter,
        page: page,
        size: size
      });
      // Filter out any Drafts or Closed just to be completely safe based on spec
      const openJobs = (data.content || []).filter(j => j.status === 'OPEN');
      setJobs(openJobs);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);

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
  }, [page]);

  useEffect(() => {
    // using debounced approach for search
    const delay = setTimeout(() => {
      setPage(0);
      fetchJobs();
    }, 400);
    return () => clearTimeout(delay);
  }, [search, locationFilter, deptFilter, typeFilter, modeFilter]);

  const resetFilters = () => {
    setSearch('');
    setLocationFilter('');
    setDeptFilter('');
    setTypeFilter('');
    setModeFilter('');
  };

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
                onChange={(e) => setSearch(e.target.value)}
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
                onChange={(e) => setLocationFilter(e.target.value)}
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
              onChange={(e) => setDeptFilter(e.target.value)}
            />
          </div>

          {/* Clear Button */}
          <div className="col-6 col-md-2">
            <button
              onClick={resetFilters}
              className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2"
            >
              <RotateCcw size={16} />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Dynamic Filter Chips */}
        <div className="d-flex flex-wrap gap-2 mt-3 pt-3 border-top">
          <div className="d-flex align-items-center gap-2 text-secondary fw-semibold me-2" style={{ fontSize: '0.8rem' }}>
            <Filter size={14} /> Quick Filters:
          </div>

          {/* Job Type Chips */}
          {['Internship', 'Full Time', 'Part Time'].map(type => (
            <button
              key={type}
              onClick={() => setTypeFilter(typeFilter === type ? '' : type)}
              className={`btn btn-sm py-1 px-3 ${typeFilter === type ? 'btn-primary' : 'btn-light border text-secondary'}`}
              style={{ fontSize: '0.75rem', borderRadius: '20px' }}
            >
              {type}
            </button>
          ))}

          <div className="vr mx-1"></div>

          {/* Work Mode Chips */}
          {['On-site', 'Hybrid', 'Remote'].map(mode => (
            <button
              key={mode}
              onClick={() => setModeFilter(modeFilter === mode ? '' : mode)}
              className={`btn btn-sm py-1 px-3 ${modeFilter === mode ? 'btn-primary' : 'btn-light border text-secondary'}`}
              style={{ fontSize: '0.75rem', borderRadius: '20px' }}
            >
              {mode}
            </button>
          ))}
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
      ) : jobs.length === 0 ? (
        <div className="card text-center p-5 border-0 bg-white shadow-sm" style={{ borderRadius: '12px' }}>
          <div className="d-inline-flex bg-light text-muted rounded-circle p-4 mb-3 mx-auto">
            <Briefcase size={40} />
          </div>
          <h5 className="fw-bold">No Openings Match the Criteria</h5>
          <p className="text-muted mx-auto mb-4" style={{ maxWidth: '380px', fontSize: '0.9rem' }}>
            We could not locate any placement listings that fit your active filtering queries. Try resetting or expanding the search terms.
          </p>
          <button onClick={resetFilters} className="btn btn-primary px-4 mx-auto shadow-sm">
            Refresh Openings
          </button>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {jobs.map((job) => {
            const hasApplied = appliedJobsList.includes(job.id);
            return (
              <div key={job.id} className="card p-4 border-0 card-hover bg-white shadow-sm" style={{ borderRadius: '12px' }}>
                <div className="row g-3 align-items-start align-items-md-center">

                  {/* Left Column Logo */}
                  <div className="col-12 col-md-auto text-start">
                    <div className="rounded-3 border border-light d-flex align-items-center justify-content-center text-primary" style={{ width: '56px', height: '56px', backgroundColor: '#f8f9fa' }}>
                      <Building2 size={24} />
                    </div>
                  </div>

                  {/* Mid Column details */}
                  <div className="col-12 col-md flex-grow-1 text-start">
                    <div className="d-flex align-items-center gap-2 flex-wrap mb-1.5">
                      <h5 className="fw-bold mb-0 text-dark">{job.title}</h5>
                      <span className="badge bg-primary bg-opacity-10 text-primary border-0">{job.employmentType}</span>
                      <span className="badge bg-info bg-opacity-10 text-info border-0">{job.workMode}</span>
                      {hasApplied && (
                        <span className="badge bg-success-subtle text-success border border-success d-flex align-items-center gap-1">
                          <CheckCircle size={12} /> Applied
                        </span>
                      )}
                    </div>

                    <div className="d-flex align-items-center gap-2 mb-2">
                      <span className="fw-bold text-secondary" style={{ fontSize: '0.9rem' }}>{job.companyName}</span>
                      <span className="text-muted">•</span>
                      <span className="text-secondary" style={{ fontSize: '0.85rem' }}>{job.department}</span>
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

      {!loading && jobs.length > 0 && (
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
    </motion.div>
  );
}
