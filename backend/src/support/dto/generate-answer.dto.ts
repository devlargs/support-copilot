import { IsString, IsNotEmpty } from 'class-validator';

export class GenerateAnswerDto {
    @IsString()
    @IsNotEmpty()
    question: string;
}
