import { LoadingSpinner } from '../LoadingSpinner';

export default function LoadingSpinnerExample() {
  return (
    <div className="space-y-8">
      <LoadingSpinner size="sm" text="Loading..." />
      <LoadingSpinner size="md" text="Fetching proposals..." />
      <LoadingSpinner size="lg" text="Processing data..." />
    </div>
  );
}