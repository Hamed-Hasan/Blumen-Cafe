'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
  Edit,
  Building,
  Phone,
  MapPin,
  Clock,
  User,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

export function BranchesList() {
  const { user } = useAuth();
  const { branches, dashboardStats } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBranches = branches.filter(branch =>
    branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.manager.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getBranchStats = (branchName: string) => {
    return dashboardStats.branches[branchName] || {
      inventoryValue: 0,
      lowStockCount: 0,
      expiredCount: 0
    };
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Building className="w-5 h-5 mr-2" />
              Branch Management
            </CardTitle>
            {user?.role === 'main_manager' && (
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Branch
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search branches..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredBranches.map((branch) => {
              const stats = getBranchStats(branch.name);
              return (
                <Card key={branch.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl flex items-center">
                        <Building className="w-5 h-5 mr-2" />
                        {branch.name}
                      </CardTitle>
                      <Badge variant={branch.status === 'active' ? 'default' : 'secondary'}>
                        {branch.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Branch Information */}
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <User className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span className="font-medium">{branch.manager}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span className="text-muted-foreground">{branch.phone}</span>
                      </div>
                      <div className="flex items-start text-sm">
                        <MapPin className="w-4 h-4 mr-2 text-muted-foreground mt-0.5" />
                        <span className="text-muted-foreground">{branch.address}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {branch.openingHours.open} - {branch.openingHours.close}
                        </span>
                      </div>
                    </div>

                    {/* Branch Statistics */}
                    <div className="border-t pt-4">
                      <h4 className="font-medium text-sm mb-3 flex items-center">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Branch Statistics
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <p className="text-lg font-bold text-green-600">
                            ${stats.inventoryValue.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">Inventory Value</p>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <p className="text-lg font-bold text-blue-600">
                            {stats.lowStockCount + stats.expiredCount}
                          </p>
                          <p className="text-xs text-muted-foreground">Total Alerts</p>
                        </div>
                      </div>
                      
                      {(stats.lowStockCount > 0 || stats.expiredCount > 0) && (
                        <div className="mt-3 space-y-1">
                          {stats.lowStockCount > 0 && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Low Stock Items:</span>
                              <Badge variant="outline" className="text-yellow-600">
                                {stats.lowStockCount}
                              </Badge>
                            </div>
                          )}
                          {stats.expiredCount > 0 && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Expired Items:</span>
                              <Badge variant="destructive">
                                {stats.expiredCount}
                              </Badge>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end pt-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          {user?.role === 'main_manager' && (
                            <>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Branch
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <AlertTriangle className="mr-2 h-4 w-4" />
                                View Alerts
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}