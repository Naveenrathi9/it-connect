import { useMemo } from 'react';
import { AssetRequest, AssetStatus } from '@/types/asset';

export function useFilteredRequests(
  requests: AssetRequest[],
  searchTerm: string,
  statusFilter: AssetStatus | 'all'
) {
  return useMemo(() => {
    return requests.filter((request) => {
      const matchesSearch =
        searchTerm === '' ||
        request.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.empName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.empCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.assetNoToReturn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.modelOfAsset.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.makeOfOldAsset.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || request.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [requests, searchTerm, statusFilter]);
}
