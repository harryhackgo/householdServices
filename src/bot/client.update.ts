import { Action, Command, Ctx, Hears, Update } from "nestjs-telegraf";
import { Context } from "telegraf";
import { ClientService } from "./client.service";

@Update()
export class ClientUpdate {
  constructor(private readonly clientService: ClientService) {}

  @Hears("Client")
  async onCar(@Ctx() ctx: Context) {
    await this.clientService.onClient(ctx);
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
