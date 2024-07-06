import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Blog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  thumbnail: string;

  @Column()
  content: string;

  @Column()
  videoURL: string;

  // @Column("jsonb", { nullable: true })
  // options: string[];
}
