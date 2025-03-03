import {
  Action,
  Command,
  Ctx,
  Hears,
  On,
  Start,
  Update,
} from "nestjs-telegraf";
import { Context, Markup } from "telegraf";
import { BotService } from "./bot.service";

@Update()
export class BotUpdate {
  constructor(private readonly botService: BotService) {}

  @Start()
  async onStart(@Ctx() ctx: Context) {
    this.botService.start(ctx);
  }

  @On("text")
  async onText(@Ctx() ctx: Context) {
    await this.botService.onText(ctx);
  }

  @On("contact")
  async onContact(@Ctx() ctx: Context) {
    this.botService.onContact(ctx);
  }

  @On("location")
  async onLocation(@Ctx() ctx: Context) {
    await this.botService.onLocation(ctx);
  }

  @On("message")
  async onMessage(@Ctx() ctx: Context) {
    await this.botService.deleteUncaughtMessage(ctx);
  }

  // @Command("admin")
  // async onAdminCommand(@Ctx() ctx: Context) {
  //   await this.botService.admin_menu(ctx, "Welcome back Admin");
  // }

  //=--------------------------------------------------

  // @Hears("hi")
  // async onHear(@Ctx() ctx: Context) {
  //   await ctx.replyWithHTML("Salom");
  // }

  // @Command("help")
  // async onHelpCommand(@Ctx() ctx: Context) {
  //   await ctx.replyWithHTML("Wait!");
  // }

  // @Command("inline")
  // async onInlineCommand(@Ctx() ctx: Context) {
  //   const inlineKeyboard = [
  //     [
  //       {
  //         text: "Button 1",
  //         callback_data: "button_1",
  //       },
  //       {
  //         text: "Button 2",
  //         callback_data: "button_2",
  //       },
  //       {
  //         text: "Button 3",
  //         callback_data: "button_3",
  //       },
  //     ],
  //     [
  //       {
  //         text: "Button 4",
  //         callback_data: "button_4",
  //       },
  //       {
  //         text: "Button 5",
  //         callback_data: "button_5",
  //       },
  //     ],
  //     [
  //       {
  //         text: "Button 6",
  //         callback_data: "button_6",
  //       },
  //     ],
  //   ];

  //   await ctx.reply("Inline Keyboard: press the button you want", {
  //     reply_markup: {
  //       inline_keyboard: inlineKeyboard,
  //     },
  //   });
  // }

  // @Action("button_1")
  // async onButton1(@Ctx() ctx: Context) {
  //   await ctx.replyWithHTML("button 1 was pressed");
  // }

  // @Action(/^button_+[1-9]/)
  // async onButtonAny(@Ctx() ctx: Context) {
  //   const actionText = ctx.callbackQuery!["data"];
  //   const buttonId = actionText.split("_")[1];
  //   await ctx.replyWithHTML(`${buttonId} - Button was pressed`);
  // }

  // @Command("main")
  // async onMainbutton(@Ctx() ctx: Context) {
  //   await ctx.replyWithHTML(`Press the according main button`, {
  //     ...Markup.keyboard([
  //       [Markup.button.contactRequest(`📞 Send you phone number`)],
  //       [Markup.button.locationRequest(`🌐 Send your location`)],
  //       ["promo_1"],
  //       ["promo_2", "promo_3"],
  //       ["promo_4", "promo_5", "promo_6"],
  //     ]),
  //   });
  // }

  // @Hears(/^promo_+\d+$/)
  // async onButtonHears(@Ctx() ctx: Context) {
  //   if ("match" in ctx && ctx.match instanceof Array)
  //     await ctx.replyWithHTML(
  //       `${ctx.match[0].split("_")[1]} - button was pressed`
  //     );
  // }

  // @On("photo")
  // async onPhoto(@Ctx() ctx: Context) {
  //   if ("photo" in ctx.message!) {
  //     console.log(ctx.message!.photo);
  //     await ctx.replyWithPhoto(
  //       String(ctx.message.photo[ctx.message.photo.length - 1])
  //     );
  //   }
  // }

  // @On("video")
  // async onVideo(@Ctx() ctx: Context) {
  //   if ("video" in ctx.message!) {
  //     console.log(ctx.message!.video);
  //     await ctx.replyWithHTML(String(ctx.message.video.duration));
  //   }
  // }

  // @On("sticker")
  // async onSticker(@Ctx() ctx: Context) {
  //   if ("sticker" in ctx.message!) {
  //     console.log(ctx.message!.sticker);
  //     await ctx.replyWithHTML(String(ctx.message.sticker.emoji));
  //   }
  // }

  // @On("animation")
  // async onAnimation(@Ctx() ctx: Context) {
  //   if ("animation" in ctx.message!) {
  //     console.log(ctx.message!.animation);
  //     await ctx.replyWithHTML(String(ctx.message.animation.duration));
  //   }
  // }

  // @On("contact")
  // async onContact(@Ctx() ctx: Context) {
  //   if ("contact" in ctx.message!) {
  //     console.log(ctx.message!.contact);
  //     await ctx.replyWithHTML(String(ctx.message.contact.first_name));
  //     await ctx.replyWithHTML(String(ctx.message.contact.user_id));
  //     await ctx.replyWithHTML(String(ctx.message.contact.vcard));
  //   }
  // }

  // @On("location")
  // async on(@Ctx() ctx: Context) {
  //   if ("location" in ctx.message!) {
  //     console.log(ctx.message!.location);
  //     await ctx.replyWithHTML(String(ctx.message.location.latitude));
  //     await ctx.replyWithHTML(String(ctx.message.location.longitude));
  //   }
  // }

  // @On("voice")
  // async onVoice(@Ctx() ctx: Context) {
  //   if ("voice" in ctx.message!) {
  //     console.log(ctx.message!.voice);
  //     await ctx.replyWithAudio(String(ctx.message.voice.file_id));
  //   }
  // }

  // @On("invoice")
  // async onInvoice(@Ctx() ctx: Context) {
  //   if ("invoice" in ctx.message!) {
  //     console.log(ctx.message!.invoice);
  //     await ctx.replyWithHTML(String(ctx.message.invoice.currency));
  //   }
  // }

  // @On("document")
  // async onDocument(@Ctx() ctx: Context) {
  //   if ("document" in ctx.message!) {
  //     console.log(ctx.message!.document);
  //     await ctx.replyWithDocument(String(ctx.message.document.file_size));
  //   }
  // }
}
