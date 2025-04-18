import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };

export interface GraphQLResponse<T = any> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{
      line: number;
      column: number;
    }>;
    path?: Array<string | number>;
    extensions?: Record<string, any>;
  }>;
}

const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  JSONObject: { input: any; output: any; }
};

export type App = {
  message: Scalars['String']['output'];
};

export type Brand = {
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  products: Array<Product>;
  updatedAt: Scalars['DateTime']['output'];
};

export type BrandInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export enum Carrier {
  Aramex = 'ARAMEX',
  Dhl = 'DHL',
  Fedex = 'FEDEX',
  LocalCourier = 'LOCAL_COURIER',
  Ups = 'UPS',
  Usps = 'USPS'
}

export type CartItem = {
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  productId: Scalars['String']['output'];
  quantity: Scalars['Int']['output'];
  selected: Scalars['Boolean']['output'];
  session: CartSession;
  skuId: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type CartItemInput = {
  productId: Scalars['String']['input'];
  quantity: Scalars['Int']['input'];
  skuId: Scalars['String']['input'];
};

export type CartSession = {
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  items: Array<CartItem>;
  updatedAt: Scalars['DateTime']['output'];
  user: User;
};

export type Category = {
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  parent?: Maybe<Category>;
  products: Array<Product>;
  subcategories: Array<Category>;
  updatedAt: Scalars['DateTime']['output'];
};

export type CategoryInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type CreateCartInput = {
  items: Array<CartItemInput>;
  userId: Scalars['String']['input'];
};

export type CreateOrderInput = {
  items: Array<OrderItemInput>;
  /** User Id */
  userId: Scalars['String']['input'];
};

export type CreatePaymentInput = {
  /** Order ID */
  orderId: Scalars['String']['input'];
};

export type CreateProductInput = {
  brandId: Scalars['String']['input'];
  description?: InputMaybe<Scalars['JSONObject']['input']>;
  name: Scalars['String']['input'];
  price: Scalars['Float']['input'];
};

export type CreateShipmentInput = {
  /** Example field (placeholder) */
  exampleField: Scalars['Int']['input'];
};

export type CreateUserInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type CreateUserPreferenceInput = {
  receiveEmails?: InputMaybe<Scalars['Boolean']['input']>;
  receiveNotifications?: InputMaybe<Scalars['Boolean']['input']>;
  userId: Scalars['String']['input'];
};

export type FilterOrderInput = {
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  page?: Scalars['Float']['input'];
  pageSize?: Scalars['Float']['input'];
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type ImageInput = {
  position: Scalars['Float']['input'];
  url: Scalars['String']['input'];
};

export type Inventory = {
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  quantity: Scalars['Float']['output'];
  updatedAt: Scalars['DateTime']['output'];
  variant: ProductVariant;
  warehouse: Warehouse;
};

export type InventoryInput = {
  quantity: Scalars['Float']['input'];
  warehouse: WarehouseInput;
};

export type InventoryRecord = {
  changeQuantity: Scalars['Int']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  order?: Maybe<Order>;
  reason?: Maybe<Scalars['String']['output']>;
  type: InventoryType;
  updatedAt: Scalars['DateTime']['output'];
  variant: ProductVariant;
};

export type InventoryRecordInput = {
  changeQuantity: Scalars['Float']['input'];
  type: Scalars['String']['input'];
};

export enum InventoryType {
  Adjustment = 'ADJUSTMENT',
  Purchase = 'PURCHASE',
  Return = 'RETURN',
  Sale = 'SALE'
}

export type LoginInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  oauthToken?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  type: Scalars['String']['input'];
};

export type Mutation = {
  bulkIndexProducts: Scalars['Boolean']['output'];
  clearCart: CartSession;
  confirmPayment: Payment;
  createCart: CartSession;
  createOrder: Order;
  createPayment: Payment;
  createProduct: Product;
  createShipment: Shipment;
  createUser: User;
  createUserSettings: UserPreference;
  login: TokenOutput;
  logout: Scalars['Boolean']['output'];
  publishProduct: Product;
  refreshToken: TokenOutput;
  removeCart: CartSession;
  removePayment: Payment;
  removeShipment: Shipment;
  updateCart: CartSession;
  updatePayment: Payment;
  updateShipment: Shipment;
};


export type MutationClearCartArgs = {
  id: Scalars['String']['input'];
};


export type MutationConfirmPaymentArgs = {
  paymentId: Scalars['String']['input'];
  status: Scalars['String']['input'];
};


export type MutationCreateCartArgs = {
  createCartInput: CreateCartInput;
};


export type MutationCreateOrderArgs = {
  createOrderInput: CreateOrderInput;
};


export type MutationCreatePaymentArgs = {
  createPaymentInput: CreatePaymentInput;
};


export type MutationCreateProductArgs = {
  createProductInput: CreateProductInput;
};


export type MutationCreateShipmentArgs = {
  createShipmentInput: CreateShipmentInput;
};


export type MutationCreateUserArgs = {
  createUserInput: CreateUserInput;
};


export type MutationCreateUserSettingsArgs = {
  createUserPreferenceInput: CreateUserPreferenceInput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationPublishProductArgs = {
  publishProductInput: PublishProductInput;
};


export type MutationRefreshTokenArgs = {
  refreshToken: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};


export type MutationRemoveCartArgs = {
  id: Scalars['String']['input'];
};


export type MutationRemovePaymentArgs = {
  id: Scalars['Int']['input'];
};


export type MutationRemoveShipmentArgs = {
  id: Scalars['Int']['input'];
};


export type MutationUpdateCartArgs = {
  updateCartInput: UpdateCartInput;
};


export type MutationUpdatePaymentArgs = {
  updatePaymentInput: UpdatePaymentInput;
};


export type MutationUpdateShipmentArgs = {
  updateShipmentInput: UpdateShipmentInput;
};

export type Order = {
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  items?: Maybe<Array<OrderItem>>;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  payments?: Maybe<Array<Payment>>;
  shippingStatus: ShippingStatus;
  status: OrderStatus;
  totalPrice: Scalars['Float']['output'];
  updatedAt: Scalars['DateTime']['output'];
  user: User;
};

export type OrderItem = {
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  order: Order;
  /** The total price of the current quantity of products */
  price: Scalars['Float']['output'];
  quantity: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
  variant: ProductVariant;
};

export type OrderItemInput = {
  /** Quantity of the product(s) */
  quantity: Scalars['Int']['input'];
  /** Variant Ids */
  variantId: Scalars['String']['input'];
};

export enum OrderStatus {
  AwaitingShipment = 'AWAITING_SHIPMENT',
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  Paid = 'PAID',
  Pending = 'PENDING',
  Refunded = 'REFUNDED',
  Refunding = 'REFUNDING',
  Returned = 'RETURNED',
  Returning = 'RETURNING',
  Shipped = 'SHIPPED'
}

export type Payment = {
  amount: Scalars['Float']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  order: Order;
  paymentMethod: PaymentMethod;
  paymentTime?: Maybe<Scalars['DateTime']['output']>;
  status: PaymentStatus;
  updatedAt: Scalars['DateTime']['output'];
  url?: Maybe<Scalars['String']['output']>;
};

export enum PaymentMethod {
  BankTransfer = 'BANK_TRANSFER',
  CreditCard = 'CREDIT_CARD',
  Other = 'OTHER',
  Paypal = 'PAYPAL'
}

export enum PaymentStatus {
  Failed = 'FAILED',
  Paid = 'PAID',
  Pending = 'PENDING',
  Refunded = 'REFUNDED'
}

export type PriceInput = {
  price: Scalars['Float']['input'];
  validFrom: Scalars['DateTime']['input'];
  validTo: Scalars['DateTime']['input'];
};

export type Product = {
  brand?: Maybe<Brand>;
  category?: Maybe<Category>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['JSONObject']['output']>;
  id: Scalars['String']['output'];
  images: Array<ProductImage>;
  name: Scalars['String']['output'];
  reviews: Array<ProductReview>;
  updatedAt: Scalars['DateTime']['output'];
  variants: Array<ProductVariant>;
};

export type ProductImage = {
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  position?: Maybe<Scalars['Float']['output']>;
  product: Product;
  updatedAt: Scalars['DateTime']['output'];
  url: Scalars['String']['output'];
};

export type ProductPrice = {
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  price: Scalars['Float']['output'];
  updatedAt: Scalars['DateTime']['output'];
  validFrom?: Maybe<Scalars['DateTime']['output']>;
  validTo?: Maybe<Scalars['DateTime']['output']>;
  variant: ProductVariant;
};

export type ProductReview = {
  comment?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  product?: Maybe<Product>;
  rating: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
  user: User;
  variant?: Maybe<ProductVariant>;
};

export type ProductVariant = {
  color: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  inventories: Array<Inventory>;
  inventoryRecords: Array<InventoryRecord>;
  prices: Array<ProductPrice>;
  product: Product;
  reviews: Array<ProductReview>;
  size: Scalars['String']['output'];
  sku: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type PublishProductInput = {
  brand: BrandInput;
  category: CategoryInput;
  description?: InputMaybe<Scalars['JSONObject']['input']>;
  images: Array<ImageInput>;
  name: Scalars['String']['input'];
  variants: Array<VariantInput>;
};

export type Query = {
  cart: CartSession;
  me: User;
  myCart: CartSession;
  orders: Array<Order>;
  payment: Payment;
  payments: Array<Payment>;
  ping: App;
  product?: Maybe<Product>;
  products: Array<Product>;
  searchProducts: Array<Product>;
  shipment: Shipment;
  shipments: Array<Shipment>;
  suggestProductNames: Array<Scalars['String']['output']>;
  user?: Maybe<User>;
  users: Array<User>;
};


export type QueryCartArgs = {
  id: Scalars['String']['input'];
};


export type QueryOrdersArgs = {
  filterOrderInput: FilterOrderInput;
};


export type QueryPaymentArgs = {
  id: Scalars['Int']['input'];
};


export type QueryProductArgs = {
  id: Scalars['String']['input'];
};


export type QuerySearchProductsArgs = {
  keyword: Scalars['String']['input'];
};


export type QueryShipmentArgs = {
  id: Scalars['Int']['input'];
};


export type QuerySuggestProductNamesArgs = {
  input: Scalars['String']['input'];
};


export type QueryUserArgs = {
  id: Scalars['String']['input'];
};

export type Shipment = {
  carrier: Carrier;
  createdAt: Scalars['DateTime']['output'];
  estimatedDelivery?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['String']['output'];
  order: Order;
  shippedAt?: Maybe<Scalars['DateTime']['output']>;
  status: ShipmentStatus;
  trackingNumber?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export enum ShipmentStatus {
  Delivered = 'DELIVERED',
  Failed = 'FAILED',
  InTransit = 'IN_TRANSIT',
  Pending = 'PENDING',
  Returned = 'RETURNED',
  Shipped = 'SHIPPED'
}

export enum ShippingStatus {
  Delivered = 'DELIVERED',
  Pending = 'PENDING',
  Shipped = 'SHIPPED'
}

export type TokenOutput = {
  accessToken: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
};

export type UpdateCartInput = {
  id: Scalars['String']['input'];
  items?: InputMaybe<Array<CartItemInput>>;
};

export type UpdatePaymentInput = {
  id: Scalars['Int']['input'];
  /** Order ID */
  orderId?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateShipmentInput = {
  /** Example field (placeholder) */
  exampleField?: InputMaybe<Scalars['Int']['input']>;
  id: Scalars['Int']['input'];
};

export type User = {
  addresses?: Maybe<Array<UserAddress>>;
  cartSessions?: Maybe<Array<CartSession>>;
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  id: Scalars['String']['output'];
  orders?: Maybe<Array<Order>>;
  paymentMethods?: Maybe<Array<UserPaymentMethod>>;
  preference?: Maybe<UserPreference>;
  profile?: Maybe<UserProfile>;
  provider?: Maybe<Scalars['String']['output']>;
  providerId?: Maybe<Scalars['String']['output']>;
  reviews?: Maybe<Array<ProductReview>>;
  updatedAt: Scalars['DateTime']['output'];
  username: Scalars['String']['output'];
};

export type UserAddress = {
  addressLine1: Scalars['String']['output'];
  addressLine2?: Maybe<Scalars['String']['output']>;
  city: Scalars['String']['output'];
  country: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  isDefault: Scalars['Boolean']['output'];
  phone: Scalars['String']['output'];
  postalCode: Scalars['String']['output'];
  recipientName: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type UserPaymentMethod = {
  cardExpiry?: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  maskedCardNumber: Scalars['String']['output'];
  paymentType: Scalars['String']['output'];
  provider?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type UserPreference = {
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  receiveEmails: Scalars['Boolean']['output'];
  receiveNotifications: Scalars['Boolean']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type UserProfile = {
  avatarUrl?: Maybe<Scalars['String']['output']>;
  bio?: Maybe<Scalars['String']['output']>;
  birthDate?: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  displayName?: Maybe<Scalars['String']['output']>;
  gender?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type VariantInput = {
  color: Scalars['String']['input'];
  inventories?: InputMaybe<Array<InventoryInput>>;
  inventoryRecords?: InputMaybe<Array<InventoryRecordInput>>;
  prices?: InputMaybe<Array<PriceInput>>;
  size: Scalars['String']['input'];
  sku: Scalars['String']['input'];
};

export type Warehouse = {
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  inventories: Array<Inventory>;
  location: Scalars['String']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type WarehouseInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type GoogleLoginMutationVariables = Exact<{
  loginInput: LoginInput;
}>;


export type GoogleLoginMutation = { login: { accessToken: string, refreshToken: string } };

export type GetProductsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetProductsQuery = { products: Array<{ id: string, name: string, description?: any | null, images: Array<{ id: string, url: string, position?: number | null }>, brand?: { id: string, name: string } | null, category?: { id: string, name: string } | null, variants: Array<{ id: string, prices: Array<{ price: number }> }> }> };

export type SearchProductsQueryVariables = Exact<{
  keyword: Scalars['String']['input'];
}>;


export type SearchProductsQuery = { searchProducts: Array<{ id: string, name: string, description?: any | null, images: Array<{ id: string, url: string, position?: number | null }>, brand?: { id: string, name: string } | null, category?: { id: string, name: string } | null, variants: Array<{ id: string, size: string, sku: string, color: string, prices: Array<{ id: string, price: number, validFrom?: any | null, validTo?: any | null }>, inventories: Array<{ id: string, quantity: number, warehouse: { id: string, name: string, location: string } }>, inventoryRecords: Array<{ id: string, changeQuantity: number, type: InventoryType, reason?: string | null }>, reviews: Array<{ id: string, rating: number, comment?: string | null }> }>, reviews: Array<{ id: string, rating: number, comment?: string | null }> }> };

export type SuggestProductNamesQueryVariables = Exact<{
  input: Scalars['String']['input'];
}>;


export type SuggestProductNamesQuery = { suggestProductNames: Array<string> };

export type GetProductByIdQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetProductByIdQuery = { product?: { id: string, name: string, description?: any | null, brand?: { id: string, name: string } | null, category?: { id: string, name: string } | null, images: Array<{ id: string, url: string, position?: number | null }>, variants: Array<{ id: string, size: string, sku: string, color: string, inventories: Array<{ id: string, quantity: number, warehouse: { id: string, name: string } }>, inventoryRecords: Array<{ id: string, type: InventoryType, changeQuantity: number }>, prices: Array<{ id: string, price: number, validFrom?: any | null, validTo?: any | null }>, reviews: Array<{ id: string, rating: number, comment?: string | null, user: { id: string, username: string } }> }>, reviews: Array<{ id: string, rating: number, comment?: string | null }> } | null };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { me: { id: string, email: string, profile?: { avatarUrl?: string | null, displayName?: string | null } | null } };


export const GoogleLoginDocument = gql`
    mutation GoogleLogin($loginInput: LoginInput!) {
  login(input: $loginInput) {
    accessToken
    refreshToken
  }
}
    `;
export type GoogleLoginMutationFn = Apollo.MutationFunction<GoogleLoginMutation, GoogleLoginMutationVariables>;

/**
 * __useGoogleLoginMutation__
 *
 * To run a mutation, you first call `useGoogleLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGoogleLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [googleLoginMutation, { data, loading, error }] = useGoogleLoginMutation({
 *   variables: {
 *      loginInput: // value for 'loginInput'
 *   },
 * });
 */
export function useGoogleLoginMutation(baseOptions?: Apollo.MutationHookOptions<GoogleLoginMutation, GoogleLoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GoogleLoginMutation, GoogleLoginMutationVariables>(GoogleLoginDocument, options);
      }
export type GoogleLoginMutationHookResult = ReturnType<typeof useGoogleLoginMutation>;
export type GoogleLoginMutationResult = Apollo.MutationResult<GoogleLoginMutation>;
export type GoogleLoginMutationOptions = Apollo.BaseMutationOptions<GoogleLoginMutation, GoogleLoginMutationVariables>;
export const GetProductsDocument = gql`
    query GetProducts {
  products {
    id
    name
    description
    images {
      id
      url
      position
    }
    brand {
      id
      name
    }
    category {
      id
      name
    }
    variants {
      id
      prices {
        price
      }
    }
  }
}
    `;

/**
 * __useGetProductsQuery__
 *
 * To run a query within a React component, call `useGetProductsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProductsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProductsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetProductsQuery(baseOptions?: Apollo.QueryHookOptions<GetProductsQuery, GetProductsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProductsQuery, GetProductsQueryVariables>(GetProductsDocument, options);
      }
export function useGetProductsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProductsQuery, GetProductsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProductsQuery, GetProductsQueryVariables>(GetProductsDocument, options);
        }
export function useGetProductsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetProductsQuery, GetProductsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetProductsQuery, GetProductsQueryVariables>(GetProductsDocument, options);
        }
export type GetProductsQueryHookResult = ReturnType<typeof useGetProductsQuery>;
export type GetProductsLazyQueryHookResult = ReturnType<typeof useGetProductsLazyQuery>;
export type GetProductsSuspenseQueryHookResult = ReturnType<typeof useGetProductsSuspenseQuery>;
export type GetProductsQueryResult = Apollo.QueryResult<GetProductsQuery, GetProductsQueryVariables>;
export const SearchProductsDocument = gql`
    query SearchProducts($keyword: String!) {
  searchProducts(keyword: $keyword) {
    id
    name
    description
    images {
      id
      url
      position
    }
    brand {
      id
      name
    }
    category {
      id
      name
    }
    variants {
      id
      size
      sku
      color
      prices {
        id
        price
        validFrom
        validTo
      }
      inventories {
        id
        quantity
        warehouse {
          id
          name
          location
        }
      }
      inventoryRecords {
        id
        changeQuantity
        type
        reason
      }
      reviews {
        id
        rating
        comment
      }
    }
    reviews {
      id
      rating
      comment
    }
  }
}
    `;

/**
 * __useSearchProductsQuery__
 *
 * To run a query within a React component, call `useSearchProductsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchProductsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchProductsQuery({
 *   variables: {
 *      keyword: // value for 'keyword'
 *   },
 * });
 */
export function useSearchProductsQuery(baseOptions: Apollo.QueryHookOptions<SearchProductsQuery, SearchProductsQueryVariables> & ({ variables: SearchProductsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchProductsQuery, SearchProductsQueryVariables>(SearchProductsDocument, options);
      }
export function useSearchProductsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchProductsQuery, SearchProductsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchProductsQuery, SearchProductsQueryVariables>(SearchProductsDocument, options);
        }
export function useSearchProductsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SearchProductsQuery, SearchProductsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SearchProductsQuery, SearchProductsQueryVariables>(SearchProductsDocument, options);
        }
export type SearchProductsQueryHookResult = ReturnType<typeof useSearchProductsQuery>;
export type SearchProductsLazyQueryHookResult = ReturnType<typeof useSearchProductsLazyQuery>;
export type SearchProductsSuspenseQueryHookResult = ReturnType<typeof useSearchProductsSuspenseQuery>;
export type SearchProductsQueryResult = Apollo.QueryResult<SearchProductsQuery, SearchProductsQueryVariables>;
export const SuggestProductNamesDocument = gql`
    query SuggestProductNames($input: String!) {
  suggestProductNames(input: $input)
}
    `;

/**
 * __useSuggestProductNamesQuery__
 *
 * To run a query within a React component, call `useSuggestProductNamesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSuggestProductNamesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSuggestProductNamesQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSuggestProductNamesQuery(baseOptions: Apollo.QueryHookOptions<SuggestProductNamesQuery, SuggestProductNamesQueryVariables> & ({ variables: SuggestProductNamesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SuggestProductNamesQuery, SuggestProductNamesQueryVariables>(SuggestProductNamesDocument, options);
      }
export function useSuggestProductNamesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SuggestProductNamesQuery, SuggestProductNamesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SuggestProductNamesQuery, SuggestProductNamesQueryVariables>(SuggestProductNamesDocument, options);
        }
export function useSuggestProductNamesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SuggestProductNamesQuery, SuggestProductNamesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SuggestProductNamesQuery, SuggestProductNamesQueryVariables>(SuggestProductNamesDocument, options);
        }
export type SuggestProductNamesQueryHookResult = ReturnType<typeof useSuggestProductNamesQuery>;
export type SuggestProductNamesLazyQueryHookResult = ReturnType<typeof useSuggestProductNamesLazyQuery>;
export type SuggestProductNamesSuspenseQueryHookResult = ReturnType<typeof useSuggestProductNamesSuspenseQuery>;
export type SuggestProductNamesQueryResult = Apollo.QueryResult<SuggestProductNamesQuery, SuggestProductNamesQueryVariables>;
export const GetProductByIdDocument = gql`
    query GetProductById($id: String!) {
  product(id: $id) {
    id
    name
    description
    brand {
      id
      name
    }
    category {
      id
      name
    }
    images {
      id
      url
      position
    }
    variants {
      id
      inventories {
        id
        quantity
        warehouse {
          id
          name
        }
      }
      inventoryRecords {
        id
        type
        changeQuantity
      }
      size
      sku
      color
      prices {
        id
        price
        validFrom
        validTo
      }
      reviews {
        id
        rating
        comment
        user {
          id
          username
        }
      }
    }
    reviews {
      id
      rating
      comment
    }
  }
}
    `;

/**
 * __useGetProductByIdQuery__
 *
 * To run a query within a React component, call `useGetProductByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProductByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProductByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetProductByIdQuery(baseOptions: Apollo.QueryHookOptions<GetProductByIdQuery, GetProductByIdQueryVariables> & ({ variables: GetProductByIdQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProductByIdQuery, GetProductByIdQueryVariables>(GetProductByIdDocument, options);
      }
export function useGetProductByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProductByIdQuery, GetProductByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProductByIdQuery, GetProductByIdQueryVariables>(GetProductByIdDocument, options);
        }
export function useGetProductByIdSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetProductByIdQuery, GetProductByIdQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetProductByIdQuery, GetProductByIdQueryVariables>(GetProductByIdDocument, options);
        }
export type GetProductByIdQueryHookResult = ReturnType<typeof useGetProductByIdQuery>;
export type GetProductByIdLazyQueryHookResult = ReturnType<typeof useGetProductByIdLazyQuery>;
export type GetProductByIdSuspenseQueryHookResult = ReturnType<typeof useGetProductByIdSuspenseQuery>;
export type GetProductByIdQueryResult = Apollo.QueryResult<GetProductByIdQuery, GetProductByIdQueryVariables>;
export const MeDocument = gql`
    query Me {
  me {
    id
    email
    profile {
      avatarUrl
      displayName
    }
  }
}
    `;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export function useMeSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeSuspenseQueryHookResult = ReturnType<typeof useMeSuspenseQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;