'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from '@/components/auth/LoginForm';
import { Sidebar } from '@/components/layouts/Sidebar';
import { Header } from '@/components/layouts/Header';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { RecentAlerts } from '@/components/dashboard/RecentAlerts';
import { ProductList } from '@/components/products/ProductList';
import { InventoryList } from '@/components/inventory/InventoryList';
import { AlertsList } from '@/components/alerts/AlertsList';
import { OrdersList } from '@/components/orders/OrdersList';
import { RecipesList } from '@/components/recipes/RecipesList';
import { SuppliersList } from '@/components/suppliers/SuppliersList';
import { BranchesList } from '@/components/branches/BranchesList';

export default function Home() {
  const { user, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const getPageTitle = () => {
    switch (currentPage) {
      case 'dashboard': return 'Dashboard';
      case 'products': return 'Products';
      case 'recipes': return 'Recipes';
      case 'inventory': return 'Inventory';
      case 'production': return 'Production';
      case 'distribution': return 'Distribution';
      case 'suppliers': return 'Suppliers';
      case 'purchase-orders': return 'Purchase Orders';
      case 'branches': return 'Branches';
      case 'alerts': return 'Alerts';
      case 'reports': return 'Reports';
      case 'settings': return 'Settings';
      default: return 'Dashboard';
    }
  };

  const getPageSubtitle = () => {
    switch (currentPage) {
      case 'dashboard': return 'Overview of your restaurant operations';
      case 'products': return 'Manage your product catalog';
      case 'recipes': return 'Create and manage recipes';
      case 'inventory': return 'Track inventory across all locations';
      case 'suppliers': return 'Manage supplier relationships';
      case 'purchase-orders': return 'Manage orders and requests';
      case 'branches': return 'Monitor branch operations';
      case 'alerts': return 'Monitor system alerts and notifications';
      default: return '';
    }
  };

  const renderPageContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <DashboardStats />
            <RecentAlerts />
          </div>
        );
      case 'products':
        return user.role === 'main_manager' ? (
          <ProductList />
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Access denied. Only Main Managers can manage products.</p>
          </div>
        );
      case 'recipes':
        return <RecipesList />;
      case 'inventory':
        return <InventoryList />;
      case 'suppliers':
        return user.role === 'main_manager' ? (
          <SuppliersList />
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Access denied. Only Main Managers can manage suppliers.</p>
          </div>
        );
      case 'purchase-orders':
        return <OrdersList />;
      case 'branches':
        return user.role === 'main_manager' ? (
          <BranchesList />
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Access denied. Only Main Managers can manage branches.</p>
          </div>
        );
      case 'alerts':
        return <AlertsList />;
      case 'production':
      case 'distribution':
      case 'reports':
      case 'settings':
        return (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {getPageTitle()} module is under development
            </p>
          </div>
        );
      default:
        return <DashboardStats />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <div className="flex-1 flex flex-col">
        <Header title={getPageTitle()} subtitle={getPageSubtitle()} />
        <main className="flex-1 p-6">
          {renderPageContent()}
        </main>
      </div>
    </div>
  );
}