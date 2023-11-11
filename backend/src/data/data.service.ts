// data.service.ts 
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Data } from '../models/data.entity';
import { Printer } from '../models/printer.entity';
import { Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { Mib, SwitchMib } from './dtos/mib';
var snmp = require('snmp-native');

@Injectable()
export class DataService {
    constructor(@InjectRepository(Printer) private printerRepo: Repository<Printer>, 
                @InjectRepository(Data) private dataRepo: Repository<Data>) {}


    async getAllByPrinterDESC(printerId: string): Promise<Data[]> {
        try {
            return await this.dataRepo.createQueryBuilder("data").where("data.printerId = :id", { id :printerId }).orderBy("data.created_at", "DESC").getMany();
        } catch (error) {
            return error;
        }
    }

    async getAllByPrinterASC(printerId: string): Promise<Data[]> {
        try {
            return await this.dataRepo.createQueryBuilder("data").where("data.printerId = :id", { id : printerId }).orderBy("data.created_at", "ASC").getMany();
        } catch (error) {
            return error;
        }
    }

    async getOneByPrinter(printerId: string) : Promise<Data> {
        try {
            return await this.dataRepo.createQueryBuilder("data").where("data.printerId = :id", { id : printerId }).orderBy("data.created_at", "DESC").getOneOrFail();
        } catch (error) {
            return error;
        }
    }





    @Cron('*/1 6-19 * * 1-5')
    async handleCron() {
        let printer = await this.printerRepo.find();
        for (let index = 0; index < printer.length; index++) {
            const element = printer[index];
            console.log(`Get data from ${element.model} with IP:${element.ip}`)
            var upload = this.dataRepo

            let session = new snmp.Session({ host: element.ip, port: 161, community: 'public' });
        
            
            session.getAll({oids : SwitchMib} , function(error, varbinds,) {
                let drawer1 = varbinds[0].value;
                let drawer2 = varbinds[1].value;
                let lcf1 = varbinds[2].value;
                let lcf2 = varbinds[3].value;
            
                let data = upload.create([{drawer1: drawer1, drawer2: drawer2, lcf1: lcf1, lcf2: lcf2, printerId: element.id}])
                upload.save(data)
            })
        }
  }

  @Cron('0 19 * * 7')
    async deleteData() : Promise<Data[]>{
        try {
            const data = await this.dataRepo.find();
            return this.dataRepo.remove(data);
        } catch (error) {
            return error
        }
        
  }





}