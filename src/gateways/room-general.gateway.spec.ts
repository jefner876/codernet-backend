import { Test, TestingModule } from '@nestjs/testing';
import { RoomGeneralGateway } from './room-general.gateway';

describe('RoomGeneralGateway', () => {
  let gateway: RoomGeneralGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomGeneralGateway],
    }).compile();

    gateway = module.get<RoomGeneralGateway>(RoomGeneralGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
