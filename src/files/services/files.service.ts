import { Injectable, Logger } from '@nestjs/common';
import { AwsS3Service, LocalStorageService } from '../services';
import { ProviderDTO } from '../dto/provider.dto';
import { MediaProvider } from '../../common/mock/constant.mock';
import { DOSpaceService } from './do-space.service';

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);

  /**
   * Constructor
   * @param {service<AwsS3Service>} awsS3Service
   * @param {service<LocalStorageService>} localStorageService
   */
  constructor(
    private readonly doSpacesService: DOSpaceService,
    private readonly awsS3Service: AwsS3Service,
    private readonly localStorageService: LocalStorageService,
  ) {}

  /**
   * Upload File
   * @param {Express.Multer.File} file
   * @param {ProviderDTO} providerDto
   * @returns {Promise<Object>}
   */
  async upload(file: Express.Multer.File, providerDto?: ProviderDTO) {
    const PROVIDER = providerDto?.provider || process.env.FILE_SPACE_PROVIDER;
    console.log(PROVIDER);
    this.logger.log(PROVIDER + ' Provider');
    const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;
    const response = {
      Location: '',
      provider: PROVIDER,
    };

    switch (PROVIDER) {
      case MediaProvider.DO_SPACE:
        const doLocation: any = await this.doSpacesService.uploadToDOSpace(
          file,
        );
        response.Location = doLocation.Location;
        return response;
      case MediaProvider.AWS_S3:
        const awsLocation: any = (
          await this.awsS3Service.uploadToS3(file, AWS_BUCKET_NAME)
        ).Location;
        response.Location = awsLocation.Location;
        return response;

      case MediaProvider.LOCAL:
        const publicKey = await (
          await this.localStorageService.upload(file)
        ).publicKey;
        const localLocation = process.env.BE_HOST + '/file/local/' + publicKey;
        response.Location = localLocation;
        this.logger.log('Path: ' + localLocation);
        return response;
    }
  }

  async uploadFromFolder(
    file: Buffer,
    filename: string,
    providerDto?: ProviderDTO,
  ) {
    const PROVIDER = providerDto?.provider || process.env.FILE_SPACE_PROVIDER;
    console.log(PROVIDER);
    this.logger.log(PROVIDER + ' Provider');
    const response = {
      Location: '',
      provider: PROVIDER,
    };

    switch (PROVIDER) {
      case MediaProvider.DO_SPACE:
        const doLocation: any =
          await this.doSpacesService.uploadToDOSpaceFromFolder(file, filename);
        response.Location = doLocation.Location;
        return response;
    }
  }
}
