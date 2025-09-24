import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Support, SupportDocument } from './schemas/support.schema';
import { CreateSupportDto } from './dto/create-support.dto';
import { UpdateSupportDto } from './dto/update-support.dto';

@Injectable()
export class SupportService {
  constructor(
    @InjectModel(Support.name) private supportModel: Model<SupportDocument>,
  ) {}

  async create(createSupportDto: CreateSupportDto): Promise<Support> {
    const createdSupport = new this.supportModel(createSupportDto);
    return createdSupport.save();
  }

  async findAll(): Promise<Support[]> {
    return this.supportModel.find().exec();
  }

  async findOne(id: string): Promise<Support> {
    const support = await this.supportModel.findById(id).exec();
    if (!support) {
      throw new NotFoundException(`Support with ID ${id} not found`);
    }
    return support;
  }

  async update(
    id: string,
    updateSupportDto: UpdateSupportDto,
  ): Promise<Support> {
    const updatedSupport = await this.supportModel
      .findByIdAndUpdate(id, updateSupportDto, { new: true })
      .exec();

    if (!updatedSupport) {
      throw new NotFoundException(`Support with ID ${id} not found`);
    }

    return updatedSupport;
  }

  async remove(id: string): Promise<void> {
    const result = await this.supportModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Support with ID ${id} not found`);
    }
  }
}
