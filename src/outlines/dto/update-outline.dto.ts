import { PartialType } from '@nestjs/swagger';
import { CreateOutlineDto } from './create-outline.dto';

export class UpdateOutlineDto extends PartialType(CreateOutlineDto) { }
