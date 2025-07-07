'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  CheckCircle,
  X,
  Clock,
  Package,
  Calendar,
  User,
  MapPin,
  Truck
} from 'lucide-react';

interface OrderDetailsProps {
  order: any;
  onClose: () => void;
}

export function OrderDetails({ order, onClose }: OrderDetailsProps) {
  const { user } = useAuth();
  const { products, updatePurchaseOrder } = useData();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'approved': return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'received': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelled': return <X className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'outline';
      case 'approved': return 'secondary';
      case 'received': return 'default';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product?.name || 'Unknown Product';
  };

  const getProductUnit = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product?.unit || 'unit';
  };

  const handleStatusUpdate = (newStatus: string) => {
    updatePurchaseOrder(order.id, { status: newStatus as any });
    onClose();
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getOrderType = () => {
    if (order.supplierId === 'central-kitchen') return 'Branch Order';
    if (order.supplierId === 'central-kitchen-distribution') return 'Distribution';
    return 'Supplier Order';
  };

  const getOrderTypeColor = () => {
    if (order.supplierId === 'central-kitchen') return 'default';
    if (order.supplierId === 'central-kitchen-distribution') return 'secondary';
    return 'outline';
  };

  const getOrderIcon = () => {
    if (order.supplierId === 'central-kitchen-distribution') return <Truck className="w-5 h-5 mr-2" />;
    return <Package className="w-5 h-5 mr-2" />;
  };

  const canMarkAsReceived = () => {
    if (user?.role === 'main_manager' && order.status === 'approved') return true;
    if (user?.role === 'branch_manager' && 
        order.supplierId === 'central-kitchen-distribution' && 
        order.toBranch === user.branch && 
        order.status === 'approved') return true;
    return false;
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {getOrderIcon()}
            {getOrderType()} Details - #{order.id.slice(-6)}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Order Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {getOrderType()} Information
                </CardTitle>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(order.status)}
                  <Badge variant={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                  <Badge variant={getOrderTypeColor()}>
                    {getOrderType()}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Route</p>
                    <p className="font-medium">
                      {order.supplierId === 'central-kitchen' 
                        ? `${order.fromBranch} → Central Kitchen`
                        : order.supplierId === 'central-kitchen-distribution'
                        ? `Central Kitchen → ${order.toBranch}`
                        : order.supplierId
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Order Date</p>
                    <p className="font-medium">{formatDate(order.orderDate)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Expected Delivery</p>
                    <p className="font-medium">{formatDate(order.expectedDeliveryDate)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Items</p>
                    <p className="font-medium">{order.items.length}</p>
                  </div>
                </div>
              </div>
              
              {order.requestedBy && (
                <div className="mt-4 flex items-center space-x-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {order.supplierId === 'central-kitchen-distribution' ? 'Distributed By' : 'Requested By'}
                    </p>
                    <p className="font-medium">{order.requestedBy}</p>
                  </div>
                </div>
              )}

              {order.notes && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-1">Notes</p>
                  <p className="text-sm bg-muted p-3 rounded-md">{order.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {order.supplierId === 'central-kitchen-distribution' ? 'Distribution Items' : 'Order Items'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Total Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.items.map((item: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {getProductName(item.productId)}
                          <span className="text-sm text-muted-foreground ml-2">
                            ({getProductUnit(item.productId)})
                          </span>
                        </TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
                        <TableCell>${item.totalPrice.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="mt-4 flex justify-end">
                <div className="text-right">
                  <p className="text-lg font-semibold">
                    Total Amount: ${order.totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            
            <div className="space-x-2">
              {user?.role === 'main_manager' && order.status === 'pending' && (
                <>
                  <Button 
                    variant="destructive"
                    onClick={() => handleStatusUpdate('cancelled')}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel {getOrderType()}
                  </Button>
                  <Button onClick={() => handleStatusUpdate('approved')}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve {getOrderType()}
                  </Button>
                </>
              )}
              {canMarkAsReceived() && (
                <Button onClick={() => handleStatusUpdate('received')}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Received
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}