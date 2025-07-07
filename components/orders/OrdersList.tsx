'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Eye, 
  CheckCircle,
  X,
  Clock,
  ShoppingCart,
  Truck
} from 'lucide-react';
import { OrderForm } from './OrderForm';
import { DistributionForm } from './DistributionForm';
import { OrderDetails } from './OrderDetails';

export function OrdersList() {
  const { user } = useAuth();
  const { purchaseOrders, updatePurchaseOrder, products } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showDistributionForm, setShowDistributionForm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Filter orders based on user role
  const filteredOrders = purchaseOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    let matchesType = true;
    if (typeFilter === 'branch_orders') {
      matchesType = order.supplierId === 'central-kitchen';
    } else if (typeFilter === 'distributions') {
      matchesType = order.supplierId === 'central-kitchen-distribution';
    } else if (typeFilter === 'supplier_orders') {
      matchesType = order.supplierId !== 'central-kitchen' && order.supplierId !== 'central-kitchen-distribution';
    }

    // Branch managers can only see their branch orders and distributions to their branch
    if (user?.role === 'branch_manager' && user.branch) {
      return matchesSearch && matchesStatus && matchesType && 
             (order.fromBranch === user.branch || order.toBranch === user.branch);
    }

    return matchesSearch && matchesStatus && matchesType;
  });

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

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    updatePurchaseOrder(orderId, { status: newStatus as any });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  const getOrderType = (order: any) => {
    if (order.supplierId === 'central-kitchen') return 'Branch Order';
    if (order.supplierId === 'central-kitchen-distribution') return 'Distribution';
    return 'Supplier Order';
  };

  const getOrderTypeColor = (order: any) => {
    if (order.supplierId === 'central-kitchen') return 'default';
    if (order.supplierId === 'central-kitchen-distribution') return 'secondary';
    return 'outline';
  };

  const getOrderLocation = (order: any) => {
    if (order.supplierId === 'central-kitchen') {
      return `${order.fromBranch} → Central Kitchen`;
    }
    if (order.supplierId === 'central-kitchen-distribution') {
      return `Central Kitchen → ${order.toBranch}`;
    }
    return order.supplierId;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Orders & Distributions
            </CardTitle>
            <div className="flex space-x-2">
              {user?.role === 'branch_manager' && (
                <Button onClick={() => setShowOrderForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Order
                </Button>
              )}
              {user?.role === 'main_manager' && (
                <Button onClick={() => setShowDistributionForm(true)} variant="secondary">
                  <Truck className="w-4 h-4 mr-2" />
                  Create Distribution
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="branch_orders">Branch Orders</SelectItem>
                <SelectItem value="distributions">Distributions</SelectItem>
                <SelectItem value="supplier_orders">Supplier Orders</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="received">Received</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Order Date</TableHead>
                  <TableHead>Expected Delivery</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">#{order.id.slice(-6)}</TableCell>
                    <TableCell>
                      <Badge variant={getOrderTypeColor(order)}>
                        {getOrderType(order)}
                      </Badge>
                    </TableCell>
                    <TableCell>{getOrderLocation(order)}</TableCell>
                    <TableCell>{order.items.length} items</TableCell>
                    <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>{formatDate(order.orderDate)}</TableCell>
                    <TableCell>{formatDate(order.expectedDeliveryDate)}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {getStatusIcon(order.status)}
                        <Badge variant={getStatusColor(order.status)} className="ml-2">
                          {order.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedOrder(order)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          {user?.role === 'main_manager' && order.status === 'pending' && (
                            <>
                              <DropdownMenuItem 
                                onClick={() => handleStatusUpdate(order.id, 'approved')}
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                                className="text-red-600"
                              >
                                <X className="mr-2 h-4 w-4" />
                                Cancel
                              </DropdownMenuItem>
                            </>
                          )}
                          {user?.role === 'main_manager' && order.status === 'approved' && (
                            <DropdownMenuItem 
                              onClick={() => handleStatusUpdate(order.id, 'received')}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Mark as Received
                            </DropdownMenuItem>
                          )}
                          {/* Branch managers can mark distributions as received */}
                          {user?.role === 'branch_manager' && 
                           order.supplierId === 'central-kitchen-distribution' && 
                           order.toBranch === user.branch && 
                           order.status === 'approved' && (
                            <DropdownMenuItem 
                              onClick={() => handleStatusUpdate(order.id, 'received')}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Mark as Received
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {showOrderForm && (
        <OrderForm onClose={() => setShowOrderForm(false)} />
      )}

      {showDistributionForm && (
        <DistributionForm onClose={() => setShowDistributionForm(false)} />
      )}

      {selectedOrder && (
        <OrderDetails 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
        />
      )}
    </div>
  );
}