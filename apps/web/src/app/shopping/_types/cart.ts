export interface Price {
  id: string;
  price: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  color?: string;
  size?: string;
  prices: Price[];
  product?: Product;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  skuId: string;
  quantity: number;
  selected: boolean;
  variant?: ProductVariant;
  createdAt: string;
  updatedAt: string;
}

export interface CartSession {
  id: string;
  items: CartItem[];
  user: {
    id: string;
    username: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}