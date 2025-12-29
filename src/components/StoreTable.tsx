import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle } from 'lucide-react';
import { AssetRequest } from '@/types/asset';
import { usePagination } from '@/hooks/usePagination';
import TablePagination from '@/components/TablePagination';

interface StoreTableProps {
  requests: AssetRequest[];
  onMarkReceived: (id: string, comment: string) => void;
}

export default function StoreTable({ requests, onMarkReceived }: StoreTableProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [comment, setComment] = useState('');

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

  const handleConfirmReceived = () => {
    if (selectedId) {
      onMarkReceived(selectedId, comment);
      setSelectedId(null);
      setComment('');
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
              <TableHead>Remark</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
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
                <TableCell className="max-w-[150px] truncate" title={request.remark}>
                  {request.remark || '-'}
                </TableCell>
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
                <TableCell className="text-right">
                  {request.status === 'Pending' || request.status === 'In Progress' ? (
                    <Button
                      size="sm"
                      onClick={() => setSelectedId(request.id)}
                      className="gap-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Received
                    </Button>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      {request.storeComment && (
                        <span title={request.storeComment}>Comment: {request.storeComment}</span>
                      )}
                    </span>
                  )}
                </TableCell>
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

      <Dialog open={!!selectedId} onOpenChange={() => setSelectedId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark as Received</DialogTitle>
            <DialogDescription>
              Confirm that you have received this asset. You can add an optional comment below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4">
            <Label htmlFor="comment">Comment (optional)</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add any notes about the received asset..."
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedId(null)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmReceived}>Confirm Received</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
