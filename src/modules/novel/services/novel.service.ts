import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationMeta } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';

import { BaseService } from '@/modules/database/base';
import { IPaginateDto } from '@/modules/database/types';

import { CreateNovelDto, QueryNovelDto, UpdateNovelDto } from '../dtos/novel.dto';
import { NovelChapterEntity } from '../entities/novel-chapter.entity';
import { NovelVolumeEntity } from '../entities/novel-volume.entity';
import { NovelEntity } from '../entities/novel.entity';
import { NovelRepository } from '../repositories/novel.repository';

/**
 * 小说服务
 */
@Injectable()
export class NovelService extends BaseService<NovelEntity, NovelRepository> {
    constructor(
        protected readonly novelRepository: NovelRepository,
        @InjectRepository(NovelVolumeEntity)
        protected readonly volumeRepository: Repository<NovelVolumeEntity>,
        @InjectRepository(NovelChapterEntity)
        protected readonly chapterRepository: Repository<NovelChapterEntity>,
    ) {
        super(novelRepository);
    }

    /**
     * 创建小说
     */
    async create(data: CreateNovelDto): Promise<NovelEntity> {
        const novel = this.novelRepository.create({
            ...data,
            crawl_time: new Date(data.crawl_time),
            update_time: data.update_time ? new Date(data.update_time) : undefined,
        });
        return this.novelRepository.save(novel);
    }

    /**
     * 更新小说
     */
    async update(id: string, data: UpdateNovelDto): Promise<NovelEntity> {
        const updateData: any = { ...data };
        if (data.crawl_time) {
            updateData.crawl_time = new Date(data.crawl_time);
        }
        if (data.update_time) {
            updateData.update_time = new Date(data.update_time);
        }

        await this.novelRepository.update(id, updateData);
        return this.detail(id);
    }

    /**
     * 分页查询小说
     */
    async paginate(options: IPaginateDto<IPaginationMeta> & QueryNovelDto) {
        return super.paginate(options, async (qb) => {
            // 应用自定义查询条件
            if (options.name) {
                qb.andWhere('novel.name LIKE :name', { name: `%${options.name}%` });
            }
            if (options.author) {
                qb.andWhere('novel.author LIKE :author', { author: `%${options.author}%` });
            }
            if (options.status) {
                qb.andWhere('novel.status = :status', { status: options.status });
            }
            if (options.themes) {
                qb.andWhere('JSON_CONTAINS(novel.themes, :themes)', {
                    themes: JSON.stringify(options.themes),
                });
            }
            if (options.tags) {
                qb.andWhere('JSON_CONTAINS(novel.tags, :tags)', {
                    tags: JSON.stringify(options.tags),
                });
            }
            if (options.min_rating !== undefined) {
                qb.andWhere('novel.rating >= :min_rating', { min_rating: options.min_rating });
            }
            if (options.max_rating !== undefined) {
                qb.andWhere('novel.rating <= :max_rating', { max_rating: options.max_rating });
            }
            if (options.min_word_count !== undefined) {
                qb.andWhere('novel.word_count_parsed >= :min_word_count', {
                    min_word_count: options.min_word_count,
                });
            }
            if (options.max_word_count !== undefined) {
                qb.andWhere('novel.word_count_parsed <= :max_word_count', {
                    max_word_count: options.max_word_count,
                });
            }
            if (options.min_meat_level !== undefined) {
                qb.andWhere('novel.meat_level_parsed >= :min_meat_level', {
                    min_meat_level: options.min_meat_level,
                });
            }
            if (options.max_meat_level !== undefined) {
                qb.andWhere('novel.meat_level_parsed <= :max_meat_level', {
                    max_meat_level: options.max_meat_level,
                });
            }
            if (options.enabled !== undefined) {
                qb.andWhere('novel.enabled = :enabled', { enabled: options.enabled });
            }
            return qb;
        });
    }

    /**
     * 获取小说分卷列表
     */
    async getVolumes(novelId: string): Promise<NovelVolumeEntity[]> {
        return this.volumeRepository.find({
            where: { novel_id: novelId, enabled: true },
            order: { sort_order: 'ASC', createdAt: 'ASC' },
        });
    }

    /**
     * 获取小说章节列表
     */
    async getChapters(novelId: string, volumeId?: string): Promise<NovelChapterEntity[]> {
        const queryBuilder = this.chapterRepository
            .createQueryBuilder('chapter')
            .leftJoinAndSelect('chapter.volume', 'volume')
            .where('volume.novel_id = :novelId', { novelId })
            .andWhere('chapter.enabled = :enabled', { enabled: true });

        if (volumeId) {
            queryBuilder.andWhere('chapter.volume_id = :volumeId', { volumeId });
        }

        return queryBuilder
            .orderBy('volume.sort_order', 'ASC')
            .addOrderBy('chapter.sort_order', 'ASC')
            .getMany();
    }

    /**
     * 获取小说章节内容
     */
    async getChapterContent(novelId: string, chapterId: string): Promise<NovelChapterEntity> {
        const chapter = await this.chapterRepository
            .createQueryBuilder('chapter')
            .leftJoinAndSelect('chapter.volume', 'volume')
            .where('chapter.id = :chapterId', { chapterId })
            .andWhere('volume.novel_id = :novelId', { novelId })
            .andWhere('chapter.enabled = :enabled', { enabled: true })
            .getOne();

        if (!chapter) {
            throw new Error('章节不存在');
        }

        return chapter;
    }

    /**
     * 批量创建分卷和章节
     */
    async createVolumesAndChapters(
        novelId: string,
        volumesData: Array<{
            volume_name: string;
            chapters: Array<{
                chapter_title: string;
                chapter_url?: string;
                sort_order?: number;
            }>;
        }>,
    ): Promise<void> {
        for (const volumeData of volumesData) {
            const volume = this.volumeRepository.create({
                novel_id: novelId,
                volume_name: volumeData.volume_name,
                sort_order: 0,
            });
            const savedVolume = await this.volumeRepository.save(volume);

            for (let i = 0; i < volumeData.chapters.length; i++) {
                const chapterData = volumeData.chapters[i];
                const chapter = this.chapterRepository.create({
                    volume_id: savedVolume.id,
                    chapter_title: chapterData.chapter_title,
                    chapter_url: chapterData.chapter_url,
                    sort_order: chapterData.sort_order ?? i,
                });
                await this.chapterRepository.save(chapter);
            }
        }
    }

    /**
     * 更新章节内容
     */
    async updateChapterContent(chapterId: string, content: string): Promise<NovelChapterEntity> {
        const wordCount = content.length;
        await this.chapterRepository.update(chapterId, {
            content,
            word_count: wordCount,
            content_crawled: true,
            crawl_time: new Date(),
        });
        return this.chapterRepository.findOneOrFail({ where: { id: chapterId } });
    }
}
