import { Controller, Post, Body, HttpCode, HttpStatus } from "@nestjs/common";
import { InviteService } from "./invite.service";
import { CreateInviteDto } from "./dto/create-invite.dto";
import { Invite } from "./entities/invite.entity";

@Controller("invite")
export class InviteController {
  constructor(private readonly inviteService: InviteService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  invite(@Body() newInvite: CreateInviteDto): Promise<Invite> {
    return this.inviteService.create(newInvite);
  }
}
