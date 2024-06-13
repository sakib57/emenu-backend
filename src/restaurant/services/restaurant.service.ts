import {HttpException, HttpStatus, Injectable, NotFoundException,} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {customAlphabet} from 'nanoid';
import {IUser} from '../../user/interfaces';
import {CreateEmployeeDTO, CreateRestaurantDTO, RestaurantDTO, SearchRestaurantDTO, UpdateRestaurantDTO,} from '../dto';
import {IEmployee, IPaginateRestaurant, IRestaurant} from '../interfaces';
import {createSearchQuery, generateId, subDocUpdateWithArray, subDocUpdateWithObj,} from '../../common/utils/helper';
import {MediaDTO} from '../../common/dto';
import * as moment from 'moment-timezone';
import {MediaType, RoleType, Status} from '../../common/mock/constant.mock';
import {EmployeeService} from './employee.service';
import {FilesService} from '../../files/services/files.service';

@Injectable()
export class RestaurantService {
  private readonly AWS_RESTAURANT_IMG_BUCKET = 'RestaurantImage';
  /**
   * Constructor
   * @param {Model<IRestaurant>} restaurantModel
   * @param {Model<IEmployee>} employeeModel
   * @param {Service<EmployeeService>} employeeService
   * @param {Service<AwsS3Service>} filesService
   */
  constructor(
    @InjectModel('Restaurant')
    private readonly restaurantModel: Model<IRestaurant>,
    @InjectModel('Employee')
    private readonly employeeModel: Model<IEmployee>,
    private readonly employeeService: EmployeeService,
    private readonly filesService: FilesService,
  ) {}

  /**
   * Create Restaurant
   * @param {IUser} user
   * @param {CreateRestaurantDTO} cRestaurantDTO
   * @returns {Promise<IRestaurant>}
   */
  async create(
    user: IUser,
    cRestaurantDTO: CreateRestaurantDTO,
  ): Promise<IRestaurant> {
    try {
      const lastRegistered = await this.restaurantModel
        .findOne()
        .select({ restaurantId: 1 })
        .sort({ $natural: -1 });
      const idNumber = lastRegistered?.restaurantId
        ? parseInt(lastRegistered.restaurantId.substring(3)) + 1
        : 1;
      const restaurantDTO = new RestaurantDTO();
      restaurantDTO.nameSlug = cRestaurantDTO.name
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/['"<>@+?.,\/#!$%&;:{}=`~()]/g, '')
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, '');
      const slug = customAlphabet(
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890',
        8,
      );
      restaurantDTO.slug = slug();
      restaurantDTO.restaurantId = generateId('RES', idNumber);
      restaurantDTO.cBy = user._id;
      restaurantDTO.profilePercentage = 25;

      if (
        cRestaurantDTO &&
        cRestaurantDTO.hasOwnProperty('location') &&
        cRestaurantDTO.location.lng &&
        cRestaurantDTO.location.lng
      ) {
        cRestaurantDTO.location.type = 'Point';
        cRestaurantDTO.location.coordinates = [
          cRestaurantDTO.location.lng,
          cRestaurantDTO.location.lat,
        ];
      }

      const time =
        (cRestaurantDTO?.timezone &&
          moment().tz(cRestaurantDTO.timezone).valueOf()) ||
        Date.now();
      restaurantDTO.cTime = time;
      restaurantDTO.uTime = time;
      const setRestaurant = {
        ...cRestaurantDTO,
        ...restaurantDTO,
      };
      const registerDoc = new this.restaurantModel(setRestaurant);
      const restaurant = await registerDoc.save();

      const employeeDTO = new CreateEmployeeDTO();
      employeeDTO.user = user && user._id;
      employeeDTO.restaurant = restaurant._id;
      employeeDTO.status = Status.JOINED;
      employeeDTO.role = RoleType.BRANCH_MANAGER;
      employeeDTO['isActive'] = true;
      employeeDTO['isAdmin'] = true;
      employeeDTO['isOwner'] = true;
      employeeDTO['isBranchManager'] = true;
      await this.employeeService.create(user, employeeDTO);

      return restaurant;
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Edit restaurant
   * @param {string} id
   * @param {UpdateRestaurantDTO} uRestaurantDTO
   * @param files
   * @param {IUser} user
   * @returns {Promise<IRestaurant>}
   */
  async update(
    id: string,
    uRestaurantDTO: UpdateRestaurantDTO,
    files: {
      thumbnail?: Express.Multer.File[];
      pictures?: Express.Multer.File[];
      videos?: Express.Multer.File[];
    },
    user: IUser,
  ): Promise<IRestaurant> {
    try {
      const restaurant = await this.restaurantModel.findOne({ _id: id });

      if (!restaurant) {
        return Promise.reject(
          new NotFoundException('Could not find restaurant.'),
        );
      }

      const restaurantDTO = new RestaurantDTO();

      if (files) {
        if (files && files.thumbnail) {
          const { mimetype } = files.thumbnail[0];
          const uploadRes = await this.filesService.upload(files.thumbnail[0]);
          const mediaDTO = new MediaDTO();
          mediaDTO.uri = uploadRes.Location;
          mediaDTO.mimetype = mimetype;
          const restaurantLogo = restaurant.get('thumbnail') || {};
          restaurantDTO.thumbnail = subDocUpdateWithObj(
            restaurantLogo,
            mediaDTO,
          );
          if (restaurant.profilePercentage === 50) {
            restaurantDTO.profilePercentage = 75;
          }
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

          const restaurantPictures = restaurant.get('pictures') || [];
          restaurantDTO.pictures = subDocUpdateWithArray(
            restaurantPictures,
            pictures,
          );
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

          const restaurantVideos = restaurant.get('videos') || [];
          restaurantDTO.videos = subDocUpdateWithArray(
            restaurantVideos,
            videos,
          );
        }
      } else {
        if (
          uRestaurantDTO &&
          uRestaurantDTO.hasOwnProperty('name') &&
          uRestaurantDTO.name
        ) {
          restaurantDTO.nameSlug = uRestaurantDTO.name
            .toString()
            .toLowerCase()
            .replace(/\s+/g, '-') // Replace spaces with -
            .replace(/['"<>@+?.,\/#!$%&;:{}=`~()]/g, '')
            .replace(/[^\w\-]+/g, '') // Remove all non-word chars
            .replace(/-+/g, '-') // Replace multiple - with single -
            .replace(/^-+/, '') // Trim - from start of text
            .replace(/-+$/, '');
        }

        if (uRestaurantDTO && uRestaurantDTO.hasOwnProperty('location')) {
          if (uRestaurantDTO.location.lng && uRestaurantDTO.location.lng) {
            uRestaurantDTO.location.type = 'Point';
            uRestaurantDTO.location.coordinates = [
              uRestaurantDTO.location.lat,
              uRestaurantDTO.location.lng,
            ];
          }
        }

        if (uRestaurantDTO && uRestaurantDTO.hasOwnProperty('mobile')) {
          const restaurantMobile = restaurant.get('mobile') || {};
          restaurantDTO.mobile = subDocUpdateWithObj(
            restaurantMobile,
            uRestaurantDTO.mobile,
          );
        }

        if (uRestaurantDTO && uRestaurantDTO.hasOwnProperty('socials')) {
          const restaurantSocials = restaurant.get('socials') || [];
          restaurantDTO.socials = subDocUpdateWithArray(
            restaurantSocials,
            uRestaurantDTO.socials,
          );
        }
      }

      restaurantDTO.uBy = user._id;
      restaurantDTO.uTime =
        (uRestaurantDTO?.timezone &&
          moment().tz(uRestaurantDTO.timezone).valueOf()) ||
        Date.now();
      const setRestaurant = {
        ...uRestaurantDTO,
        ...restaurantDTO,
      };

      return await restaurant.set(setRestaurant).save();
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Find All restaurant
   * @returns {Promise<IPaginateRestaurant>}
   */
  async findAll(query: SearchRestaurantDTO): Promise<IPaginateRestaurant> {
    try {
      let sortQuery: any = { $natural: -1 };
      const searchQuery = createSearchQuery(query);
      const limit: number = (query && query.limit) || 10;
      const skip: number = (query && query.skip) || 0;

      if (query.hasOwnProperty('sort') && query.sort) {
        sortQuery = JSON.parse(query.sort);
      }

      if (
        query.hasOwnProperty('distance') &&
        query.hasOwnProperty('lat') &&
        query.hasOwnProperty('lng')
      ) {
        sortQuery = '';
        searchQuery['location.coordinates'] = {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [query.lat, query.lng],
            },
            $maxDistance: query.distance,
            $minDistance: 0,
          },
        };
      }

      const cursor = this.restaurantModel
        .find(searchQuery)
        .populate({
          path: 'location.city',
          model: 'City',
          select: { _id: 1, name: 1 },
        })
        .populate({
          path: 'location.state',
          model: 'State',
          select: { _id: 1, name: 1 },
        })
        .populate({
          path: 'location.country',
          model: 'Country',
          select: { _id: 1, name: 1 },
        })
        .populate({
          path: 'employee',
          select: {
            _id: 1,
            user: 1,
            isPaid: 1,
            status: 1,
            isAdmin: 1,
            isOwner: 1,
          },
          populate: {
            path: 'user',
            populate: {
              path: 'profile',
              select: {
                _id: 1,
                firstName: 1,
                middleName: 1,
                lastName: 1,
                profilePic: 1,
              },
            },
          },
        })
        .limit(limit)
        .skip(skip)
        .sort(sortQuery);

      const result: IPaginateRestaurant = {
        data: await cursor.exec(),
      };

      if (query.pagination) {
        result.pagination = {
          total: await this.restaurantModel.countDocuments(searchQuery),
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
   * count restaurant
   * @returns {Promise<number>}
   */
  async count(query: SearchRestaurantDTO): Promise<number> {
    try {
      const searchQuery = createSearchQuery(query);

      if (
        query.hasOwnProperty('distance') &&
        query.hasOwnProperty('lat') &&
        query.hasOwnProperty('lng')
      ) {
        searchQuery['location.coordinates'] = {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [query.lat, query.lng],
            },
            $maxDistance: query.distance,
            $minDistance: 0,
          },
        };
      }

      return this.restaurantModel.countDocuments(searchQuery);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }
}
