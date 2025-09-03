import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Clock, RotateCcw, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useSearchHistory, SearchHistoryItem } from "@/hooks/useSearchHistory";
import { useAuth } from "@/hooks/useAuth";

interface SearchHistoryProps {
  onRestoreSearch: (job: any, leads: any[]) => void;
  onClose: () => void;
}

export function SearchHistory({ onRestoreSearch, onClose }: SearchHistoryProps) {
  const { user } = useAuth();
  const { searchHistory, loading, restoreSearch, formatSearchCriteria } = useSearchHistory(user?.id);
  
  console.log('🔍 SearchHistory component rendered:', { 
    loading, 
    historyCount: searchHistory.length, 
    userId: user?.id 
  });

  const handleRestoreSearch = async (item: SearchHistoryItem) => {
    if (item.status !== 'completed') {
      return; // Don't allow restoring incomplete searches
    }

    const result = await restoreSearch(item.id);
    if (result) {
      onRestoreSearch(result.job, result.leads);
      onClose();
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-3 w-3" style={{ color: '#466359' }} />;
      case 'failed':
        return <XCircle className="h-3 w-3 text-red-500" />;
      default:
        return <Loader2 className="h-3 w-3 text-blue-500 animate-spin" />;
    }
  };

  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'failed':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">Loading search history...</p>
      </div>
    );
  }

  if (searchHistory.length === 0) {
    return (
      <div className="p-4 text-center">
        <Clock className="h-4 w-4 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">No search history yet</p>
      </div>
    );
  }

  return (
    <div className="max-h-96 overflow-y-auto">
      {searchHistory.map((item) => (
        <DropdownMenuItem 
          key={item.id} 
          className="cursor-pointer p-3 flex-col items-start space-y-2"
          onClick={() => handleRestoreSearch(item)}
          disabled={item.status !== 'completed'}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-2">
              {getStatusIcon(item.status)}
              <span className="text-sm font-medium truncate max-w-[200px]">
                {formatSearchCriteria(item.job_criteria)}
              </span>
            </div>
            {item.status === 'completed' && (
              <RotateCcw className="h-3 w-3 text-muted-foreground" />
            )}
          </div>
          
          <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
            <span>
              {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
            </span>
            <div className="flex items-center space-x-2">
              {item.total_leads_found !== null && (
                <span>{item.total_leads_found} leads</span>
              )}
              <Badge variant={getStatusBadgeVariant(item.status)} className="text-xs">
                {item.status}
              </Badge>
            </div>
          </div>
        </DropdownMenuItem>
      ))}
    </div>
  );
}