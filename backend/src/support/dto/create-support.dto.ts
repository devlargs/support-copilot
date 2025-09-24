import { IsString, IsNotEmpty } from 'class-validator';

export class CreateSupportDto {
  @IsString()
  @IsNotEmpty()
  question: string;

  @IsString()
  @IsNotEmpty()
  answer: string;
}
