import { InjectBot } from "nestjs-telegraf";
import { Context, Markup, Telegraf } from "telegraf";
import { BOT_NAME } from "../app.constants";
import { InjectModel } from "@nestjs/sequelize";
import { Master } from "./models/master.model";
import { Bot } from "./models/bot.model";
import { Client } from "./models/client.model";

export class MasterService {
  constructor(
    @InjectBot(BOT_NAME) private readonly bot: Telegraf<Context>,
    @InjectModel(Master) private readonly masterModel: typeof Master,
    @InjectModel(Client) private readonly clientModel: typeof Client,
    @InjectModel(Bot) private readonly botModel: typeof Bot
  ) {}

  async onMaster(ctx: Context) {
    try {
      const user_id = ctx.from!.id;
      // const isClient = await this.clientModel.findByPk(user_id);
      // if (isClient) {
      //   return await ctx.replyWithHTML(
      //     `Sorry, but you are already registered as a Client`
      //   );
      // }
      const services = [
        { name: "Barbershop" },
        { name: "Jewelry" },
        { name: "Clark" },
        { name: "Shoe shining" },
      ];
      const keyboard: { text: string; callback_data: string }[][] = [];
      services.forEach((service) => {
        keyboard.push([
          { text: service.name, callback_data: `ser_${service.name}` },
        ]);
      });
      await this.masterModel.destroy({ where: { user_id } });
      await this.masterModel.create({ user_id, last_state: "service" });

      await ctx.replyWithHTML(`What kind of service do you privide?`, {
        reply_markup: {
          inline_keyboard: keyboard,
        },
      });
    } catch (error) {
      console.log("OnMaster error", error);
    }
  }

  async onActionService(ctx: Context) {
    try {
      const user_id = ctx.from!.id;
      const user = await this.masterModel.findByPk(user_id);
      if (user) {
        user.service = ctx.callbackQuery!["data"].split("_")[1];
        user.last_state = "name";
        await user.save();

        await ctx.reply(`Okey, ${user.service}! What is your name?`, {
          parse_mode: "HTML",
          ...Markup.removeKeyboard(),
        });
      }
    } catch (error) {
      console.log("OnActionService error", error);
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

      const master = await this.masterModel.findByPk(address_id);
      master?.destroy();

      await ctx.editMessageText("Your information has been deleted");
      await ctx.reply(`Who do you want to register as?`, {
        parse_mode: "HTML",
        ...Markup.keyboard([["Master", "Client"]])
          .resize()
          .oneTime(),
      });
    } catch (error) {
      console.log("OnStop error", error);
    }
  }
}
