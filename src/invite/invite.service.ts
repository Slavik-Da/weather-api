import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateInviteDto } from "./dto/create-invite.dto";
import { InviteDAO } from "./dao/inviteDAO";
import { User } from "../users/entities/users.entity";
import { UsersDAO } from "../users/dao/usersDAO";
import { Invite } from "./entities/invite.entity";

@Injectable()
export class InviteService {
  constructor(private inviteDAO: InviteDAO, private usersDAO: UsersDAO) {}
  async create(createInviteDto: CreateInviteDto): Promise<Invite> {
    const user: User = await this.usersDAO.getUserByEmail(
      createInviteDto.email
    );
    if (user) {
      throw new HttpException("User exists", HttpStatus.CONFLICT);
    }
    return this.inviteDAO.createInvite(createInviteDto);
  }
}
