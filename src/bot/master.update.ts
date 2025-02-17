import { Action, Command, Ctx, Hears, Update } from "nestjs-telegraf";
import { Context } from "telegraf";
import { MasterService } from "./master.service";

@Update()
export class MasterUpdate {
  constructor(private readonly masterService: MasterService) {}

  @Hears("Master")
  async onAddress(@Ctx() ctx: Context) {
    await this.masterService.onMaster(ctx);
  }

  @Action(/^ser_/)
  async onActionService(@Ctx() ctx: Context) {
    await this.masterService.onActionService(ctx);
  }

  @Action(/^approve_\d+$/)
  async onClickLocation(@Ctx() ctx: Context) {
    await this.masterService.onClickApprove(ctx);
  }

  @Action(/^cancel_\d+$/)
  async onDelLocation(@Ctx() ctx: Context) {
    await this.masterService.onClickCancel(ctx);
  }
}
