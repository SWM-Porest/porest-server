import * as AWS from 'aws-sdk';
import * as fs from 'fs';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UploadType } from 'aws-sdk/clients/devicefarm';

@Injectable()
export class ImageUploadService {
  uploadImage(files: Express.Multer.File[], upload_type: UploadType): Promise<string[]> {
    return process.env.NODE_ENV === 'release'
      ? this.uploadImageAWSS3(files, upload_type)
      : this.uploadImagelocal(files, upload_type);
  }

  private convertFileName(file: Express.Multer.File): string {
    return Date.now() + '_' + file.originalname.replace(/ /g, '-');
  }

  private async uploadImagelocal(files: Express.Multer.File[], upload_type: UploadType): Promise<string[]> {
    return files.map((file) => {
      const savedFilename: string = this.convertFileName(file);
      const path: string = process.env.LOCAL_IMAGE_PATH + upload_type;

      try {
        if (!fs.existsSync(path)) {
          fs.mkdirSync(path);
        }
        fs.writeFileSync(path + savedFilename, file.buffer);
      } catch (error) {
        throw new HttpException('Failed to upload the image to local.', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      return process.env.UPLOAD_PATH + savedFilename;
    });
  }

  private async uploadImageAWSS3(files: Express.Multer.File[], upload_type: UploadType): Promise<string[]> {
    return Promise.all(
      files.map(async (file) => {
        AWS.config.update({
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_KEY,
          },
        });

        const savedFilename = this.convertFileName(file);
        const s3 = new AWS.S3();

        try {
          await s3
            .putObject({
              Key: savedFilename,
              Body: file.buffer,
              Bucket: process.env.AWS_S3_BUCKET_NAME + '/images' + upload_type,
            })
            .promise();
        } catch (error) {
          console.error(error);
          throw new HttpException('Failed to upload the image to AWS S3.', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return process.env.AWS_UPLOAD_PATH + upload_type + savedFilename;
      }),
    );
  }
}
