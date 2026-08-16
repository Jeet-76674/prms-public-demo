import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  Building2, 
  Award, 
  TrendingUp, 
  FileText, 
  Calendar, 
  Bell, 
  ArrowRight, 
  CheckCircle2,
  Sparkles,
  Search,
  Check,
  ShieldCheck
} from 'lucide-react';

export default function Landing() {
  const { token, role } = useAuth();

  const getDashboardPath = () => {
    const r = (role || '').toUpperCase();
    if (r === 'VC') return '/dashboard/vc';
    if (r === 'TPO') return '/dashboard/tpo';
    if (r === 'STUDENT') return '/dashboard/student';
    if (r === 'RECRUITER') return '/dashboard/recruiter';
    return '/select-role';
  };
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  const stats = [
    { label: 'Enrolled Candidates', value: '2,500+', desc: 'Active student profiles', icon: <Users size={24} className="text-primary" /> },
    { label: 'Partner Corporations', value: '200+', desc: 'Top tier global recruiters', icon: <Building2 size={24} className="text-success" /> },
    { label: 'Successful Placements', value: '850+', desc: 'Offers secured this cycle', icon: <Award size={24} className="text-warning" /> },
    { label: 'Placement Ratio', value: '96%', desc: 'Unmatched industry success', icon: <TrendingUp size={24} className="text-info" /> }
  ];

  const features = [
    { title: 'Interactive Resume Portfolio', desc: 'Maintain academic records, technical achievements, and upload direct resumes for review.', icon: <FileText size={20} /> },
    { title: 'Corporate Interview Pipelines', desc: 'Structured workflow showing applied openings, under-review applications, and scheduled rounds.', icon: <Calendar size={20} /> },
    { title: 'Instant Application Tracking', desc: 'Real-time alert emails and live system notifications whenever your profile status updates.', icon: <Bell size={20} /> },
    { title: 'Automated Eligibility Gates', desc: 'Precision applicant filters matching required CGPA, active backlog, and technical skill tags.', icon: <ShieldCheck size={20} /> }
  ];

  const partners = ['Google', 'Microsoft', 'Amazon', 'Adobe', 'Stripe', 'Atlassian', 'Deloitte', 'Accenture'];

  const testimonials = [
    { name: 'Rohan Sharma', role: 'Software Engineer at Google', text: 'The PRMS portal was a complete game-changer. I uploaded my profile, applied with a single click, and tracked my shortlisting all the way to my final offer.', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80' },
    { name: 'Sarah Jenkins', role: 'Talent Acquisition Director', text: 'Posting jobs and screening applicants has never been more straightforward. The eligibility filters saved our HR department over 40 hours of screening time.', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80' }
  ];

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="pb-5"
    >
      {/* Hero Section */}
      <section className="py-5 bg-gradient text-dark position-relative overflow-hidden border-bottom" style={{ background: 'linear-gradient(180deg, #EFF6FF 0%, #FFFFFF 100%)' }}>
        <div className="container py-4">
          <div className="row align-items-center g-5">
            <div className="col-lg-6 text-start">
              <motion.div variants={itemVariants} className="d-inline-flex align-items-center gap-2 bg-primary bg-opacity-10 text-primary px-3 py-1.5 rounded-pill mb-3">
                <Sparkles size={16} />
                <span className="fw-semibold text-xs" style={{ fontSize: '0.8rem' }}>Revolutionizing Campus Recruitments</span>
              </motion.div>
              <motion.h1 variants={itemVariants} className="display-4 fw-bold tracking-tight mb-3 text-gradient">
                Connecting Brilliant Minds with Global Opportunities
              </motion.h1>
              <motion.p variants={itemVariants} className="lead text-secondary mb-4" style={{ fontSize: '1.1rem' }}>
                PRMS is an enterprise campus recruitment and placement solution. It coordinates student profiles, skill validation, and company job post pipelines under a single beautiful panel.
              </motion.p>
              <motion.div variants={itemVariants} className="d-flex flex-wrap gap-3">
                <Link to={token ? getDashboardPath() : '/select-role'} className="btn btn-primary btn-lg px-4 d-flex align-items-center gap-2 shadow-sm">
                  <span>{token ? 'Go to Dashboard' : 'Enter Portal'}</span>
                  <ArrowRight size={18} />
                </Link>
                <a href="#features" className="btn btn-outline-secondary btn-lg px-4">
                  Learn More
                </a>
              </motion.div>
            </div>
            
            <div className="col-lg-6">
              <motion.div 
                variants={itemVariants}
                className="position-relative d-flex justify-content-center"
              >
                {/* Visual Dashboard Mockup Card */}
                <div className="card shadow-lg p-4 border border-2 w-100 bg-white" style={{ borderRadius: '24px', transform: 'rotate(1deg)' }}>
                  <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                    <div className="d-flex align-items-center gap-2">
                      <div className="bg-primary text-white rounded-circle p-2" style={{ width: '36px', height: '36px' }}>
                        <Building2 size={18} />
                      </div>
                      <div>
                        <h6 className="m-0 fw-bold">Enterprise Job Pipeline</h6>
                        <small className="text-muted text-xs">Active screening board</small>
                      </div>
                    </div>
                    <span className="badge bg-success-subtle text-success border border-success">LIVE MATCHING</span>
                  </div>
                  
                  {/* Mock applicants list */}
                  <div className="d-flex flex-column gap-3">
                    <div className="d-flex align-items-center justify-content-between p-3 bg-light rounded-3">
                      <div className="d-flex align-items-center gap-3">
                        <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=50&q=80" alt="std" className="rounded-circle" style={{ width: '40px', height: '40px' }} />
                        <div>
                          <div className="fw-bold" style={{ fontSize: '0.9rem' }}>Alex Mercer</div>
                          <div className="text-muted text-xs">CSE • CGPA: 9.2</div>
                        </div>
                      </div>
                      <span className="badge bg-info">SHORTLISTED</span>
                    </div>

                    <div className="d-flex align-items-center justify-content-between p-3 bg-light rounded-3">
                      <div className="d-flex align-items-center gap-3">
                        <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=50&q=80" alt="std" className="rounded-circle" style={{ width: '40px', height: '40px' }} />
                        <div>
                          <div className="fw-bold" style={{ fontSize: '0.9rem' }}>Emma Watson</div>
                          <div className="text-muted text-xs">ECE • CGPA: 8.8</div>
                        </div>
                      </div>
                      <span className="badge bg-warning text-dark">UNDER REVIEW</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Partners / Logos */}
      <section className="py-4 border-bottom bg-white">
        <div className="container">
          <p className="text-center text-uppercase fw-bold text-muted mb-3" style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}>
            Trusted by the World’s Leading Technology Brands
          </p>
          <div className="row row-cols-2 row-cols-md-4 row-cols-lg-8 justify-content-center align-items-center g-4 text-center">
            {partners.map((partner, idx) => (
              <div key={idx} className="col">
                <span className="fw-bold text-secondary text-opacity-50 text-uppercase h5" style={{ letterSpacing: '0.05em' }}>
                  {partner}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-5">
        <div className="container py-4">
          <div className="text-center max-w-2xl mx-auto mb-5">
            <h2 className="fw-bold text-gradient mb-2">Designed for High Performance</h2>
            <p className="text-secondary">Explore why universities and corporate recruiters choose our management suite.</p>
          </div>

          <div className="row g-4">
            {features.map((feat, idx) => (
              <div key={idx} className="col-md-6 col-lg-3">
                <div className="card h-100 p-4 border border-light card-hover shadow-sm">
                  <div className="bg-primary bg-opacity-10 text-primary rounded-3 p-3 mb-3 d-inline-flex align-self-start">
                    {feat.icon}
                  </div>
                  <h5 className="fw-bold mb-2" style={{ fontSize: '1.05rem' }}>{feat.title}</h5>
                  <p className="text-secondary mb-0" style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section id="journey" className="py-5 bg-light border-top border-bottom">
        <div className="container py-4">
          <div className="text-center mb-5">
            <h2 className="fw-bold text-gradient mb-2">The Placement Journey</h2>
            <p className="text-secondary">A highly structured 4-step onboarding, validation, application, and offer system.</p>
          </div>

          <div className="row g-4 position-relative">
            <div className="col-lg-3 col-md-6 text-center">
              <div className="card p-4 h-100 border-0 bg-white shadow-sm position-relative">
                <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 mx-auto" style={{ width: '45px', height: '45px', fontSize: '1.2rem', fontWeight: 'bold' }}>1</div>
                <h5 className="fw-bold">Role & Signup</h5>
                <p className="text-secondary mb-0" style={{ fontSize: '0.85rem' }}>Create your credential as a student or enterprise HR representative.</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 text-center">
              <div className="card p-4 h-100 border-0 bg-white shadow-sm position-relative">
                <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 mx-auto" style={{ width: '45px', height: '45px', fontSize: '1.2rem', fontWeight: 'bold' }}>2</div>
                <h5 className="fw-bold">OTP Authentication</h5>
                <p className="text-secondary mb-0" style={{ fontSize: '0.85rem' }}>Verify with 6-digit dynamic OTP verification to ensure secure enrollment.</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 text-center">
              <div className="card p-4 h-100 border-0 bg-white shadow-sm position-relative">
                <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 mx-auto" style={{ width: '45px', height: '45px', fontSize: '1.2rem', fontWeight: 'bold' }}>3</div>
                <h5 className="fw-bold">Profile & CV Upload</h5>
                <p className="text-secondary mb-0" style={{ fontSize: '0.85rem' }}>Complete academic profiles and upload official resume transcripts.</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 text-center">
              <div className="card p-4 h-100 border-0 bg-white shadow-sm position-relative">
                <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 mx-auto" style={{ width: '45px', height: '45px', fontSize: '1.2rem', fontWeight: 'bold' }}>4</div>
                <h5 className="fw-bold">Job Screenings</h5>
                <p className="text-secondary mb-0" style={{ fontSize: '0.85rem' }}>Apply directly to open roles. Recruiters review submissions on their pipeline.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Placement Statistics Counters */}
      <section id="stats" className="py-5 bg-white">
        <div className="container py-4">
          <div className="row g-4 text-center">
            {stats.map((stat, idx) => (
              <div key={idx} className="col-md-6 col-lg-3">
                <div className="p-4 border rounded-4 bg-light bg-opacity-50">
                  <div className="mb-2 d-flex justify-content-center">{stat.icon}</div>
                  <h2 className="display-5 fw-bold text-gradient mb-1">{stat.value}</h2>
                  <h6 className="fw-bold text-secondary mb-1">{stat.label}</h6>
                  <p className="text-muted text-xs mb-0" style={{ fontSize: '0.8rem' }}>{stat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-5 bg-light border-top border-bottom">
        <div className="container py-4">
          <div className="text-center mb-5" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 className="fw-bold text-gradient mb-2">Frequently Asked Questions</h2>
            <p className="text-secondary">Get immediate answers on how academic verification and recruitment cycles operate.</p>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="accordion shadow-sm" id="prmsFaq" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                <div className="accordion-item border-light">
                  <h2 className="accordion-header" id="headingOne">
                    <button className="accordion-button fw-bold py-3 text-secondary" type="button" data-bs-toggle="collapse" data-bs-target="#faqOne" aria-expanded="true" aria-controls="faqOne">
                      How are academic profiles verified for eligibility?
                    </button>
                  </h2>
                  <div id="faqOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#prmsFaq">
                    <div className="accordion-body text-secondary bg-white" style={{ fontSize: '0.9rem' }}>
                      All student academic fields—including CGPA, active backlogs, passing year, and percentages—are cross-referenced with university records. Any job application requires these thresholds to match the posted criteria exactly.
                    </div>
                  </div>
                </div>

                <div className="accordion-item border-light">
                  <h2 className="accordion-header" id="headingTwo">
                    <button className="accordion-button collapsed fw-bold py-3 text-secondary" type="button" data-bs-toggle="collapse" data-bs-target="#faqTwo" aria-expanded="false" aria-controls="faqTwo">
                      Can students withdraw an active job application?
                    </button>
                  </h2>
                  <div id="faqTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#prmsFaq">
                    <div className="accordion-body text-secondary bg-white" style={{ fontSize: '0.9rem' }}>
                      Yes. Students can choose to withdraw an active application from their Tracker dashboard. Once withdrawn, the status updates to WITHDRAWN and the recruiter will be notified.
                    </div>
                  </div>
                </div>

                <div className="accordion-item border-light">
                  <h2 className="accordion-header" id="headingThree">
                    <button className="accordion-button collapsed fw-bold py-3 text-secondary" type="button" data-bs-toggle="collapse" data-bs-target="#faqThree" aria-expanded="false" aria-controls="faqThree">
                      How does the 6-digit OTP process work?
                    </button>
                  </h2>
                  <div id="faqThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#prmsFaq">
                    <div className="accordion-body text-secondary bg-white" style={{ fontSize: '0.9rem' }}>
                      Upon signup or logins, an OTP is dispatched. Entering the 6-digit combination verifies ownership of the email before letting you input sensitive profile variables.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg-white">
        <div className="container py-4 text-center">
          <div className="card shadow-lg border-0 bg-primary text-white p-5 rounded-4" style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)' }}>
            <h2 className="fw-bold mb-3">Ready to Accelerate Your Placement Pipeline?</h2>
            <p className="lead mb-4 mx-auto opacity-90" style={{ maxWidth: '600px', fontSize: '1rem' }}>
              Whether you are an aspiring engineer searching for internship credits or an enterprise HR looking to pool vetted candidates, PRMS coordinates it seamlessly.
            </p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <Link to={token ? getDashboardPath() : '/select-role'} className="btn btn-light btn-lg text-primary px-4 shadow">
                {token ? 'Go to Dashboard' : 'Get Started Now'}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
