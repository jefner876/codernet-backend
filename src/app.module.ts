import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoomGeneralGateway } from './gateways/room-general.gateway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, RoomGeneralGateway],
})
export class AppModule {}
