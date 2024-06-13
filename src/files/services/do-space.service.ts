import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { DoSpacesServiceLib } from '../helper/do-space.helper';

@Injectable()
export class DOSpaceService {
  constructor(@Inject(DoSpacesServiceLib) private readonly s3: AWS.S3) {}

  /**
   * Upload File
   * @param {Express.Multer.File} file
   * @returns {Promise<Object>}
   */
  async uploadToDOSpace(file: Express.Multer.File) {
    const { buffer, originalname, mimetype } = file;
    const fileName = `${Date.now()}-${originalname}`;
    const params = {
      Bucket: process.env.DO_SPACE,
      Key: String(fileName),
      ContentType: mimetype || 'image/jpeg',
      Body: buffer,
      ACL: 'public-read',
    };
    try {
      return await this.s3.upload(params).promise();
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  async uploadToDOSpaceFromFolder(file: Buffer, filename: string) {
    const fileName = `${Date.now()}-${filename}`;
    const params = {
      Bucket: process.env.DO_SPACE,
      Key: String(fileName),
      ContentType: 'application/pdf',
      Body: file,
      ACL: 'public-read',
    };
    try {
      return await this.s3.upload(params).promise();
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }
}
