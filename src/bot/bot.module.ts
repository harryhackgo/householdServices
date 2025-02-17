import { Module } from "@nestjs/common";
import { BotService } from "./bot.service";
import { BotUpdate } from "./bot.update";
import { SequelizeModule } from "@nestjs/sequelize";
import { Bot } from "./models/bot.model";
// import { AddressService } from "./address.service";
import { Master } from "./models/master.model";
// import { AddressUpdate } from "./address.update";
// import { CarUpdate } from "./car.update";
// import { CarService } from "./car.service";
import { Client } from "./models/client.model";
import { MasterService } from "./master.service";
import { MasterUpdate } from "./master.update";
import { ClientService } from "./client.service";
import { ClientUpdate } from "./client.update";

@Module({
  imports: [SequelizeModule.forFeature([Bot, Master, Client])],
  providers: [
    // CarUpdate,
    // CarService,
    // AddressUpdate,
    // AddressService,
    MasterUpdate,
    MasterService,
    ClientUpdate,
    ClientService,
    BotService,
    BotUpdate,
  ],
  exports: [BotService],
})
export class BotModule {}
