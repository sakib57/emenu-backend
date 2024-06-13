import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from '../../user/interfaces';
import { CreateMenuDTO, UpdateMenuDTO, SearchMenuDTO, MenuDTO } from '../dto';
import { IMenu, IPaginateMenu } from '../interfaces';
import {
  createSearchQuery,
  subDocUpdateWithArray,
  subDocUpdateWithObj,
} from '../../common/utils/helper';
import { MediaDTO } from '../../common/dto';
import * as moment from 'moment-timezone';
import { MediaType } from '../../common/mock/constant.mock';
import { IRestaurant } from '../../restaurant/interfaces';
import { FilesService } from '../../files/services/files.service';

@Injectable()
export class MenuService {
  private readonly AWS_MENU_IMG_BUCKET = 'MenuImage';
  /**
   * Constructor
   * @param {Model<IMenu>} menuModel
   * @param {Model<IRestaurant>} restaurantModel
   * @param {Service<AwsS3Service>} filesService
   */
  constructor(
    @InjectModel('Menu')
    private readonly menuModel: Model<IMenu>,
    @InjectModel('Restaurant')
    private readonly restaurantModel: Model<IRestaurant>,
    private readonly filesService: FilesService,
  ) {}

  /**
   * Create Menu
   * @param {IUser} user
   * @param {CreateMenuDTO} cMenuDTO
   * @returns {Promise<IMenu>}
   */
  async create(user: IUser, cMenuDTO: CreateMenuDTO): Promise<IMenu> {
    try {
      const menuDTO = new MenuDTO();
      menuDTO.cBy = user._id;
      const time =
        (cMenuDTO?.timezone && moment().tz(cMenuDTO.timezone).valueOf()) ||
        Date.now();
      menuDTO.cTime = time;
      menuDTO.uTime = time;
      const setMenu = {
        ...cMenuDTO,
        ...menuDTO,
      };
      const registerDoc = new this.menuModel(setMenu);
      return registerDoc.save();
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Edit Menu
   * @param {string} id
   * @param {UpdateMenuDTO} uMenuDTO
   * @param files
   * @param {IUser} user
   * @returns {Promise<IMenu>}
   */
  async update(
    id: string,
    uMenuDTO: UpdateMenuDTO,
    files: {
      thumbnail?: Express.Multer.File[];
      pictures?: Express.Multer.File[];
      videos?: Express.Multer.File[];
    },
    user: IUser,
  ): Promise<IMenu> {
    try {
      const menu = await this.menuModel.findOne({ _id: id });

      if (!menu) {
        return Promise.reject(new NotFoundException('Could not find menu.'));
      }

      const menuDTO = new MenuDTO();

      if (files) {
        if (files && files.thumbnail) {
          const { mimetype } = files.thumbnail[0];
          const uploadRes = await this.filesService.upload(files.thumbnail[0]);
          const mediaDTO = new MediaDTO();
          mediaDTO.uri = uploadRes.Location;
          mediaDTO.mimetype = mimetype;
          const menuThumbnail = menu.get('thumbnail') || {};
          menuDTO.thumbnail = subDocUpdateWithObj(menuThumbnail, mediaDTO);
        }

        if (files && files.pictures) {
          const pictures = await Promise.all(
            files.pictures.map(async (picture) => {
              const { mimetype } = picture;
              const uploadRes = await this.filesService.upload(picture);
              const mediaDTO = new MediaDTO();
              mediaDTO.uri = uploadRes.Location;
              mediaDTO.mimetype = mimetype;
              return mediaDTO;
            }),
          );

          const menuPictures = menu.get('pictures') || [];
          menuDTO.pictures = subDocUpdateWithArray(menuPictures, pictures);
        }

        if (files && files.videos) {
          const videos = await Promise.all(
            files.videos.map(async (videos) => {
              const { mimetype } = videos;
              const uploadRes = await this.filesService.upload(videos);
              const mediaDTO = new MediaDTO();
              mediaDTO.uri = uploadRes.Location;
              mediaDTO.mimetype = mimetype;
              mediaDTO.type = MediaType.VIDEO;
              return mediaDTO;
            }),
          );

          const menuVideos = menu.get('videos') || [];
          menuDTO.videos = subDocUpdateWithArray(menuVideos, videos);
        }
      }
      menuDTO.uBy = user._id;
      menuDTO.uTime =
        (uMenuDTO?.timezone && moment().tz(uMenuDTO.timezone).valueOf()) ||
        Date.now();
      const setMenu = {
        ...uMenuDTO,
        ...menuDTO,
      };

      return await menu.set(setMenu).save();
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Find All menu of a restaurant
   * @returns {Promise<IPaginateMenu>}
   */
  async findAll(query: SearchMenuDTO): Promise<IPaginateMenu> {
    try {
      const searchQuery = createSearchQuery(query);
      const limit: number = (query && query.limit) || 10;
      const skip: number = (query && query.skip) || 0;

      let restaurant = undefined;
      if (
        searchQuery &&
        searchQuery.hasOwnProperty('restaurant') &&
        searchQuery.restaurant
      ) {
        // this is assumed the restaurant parameter will have one restaurant id
        restaurant = await this.restaurantModel
          .findOne({
            restaurant: searchQuery.restaurant,
          })
          .exec();
      }

      const cursor = this.menuModel
        .find(searchQuery)
        .populate({
          path: 'category',
        })
        .limit(limit)
        .skip(skip);

      if (query.hasOwnProperty('sort') && query.sort) {
        cursor.sort(JSON.parse(query.sort));
      }

      const result: IPaginateMenu = {
        data: {
          menus: await cursor.exec(),
          ...(restaurant ? { restaurant: restaurant } : {}),
        },
      };

      if (query.pagination) {
        result.pagination = {
          total: await this.menuModel.countDocuments(searchQuery),
          limit,
          skip,
        };
      }
      return result;
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * count menu
   * @returns {Promise<number>}
   */
  async count(query: SearchMenuDTO): Promise<number> {
    try {
      const searchQuery = createSearchQuery(query);
      return this.menuModel.countDocuments(searchQuery);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }
}
