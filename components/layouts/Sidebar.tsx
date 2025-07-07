'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  LayoutDashboard,
  Package,
  ChefHat,
  Warehouse,
  Truck,
  Users,
  ShoppingCart,
  AlertTriangle,
  Building,
  Settings,
  LogOut,
  Menu,
  X,
  Bell
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const { user, logout } = useAuth();
  const { alerts } = useData();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const unreadAlerts = alerts.filter(alert => !alert.isRead).length;

  const mainManagerMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'recipes', label: 'Recipes', icon: ChefHat },
    { id: 'inventory', label: 'Inventory', icon: Warehouse },
    { id: 'production', label: 'Production', icon: ChefHat },
    { id: 'distribution', label: 'Distribution', icon: Truck },
    { id: 'suppliers', label: 'Suppliers', icon: Users },
    { id: 'purchase-orders', label: 'Purchase Orders', icon: ShoppingCart },
    { id: 'branches', label: 'Branches', icon: Building },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle, badge: unreadAlerts },
  ];

  const branchManagerMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventory', icon: Warehouse },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle, badge: unreadAlerts },
    { id: 'reports', label: 'Reports', icon: Package },
  ];

  const menuItems = user?.role === 'main_manager' ? mainManagerMenuItems : branchManagerMenuItems;

  const handleLogout = () => {
    logout();
    setIsMobileOpen(false);
  };

  const handleMenuClick = (page: string) => {
    onPageChange(page);
    setIsMobileOpen(false);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="font-semibold text-lg">Blumen Cafe</h2>
                <p className="text-sm text-muted-foreground">
                  {user?.role === 'main_manager' ? 'Main Manager' : `${user?.branch} Branch`}
                </p>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex"
          >
            <Menu className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{user?.name}</p>
              <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant={currentPage === item.id ? "default" : "ghost"}
            className={cn(
              "w-full justify-start",
              isCollapsed && "justify-center px-2"
            )}
            onClick={() => handleMenuClick(item.id)}
          >
            <item.icon className="w-4 h-4" />
            {!isCollapsed && (
              <>
                <span className="ml-2">{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <Badge variant="destructive" className="ml-auto">
                    {item.badge}
                  </Badge>
                )}
              </>
            )}
          </Button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t space-y-2">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start",
            isCollapsed && "justify-center px-2"
          )}
          onClick={() => handleMenuClick('settings')}
        >
          <Settings className="w-4 h-4" />
          {!isCollapsed && <span className="ml-2">Settings</span>}
        </Button>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50",
            isCollapsed && "justify-center px-2"
          )}
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          {!isCollapsed && <span className="ml-2">Logout</span>}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="sm"
        className="lg:hidden fixed top-4 left-4 z-50"
        onClick={() => setIsMobileOpen(true)}
      >
        <Menu className="w-5 h-5" />
      </Button>

      {/* Mobile sidebar */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="w-80 bg-white h-full shadow-lg">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="font-semibold">Menu</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="h-full overflow-y-auto">
              <SidebarContent />
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className={cn(
        "hidden lg:block bg-white border-r transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}>
        <SidebarContent />
      </div>
    </>
  );
}