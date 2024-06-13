import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from '../../user/interfaces';
import {
  CreateOrderDTO,
  UpdateOrderDTO,
  SearchOrderDTO,
  OrderDTO,
} from '../dto';
import { IOrder, IPaginateOrder } from '../interfaces';
import { join } from 'path';
import {
  createSearchQuery,
  generateId,
  subDocUpdateWithArray,
} from '../../common/utils/helper';
import * as moment from 'moment-timezone';
import { IRestaurant } from '../../restaurant/interfaces';
import { IMenu } from 'src/menu/interfaces';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { OrderStatus } from '../../common/mock/constant.mock';

import * as pdf from 'pdf-creator-node';
import * as fs from 'fs';
import { FilesService } from 'src/files/services/files.service';
// import got from 'got';

@WebSocketGateway({ cors: true })
@Injectable()
export class OrderService {
  @WebSocketServer() server: Server;
  /**
   * Constructor
   * @param {Model<IOrder>} orderModel
   * @param {Model<IRestaurant>} restaurantModel
   */
  constructor(
    @InjectModel('Order')
    private readonly orderModel: Model<IOrder>,
    @InjectModel('Restaurant')
    private readonly restaurantModel: Model<IRestaurant>,
    private readonly fileService: FilesService,
  ) {}

  /**
   * Create Order
   * @param {IUser} user
   * @param {CreateOrderDTO} cOrderDTO
   * @returns {Promise<IOrder>}
   */
  async create(user: IUser, cOrderDTO: CreateOrderDTO): Promise<IOrder> {
    try {
      const lastRegistered = await this.orderModel
        .findOne()
        .select({ orderId: 1 })
        .sort({ $natural: -1 });
      const idNumber = lastRegistered?.orderId
        ? parseInt(lastRegistered.orderId.substring(3)) + 1
        : 1;
      const orderDTO = new OrderDTO();
      orderDTO.orderId = generateId('ORD', idNumber);
      if (
        cOrderDTO &&
        cOrderDTO.hasOwnProperty('location') &&
        cOrderDTO.location.lng &&
        cOrderDTO.location.lng
      ) {
        cOrderDTO.location.type = 'Point';
        cOrderDTO.location.coordinates = [
          cOrderDTO.location.lat,
          cOrderDTO.location.lng,
        ];
      }
      orderDTO.cBy = user._id;
      const time =
        (cOrderDTO?.timezone && moment().tz(cOrderDTO.timezone).valueOf()) ||
        Date.now();
      orderDTO.cTime = time;
      orderDTO.uTime = time;
      const setOrder = {
        ...cOrderDTO,
        ...orderDTO,
      };
      const registerDoc = new this.orderModel(setOrder);
      const newOrder: any = await registerDoc.save();
      const order = await this.findOne(newOrder?._id);
      const html = fs.readFileSync('./src/pdf/invoice.html', 'utf8');
      const options = {
        format: 'A3',
        orientation: 'portrait',
        border: '10mm',
      };

      const document = {
        html: html,
        data: {
          order: order,
        },
        path: `./src/pdf/${newOrder.orderId}.pdf`,
        type: '',
      };

      pdf
        .create(document, options)
        .then(async (res) => {
          const dir: any = join(
            __dirname,
            `../../../src/pdf/${newOrder.orderId}.pdf`,
          );
          const file = fs.readFileSync(dir);
          const uploadRes = await this.fileService.uploadFromFolder(
            file,
            res.filename,
          );
          newOrder.invoice = uploadRes.Location;
          newOrder.save();
          const emitAddress = `admin-${newOrder.restaurant}`;
          this.server.emit(emitAddress, {
            order: newOrder,
          });
        })
        .catch((error) => {
          console.error(error);
        });
      fs.unlink(`../../../src/pdf/${newOrder.orderId}.pdf`, () => {
        console.log('file removed');
      });
      return newOrder;
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Edit Order
   * @param {string} id
   * @param {UpdateOrderDTO} uOrderDTO
   * @param {IUser} user
   * @returns {Promise<IOrder>}
   */
  async update(
    id: string,
    uOrderDTO: UpdateOrderDTO,
    user: IUser,
  ): Promise<IOrder> {
    try {
      const order = await this.orderModel.findOne({ _id: id });

      if (!order) {
        return Promise.reject(new NotFoundException('Could not find order.'));
      }

      const orderDTO = new OrderDTO();

      if (uOrderDTO && uOrderDTO.hasOwnProperty('items')) {
        const orderItems = order.get('items') || [];
        orderDTO.items = subDocUpdateWithArray(orderItems, uOrderDTO.items);
      }

      if (uOrderDTO && uOrderDTO.hasOwnProperty('location')) {
        if (uOrderDTO.location.lng && uOrderDTO.location.lng) {
          uOrderDTO.location.type = 'Point';
          uOrderDTO.location.coordinates = [
            uOrderDTO.location.lat,
            uOrderDTO.location.lng,
          ];
        }
      }

      orderDTO.uBy = user._id;
      orderDTO.uTime =
        (uOrderDTO?.timezone && moment().tz(uOrderDTO.timezone).valueOf()) ||
        Date.now();
      const setMenu = {
        ...uOrderDTO,
        ...orderDTO,
      };

      const updateOrder = await order.set(setMenu).save();
      if (updateOrder && updateOrder.status === OrderStatus.CONFIRM) {
        this.server.emit(`admin`, {
          order: updateOrder,
        });
      }
      return updateOrder;
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Find All order of a restaurant
   * @returns {Promise<IPaginateMenu>}
   */
  async findAll(query: SearchOrderDTO): Promise<IPaginateOrder> {
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

      const cursor = this.orderModel
        .find(searchQuery)
        .populate({ path: 'restaurant' })
        .populate({
          path: 'items',
          populate: {
            path: 'item',
          },
        })
        .limit(limit)
        .skip(skip);

      if (query.hasOwnProperty('sort') && query.sort) {
        cursor.sort(JSON.parse(query.sort));
      }

      const result: IPaginateOrder = {
        data: {
          orders: await cursor.exec(),
          ...(restaurant ? { restaurant: restaurant } : {}),
        },
      };

      if (query.pagination) {
        result.pagination = {
          total: await this.orderModel.countDocuments(searchQuery),
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
   * find urder by orderId
   * @param {string} id
   * @returns {Promise<IOrder>}
   */
  async findOne(id: string): Promise<IOrder> {
    try {
      const order = await this.orderModel
        .findOne({ _id: id })
        .populate({ path: 'restaurant' })
        .populate({
          path: 'items',
          options: { lean: true },
          populate: {
            path: 'item',
            options: { lean: true },
          },
        })
        .lean()
        .exec();
      if (!order) {
        return Promise.reject(new NotFoundException('Could not find order.'));
      }
      return order;
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * count order
   * @returns {Promise<number>}
   */
  async count(query: SearchOrderDTO): Promise<number> {
    try {
      const searchQuery = createSearchQuery(query);
      return await this.orderModel.countDocuments(searchQuery);
    } catch (err) {
      throw new HttpException(err, err.status || HttpStatus.BAD_REQUEST);
    }
  }
}
