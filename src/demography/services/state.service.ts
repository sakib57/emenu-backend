import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from '../../user/interfaces';
import { IPaginatedState, IState } from '../interfaces';
import { CreateStateDTO } from '../dto/state/create-state.dto';
import { UpdateStateDTO } from '../dto/state/update-state.dto';
import { StateDTO } from '../dto/state/state.dto';
import { StateSearchQueryDTO } from '../dto/state/state-search-query.dto';
import { createSearchQuery } from '../../common/utils/helper';

/**
 * State Service
 */
@Injectable()
export class StateService {
  /**
   * Constructor
   * @param {Model<IState>} stateModel
   */
  constructor(
    @InjectModel('State')
    private readonly stateModel: Model<IState>,
  ) {}

  /**
   * Create state
   * @param {IUser} user
   * @param {CreateCountryDTO} createStateDTO
   * @returns {Promise<IState>}
   */
  create(user: IUser, createStateDTO: CreateStateDTO): Promise<IState> {
    try {
      const stateDTO = new StateDTO();
      stateDTO.slug = createStateDTO.name
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/['"<>@+?.,\/#!$%&;:{}=`~()]/g, '')
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, '');
      stateDTO.cBy = user._id;
      const setState = { ...createStateDTO, ...stateDTO };
      const registerDoc = new this.stateModel(setState);
      return registerDoc.save();
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Edit state
   * @param {string} id
   * @param {UpdateStateDTO} updateStateDTO
   * @returns {Promise<IState>} mutated state data
   */
  async update(id: string, updateStateDTO: UpdateStateDTO): Promise<IState> {
    try {
      const state = await this.stateModel.findOne({ _id: id });
      if (!state) {
        return Promise.reject(new NotFoundException('Could not find state.'));
      }
      const stateDTO = new StateDTO();
      const setState = { ...updateStateDTO, ...stateDTO };

      return await state.set(setState).save();
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Fetches states
   * @returns {Promise<IPaginatedState>}
   */
  async findAll(query: StateSearchQueryDTO): Promise<IPaginatedState> {
    try {
      const searchQuery = createSearchQuery(query);
      const limit: number = (query && query.limit) || 10;
      const skip: number = (query && query.skip) || 0;

      const cursor = this.stateModel.find(searchQuery).sort('name ASC');

      if (query.hasOwnProperty('sort') && query.sort) {
        cursor.sort(JSON.parse(query.sort));
      }

      const result: IPaginatedState = {
        data: await cursor
          .populate('cities')
          .populate('country')
          .limit(limit)
          .skip(skip),
      };

      if (query.pagination) {
        result.pagination = {
          total: await this.stateModel.countDocuments(searchQuery),
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
   * find state by stateId
   * @param {string} id
   * @returns {Promise<IState>}
   */
  async findOne(id: string): Promise<IState> {
    try {
      const state = await this.stateModel
        .findOne({ _id: id })
        .populate({
          path: 'cities',
        })
        .populate('country')
        .exec();
      if (!state) {
        return Promise.reject(new NotFoundException('Could not find state.'));
      }
      return state;
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }
}
