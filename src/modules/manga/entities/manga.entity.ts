import { Exclude, Expose, Type } from 'class-transformer';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    Index,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { MangaChapterEntity } from './manga-chapter.entity';

/**
 * 漫画实体
 */
@Exclude()
@Entity('mangas')
@Index(['title', 'author'])
@Index(['status'])
@Index(['total_chapters'])
@Index(['generated_time'])
export class MangaEntity extends BaseEntity {
    @Expose()
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Expose()
    @Column({ comment: '漫画标题', length: 200 })
    @Index()
    title!: string;

    @Expose()
    @Column({ comment: '源站URL', length: 500, nullable: true })
    source_url?: string;

    @Expose()
    @Column({ comment: '封面图片URL', length: 500, nullable: true })
    cover?: string;

    @Expose()
    @Column({ comment: '作者', length: 100, nullable: true })
    @Index()
    author?: string;

    @Expose()
    @Column({ comment: '总章节数', type: 'int', default: 0 })
    @Index()
    total_chapters!: number;

    @Expose()
    @Column({
        comment: '连载状态',
        type: 'enum',
        enum: ['连载中', '已完结', '暂停更新'],
        default: '连载中',
    })
    @Index()
    status!: string;

    @Expose()
    @Column({ comment: '标签', type: 'simple-json', nullable: true })
    tags?: string[];

    @Expose()
    @Column({ comment: '分类', type: 'simple-json', nullable: true })
    categories?: string[];

    @Expose()
    @Column({ comment: '描述', type: 'text', nullable: true })
    description?: string;

    @Expose()
    @Column({ comment: '生成时间', type: 'timestamp' })
    @Index()
    generated_time!: Date;

    @Expose()
    @Column({ comment: '爬取统计', type: 'simple-json', nullable: true })
    crawl_statistics?: {
        success_chapters: number;
        failed_chapters: number;
        success_rate: number;
        success_list: Array<{
            name: string;
            url: string;
            images: number;
        }>;
    };

    @Expose()
    @Column({ comment: '是否启用', default: true })
    enabled!: boolean;

    @Expose({ groups: ['manga-detail'] })
    @Type(() => Date)
    @CreateDateColumn({ comment: '创建时间', name: 'created_at' })
    createdAt!: Date;

    @Expose({ groups: ['manga-detail'] })
    @Type(() => Date)
    @UpdateDateColumn({ comment: '更新时间', name: 'updated_at' })
    updatedAt!: Date;

    @Expose({ groups: ['manga-detail'] })
    @Type(() => Date)
    @DeleteDateColumn({ comment: '删除时间', name: 'deleted_at' })
    deletedAt!: Date;

    // 关联关系
    @Expose({ groups: ['manga-detail', 'manga-list'] })
    @Type(() => MangaChapterEntity)
    @OneToMany(() => MangaChapterEntity, (chapter) => chapter.manga, {
        cascade: true,
        eager: false,
    })
    chapters!: MangaChapterEntity[];
}
