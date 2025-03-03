import { Action, Ctx, Hears, Update } from "nestjs-telegraf";
import { Context } from "telegraf";
import { ClientService } from "./client.service";

@Update()
export class ClientUpdate {
  constructor(private readonly clientService: ClientService) {}

  @Hears("Sahiy")
  async onSahiy(@Ctx() ctx: Context) {
    await this.clientService.onSS(ctx, "sahiy");
  }

  @Hears("Make donation")
  async onDonation(@Ctx() ctx: Context) {
    await this.clientService.onDonation(ctx);
  }

  @Hears("View Sabirli")
  async onViewSabirli(@Ctx() ctx: Context) {
    await this.clientService.onViewSabirli(ctx);
  }

  @Hears("Contact with admin")
  async onContactAdmin(@Ctx() ctx: Context) {
    await this.clientService.onContactAdmin(ctx);
  }

  @Hears("Settings")
  async onSettings(@Ctx() ctx: Context) {
    await this.clientService.onSettings(ctx);
  }

  @Hears("Back to menu")
  async onBackToMenu(@Ctx() ctx: Context) {
    await this.clientService.onBackToMenu(ctx);
  }

  @Hears("Sabirli")
  async onSabirli(@Ctx() ctx: Context) {
    await this.clientService.onSS(ctx, "sabirli");
  }

  @Hears("Make a request")
  async onDonationRequest(@Ctx() ctx: Context) {
    await this.clientService.onDonationRequest(ctx);
  }

  @Hears("Edit my info")
  async onEdit(@Ctx() ctx: Context) {
    await this.clientService.onEdit(ctx);
  }

  @Action(/^editNumber_\d+$/)
  async onClickNumber(@Ctx() ctx: Context) {
    await this.clientService.onClickNumber(ctx);
  }

  @Action(/^editName_\d+$/)
  async onClickModel(@Ctx() ctx: Context) {
    await this.clientService.onClickName(ctx);
  }
}
