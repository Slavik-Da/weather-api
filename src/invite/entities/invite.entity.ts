import { Entity, OneToOne } from "typeorm";
import { User } from "../../users/entities/users.entity";
import { BaseEntity } from "../../common/entities/baseEntity";

@Entity()
export class Invite extends BaseEntity {
  @OneToOne(() => User, (user) => user.invite)
  user: User;
}
