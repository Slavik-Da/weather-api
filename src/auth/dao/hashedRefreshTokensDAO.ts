import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { User } from "../../users/entities/users.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, DeleteResult, Repository } from "typeorm";
import { HashedRefreshToken } from "../entities/refreshTokens.entity";
import { UsersDAO } from "../../users/dao/usersDAO";
@Injectable()
export class HashedRefreshTokensDAO {
  constructor(
    @InjectRepository(HashedRefreshToken)
    private hashedRefreshTokenRepository: Repository<HashedRefreshToken>,
    private usersDAO: UsersDAO,
    private dataSource: DataSource
  ) {}

  async saveHashedRefreshTokenForUser(userEntity, hashedToken): Promise<User> {
    const hashedRefreshTokenEntity =
      await this.hashedRefreshTokenRepository.save({
        token: hashedToken,
      });

    if (Array.isArray(userEntity.hashedRefreshToken)) {
      //in case if user already have refreshTokens
      userEntity.hashedRefreshToken.push(hashedRefreshTokenEntity);
    } else {
      //in case if user haven`t any refreshTokens
      userEntity.hashedRefreshToken = [hashedRefreshTokenEntity];
    }
    const updatedUser = this.usersDAO.saveUser(userEntity);
    return updatedUser;
  }

  deleteHashedRefreshToken(userEntity: User): Promise<DeleteResult> {
    return this.hashedRefreshTokenRepository.delete({ user: userEntity });
  }

  async removeToken(tokenValue: string): Promise<HashedRefreshToken> {
    const tokenToRemove = await this.hashedRefreshTokenRepository.findOne({
      where: { token: tokenValue },
    });
    return this.hashedRefreshTokenRepository.remove(tokenToRemove);
  }

  public async saveHashedRefreshToken(
    userEntity: User,
    refreshToken: string
  ): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const tokenInstance = new HashedRefreshToken();
      const filledToken = Object.assign(tokenInstance, {
        token: refreshToken,
        user: userEntity,
      });
      await queryRunner.manager.save(filledToken);
      await queryRunner.commitTransaction();
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
