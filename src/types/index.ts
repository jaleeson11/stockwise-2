export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  category?: Category;
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  attributes: Record<string, string>;
  createdAt: string;
  updatedAt: string;
  product?: Product;
  inventory?: Inventory;
}

export interface Category {
  id: string;
  name: string;
  parentId?: string | null;
  parent?: Category;
  children?: Category[];
}

export interface Inventory {
  id: string;
  variantId: string;
  quantity: number;
  lowStockThreshold: number;
  updatedAt: string;
  variant?: ProductVariant;
}

export interface PlatformConnection {
  id: string;
  platformType: 'shopify' | 'amazon' | 'ebay';
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'staff';
} 