import { Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen d-flex flex-column align-items-center justify-content-center text-center p-4 bg-pattern">
      <div className="card shadow-lg p-5 border-0 text-center" style={{ maxWidth: '500px' }}>
        <div className="d-inline-flex bg-warning bg-opacity-10 text-warning rounded-circle p-4 mb-4 mx-auto">
          <HelpCircle size={48} />
        </div>
        <h2 className="fw-bold mb-2 text-gradient">Page Not Found</h2>
        <p className="text-muted mb-4">
          The requested URL path was not found on this server. Please check the address or return to safety.
        </p>
        <Link to="/" className="btn btn-primary d-flex align-items-center justify-content-center gap-2">
          <ArrowLeft size={16} /> Return to Home
        </Link>
      </div>
    </div>
  );
}
