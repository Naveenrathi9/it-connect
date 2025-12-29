export type UserRole = 'IT' | 'Store';

export type AssetStatus = 'Pending' | 'In Progress' | 'Accepted';

export interface AssetRequest {
  id: string;
  department: string;
  empCode: string;
  empName: string;
  makeOfOldAsset: string;
  modelOfAsset: string;
  assetNoToReturn: string;
  sapItemCode: string;
  costCenter: string;
  remark: string;
  status: AssetStatus;
  storeComment?: string;
  receivedAt?: string;
  createdAt: string;
}

export interface AssetFormData {
  department: string;
  empCode: string;
  empName: string;
  makeOfOldAsset: string;
  modelOfAsset: string;
  assetNoToReturn: string;
  sapItemCode: string;
  costCenter: string;
  remark: string;
}
