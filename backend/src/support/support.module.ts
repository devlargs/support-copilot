import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SupportService } from './support.service';
import { SupportController } from './support.controller';
import { Support, SupportSchema } from './schemas/support.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Support.name, schema: SupportSchema }]),
  ],
  controllers: [SupportController],
  providers: [SupportService],
})
export class SupportModule {}
