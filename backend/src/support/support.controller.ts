import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
} from '@nestjs/common';
import { SupportService } from './support.service';
import { CreateSupportDto } from './dto/create-support.dto';
import { UpdateSupportDto } from './dto/update-support.dto';
import { PaginationDto } from './dto/pagination.dto';
import { GenerateAnswerDto } from './dto/generate-answer.dto';

@Controller('support')
export class SupportController {
    constructor(private readonly supportService: SupportService) { }

    @Post()
    create(@Body() createSupportDto: CreateSupportDto) {
        return this.supportService.create(createSupportDto);
    }

    @Get()
    findAll(@Query() paginationDto: PaginationDto) {
        return this.supportService.findAll(paginationDto);
    }

    @Get('generateAnswers')
    generateAnswer(@Query() generateAnswerDto: GenerateAnswerDto) {
        return this.supportService.generateAnswer(generateAnswerDto);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.supportService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateSupportDto: UpdateSupportDto) {
        return this.supportService.update(id, updateSupportDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.supportService.remove(id);
    }
}
