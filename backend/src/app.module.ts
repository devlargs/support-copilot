import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupportModule } from './support/support.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/support_copilot'),
    SupportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
