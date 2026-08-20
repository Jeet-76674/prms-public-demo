import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  MapPin, 
  Globe, 
  Mail, 
  Users, 
  CheckCircle2, 
  X, 
  Briefcase, 
  ExternalLink,
  ShieldCheck,
  Award
} from 'lucide-react';

export default function CompanyProfileModal({ companyName, location, isOpen, onClose }) {
  if (!isOpen) return null;

  const cleanName = companyName || 'Corporate Partner';
  const slug = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // Dynamic curated profile details based on company
  const companyProfiles = {
    'cloudscale': {
      tagline: 'Enterprise Cloud Infrastructure & Distributed DevOps Systems',
      about: 'CloudScale Inc. is a leading provider of enterprise cloud computing architecture, automated CI/CD pipelines, and high-performance distributed data platforms. Partnering with top universities worldwide for technical leadership recruitment.',
      industry: 'Cloud Computing & Infrastructure SaaS',
      size: '500 – 1,000 Employees',
      headquarters: location || 'Hyderabad, Telangana, India',
      website: `https://${slug}.demo.prms.edu`,
      email: `talent@${slug}.demo.prms.edu`,
      benefits: ['Flexible Hybrid Work', 'Learning & Certification Allowances', 'Comprehensive Health Cover', 'Annual Tech Summit']
    },
    'techcorp': {
      tagline: 'Next-Gen Enterprise Solutions & Full Stack Software Engineering',
      about: 'TechCorp Solutions specializes in scalable enterprise software architecture, full-stack microservices, and AI-accelerated business workflows with a presence across 12 countries.',
      industry: 'Enterprise Software & Cloud Platforms',
      size: '2,500 – 5,000 Employees',
      headquarters: location || 'Bengaluru, Karnataka, India',
      website: `https://${slug}.demo.prms.edu`,
      email: `campus-hiring@${slug}.demo.prms.edu`,
      benefits: ['Performance Incentive Bonuses', 'International Relocation Options', 'Wellness & Gym Allowances', 'Dedicated Mentorship']
    },
    'cybernex': {
      tagline: 'Cybersecurity Threat Intelligence & Zero-Trust Defense Systems',
      about: 'CyberNex Security builds state-of-the-art defensive cybersecurity architectures, real-time intrusion mitigation systems, and cryptographic safety tools for Fortune 500 institutions.',
      industry: 'Information Security & Defensive Cyber Systems',
      size: '300 – 600 Employees',
      headquarters: location || 'Pune, Maharashtra, India',
      website: `https://${slug}.demo.prms.edu`,
      email: `careers@${slug}.demo.prms.edu`,
      benefits: ['Cutting-edge Security Lab Access', 'Competitive Stock Options', 'Flexible Remote Schedules', 'Conference Sponsorships']
    }
  };

  const matchedKey = Object.keys(companyProfiles).find(k => slug.includes(k));
  const profile = matchedKey ? companyProfiles[matchedKey] : {
    tagline: 'Innovative Technology & High-Performance Engineering Organization',
    about: `${cleanName} is a verified campus recruitment partner committed to fostering high-potential engineering and analytical talent through structured mentorship and impactful projects.`,
    industry: 'Information Technology & Services',
    size: '1,000+ Employees',
    headquarters: location || 'Ahmedabad, Gujarat, India',
    website: `https://${slug || 'company'}.demo.prms.edu`,
    email: `careers@${slug || 'company'}.demo.prms.edu`,
    benefits: ['Competitive Stipend & CTC', 'Fast-track Career Growth', 'Modern Work Environment', 'Mentorship from Senior Leads']
  };

  return (
    <AnimatePresence>
      <div 
        className="modal fade show d-block" 
        tabIndex="-1" 
        style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(6px)', zIndex: 1060 }}
        onClick={onClose}
      >
        <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            className="modal-content border-0 shadow-lg"
            style={{ borderRadius: '18px', overflow: 'hidden' }}
          >
            {/* Header Hero Banner */}
            <div 
              className="p-4 text-white position-relative"
              style={{ background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #1E293B 100%)' }}
            >
              <button 
                type="button" 
                className="btn btn-close btn-close-white position-absolute top-0 end-0 m-3"
                onClick={onClose}
                aria-label="Close"
              ></button>

              <div className="d-flex align-items-center gap-3.5 pt-2">
                <div 
                  className="rounded-3 d-flex align-items-center justify-content-center fw-bold shadow-md flex-shrink-0"
                  style={{ width: '56px', height: '56px', backgroundColor: '#4F46E5', color: '#FFFFFF', fontSize: '1.5rem' }}
                >
                  <Building2 size={30} />
                </div>
                <div>
                  <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                    <h4 className="fw-bold m-0 text-white" style={{ letterSpacing: '-0.02em' }}>{cleanName}</h4>
                    <span 
                      className="badge bg-success bg-opacity-25 text-emerald-300 border border-success border-opacity-30 px-2.5 py-1 rounded-pill fw-semibold d-inline-flex align-items-center gap-1"
                      style={{ fontSize: '0.72rem', color: '#A7F3D0', backgroundColor: 'rgba(16, 185, 129, 0.2)' }}
                    >
                      <ShieldCheck size={13} /> VERIFIED PARTNER
                    </span>
                  </div>
                  <p className="mb-0 text-indigo-200" style={{ fontSize: '0.85rem' }}>{profile.tagline}</p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="modal-body p-4 bg-light">
              <div className="row g-3">
                {/* About Company */}
                <div className="col-12">
                  <div className="card border-0 p-3.5 bg-white shadow-xs" style={{ borderRadius: '12px' }}>
                    <h6 className="fw-bold text-slate-900 mb-2 d-flex align-items-center gap-2" style={{ fontSize: '0.92rem' }}>
                      <Briefcase size={16} className="text-primary" /> About Organization
                    </h6>
                    <p className="text-secondary mb-0" style={{ fontSize: '0.86rem', lineHeight: '1.55' }}>
                      {profile.about}
                    </p>
                  </div>
                </div>

                {/* Key Overview Grid */}
                <div className="col-12 col-md-6">
                  <div className="card border-0 p-3 bg-white shadow-xs h-100" style={{ borderRadius: '12px' }}>
                    <h6 className="fw-bold text-slate-900 mb-2.5" style={{ fontSize: '0.85rem' }}>Company Facts</h6>
                    <ul className="list-unstyled mb-0 d-flex flex-column gap-2" style={{ fontSize: '0.82rem' }}>
                      <li className="d-flex align-items-center gap-2 text-secondary">
                        <Building2 size={14} className="text-primary flex-shrink-0" />
                        <span><strong>Industry:</strong> {profile.industry}</span>
                      </li>
                      <li className="d-flex align-items-center gap-2 text-secondary">
                        <Users size={14} className="text-primary flex-shrink-0" />
                        <span><strong>Company Size:</strong> {profile.size}</span>
                      </li>
                      <li className="d-flex align-items-center gap-2 text-secondary">
                        <MapPin size={14} className="text-primary flex-shrink-0" />
                        <span><strong>Headquarters:</strong> {profile.headquarters}</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Contact & Verification */}
                <div className="col-12 col-md-6">
                  <div className="card border-0 p-3 bg-white shadow-xs h-100" style={{ borderRadius: '12px' }}>
                    <h6 className="fw-bold text-slate-900 mb-2.5" style={{ fontSize: '0.85rem' }}>Recruitment Contact</h6>
                    <ul className="list-unstyled mb-0 d-flex flex-column gap-2" style={{ fontSize: '0.82rem' }}>
                      <li className="d-flex align-items-center gap-2 text-secondary">
                        <Globe size={14} className="text-primary flex-shrink-0" />
                        <span className="text-truncate">
                          <strong>Portal:</strong>{' '}
                          <a href={profile.website} target="_blank" rel="noreferrer" className="text-primary text-decoration-none fw-medium">
                            {profile.website.replace('https://', '')} <ExternalLink size={11} className="d-inline" />
                          </a>
                        </span>
                      </li>
                      <li className="d-flex align-items-center gap-2 text-secondary">
                        <Mail size={14} className="text-primary flex-shrink-0" />
                        <span className="text-truncate">
                          <strong>HR Desk:</strong> <span className="text-slate-800 fw-medium">{profile.email}</span>
                        </span>
                      </li>
                      <li className="d-flex align-items-center gap-2 text-success fw-medium">
                        <CheckCircle2 size={14} className="flex-shrink-0" />
                        <span>Active Campus Hiring Drive 2026</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Student Perks */}
                <div className="col-12">
                  <div className="card border-0 p-3 bg-white shadow-xs" style={{ borderRadius: '12px' }}>
                    <h6 className="fw-bold text-slate-900 mb-2 d-flex align-items-center gap-2" style={{ fontSize: '0.85rem' }}>
                      <Award size={15} className="text-primary" /> Key Candidate Offerings & Perks
                    </h6>
                    <div className="d-flex flex-wrap gap-2">
                      {profile.benefits.map((b, i) => (
                        <span key={i} className="badge bg-light border text-slate-700 px-2.5 py-1.5 rounded-2 fw-medium" style={{ fontSize: '0.78rem' }}>
                          ✓ {b}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer p-3 bg-white border-top d-flex justify-content-between align-items-center">
              <span className="text-muted text-xs">University Placement Verification Protocol</span>
              <button 
                type="button" 
                className="btn btn-primary px-4 py-1.5 fw-semibold"
                style={{ borderRadius: '8px', fontSize: '0.85rem' }}
                onClick={onClose}
              >
                Close Profile
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
