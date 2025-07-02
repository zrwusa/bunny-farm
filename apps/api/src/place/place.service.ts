import { Injectable } from '@nestjs/common';
import { PlaceGeoDetail } from './dto/place.dto';
import { ConfigService } from '@nestjs/config';
// import { CACHE_MANAGER } from '@nestjs/cache-manager';
// import { Cache } from 'cache-manager';

@Injectable()
export class PlaceService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.opencagedata.com/geocode/v1/json';
  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.getOrThrow<string>('OPENCAGE_API_KEY');
  } // @Inject(CACHE_MANAGER) private cacheManager: Cache

  // async getPlaceDetailsByText(addressText: string) {
  //   const result = postal.parser.parse_address(
  //     'John Smith, 123 Main St, Toronto, ON M4B 1B3, Canada, +1 416-555-1234',
  //   );
  //
  //   console.log('---addressText', addressText, result);
  //   return result;
  // }

  // async getPlaceDetails(placeId: string) {
  //   const cacheKey = `place-details:${placeId}`;
  //   const cached = await this.cacheManager.get(cacheKey);
  //   if (cached) return cached;
  //
  //   const url = `${this.baseUrl}/details/json?place_id=${placeId}&key=${this.apiKey}`;
  //   const res = await fetch(url);
  //   const data = await res.json();
  //
  //   if (data.status !== 'OK') {
  //     throw new Error(`Google API Error: ${data.status}`);
  //   }
  //
  //   const result = this.parseResult(data.result);
  //   await this.cacheManager.set(cacheKey, result, 3600); // 1 hour
  //   return result;
  // }

  // async getAutocomplete(input: string) {
  //   const url = `${this.baseUrl}/autocomplete/json?input=${encodeURIComponent(
  //     input,
  //   )}&key=${this.apiKey}`;
  //   const res = await fetch(url);
  //   const data = await res.json();
  //
  //   if (data.status !== 'OK') {
  //     throw new Error(`Google Autocomplete API Error: ${data.status}`);
  //   }
  //
  //   return data.predictions.map((p) => ({
  //     description: p.description,
  //     placeId: p.place_id,
  //   }));
  // }

  async findPlaceDetail(address: string): Promise<PlaceGeoDetail | null> {
    const url = `${this.baseUrl}?q=${encodeURIComponent(address)}&key=${this.apiKey}&language=en&pretty=1`;

    const res = await fetch(url);
    const json = await res.json();
    const result = json?.results?.[0];
    console.debug('---result', result);
    if (!result) return null;
    return result;
    // const { components, geometry } = result;
    // return {
    //   city: components.city || components.town || components.village,
    //   country: components.country,
    //   postalCode: components.postcode,
    //   road: components.road,
    //   lat: geometry.lat,
    //   lng: geometry.lng,
    // };
  }
}
