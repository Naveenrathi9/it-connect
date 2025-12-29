import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAssets } from '@/contexts/AssetContext';
import { useFilteredRequests } from '@/hooks/useFilteredRequests';
import DashboardHeader from '@/components/DashboardHeader';
import DashboardStats from '@/components/DashboardStats';
import RecentActivity from '@/components/RecentActivity';
import SearchFilter from '@/components/SearchFilter';
import AssetForm from '@/components/AssetForm';
import AssetTable from '@/components/AssetTable';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { AssetRequest, AssetFormData, AssetStatus } from '@/types/asset';
import { exportToCSV } from '@/lib/exportCSV';
import { toast } from '@/hooks/use-toast';

export default function ITDashboard() {
  const { role, isAuthenticated } = useAuth();
  const { requests, addRequest, updateRequest, deleteRequest } = useAssets();
  const [editingRequest, setEditingRequest] = useState<AssetRequest | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<AssetStatus | 'all'>('all');

  const filteredRequests = useFilteredRequests(requests, searchTerm, statusFilter);

  if (!isAuthenticated || role !== 'IT') {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = (data: AssetFormData) => {
    addRequest(data);
    toast({
      title: 'Success',
      description: 'Asset return request submitted successfully.',
    });
  };

  const handleEdit = (request: AssetRequest) => {
    setEditingRequest(request);
  };

  const handleUpdate = (data: AssetFormData) => {
    if (editingRequest) {
      updateRequest(editingRequest.id, data);
      setEditingRequest(null);
      toast({
        title: 'Success',
        description: 'Request updated successfully.',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteRequest(id);
      toast({
        title: 'Success',
        description: 'Request has been deleted successfully.',
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete the request. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardHeader />
      <main className="max-w-7xl mx-auto p-6 space-y-6">
        <DashboardStats requests={requests} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AssetForm onSubmit={handleSubmit} />
          </div>
          <RecentActivity requests={requests} />
        </div>
        
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Submitted Requests</h2>
          <SearchFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            onExport={() => exportToCSV(filteredRequests, 'it-asset-requests')}
            exportDisabled={filteredRequests.length === 0}
          />
          <AssetTable
            requests={filteredRequests}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </main>

      <Dialog open={!!editingRequest} onOpenChange={() => setEditingRequest(null)}>
        <DialogContent className="max-w-3xl">
          <AssetForm
            onSubmit={handleUpdate}
            initialData={editingRequest}
            onCancel={() => setEditingRequest(null)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
