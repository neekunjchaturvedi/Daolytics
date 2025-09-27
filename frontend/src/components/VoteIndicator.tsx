import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";

interface VoteIndicatorProps {
  support: boolean;
  size?: "sm" | "md" | "lg";
}

export function VoteIndicator({ support, size = "md" }: VoteIndicatorProps) {
  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  };

  return (
    <Badge 
      className={support 
        ? "bg-chart-2 text-white hover:bg-chart-2/80" 
        : "bg-destructive text-destructive-foreground hover:bg-destructive/80"
      }
      data-testid={`vote-indicator-${support ? 'for' : 'against'}`}
    >
      {support ? (
        <CheckCircle className={`${iconSizes[size]} mr-1`} />
      ) : (
        <XCircle className={`${iconSizes[size]} mr-1`} />
      )}
      {support ? "For" : "Against"}
    </Badge>
  );
}