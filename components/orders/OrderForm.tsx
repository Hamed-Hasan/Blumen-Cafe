'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Minus, Trash2, ShoppingCart } from 'lucide-react';
import { PurchaseOrderItem } from '@/types';

interface OrderFormProps {
  onClose: () => void;
}

export function OrderForm({ onClose }: OrderFormProps) {
  const { user } = useAuth();
  const { products, addPurchaseOrder } = useData();
  const [orderItems, setOrderItems] = useState<PurchaseOrderItem[]>([]);
  const [notes, setNotes] = useState('');
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('');

  const addItem = () => {
    setOrderItems(prev => [...prev, {
      productId: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0
    }]);
  };

  const removeItem = (index: number) => {
    setOrderItems(prev => prev.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof PurchaseOrderItem, value: any) => {
    setOrderItems(prev => prev.map((item, i) => {
      if (i === index) {
        const updatedItem = { ...item, [field]: value };
        
        if (field === 'productId') {
          const product = products.find(p => p.id === value);
          if (product) {
            updatedItem.unitPrice = product.cost;
            updatedItem.totalPrice = updatedItem.quantity * product.cost;
          }
        } else if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.totalPrice = updatedItem.quantity * updatedItem.unitPrice;
        }
        
        return updatedItem;
      }
      return item;
    }));
  };

  const getTotalAmount = () => {
    return orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (orderItems.length === 0) {
      alert('Please add at least one item to the order');
      return;
    }

    if (!expectedDeliveryDate) {
      alert('Please select an expected delivery date');
      return;
    }

    const orderData = {
      supplierId: 'central-kitchen', // Special ID for central kitchen
      items: orderItems,
      totalAmount: getTotalAmount(),
      status: 'pending' as const,
      orderDate: new Date(),
      expectedDeliveryDate: new Date(expectedDeliveryDate),
      notes,
      requestedBy: user?.name || '',
      fromBranch: user?.branch || '',
      toBranch: 'Central Kitchen'
    };

    addPurchaseOrder(orderData);
    onClose();
  };

  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product?.name || 'Unknown Product';
  };

  const getProductUnit = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product?.unit || 'unit';
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <ShoppingCart className="w-5 h-5 mr-2" />
            Create Order to Central Kitchen
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Order Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>From Branch</Label>
                  <Input value={user?.branch || ''} disabled />
                </div>
                <div>
                  <Label>To Location</Label>
                  <Input value="Central Kitchen" disabled />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Requested By</Label>
                  <Input value={user?.name || ''} disabled />
                </div>
                <div>
                  <Label htmlFor="deliveryDate">Expected Delivery Date</Label>
                  <Input
                    id="deliveryDate"
                    type="date"
                    value={expectedDeliveryDate}
                    onChange={(e) => setExpectedDeliveryDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Order Items</CardTitle>
                <Button type="button" onClick={addItem} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {orderItems.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No items added yet. Click "Add Item" to start building your order.
                </p>
              ) : (
                <div className="space-y-4">
                  {orderItems.map((item, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="grid grid-cols-12 gap-4 items-end">
                        <div className="col-span-4">
                          <Label>Product</Label>
                          <Select 
                            value={item.productId} 
                            onValueChange={(value) => updateItem(index, 'productId', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select product" />
                            </SelectTrigger>
                            <SelectContent>
                              {products.map(product => (
                                <SelectItem key={product.id} value={product.id}>
                                  {product.name} ({product.unit})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-2">
                          <Label>Quantity</Label>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                          />
                        </div>
                        <div className="col-span-2">
                          <Label>Unit Price</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={item.unitPrice}
                            onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div className="col-span-2">
                          <Label>Total</Label>
                          <div className="h-10 flex items-center">
                            <Badge variant="secondary">
                              ${item.totalPrice.toFixed(2)}
                            </Badge>
                          </div>
                        </div>
                        <div className="col-span-2">
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeItem(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      {item.productId && (
                        <div className="mt-2 text-sm text-muted-foreground">
                          Unit: {getProductUnit(item.productId)}
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Order Total */}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total Amount:</span>
                      <Badge variant="default" className="text-lg px-4 py-2">
                        ${getTotalAmount().toFixed(2)}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Additional Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Add any special instructions or notes for this order..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={orderItems.length === 0}>
              Create Order
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}