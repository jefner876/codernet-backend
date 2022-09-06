import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';
import{MongooseModule} from '@nestjs/mongoose'
import * as dotenv from 'dotenv' 
dotenv.config()

@Module({
  imports: [UsersModule, MongooseModule.forRoot(process.env.DATABASE_URL) ],
  controllers: [AppController, UsersController],
  providers: [AppService, UsersService],
})
export class AppModule {}
