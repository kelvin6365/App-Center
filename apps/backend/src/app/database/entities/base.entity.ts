import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @VersionColumn()
  version: number;

  @Column({ nullable: true, type: 'uuid', name: 'created_by', unique: false })
  createdBy: string;

  @Column({ nullable: true, type: 'uuid', name: 'updated_by', unique: false })
  updatedBy: string;
}
