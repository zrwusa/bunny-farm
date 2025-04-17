import { Test, TestingModule } from '@nestjs/testing';
import { InventoryRecordResolver } from './inventory-record.resolver';
import { InventoryService } from './inventory.service';

describe('InventoryResolver', () => {
  let resolver: InventoryRecordResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InventoryRecordResolver, InventoryService],
    }).compile();

    resolver = module.get<InventoryRecordResolver>(InventoryRecordResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
