import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { Invite } from "../entities/invite.entity";
import { User } from "../../users/entities/users.entity";
import { UsersDAO } from "../../users/dao/usersDAO";
@Injectable()
export class InviteDAO {
  constructor(
    @InjectRepository(Invite) private inviteRepository: Repository<Invite>,
    private usersDAO: UsersDAO,
    private dataSource: DataSource
  ) {}

  async createInvite(invite): Promise<Invite> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const userInstance = new User();
      const userFilled = Object.assign(userInstance, invite);
      const createdUser = await queryRunner.manager.save(userFilled);
      const inviteInstance = new Invite();
      const inviteFilled = Object.assign(inviteInstance, { user: createdUser });
      await queryRunner.manager.save(inviteFilled);

      await queryRunner.commitTransaction();
      return inviteFilled;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        "Failed to create invite",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    } finally {
      await queryRunner.release();
    }
  }
}
