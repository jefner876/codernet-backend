import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import{MongooseModule} from '@nestjs/mongoose'
import * as dotenv from 'dotenv' 
dotenv.config()

@Module({
  imports: [MongooseModule.forRoot(process.env.DATABASE_URL),UsersModule ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
