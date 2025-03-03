import { Action, Command, Ctx, Hears, Update } from "nestjs-telegraf";
import { Context } from "telegraf";
import { AdminService } from "./admin.service";

@Update()
export class AdminUpdate {
  constructor(private readonly adminService: AdminService) {}

  @Command("admin")
  async onAddress(@Ctx() ctx: Context) {
    await this.adminService.onAdmin(ctx);
  }

  // @Action(/^ser_/)
  // async onActionService(@Ctx() ctx: Context) {
  //   await this.adminService.onActionService(ctx);
  // }

  @Action(/^approve_\d+$/)
  async onClickLocation(@Ctx() ctx: Context) {
    await this.adminService.onClickApprove(ctx);
  }

  @Action(/^cancel_\d+$/)
  async onDelLocation(@Ctx() ctx: Context) {
    await this.adminService.onClickCancel(ctx);
  }
}
