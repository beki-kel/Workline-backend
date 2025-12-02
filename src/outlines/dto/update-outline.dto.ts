import { PartialType } from '@nestjs/swagger';
import { CreateOutlineDto } from './create-outline.dto.js';

export class UpdateOutlineDto extends PartialType(CreateOutlineDto) { }
