// User and Role Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'main_manager' | 'branch_manager';
  branch?: string;
  avatar?: string;
  createdAt: Date;
}

// Product and Recipe Types
export interface Product {
  id: string;
  name: string;
  category: string;
  unit: string;
  cost: number;
  minStock: number;
  maxStock: number;
  expirationDays: number;
  description?: string;
  createdAt: Date;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: RecipeIngredient[];
  preparationTime: number;
  cookingTime: number;
  servings: number;
  instructions: string[];
  createdAt: Date;
}

export interface RecipeIngredient {
  productId: string;
  quantity: number;
  unit: string;
}

// Inventory Types
export interface InventoryItem {
  id: string;
  productId: string;
  quantity: number;
  location: string;
  batchNumber: string;
  expirationDate: Date;
  receivedDate: Date;
  supplierId: string;
  cost: number;
  status: 'available' | 'expired' | 'low_stock' | 'out_of_stock';
}

// Production Types
export interface ProductionPlan {
  id: string;
  recipeId: string;
  quantity: number;
  scheduledDate: Date;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  assignedBy: string;
  notes?: string;
  createdAt: Date;
}

// Distribution Types
export interface Distribution {
  id: string;
  productId: string;
  fromLocation: string;
  toLocation: string;
  quantity: number;
  scheduledDate: Date;
  deliveryDate?: Date;
  status: 'pending' | 'in_transit' | 'delivered' | 'cancelled';
  driverName?: string;
  notes?: string;
  createdAt: Date;
}

// Supplier Types
export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  products: string[];
  rating: number;
  status: 'active' | 'inactive';
  createdAt: Date;
}

// Purchase Order Types
export interface PurchaseOrder {
  id: string;
  supplierId: string;
  items: PurchaseOrderItem[];
  totalAmount: number;
  status: 'draft' | 'pending' | 'approved' | 'received' | 'cancelled';
  orderDate: Date;
  expectedDeliveryDate: Date;
  actualDeliveryDate?: Date;
  approvedBy?: string;
  notes?: string;
  requestedBy?: string;
  fromBranch?: string;
  toBranch?: string;
  createdAt: Date;
}

export interface PurchaseOrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// Alert Types
export interface Alert {
  id: string;
  type: 'low_stock' | 'expired' | 'expiring_soon' | 'missing_product' | 'delivery_delay';
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  isRead: boolean;
  createdAt: Date;
}

// Branch Types
export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  manager: string;
  status: 'active' | 'inactive';
  openingHours: {
    open: string;
    close: string;
  };
  createdAt: Date;
}

// Dashboard Analytics Types
export interface DashboardStats {
  totalProducts: number;
  totalInventoryValue: number;
  lowStockItems: number;
  expiredItems: number;
  expiringItems: number;
  totalSuppliers: number;
  pendingOrders: number;
  todayProduction: number;
  branches: {
    [key: string]: {
      inventoryValue: number;
      lowStockCount: number;
      expiredCount: number;
    };
  };
}