import { AssetRequest } from '@/types/asset';

export function exportToCSV(requests: AssetRequest[], filename: string = 'asset-requests') {
  const headers = [
    'Department',
    'Emp Code',
    'Emp Name',
    'Make of Old Asset',
    'Model of Asset',
    'Asset No. to Return',
    'SAP Item Code',
    'Cost Center',
    'Remark',
    'Status',
    'Store Comment',
    'Created At',
    'Received At',
  ];

  const rows = requests.map((request) => [
    request.department,
    request.empCode,
    request.empName,
    request.makeOfOldAsset,
    request.modelOfAsset,
    request.assetNoToReturn,
    request.sapItemCode,
    request.costCenter,
    request.remark,
    request.status,
    request.storeComment || '',
    new Date(request.createdAt).toLocaleString(),
    request.receivedAt ? new Date(request.receivedAt).toLocaleString() : '',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}
