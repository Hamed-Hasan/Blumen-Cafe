'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, 
  Recipe, 
  InventoryItem, 
  ProductionPlan, 
  Distribution,
  Supplier,
  PurchaseOrder,
  Alert,
  Branch,
  DashboardStats
} from '@/types';

interface DataContextType {
  products: Product[];
  recipes: Recipe[];
  inventory: InventoryItem[];
  productionPlans: ProductionPlan[];
  distributions: Distribution[];
  suppliers: Supplier[];
  purchaseOrders: PurchaseOrder[];
  alerts: Alert[];
  branches: Branch[];
  dashboardStats: DashboardStats;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateInventoryItem: (id: string, item: Partial<InventoryItem>) => void;
  addPurchaseOrder: (order: Omit<PurchaseOrder, 'id' | 'createdAt'>) => void;
  updatePurchaseOrder: (id: string, order: Partial<PurchaseOrder>) => void;
  addAlert: (alert: Omit<Alert, 'id' | 'createdAt'>) => void;
  markAlertAsRead: (id: string) => void;
  addProductionPlan: (plan: Omit<ProductionPlan, 'id' | 'createdAt'>) => void;
  updateProductionPlan: (id: string, plan: Partial<ProductionPlan>) => void;
  addDistribution: (distribution: Omit<Distribution, 'id' | 'createdAt'>) => void;
  updateDistribution: (id: string, distribution: Partial<Distribution>) => void;
  refreshData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [productionPlans, setProductionPlans] = useState<ProductionPlan[]>([]);
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalInventoryValue: 0,
    lowStockItems: 0,
    expiredItems: 0,
    expiringItems: 0,
    totalSuppliers: 0,
    pendingOrders: 0,
    todayProduction: 0,
    branches: {}
  });

  // Initialize mock data
  useEffect(() => {
    initializeMockData();
  }, []);

  // Update dashboard stats when data changes
  useEffect(() => {
    updateDashboardStats();
  }, [products, inventory, suppliers, purchaseOrders, productionPlans]);

  const initializeMockData = () => {
    // Comprehensive Mock Products
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Chicken Breast',
        category: 'Meat',
        unit: 'kg',
        cost: 25.50,
        minStock: 10,
        maxStock: 100,
        expirationDays: 3,
        description: 'Fresh chicken breast, premium quality',
        createdAt: new Date('2024-01-01')
      },
      {
        id: '2',
        name: 'Tomatoes',
        category: 'Vegetables',
        unit: 'kg',
        cost: 8.00,
        minStock: 5,
        maxStock: 50,
        expirationDays: 7,
        description: 'Fresh red tomatoes',
        createdAt: new Date('2024-01-01')
      },
      {
        id: '3',
        name: 'Onions',
        category: 'Vegetables',
        unit: 'kg',
        cost: 6.00,
        minStock: 8,
        maxStock: 60,
        expirationDays: 14,
        description: 'Yellow onions',
        createdAt: new Date('2024-01-01')
      },
      {
        id: '4',
        name: 'Basmati Rice',
        category: 'Grains',
        unit: 'kg',
        cost: 12.00,
        minStock: 20,
        maxStock: 200,
        expirationDays: 365,
        description: 'Premium basmati rice',
        createdAt: new Date('2024-01-01')
      },
      {
        id: '5',
        name: 'Extra Virgin Olive Oil',
        category: 'Oils',
        unit: 'L',
        cost: 35.00,
        minStock: 5,
        maxStock: 30,
        expirationDays: 730,
        description: 'Cold-pressed extra virgin olive oil',
        createdAt: new Date('2024-01-01')
      },
      {
        id: '6',
        name: 'Beef Tenderloin',
        category: 'Meat',
        unit: 'kg',
        cost: 45.00,
        minStock: 8,
        maxStock: 40,
        expirationDays: 2,
        description: 'Premium beef tenderloin',
        createdAt: new Date('2024-01-02')
      },
      {
        id: '7',
        name: 'Fresh Salmon',
        category: 'Meat',
        unit: 'kg',
        cost: 38.00,
        minStock: 6,
        maxStock: 25,
        expirationDays: 2,
        description: 'Atlantic salmon fillet',
        createdAt: new Date('2024-01-02')
      },
      {
        id: '8',
        name: 'Bell Peppers',
        category: 'Vegetables',
        unit: 'kg',
        cost: 12.00,
        minStock: 4,
        maxStock: 30,
        expirationDays: 10,
        description: 'Mixed color bell peppers',
        createdAt: new Date('2024-01-02')
      },
      {
        id: '9',
        name: 'Mushrooms',
        category: 'Vegetables',
        unit: 'kg',
        cost: 15.00,
        minStock: 3,
        maxStock: 20,
        expirationDays: 5,
        description: 'Fresh button mushrooms',
        createdAt: new Date('2024-01-02')
      },
      {
        id: '10',
        name: 'Mozzarella Cheese',
        category: 'Dairy',
        unit: 'kg',
        cost: 22.00,
        minStock: 5,
        maxStock: 25,
        expirationDays: 14,
        description: 'Fresh mozzarella cheese',
        createdAt: new Date('2024-01-03')
      },
      {
        id: '11',
        name: 'Heavy Cream',
        category: 'Dairy',
        unit: 'L',
        cost: 8.50,
        minStock: 10,
        maxStock: 50,
        expirationDays: 7,
        description: '35% fat heavy cream',
        createdAt: new Date('2024-01-03')
      },
      {
        id: '12',
        name: 'Pasta (Penne)',
        category: 'Grains',
        unit: 'kg',
        cost: 4.50,
        minStock: 15,
        maxStock: 100,
        expirationDays: 730,
        description: 'Italian penne pasta',
        createdAt: new Date('2024-01-03')
      },
      {
        id: '13',
        name: 'Garlic',
        category: 'Vegetables',
        unit: 'kg',
        cost: 18.00,
        minStock: 2,
        maxStock: 15,
        expirationDays: 30,
        description: 'Fresh garlic bulbs',
        createdAt: new Date('2024-01-03')
      },
      {
        id: '14',
        name: 'Black Pepper',
        category: 'Spices',
        unit: 'kg',
        cost: 85.00,
        minStock: 1,
        maxStock: 5,
        expirationDays: 1095,
        description: 'Ground black pepper',
        createdAt: new Date('2024-01-04')
      },
      {
        id: '15',
        name: 'Sea Salt',
        category: 'Spices',
        unit: 'kg',
        cost: 12.00,
        minStock: 2,
        maxStock: 10,
        expirationDays: 1825,
        description: 'Fine sea salt',
        createdAt: new Date('2024-01-04')
      }
    ];

    // Mock Suppliers
    const mockSuppliers: Supplier[] = [
      {
        id: '1',
        name: 'Al-Rashid Food Supply',
        contactPerson: 'Khalid Al-Rashid',
        email: 'khalid@alrashid.com',
        phone: '+966-11-234-5678',
        address: 'Industrial City, Riyadh 11564',
        products: ['1', '6', '7'],
        rating: 4.8,
        status: 'active',
        createdAt: new Date('2024-01-01')
      },
      {
        id: '2',
        name: 'Fresh Produce Co.',
        contactPerson: 'Amira Hassan',
        email: 'amira@freshproduce.com',
        phone: '+966-11-345-6789',
        address: 'Vegetable Market District, Riyadh 11432',
        products: ['2', '3', '8', '9', '13'],
        rating: 4.5,
        status: 'active',
        createdAt: new Date('2024-01-01')
      },
      {
        id: '3',
        name: 'Quality Grains Ltd.',
        contactPerson: 'Mohammed Al-Qureshi',
        email: 'mohammed@qualitygrains.com',
        phone: '+966-11-456-7890',
        address: 'Grain District, Riyadh 11223',
        products: ['4', '12'],
        rating: 4.7,
        status: 'active',
        createdAt: new Date('2024-01-01')
      },
      {
        id: '4',
        name: 'Premium Dairy Solutions',
        contactPerson: 'Fatima Al-Zahra',
        email: 'fatima@premiumdairy.com',
        phone: '+966-11-567-8901',
        address: 'Dairy Complex, Riyadh 11334',
        products: ['10', '11'],
        rating: 4.6,
        status: 'active',
        createdAt: new Date('2024-01-02')
      },
      {
        id: '5',
        name: 'Spice Masters Trading',
        contactPerson: 'Omar Al-Bahrani',
        email: 'omar@spicemasters.com',
        phone: '+966-11-678-9012',
        address: 'Spice Souk, Riyadh 11445',
        products: ['14', '15'],
        rating: 4.9,
        status: 'active',
        createdAt: new Date('2024-01-02')
      },
      {
        id: '6',
        name: 'Golden Oil Company',
        contactPerson: 'Nadia Al-Mansouri',
        email: 'nadia@goldenoil.com',
        phone: '+966-11-789-0123',
        address: 'Oil Refinery District, Riyadh 11556',
        products: ['5'],
        rating: 4.4,
        status: 'active',
        createdAt: new Date('2024-01-03')
      }
    ];

    // Mock Branches
    const mockBranches: Branch[] = [
      {
        id: '1',
        name: 'Olaya',
        address: 'Olaya Street, Al-Olaya District, Riyadh 11433',
        phone: '+966-11-111-1111',
        manager: 'Sarah Al-Zahra',
        status: 'active',
        openingHours: { open: '08:00', close: '23:00' },
        createdAt: new Date('2024-01-01')
      },
      {
        id: '2',
        name: 'Hamra',
        address: 'King Fahd Road, Hamra District, Riyadh 11564',
        phone: '+966-11-222-2222',
        manager: 'Omar Al-Farisi',
        status: 'active',
        openingHours: { open: '08:00', close: '23:00' },
        createdAt: new Date('2024-01-01')
      },
      {
        id: '3',
        name: 'Laban',
        address: 'Laban Street, Al-Laban District, Riyadh 11675',
        phone: '+966-11-333-3333',
        manager: 'Fatima Al-Nouri',
        status: 'active',
        openingHours: { open: '08:00', close: '23:00' },
        createdAt: new Date('2024-01-01')
      }
    ];

    // Comprehensive Mock Inventory
    const mockInventory: InventoryItem[] = [
      // Central Kitchen Inventory
      {
        id: '1',
        productId: '1',
        quantity: 45,
        location: 'Central Kitchen',
        batchNumber: 'CK-001-240115',
        expirationDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        receivedDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
        supplierId: '1',
        cost: 25.50,
        status: 'available'
      },
      {
        id: '2',
        productId: '4',
        quantity: 150,
        location: 'Central Kitchen',
        batchNumber: 'CK-004-240110',
        expirationDate: new Date(Date.now() + 300 * 24 * 60 * 60 * 1000),
        receivedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        supplierId: '3',
        cost: 12.00,
        status: 'available'
      },
      {
        id: '3',
        productId: '5',
        quantity: 25,
        location: 'Central Kitchen',
        batchNumber: 'CK-005-240108',
        expirationDate: new Date(Date.now() + 700 * 24 * 60 * 60 * 1000),
        receivedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        supplierId: '6',
        cost: 35.00,
        status: 'available'
      },
      {
        id: '4',
        productId: '6',
        quantity: 32,
        location: 'Central Kitchen',
        batchNumber: 'CK-006-240116',
        expirationDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        receivedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        supplierId: '1',
        cost: 45.00,
        status: 'available'
      },
      {
        id: '5',
        productId: '10',
        quantity: 18,
        location: 'Central Kitchen',
        batchNumber: 'CK-010-240112',
        expirationDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        receivedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        supplierId: '4',
        cost: 22.00,
        status: 'available'
      },

      // Olaya Branch Inventory
      {
        id: '6',
        productId: '2',
        quantity: 8,
        location: 'Olaya',
        batchNumber: 'OL-002-240114',
        expirationDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        receivedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        supplierId: '2',
        cost: 8.00,
        status: 'low_stock'
      },
      {
        id: '7',
        productId: '3',
        quantity: 15,
        location: 'Olaya',
        batchNumber: 'OL-003-240113',
        expirationDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        receivedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        supplierId: '2',
        cost: 6.00,
        status: 'available'
      },
      {
        id: '8',
        productId: '4',
        quantity: 35,
        location: 'Olaya',
        batchNumber: 'OL-004-240111',
        expirationDate: new Date(Date.now() + 350 * 24 * 60 * 60 * 1000),
        receivedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        supplierId: '3',
        cost: 12.00,
        status: 'available'
      },
      {
        id: '9',
        productId: '12',
        quantity: 22,
        location: 'Olaya',
        batchNumber: 'OL-012-240109',
        expirationDate: new Date(Date.now() + 720 * 24 * 60 * 60 * 1000),
        receivedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        supplierId: '3',
        cost: 4.50,
        status: 'available'
      },

      // Hamra Branch Inventory
      {
        id: '10',
        productId: '3',
        quantity: 25,
        location: 'Hamra',
        batchNumber: 'HM-003-240113',
        expirationDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        receivedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        supplierId: '2',
        cost: 6.00,
        status: 'available'
      },
      {
        id: '11',
        productId: '8',
        quantity: 12,
        location: 'Hamra',
        batchNumber: 'HM-008-240115',
        expirationDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
        receivedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        supplierId: '2',
        cost: 12.00,
        status: 'available'
      },
      {
        id: '12',
        productId: '11',
        quantity: 6,
        location: 'Hamra',
        batchNumber: 'HM-011-240114',
        expirationDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        receivedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        supplierId: '4',
        cost: 8.50,
        status: 'low_stock'
      },
      {
        id: '13',
        productId: '9',
        quantity: 8,
        location: 'Hamra',
        batchNumber: 'HM-009-240116',
        expirationDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        receivedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        supplierId: '2',
        cost: 15.00,
        status: 'available'
      },

      // Laban Branch Inventory
      {
        id: '14',
        productId: '1',
        quantity: 0,
        location: 'Laban',
        batchNumber: 'LB-001-240112',
        expirationDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
        receivedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        supplierId: '1',
        cost: 25.50,
        status: 'expired'
      },
      {
        id: '15',
        productId: '7',
        quantity: 4,
        location: 'Laban',
        batchNumber: 'LB-007-240116',
        expirationDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        receivedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        supplierId: '1',
        cost: 38.00,
        status: 'low_stock'
      },
      {
        id: '16',
        productId: '13',
        quantity: 3,
        location: 'Laban',
        batchNumber: 'LB-013-240110',
        expirationDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        receivedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        supplierId: '2',
        cost: 18.00,
        status: 'low_stock'
      },
      {
        id: '17',
        productId: '14',
        quantity: 2,
        location: 'Laban',
        batchNumber: 'LB-014-240105',
        expirationDate: new Date(Date.now() + 1000 * 24 * 60 * 60 * 1000),
        receivedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        supplierId: '5',
        cost: 85.00,
        status: 'available'
      }
    ];

    // Mock Purchase Orders with varied statuses and types
    const mockPurchaseOrders: PurchaseOrder[] = [
      // Branch to Central Kitchen Orders
      {
        id: '1',
        supplierId: 'central-kitchen',
        items: [
          { productId: '1', quantity: 20, unitPrice: 25.50, totalPrice: 510.00 },
          { productId: '2', quantity: 15, unitPrice: 8.00, totalPrice: 120.00 }
        ],
        totalAmount: 630.00,
        status: 'pending',
        orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        expectedDeliveryDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        notes: 'Urgent order for weekend rush - need fresh chicken and tomatoes',
        requestedBy: 'Sarah Al-Zahra',
        fromBranch: 'Olaya',
        toBranch: 'Central Kitchen',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        supplierId: 'central-kitchen',
        items: [
          { productId: '7', quantity: 10, unitPrice: 38.00, totalPrice: 380.00 },
          { productId: '11', quantity: 8, unitPrice: 8.50, totalPrice: 68.00 }
        ],
        totalAmount: 448.00,
        status: 'approved',
        orderDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        expectedDeliveryDate: new Date(Date.now() + 12 * 60 * 60 * 1000),
        notes: 'For special salmon dish preparation',
        requestedBy: 'Fatima Al-Nouri',
        fromBranch: 'Laban',
        toBranch: 'Central Kitchen',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },

      // Central Kitchen to Branch Distributions
      {
        id: '3',
        supplierId: 'central-kitchen-distribution',
        items: [
          { productId: '4', quantity: 30, unitPrice: 12.00, totalPrice: 360.00 },
          { productId: '5', quantity: 5, unitPrice: 35.00, totalPrice: 175.00 }
        ],
        totalAmount: 535.00,
        status: 'approved',
        orderDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        expectedDeliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        notes: 'Weekly distribution to Hamra branch - rice and oil supplies',
        requestedBy: 'Ahmed Al-Rashid',
        fromBranch: 'Central Kitchen',
        toBranch: 'Hamra',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        id: '4',
        supplierId: 'central-kitchen-distribution',
        items: [
          { productId: '10', quantity: 8, unitPrice: 22.00, totalPrice: 176.00 },
          { productId: '12', quantity: 15, unitPrice: 4.50, totalPrice: 67.50 }
        ],
        totalAmount: 243.50,
        status: 'received',
        orderDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        expectedDeliveryDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        actualDeliveryDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        notes: 'Cheese and pasta for Italian menu items',
        requestedBy: 'Ahmed Al-Rashid',
        fromBranch: 'Central Kitchen',
        toBranch: 'Olaya',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },

      // External Supplier Orders
      {
        id: '5',
        supplierId: '1',
        items: [
          { productId: '1', quantity: 50, unitPrice: 25.50, totalPrice: 1275.00 },
          { productId: '6', quantity: 25, unitPrice: 45.00, totalPrice: 1125.00 }
        ],
        totalAmount: 2400.00,
        status: 'approved',
        orderDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        expectedDeliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        approvedBy: 'Ahmed Al-Rashid',
        notes: 'Weekly meat supply order - premium cuts',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        id: '6',
        supplierId: '2',
        items: [
          { productId: '2', quantity: 40, unitPrice: 8.00, totalPrice: 320.00 },
          { productId: '8', quantity: 20, unitPrice: 12.00, totalPrice: 240.00 },
          { productId: '9', quantity: 15, unitPrice: 15.00, totalPrice: 225.00 }
        ],
        totalAmount: 785.00,
        status: 'received',
        orderDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        expectedDeliveryDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        actualDeliveryDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        approvedBy: 'Ahmed Al-Rashid',
        notes: 'Fresh vegetables for all branches',
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
      },
      {
        id: '7',
        supplierId: '4',
        items: [
          { productId: '10', quantity: 30, unitPrice: 22.00, totalPrice: 660.00 },
          { productId: '11', quantity: 25, unitPrice: 8.50, totalPrice: 212.50 }
        ],
        totalAmount: 872.50,
        status: 'pending',
        orderDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        expectedDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        notes: 'Dairy products for upcoming catering events',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      }
    ];

    // Comprehensive Mock Alerts
    const mockAlerts: Alert[] = [
      {
        id: '1',
        type: 'low_stock',
        title: 'Low Stock Alert - Tomatoes',
        message: 'Tomatoes stock is critically low at Olaya branch (8 kg remaining, minimum required: 5 kg)',
        severity: 'medium',
        location: 'Olaya',
        isRead: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: '2',
        type: 'expired',
        title: 'Expired Product Alert',
        message: 'Chicken Breast (Batch: LB-001-240112) has expired at Laban branch. Immediate removal required.',
        severity: 'high',
        location: 'Laban',
        isRead: false,
        createdAt: new Date(Date.now() - 30 * 60 * 1000)
      },
      {
        id: '3',
        type: 'expiring_soon',
        title: 'Product Expiring Soon',
        message: 'Chicken Breast (Batch: CK-001-240115) will expire in 2 days at Central Kitchen',
        severity: 'medium',
        location: 'Central Kitchen',
        isRead: false,
        createdAt: new Date(Date.now() - 60 * 60 * 1000)
      },
      {
        id: '4',
        type: 'low_stock',
        title: 'Low Stock Alert - Heavy Cream',
        message: 'Heavy Cream stock is low at Hamra branch (6 L remaining, minimum required: 10 L)',
        severity: 'medium',
        location: 'Hamra',
        isRead: false,
        createdAt: new Date(Date.now() - 45 * 60 * 1000)
      },
      {
        id: '5',
        type: 'missing_product',
        title: 'New Order Created',
        message: 'New order from Olaya branch requires approval (Order #000001)',
        severity: 'medium',
        location: 'Central Kitchen',
        isRead: false,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: '6',
        type: 'expiring_soon',
        title: 'Salmon Expiring Tomorrow',
        message: 'Fresh Salmon (Batch: LB-007-240116) will expire tomorrow at Laban branch',
        severity: 'high',
        location: 'Laban',
        isRead: false,
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000)
      },
      {
        id: '7',
        type: 'low_stock',
        title: 'Critical Stock Level - Garlic',
        message: 'Garlic stock is critically low at Laban branch (3 kg remaining, minimum required: 2 kg)',
        severity: 'low',
        location: 'Laban',
        isRead: true,
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
      },
      {
        id: '8',
        type: 'delivery_delay',
        title: 'Delivery Delay Notification',
        message: 'Supplier delivery from Al-Rashid Food Supply delayed by 2 hours',
        severity: 'low',
        location: 'Central Kitchen',
        isRead: true,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
      },
      {
        id: '9',
        type: 'expiring_soon',
        title: 'Mushrooms Expiring Soon',
        message: 'Fresh Mushrooms (Batch: HM-009-240116) will expire in 3 days at Hamra branch',
        severity: 'medium',
        location: 'Hamra',
        isRead: false,
        createdAt: new Date(Date.now() - 90 * 60 * 1000)
      },
      {
        id: '10',
        type: 'missing_product',
        title: 'Distribution Completed',
        message: 'Distribution to Olaya branch has been marked as received (Order #000004)',
        severity: 'low',
        location: 'Olaya',
        isRead: true,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      }
    ];

    // Comprehensive Mock Recipes
    const mockRecipes: Recipe[] = [
      {
        id: '1',
        name: 'Grilled Chicken with Vegetables',
        description: 'Tender grilled chicken breast served with sautéed bell peppers and onions',
        ingredients: [
          { productId: '1', quantity: 0.2, unit: 'kg' },
          { productId: '8', quantity: 0.1, unit: 'kg' },
          { productId: '3', quantity: 0.05, unit: 'kg' },
          { productId: '5', quantity: 0.02, unit: 'L' }
        ],
        preparationTime: 15,
        cookingTime: 25,
        servings: 1,
        instructions: [
          'Season chicken breast with salt and pepper',
          'Heat olive oil in a grill pan',
          'Grill chicken for 6-8 minutes per side',
          'Sauté vegetables until tender',
          'Serve hot with vegetables on the side'
        ],
        createdAt: new Date('2024-01-05')
      },
      {
        id: '2',
        name: 'Creamy Mushroom Pasta',
        description: 'Rich and creamy pasta with fresh mushrooms and herbs',
        ingredients: [
          { productId: '12', quantity: 0.1, unit: 'kg' },
          { productId: '9', quantity: 0.15, unit: 'kg' },
          { productId: '11', quantity: 0.1, unit: 'L' },
          { productId: '13', quantity: 0.01, unit: 'kg' }
        ],
        preparationTime: 10,
        cookingTime: 20,
        servings: 1,
        instructions: [
          'Cook pasta according to package instructions',
          'Sauté sliced mushrooms with garlic',
          'Add heavy cream and simmer',
          'Toss with cooked pasta',
          'Season and serve immediately'
        ],
        createdAt: new Date('2024-01-06')
      },
      {
        id: '3',
        name: 'Mediterranean Salmon',
        description: 'Fresh salmon fillet with Mediterranean herbs and olive oil',
        ingredients: [
          { productId: '7', quantity: 0.25, unit: 'kg' },
          { productId: '5', quantity: 0.03, unit: 'L' },
          { productId: '2', quantity: 0.1, unit: 'kg' },
          { productId: '13', quantity: 0.005, unit: 'kg' }
        ],
        preparationTime: 20,
        cookingTime: 15,
        servings: 1,
        instructions: [
          'Marinate salmon with olive oil and herbs',
          'Preheat oven to 200°C',
          'Bake salmon for 12-15 minutes',
          'Prepare tomato garnish',
          'Serve with fresh vegetables'
        ],
        createdAt: new Date('2024-01-07')
      },
      {
        id: '4',
        name: 'Beef Tenderloin Steak',
        description: 'Premium beef tenderloin cooked to perfection',
        ingredients: [
          { productId: '6', quantity: 0.3, unit: 'kg' },
          { productId: '14', quantity: 0.002, unit: 'kg' },
          { productId: '15', quantity: 0.003, unit: 'kg' },
          { productId: '5', quantity: 0.02, unit: 'L' }
        ],
        preparationTime: 10,
        cookingTime: 12,
        servings: 1,
        instructions: [
          'Season beef with salt and pepper',
          'Heat oil in a heavy skillet',
          'Sear beef for 3-4 minutes per side',
          'Rest meat for 5 minutes',
          'Slice and serve'
        ],
        createdAt: new Date('2024-01-08')
      },
      {
        id: '5',
        name: 'Margherita Pizza',
        description: 'Classic Italian pizza with fresh mozzarella and tomatoes',
        ingredients: [
          { productId: '10', quantity: 0.15, unit: 'kg' },
          { productId: '2', quantity: 0.2, unit: 'kg' },
          { productId: '5', quantity: 0.02, unit: 'L' },
          { productId: '13', quantity: 0.005, unit: 'kg' }
        ],
        preparationTime: 30,
        cookingTime: 12,
        servings: 2,
        instructions: [
          'Prepare pizza dough',
          'Spread tomato sauce',
          'Add fresh mozzarella',
          'Bake at 250°C for 10-12 minutes',
          'Garnish with fresh basil'
        ],
        createdAt: new Date('2024-01-09')
      },
      {
        id: '6',
        name: 'Vegetable Stir Fry',
        description: 'Fresh mixed vegetables stir-fried with aromatic spices',
        ingredients: [
          { productId: '8', quantity: 0.15, unit: 'kg' },
          { productId: '9', quantity: 0.1, unit: 'kg' },
          { productId: '3', quantity: 0.08, unit: 'kg' },
          { productId: '13', quantity: 0.01, unit: 'kg' },
          { productId: '5', quantity: 0.03, unit: 'L' }
        ],
        preparationTime: 15,
        cookingTime: 8,
        servings: 2,
        instructions: [
          'Cut all vegetables into uniform pieces',
          'Heat oil in a wok',
          'Stir-fry vegetables in order of cooking time',
          'Season with garlic and spices',
          'Serve immediately while hot'
        ],
        createdAt: new Date('2024-01-10')
      }
    ];

    // Comprehensive Mock Production Plans
    const mockProductionPlans: ProductionPlan[] = [
      // Today's Production
      {
        id: '1',
        recipeId: '1',
        quantity: 50,
        scheduledDate: new Date(),
        status: 'in_progress',
        assignedBy: 'Ahmed Al-Rashid',
        notes: 'For lunch service today - high demand expected',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: '2',
        recipeId: '2',
        quantity: 30,
        scheduledDate: new Date(),
        status: 'planned',
        assignedBy: 'Ahmed Al-Rashid',
        notes: 'Evening special menu item',
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
      },
      {
        id: '3',
        recipeId: '5',
        quantity: 25,
        scheduledDate: new Date(),
        status: 'completed',
        assignedBy: 'Ahmed Al-Rashid',
        notes: 'Completed for lunch rush',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
      },

      // Tomorrow's Production
      {
        id: '4',
        recipeId: '3',
        quantity: 40,
        scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        status: 'planned',
        assignedBy: 'Ahmed Al-Rashid',
        notes: 'Special salmon dish for weekend',
        createdAt: new Date(Date.now() - 30 * 60 * 1000)
      },
      {
        id: '5',
        recipeId: '4',
        quantity: 20,
        scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        status: 'planned',
        assignedBy: 'Ahmed Al-Rashid',
        notes: 'Premium beef for dinner service',
        createdAt: new Date(Date.now() - 45 * 60 * 1000)
      },
      {
        id: '6',
        recipeId: '6',
        quantity: 35,
        scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        status: 'planned',
        assignedBy: 'Ahmed Al-Rashid',
        notes: 'Vegetarian option for health-conscious customers',
        createdAt: new Date(Date.now() - 20 * 60 * 1000)
      },

      // Day After Tomorrow
      {
        id: '7',
        recipeId: '1',
        quantity: 60,
        scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        status: 'planned',
        assignedBy: 'Ahmed Al-Rashid',
        notes: 'Weekend preparation - increased quantity',
        createdAt: new Date(Date.now() - 10 * 60 * 1000)
      },
      {
        id: '8',
        recipeId: '5',
        quantity: 45,
        scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        status: 'planned',
        assignedBy: 'Ahmed Al-Rashid',
        notes: 'Weekend pizza special',
        createdAt: new Date(Date.now() - 5 * 60 * 1000)
      },

      // Past Production (Yesterday)
      {
        id: '9',
        recipeId: '2',
        quantity: 25,
        scheduledDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
        status: 'completed',
        assignedBy: 'Ahmed Al-Rashid',
        notes: 'Successfully completed yesterday',
        createdAt: new Date(Date.now() - 25 * 60 * 60 * 1000)
      },
      {
        id: '10',
        recipeId: '3',
        quantity: 15,
        scheduledDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
        status: 'cancelled',
        assignedBy: 'Ahmed Al-Rashid',
        notes: 'Cancelled due to salmon delivery delay',
        createdAt: new Date(Date.now() - 26 * 60 * 60 * 1000)
      },

      // Next Week Planning
      {
        id: '11',
        recipeId: '4',
        quantity: 30,
        scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: 'planned',
        assignedBy: 'Ahmed Al-Rashid',
        notes: 'Next week special event preparation',
        createdAt: new Date(Date.now() - 2 * 60 * 1000)
      },
      {
        id: '12',
        recipeId: '6',
        quantity: 50,
        scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: 'planned',
        assignedBy: 'Ahmed Al-Rashid',
        notes: 'Healthy menu promotion week',
        createdAt: new Date(Date.now() - 1 * 60 * 1000)
      }
    ];

    // Comprehensive Mock Distributions
    const mockDistributions: Distribution[] = [
      // Today's Distributions
      {
        id: '1',
        productId: '1',
        fromLocation: 'Central Kitchen',
        toLocation: 'Olaya',
        quantity: 15,
        scheduledDate: new Date(),
        status: 'in_transit',
        driverName: 'Mohammed Al-Fahad',
        notes: 'Urgent delivery for lunch service',
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000)
      },
      {
        id: '2',
        productId: '4',
        fromLocation: 'Central Kitchen',
        toLocation: 'Hamra',
        quantity: 25,
        scheduledDate: new Date(),
        deliveryDate: new Date(Date.now() - 30 * 60 * 1000),
        status: 'delivered',
        driverName: 'Ali Al-Mansouri',
        notes: 'Rice delivery completed successfully',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
      },
      {
        id: '3',
        productId: '10',
        fromLocation: 'Central Kitchen',
        toLocation: 'Laban',
        quantity: 8,
        scheduledDate: new Date(),
        status: 'pending',
        driverName: 'Hassan Al-Qureshi',
        notes: 'Cheese delivery for pizza preparation',
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
      },

      // Tomorrow's Scheduled Distributions
      {
        id: '4',
        productId: '7',
        fromLocation: 'Central Kitchen',
        toLocation: 'Olaya',
        quantity: 12,
        scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        status: 'pending',
        driverName: 'Omar Al-Zahra',
        notes: 'Fresh salmon for weekend special',
        createdAt: new Date(Date.now() - 30 * 60 * 1000)
      },
      {
        id: '5',
        productId: '6',
        fromLocation: 'Central Kitchen',
        toLocation: 'Hamra',
        quantity: 10,
        scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        status: 'pending',
        driverName: 'Khalid Al-Rashid',
        notes: 'Premium beef for dinner service',
        createdAt: new Date(Date.now() - 45 * 60 * 1000)
      },
      {
        id: '6',
        productId: '8',
        fromLocation: 'Central Kitchen',
        toLocation: 'Laban',
        quantity: 18,
        scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        status: 'pending',
        driverName: 'Ahmed Al-Bahrani',
        notes: 'Bell peppers for vegetable dishes',
        createdAt: new Date(Date.now() - 20 * 60 * 1000)
      },

      // Day After Tomorrow
      {
        id: '7',
        productId: '2',
        fromLocation: 'Central Kitchen',
        toLocation: 'Olaya',
        quantity: 20,
        scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        status: 'pending',
        driverName: 'Nasser Al-Fahad',
        notes: 'Fresh tomatoes for weekend rush',
        createdAt: new Date(Date.now() - 10 * 60 * 1000)
      },
      {
        id: '8',
        productId: '12',
        fromLocation: 'Central Kitchen',
        toLocation: 'Hamra',
        quantity: 30,
        scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        status: 'pending',
        driverName: 'Saeed Al-Mansouri',
        notes: 'Pasta for Italian menu items',
        createdAt: new Date(Date.now() - 15 * 60 * 1000)
      },

      // Yesterday's Completed Distributions
      {
        id: '9',
        productId: '3',
        fromLocation: 'Central Kitchen',
        toLocation: 'Olaya',
        quantity: 12,
        scheduledDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
        deliveryDate: new Date(Date.now() - 22 * 60 * 60 * 1000),
        status: 'delivered',
        driverName: 'Fahad Al-Qureshi',
        notes: 'Onions delivered successfully',
        createdAt: new Date(Date.now() - 25 * 60 * 60 * 1000)
      },
      {
        id: '10',
        productId: '11',
        fromLocation: 'Central Kitchen',
        toLocation: 'Laban',
        quantity: 6,
        scheduledDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
        deliveryDate: new Date(Date.now() - 20 * 60 * 60 * 1000),
        status: 'delivered',
        driverName: 'Majid Al-Zahra',
        notes: 'Heavy cream for dessert preparation',
        createdAt: new Date(Date.now() - 26 * 60 * 60 * 1000)
      },

      // Cancelled Distribution
      {
        id: '11',
        productId: '9',
        fromLocation: 'Central Kitchen',
        toLocation: 'Hamra',
        quantity: 8,
        scheduledDate: new Date(Date.now() - 12 * 60 * 60 * 1000),
        status: 'cancelled',
        driverName: 'Tariq Al-Mansouri',
        notes: 'Cancelled due to vehicle breakdown',
        createdAt: new Date(Date.now() - 14 * 60 * 60 * 1000)
      },

      // Next Week Distributions
      {
        id: '12',
        productId: '5',
        fromLocation: 'Central Kitchen',
        toLocation: 'Olaya',
        quantity: 5,
        scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: 'pending',
        driverName: 'Waleed Al-Fahad',
        notes: 'Olive oil for next week menu',
        createdAt: new Date(Date.now() - 5 * 60 * 1000)
      },
      {
        id: '13',
        productId: '13',
        fromLocation: 'Central Kitchen',
        toLocation: 'Hamra',
        quantity: 3,
        scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: 'pending',
        driverName: 'Rashid Al-Qureshi',
        notes: 'Garlic for seasoning preparations',
        createdAt: new Date(Date.now() - 3 * 60 * 1000)
      },
      {
        id: '14',
        productId: '14',
        fromLocation: 'Central Kitchen',
        toLocation: 'Laban',
        quantity: 1,
        scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: 'pending',
        driverName: 'Youssef Al-Bahrani',
        notes: 'Black pepper spice delivery',
        createdAt: new Date(Date.now() - 2 * 60 * 1000)
      },

      // Emergency Distribution
      {
        id: '15',
        productId: '1',
        fromLocation: 'Central Kitchen',
        toLocation: 'Laban',
        quantity: 10,
        scheduledDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
        status: 'pending',
        driverName: 'Ibrahim Al-Mansouri',
        notes: 'Emergency chicken delivery - expired stock replacement',
        createdAt: new Date(Date.now() - 30 * 60 * 1000)
      }
    ];

    setProducts(mockProducts);
    setSuppliers(mockSuppliers);
    setBranches(mockBranches);
    setInventory(mockInventory);
    setPurchaseOrders(mockPurchaseOrders);
    setAlerts(mockAlerts);
    setRecipes(mockRecipes);
    setProductionPlans(mockProductionPlans);
    setDistributions(mockDistributions);
  };

  const updateDashboardStats = () => {
    const stats: DashboardStats = {
      totalProducts: products.length,
      totalInventoryValue: inventory.reduce((sum, item) => sum + (item.quantity * item.cost), 0),
      lowStockItems: inventory.filter(item => item.status === 'low_stock').length,
      expiredItems: inventory.filter(item => item.status === 'expired').length,
      expiringItems: inventory.filter(item => {
        const daysUntilExpiry = Math.ceil((item.expirationDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry <= 3 && daysUntilExpiry > 0;
      }).length,
      totalSuppliers: suppliers.length,
      pendingOrders: purchaseOrders.filter(order => order.status === 'pending').length,
      todayProduction: productionPlans.filter(plan => 
        plan.scheduledDate.toDateString() === new Date().toDateString()
      ).length,
      branches: branches.reduce((acc, branch) => {
        const branchInventory = inventory.filter(item => item.location === branch.name);
        acc[branch.name] = {
          inventoryValue: branchInventory.reduce((sum, item) => sum + (item.quantity * item.cost), 0),
          lowStockCount: branchInventory.filter(item => item.status === 'low_stock').length,
          expiredCount: branchInventory.filter(item => item.status === 'expired').length
        };
        return acc;
      }, {} as DashboardStats['branches'])
    };
    setDashboardStats(stats);
  };

  const addProduct = (product: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, product: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...product } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const addInventoryItem = (item: Omit<InventoryItem, 'id'>) => {
    const newItem: InventoryItem = {
      ...item,
      id: Date.now().toString()
    };
    setInventory(prev => [...prev, newItem]);
  };

  const updateInventoryItem = (id: string, item: Partial<InventoryItem>) => {
    setInventory(prev => prev.map(i => i.id === id ? { ...i, ...item } : i));
  };

  const addPurchaseOrder = (order: Omit<PurchaseOrder, 'id' | 'createdAt'>) => {
    const newOrder: PurchaseOrder = {
      ...order,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setPurchaseOrders(prev => [...prev, newOrder]);
    
    // Create alert for new order/distribution
    const alertType = order.supplierId === 'central-kitchen-distribution' ? 'Distribution' : 'Order';
    const alertLocation = order.supplierId === 'central-kitchen-distribution' 
      ? order.toBranch || 'Central Kitchen'
      : order.fromBranch || 'Central Kitchen';
    
    addAlert({
      type: 'missing_product',
      title: `New ${alertType} Created`,
      message: order.supplierId === 'central-kitchen-distribution'
        ? `New distribution to ${order.toBranch} has been created`
        : `New order from ${order.fromBranch} requires approval`,
      severity: 'medium',
      location: alertLocation,
      isRead: false
    });
  };

  const updatePurchaseOrder = (id: string, order: Partial<PurchaseOrder>) => {
    setPurchaseOrders(prev => prev.map(o => o.id === id ? { ...o, ...order } : o));
  };

  const addAlert = (alert: Omit<Alert, 'id' | 'createdAt'>) => {
    const newAlert: Alert = {
      ...alert,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setAlerts(prev => [...prev, newAlert]);
  };

  const markAlertAsRead = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, isRead: true } : a));
  };

  const addProductionPlan = (plan: Omit<ProductionPlan, 'id' | 'createdAt'>) => {
    const newPlan: ProductionPlan = {
      ...plan,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setProductionPlans(prev => [...prev, newPlan]);
  };

  const updateProductionPlan = (id: string, plan: Partial<ProductionPlan>) => {
    setProductionPlans(prev => prev.map(p => p.id === id ? { ...p, ...plan } : p));
  };

  const addDistribution = (distribution: Omit<Distribution, 'id' | 'createdAt'>) => {
    const newDistribution: Distribution = {
      ...distribution,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setDistributions(prev => [...prev, newDistribution]);
  };

  const updateDistribution = (id: string, distribution: Partial<Distribution>) => {
    setDistributions(prev => prev.map(d => d.id === id ? { ...d, ...distribution } : d));
  };

  const refreshData = () => {
    updateDashboardStats();
  };

  return (
    <DataContext.Provider value={{
      products,
      recipes,
      inventory,
      productionPlans,
      distributions,
      suppliers,
      purchaseOrders,
      alerts,
      branches,
      dashboardStats,
      addProduct,
      updateProduct,
      deleteProduct,
      addInventoryItem,
      updateInventoryItem,
      addPurchaseOrder,
      updatePurchaseOrder,
      addAlert,
      markAlertAsRead,
      addProductionPlan,
      updateProductionPlan,
      addDistribution,
      updateDistribution,
      refreshData
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};