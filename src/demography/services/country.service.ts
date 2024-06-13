import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from '../../user/interfaces';
import { CreateCountryDTO } from '../dto/country/create-country.dto';
import { UpdateCountryDTO } from '../dto/country/update-country.dto';
import { CountryDTO } from '../dto/country/country.dto';
import { ICountry, IPaginatedCountry } from '../interfaces';
import { SearchQueryDTO } from '../../common/dto/searchquery.dto';
import { createSearchQuery } from '../../common/utils/helper';

/**
 * Country Service
 */
@Injectable()
export class CountryService {
  private readonly logger = new Logger(CountryService.name);
  /**
   * Constructor
   * @param {Model<ICountry>} countryModel
   */
  constructor(
    @InjectModel('Country')
    private readonly countryModel: Model<ICountry>,
  ) {}

  /**
   * Create country
   * @param {IUser} user
   * @param {CreateCountryDTO} createCountryDTO
   * @returns {Promise<ICountry>}
   */
  create(user: IUser, createCountryDTO: CreateCountryDTO): Promise<ICountry> {
    try {
      const countryDTO = new CountryDTO();
      countryDTO.slug = createCountryDTO.name
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/['"<>@+?.,\/#!$%&;:{}=`~()]/g, '')
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, '');
      countryDTO.cBy = user._id;
      const setCountry = { ...createCountryDTO, ...countryDTO };
      const registerDoc = new this.countryModel(setCountry);
      return registerDoc.save();
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Edit country
   * @param {string} id
   * @param {UpdateCountryDTO} updateCountryDTO
   * @param {IUser} user
   * @returns {Promise<ICountry>} mutated country data
   */
  async update(
    id: string,
    updateCountryDTO: UpdateCountryDTO,
    user: IUser,
  ): Promise<ICountry> {
    try {
      const country = await this.countryModel.findOne({ _id: id });
      if (!country) {
        return Promise.reject(new NotFoundException('Could not find country.'));
      }
      const countryDTO = new CountryDTO();
      countryDTO.uBy = user._id;
      countryDTO.uTime = Date.now();
      const setCountry = { ...updateCountryDTO, ...countryDTO };

      return await country.set(setCountry).save();
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Fetches countries
   * @returns {Promise<IPaginatedCountry>}
   */
  public async findAll(query: SearchQueryDTO): Promise<IPaginatedCountry> {
    try {
      const searchQuery = createSearchQuery(query);
      const limit: number = (query && query.limit) || 10;
      const skip: number = (query && query.skip) || 0;

      const cursor = this.countryModel.find(searchQuery).sort('name ASC');

      if (query.hasOwnProperty('sort') && query.sort) {
        cursor.sort(JSON.parse(query.sort));
      }

      const result: IPaginatedCountry = {
        data: await cursor
          .populate({
            path: 'states',
            populate: {
              path: 'cities',
            },
          })
          .limit(limit)
          .skip(skip),
      };

      if (query.pagination) {
        result.pagination = {
          total: await this.countryModel.countDocuments(searchQuery),
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
