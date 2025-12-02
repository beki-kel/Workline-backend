import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';
import { CreateOutlineDto } from './dto/create-outline.dto.js';
import { UpdateOutlineDto } from './dto/update-outline.dto.js';

@Injectable()
export class OutlinesService {
    constructor(private prisma: PrismaService) { }

    async create(organizationId: string, createOutlineDto: CreateOutlineDto) {
        // Validate reviewer
        const reviewerMember = await this.prisma.member.findUnique({
            where: {
                userId_organizationId: {
                    userId: createOutlineDto.reviewerId,
                    organizationId,
                },
            },
        });

        if (!reviewerMember) {
            throw new BadRequestException('Reviewer must be a member of this organization');
        }

        if (reviewerMember.role !== 'owner' && reviewerMember.role !== 'admin') {
            throw new BadRequestException('Reviewer must be an owner or admin');
        }

        return this.prisma.outline.create({
            data: {
                ...createOutlineDto,
                organizationId,
            },
            include: {
                reviewer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }

    async findAll(organizationId: string) {
        return this.prisma.outline.findMany({
            where: { organizationId },
            orderBy: { createdAt: 'desc' },
            include: {
                reviewer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }

    async findOne(organizationId: string, id: string) {
        const outline = await this.prisma.outline.findFirst({
            where: { id, organizationId },
            include: {
                reviewer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        if (!outline) {
            throw new NotFoundException('Outline not found');
        }

        return outline;
    }

    async update(organizationId: string, id: string, updateOutlineDto: UpdateOutlineDto) {
        // Ensure existence and ownership
        await this.findOne(organizationId, id);

        if (updateOutlineDto.reviewerId) {
            // Validate reviewer
            const reviewerMember = await this.prisma.member.findUnique({
                where: {
                    userId_organizationId: {
                        userId: updateOutlineDto.reviewerId,
                        organizationId,
                    },
                },
            });

            if (!reviewerMember) {
                throw new BadRequestException('Reviewer must be a member of this organization');
            }

            if (reviewerMember.role !== 'owner' && reviewerMember.role !== 'admin') {
                throw new BadRequestException('Reviewer must be an owner or admin');
            }
        }

        return this.prisma.outline.update({
            where: { id },
            data: updateOutlineDto,
            include: {
                reviewer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }

    async remove(organizationId: string, id: string) {
        // Ensure existence and ownership
        await this.findOne(organizationId, id);

        return this.prisma.outline.delete({
            where: { id },
        });
    }
}
