import {
  HttpException,
  HttpStatus,
  NotFoundException,
  NotAcceptableException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Status } from '../../common/mock/constant.mock';
import { IUser } from '../../user/interfaces';
import {
  CreateEmployeeDTO,
  UpdateEmployeeDTO,
  SearchEmployeeDTO,
  EmployeeDTO,
} from '../dto';
import { IEmployee, IPaginateEmployee, IRestaurant } from '../interfaces';
import * as moment from 'moment-timezone';
import { createSearchQuery } from '../../common/utils/helper';

export class EmployeeService {
  /**
   * Constructor
   * @param {Model<IEmployee>} employeeModel
   * @param {Model<IRestaurant>} restaurantModel
   * @param {Model<IUser>} userModel
   */
  constructor(
    @InjectModel('Employee')
    private readonly employeeModel: Model<IEmployee>,
    @InjectModel('Restaurant')
    private readonly restaurantModel: Model<IRestaurant>,
    @InjectModel('User')
    private readonly userModel: Model<IUser>,
  ) {}

  /**
   * Create employee
   * @param {IUser} user
   * @param {CreateEmployeeDTO} cEmployeeDTO
   * @returns {Promise<IEmployee>}
   */
  async create(
    user: IUser,
    cEmployeeDTO: CreateEmployeeDTO,
  ): Promise<IEmployee> {
    try {
      const employeeDTO = new EmployeeDTO();
      employeeDTO.cBy = user._id;
      const time =
        (cEmployeeDTO?.timezone &&
          moment().tz(cEmployeeDTO.timezone).valueOf()) ||
        Date.now();
      employeeDTO.cTime = time;
      employeeDTO.uTime = time;

      if (cEmployeeDTO.hasOwnProperty('email') && cEmployeeDTO.email) {
        const email = cEmployeeDTO.email.toLowerCase();
        const user = await this.userModel.findOne({
          email: email,
        });
        if (user) {
          cEmployeeDTO.user = user._id;
        } else {
          // Need to email the user to create his account in eMenu and then join the restaurant
          return Promise.reject(
            new NotAcceptableException(`${email} does not have any account.`),
          );
        }
      }

      const setEmployee = { ...cEmployeeDTO, ...employeeDTO };
      const registerDoc = new this.employeeModel(setEmployee);
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
    uEmployeeDTO: UpdateEmployeeDTO,
  ): Promise<IEmployee> {
    try {
      if (uEmployeeDTO.hasOwnProperty('employee')) {
        return Promise.reject(
          new NotAcceptableException("Employee can't be changed"),
        );
      }

      if (uEmployeeDTO.hasOwnProperty('restaurant')) {
        return Promise.reject(
          new NotAcceptableException("Restaurant can't be changed"),
        );
      }

      const employee = await this.employeeModel.findOne({
        _id: id,
      });

      if (!employee) {
        return Promise.reject(
          new NotFoundException('Could not find the record.'),
        );
      }

      if (uEmployeeDTO.hasOwnProperty('isDeleted') && uEmployeeDTO.isDeleted) {
        if (employee.isOwner === true || employee.isAdmin === true) {
          return Promise.reject(
            new NotAcceptableException("Admin or owner can't be deleted"),
          );
        } else {
          uEmployeeDTO.isActive = false;
        }
      }

      if (
        uEmployeeDTO.hasOwnProperty('status') &&
        uEmployeeDTO.status &&
        uEmployeeDTO.status === Status.JOINED
      ) {
        uEmployeeDTO.isActive = true;
      }

      const employeeDTO = new EmployeeDTO();
      employeeDTO.uTime =
        (uEmployeeDTO?.timezone &&
          moment().tz(uEmployeeDTO.timezone).valueOf()) ||
        Date.now();
      employeeDTO.uBy = user && user._id;

      const setEmployee = {
        ...uEmployeeDTO,
        ...employeeDTO,
      };

      return await employee.set(setEmployee).save();
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Fetches all employees of a restaurant
   * @returns {Promise<IPaginateEmployee} queried employee data
   */
  public async findAllEmployee(
    query: SearchEmployeeDTO,
  ): Promise<IPaginateEmployee> {
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

      const cursor = this.employeeModel
        .find(searchQuery)
        .populate({
          path: 'user',
          populate: {
            path: 'profile',
          },
        })
        .limit(limit)
        .skip(skip)
        .sort('name ASC');

      if (query.hasOwnProperty('sort') && query.sort) {
        cursor.sort(JSON.parse(query.sort));
      }

      const result: IPaginateEmployee = {
        data: {
          employees: await cursor.exec(),
          ...(restaurant ? { restaurant: restaurant } : {}),
        },
      };

      if (query.pagination) {
        result.pagination = {
          total: await this.employeeModel.countDocuments(searchQuery),
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
   * count employees
   * @returns {Promise<number}
   */
  public async count(query: SearchEmployeeDTO): Promise<number> {
    try {
      const searchQuery = createSearchQuery(query);
      return this.employeeModel.countDocuments(searchQuery);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }
}
