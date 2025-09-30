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

import { NovelVolumeEntity } from './novel-volume.entity';

/**
 * 小说实体
 */
@Exclude()
@Entity('novels')
@Index(['name', 'author']) // 复合索引用于搜索
@Index(['status'])
@Index(['rating'])
@Index(['view_count_parsed'])
@Index(['word_count_parsed'])
@Index(['meat_level_parsed'])
@Index(['crawl_time'])
export class NovelEntity extends BaseEntity {
    @Expose()
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Expose()
    @Column({ comment: '小说名称', length: 200 })
    @Index()
    name!: string;

    @Expose()
    @Column({ comment: '封面图片URL', length: 500, nullable: true })
    cover?: string;

    @Expose()
    @Column({ comment: '详情页面URL', length: 500, nullable: true })
    detail_url?: string;

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
    @Column({ comment: '排名', type: 'int', nullable: true })
    rank?: number;

    @Expose()
    @Column({ comment: '作者', length: 100 })
    @Index()
    author!: string;

    @Expose()
    @Column({ comment: '评分', type: 'decimal', precision: 3, scale: 2, nullable: true })
    @Index()
    rating?: number;

    @Expose()
    @Column({
        comment: '主题标签',
        type: 'simple-json',
        nullable: true,
    })
    themes?: string[];

    @Expose()
    @Column({
        comment: '内容标签',
        type: 'simple-json',
        nullable: true,
    })
    tags?: string[];

    @Expose()
    @Column({ comment: '最新章节', length: 100, nullable: true })
    latest_chapter?: string;

    @Expose()
    @Column({ comment: '更新时间', type: 'timestamp', nullable: true })
    @Index()
    update_time?: Date;

    @Expose()
    @Column({ comment: '观看次数', type: 'bigint', default: 0 })
    @Index()
    view_count_parsed!: number;

    @Expose()
    @Column({ comment: '字数', type: 'bigint', default: 0 })
    @Index()
    word_count_parsed!: number;

    @Expose()
    @Column({ comment: '肉度等级', type: 'decimal', precision: 5, scale: 2, nullable: true })
    @Index()
    meat_level_parsed?: number;

    @Expose()
    @Column({ comment: '特征值', length: 50, nullable: true })
    feature_value?: string;

    @Expose()
    @Column({ comment: '爬取时间', type: 'timestamp' })
    @Index()
    crawl_time!: Date;

    @Expose()
    @Column({ comment: '是否启用', default: true })
    enabled!: boolean;

    @Expose({ groups: ['novel-detail'] })
    @Type(() => Date)
    @CreateDateColumn({ comment: '创建时间' })
    createdAt!: Date;

    @Expose({ groups: ['novel-detail'] })
    @Type(() => Date)
    @UpdateDateColumn({ comment: '更新时间' })
    updatedAt!: Date;

    @Expose({ groups: ['novel-detail'] })
    @Type(() => Date)
    @DeleteDateColumn({ comment: '删除时间' })
    deletedAt!: Date;

    // 关联关系
    @Expose({ groups: ['novel-detail', 'novel-list'] })
    @Type(() => NovelVolumeEntity)
    @OneToMany(() => NovelVolumeEntity, (volume) => volume.novel, {
        cascade: true,
        eager: false,
    })
    volumes!: NovelVolumeEntity[];
}
