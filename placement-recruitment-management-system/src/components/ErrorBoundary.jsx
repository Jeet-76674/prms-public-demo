import React from 'react';
import { AlertTriangle, RefreshCw, Home, LayoutDashboard } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.reload();
    }
  };

  handleNavigateHome = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    const role = sessionStorage.getItem('role')?.toLowerCase();
    if (role) {
      window.location.href = `/dashboard/${role}`;
    } else {
      window.location.href = '/';
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const role = sessionStorage.getItem('role')?.toUpperCase();
      const dashboardLink = role ? `/dashboard/${role.toLowerCase()}` : '/';

      return (
        <div
          className="d-flex align-items-center justify-content-center min-vh-100 p-4"
          style={{ backgroundColor: '#F8FAFC' }}
        >
          <div
            className="card border-0 bg-white shadow-sm p-4 p-md-5 text-center"
            style={{
              maxWidth: '540px',
              width: '100%',
              borderRadius: '20px',
              border: '1px solid #E2E8F0',
            }}
          >
            <div
              className="d-inline-flex align-items-center justify-content-center rounded-circle mx-auto mb-4"
              style={{
                width: '64px',
                height: '64px',
                backgroundColor: '#FEF2F2',
                color: '#DC2626',
              }}
            >
              <AlertTriangle size={32} />
            </div>

            <h4 className="fw-bold text-slate-900 mb-2" style={{ letterSpacing: '-0.02em' }}>
              Something went wrong
            </h4>

            <p className="text-muted text-sm mb-4">
              An unexpected display issue occurred while rendering this section. You can refresh the view or return to your dashboard.
            </p>

            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
              <button
                type="button"
                onClick={this.handleReset}
                className="btn btn-primary d-inline-flex align-items-center justify-content-center gap-2 px-4 py-2.5 fw-semibold shadow-sm"
                style={{ borderRadius: '10px' }}
              >
                <RefreshCw size={16} />
                <span>Try Again</span>
              </button>

              <button
                type="button"
                onClick={this.handleNavigateHome}
                className="btn btn-outline-secondary d-inline-flex align-items-center justify-content-center gap-2 px-4 py-2.5 fw-semibold"
                style={{ borderRadius: '10px' }}
              >
                {role ? <LayoutDashboard size={16} /> : <Home size={16} />}
                <span>{role ? 'Return to Dashboard' : 'Return to Home'}</span>
              </button>
            </div>

            {/* Collapsible details for development/troubleshooting */}
            {import.meta.env.DEV && this.state.error && (
              <div className="mt-4 text-start">
                <details className="text-xs text-muted">
                  <summary className="cursor-pointer fw-semibold text-danger">
                    Debug Information (Developer Only)
                  </summary>
                  <pre
                    className="p-3 bg-light rounded-3 mt-2 overflow-auto text-danger"
                    style={{ fontSize: '0.72rem', maxHeight: '180px' }}
                  >
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
