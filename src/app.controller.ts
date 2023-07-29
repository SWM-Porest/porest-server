import { Controller, Get, HttpException, HttpStatus, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import { UPLOAD_TYPE } from './common/uploader/upload-type';

@Controller()
export class AppController {
  @Get('uploads/:filename')
  async gettFile(@Param('filename') filename: string, @Res() res: Response) {
    if (process.env.NODE_ENV != 'dev') throw new HttpException('Not Found', HttpStatus.NOT_FOUND);

    if (fs.existsSync(`uploads/${UPLOAD_TYPE.RESTAURANT_BANNER}/${filename}`)) {
      res.sendFile(filename, { root: `uploads/${UPLOAD_TYPE.RESTAURANT_BANNER}` });
    } else if (fs.existsSync(`uploads/${UPLOAD_TYPE.MENU}/${filename}`)) {
      res.sendFile(filename, { root: `uploads/${UPLOAD_TYPE.MENU}` });
    } else {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }
}
