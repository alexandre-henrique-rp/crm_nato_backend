import { Test, TestingModule } from '@nestjs/testing';
import { ConstrutorasController } from './construtoras.controller';
import { ConstrutorasService } from './construtoras.service';

describe('ConstrutorasController', () => {
  let controller: ConstrutorasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConstrutorasController],
      providers: [ConstrutorasService],
    }).compile();

    controller = module.get<ConstrutorasController>(ConstrutorasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
