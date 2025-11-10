import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useFinance, AssetLiability } from '@/contexts/FinanceContext';
import { Plus, Pencil, Trash2, ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react';
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
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate('/net-worth')}
              className="rounded-full hover:bg-primary hover:text-primary-foreground transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl lg:text-4xl font-display font-bold bg-gradient-to-r from-primary via-accent to-success bg-clip-text text-transparent">
                {type === 'asset' ? 'Assets' : 'Liabilities'}
              </h1>
              <p className="text-muted-foreground mt-1">Manage your {type === 'asset' ? 'assets' : 'liabilities'} and track their value</p>
            </div>
          </div>
          
          {/* Add Button */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2 shadow-lg hover:shadow-xl transition-all">
                <Plus className="w-5 h-5" />
                Add {type === 'asset' ? 'Asset' : 'Liability'}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-2xl font-display">
                  {editingItem ? 'Edit' : 'Add New'} {type === 'asset' ? 'Asset' : 'Liability'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-base font-semibold">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={type === 'asset' ? 'e.g., Savings Account, Property' : 'e.g., Home Loan, Car Loan'}
                    className="h-12"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="value" className="text-base font-semibold">Value (₹)</Label>
                  <Input
                    id="value"
                    type="number"
                    step="0.01"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    placeholder="0.00"
                    className="h-12 text-lg"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-base font-semibold">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder={type === 'asset' ? 'e.g., Real Estate, Savings, Investments' : 'e.g., Loans, Credit Cards, Mortgages'}
                    className="h-12"
                    required
                  />
                </div>
                <Button type="submit" className="w-full h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all">
                  {editingItem ? 'Update' : 'Add'} {type === 'asset' ? 'Asset' : 'Liability'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* List */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className={`group bg-gradient-to-br ${
                type === 'asset' 
                  ? 'from-success/10 to-success/5 border-success/20 hover:border-success/40' 
                  : 'from-destructive/10 to-destructive/5 border-destructive/20 hover:border-destructive/40'
              } border rounded-2xl p-6 transition-all hover:shadow-xl hover:scale-[1.02]`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-foreground mb-1">{item.name}</h3>
                  <span className="text-xs px-3 py-1 rounded-full bg-muted/50 text-muted-foreground">
                    {item.category}
                  </span>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(item)}
                    className="h-8 w-8 hover:bg-background/80"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(item.id)}
                    className="h-8 w-8 hover:bg-background/80 hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border/30">
                <p className="text-sm text-muted-foreground mb-1">Total Value</p>
                <p className={`text-3xl font-bold ${type === 'asset' ? 'text-success' : 'text-destructive'}`}>
                  {formatCurrency(item.value)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-6">
              {type === 'asset' ? (
                <TrendingUp className="w-10 h-10 text-muted-foreground" />
              ) : (
                <TrendingDown className="w-10 h-10 text-muted-foreground" />
              )}
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No {type === 'asset' ? 'assets' : 'liabilities'} yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Start by adding your first {type === 'asset' ? 'asset' : 'liability'} to track your financial position
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetsLiabilities;
