import { Module } from '@nestjs/common';
import { PlaceService } from './place.service';
import { PlacesResolver } from './place.resolver';

@Module({
  providers: [PlaceService, PlacesResolver],
})
export class PlaceModule {}
