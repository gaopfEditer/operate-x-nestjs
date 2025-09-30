import { BaseRepository } from '@/modules/database/base';
import { CustomRepository } from '@/modules/database/decorators';

import { MangaEntity } from '../entities/manga.entity';

/**
 * 漫画Repository
 */
@CustomRepository(MangaEntity)
export class MangaRepository extends BaseRepository<MangaEntity> {
    protected qbName = 'manga';

    /**
     * 根据标题查找漫画
     */
    async findByTitle(title: string): Promise<MangaEntity | null> {
        return this.findOne({ where: { title } });
    }

    /**
     * 根据作者查找漫画列表
     */
    async findByAuthor(author: string): Promise<MangaEntity[]> {
        return this.find({
            where: { author },
            order: { createdAt: 'DESC' }
        });
    }

    /**
     * 根据状态查找漫画列表
     */
    async findByStatus(status: string): Promise<MangaEntity[]> {
        return this.find({
            where: { status },
            order: { createdAt: 'DESC' }
        });
    }

    /**
     * 根据标签查找漫画列表
     */
    async findByTags(tags: string[]): Promise<MangaEntity[]> {
        return this
            .createQueryBuilder('manga')
            .where('JSON_OVERLAPS(manga.tags, :tags)', { tags: JSON.stringify(tags) })
            .orderBy('manga.createdAt', 'DESC')
            .getMany();
    }

    /**
     * 根据分类查找漫画列表
     */
    async findByCategories(categories: string[]): Promise<MangaEntity[]> {
        return this
            .createQueryBuilder('manga')
            .where('JSON_OVERLAPS(manga.categories, :categories)', {
                categories: JSON.stringify(categories)
            })
            .orderBy('manga.createdAt', 'DESC')
            .getMany();
    }

    /**
     * 获取热门漫画（按章节数排序）
     */
    async getPopularMangas(limit: number = 10): Promise<MangaEntity[]> {
        return this.find({
            where: { enabled: true },
            order: { total_chapters: 'DESC' },
            take: limit,
        });
    }

    /**
     * 获取最新漫画
     */
    async getLatestMangas(limit: number = 10): Promise<MangaEntity[]> {
        return this.find({
            where: { enabled: true },
            order: { generated_time: 'DESC' },
            take: limit,
        });
    }

    /**
     * 根据章节数范围查找漫画
     */
    async findByChapterRange(minChapters: number, maxChapters: number): Promise<MangaEntity[]> {
        return this
            .createQueryBuilder('manga')
            .where('manga.total_chapters >= :minChapters', { minChapters })
            .andWhere('manga.total_chapters <= :maxChapters', { maxChapters })
            .andWhere('manga.enabled = :enabled', { enabled: true })
            .orderBy('manga.total_chapters', 'DESC')
            .getMany();
    }

    /**
     * 统计漫画数量
     */
    async countByStatus(status?: string): Promise<number> {
        const queryBuilder = this.createQueryBuilder('manga');

        if (status) {
            queryBuilder.where('manga.status = :status', { status });
        }

        return queryBuilder.getCount();
    }

    /**
     * 统计作者作品数量
     */
    async countByAuthor(author: string): Promise<number> {
        return this.count({ where: { author } });
    }

    /**
     * 获取分类统计
     */
    async getCategoryStats(): Promise<Array<{ category: string; count: number }>> {
        // 这里需要根据实际的数据库类型来实现
        // MySQL 8.0+ 支持 JSON_TABLE
        return this
            .createQueryBuilder('manga')
            .select('category', 'category')
            .addSelect('COUNT(*)', 'count')
            .where('manga.enabled = :enabled', { enabled: true })
            .groupBy('category')
            .orderBy('count', 'DESC')
            .getRawMany();
    }
}
