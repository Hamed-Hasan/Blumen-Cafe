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
  Search, 
  Plus, 
  Warehouse,
  AlertTriangle,
  Clock,
  CheckCircle
} from 'lucide-react';

export function InventoryList() {
  const { user } = useAuth();
  const { inventory, products, branches } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter locations based on user role
  const availableLocations = user?.role === 'main_manager' 
    ? ['Central Kitchen', ...branches.map(b => b.name)]
    : user?.branch ? [user.branch] : [];

  const filteredInventory = inventory.filter(item => {
    const product = products.find(p => p.id === item.productId);
    const matchesSearch = product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.batchNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = locationFilter === 'all' || item.location === locationFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

    // Branch managers can only see their branch inventory
    if (user?.role === 'branch_manager' && user.branch) {
      return matchesSearch && matchesStatus && item.location === user.branch;
    }

    return matchesSearch && matchesLocation && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'low_stock': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'expired': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'out_of_stock': return <AlertTriangle className="w-4 h-4 text-gray-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'secondary';
      case 'low_stock': return 'outline';
      case 'expired': return 'destructive';
      case 'out_of_stock': return 'secondary';
      default: return 'secondary';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  const getDaysUntilExpiry = (expirationDate: Date) => {
    const today = new Date();
    const expiry = new Date(expirationDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Warehouse className="w-5 h-5 mr-2" />
              Inventory Management
            </CardTitle>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Inventory
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            {user?.role === 'main_manager' && (
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {availableLocations.map(location => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="low_stock">Low Stock</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="out_of_stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Batch Number</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Received Date</TableHead>
                  <TableHead>Expiration Date</TableHead>
                  <TableHead>Days to Expiry</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((item) => {
                  const product = products.find(p => p.id === item.productId);
                  const daysToExpiry = getDaysUntilExpiry(item.expirationDate);
                  
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {product?.name || 'Unknown Product'}
                      </TableCell>
                      <TableCell>{item.batchNumber}</TableCell>
                      <TableCell>{item.location}</TableCell>
                      <TableCell>{item.quantity} {product?.unit}</TableCell>
                      <TableCell>{formatDate(item.receivedDate)}</TableCell>
                      <TableCell>{formatDate(item.expirationDate)}</TableCell>
                      <TableCell>
                        <span className={`font-medium ${
                          daysToExpiry < 0 ? 'text-red-600' : 
                          daysToExpiry <= 3 ? 'text-orange-600' : 'text-gray-600'
                        }`}>
                          {daysToExpiry < 0 ? 'Expired' : `${daysToExpiry} days`}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {getStatusIcon(item.status)}
                          <Badge variant={getStatusColor(item.status)} className="ml-2">
                            {item.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        ${(item.quantity * item.cost).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}