export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  AWAITING_SHIPMENT = 'AWAITING_SHIPMENT',
  SHIPPED = 'SHIPPED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REFUNDING = 'REFUNDING',
  REFUNDED = 'REFUNDED',
  RETURNING = 'RETURNING',
  RETURNED = 'RETURNED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum ShippingStatus {
  PENDING = 'PENDING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
}

export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  PAYPAL = 'PAYPAL',
  BANK_TRANSFER = 'BANK_TRANSFER',
  OTHER = 'OTHER',
}

export enum InventoryType {
  PURCHASE = 'PURCHASE',
  SALE = 'SALE',
  RETURN = 'RETURN',
  ADJUSTMENT = 'ADJUSTMENT',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum Theme {
  LIGHT = 'LIGHT',
  DARK = 'DARK',
}

export enum ShipmentStatus {
  PENDING = 'PENDING',
  SHIPPED = 'SHIPPED',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  RETURNED = 'RETURNED',
}

export enum Carrier {
  DHL = 'DHL',
  FEDEX = 'FEDEX',
  UPS = 'UPS',
  USPS = 'USPS',
  ARAMEX = 'ARAMEX',
  LOCAL_COURIER = 'LOCAL_COURIER',
}

export enum CategoryType {
  PHYSICAL = 'PHYSICAL',
  DIGITAL = 'DIGITAL',
  SERVICE = 'SERVICE',
}
