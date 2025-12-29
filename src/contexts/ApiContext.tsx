import React, { createContext, useContext, ReactNode } from 'react';
import { 
  testConnection, 
  createAssetReturn, 
  getAssetReturns as apiGetAssetReturns,
  updateAssetReturn as apiUpdateAssetReturn,
  deleteAssetReturn as apiDeleteAssetReturn
} from '../services/api';
import { handleApiError } from '../utils/errorHandler';

interface ApiContextType {
  testConnection: () => Promise<any>;
  createAssetReturn: (data: any) => Promise<any>;
  getAssetReturns: () => Promise<any>;
  updateAssetReturn: (id: string, data: any) => Promise<any>;
  deleteAssetReturn: (id: string) => Promise<any>;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const api: ApiContextType = {
    testConnection: async () => {
      try {
        return await testConnection();
      } catch (error) {
        throw new Error(handleApiError(error));
      }
    },
    createAssetReturn: async (data) => {
      try {
        return await createAssetReturn(data);
      } catch (error) {
        throw new Error(handleApiError(error));
      }
    },
    getAssetReturns: async () => {
      try {
        return await apiGetAssetReturns();
      } catch (error) {
        throw new Error(handleApiError(error));
      }
    },
    updateAssetReturn: async (id, data) => {
      try {
        return await apiUpdateAssetReturn(id, data);
      } catch (error) {
        throw new Error(handleApiError(error));
      }
    },
    deleteAssetReturn: async (id) => {
      try {
        return await apiDeleteAssetReturn(id);
      } catch (error) {
        throw new Error(handleApiError(error));
      }
    },
  };

  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
};

export const useApi = (): ApiContextType => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};
