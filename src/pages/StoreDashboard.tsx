import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAssets } from '@/contexts/AssetContext';
import { useFilteredRequests } from '@/hooks/useFilteredRequests';
import DashboardHeader from '@/components/DashboardHeader';
import DashboardStats from '@/components/DashboardStats';
import RecentActivity from '@/components/RecentActivity';
import SearchFilter from '@/components/SearchFilter';
import StoreTable from '@/components/StoreTable';
import { AssetStatus } from '@/types/asset';
import { exportToCSV } from '@/lib/exportCSV';
import { toast } from '@/hooks/use-toast';

export default function StoreDashboard() {
  const { role, isAuthenticated } = useAuth();
  const { requests, markAsReceived } = useAssets();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<AssetStatus | 'all'>('all');

  const filteredRequests = useFilteredRequests(requests, searchTerm, statusFilter);

  if (!isAuthenticated || role !== 'Store') {
    return <Navigate to="/" replace />;
  }

  const handleMarkReceived = (id: string, comment: string) => {
    markAsReceived(id, comment);
    toast({
      title: 'Success',
      description: 'Asset marked as received.',
    });
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardHeader />
      <main className="max-w-7xl mx-auto p-6 space-y-6">
        <DashboardStats requests={requests} />
        
        <RecentActivity requests={requests} />
        
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">All Asset Return Requests</h2>
          <SearchFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            onExport={() => exportToCSV(filteredRequests, 'store-asset-requests')}
            exportDisabled={filteredRequests.length === 0}
          />
          <StoreTable requests={filteredRequests} onMarkReceived={handleMarkReceived} />
        </div>
      </main>
    </div>
  );
}
