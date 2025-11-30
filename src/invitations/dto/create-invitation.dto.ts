import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { MemberRole } from '../../common/enums/member-role.enum';

export class CreateInvitationDto {
    @ApiProperty({
        example: 'newuser@example.com',
        description: 'Email address of user to invite',
    })
    @IsNotEmpty()
    @IsEmail({}, { message: 'Please provide a valid email address' })
    email: string;

    @ApiProperty({
        enum: MemberRole,
        example: MemberRole.MEMBER,
        description: 'Role to assign to invited user',
        default: MemberRole.MEMBER,
        required: false,
    })
    @IsOptional()
    @IsEnum(MemberRole, { message: 'Role must be either OWNER or MEMBER' })
    role?: MemberRole;
}
