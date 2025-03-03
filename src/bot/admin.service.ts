import { InjectBot } from "nestjs-telegraf";
import { Context, Markup, Telegraf } from "telegraf";
import { BOT_NAME } from "../app.constants";
import { InjectModel } from "@nestjs/sequelize";
import { Admin } from "./models/admin.model";
import { Bot } from "./models/bot.model";
import { Client } from "./models/client.model";

export class AdminService {
  constructor(
    @InjectBot(BOT_NAME) private readonly bot: Telegraf<Context>,
    @InjectModel(Admin) private readonly adminModel: typeof Admin,
    @InjectModel(Client) private readonly clientModel: typeof Client,
    @InjectModel(Bot) private readonly botModel: typeof Bot
  ) {}

  async onAdmin(ctx: Context) {
    try {
      const user_id = ctx.from!.id;
      // const isClient = await this.clientModel.findByPk(user_id);
      const isAdmin = await this.adminModel.findByPk(user_id);
      // if (isClient) {
      //   return await ctx.replyWithHTML(
      //     `Sorry, but you are already registered as a client`
      //   );
      // } else
      if (isAdmin && isAdmin.last_state != "finish") {
        return await ctx.replyWithHTML(
          `Sorry, but you have not finished your registration. Please enter your ${isAdmin.last_state}`
        );
      }

      await this.adminModel.create({ user_id, last_state: "name" });
      await ctx.replyWithHTML(`Okay, new Admin. What is your name?`);
    } catch (error) {
      console.log("OnAdmin error", error);
    }
  }

  async onClickApprove(ctx: Context) {
    try {
      const contextAction = ctx.callbackQuery!["data"];
      await ctx.reply(
        "Youd infomration has been saved. You can use our service as soon as our admin approves it :D",
        {
          ...Markup.keyboard([
            ["Check the status"],
            ["Cancel approving"],
            ["Contact the admin"],
          ]),
        }
      );
    } catch (error) {
      console.log("OnStop error", error);
    }
  }

  async onClickCancel(ctx: Context) {
    try {
      const contextAction = ctx.callbackQuery!["data"];
      const address_id = contextAction.split("_")[1];

      const admin = await this.adminModel.findByPk(address_id);
      admin?.destroy();

      await ctx.editMessageText("Your information has been deleted");
      await ctx.reply(`Who do you want to register as?`, {
        parse_mode: "HTML",
        ...Markup.keyboard([["/admin", "Sahiy", "Sabirli"]])
          .resize()
          .oneTime(),
      });
    } catch (error) {
      console.log("OnStop error", error);
    }
  }
}
