import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TransferOwnershipDto {
    @ApiProperty({
        example: 'clx1234567890',
        description: 'User ID of the new owner',
    })
    @IsNotEmpty()
    @IsString()
    newOwnerId: string;
}
