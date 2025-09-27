import { Header } from '../Header';

export default function HeaderExample() {
  return (
    <div className="space-y-4">
      <Header title="DAOlytics" />
      <Header 
        title="Proposal Details" 
        showBackButton 
        onBack={() => console.log('Back clicked')}
      />
    </div>
  );
}