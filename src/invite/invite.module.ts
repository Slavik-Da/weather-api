import { Module } from "@nestjs/common";
import { InviteService } from "./invite.service";
import { InviteController } from "./invite.controller";
import { InviteDAO } from "./dao/inviteDAO";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Invite } from "./entities/invite.entity";
import { UsersDAO } from "../users/dao/usersDAO";
import { User } from "../users/entities/users.entity";

@Module({
  controllers: [InviteController],
  providers: [InviteService, InviteDAO, UsersDAO],
  imports: [TypeOrmModule.forFeature([Invite, User])],
})
export class InviteModule {}
