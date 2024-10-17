import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Ranking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user: string;

  @Column()
  revenue: number;
}
