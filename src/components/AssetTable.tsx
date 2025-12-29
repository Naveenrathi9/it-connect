import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Pencil, Trash2 } from 'lucide-react';
import { AssetRequest } from '@/types/asset';
import { usePagination } from '@/hooks/usePagination';
import TablePagination from '@/components/TablePagination';

interface AssetTableProps {
  requests: AssetRequest[];
  onEdit?: (request: AssetRequest) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

export default function AssetTable({ requests, onEdit, onDelete, showActions = true }: AssetTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  const {
    currentPage,
    totalPages,
    paginatedItems,
    nextPage,
    prevPage,
    goToPage,
    startIndex,
    endIndex,
    totalItems,
  } = usePagination({ items: requests, itemsPerPage: 10 });

  const handleConfirmDelete = () => {
    if (deleteId && onDelete) {
      onDelete(deleteId);
      setDeleteId(null);
    }
  };

  if (requests.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground border rounded-lg bg-card">
        No asset return requests found.
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-lg overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Department</TableHead>
              <TableHead>Emp Code</TableHead>
              <TableHead>Emp Name</TableHead>
              <TableHead>Make</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Asset No.</TableHead>
              <TableHead>SAP Code</TableHead>
              <TableHead>Cost Center</TableHead>
              <TableHead>Status</TableHead>
              {showActions && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedItems.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{request.department}</TableCell>
                <TableCell>{request.empCode}</TableCell>
                <TableCell>{request.empName}</TableCell>
                <TableCell>{request.makeOfOldAsset}</TableCell>
                <TableCell>{request.modelOfAsset}</TableCell>
                <TableCell>{request.assetNoToReturn}</TableCell>
                <TableCell>{request.sapItemCode}</TableCell>
                <TableCell>{request.costCenter}</TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      request.status === 'Accepted' ? 'default' : 
                      request.status === 'In Progress' ? 'secondary' : 'outline'
                    }
                    className={request.status === 'Accepted' ? 'bg-green-600 hover:bg-green-700' : ''}
                  >
                    {request.status}
                  </Badge>
                </TableCell>
                {showActions && (
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit?.(request)}
                        disabled={request.status === 'Received'}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(request.id)}
                        disabled={request.status === 'Received'}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        startIndex={startIndex}
        endIndex={endIndex}
        totalItems={totalItems}
        onPrevPage={prevPage}
        onNextPage={nextPage}
        onGoToPage={goToPage}
      />

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this asset return request? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
