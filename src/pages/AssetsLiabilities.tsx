import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useFinance, AssetLiability } from '@/contexts/FinanceContext';
import { Plus, Pencil, Trash2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { formatCurrency } from '@/lib/formatters';

const AssetsLiabilities = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const type = (searchParams.get('type') as 'asset' | 'liability') || 'asset';
  const { assetsLiabilities, addAssetLiability, updateAssetLiability, deleteAssetLiability } = useFinance();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AssetLiability | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    value: '',
    category: '',
  });

  const items = assetsLiabilities.filter(item => item.type === type);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingItem) {
      updateAssetLiability(editingItem.id, {
        name: formData.name,
        value: parseFloat(formData.value),
        category: formData.category,
      });
    } else {
      addAssetLiability({
        name: formData.name,
        value: parseFloat(formData.value),
        category: formData.category,
        type,
        date: new Date(),
      });
    }

    setFormData({ name: '', value: '', category: '' });
    setEditingItem(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (item: AssetLiability) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      value: item.value.toString(),
      category: item.category,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      deleteAssetLiability(id);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/net-worth')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-4xl font-bold text-foreground">
            {type === 'asset' ? 'Assets' : 'Liabilities'}
          </h1>
        </div>

        {/* Add Button */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full" size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Add {type === 'asset' ? 'Asset' : 'Liability'}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Edit' : 'Add'} {type === 'asset' ? 'Asset' : 'Liability'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="value">Value (₹)</Label>
                <Input
                  id="value"
                  type="number"
                  step="0.01"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Real Estate, Savings, etc."
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                {editingItem ? 'Update' : 'Add'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* List */}
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-card border border-border rounded-xl p-4 flex items-center justify-between hover:border-primary/50 transition-colors"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{item.name}</h3>
                <p className="text-sm text-muted-foreground">{item.category}</p>
              </div>
              <div className="flex items-center gap-4">
                <p className={`text-xl font-bold ${type === 'asset' ? 'text-success' : 'text-destructive'}`}>
                  {formatCurrency(item.value)}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(item)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No {type === 'asset' ? 'assets' : 'liabilities'} added yet
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssetsLiabilities;
