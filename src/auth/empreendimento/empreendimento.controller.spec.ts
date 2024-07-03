import { Test, TestingModule } from '@nestjs/testing';
import { EmpreendimentoController } from './empreendimento.controller';

describe('EmpreendimentoController', () => {
  let controller: EmpreendimentoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmpreendimentoController],
    }).compile();

    controller = module.get<EmpreendimentoController>(EmpreendimentoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
