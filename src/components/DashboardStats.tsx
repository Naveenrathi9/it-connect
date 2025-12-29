import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, CheckCircle, FileText, TrendingUp } from 'lucide-react';
import { AssetRequest } from '@/types/asset';

interface DashboardStatsProps {
  requests: AssetRequest[];
}

export default function DashboardStats({ requests }: DashboardStatsProps) {
  const pendingCount = requests.filter(r => r.status === 'Pending').length;
  const acceptedCount = requests.filter(r => r.status === 'Accepted').length;
  const totalCount = requests.length;

  const stats = [
    {
      title: 'Total Requests',
      value: totalCount,
      icon: FileText,
      description: 'All time requests',
    },
    {
      title: 'Pending',
      value: pendingCount,
      icon: Clock,
      description: 'Awaiting store confirmation',
    },
    {
      title: 'Accepted',
      value: acceptedCount,
      icon: CheckCircle,
      description: 'Accepted returns',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
