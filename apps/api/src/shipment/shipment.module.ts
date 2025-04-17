import { Module } from '@nestjs/common';
import { ShipmentService } from './shipment.service';
import { ShipmentResolver } from './shipment.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shipment } from './entities/shipment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Shipment])],
  providers: [ShipmentResolver, ShipmentService],
})
export class ShipmentModule {}
