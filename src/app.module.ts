import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';
import{MongooseModule} from '@nestjs/mongoose'
import * as dotenv from 'dotenv' 
import { User, UserSchema } from './users/users.schema';
dotenv.config()

@Module({
  imports: [UsersModule, MongooseModule.forRoot(process.env.DATABASE_URL), MongooseModule.forFeature([{name: User.name, schema: UserSchema}]) ],
  controllers: [AppController, UsersController],
  providers: [AppService, UsersService],
})
export class AppModule {}
