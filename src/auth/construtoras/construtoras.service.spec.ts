import { Test, TestingModule } from '@nestjs/testing';
import { ConstrutorasService } from './construtoras.service';

describe('ConstrutorasService', () => {
  let service: ConstrutorasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConstrutorasService],
    }).compile();

    service = module.get<ConstrutorasService>(ConstrutorasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
