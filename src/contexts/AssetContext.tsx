import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { AssetRequest, AssetFormData } from '@/types/asset';
import { useApi } from './ApiContext';

interface AssetContextType {
  requests: AssetRequest[];
  loading: boolean;
  error: string | null;
  addRequest: (data: AssetFormData) => Promise<void>;
  updateRequest: (id: string, data: AssetFormData) => Promise<void>;
  deleteRequest: (id: string) => Promise<void>;
  markAsReceived: (id: string, comment: string) => Promise<void>;
  fetchRequests: () => Promise<void>;
}

const AssetContext = createContext<AssetContextType | undefined>(undefined);

export function AssetProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<AssetRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const {
    getAssetReturns,
    createAssetReturn,
    updateAssetReturn,
    deleteAssetReturn
  } = useApi();

  // Fetch all requests on component mount
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAssetReturns();
      // Map API response to match frontend types
      const mappedData = data.map((item: any) => ({
        id: item.id.toString(),
        department: item.department,
        empCode: item.emp_code,
        empName: item.emp_name,
        makeOfOldAsset: item.make_of_old_asset,
        modelOfAsset: item.model_of_asset,
        assetNoToReturn: item.asset_no_to_return,
        sapItemCode: item.sap_item_code,
        costCenter: item.cost_center,
        remark: item.remarks || '',
        status: item.status || 'Pending',  // Ensure we have a default status
        storeComment: item.store_comment,
        receivedAt: item.received_at,
        createdAt: item.created_at,
      }));
      setRequests(mappedData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch requests');
      console.error('Error fetching requests:', err);
    } finally {
      setLoading(false);
    }
  }, [getAssetReturns]);

  const addRequest = useCallback(async (data: AssetFormData) => {
    try {
      setLoading(true);
      const apiData = {
        department: data.department,
        emp_code: data.empCode,
        emp_name: data.empName,
        email: 'user@example.com', // TODO: Get from auth context
        make_of_old_asset: data.makeOfOldAsset,
        model_of_asset: data.modelOfAsset,
        asset_no_to_return: data.assetNoToReturn,
        sap_item_code: data.sapItemCode,
        cost_center: data.costCenter,
        remarks: data.remark,
      };

      await createAssetReturn(apiData);
      await fetchRequests(); // Refresh the list
      setError(null);
    } catch (err) {
      setError('Failed to add request');
      console.error('Error adding request:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [createAssetReturn, fetchRequests]);

  const updateRequest = useCallback(async (id: string, data: AssetFormData) => {
    try {
      setLoading(true);
      const apiData = {
        department: data.department,
        emp_code: data.empCode,
        emp_name: data.empName,
        make_of_old_asset: data.makeOfOldAsset,
        model_of_asset: data.modelOfAsset,
        asset_no_to_return: data.assetNoToReturn,
        sap_item_code: data.sapItemCode,
        cost_center: data.costCenter,
        remarks: data.remark,
      };

      await updateAssetReturn(id, apiData);
      await fetchRequests(); // Refresh the list
      setError(null);
    } catch (err) {
      setError('Failed to update request');
      console.error('Error updating request:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [updateAssetReturn, fetchRequests]);

  const deleteRequest = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await deleteAssetReturn(id);
      await fetchRequests(); // Refresh the list
      setError(null);
    } catch (err) {
      setError('Failed to delete request');
      console.error('Error deleting request:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [deleteAssetReturn, fetchRequests]);

  const markAsReceived = useCallback(async (id: string, comment: string) => {
    try {
      setLoading(true);
      await updateAssetReturn(id, {
        status: 'Accepted',  // Ensure this matches the ENUM value exactly
        store_comment: comment,
        received_at: new Date().toISOString()
      });
      await fetchRequests(); // Refresh the list
      setError(null);
    } catch (err) {
      setError('Failed to mark as received');
      console.error('Error marking as received:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [updateAssetReturn, fetchRequests]);

  return (
    <AssetContext.Provider
      value={{
        requests,
        loading,
        error,
        addRequest,
        updateRequest,
        deleteRequest,
        markAsReceived,
        fetchRequests,
      }}
    >
      {children}
    </AssetContext.Provider>
  );
}

export const useAssets = (): AssetContextType => {
  const context = useContext(AssetContext);
  if (!context) {
    throw new Error('useAssets must be used within an AssetProvider');
  }
  return context;
};

export default AssetContext;