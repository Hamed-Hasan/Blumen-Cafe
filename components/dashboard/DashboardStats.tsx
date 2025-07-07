'use client';

import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  DollarSign, 
  AlertTriangle, 
  TrendingUp,
  Building,
  Users,
  ShoppingCart,
  Clock
} from 'lucide-react';

export function DashboardStats() {
  const { dashboardStats } = useData();

  const stats = [
    {
      title: 'Total Products',
      value: dashboardStats.totalProducts,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Inventory Value',
      value: `$${dashboardStats.totalInventoryValue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Low Stock Items',
      value: dashboardStats.lowStockItems,
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'Expired Items',
      value: dashboardStats.expiredItems,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      title: 'Expiring Soon',
      value: dashboardStats.expiringItems,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'Total Suppliers',
      value: dashboardStats.totalSuppliers,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Pending Orders',
      value: dashboardStats.pendingOrders,
      icon: ShoppingCart,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    },
    {
      title: 'Today Production',
      value: dashboardStats.todayProduction,
      icon: TrendingUp,
      color: 'text-teal-600',
      bgColor: 'bg-teal-100'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Branch Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="w-5 h-5 mr-2" />
            Branch Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(dashboardStats.branches).map(([branchName, stats]) => (
              <div key={branchName} className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3">{branchName}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Inventory Value</span>
                    <span className="font-medium">${stats.inventoryValue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Low Stock</span>
                    <Badge variant={stats.lowStockCount > 0 ? "destructive" : "secondary"}>
                      {stats.lowStockCount}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Expired</span>
                    <Badge variant={stats.expiredCount > 0 ? "destructive" : "secondary"}>
                      {stats.expiredCount}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}