import { Module } from "@nestjs/common";
import { BotService } from "./bot.service";
import { BotUpdate } from "./bot.update";
import { SequelizeModule } from "@nestjs/sequelize";
import { Bot } from "./models/bot.model";
import { Admin } from "./models/admin.model";
import { Client } from "./models/client.model";
import { AdminService } from "./admin.service";
import { AdminUpdate } from "./admin.update";
import { ClientService } from "./client.service";
import { ClientUpdate } from "./client.update";

@Module({
  imports: [SequelizeModule.forFeature([Bot, Admin, Client])],
  providers: [
    AdminUpdate,
    AdminService,
    ClientUpdate,
    ClientService,
    BotService,
    BotUpdate,
  ],
  exports: [BotService],
})
export class BotModule {}
