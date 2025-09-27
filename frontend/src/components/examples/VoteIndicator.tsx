import { VoteIndicator } from '../VoteIndicator';

export default function VoteIndicatorExample() {
  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center">
        <VoteIndicator support={true} size="sm" />
        <VoteIndicator support={false} size="sm" />
      </div>
      <div className="flex gap-4 items-center">
        <VoteIndicator support={true} size="md" />
        <VoteIndicator support={false} size="md" />
      </div>
      <div className="flex gap-4 items-center">
        <VoteIndicator support={true} size="lg" />
        <VoteIndicator support={false} size="lg" />
      </div>
    </div>
  );
}