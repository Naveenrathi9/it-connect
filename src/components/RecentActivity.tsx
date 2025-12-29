import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { AssetRequest } from '@/types/asset';
import { formatDistanceToNow } from 'date-fns';

interface RecentActivityProps {
  requests: AssetRequest[];
}

export default function RecentActivity({ requests }: RecentActivityProps) {
  const recentRequests = [...requests]
    .sort((a, b) => {
      const dateA = a.receivedAt || a.createdAt;
      const dateB = b.receivedAt || b.createdAt;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    })
    .slice(0, 5);

  if (recentRequests.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No recent activity</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentRequests.map((request) => (
          <div key={request.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {request.empName} - {request.assetNoToReturn}
              </p>
              <p className="text-xs text-muted-foreground">
                {request.department} • {request.modelOfAsset}
              </p>
            </div>
            <div className="text-right space-y-1">
              <Badge variant={request.status === 'Received' ? 'default' : 'secondary'} className="text-xs">
                {request.status}
              </Badge>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(request.receivedAt || request.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
