import {
  Entity,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { HashedRefreshToken } from "../../auth/entities/refreshTokens.entity";
import { BaseEntity } from "../../common/entities/baseEntity";
import { Invite } from "../../invite/entities/invite.entity";
import { Exclude } from "class-transformer";
import { City } from "../../city/entities/city.entity";

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  @Exclude()
  hashedPassword: string;

  @OneToMany(
    () => HashedRefreshToken,
    (hashedRefreshToken) => hashedRefreshToken.user,
    { eager: true, onDelete: "CASCADE", onUpdate: "CASCADE" }
  )
  hashedRefreshToken: HashedRefreshToken[];

  @OneToOne(() => Invite, (invite) => invite.user, {
    eager: true,
    onDelete: "CASCADE",
  })
  @JoinColumn()
  invite: Invite;

  @ManyToMany((type) => City, (city) => city.users, {
    eager: true,
  })
  @JoinTable()
  cities: City[];
}
