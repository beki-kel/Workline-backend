import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller()
export class AppController {
    @Get()
    @ApiExcludeEndpoint()
    root(@Res() res: Response) {
        const frontendUrl = process.env.APP_URL || 'https://workline-frontend.vercel.app';
        return res.redirect(frontendUrl);
    }
}
