import { Injectable } from '@nestjs/common';
import { CreateShipmentInput } from './dto/create-shipment.input';
import { UpdateShipmentInput } from './dto/update-shipment.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Shipment } from './entities/shipment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ShipmentService {
  constructor(
    @InjectRepository(Shipment)
    private shipmentRepository: Repository<Shipment>,
  ) {}

  create(createShipmentInput: CreateShipmentInput) {
    return `This action adds a new shipment ${createShipmentInput.exampleField}`;
  }

  findAll() {
    return this.shipmentRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} shipment`;
  }

  update(id: number, updateShipmentInput: UpdateShipmentInput) {
    return `This action updates a #${id} shipment, id: ${updateShipmentInput.id}`;
  }

  remove(id: number) {
    return `This action removes a #${id} shipment`;
  }
}
