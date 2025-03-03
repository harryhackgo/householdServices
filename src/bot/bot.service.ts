import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Bot } from "./models/bot.model";
import { InjectBot } from "nestjs-telegraf";
import { BOT_NAME } from "../app.constants";
import { Context, Markup, Telegraf } from "telegraf";
import { Admin } from "./models/admin.model";
import { Client } from "./models/client.model";
import { Edits } from "./client.service";

@Injectable()
export class BotService {
  constructor(
    @InjectModel(Bot) private readonly botModel: typeof Bot,
    @InjectModel(Admin) private readonly adminModel: typeof Admin,
    @InjectModel(Client) private readonly clientModel: typeof Client,
    @InjectBot(BOT_NAME) private readonly bot: Telegraf<Context>
  ) {}

  async start(ctx: Context) {
    try {
      const user_id = ctx.from!.id;
      const user = await this.botModel.findByPk(user_id);
      if (!user) {
        await this.botModel.create({
          user_id,
          username: ctx.from?.username,
          first_name: ctx.from?.first_name,
          last_name: ctx.from?.last_name,
          lang: ctx.from?.language_code,
        });

        await ctx.reply(`Who do you want to register as?`, {
          parse_mode: "HTML",
          ...Markup.keyboard([["Sahiy", "Sabirli"]])
            .resize()
            .oneTime(),
        });
      } else {
        const isAdmin = await this.adminModel.findByPk(user.user_id);
        const isClient = await this.clientModel.findByPk(user.user_id);
        if (isAdmin) {
          if (isAdmin.last_state == "finish")
            return await ctx.reply(`Welcome back admin ${isAdmin.name}`);
          await ctx.reply(
            `You have not finished your registration. Please enter your ${isAdmin.last_state}`,
            {
              parse_mode: "HTML",
              ...Markup.removeKeyboard(),
            }
          );
        } else if (isClient) {
          if (isClient.last_state == "finish") {
            if (isClient.role == "sabirliy")
              return await ctx.reply(
                `Welcome back ${isClient.role} ${isClient.name}`,
                {
                  parse_mode: "HTML",
                  ...Markup.keyboard([
                    ["Make a request"],
                    ["Contact with admin", "Settings"],
                    ["Back to menu"],
                  ]).resize(),
                }
              );
            return await ctx.reply(
              `Welcome back ${isClient.role} ${isClient.name}`,
              {
                parse_mode: "HTML",
                ...Markup.keyboard([
                  ["Make donation", "View Sabirli"],
                  ["Contact with admin", "Settings"],
                  ["Back to menu"],
                ]).resize(),
              }
            );
          }
          await ctx.reply(
            `You have not finished your registration. Please enter your ${isClient.last_state}`,
            {
              parse_mode: "HTML",
              ...Markup.removeKeyboard(),
            }
          );
        }
      }
    } catch (error) {
      console.log("OnStart error", error);
    }
  }

  async onContact(ctx: Context) {
    if ("contact" in ctx.message!) {
      const user_id = ctx.from!.id;
      const admin = await this.adminModel.findByPk(user_id);
      const client = await this.clientModel.findByPk(user_id);

      if (admin) {
        admin.number = ctx.message.contact.phone_number;
        admin.last_state = "location";
        await admin.save();
        await ctx.reply(`Thank you! Now, share your location please.`, {
          parse_mode: "HTML",
          ...Markup.button.locationRequest("Send my location"),
        });
      } else if (client) {
        client.number = ctx.message.contact.phone_number;
        client.last_state = "location";
        await client.save();
        // if (Edits[0] && Edits[0].field == "number") {
        //   Edits.pop();
        //   await ctx.replyWithHTML(
        //     `<b>Name:</b> ${client.name}\n<b>Phone number: </b>${client.number}`,
        //     {
        //       parse_mode: "HTML",
        //       reply_markup: {
        //         inline_keyboard: [
        //           [
        //             {
        //               text: "Edit my name",
        //               callback_data: `editName_${user_id}`,
        //             },
        //             {
        //               text: "Edit my number",
        //               callback_data: `editNumber_${user_id}`,
        //             },
        //           ],
        //         ],
        //       },
        //     }
        //   );
        //   return;
        // }
        if (client.role == "sahiy")
          return await ctx.reply(
            `Thank you! Now, share your location please.`,
            {
              parse_mode: "HTML",
              ...Markup.keyboard([
                [Markup.button.locationRequest("Share my location")],
              ])
                .resize()
                .oneTime(),
            }
          );

        await ctx.reply("Please share your address. Ex: Tashkent, Yunsabad", {
          ...Markup.removeKeyboard(),
        });
      }
    } else {
      await ctx.reply(
        "Please share your contact with pressing the button below",
        {
          ...Markup.keyboard([
            [Markup.button.contactRequest("Share my contact 📞")],
          ])
            .resize()
            .oneTime(),
        }
      );
    }
  }

  async onLocation(ctx: Context) {
    try {
      if ("location" in ctx.message!) {
        const user_id = ctx.from!.id;
        const admin = await this.adminModel.findByPk(user_id);
        const client = await this.clientModel.findByPk(user_id);

        if (admin && admin.last_state == "location") {
          admin.location = `${ctx.message.location.latitude},${ctx.message.location.longitude}`;
          admin.last_state = "finish";
          await admin.save();
          await ctx.reply(
            `Congratulations, your data has been saved. You are an admin now`,
            {
              parse_mode: "HTML",
              ...Markup.removeKeyboard(),
            }
          );
        } else if (
          client &&
          client.last_state == "location" &&
          client.role == "sahiy"
        ) {
          client.location = `${ctx.message.location.latitude},${ctx.message.location.longitude}`;
          client.last_state = "approve";
          await client.save();
          await ctx.reply(
            `Name: ${client.name}\nTel. number: ${client.number}\nLocation: ${client.location}`,
            {
              parse_mode: "HTML",
              ...Markup.keyboard([["Approve", "Edit my info"]]).resize(),
            }
          );
        }
      }
    } catch (error) {
      console.log("OnLocation error", error);
    }
  }

  async onText(ctx: Context) {
    try {
      if ("text" in ctx.message!) {
        const user_id = ctx.from!.id;
        const admin = await this.adminModel.findByPk(user_id);
        const client = await this.clientModel.findByPk(user_id);

        if (admin && admin.last_state != "finish") {
          if (admin.last_state == "name") {
            admin.name = ctx.message.text;
            admin.last_state = "number";
            await admin.save();
            await ctx.reply("Please share your contact", {
              ...Markup.keyboard([
                [Markup.button.contactRequest("Share my contact 📞")],
              ])
                .resize()
                .oneTime(),
            });
          }
        }

        if (client && client.last_state != "finish") {
          if (client.last_state == "name") {
            client.name = ctx.message.text;
            client.last_state = "number";
            await client.save();
            await ctx.reply("Please share your contact", {
              ...Markup.keyboard([
                [Markup.button.contactRequest("Share my contact 📞")],
              ])
                .resize()
                .oneTime(),
            });
          } else if (
            client.last_state == "location" &&
            client.role == "sabirli"
          ) {
            client.location = ctx.message.text;
            client.last_state = "approve";
            await client.save();
            await ctx.reply(
              `Name: ${client.name}\nTel. number: ${client.number}\nLocation: ${client.location}`,
              {
                parse_mode: "HTML",
                ...Markup.keyboard([["Approve", "Edit my info"]]).resize(),
              }
            );
          } else if (client.last_state == "approve") {
            client.last_state = "finish";
            await client.save();
            if (client.role == "sabirliy")
              return await ctx.reply(
                `Congratulations, your data has been saved.`,
                {
                  parse_mode: "HTML",
                  ...Markup.keyboard([
                    ["Make a request"],
                    ["Contact with admin", "Settings"],
                    ["Back to menu"],
                  ]).resize(),
                }
              );
            await ctx.reply(`Congratulations, your data has been saved.`, {
              parse_mode: "HTML",
              ...Markup.keyboard([
                ["Make donation", "View Sabirli"],
                ["Contact with admin", "Settings"],
                ["Back to menu"],
              ]).resize(),
            });
          }

          if (client && Edits[0]) {
            console.log(Edits);
            client[Edits[0].field] = ctx.message.text;
            await client.save();
            Edits.pop();
            console.log(Edits);
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
        }
      }
    } catch (error) {
      console.log("OnText unexpeced error:", error);
    }
  }

  async deleteUncaughtMessage(ctx: Context) {
    try {
      const contextMessage = ctx.message?.message_id;
      await ctx.deleteMessage(contextMessage);
    } catch (error) {
      console.log("OnStop error", error);
    }
  }
}
