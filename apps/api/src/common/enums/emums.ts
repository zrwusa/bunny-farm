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

export enum DeviceType {
  WEB = 'WEB',
  MOBILE_WEB = 'MOBILE_WEB',
  APP = 'APP',
  MOBILE_APP = 'MOBILE_APP',
}

export enum PartOfSpeech {
  NOUN = 'NOUN',
  TRANSITIVE_VERB = 'TRANSITIVE_VERB',
  INTRANSITIVE_VERB = 'INTRANSITIVE_VERB',
  ADJECTIVE = 'ADJECTIVE',
  ADVERB = 'ADVERB',
  PRONOUN = 'PRONOUN',
  PREPOSITION = 'PREPOSITION',
  CONJUNCTION = 'CONJUNCTION',
  INTERJECTION = 'INTERJECTION',
}

export enum AgeGroup {
  EARLY_CHILDHOOD = '3-5',
  CHILD = '6-9',
  PRETEEN = '10-12',
  TEEN = '13-17',
  ADULT = '18+',
}

export enum WordFrequency {
  VERY_RARE = 1,
  RARE = 2,
  UNCOMMON = 3,
  COMMON = 4,
  VERY_COMMON = 5,
}

export enum Connotation {
  STRONGLY_NEGATIVE = 1,
  NEGATIVE = 2,
  NEUTRAL = 3,
  POSITIVE = 4,
  STRONGLY_POSITIVE = 5,
}

export enum EmotionalIntensity {
  VERY_MILD = 1,
  MILD = 2,
  MODERATE = 3,
  INTENSE = 4,
  VERY_INTENSE = 5,
}
