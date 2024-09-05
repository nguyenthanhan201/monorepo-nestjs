import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ database: "postgres" })
export class Blog extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column({
    default: "https://picsum.photos/200/300",
  })
  thumbnail: string;

  @Column({
    default: "no content",
  })
  content: string;

  @Column()
  videoURL: string;

  // @Column("jsonb", { nullable: true })
  // options: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
