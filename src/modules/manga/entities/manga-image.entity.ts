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

import { MangaChapterEntity } from './manga-chapter.entity';

/**
 * 漫画图片实体
 */
@Exclude()
@Entity('manga_images')
@Index(['chapter_id', 'image_order'])
@Index(['image_url'])
export class MangaImageEntity extends BaseEntity {
    @Expose()
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Expose()
    @Column({ comment: '图片URL', length: 500 })
    @Index()
    image_url!: string;

    @Expose()
    @Column({ comment: '本地存储路径', length: 500, nullable: true })
    local_path?: string;

    @Expose()
    @Column({ comment: '图片排序', type: 'int', default: 0 })
    image_order!: number;

    @Expose()
    @Column({ comment: '图片宽度', type: 'int', nullable: true })
    width?: number;

    @Expose()
    @Column({ comment: '图片高度', type: 'int', nullable: true })
    height?: number;

    @Expose()
    @Column({ comment: '文件大小(字节)', type: 'bigint', nullable: true })
    file_size?: number;

    @Expose()
    @Column({ comment: '图片格式', length: 10, nullable: true })
    format?: string;

    @Expose()
    @Column({ comment: '是否已下载', default: false })
    downloaded!: boolean;

    @Expose()
    @Column({ comment: '下载时间', type: 'timestamp', nullable: true })
    download_time?: Date;

    @Expose()
    @Column({ comment: '是否启用', default: true })
    enabled!: boolean;

    // 关联章节
    @Expose()
    @Column({ comment: '章节ID' })
    @Index()
    chapter_id!: string;

    @Expose({ groups: ['image-detail'] })
    @Type(() => MangaChapterEntity)
    @ManyToOne(() => MangaChapterEntity, (chapter) => chapter.images, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'chapter_id' })
    chapter!: MangaChapterEntity;

    @Expose({ groups: ['image-detail'] })
    @Type(() => Date)
    @CreateDateColumn({ comment: '创建时间', name: 'created_at' })
    createdAt!: Date;

    @Expose({ groups: ['image-detail'] })
    @Type(() => Date)
    @UpdateDateColumn({ comment: '更新时间', name: 'updated_at' })
    updatedAt!: Date;

    @Expose({ groups: ['image-detail'] })
    @Type(() => Date)
    @DeleteDateColumn({ comment: '删除时间', name: 'deleted_at' })
    deletedAt!: Date;
}
