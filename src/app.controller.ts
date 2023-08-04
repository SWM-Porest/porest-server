import { Controller, Get, HttpException, HttpStatus, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';

@Controller()
export class AppController {
  @Get('uploads/:upload_type/:filename')
  async gettFile(@Param('upload_type') upload_type: string, @Param('filename') filename: string, @Res() res: Response) {
    if (process.env.NODE_ENV != 'dev') throw new HttpException('Not Found', HttpStatus.NOT_FOUND);

    if (fs.existsSync(`uploads/${upload_type}/${filename}`)) {
      res.sendFile(filename, { root: `uploads/${upload_type}` });
    } else {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }
}
