import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Support, SupportDocument } from './schemas/support.schema';
import { CreateSupportDto } from './dto/create-support.dto';
import { UpdateSupportDto } from './dto/update-support.dto';
import { PaginationDto, PaginatedResponse } from './dto/pagination.dto';
import { GenerateAnswerDto } from './dto/generate-answer.dto';
import { AiService } from './ai.service';

@Injectable()
export class SupportService {
  constructor(
    @InjectModel(Support.name) private supportModel: Model<SupportDocument>,
    private readonly aiService: AiService,
  ) { }

  async create(createSupportDto: CreateSupportDto): Promise<Support> {
    const createdSupport = new this.supportModel(createSupportDto);
    return createdSupport.save();
  }

  async findAll(paginationDto: PaginationDto): Promise<PaginatedResponse<Support>> {
    const { page = 1, limit = 10, query } = paginationDto;
    const skip = (page - 1) * limit;

    // Build search query
    const searchQuery = query
      ? {
        $or: [
          { question: { $regex: query, $options: 'i' } },
          { answer: { $regex: query, $options: 'i' } }
        ]
      }
      : {};

    // Get total count
    const total = await this.supportModel.countDocuments(searchQuery).exec();

    // Get paginated results
    const data = await this.supportModel
      .find(searchQuery)
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip(skip)
      .limit(limit)
      .exec();

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
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

  async generateAnswer(generateAnswerDto: GenerateAnswerDto): Promise<{ answer: string }> {
    const { question } = generateAnswerDto;

    // Get existing support responses to use as context
    const existingResponses = await this.supportModel
      .find()
      .sort({ createdAt: -1 })
      .limit(20) // Get the 20 most recent responses for context
      .exec();

    // Use AI service to generate answer based on question and context
    const generatedAnswer = await this.aiService.generateAnswer(question, existingResponses);

    return { answer: generatedAnswer };
  }
}
