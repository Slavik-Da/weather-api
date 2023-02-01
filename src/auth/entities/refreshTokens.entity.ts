import { Entity, ManyToOne, Column } from "typeorm";
import { User } from "../../users/entities/users.entity";
import { BaseEntity } from "../../common/entities/baseEntity";

@Entity()
export class HashedRefreshToken extends BaseEntity {
  @Column()
  token: string;

  @ManyToOne(() => User, (user) => user.hashedRefreshToken)
  user: User;
}
