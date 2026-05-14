import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '40px',
          background: '#1a0f0f',
          color: 'white',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          fontFamily: 'sans-serif'
        }}>
          <h1 style={{ color: '#FF69B4', marginBottom: '16px' }}>Oops! Something went wrong.</h1>
          <p style={{ color: '#f9a8d4', marginBottom: '24px' }}>
            The application encountered a runtime error.
          </p>
          <pre style={{
            background: '#2a1a1a',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid rgba(255,105,180,0.2)',
            maxWidth: '90%',
            overflow: 'auto',
            fontSize: '0.8rem',
            textAlign: 'left'
          }}>
            {this.state.error?.toString()}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '24px',
              background: '#FF69B4',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
