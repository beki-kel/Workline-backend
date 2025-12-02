import { Module } from '@nestjs/common';
import { OutlinesService } from './outlines.service.js';
import { OutlinesController } from './outlines.controller.js';

@Module({
    controllers: [OutlinesController],
    providers: [OutlinesService],
})
export class OutlinesModule { }
