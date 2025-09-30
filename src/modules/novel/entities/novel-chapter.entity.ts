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
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { NovelVolumeEntity } from './novel-volume.entity';

/**
 * 小说章节实体
 */
@Exclude()
@Entity('novel_chapters')
@Index(['volume_id', 'chapter_title'])
@Index(['chapter_url'])
export class NovelChapterEntity extends BaseEntity {
    @Expose()
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Expose()
    @Column({ comment: '章节标题', length: 200 })
    chapter_title!: string;

    @Expose()
    @Column({ comment: '章节URL', length: 500, nullable: true })
    @Index()
    chapter_url?: string;

    @Expose()
    @Column({ comment: '章节内容', type: 'longtext', nullable: true })
    content?: string;

    @Expose()
    @Column({ comment: '章节排序', type: 'int', default: 0 })
    sort_order!: number;

    @Expose()
    @Column({ comment: '字数统计', type: 'int', default: 0 })
    word_count!: number;

    @Expose()
    @Column({ comment: '是否已爬取内容', default: false })
    content_crawled!: boolean;

    @Expose()
    @Column({ comment: '爬取时间', type: 'timestamp', nullable: true })
    crawl_time?: Date;

    @Expose()
    @Column({ comment: '是否启用', default: true })
    enabled!: boolean;

    // 关联分卷
    @Expose()
    @Column({ comment: '分卷ID' })
    @Index()
    volume_id!: string;

    @Expose({ groups: ['chapter-detail'] })
    @Type(() => NovelVolumeEntity)
    @ManyToOne(() => NovelVolumeEntity, (volume) => volume.chapters, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'volume_id' })
    volume!: NovelVolumeEntity;

    @Expose({ groups: ['chapter-detail'] })
    @Type(() => Date)
    @CreateDateColumn({ comment: '创建时间' })
    createdAt!: Date;

    @Expose({ groups: ['chapter-detail'] })
    @Type(() => Date)
    @UpdateDateColumn({ comment: '更新时间' })
    updatedAt!: Date;

    @Expose({ groups: ['chapter-detail'] })
    @Type(() => Date)
    @DeleteDateColumn({ comment: '删除时间' })
    deletedAt!: Date;
}
