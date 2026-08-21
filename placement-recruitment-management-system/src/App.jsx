import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
import ErrorBoundary from './components/ErrorBoundary';
import BackendKeepAlive from './components/BackendKeepAlive';
import { Toaster } from 'react-hot-toast';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BackendKeepAlive />
        <ErrorBoundary>
          {/* Toast alerts terminal - Modern Light Glass Pill Styling */}
          <Toaster
            position="top-right"
            gutter={8}
            toastOptions={{
              duration: 3500,
              style: {
                background: '#FFFFFF',
                color: '#0F172A',
                border: '1px solid #E2E8F0',
                boxShadow: '0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)',
                borderRadius: '12px',
                fontSize: '0.875rem',
                fontWeight: '500',
                padding: '10px 16px',
              },
              success: {
                iconTheme: {
                  primary: '#16A34A',
                  secondary: '#FFFFFF',
                },
              },
              error: {
                iconTheme: {
                  primary: '#DC2626',
                  secondary: '#FFFFFF',
                },
              },
            }}
          />
          
          {/* Routing Table */}
          <AppRoutes />
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  );
}
