import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AssetFormData, AssetRequest } from '@/types/asset';

const assetSchema = z.object({
  department: z.string().min(1, 'Department is required'),
  empCode: z.string().min(1, 'Employee code is required'),
  empName: z.string().min(1, 'Employee name is required'),
  makeOfOldAsset: z.string().min(1, 'Make of old asset is required'),
  modelOfAsset: z.string().min(1, 'Model of asset is required'),
  assetNoToReturn: z.string().min(1, 'Asset number is required'),
  sapItemCode: z.string().min(1, 'SAP Item code is required'),
  costCenter: z.string().min(1, 'Cost center is required'),
  remark: z.string(),
});

interface AssetFormProps {
  onSubmit: (data: AssetFormData) => void;
  initialData?: AssetRequest | null;
  onCancel?: () => void;
}

export default function AssetForm({ onSubmit, initialData, onCancel }: AssetFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AssetFormData>({
    resolver: zodResolver(assetSchema),
    defaultValues: initialData || {
      department: '',
      empCode: '',
      empName: '',
      makeOfOldAsset: '',
      modelOfAsset: '',
      assetNoToReturn: '',
      sapItemCode: '',
      costCenter: '',
      remark: '',
    },
  });

  const handleFormSubmit = (data: AssetFormData) => {
    onSubmit(data);
    if (!initialData) {
      reset();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? 'Edit Request' : 'New Asset Return Request'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input id="department" {...register('department')} placeholder="Enter department" />
              {errors.department && <p className="text-sm text-destructive">{errors.department.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="empCode">Employee Code</Label>
              <Input id="empCode" {...register('empCode')} placeholder="Enter employee code" />
              {errors.empCode && <p className="text-sm text-destructive">{errors.empCode.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="empName">Employee Name</Label>
              <Input id="empName" {...register('empName')} placeholder="Enter employee name" />
              {errors.empName && <p className="text-sm text-destructive">{errors.empName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="makeOfOldAsset">Make of Old Asset</Label>
              <Input id="makeOfOldAsset" {...register('makeOfOldAsset')} placeholder="Enter make" />
              {errors.makeOfOldAsset && <p className="text-sm text-destructive">{errors.makeOfOldAsset.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="modelOfAsset">Model of Asset</Label>
              <Input id="modelOfAsset" {...register('modelOfAsset')} placeholder="Enter model" />
              {errors.modelOfAsset && <p className="text-sm text-destructive">{errors.modelOfAsset.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="assetNoToReturn">Asset No. to Return</Label>
              <Input id="assetNoToReturn" {...register('assetNoToReturn')} placeholder="Enter asset number" />
              {errors.assetNoToReturn && <p className="text-sm text-destructive">{errors.assetNoToReturn.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sapItemCode">SAP Item Code</Label>
              <Input id="sapItemCode" {...register('sapItemCode')} placeholder="Enter SAP item code" />
              {errors.sapItemCode && <p className="text-sm text-destructive">{errors.sapItemCode.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="costCenter">Cost Center</Label>
              <Input id="costCenter" {...register('costCenter')} placeholder="Enter cost center" />
              {errors.costCenter && <p className="text-sm text-destructive">{errors.costCenter.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="remark">Remark</Label>
            <Textarea id="remark" {...register('remark')} placeholder="Enter any remarks" rows={3} />
          </div>

          <div className="flex gap-2 justify-end">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit">{initialData ? 'Update Request' : 'Submit Request'}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
