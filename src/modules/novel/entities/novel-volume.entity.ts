import { Exclude, Expose, Type } from 'class-transformer';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { NovelChapterEntity } from './novel-chapter.entity';
import { NovelEntity } from './novel.entity';

/**
 * 小说分卷实体
 */
@Exclude()
@Entity('novel_volumes')
@Index(['novel_id', 'volume_name'])
export class NovelVolumeEntity extends BaseEntity {
    @Expose()
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Expose()
    @Column({ comment: '分卷名称', length: 100 })
    volume_name!: string;

    @Expose()
    @Column({ comment: '分卷排序', type: 'int', default: 0 })
    sort_order!: number;

    @Expose()
    @Column({ comment: '分卷描述', type: 'text', nullable: true })
    description?: string;

    @Expose()
    @Column({ comment: '是否启用', default: true })
    enabled!: boolean;

    // 关联小说
    @Expose()
    @Column({ comment: '小说ID' })
    @Index()
    novel_id!: string;

    @Expose({ groups: ['volume-detail'] })
    @Type(() => NovelEntity)
    @ManyToOne(() => NovelEntity, (novel) => novel.volumes, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'novel_id' })
    novel!: NovelEntity;

    // 关联章节
    @Expose({ groups: ['volume-detail'] })
    @Type(() => NovelChapterEntity)
    @OneToMany(() => NovelChapterEntity, (chapter) => chapter.volume, {
        cascade: true,
        eager: false,
    })
    chapters!: NovelChapterEntity[];

    @Expose({ groups: ['volume-detail'] })
    @Type(() => Date)
    @CreateDateColumn({ comment: '创建时间', name: 'created_at' })
    createdAt!: Date;

    @Expose({ groups: ['volume-detail'] })
    @Type(() => Date)
    @UpdateDateColumn({ comment: '更新时间', name: 'updated_at' })
    updatedAt!: Date;

    @Expose({ groups: ['volume-detail'] })
    @Type(() => Date)
    @DeleteDateColumn({ comment: '删除时间', name: 'deleted_at' })
    deletedAt!: Date;
}
