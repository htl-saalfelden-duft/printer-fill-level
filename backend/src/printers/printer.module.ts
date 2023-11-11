import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Data } from '../models/data.entity';
import { Printer } from '../models/printer.entity';
import { PrinterController } from './printer.controller';
import { PrinterService } from './printer.service';



@Module({
  imports: [TypeOrmModule.forFeature([Printer, Data])],
  providers: [PrinterService],
  controllers: [PrinterController],
  exports: []
})
export class PrinterModule { }