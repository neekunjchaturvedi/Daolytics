import { ErrorMessage } from '../ErrorMessage';

export default function ErrorMessageExample() {
  return (
    <div className="space-y-4">
      <ErrorMessage 
        title="Network Error"
        message="Failed to connect to the GraphQL endpoint. Please check your internet connection."
        onRetry={() => console.log('Retry clicked')}
      />
      <ErrorMessage 
        message="This proposal could not be found or has been removed."
      />
    </div>
  );
}