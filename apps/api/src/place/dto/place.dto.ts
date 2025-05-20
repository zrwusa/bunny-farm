import { ObjectType, Field, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class PlaceSuggestion {
  @Field()
  description: string;

  @Field()
  placeId: string;
}

@ObjectType()
export class PlaceDetails {
  @Field()
  street: string;

  @Field()
  city: string;

  @Field()
  postalCode: string;

  @Field()
  country: string;

  @Field()
  formattedAddress: string;

  @Field({ nullable: true })
  phone?: string;
}

@ObjectType()
class Geometry {
  @Field(() => Float)
  lat: number;

  @Field(() => Float)
  lng: number;
}

@ObjectType()
class Bounds {
  @Field(() => Geometry)
  northeast: Geometry;

  @Field(() => Geometry)
  southwest: Geometry;
}

@ObjectType()
class Components {
  @Field({ nullable: true }) city?: string;
  @Field({ nullable: true }) suburb?: string;
  @Field({ nullable: true }) road?: string;
  @Field({ nullable: true }) house_number?: string;
  @Field({ nullable: true }) postcode?: string;
  @Field({ nullable: true }) state?: string;
  @Field({ nullable: true }) state_code?: string;
  @Field({ nullable: true }) country?: string;
  @Field({ nullable: true }) country_code?: string;
  @Field({ nullable: true }) continent?: string;
}

@ObjectType()
class Timezone {
  @Field() name: string;
  @Field(() => Int) offset_sec: number;
  @Field() offset_string: string;
  @Field() short_name: string;
}

@ObjectType()
class Currency {
  @Field() name: string;
  @Field() iso_code: string;
  @Field() symbol: string;
  @Field(() => Int) subunit_to_unit: number;
}

@ObjectType()
class RoadInfo {
  @Field() road: string;
  @Field() drive_on: string;
  @Field() speed_in: string;
}

@ObjectType()
class Annotations {
  @Field(() => Timezone) timezone: Timezone;
  @Field(() => Int) callingcode: number;
  @Field(() => Currency) currency: Currency;
  @Field(() => RoadInfo) roadinfo: RoadInfo;
  @Field() flag: string;
  @Field() geohash: string;
  @Field(() => Float) qibla: number;
}

@ObjectType()
export class PlaceGeoDetail {
  @Field() formatted: string;

  @Field(() => Geometry)
  geometry: Geometry;

  @Field(() => Bounds)
  bounds: Bounds;

  @Field(() => Components)
  components: Components;

  @Field(() => Annotations)
  annotations: Annotations;

  @Field(() => Int)
  confidence: number;
}

@ObjectType()
export class FlatPlaceGeoDetail {
  @Field({ nullable: true })
  city?: string;

  @Field({ nullable: true })
  country?: string;

  @Field({ nullable: true })
  postalCode?: string;

  @Field({ nullable: true })
  road?: string;

  @Field(() => Float, { nullable: true })
  lat?: number;

  @Field(() => Float, { nullable: true })
  lng?: number;
}
