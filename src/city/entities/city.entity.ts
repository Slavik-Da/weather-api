import { BaseEntity } from "../../common/entities/baseEntity";
import { Column, Entity, JoinTable, ManyToMany } from "typeorm";
import { User } from "../../users/entities/users.entity";

@Entity()
export class City extends BaseEntity {
  @Column()
  name: string;

  @Column()
  country: string;

  @Column()
  lat: string;

  @Column()
  lon: string;

  @ManyToMany((type) => User, (user) => user.cities)
  users: User[];
}
