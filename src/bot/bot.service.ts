import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Bot } from "./models/bot.model";
import { InjectBot } from "nestjs-telegraf";
import { BOT_NAME } from "../app.constants";
import { Context, Markup, Telegraf } from "telegraf";
import { Master } from "./models/master.model";
import { Client } from "./models/client.model";
import { Edits } from "./client.service";

@Injectable()
export class BotService {
  constructor(
    @InjectModel(Bot) private readonly botModel: typeof Bot,
    @InjectModel(Master) private readonly masterModel: typeof Master,
    @InjectModel(Client) private readonly clientModel: typeof Client,
    @InjectBot(BOT_NAME) private readonly bot: Telegraf<Context>
  ) {}

  async start(ctx: Context) {
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
        ...Markup.keyboard([["Master", "Client"]])
          .resize()
          .oneTime(),
      });
      // } else if (!user.status) {
      //   await ctx.reply(
      //     `Please, press the <b>Send phone number 📞</b> button in menu`,
      //     {
      //       parse_mode: "HTML",
      //       ...Markup.keyboard([
      //         [Markup.button.contactRequest("Send phone number 📞")],
      //       ])
      //         .resize()
      //         .oneTime(),
      //     }
      //   );
    } else {
      const isMaster = await this.masterModel.findByPk(user.user_id);
      const isClient = await this.clientModel.findByPk(user.user_id);
      if (
        isMaster?.last_state != "finish" ||
        isClient?.last_state != "finish"
      ) {
        await ctx.reply(`Who do you want to register as?`, {
          parse_mode: "HTML",
          ...Markup.keyboard([["Master", "Client"]])
            .resize()
            .oneTime(),
        });
      } else {
        await this.bot.telegram.sendChatAction(user_id, "typing");
        await ctx.reply(`Welcome back ${user.first_name}`, {
          parse_mode: "HTML",
          ...Markup.removeKeyboard(),
        });
      }
    }
  }

  async onContact(ctx: Context) {
    if ("contact" in ctx.message!) {
      const user_id = ctx.from!.id;
      const master = await this.masterModel.findByPk(user_id);
      const client = await this.clientModel.findByPk(user_id);

      if (master) {
        master.number = ctx.message.contact.phone_number;
        master.last_state = "workshop_name";
        await master.save();
        await ctx.reply(`Thank you! Now, what is your workshop's name?`, {
          parse_mode: "HTML",
          ...Markup.removeKeyboard(),
        });
      } else if (client) {
        client.number = ctx.message.contact.phone_number;
        client.last_state = "finish";
        await client.save();
        if (Edits[0] && Edits[0].field == "number") {
          Edits.pop();
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
          return;
        }
        await ctx.reply(
          `Congratulations, your data has been saved. Now, try searching for some services :D`,
          {
            parse_mode: "HTML",
            ...Markup.keyboard([
              ["Services"],
              ["Selected services"],
              ["Edit my info"],
            ]),
          }
        );
      }
    }
  }

  async onLocation(ctx: Context) {
    try {
      if ("location" in ctx.message!) {
        const user_id = ctx.from!.id;
        const master = await this.masterModel.findByPk(user_id);

        if (master && master.last_state == "location") {
          master.location = `${ctx.message.location.latitude},${ctx.message.location.longitude}`;
          master.last_state = "start_time";
          await master.save();
          await ctx.replyWithHTML(
            "Saved! Now, enter the time you start working\n\nExample: 8:00"
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
        const master = await this.masterModel.findByPk(user_id);
        const client = await this.clientModel.findByPk(user_id);
        if (master && master.last_state != "finish") {
          if (master.last_state == "name") {
            master.name = ctx.message.text;
            master.last_state = "number";
            await master.save();
            await ctx.reply("Please share your contact", {
              ...Markup.keyboard([
                [Markup.button.contactRequest("Share my contact 📞")],
              ])
                .resize()
                .oneTime(),
            });
          } else if (master.last_state == "workshop_name") {
            master.workshop_name = ctx.message.text;
            master.last_state = "address";
            await master.save();
            await ctx.reply("Now, enter your address please", {
              ...Markup.removeKeyboard(),
            });
          } else if (master.last_state == "address") {
            master.address = ctx.message.text;
            master.last_state = "near_to";
            await master.save();
            await ctx.reply(
              "For our clients to find you easily, enter some kind of a target please.\n\nExample: next to Hilton",
              {
                ...Markup.removeKeyboard(),
              }
            );
          } else if (master.last_state == "near_to") {
            master.near_to = ctx.message.text;
            master.last_state = "location";
            await master.save();
            await ctx.reply("Please, send the location of your workplace", {
              ...Markup.removeKeyboard(),
            });
          } else if (master.last_state == "start_time") {
            try {
              const time = ctx.message.text
                .split(":")
                .map((x) => parseInt(x, 10));
              master.start_time = time[0] * 60 + time[1];

              if (master.start_time! >= 1440) throw new Error("");
            } catch (error) {
              return await ctx.reply(
                "We are having a problem in processing the time you entered. Please make sure it is a proper time :\\\n\nExample: 8:00",
                {
                  ...Markup.removeKeyboard(),
                }
              );
            }
            master.last_state = "end_time";
            await master.save();
            await ctx.reply("Now, enter the time you stop working", {
              ...Markup.removeKeyboard(),
            });
          } else if (master.last_state == "end_time") {
            try {
              const time = ctx.message.text
                .split(":")
                .map((x) => parseInt(x, 10));
              master.end_time = time[0] * 60 + time[1];
              if (master.end_time! >= 1440) throw new Error("");
            } catch (error) {
              return await ctx.reply(
                "We are having a problem in processing the time you entered. Please make sure it is a proper time :\\\n\nExample: 8:00",
                {
                  ...Markup.removeKeyboard(),
                }
              );
            }
            master.last_state = "per_client_time";
            await master.save();
            await ctx.replyWithHTML(
              "Now, enter the time you spend to one client on average <b>(Minutes)</b>",
              {
                ...Markup.removeKeyboard(),
              }
            );
          } else if (master.last_state == "per_client_time") {
            try {
              const time = parseInt(ctx.message.text, 10);
              master.per_client_time = time;
              if (master.per_client_time! >= 1440)
                throw new Error(
                  "Your average time cannot be more than 1440 minuts"
                );
            } catch (error) {
              return await ctx.reply(
                "We are having a problem in processing the time you entered. Please make sure it is a porper time :\\\n\nExample: 8:00" +
                  error.message,
                {
                  ...Markup.removeKeyboard(),
                }
              );
            }
            master.last_state = "finish";
            await master.save();
            const formattedStartTime = `${Math.floor(master.start_time! / 60)}:${String(master.start_time! % 60).padStart(2, "0")}`;
            const formattedEndTime = `${Math.floor(master.end_time! / 60)}:${String(master.end_time! % 60).padStart(2, "0")}`;
            await ctx.replyWithHTML(`Success! Check your information`);
            await ctx.replyWithHTML(
              `<b>Service</b>: ${master.service}
<b>Name</b>: ${master.name}
<b>Phone number</b>: ${master.number}
<b>Workshop's name</b>: ${master.workshop_name}
<b>Address</b>: ${master.address}
<b>Target</b>: ${master.near_to}
<b>Location</b>: ${master.location}
<b>Start time</b>: ${formattedStartTime}
<b>End time</b>: ${formattedEndTime}
<b>Time per client</b>: ${master.per_client_time}
`,
              {
                reply_markup: {
                  inline_keyboard: [
                    [
                      {
                        text: "Approve",
                        callback_data: `approve_${master.user_id}`,
                      },
                      {
                        text: "Cancel",
                        callback_data: `cancel_${master.user_id}`,
                      },
                    ],
                  ],
                },
              }
            );
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
          }
        }

        if (client && Edits[0]) {
          client[Edits[0].field] = ctx.message.text;
          await client.save();
          Edits.pop();
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
