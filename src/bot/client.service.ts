import { InjectBot } from "nestjs-telegraf";
import { Context, Markup, Telegraf } from "telegraf";
import { BOT_NAME } from "../app.constants";
import { InjectModel } from "@nestjs/sequelize";
import { Client } from "./models/client.model";
import { Bot } from "./models/bot.model";
import { Master } from "./models/master.model";

export class ClientService {
  constructor(
    @InjectModel(Client) private readonly clientModel: typeof Client,
    @InjectModel(Master) private readonly masterModel: typeof Master,
    @InjectModel(Bot) private readonly botModel: typeof Bot
  ) {}

  async onClient(ctx: Context) {
    try {
      if ("text" in ctx.message!) {
        const user_id = ctx.from!.id;
        const isClient = await this.clientModel.findByPk(user_id);
        if (isClient) await this.clientModel.destroy({ where: { user_id } });

        await this.clientModel.create({ user_id, last_state: "name" });
        await ctx.reply(`Enter your name please`, {
          parse_mode: "HTML",
          ...Markup.removeKeyboard(),
        });
      }
    } catch (error) {
      console.log("OnStop error", error);
    }
  }

  async onEdit(ctx: Context) {
    try {
      if ("text" in ctx.message!) {
        const user_id = ctx.from!.id;
        const client = await this.clientModel.findByPk(user_id);
        if (client)
          await ctx.replyWithHTML(
            `<b>Name:</b> ${client.name}\n<b>Phone number: </b>${client.number}`,
            {
              parse_mode: "HTML",
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: "Edit my name",
                      callback_data: `editName_${user_id}`,
                    },
                    {
                      text: "Edit my number",
                      callback_data: `editNumber_${user_id}`,
                    },
                  ],
                ],
              },
            }
          );
      }
    } catch (error) {
      console.log("OnStop error", error);
    }
  }

  async onClickName(ctx: Context) {
    try {
      const contextAction = ctx.callbackQuery!["data"];
      const client_id = contextAction.split("_")[1];

      Edits.push({ field: "name", client_id });
      await ctx.replyWithHTML("What is your name?: ", {
        ...Markup.removeKeyboard(),
      });
    } catch (error) {
      console.log("OnStop error", error);
    }
  }

  async onClickNumber(ctx: Context) {
    try {
      const contextAction = ctx.callbackQuery!["data"];
      const client_id = contextAction.split("_")[1];

      Edits.push({ field: "number", client_id });
      await ctx.replyWithHTML("Send your number please", {
        ...Markup.keyboard([
          [Markup.button.contactRequest("Share my contact 📞")],
        ])
          .resize()
          .oneTime(),
      });
    } catch (error) {
      console.log("OnStop error", error);
    }
  }
}

interface Edit {
  field: string;
  client_id: number;
}

export const Edits: Edit[] = [];
