import {
  HttpException,
  HttpStatus,
  NotFoundException,
  NotAcceptableException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from '../../user/interfaces';
import { IRestaurant } from '../../restaurant/interfaces';
import {
  createSearchQuery,
  subDocUpdateWithArray,
  subDocUpdateWithObj,
} from '../../common/utils/helper';
import { ICategory } from '../interfaces/category.interface';
import * as moment from 'moment-timezone';
import {
  CategoryDTO,
  CreateCategoryDTO,
  SearchCategoryDTO,
  UpdateCategoryDTO,
} from '../dto';
import { IPaginateCategory } from '../interfaces';
import { MediaDTO } from '../../common/dto';
import { MediaType } from '../../common/mock/constant.mock';
import { FilesService } from '../../files/services/files.service';

@Injectable()
export class CategoryService {
  /**
   * Constructor
   * @param {Model<ICategory>} categoryModel
   * @param {Model<IRestaurent>} restaurantModel
   */
  constructor(
    @InjectModel('Category')
    private readonly categoryModel: Model<ICategory>,
    @InjectModel('Restaurant')
    private readonly restaurantModel: Model<IRestaurant>,
    private readonly filesService: FilesService,
  ) {}

  /**
   * Create category
   * @param {IUser} user
   * @param {CreateCategoryDTO} cCategoryDTO
   * @returns {Promise<ICategory>}
   */
  async create(
    user: IUser,
    cCategoryDTO: CreateCategoryDTO,
  ): Promise<ICategory> {
    try {
      const categoryDTO = new CategoryDTO();
      categoryDTO.cBy = user._id;
      const time =
        (cCategoryDTO?.timezone &&
          moment().tz(cCategoryDTO.timezone).valueOf()) ||
        Date.now();
      categoryDTO.cTime = time;
      categoryDTO.uTime = time;
      const setCategory = { ...cCategoryDTO, ...categoryDTO };
      const registerDoc = new this.categoryModel(setCategory);
      return registerDoc.save();
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Edit employee
   * @param {string} id
   * @param {IUser} user
   * @param {UpdateEmployeeDTO} uEmployeeDTO
   * @returns {Promise<IEmployee>}
   */
  async update(
    id: string,
    user: IUser,
    files: {
      thumbnail?: Express.Multer.File[];
      pictures?: Express.Multer.File[];
      videos?: Express.Multer.File[];
    },
    uCategoryDTO: UpdateCategoryDTO,
  ): Promise<ICategory> {
    try {
      const category = await this.categoryModel.findOne({
        _id: id,
      });

      if (!category) {
        return Promise.reject(
          new NotFoundException('Could not found the category.'),
        );
      }

      const categoryDTO = new CategoryDTO();
      if (files) {
        if (files && files.thumbnail) {
          const { mimetype } = files.thumbnail[0];
          const uploadRes = await this.filesService.upload(files.thumbnail[0]);
          const mediaDTO = new MediaDTO();
          mediaDTO.uri = uploadRes.Location;
          mediaDTO.mimetype = mimetype;
          const menuThumbnail = category.get('thumbnail') || {};
          categoryDTO.thumbnail = subDocUpdateWithObj(menuThumbnail, mediaDTO);
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

          const menuPictures = category.get('pictures') || [];
          categoryDTO.pictures = subDocUpdateWithArray(menuPictures, pictures);
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

          const menuVideos = category.get('videos') || [];
          categoryDTO.videos = subDocUpdateWithArray(menuVideos, videos);
        }
      }
      const time =
        (uCategoryDTO?.timezone &&
          moment().tz(uCategoryDTO.timezone).valueOf()) ||
        Date.now();
      categoryDTO.uTime = time;
      categoryDTO.uBy = user && user._id;

      const setCategory = {
        ...uCategoryDTO,
        ...categoryDTO,
      };

      return await category.set(setCategory).save();
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Fetches all category
   * @returns {Promise<IPaginateCategory} queried category data
   */
  public async findAllCategory(
    query: SearchCategoryDTO,
  ): Promise<IPaginateCategory> {
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

      const cursor = this.categoryModel
        .find(searchQuery)
        .limit(limit)
        .skip(skip)
        .sort('name ASC');

      if (query.hasOwnProperty('sort') && query.sort) {
        cursor.sort(JSON.parse(query.sort));
      }

      const result: IPaginateCategory = {
        data: {
          categories: await cursor.exec(),
          ...(restaurant ? { restaurant: restaurant } : {}),
        },
      };

      if (query.pagination) {
        result.pagination = {
          total: await this.categoryModel.countDocuments(searchQuery),
          limit,
          skip,
        };
      }
      return result;
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }
}
