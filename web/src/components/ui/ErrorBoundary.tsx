import { Component, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import Button from "./Button";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div
          className="flex flex-col items-center justify-center gap-4 p-8 rounded-xl text-center"
          style={{
            background: "var(--color-bg-card)",
            border: "1px solid var(--color-border)",
          }}
        >
          <AlertTriangle size={40} style={{ color: "var(--color-status-error)" }} />
          <h3 className="text-lg font-semibold" style={{ color: "var(--color-text-primary)" }}>
            Something went wrong
          </h3>
          <p className="text-sm max-w-md" style={{ color: "var(--color-text-secondary)" }}>
            {this.state.error?.message || "An unexpected error occurred."}
          </p>
          <Button variant="ghost" onClick={this.handleReset}>
            Try again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
