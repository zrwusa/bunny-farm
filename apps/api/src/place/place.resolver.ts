import { Resolver, Query, Args } from '@nestjs/graphql';
import { PlaceService } from './place.service';
import { PlaceGeoDetail } from './dto/place.dto';
// import { PlaceSuggestion, PlaceDetails } from './dto/place.dto';

@Resolver()
export class PlacesResolver {
  constructor(private readonly placeService: PlaceService) {}

  // @Query(() => [PlaceSuggestion])
  // async autocomplete(@Args('input') input: string) {
  //   return this.placeService.getAutocomplete(input);
  // }
  //
  // @Query(() => PlaceDetails)
  // async placeDetails(@Args('placeId') placeId: string) {
  //   return this.placeService.getPlaceDetails(placeId);
  // }

  // @Query()
  // async placeDetails(@Args('addressText') addressText: string) {
  //   return this.placeService.getPlaceDetailsByText(addressText);
  // }

  @Query(() => PlaceGeoDetail, { nullable: true })
  async placeDetail(@Args('address') address: string): Promise<PlaceGeoDetail | null> {
    return this.placeService.findPlaceDetail(address);
  }
}
