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

import { MangaEntity } from './manga.entity';
import { MangaImageEntity } from './manga-image.entity';

/**
 * 漫画章节实体
 */
@Exclude()
@Entity('manga_chapters')
@Index(['manga_id', 'chapter_name'])
@Index(['chapter_url'])
export class MangaChapterEntity extends BaseEntity {
    @Expose()
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Expose()
    @Column({ comment: '章节名称', length: 200 })
    chapter_name!: string;

    @Expose()
    @Column({ comment: '章节URL', length: 500, nullable: true })
    @Index()
    chapter_url?: string;

    @Expose()
    @Column({ comment: '章节排序', type: 'int', default: 0 })
    sort_order!: number;

    @Expose()
    @Column({ comment: '图片数量', type: 'int', default: 0 })
    image_count!: number;

    @Expose()
    @Column({ comment: '是否已爬取图片', default: false })
    images_crawled!: boolean;

    @Expose()
    @Column({ comment: '爬取时间', type: 'timestamp', nullable: true })
    crawl_time?: Date;

    @Expose()
    @Column({ comment: '是否启用', default: true })
    enabled!: boolean;

    // 关联漫画
    @Expose()
    @Column({ comment: '漫画ID' })
    @Index()
    manga_id!: string;

    @Expose({ groups: ['chapter-detail'] })
    @Type(() => MangaEntity)
    @ManyToOne(() => MangaEntity, (manga) => manga.chapters, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'manga_id' })
    manga!: MangaEntity;

    // 关联图片
    @Expose({ groups: ['chapter-detail'] })
    @Type(() => MangaImageEntity)
    @OneToMany(() => MangaImageEntity, (image) => image.chapter, {
        cascade: true,
        eager: false,
    })
    images!: MangaImageEntity[];

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
