import { Test, TestingModule } from '@nestjs/testing';
import { SolicitacaoController } from './solicitacao.controller';

describe('SolicitacaoController', () => {
  let controller: SolicitacaoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SolicitacaoController],
    }).compile();

    controller = module.get<SolicitacaoController>(SolicitacaoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
