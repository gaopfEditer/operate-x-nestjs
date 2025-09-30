import { BaseRepository } from '@/modules/database/base';
import { CustomRepository } from '@/modules/database/decorators';

import { NovelEntity } from '../entities/novel.entity';

/**
 * 小说Repository
 */
@CustomRepository(NovelEntity)
export class NovelRepository extends BaseRepository<NovelEntity> {
    protected qbName = 'novel';

    /**
     * 根据名称查找小说
     */
    async findByName(name: string): Promise<NovelEntity | null> {
        return this.findOne({ where: { name } });
    }

    /**
     * 根据作者查找小说列表
     */
    async findByAuthor(author: string): Promise<NovelEntity[]> {
        return this.find({
            where: { author },
            order: { createdAt: 'DESC' },
        });
    }

    /**
     * 根据状态查找小说列表
     */
    async findByStatus(status: string): Promise<NovelEntity[]> {
        return this.find({
            where: { status },
            order: { createdAt: 'DESC' },
        });
    }

    /**
     * 根据标签查找小说列表
     */
    async findByTags(tags: string[]): Promise<NovelEntity[]> {
        return this.createQueryBuilder('novel')
            .where('JSON_OVERLAPS(novel.tags, :tags)', { tags: JSON.stringify(tags) })
            .orderBy('novel.createdAt', 'DESC')
            .getMany();
    }

    /**
     * 根据主题查找小说列表
     */
    async findByThemes(themes: string[]): Promise<NovelEntity[]> {
        return this.createQueryBuilder('novel')
            .where('JSON_OVERLAPS(novel.themes, :themes)', { themes: JSON.stringify(themes) })
            .orderBy('novel.createdAt', 'DESC')
            .getMany();
    }

    /**
     * 获取热门小说（按观看次数排序）
     */
    async getPopularNovels(limit = 10): Promise<NovelEntity[]> {
        return this.find({
            where: { enabled: true },
            order: { view_count_parsed: 'DESC' },
            take: limit,
        });
    }

    /**
     * 获取最新小说
     */
    async getLatestNovels(limit = 10): Promise<NovelEntity[]> {
        return this.find({
            where: { enabled: true },
            order: { crawl_time: 'DESC' },
            take: limit,
        });
    }

    /**
     * 获取高评分小说
     */
    async getHighRatedNovels(minRating = 8.0, limit = 10): Promise<NovelEntity[]> {
        return this.createQueryBuilder('novel')
            .where('novel.enabled = :enabled', { enabled: true })
            .andWhere('novel.rating >= :minRating', { minRating })
            .orderBy('novel.rating', 'DESC')
            .take(limit)
            .getMany();
    }

    /**
     * 统计小说数量
     */
    async countByStatus(status?: string): Promise<number> {
        const queryBuilder = this.createQueryBuilder('novel');

        if (status) {
            queryBuilder.where('novel.status = :status', { status });
        }

        return queryBuilder.getCount();
    }

    /**
     * 统计作者作品数量
     */
    async countByAuthor(author: string): Promise<number> {
        return this.count({ where: { author } });
    }
}
