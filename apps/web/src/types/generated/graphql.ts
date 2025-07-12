import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: Date; output: Date; }
  JSONObject: { input: Record<string, unknown>; output: Record<string, unknown>; }
};

export type AddItemToCartInput = {
  clientCartId?: InputMaybe<Scalars['String']['input']>;
  item: CartItemInput;
};

export enum AgeGroup {
  Adult = 'ADULT',
  Child = 'CHILD',
  EarlyChildhood = 'EARLY_CHILDHOOD',
  Preteen = 'PRETEEN',
  Teen = 'TEEN'
}

export type Annotations = {
  callingcode: Scalars['Int']['output'];
  currency: Currency;
  flag: Scalars['String']['output'];
  geohash: Scalars['String']['output'];
  qibla: Scalars['Float']['output'];
  roadinfo: RoadInfo;
  timezone: Timezone;
};

export type App = {
  message: Scalars['String']['output'];
};

export type Bounds = {
  northeast: Geometry;
  southwest: Geometry;
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

export type CachedCart = {
  clientCartId?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  deviceType: DeviceType;
  id: Scalars['ID']['output'];
  items: Array<EnrichedCartItem>;
  updatedAt: Scalars['DateTime']['output'];
  user?: Maybe<User>;
};

export enum Carrier {
  Aramex = 'ARAMEX',
  Dhl = 'DHL',
  Fedex = 'FEDEX',
  LocalCourier = 'LOCAL_COURIER',
  Ups = 'UPS',
  Usps = 'USPS'
}

export type Cart = {
  clientCartId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  deviceType: DeviceType;
  id: Scalars['String']['output'];
  items: Array<CartItem>;
  updatedAt: Scalars['DateTime']['output'];
  user?: Maybe<User>;
};

export type CartItem = {
  cart?: Maybe<Cart>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  productId: Scalars['String']['output'];
  quantity: Scalars['Int']['output'];
  selected: Scalars['Boolean']['output'];
  skuId: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type CartItemInput = {
  productId: Scalars['String']['input'];
  quantity: Scalars['Int']['input'];
  selected: Scalars['Boolean']['input'];
  skuId: Scalars['String']['input'];
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

export type Components = {
  city?: Maybe<Scalars['String']['output']>;
  continent?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  country_code?: Maybe<Scalars['String']['output']>;
  house_number?: Maybe<Scalars['String']['output']>;
  postcode?: Maybe<Scalars['String']['output']>;
  road?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['String']['output']>;
  state_code?: Maybe<Scalars['String']['output']>;
  suburb?: Maybe<Scalars['String']['output']>;
};

export enum Connotation {
  Negative = 'NEGATIVE',
  Neutral = 'NEUTRAL',
  Positive = 'POSITIVE',
  StronglyNegative = 'STRONGLY_NEGATIVE',
  StronglyPositive = 'STRONGLY_POSITIVE'
}

export type CreateAttributeInput = {
  acquisitionAge: AgeGroup;
  connotation: Connotation;
  emotionalIntensity: EmotionalIntensity;
  frequency: WordFrequency;
};

export type CreateExampleInput = {
  isSpoken: Scalars['Boolean']['input'];
  sentence: Scalars['String']['input'];
  translationZh: Scalars['String']['input'];
};

export type CreateMorphemeInput = {
  isPrefix?: Scalars['Boolean']['input'];
  isRoot?: Scalars['Boolean']['input'];
  isSuffix?: Scalars['Boolean']['input'];
  meaningEn: Scalars['String']['input'];
  meaningZh: Scalars['String']['input'];
  relatedWords: Array<CreateMorphemeRelatedWordInput>;
  text: Scalars['String']['input'];
};

export type CreateMorphemeRelatedWordInput = {
  acquisitionAge?: InputMaybe<AgeGroup>;
  connotation?: InputMaybe<Connotation>;
  definition?: InputMaybe<Scalars['String']['input']>;
  definitionZh?: InputMaybe<Scalars['String']['input']>;
  emotionalIntensity?: InputMaybe<EmotionalIntensity>;
  frequency?: InputMaybe<WordFrequency>;
  isSpoken?: Scalars['Boolean']['input'];
  isWritten?: Scalars['Boolean']['input'];
  partOfSpeech?: InputMaybe<PartOfSpeech>;
  text: Scalars['String']['input'];
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

export type CreatePaymentIntentInput = {
  /** amount of cents */
  amountOfCents: Scalars['Int']['input'];
  /** currency type, eg. NZD */
  currency: Scalars['String']['input'];
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

export type CreateSynonymInput = {
  acquisitionAge?: InputMaybe<AgeGroup>;
  connotation?: InputMaybe<Connotation>;
  definition?: InputMaybe<Scalars['String']['input']>;
  definitionZh?: InputMaybe<Scalars['String']['input']>;
  emotionalIntensity?: InputMaybe<EmotionalIntensity>;
  frequency?: InputMaybe<WordFrequency>;
  isSpoken?: Scalars['Boolean']['input'];
  isWritten?: Scalars['Boolean']['input'];
  partOfSpeech?: InputMaybe<PartOfSpeech>;
  text: Scalars['String']['input'];
};

export type CreateUserAddressInput = {
  addressLine1: Scalars['String']['input'];
  addressLine2?: InputMaybe<Scalars['String']['input']>;
  city: Scalars['String']['input'];
  country: Scalars['String']['input'];
  email: Scalars['String']['input'];
  isDefault?: Scalars['Boolean']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
  postalCode: Scalars['String']['input'];
  recipientName: Scalars['String']['input'];
  suburb?: InputMaybe<Scalars['String']['input']>;
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

export type CreateVariantInput = {
  attributes?: InputMaybe<CreateAttributeInput>;
  definition: Scalars['String']['input'];
  definitionZh: Scalars['String']['input'];
  examples?: InputMaybe<Array<CreateExampleInput>>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  isSpoken?: Scalars['Boolean']['input'];
  isWritten?: Scalars['Boolean']['input'];
  partOfSpeech: PartOfSpeech;
  pronunciationUk?: InputMaybe<Scalars['String']['input']>;
  pronunciationUs?: InputMaybe<Scalars['String']['input']>;
  synonyms?: InputMaybe<Array<CreateSynonymInput>>;
};

export type Currency = {
  iso_code: Scalars['String']['output'];
  name: Scalars['String']['output'];
  subunit_to_unit: Scalars['Int']['output'];
  symbol: Scalars['String']['output'];
};

export enum DeviceType {
  App = 'APP',
  MobileApp = 'MOBILE_APP',
  MobileWeb = 'MOBILE_WEB',
  Web = 'WEB'
}

export enum EmotionalIntensity {
  Intense = 'INTENSE',
  Mild = 'MILD',
  Moderate = 'MODERATE',
  VeryIntense = 'VERY_INTENSE',
  VeryMild = 'VERY_MILD'
}

export type EnrichedCartItem = {
  cart?: Maybe<Cart>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  product?: Maybe<Product>;
  productId: Scalars['String']['output'];
  quantity: Scalars['Int']['output'];
  selected: Scalars['Boolean']['output'];
  sku?: Maybe<Sku>;
  skuId: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type ExampleSentence = {
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  isSpoken: Scalars['Boolean']['output'];
  sentence: Scalars['String']['output'];
  translationZh: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  variant: WordVariant;
};

export type FilterOrderInput = {
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  page?: Scalars['Float']['input'];
  pageSize?: Scalars['Float']['input'];
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type Geometry = {
  lat: Scalars['Float']['output'];
  lng: Scalars['Float']['output'];
};

export type ImageInput = {
  position: Scalars['Float']['input'];
  url: Scalars['String']['input'];
};

export type Inventory = {
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  quantity: Scalars['Float']['output'];
  sku: Sku;
  updatedAt: Scalars['DateTime']['output'];
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
  sku: Sku;
  type: InventoryType;
  updatedAt: Scalars['DateTime']['output'];
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

export type Morpheme = {
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  isPrefix: Scalars['Boolean']['output'];
  isRoot: Scalars['Boolean']['output'];
  isSuffix: Scalars['Boolean']['output'];
  meaningEn: Scalars['String']['output'];
  meaningZh: Scalars['String']['output'];
  relatedWords: Array<MorphemeWord>;
  text: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type MorphemeWord = {
  acquisitionAge?: Maybe<AgeGroup>;
  connotation?: Maybe<Connotation>;
  createdAt: Scalars['DateTime']['output'];
  definition?: Maybe<Scalars['String']['output']>;
  definitionZh?: Maybe<Scalars['String']['output']>;
  emotionalIntensity?: Maybe<EmotionalIntensity>;
  frequency?: Maybe<WordFrequency>;
  id: Scalars['String']['output'];
  isSpoken: Scalars['Boolean']['output'];
  isWritten: Scalars['Boolean']['output'];
  morpheme: Morpheme;
  partOfSpeech?: Maybe<PartOfSpeech>;
  relatedWordVariant: Array<WordVariant>;
  text: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type Mutation = {
  addMyAddress: UserAddress;
  addToCart: CachedCart;
  bulkIndexProducts: Scalars['Boolean']['output'];
  clearCart: CachedCart;
  confirmPayment: Payment;
  createCheckoutSession: Scalars['String']['output'];
  createOrder: Order;
  createPayment: Payment;
  createPaymentIntent: Scalars['String']['output'];
  createProduct: Product;
  createShipment: Shipment;
  createUser: User;
  createUserSettings: UserPreference;
  login: TokenOutput;
  logout: Scalars['Boolean']['output'];
  placeOrder: Order;
  publishProduct: Product;
  publishWord: Word;
  refreshToken: TokenOutput;
  refreshTokenByCookie: TokenOutput;
  removeItems: CachedCart;
  removePayment: Payment;
  removeShipment: Shipment;
  toggleItemSelection: CachedCart;
  updateItemQuantity: CachedCart;
  updatePayment: Payment;
  updateShipment: Shipment;
};


export type MutationAddMyAddressArgs = {
  input: CreateUserAddressInput;
};


export type MutationAddToCartArgs = {
  addItemToCartInput: AddItemToCartInput;
};


export type MutationClearCartArgs = {
  clientCartId?: InputMaybe<Scalars['String']['input']>;
};


export type MutationConfirmPaymentArgs = {
  paymentId: Scalars['String']['input'];
  status: Scalars['String']['input'];
};


export type MutationCreateOrderArgs = {
  createOrderInput: CreateOrderInput;
};


export type MutationCreatePaymentArgs = {
  createPaymentInput: CreatePaymentInput;
};


export type MutationCreatePaymentIntentArgs = {
  createPaymentIntentInput: CreatePaymentIntentInput;
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


export type MutationPlaceOrderArgs = {
  input: PlaceOrderInput;
};


export type MutationPublishProductArgs = {
  publishProductInput: PublishProductInput;
};


export type MutationPublishWordArgs = {
  input: PublishWordInput;
};


export type MutationRefreshTokenArgs = {
  refreshToken: Scalars['String']['input'];
};


export type MutationRemoveItemsArgs = {
  removeItemsInput: RemoveItemsInput;
};


export type MutationRemovePaymentArgs = {
  id: Scalars['Int']['input'];
};


export type MutationRemoveShipmentArgs = {
  id: Scalars['Int']['input'];
};


export type MutationToggleItemSelectionArgs = {
  clientCartId?: InputMaybe<Scalars['String']['input']>;
  toggleItemSelection: ToggleItemSelectionInput;
};


export type MutationUpdateItemQuantityArgs = {
  updateItemQuantityInput: UpdateItemQuantityInput;
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
  sku: Sku;
  updatedAt: Scalars['DateTime']['output'];
};

export type OrderItemInput = {
  /** Quantity of the product(s) */
  quantity: Scalars['Int']['input'];
  /** Sku Ids */
  skuId: Scalars['String']['input'];
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

export enum PartOfSpeech {
  Adjective = 'ADJECTIVE',
  Adverb = 'ADVERB',
  Conjunction = 'CONJUNCTION',
  Interjection = 'INTERJECTION',
  IntransitiveVerb = 'INTRANSITIVE_VERB',
  Noun = 'NOUN',
  Preposition = 'PREPOSITION',
  Pronoun = 'PRONOUN',
  TransitiveVerb = 'TRANSITIVE_VERB'
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

export type PlaceGeoDetail = {
  annotations: Annotations;
  bounds: Bounds;
  components: Components;
  confidence: Scalars['Int']['output'];
  formatted: Scalars['String']['output'];
  geometry: Geometry;
};

export type PlaceOrderInput = {
  addressId: Scalars['ID']['input'];
  items: Array<CartItemInput>;
  paymentMethod: PaymentMethod;
};

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
  skus: Array<Sku>;
  updatedAt: Scalars['DateTime']['output'];
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
  sku: Sku;
  updatedAt: Scalars['DateTime']['output'];
  validFrom?: Maybe<Scalars['DateTime']['output']>;
  validTo?: Maybe<Scalars['DateTime']['output']>;
};

export type ProductReview = {
  comment?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  product?: Maybe<Product>;
  rating: Scalars['Int']['output'];
  sku?: Maybe<Sku>;
  updatedAt: Scalars['DateTime']['output'];
  user: User;
};

export type PublishProductInput = {
  brand: BrandInput;
  category: CategoryInput;
  description?: InputMaybe<Scalars['JSONObject']['input']>;
  images: Array<ImageInput>;
  name: Scalars['String']['input'];
  skus: Array<SkuInput>;
};

export type PublishWordInput = {
  morphemes?: InputMaybe<Array<CreateMorphemeInput>>;
  text: Scalars['String']['input'];
  variants?: InputMaybe<Array<CreateVariantInput>>;
};

export type Query = {
  cart: CachedCart;
  findWord?: Maybe<Word>;
  me: User;
  myAddresses: Array<UserAddress>;
  order: Order;
  orders: Array<Order>;
  payment: Payment;
  payments: Array<Payment>;
  ping: App;
  pingElasticsearch: Scalars['String']['output'];
  placeDetail?: Maybe<PlaceGeoDetail>;
  product?: Maybe<Product>;
  products: Array<Product>;
  searchProducts: Array<Product>;
  selectedCartItems: Array<EnrichedCartItem>;
  shipment: Shipment;
  shipments: Array<Shipment>;
  suggestProductNames: Array<Scalars['String']['output']>;
  user?: Maybe<User>;
  users: Array<User>;
};


export type QueryCartArgs = {
  clientCartId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryFindWordArgs = {
  text: Scalars['String']['input'];
};


export type QueryOrderArgs = {
  id: Scalars['String']['input'];
};


export type QueryOrdersArgs = {
  filterOrderInput: FilterOrderInput;
};


export type QueryPaymentArgs = {
  id: Scalars['Int']['input'];
};


export type QueryPlaceDetailArgs = {
  address: Scalars['String']['input'];
};


export type QueryProductArgs = {
  id: Scalars['String']['input'];
};


export type QuerySearchProductsArgs = {
  keyword: Scalars['String']['input'];
};


export type QuerySelectedCartItemsArgs = {
  clientCartId?: InputMaybe<Scalars['String']['input']>;
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

export type RemoveItemsInput = {
  clientCartId?: InputMaybe<Scalars['String']['input']>;
  skuIds: Array<Scalars['String']['input']>;
};

export type RoadInfo = {
  drive_on: Scalars['String']['output'];
  road: Scalars['String']['output'];
  speed_in: Scalars['String']['output'];
};

export type Sku = {
  color: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  images: Array<SkuImage>;
  inventories: Array<Inventory>;
  inventoryRecords: Array<InventoryRecord>;
  prices: Array<ProductPrice>;
  product: Product;
  reviews: Array<ProductReview>;
  size: Scalars['String']['output'];
  skuCode?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
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

export type SkuImage = {
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  position?: Maybe<Scalars['Float']['output']>;
  sku: Sku;
  updatedAt: Scalars['DateTime']['output'];
  url: Scalars['String']['output'];
};

export type SkuImageInput = {
  position: Scalars['Float']['input'];
  url: Scalars['String']['input'];
};

export type SkuInput = {
  color: Scalars['String']['input'];
  images?: InputMaybe<Array<SkuImageInput>>;
  inventories?: InputMaybe<Array<InventoryInput>>;
  inventoryRecords?: InputMaybe<Array<InventoryRecordInput>>;
  prices?: InputMaybe<Array<PriceInput>>;
  size: Scalars['String']['input'];
  sku: Scalars['String']['input'];
};

export type Timezone = {
  name: Scalars['String']['output'];
  offset_sec: Scalars['Int']['output'];
  offset_string: Scalars['String']['output'];
  short_name: Scalars['String']['output'];
};

export type ToggleItemSelectionInput = {
  clientCartId?: InputMaybe<Scalars['String']['input']>;
  selected: Scalars['Boolean']['input'];
  skuId: Scalars['String']['input'];
};

export type TokenMeta = {
  accessTokenMaxAge: Scalars['Float']['output'];
  refreshTokenMaxAge: Scalars['Float']['output'];
};

export type TokenOutput = {
  accessToken: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
  tokenMeta: TokenMeta;
};

export type UpdateItemQuantityInput = {
  clientCartId?: InputMaybe<Scalars['String']['input']>;
  quantity: Scalars['Int']['input'];
  skuId: Scalars['String']['input'];
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
  carts?: Maybe<Array<Cart>>;
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
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  isDefault: Scalars['Boolean']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  postalCode: Scalars['String']['output'];
  recipientName: Scalars['String']['output'];
  suburb?: Maybe<Scalars['String']['output']>;
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

export type VariantAttribute = {
  acquisitionAge: AgeGroup;
  connotation: Connotation;
  createdAt: Scalars['DateTime']['output'];
  emotionalIntensity: Scalars['Float']['output'];
  frequency: Scalars['Float']['output'];
  id: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type VariantSynonym = {
  acquisitionAge?: Maybe<AgeGroup>;
  connotation?: Maybe<Connotation>;
  createdAt: Scalars['DateTime']['output'];
  definition?: Maybe<Scalars['String']['output']>;
  definitionZh?: Maybe<Scalars['String']['output']>;
  emotionalIntensity?: Maybe<EmotionalIntensity>;
  frequency?: Maybe<WordFrequency>;
  id: Scalars['String']['output'];
  isSpoken: Scalars['Boolean']['output'];
  isWritten: Scalars['Boolean']['output'];
  partOfSpeech?: Maybe<PartOfSpeech>;
  synonymVariant: Array<WordVariant>;
  text: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  variant: WordVariant;
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

export type Word = {
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  morphemes: Array<Morpheme>;
  text: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  variants: Array<WordVariant>;
};

export enum WordFrequency {
  Common = 'COMMON',
  Rare = 'RARE',
  Uncommon = 'UNCOMMON',
  VeryCommon = 'VERY_COMMON',
  VeryRare = 'VERY_RARE'
}

export type WordVariant = {
  attributes?: Maybe<VariantAttribute>;
  createdAt: Scalars['DateTime']['output'];
  definition: Scalars['String']['output'];
  definitionZh: Scalars['String']['output'];
  examples: Array<ExampleSentence>;
  id: Scalars['String']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  isSpoken: Scalars['Boolean']['output'];
  isWritten: Scalars['Boolean']['output'];
  partOfSpeech: PartOfSpeech;
  pronunciationUk?: Maybe<Scalars['String']['output']>;
  pronunciationUs?: Maybe<Scalars['String']['output']>;
  synonyms: Array<VariantSynonym>;
  updatedAt: Scalars['DateTime']['output'];
  word: Word;
};

export type GetUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUsersQuery = { users: Array<{ id: string, username: string, email: string, provider?: string | null }> };

export type GetProductsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetProductsQuery = { products: Array<{ id: string, name: string, description?: Record<string, unknown> | null, images: Array<{ id: string, url: string }>, brand?: { id: string, name: string } | null, skus: Array<{ id: string, color: string, size: string, prices: Array<{ id: string, price: number, validFrom?: Date | null, validTo?: Date | null }> }> }> };

export type GetProductQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetProductQuery = { product?: { id: string, name: string, description?: Record<string, unknown> | null, images: Array<{ id: string, url: string }>, brand?: { id: string, name: string } | null, skus: Array<{ id: string, color: string, size: string, prices: Array<{ id: string, price: number, validFrom?: Date | null, validTo?: Date | null }>, inventories: Array<{ id: string, quantity: number, warehouse: { id: string, name: string } }> }> } | null };

export type GetProductIdsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetProductIdsQuery = { products: Array<{ id: string }> };

export type CartQueryVariables = Exact<{
  clientCartId?: InputMaybe<Scalars['String']['input']>;
}>;


export type CartQuery = { cart: { id: string, createdAt: Date, updatedAt: Date, items: Array<{ id: string, productId: string, skuId: string, quantity: number, selected: boolean, createdAt: Date, updatedAt: Date, product?: { name: string, images: Array<{ position?: number | null, url: string }> } | null, sku?: { size: string, color: string, images: Array<{ position?: number | null, url: string }> } | null }>, user?: { id: string, email: string } | null } };

export type GetMyAddressesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyAddressesQuery = { myAddresses: Array<{ id: string, isDefault: boolean, addressLine1: string, addressLine2?: string | null, postalCode: string, city: string, country: string }> };

export type PlaceDetailQueryVariables = Exact<{
  address: Scalars['String']['input'];
}>;


export type PlaceDetailQuery = { placeDetail?: { confidence: number, formatted: string, components: { suburb?: string | null, city?: string | null, country?: string | null, continent?: string | null, country_code?: string | null, postcode?: string | null, road?: string | null, state_code?: string | null } } | null };

export type GetSelectedCartItemsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSelectedCartItemsQuery = { selectedCartItems: Array<{ skuId: string, productId: string, quantity: number, selected: boolean, product?: { name: string, images: Array<{ url: string }> } | null }> };

export type SuggestProductNamesQueryVariables = Exact<{
  input: Scalars['String']['input'];
}>;


export type SuggestProductNamesQuery = { suggestProductNames: Array<string> };

export type SearchProductsQueryVariables = Exact<{
  keyword: Scalars['String']['input'];
}>;


export type SearchProductsQuery = { searchProducts: Array<{ id: string, name: string, description?: Record<string, unknown> | null, images: Array<{ id: string, url: string }>, brand?: { id: string, name: string } | null, skus: Array<{ id: string, color: string, size: string, prices: Array<{ id: string, price: number, validFrom?: Date | null, validTo?: Date | null }> }> }> };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { me: { id: string, email: string, profile?: { avatarUrl?: string | null, displayName?: string | null } | null } };

export type GetOrderQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetOrderQuery = { order: { id: string, totalPrice: number, paymentMethod: PaymentMethod, shippingStatus: ShippingStatus, items?: Array<{ id: string, quantity: number, sku: { id: string, skuCode?: string | null } }> | null } };

export type CreateProductMutationVariables = Exact<{
  createProductInput: CreateProductInput;
}>;


export type CreateProductMutation = { createProduct: { id: string, name: string, description?: Record<string, unknown> | null, brand?: { id: string, name: string } | null, category?: { id: string, name: string } | null, skus: Array<{ id: string, color: string, size: string, prices: Array<{ id: string, price: number, validFrom?: Date | null, validTo?: Date | null }> }>, images: Array<{ id: string, url: string }> } };

export type AddItemToCartMutationVariables = Exact<{
  addItemToCartInput: AddItemToCartInput;
}>;


export type AddItemToCartMutation = { addToCart: { id: string, createdAt: Date, updatedAt: Date, items: Array<{ id: string, productId: string, skuId: string, quantity: number, selected: boolean, createdAt: Date, updatedAt: Date, product?: { name: string, images: Array<{ position?: number | null, url: string }> } | null, sku?: { size: string, color: string, images: Array<{ position?: number | null, url: string }> } | null }>, user?: { id: string, email: string } | null } };

export type UpdateItemQuantityMutationVariables = Exact<{
  updateItemQuantityInput: UpdateItemQuantityInput;
}>;


export type UpdateItemQuantityMutation = { updateItemQuantity: { id: string, createdAt: Date, updatedAt: Date, items: Array<{ id: string, productId: string, skuId: string, quantity: number, selected: boolean, createdAt: Date, updatedAt: Date, product?: { name: string, images: Array<{ position?: number | null, url: string }> } | null, sku?: { size: string, color: string, images: Array<{ position?: number | null, url: string }> } | null }>, user?: { id: string, email: string } | null } };

export type ToggleItemSelectionMutationVariables = Exact<{
  toggleItemSelectionInput: ToggleItemSelectionInput;
}>;


export type ToggleItemSelectionMutation = { toggleItemSelection: { id: string, createdAt: Date, updatedAt: Date, items: Array<{ id: string, productId: string, skuId: string, quantity: number, selected: boolean, createdAt: Date, updatedAt: Date, product?: { name: string, images: Array<{ position?: number | null, url: string }> } | null, sku?: { size: string, color: string, images: Array<{ position?: number | null, url: string }> } | null }>, user?: { id: string, email: string } | null } };

export type RemoveItemsMutationVariables = Exact<{
  removeItemsInput: RemoveItemsInput;
}>;


export type RemoveItemsMutation = { removeItems: { id: string, createdAt: Date, updatedAt: Date, items: Array<{ id: string, productId: string, skuId: string, quantity: number, selected: boolean, createdAt: Date, updatedAt: Date, product?: { name: string, images: Array<{ position?: number | null, url: string }> } | null, sku?: { size: string, color: string, images: Array<{ position?: number | null, url: string }> } | null }>, user?: { id: string, email: string } | null } };

export type ClearCartMutationVariables = Exact<{
  clientCartId?: InputMaybe<Scalars['String']['input']>;
}>;


export type ClearCartMutation = { clearCart: { id: string, createdAt: Date, updatedAt: Date, items: Array<{ id: string, productId: string, skuId: string, quantity: number, selected: boolean, createdAt: Date, updatedAt: Date, product?: { name: string, images: Array<{ position?: number | null, url: string }> } | null, sku?: { size: string, color: string, images: Array<{ position?: number | null, url: string }> } | null }>, user?: { id: string, email: string } | null } };

export type CreateProductClientMutationVariables = Exact<{
  createProductInput: CreateProductInput;
}>;


export type CreateProductClientMutation = { createProduct: { id: string, name: string, description?: Record<string, unknown> | null, brand?: { id: string, name: string } | null, skus: Array<{ id: string, color: string, size: string, prices: Array<{ id: string, price: number, validFrom?: Date | null, validTo?: Date | null }> }> } };

export type PlaceOrderMutationVariables = Exact<{
  placeOrderInput: PlaceOrderInput;
}>;


export type PlaceOrderMutation = { placeOrder: { id: string, totalPrice: number, paymentMethod: PaymentMethod, shippingStatus: ShippingStatus, items?: Array<{ id: string, quantity: number, sku: { id: string, skuCode?: string | null } }> | null } };

export type CreatePaymentIntentMutationVariables = Exact<{
  createPaymentIntentInput: CreatePaymentIntentInput;
}>;


export type CreatePaymentIntentMutation = { createPaymentIntent: string };

export type GoogleLoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type GoogleLoginMutation = { login: { accessToken: string, refreshToken: string } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { logout: boolean };

export type RegisterMutationVariables = Exact<{
  createUserInput: CreateUserInput;
}>;


export type RegisterMutation = { createUser: { id: string, username: string, email: string } };

export type AddMyAddressMutationVariables = Exact<{
  input: CreateUserAddressInput;
}>;


export type AddMyAddressMutation = { addMyAddress: { id: string } };

export type LocalLoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LocalLoginMutation = { login: { accessToken: string, refreshToken: string } };


export const GetUsersDocument = gql`
    query GetUsers {
  users {
    id
    username
    email
    provider
  }
}
    `;

/**
 * __useGetUsersQuery__
 *
 * To run a query within a React component, call `useGetUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUsersQuery(baseOptions?: Apollo.QueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
      }
export function useGetUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
        }
export function useGetUsersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
        }
export type GetUsersQueryHookResult = ReturnType<typeof useGetUsersQuery>;
export type GetUsersLazyQueryHookResult = ReturnType<typeof useGetUsersLazyQuery>;
export type GetUsersSuspenseQueryHookResult = ReturnType<typeof useGetUsersSuspenseQuery>;
export type GetUsersQueryResult = Apollo.QueryResult<GetUsersQuery, GetUsersQueryVariables>;
export const GetProductsDocument = gql`
    query GetProducts {
  products {
    id
    name
    description
    images {
      id
      url
    }
    brand {
      id
      name
    }
    skus {
      id
      color
      size
      prices {
        id
        price
        validFrom
        validTo
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
export const GetProductDocument = gql`
    query GetProduct($id: String!) {
  product(id: $id) {
    id
    name
    description
    images {
      id
      url
    }
    brand {
      id
      name
    }
    skus {
      id
      color
      size
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
        }
      }
    }
  }
}
    `;

/**
 * __useGetProductQuery__
 *
 * To run a query within a React component, call `useGetProductQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProductQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProductQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetProductQuery(baseOptions: Apollo.QueryHookOptions<GetProductQuery, GetProductQueryVariables> & ({ variables: GetProductQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProductQuery, GetProductQueryVariables>(GetProductDocument, options);
      }
export function useGetProductLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProductQuery, GetProductQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProductQuery, GetProductQueryVariables>(GetProductDocument, options);
        }
export function useGetProductSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetProductQuery, GetProductQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetProductQuery, GetProductQueryVariables>(GetProductDocument, options);
        }
export type GetProductQueryHookResult = ReturnType<typeof useGetProductQuery>;
export type GetProductLazyQueryHookResult = ReturnType<typeof useGetProductLazyQuery>;
export type GetProductSuspenseQueryHookResult = ReturnType<typeof useGetProductSuspenseQuery>;
export type GetProductQueryResult = Apollo.QueryResult<GetProductQuery, GetProductQueryVariables>;
export const GetProductIdsDocument = gql`
    query GetProductIds {
  products {
    id
  }
}
    `;

/**
 * __useGetProductIdsQuery__
 *
 * To run a query within a React component, call `useGetProductIdsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProductIdsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProductIdsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetProductIdsQuery(baseOptions?: Apollo.QueryHookOptions<GetProductIdsQuery, GetProductIdsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProductIdsQuery, GetProductIdsQueryVariables>(GetProductIdsDocument, options);
      }
export function useGetProductIdsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProductIdsQuery, GetProductIdsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProductIdsQuery, GetProductIdsQueryVariables>(GetProductIdsDocument, options);
        }
export function useGetProductIdsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetProductIdsQuery, GetProductIdsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetProductIdsQuery, GetProductIdsQueryVariables>(GetProductIdsDocument, options);
        }
export type GetProductIdsQueryHookResult = ReturnType<typeof useGetProductIdsQuery>;
export type GetProductIdsLazyQueryHookResult = ReturnType<typeof useGetProductIdsLazyQuery>;
export type GetProductIdsSuspenseQueryHookResult = ReturnType<typeof useGetProductIdsSuspenseQuery>;
export type GetProductIdsQueryResult = Apollo.QueryResult<GetProductIdsQuery, GetProductIdsQueryVariables>;
export const CartDocument = gql`
    query cart($clientCartId: String) {
  cart(clientCartId: $clientCartId) {
    id
    items {
      id
      productId
      skuId
      quantity
      selected
      product {
        name
        images {
          position
          url
        }
      }
      sku {
        size
        color
        images {
          position
          url
        }
      }
      createdAt
      updatedAt
    }
    user {
      id
      email
    }
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useCartQuery__
 *
 * To run a query within a React component, call `useCartQuery` and pass it any options that fit your needs.
 * When your component renders, `useCartQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCartQuery({
 *   variables: {
 *      clientCartId: // value for 'clientCartId'
 *   },
 * });
 */
export function useCartQuery(baseOptions?: Apollo.QueryHookOptions<CartQuery, CartQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CartQuery, CartQueryVariables>(CartDocument, options);
      }
export function useCartLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CartQuery, CartQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CartQuery, CartQueryVariables>(CartDocument, options);
        }
export function useCartSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CartQuery, CartQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CartQuery, CartQueryVariables>(CartDocument, options);
        }
export type CartQueryHookResult = ReturnType<typeof useCartQuery>;
export type CartLazyQueryHookResult = ReturnType<typeof useCartLazyQuery>;
export type CartSuspenseQueryHookResult = ReturnType<typeof useCartSuspenseQuery>;
export type CartQueryResult = Apollo.QueryResult<CartQuery, CartQueryVariables>;
export const GetMyAddressesDocument = gql`
    query GetMyAddresses {
  myAddresses {
    id
    isDefault
    addressLine1
    addressLine2
    postalCode
    city
    country
  }
}
    `;

/**
 * __useGetMyAddressesQuery__
 *
 * To run a query within a React component, call `useGetMyAddressesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMyAddressesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMyAddressesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMyAddressesQuery(baseOptions?: Apollo.QueryHookOptions<GetMyAddressesQuery, GetMyAddressesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMyAddressesQuery, GetMyAddressesQueryVariables>(GetMyAddressesDocument, options);
      }
export function useGetMyAddressesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMyAddressesQuery, GetMyAddressesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMyAddressesQuery, GetMyAddressesQueryVariables>(GetMyAddressesDocument, options);
        }
export function useGetMyAddressesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMyAddressesQuery, GetMyAddressesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMyAddressesQuery, GetMyAddressesQueryVariables>(GetMyAddressesDocument, options);
        }
export type GetMyAddressesQueryHookResult = ReturnType<typeof useGetMyAddressesQuery>;
export type GetMyAddressesLazyQueryHookResult = ReturnType<typeof useGetMyAddressesLazyQuery>;
export type GetMyAddressesSuspenseQueryHookResult = ReturnType<typeof useGetMyAddressesSuspenseQuery>;
export type GetMyAddressesQueryResult = Apollo.QueryResult<GetMyAddressesQuery, GetMyAddressesQueryVariables>;
export const PlaceDetailDocument = gql`
    query PlaceDetail($address: String!) {
  placeDetail(address: $address) {
    components {
      suburb
      city
      country
      continent
      country_code
      postcode
      road
      state_code
    }
    confidence
    formatted
  }
}
    `;

/**
 * __usePlaceDetailQuery__
 *
 * To run a query within a React component, call `usePlaceDetailQuery` and pass it any options that fit your needs.
 * When your component renders, `usePlaceDetailQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePlaceDetailQuery({
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
export function usePlaceDetailQuery(baseOptions: Apollo.QueryHookOptions<PlaceDetailQuery, PlaceDetailQueryVariables> & ({ variables: PlaceDetailQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PlaceDetailQuery, PlaceDetailQueryVariables>(PlaceDetailDocument, options);
      }
export function usePlaceDetailLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PlaceDetailQuery, PlaceDetailQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PlaceDetailQuery, PlaceDetailQueryVariables>(PlaceDetailDocument, options);
        }
export function usePlaceDetailSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<PlaceDetailQuery, PlaceDetailQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<PlaceDetailQuery, PlaceDetailQueryVariables>(PlaceDetailDocument, options);
        }
export type PlaceDetailQueryHookResult = ReturnType<typeof usePlaceDetailQuery>;
export type PlaceDetailLazyQueryHookResult = ReturnType<typeof usePlaceDetailLazyQuery>;
export type PlaceDetailSuspenseQueryHookResult = ReturnType<typeof usePlaceDetailSuspenseQuery>;
export type PlaceDetailQueryResult = Apollo.QueryResult<PlaceDetailQuery, PlaceDetailQueryVariables>;
export const GetSelectedCartItemsDocument = gql`
    query GetSelectedCartItems {
  selectedCartItems {
    skuId
    productId
    quantity
    selected
    product {
      name
      images {
        url
      }
    }
  }
}
    `;

/**
 * __useGetSelectedCartItemsQuery__
 *
 * To run a query within a React component, call `useGetSelectedCartItemsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSelectedCartItemsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSelectedCartItemsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetSelectedCartItemsQuery(baseOptions?: Apollo.QueryHookOptions<GetSelectedCartItemsQuery, GetSelectedCartItemsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSelectedCartItemsQuery, GetSelectedCartItemsQueryVariables>(GetSelectedCartItemsDocument, options);
      }
export function useGetSelectedCartItemsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSelectedCartItemsQuery, GetSelectedCartItemsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSelectedCartItemsQuery, GetSelectedCartItemsQueryVariables>(GetSelectedCartItemsDocument, options);
        }
export function useGetSelectedCartItemsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetSelectedCartItemsQuery, GetSelectedCartItemsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetSelectedCartItemsQuery, GetSelectedCartItemsQueryVariables>(GetSelectedCartItemsDocument, options);
        }
export type GetSelectedCartItemsQueryHookResult = ReturnType<typeof useGetSelectedCartItemsQuery>;
export type GetSelectedCartItemsLazyQueryHookResult = ReturnType<typeof useGetSelectedCartItemsLazyQuery>;
export type GetSelectedCartItemsSuspenseQueryHookResult = ReturnType<typeof useGetSelectedCartItemsSuspenseQuery>;
export type GetSelectedCartItemsQueryResult = Apollo.QueryResult<GetSelectedCartItemsQuery, GetSelectedCartItemsQueryVariables>;
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
export const SearchProductsDocument = gql`
    query SearchProducts($keyword: String!) {
  searchProducts(keyword: $keyword) {
    id
    name
    description
    images {
      id
      url
    }
    brand {
      id
      name
    }
    skus {
      id
      color
      size
      prices {
        id
        price
        validFrom
        validTo
      }
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
export const GetOrderDocument = gql`
    query GetOrder($id: String!) {
  order(id: $id) {
    id
    totalPrice
    paymentMethod
    shippingStatus
    items {
      id
      quantity
      sku {
        id
        skuCode
      }
    }
  }
}
    `;

/**
 * __useGetOrderQuery__
 *
 * To run a query within a React component, call `useGetOrderQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOrderQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOrderQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetOrderQuery(baseOptions: Apollo.QueryHookOptions<GetOrderQuery, GetOrderQueryVariables> & ({ variables: GetOrderQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetOrderQuery, GetOrderQueryVariables>(GetOrderDocument, options);
      }
export function useGetOrderLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetOrderQuery, GetOrderQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetOrderQuery, GetOrderQueryVariables>(GetOrderDocument, options);
        }
export function useGetOrderSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetOrderQuery, GetOrderQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetOrderQuery, GetOrderQueryVariables>(GetOrderDocument, options);
        }
export type GetOrderQueryHookResult = ReturnType<typeof useGetOrderQuery>;
export type GetOrderLazyQueryHookResult = ReturnType<typeof useGetOrderLazyQuery>;
export type GetOrderSuspenseQueryHookResult = ReturnType<typeof useGetOrderSuspenseQuery>;
export type GetOrderQueryResult = Apollo.QueryResult<GetOrderQuery, GetOrderQueryVariables>;
export const CreateProductDocument = gql`
    mutation CreateProduct($createProductInput: CreateProductInput!) {
  createProduct(createProductInput: $createProductInput) {
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
    skus {
      id
      color
      size
      prices {
        id
        price
        validFrom
        validTo
      }
    }
    images {
      id
      url
    }
  }
}
    `;
export type CreateProductMutationFn = Apollo.MutationFunction<CreateProductMutation, CreateProductMutationVariables>;

/**
 * __useCreateProductMutation__
 *
 * To run a mutation, you first call `useCreateProductMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProductMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProductMutation, { data, loading, error }] = useCreateProductMutation({
 *   variables: {
 *      createProductInput: // value for 'createProductInput'
 *   },
 * });
 */
export function useCreateProductMutation(baseOptions?: Apollo.MutationHookOptions<CreateProductMutation, CreateProductMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateProductMutation, CreateProductMutationVariables>(CreateProductDocument, options);
      }
export type CreateProductMutationHookResult = ReturnType<typeof useCreateProductMutation>;
export type CreateProductMutationResult = Apollo.MutationResult<CreateProductMutation>;
export type CreateProductMutationOptions = Apollo.BaseMutationOptions<CreateProductMutation, CreateProductMutationVariables>;
export const AddItemToCartDocument = gql`
    mutation addItemToCart($addItemToCartInput: AddItemToCartInput!) {
  addToCart(addItemToCartInput: $addItemToCartInput) {
    id
    items {
      id
      productId
      skuId
      quantity
      selected
      product {
        name
        images {
          position
          url
        }
      }
      sku {
        size
        color
        images {
          position
          url
        }
      }
      createdAt
      updatedAt
    }
    user {
      id
      email
    }
    createdAt
    updatedAt
  }
}
    `;
export type AddItemToCartMutationFn = Apollo.MutationFunction<AddItemToCartMutation, AddItemToCartMutationVariables>;

/**
 * __useAddItemToCartMutation__
 *
 * To run a mutation, you first call `useAddItemToCartMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddItemToCartMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addItemToCartMutation, { data, loading, error }] = useAddItemToCartMutation({
 *   variables: {
 *      addItemToCartInput: // value for 'addItemToCartInput'
 *   },
 * });
 */
export function useAddItemToCartMutation(baseOptions?: Apollo.MutationHookOptions<AddItemToCartMutation, AddItemToCartMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddItemToCartMutation, AddItemToCartMutationVariables>(AddItemToCartDocument, options);
      }
export type AddItemToCartMutationHookResult = ReturnType<typeof useAddItemToCartMutation>;
export type AddItemToCartMutationResult = Apollo.MutationResult<AddItemToCartMutation>;
export type AddItemToCartMutationOptions = Apollo.BaseMutationOptions<AddItemToCartMutation, AddItemToCartMutationVariables>;
export const UpdateItemQuantityDocument = gql`
    mutation updateItemQuantity($updateItemQuantityInput: UpdateItemQuantityInput!) {
  updateItemQuantity(updateItemQuantityInput: $updateItemQuantityInput) {
    id
    items {
      id
      productId
      skuId
      quantity
      selected
      product {
        name
        images {
          position
          url
        }
      }
      sku {
        size
        color
        images {
          position
          url
        }
      }
      createdAt
      updatedAt
    }
    user {
      id
      email
    }
    createdAt
    updatedAt
  }
}
    `;
export type UpdateItemQuantityMutationFn = Apollo.MutationFunction<UpdateItemQuantityMutation, UpdateItemQuantityMutationVariables>;

/**
 * __useUpdateItemQuantityMutation__
 *
 * To run a mutation, you first call `useUpdateItemQuantityMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateItemQuantityMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateItemQuantityMutation, { data, loading, error }] = useUpdateItemQuantityMutation({
 *   variables: {
 *      updateItemQuantityInput: // value for 'updateItemQuantityInput'
 *   },
 * });
 */
export function useUpdateItemQuantityMutation(baseOptions?: Apollo.MutationHookOptions<UpdateItemQuantityMutation, UpdateItemQuantityMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateItemQuantityMutation, UpdateItemQuantityMutationVariables>(UpdateItemQuantityDocument, options);
      }
export type UpdateItemQuantityMutationHookResult = ReturnType<typeof useUpdateItemQuantityMutation>;
export type UpdateItemQuantityMutationResult = Apollo.MutationResult<UpdateItemQuantityMutation>;
export type UpdateItemQuantityMutationOptions = Apollo.BaseMutationOptions<UpdateItemQuantityMutation, UpdateItemQuantityMutationVariables>;
export const ToggleItemSelectionDocument = gql`
    mutation ToggleItemSelection($toggleItemSelectionInput: ToggleItemSelectionInput!) {
  toggleItemSelection(toggleItemSelection: $toggleItemSelectionInput) {
    id
    items {
      id
      productId
      skuId
      quantity
      selected
      product {
        name
        images {
          position
          url
        }
      }
      sku {
        size
        color
        images {
          position
          url
        }
      }
      createdAt
      updatedAt
    }
    user {
      id
      email
    }
    createdAt
    updatedAt
  }
}
    `;
export type ToggleItemSelectionMutationFn = Apollo.MutationFunction<ToggleItemSelectionMutation, ToggleItemSelectionMutationVariables>;

/**
 * __useToggleItemSelectionMutation__
 *
 * To run a mutation, you first call `useToggleItemSelectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleItemSelectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleItemSelectionMutation, { data, loading, error }] = useToggleItemSelectionMutation({
 *   variables: {
 *      toggleItemSelectionInput: // value for 'toggleItemSelectionInput'
 *   },
 * });
 */
export function useToggleItemSelectionMutation(baseOptions?: Apollo.MutationHookOptions<ToggleItemSelectionMutation, ToggleItemSelectionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ToggleItemSelectionMutation, ToggleItemSelectionMutationVariables>(ToggleItemSelectionDocument, options);
      }
export type ToggleItemSelectionMutationHookResult = ReturnType<typeof useToggleItemSelectionMutation>;
export type ToggleItemSelectionMutationResult = Apollo.MutationResult<ToggleItemSelectionMutation>;
export type ToggleItemSelectionMutationOptions = Apollo.BaseMutationOptions<ToggleItemSelectionMutation, ToggleItemSelectionMutationVariables>;
export const RemoveItemsDocument = gql`
    mutation RemoveItems($removeItemsInput: RemoveItemsInput!) {
  removeItems(removeItemsInput: $removeItemsInput) {
    id
    items {
      id
      productId
      skuId
      quantity
      selected
      product {
        name
        images {
          position
          url
        }
      }
      sku {
        size
        color
        images {
          position
          url
        }
      }
      createdAt
      updatedAt
    }
    user {
      id
      email
    }
    createdAt
    updatedAt
  }
}
    `;
export type RemoveItemsMutationFn = Apollo.MutationFunction<RemoveItemsMutation, RemoveItemsMutationVariables>;

/**
 * __useRemoveItemsMutation__
 *
 * To run a mutation, you first call `useRemoveItemsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveItemsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeItemsMutation, { data, loading, error }] = useRemoveItemsMutation({
 *   variables: {
 *      removeItemsInput: // value for 'removeItemsInput'
 *   },
 * });
 */
export function useRemoveItemsMutation(baseOptions?: Apollo.MutationHookOptions<RemoveItemsMutation, RemoveItemsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveItemsMutation, RemoveItemsMutationVariables>(RemoveItemsDocument, options);
      }
export type RemoveItemsMutationHookResult = ReturnType<typeof useRemoveItemsMutation>;
export type RemoveItemsMutationResult = Apollo.MutationResult<RemoveItemsMutation>;
export type RemoveItemsMutationOptions = Apollo.BaseMutationOptions<RemoveItemsMutation, RemoveItemsMutationVariables>;
export const ClearCartDocument = gql`
    mutation ClearCart($clientCartId: String) {
  clearCart(clientCartId: $clientCartId) {
    id
    items {
      id
      productId
      skuId
      quantity
      selected
      product {
        name
        images {
          position
          url
        }
      }
      sku {
        size
        color
        images {
          position
          url
        }
      }
      createdAt
      updatedAt
    }
    user {
      id
      email
    }
    createdAt
    updatedAt
  }
}
    `;
export type ClearCartMutationFn = Apollo.MutationFunction<ClearCartMutation, ClearCartMutationVariables>;

/**
 * __useClearCartMutation__
 *
 * To run a mutation, you first call `useClearCartMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useClearCartMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [clearCartMutation, { data, loading, error }] = useClearCartMutation({
 *   variables: {
 *      clientCartId: // value for 'clientCartId'
 *   },
 * });
 */
export function useClearCartMutation(baseOptions?: Apollo.MutationHookOptions<ClearCartMutation, ClearCartMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ClearCartMutation, ClearCartMutationVariables>(ClearCartDocument, options);
      }
export type ClearCartMutationHookResult = ReturnType<typeof useClearCartMutation>;
export type ClearCartMutationResult = Apollo.MutationResult<ClearCartMutation>;
export type ClearCartMutationOptions = Apollo.BaseMutationOptions<ClearCartMutation, ClearCartMutationVariables>;
export const CreateProductClientDocument = gql`
    mutation CreateProductClient($createProductInput: CreateProductInput!) {
  createProduct(createProductInput: $createProductInput) {
    id
    name
    description
    brand {
      id
      name
    }
    skus {
      id
      color
      size
      prices {
        id
        price
        validFrom
        validTo
      }
    }
  }
}
    `;
export type CreateProductClientMutationFn = Apollo.MutationFunction<CreateProductClientMutation, CreateProductClientMutationVariables>;

/**
 * __useCreateProductClientMutation__
 *
 * To run a mutation, you first call `useCreateProductClientMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProductClientMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProductClientMutation, { data, loading, error }] = useCreateProductClientMutation({
 *   variables: {
 *      createProductInput: // value for 'createProductInput'
 *   },
 * });
 */
export function useCreateProductClientMutation(baseOptions?: Apollo.MutationHookOptions<CreateProductClientMutation, CreateProductClientMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateProductClientMutation, CreateProductClientMutationVariables>(CreateProductClientDocument, options);
      }
export type CreateProductClientMutationHookResult = ReturnType<typeof useCreateProductClientMutation>;
export type CreateProductClientMutationResult = Apollo.MutationResult<CreateProductClientMutation>;
export type CreateProductClientMutationOptions = Apollo.BaseMutationOptions<CreateProductClientMutation, CreateProductClientMutationVariables>;
export const PlaceOrderDocument = gql`
    mutation PlaceOrder($placeOrderInput: PlaceOrderInput!) {
  placeOrder(input: $placeOrderInput) {
    id
    totalPrice
    paymentMethod
    shippingStatus
    items {
      id
      quantity
      sku {
        id
        skuCode
      }
    }
  }
}
    `;
export type PlaceOrderMutationFn = Apollo.MutationFunction<PlaceOrderMutation, PlaceOrderMutationVariables>;

/**
 * __usePlaceOrderMutation__
 *
 * To run a mutation, you first call `usePlaceOrderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePlaceOrderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [placeOrderMutation, { data, loading, error }] = usePlaceOrderMutation({
 *   variables: {
 *      placeOrderInput: // value for 'placeOrderInput'
 *   },
 * });
 */
export function usePlaceOrderMutation(baseOptions?: Apollo.MutationHookOptions<PlaceOrderMutation, PlaceOrderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PlaceOrderMutation, PlaceOrderMutationVariables>(PlaceOrderDocument, options);
      }
export type PlaceOrderMutationHookResult = ReturnType<typeof usePlaceOrderMutation>;
export type PlaceOrderMutationResult = Apollo.MutationResult<PlaceOrderMutation>;
export type PlaceOrderMutationOptions = Apollo.BaseMutationOptions<PlaceOrderMutation, PlaceOrderMutationVariables>;
export const CreatePaymentIntentDocument = gql`
    mutation CreatePaymentIntent($createPaymentIntentInput: CreatePaymentIntentInput!) {
  createPaymentIntent(createPaymentIntentInput: $createPaymentIntentInput)
}
    `;
export type CreatePaymentIntentMutationFn = Apollo.MutationFunction<CreatePaymentIntentMutation, CreatePaymentIntentMutationVariables>;

/**
 * __useCreatePaymentIntentMutation__
 *
 * To run a mutation, you first call `useCreatePaymentIntentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePaymentIntentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPaymentIntentMutation, { data, loading, error }] = useCreatePaymentIntentMutation({
 *   variables: {
 *      createPaymentIntentInput: // value for 'createPaymentIntentInput'
 *   },
 * });
 */
export function useCreatePaymentIntentMutation(baseOptions?: Apollo.MutationHookOptions<CreatePaymentIntentMutation, CreatePaymentIntentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePaymentIntentMutation, CreatePaymentIntentMutationVariables>(CreatePaymentIntentDocument, options);
      }
export type CreatePaymentIntentMutationHookResult = ReturnType<typeof useCreatePaymentIntentMutation>;
export type CreatePaymentIntentMutationResult = Apollo.MutationResult<CreatePaymentIntentMutation>;
export type CreatePaymentIntentMutationOptions = Apollo.BaseMutationOptions<CreatePaymentIntentMutation, CreatePaymentIntentMutationVariables>;
export const GoogleLoginDocument = gql`
    mutation GoogleLogin($input: LoginInput!) {
  login(input: $input) {
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
 *      input: // value for 'input'
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
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const RegisterDocument = gql`
    mutation Register($createUserInput: CreateUserInput!) {
  createUser(createUserInput: $createUserInput) {
    id
    username
    email
  }
}
    `;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      createUserInput: // value for 'createUserInput'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const AddMyAddressDocument = gql`
    mutation AddMyAddress($input: CreateUserAddressInput!) {
  addMyAddress(input: $input) {
    id
  }
}
    `;
export type AddMyAddressMutationFn = Apollo.MutationFunction<AddMyAddressMutation, AddMyAddressMutationVariables>;

/**
 * __useAddMyAddressMutation__
 *
 * To run a mutation, you first call `useAddMyAddressMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddMyAddressMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addMyAddressMutation, { data, loading, error }] = useAddMyAddressMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddMyAddressMutation(baseOptions?: Apollo.MutationHookOptions<AddMyAddressMutation, AddMyAddressMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddMyAddressMutation, AddMyAddressMutationVariables>(AddMyAddressDocument, options);
      }
export type AddMyAddressMutationHookResult = ReturnType<typeof useAddMyAddressMutation>;
export type AddMyAddressMutationResult = Apollo.MutationResult<AddMyAddressMutation>;
export type AddMyAddressMutationOptions = Apollo.BaseMutationOptions<AddMyAddressMutation, AddMyAddressMutationVariables>;
export const LocalLoginDocument = gql`
    mutation LocalLogin($input: LoginInput!) {
  login(input: $input) {
    accessToken
    refreshToken
  }
}
    `;
export type LocalLoginMutationFn = Apollo.MutationFunction<LocalLoginMutation, LocalLoginMutationVariables>;

/**
 * __useLocalLoginMutation__
 *
 * To run a mutation, you first call `useLocalLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLocalLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [localLoginMutation, { data, loading, error }] = useLocalLoginMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useLocalLoginMutation(baseOptions?: Apollo.MutationHookOptions<LocalLoginMutation, LocalLoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LocalLoginMutation, LocalLoginMutationVariables>(LocalLoginDocument, options);
      }
export type LocalLoginMutationHookResult = ReturnType<typeof useLocalLoginMutation>;
export type LocalLoginMutationResult = Apollo.MutationResult<LocalLoginMutation>;
export type LocalLoginMutationOptions = Apollo.BaseMutationOptions<LocalLoginMutation, LocalLoginMutationVariables>;