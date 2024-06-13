import { Injectable } from '@nestjs/common';
import { printer, types } from 'node-thermal-printer';
import Win32Printer from 'pdf-to-printer';
import LinuxPrinter from 'unix-print';
import { Model } from 'mongoose';
import { IOrder } from '../../order/interfaces';
import { InjectModel } from '@nestjs/mongoose';
import { PrintDTO } from '../dto/print.dto';
import { PrinterType } from '../../common/mock/constant.mock';

@Injectable()
export class ThermalPrintService {
  /**
   * Constructor
   * @param {Model<IOrder>} orderModel
   */
  constructor(
    @InjectModel('Order')
    private readonly orderModel: Model<IOrder>,
  ) {}

  public async print(printDTO: PrintDTO) {
    if (process.platform == 'win32') {
      await Win32Printer.getPrinters().then(console.log);
      const options = {
        printer: 'Canon LBP6030/6040/6018L',
      };
      await Win32Printer.print('./Lorem_ipsum.pdf', options);
    } else if (process.platform == 'linux') {
      await LinuxPrinter.getPrinters().then(console.log);
      const fileToPrint = './Lorem_ipsum.pdf';
      const printer = 'Canon LBP6030/6040/6018L';
      const options = ['-o landscape', '-o fit-to-page', '-o media=A4'];
      await LinuxPrinter.print(fileToPrint, printer, options);
    }
  }

  // public async printThermal(printDTO: PrintDTO) {
  //   try {
  //     const posPrinter = new printer({
  //       type: printDTO.type == PrinterType.EPSON ? types.EPSON : types.STAR,
  //       interface: printDTO.interface,
  //       characterSet: printDTO.characterSet || 'SLOVENIA',
  //       removeSpecialCharacters: printDTO.removeSpecialCharacters || false,
  //       lineCharacter: printDTO.lineCharacter || '=',
  //       options: {
  //         // Additional options
  //         timeout: 5000, // Connection timeout (ms) [applicable only for network printers] - default: 3000
  //       },
  //     });
  //     const isConnected = await posPrinter.isPrinterConnected(); // Check if printer is connected, return bool of status
  //     console.log('isConnected: ', isConnected);
  //     if (isConnected) {
  //       posPrinter.print('E-Menu Service Printer Test');
  //     }

  //     return posPrinter;
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }
}
