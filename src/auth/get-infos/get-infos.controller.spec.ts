import { Test, TestingModule } from '@nestjs/testing';
import { GetInfosController } from './get-infos.controller';

describe('GetInfosController', () => {
  let controller: GetInfosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetInfosController],
    }).compile();

    controller = module.get<GetInfosController>(GetInfosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
