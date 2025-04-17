export interface CartItem {
  id: string;
  productId: string;
  skuId: string;
  quantity: number;
  selected: boolean;
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