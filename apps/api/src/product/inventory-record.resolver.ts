import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InventoryService } from './inventory.service';
import { InventoryRecord } from './entities/inventory-record.entity';
// import { CreateInventoryInput } from './dto/create-inventory.input';
// import { UpdateInventoryInput } from './dto/update-inventory.input';

@Resolver(() => InventoryRecord)
export class InventoryRecordResolver {
  constructor(private readonly inventoryService: InventoryService) {}

  // @Mutation(() => Inventory)
  // createInventoryRecord(@Args('createInventoryInput') createInventoryInput: CreateInventoryInput) {
  //   return this.inventoryService.create(createInventoryInput);
  // }

  @Query(() => [InventoryRecord], { name: 'inventoryRecords' })
  getInventoryRecords() {
    return this.inventoryService.findAll();
  }

  @Query(() => InventoryRecord, { name: 'inventoryRecord' })
  getInventoryRecordById(@Args('id', { type: () => Int }) id: number) {
    return this.inventoryService.findOne(id);
  }

  // @Mutation(() => Inventory)
  // updateInventoryRecord(@Args('updateInventoryInput') updateInventoryInput: UpdateInventoryInput) {
  //   return this.inventoryService.update(updateInventoryInput.id, updateInventoryInput);
  // }

  @Mutation(() => InventoryRecord)
  removeInventoryRecord(@Args('id', { type: () => Int }) id: number) {
    return this.inventoryService.remove(id);
  }
}
