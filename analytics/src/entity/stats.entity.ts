import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("stats")
export class Stats {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: string;

  @Column()
  link_code: string;

  @Column("decimal")
  ambassador_revenue: number;

  @Column("timestamp", { default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;
}
