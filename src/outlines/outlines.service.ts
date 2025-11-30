import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateOutlineDto } from './dto/create-outline.dto';
import { UpdateOutlineDto } from './dto/update-outline.dto';

@Injectable()
export class OutlinesService {
    constructor(private prisma: PrismaService) { }

    async create(organizationId: string, createOutlineDto: CreateOutlineDto) {
        return this.prisma.outline.create({
            data: {
                ...createOutlineDto,
                organizationId,
            },
        });
    }

    async findAll(organizationId: string) {
        return this.prisma.outline.findMany({
            where: { organizationId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(organizationId: string, id: string) {
        const outline = await this.prisma.outline.findFirst({
            where: { id, organizationId },
        });

        if (!outline) {
            throw new NotFoundException('Outline not found');
        }

        return outline;
    }

    async update(organizationId: string, id: string, updateOutlineDto: UpdateOutlineDto) {
        // Ensure existence and ownership
        await this.findOne(organizationId, id);

        return this.prisma.outline.update({
            where: { id },
            data: updateOutlineDto,
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
