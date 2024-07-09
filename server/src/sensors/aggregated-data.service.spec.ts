import { Test, TestingModule } from '@nestjs/testing';
import { AggregatedDataService } from './aggregated-data.service';

describe('AggregatedDataService', () => {
  let service: AggregatedDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AggregatedDataService],
    }).compile();

    service = module.get<AggregatedDataService>(AggregatedDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
