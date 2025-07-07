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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Eye, 
  Edit,
  CheckCircle,
  X,
  Clock,
  Truck,
  MapPin,
  User,
  Calendar,
  Package,
  PlayCircle,
  Route
} from 'lucide-react';

export function DistributionList() {
  const { user } = useAuth();
  const { distributions, products, branches, inventory, addDistribution, updateDistribution } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingDistribution, setEditingDistribution] = useState<any>(null);
  const [selectedDistribution, setSelectedDistribution] = useState<any>(null);

  // Form state
  const [formData, setFormData] = useState({
    productId: '',
    toLocation: '',
    quantity: 1,
    scheduledDate: '',
    driverName: '',
    notes: ''
  });

  const filteredDistributions = distributions.filter(distribution => {
    const product = products.find(p => p.id === distribution.productId);
    const matchesSearch = product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         distribution.toLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         distribution.driverName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || distribution.status === statusFilter;
    const matchesLocation = locationFilter === 'all' || distribution.toLocation === locationFilter;
    
    let matchesDate = true;
    if (dateFilter === 'today') {
      matchesDate = distribution.scheduledDate.toDateString() === new Date().toDateString();
    } else if (dateFilter === 'tomorrow') {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      matchesDate = distribution.scheduledDate.toDateString() === tomorrow.toDateString();
    } else if (dateFilter === 'this_week') {
      const now = new Date();
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      matchesDate = distribution.scheduledDate >= now && distribution.scheduledDate <= weekFromNow;
    }

    return matchesSearch && matchesStatus && matchesLocation && matchesDate;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'in_transit': return <Truck className="w-4 h-4 text-orange-500" />;
      case 'delivered': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelled': return <X className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'outline';
      case 'in_transit': return 'secondary';
      case 'delivered': return 'default';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const handleStatusUpdate = (distributionId: string, newStatus: string) => {
    const updateData: any = { status: newStatus };
    if (newStatus === 'delivered') {
      updateData.deliveryDate = new Date();
    }
    updateDistribution(distributionId, updateData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.productId || !formData.toLocation || !formData.scheduledDate) {
      alert('Please fill in all required fields');
      return;
    }

    // Check available stock
    const availableStock = getAvailableStock(formData.productId);
    if (formData.quantity > availableStock) {
      alert(`Insufficient stock. Available: ${availableStock}`);
      return;
    }

    const distributionData = {
      productId: formData.productId,
      fromLocation: 'Central Kitchen',
      toLocation: formData.toLocation,
      quantity: formData.quantity,
      scheduledDate: new Date(formData.scheduledDate),
      status: 'pending' as const,
      driverName: formData.driverName,
      notes: formData.notes
    };

    if (editingDistribution) {
      updateDistribution(editingDistribution.id, distributionData);
    } else {
      addDistribution(distributionData);
    }

    setShowForm(false);
    setEditingDistribution(null);
    setFormData({ productId: '', toLocation: '', quantity: 1, scheduledDate: '', driverName: '', notes: '' });
  };

  const handleEdit = (distribution: any) => {
    setEditingDistribution(distribution);
    setFormData({
      productId: distribution.productId,
      toLocation: distribution.toLocation,
      quantity: distribution.quantity,
      scheduledDate: distribution.scheduledDate.toISOString().split('T')[0],
      driverName: distribution.driverName || '',
      notes: distribution.notes || ''
    });
    setShowForm(true);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product?.name || 'Unknown Product';
  };

  const getProductUnit = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product?.unit || 'unit';
  };

  const getAvailableStock = (productId: string) => {
    const centralKitchenStock = inventory.filter(
      item => item.productId === productId && 
              item.location === 'Central Kitchen' && 
              item.status === 'available'
    );
    return centralKitchenStock.reduce((sum, item) => sum + item.quantity, 0);
  };

  const todaysDistributions = distributions.filter(dist => 
    dist.scheduledDate.toDateString() === new Date().toDateString()
  );

  const pendingToday = todaysDistributions.filter(dist => dist.status === 'pending').length;
  const inTransitToday = todaysDistributions.filter(dist => dist.status === 'in_transit').length;
  const deliveredToday = todaysDistributions.filter(dist => dist.status === 'delivered').length;

  const totalDistributions = distributions.length;

  return (
    <div className="space-y-6">
      {/* Distribution Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Today's Distributions</p>
                <p className="text-2xl font-bold">{todaysDistributions.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Delivered</p>
                <p className="text-2xl font-bold text-green-600">{deliveredToday}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Transit</p>
                <p className="text-2xl font-bold text-orange-600">{inTransitToday}</p>
              </div>
              <Truck className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-blue-600">{pendingToday}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Distributions Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Truck className="w-5 h-5 mr-2" />
              Distribution Management
            </CardTitle>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Schedule Distribution
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search distributions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_transit">In Transit</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                {branches.map(branch => (
                  <SelectItem key={branch.id} value={branch.name}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="tomorrow">Tomorrow</SelectItem>
                <SelectItem value="this_week">This Week</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Scheduled Date</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDistributions.map((distribution) => (
                  <TableRow key={distribution.id}>
                    <TableCell className="font-medium">
                      <div>
                        <p>{getProductName(distribution.productId)}</p>
                        <p className="text-sm text-muted-foreground">
                          {getProductUnit(distribution.productId)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Route className="w-4 h-4 mr-2 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{distribution.fromLocation} → {distribution.toLocation}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Package className="w-4 h-4 mr-1 text-muted-foreground" />
                        {distribution.quantity}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{formatDate(distribution.scheduledDate)}</p>
                        <p className="text-sm text-muted-foreground">{formatTime(distribution.scheduledDate)}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2 text-muted-foreground" />
                        {distribution.driverName || 'Not assigned'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {getStatusIcon(distribution.status)}
                        <Badge variant={getStatusColor(distribution.status)} className="ml-2">
                          {distribution.status.replace('_', ' ')}
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
                          <DropdownMenuItem onClick={() => setSelectedDistribution(distribution)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          {distribution.status === 'pending' && (
                            <>
                              <DropdownMenuItem onClick={() => handleEdit(distribution)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Distribution
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleStatusUpdate(distribution.id, 'in_transit')}
                              >
                                <PlayCircle className="mr-2 h-4 w-4" />
                                Start Delivery
                              </DropdownMenuItem>
                            </>
                          )}
                          {distribution.status === 'in_transit' && (
                            <DropdownMenuItem 
                              onClick={() => handleStatusUpdate(distribution.id, 'delivered')}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Mark Delivered
                            </DropdownMenuItem>
                          )}
                          {(distribution.status === 'pending' || distribution.status === 'in_transit') && (
                            <DropdownMenuItem 
                              onClick={() => handleStatusUpdate(distribution.id, 'cancelled')}
                              className="text-red-600"
                            >
                              <X className="mr-2 h-4 w-4" />
                              Cancel
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

      {/* Add/Edit Distribution Dialog */}
      {showForm && (
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingDistribution ? 'Edit Distribution' : 'Schedule Distribution'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="product">Product</Label>
                <Select 
                  value={formData.productId} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, productId: value }))}
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
                {formData.productId && (
                  <p className="text-sm text-muted-foreground">
                    Available stock: {getAvailableStock(formData.productId)} {getProductUnit(formData.productId)}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="toLocation">Destination Branch</Label>
                <Select 
                  value={formData.toLocation} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, toLocation: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map(branch => (
                      <SelectItem key={branch.id} value={branch.name}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max={formData.productId ? getAvailableStock(formData.productId) : undefined}
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="scheduledDate">Scheduled Date & Time</Label>
                <Input
                  id="scheduledDate"
                  type="datetime-local"
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="driverName">Driver Name</Label>
                <Input
                  id="driverName"
                  placeholder="Enter driver name"
                  value={formData.driverName}
                  onChange={(e) => setFormData(prev => ({ ...prev, driverName: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Distribution notes..."
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingDistribution ? 'Update' : 'Schedule'} Distribution
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* View Distribution Details Dialog */}
      {selectedDistribution && (
        <Dialog open={!!selectedDistribution} onOpenChange={() => setSelectedDistribution(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Distribution Details</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Distribution Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Product</Label>
                  <p className="font-medium">{getProductName(selectedDistribution.productId)}</p>
                </div>
                <div>
                  <Label>Quantity</Label>
                  <p className="font-medium">{selectedDistribution.quantity} {getProductUnit(selectedDistribution.productId)}</p>
                </div>
                <div>
                  <Label>From</Label>
                  <p className="font-medium">{selectedDistribution.fromLocation}</p>
                </div>
                <div>
                  <Label>To</Label>
                  <p className="font-medium">{selectedDistribution.toLocation}</p>
                </div>
                <div>
                  <Label>Scheduled Date</Label>
                  <p className="font-medium">{formatDate(selectedDistribution.scheduledDate)}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <div className="flex items-center">
                    {getStatusIcon(selectedDistribution.status)}
                    <Badge variant={getStatusColor(selectedDistribution.status)} className="ml-2">
                      {selectedDistribution.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
                {selectedDistribution.driverName && (
                  <div>
                    <Label>Driver</Label>
                    <p className="font-medium">{selectedDistribution.driverName}</p>
                  </div>
                )}
                {selectedDistribution.deliveryDate && (
                  <div>
                    <Label>Delivered Date</Label>
                    <p className="font-medium">{formatDate(selectedDistribution.deliveryDate)}</p>
                  </div>
                )}
              </div>

              {selectedDistribution.notes && (
                <div>
                  <Label>Notes</Label>
                  <p className="mt-1 p-3 bg-muted rounded">{selectedDistribution.notes}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}