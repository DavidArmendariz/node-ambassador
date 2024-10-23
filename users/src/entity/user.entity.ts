import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({
    unique: true,
    
  })
  email: string;

  @Column({
    select: false,
    nullable: true,
  })
  password: string | null;

  @Column()
  is_ambassador: boolean;
  

  @Column({
    nullable: true,
  })
  id_token: string | null;

  get name(): string {
    return this.first_name + " " + this.last_name;
  }
}
