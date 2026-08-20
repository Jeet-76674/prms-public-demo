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
      tagline: 'Enterprise Cloud Infrastructure & Distributed DevOps Platforms',
      about: 'CloudScale Inc. is a leading provider of enterprise cloud computing architecture, automated CI/CD pipelines, and high-performance distributed data platforms. Partnering with top universities for graduate engineering and technical analyst recruitment.',
      industry: 'Cloud Computing & Infrastructure SaaS',
      size: '500 – 1,000 Employees',
      headquarters: location || 'Hyderabad, Telangana, India',
      website: `https://${slug}.demo.prms.edu`,
      email: `talent@${slug}.demo.prms.edu`,
      benefits: ['Flexible Hybrid Work', 'Learning & Certification Allowances', 'Comprehensive Health Cover', 'Annual Tech Summit']
    },
    'techcorp': {
      tagline: 'Next-Gen Enterprise Software & AI-Accelerated Cloud Engineering',
      about: 'TechCorp Solutions specializes in scalable enterprise software architecture, full-stack microservices, and AI-accelerated business workflows with engineering operations across 12 countries.',
      industry: 'Enterprise Software & Cloud Platforms',
      size: '2,500 – 5,000 Employees',
      headquarters: location || 'Bengaluru, Karnataka, India',
      website: `https://${slug}.demo.prms.edu`,
      email: `campus-hiring@${slug}.demo.prms.edu`,
      benefits: ['Performance Incentive Bonuses', 'International Relocation Options', 'Wellness & Gym Allowances', 'Dedicated Mentorship']
    },
    'cybernex': {
      tagline: 'Defensive Cybersecurity Threat Intelligence & Zero-Trust Systems',
      about: 'CyberNex Security builds state-of-the-art defensive cybersecurity architectures, real-time intrusion mitigation systems, and cryptographic safety tools for Fortune 500 institutions.',
      industry: 'Information Security & Defensive Cyber Systems',
      size: '300 – 600 Employees',
      headquarters: location || 'Pune, Maharashtra, India',
      website: `https://${slug}.demo.prms.edu`,
      email: `careers@${slug}.demo.prms.edu`,
      benefits: ['Security Research Lab Access', 'Competitive Stock Grants', 'Flexible Remote Schedules', 'Conference Sponsorships']
    }
  };

  const matchedKey = Object.keys(companyProfiles).find(k => slug.includes(k));
  const profile = matchedKey ? companyProfiles[matchedKey] : {
    tagline: 'Innovative Technology & High-Performance Engineering Organization',
    about: `${cleanName} is an authorized campus placement partner committed to fostering high-potential engineering, design, and analytical candidates through structured onboarding and impactful projects.`,
    industry: 'Information Technology & Services',
    size: '1,000+ Employees',
    headquarters: location || 'Ahmedabad, Gujarat, India',
    website: `https://${slug || 'company'}.demo.prms.edu`,
    email: `careers@${slug || 'company'}.demo.prms.edu`,
    benefits: ['Competitive Compensation & Bonus', 'Fast-track Career Growth', 'Modern Work Environment', 'Direct Senior Mentorship']
  };

  return (
    <AnimatePresence>
      <div 
        className="modal fade show d-block" 
        tabIndex="-1" 
        style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(5px)', zIndex: 1060 }}
        onClick={onClose}
      >
        <div className="modal-dialog modal-dialog-centered modal-lg" onClick={(e) => e.stopPropagation()}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.18 }}
            className="modal-content border-0 shadow-xl bg-white"
            style={{ borderRadius: '16px', overflow: 'hidden' }}
          >
            {/* Clean Header Bar */}
            <div className="p-4 border-bottom position-relative" style={{ backgroundColor: '#0F172A', color: '#FFFFFF' }}>
              <button 
                type="button" 
                className="btn btn-close btn-close-white position-absolute top-0 end-0 m-3"
                onClick={onClose}
                aria-label="Close"
              ></button>

              <div className="d-flex align-items-center gap-3 pe-4">
                <div 
                  className="rounded-3 d-flex align-items-center justify-content-center fw-bold shadow-xs flex-shrink-0"
                  style={{ width: '52px', height: '52px', backgroundColor: '#2563EB', color: '#FFFFFF' }}
                >
                  <Building2 size={28} />
                </div>
                <div>
                  <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                    <h4 className="fw-bold m-0 text-white" style={{ letterSpacing: '-0.02em', fontSize: '1.25rem' }}>
                      {cleanName}
                    </h4>
                    <span 
                      className="badge bg-emerald-500 bg-opacity-20 text-emerald-300 border border-emerald-500 border-opacity-30 px-2 py-0.5 rounded-pill fw-semibold d-inline-flex align-items-center gap-1"
                      style={{ fontSize: '0.68rem', letterSpacing: '0.03em', color: '#6EE7B7', backgroundColor: 'rgba(16, 185, 129, 0.18)' }}
                    >
                      <ShieldCheck size={12} /> VERIFIED PARTNER
                    </span>
                  </div>
                  <p className="mb-0 text-slate-300" style={{ fontSize: '0.84rem', lineHeight: '1.4' }}>
                    {profile.tagline}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Body - Seamless Clean Flow */}
            <div className="modal-body p-4 bg-white">
              {/* About Organization */}
              <div className="mb-4">
                <h6 className="text-xs fw-bold text-uppercase text-secondary mb-2" style={{ letterSpacing: '0.05em' }}>
                  About Organization
                </h6>
                <p className="text-slate-700 mb-0" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                  {profile.about}
                </p>
              </div>

              {/* Two Column Structured Overview */}
              <div className="row g-4 mb-4 pt-3 border-top">
                <div className="col-12 col-md-6">
                  <h6 className="text-xs fw-bold text-uppercase text-secondary mb-3" style={{ letterSpacing: '0.05em' }}>
                    Company Profile
                  </h6>
                  <div className="d-flex flex-column gap-2.5" style={{ fontSize: '0.86rem' }}>
                    <div className="d-flex align-items-start gap-2 text-slate-700">
                      <Briefcase size={15} className="text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-muted d-block text-xs">INDUSTRY</span>
                        <span className="fw-semibold text-slate-900">{profile.industry}</span>
                      </div>
                    </div>
                    <div className="d-flex align-items-start gap-2 text-slate-700">
                      <Users size={15} className="text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-muted d-block text-xs">COMPANY SIZE</span>
                        <span className="fw-semibold text-slate-900">{profile.size}</span>
                      </div>
                    </div>
                    <div className="d-flex align-items-start gap-2 text-slate-700">
                      <MapPin size={15} className="text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-muted d-block text-xs">HEADQUARTERS</span>
                        <span className="fw-semibold text-slate-900">{profile.headquarters}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <h6 className="text-xs fw-bold text-uppercase text-secondary mb-3" style={{ letterSpacing: '0.05em' }}>
                    Recruitment Contacts
                  </h6>
                  <div className="d-flex flex-column gap-2.5" style={{ fontSize: '0.86rem' }}>
                    <div className="d-flex align-items-start gap-2 text-slate-700">
                      <Globe size={15} className="text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-muted d-block text-xs">OFFICIAL PORTAL</span>
                        <a href={profile.website} target="_blank" rel="noreferrer" className="fw-semibold text-primary text-decoration-none d-inline-flex align-items-center gap-1">
                          <span>{profile.website.replace('https://', '')}</span>
                          <ExternalLink size={11} />
                        </a>
                      </div>
                    </div>
                    <div className="d-flex align-items-start gap-2 text-slate-700">
                      <Mail size={15} className="text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-muted d-block text-xs">CAMPUS DESK</span>
                        <span className="fw-semibold text-slate-900">{profile.email}</span>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-1.5 text-success fw-semibold pt-1" style={{ fontSize: '0.82rem' }}>
                      <CheckCircle2 size={14} />
                      <span>Active Campus Placement Drive 2026</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Candidate Perks */}
              <div className="pt-3 border-top">
                <h6 className="text-xs fw-bold text-uppercase text-secondary mb-2.5" style={{ letterSpacing: '0.05em' }}>
                  Candidate Offerings & Perks
                </h6>
                <div className="d-flex flex-wrap gap-2">
                  {profile.benefits.map((b, i) => (
                    <span 
                      key={i} 
                      className="badge bg-slate-50 text-slate-700 border px-2.5 py-1.5 rounded-2 fw-medium" 
                      style={{ fontSize: '0.78rem', borderColor: '#E2E8F0' }}
                    >
                      ✓ {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer px-4 py-3 bg-light border-top d-flex justify-content-between align-items-center">
              <span className="text-muted text-xs">University Placement Verification Protocol</span>
              <button 
                type="button" 
                className="btn btn-primary px-4 py-1.5 fw-semibold shadow-xs"
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
