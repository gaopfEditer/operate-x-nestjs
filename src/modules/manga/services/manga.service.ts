import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseService } from '@/modules/database/base';
import { IPaginateDto } from '@/modules/database/types';
import { IPaginationMeta } from 'nestjs-typeorm-paginate';

import { CreateMangaDto, QueryMangaDto, UpdateMangaDto } from '../dtos/manga.dto';
import { MangaEntity } from '../entities/manga.entity';
import { MangaChapterEntity } from '../entities/manga-chapter.entity';
import { MangaImageEntity } from '../entities/manga-image.entity';
import { MangaRepository } from '../repositories/manga.repository';

/**
 * 漫画服务
 */
@Injectable()
export class MangaService extends BaseService<MangaEntity, MangaRepository> {
    constructor(
        protected readonly mangaRepository: MangaRepository,
        @InjectRepository(MangaChapterEntity)
        protected readonly chapterRepository: Repository<MangaChapterEntity>,
        @InjectRepository(MangaImageEntity)
        protected readonly imageRepository: Repository<MangaImageEntity>,
    ) {
        super(mangaRepository);
    }

    /**
     * 创建漫画
     */
    async create(data: CreateMangaDto): Promise<MangaEntity> {
        const manga = this.mangaRepository.create({
            ...data,
            generated_time: new Date(data.generated_time),
        });
        return this.mangaRepository.save(manga);
    }

    /**
     * 更新漫画
     */
    async update(id: string, data: UpdateMangaDto): Promise<MangaEntity> {
        const updateData: any = { ...data };
        if (data.generated_time) {
            updateData.generated_time = new Date(data.generated_time);
        }

        await this.mangaRepository.update(id, updateData);
        return this.detail(id);
    }

    /**
     * 分页查询漫画
     */
    async paginate(options: IPaginateDto<IPaginationMeta> & QueryMangaDto) {
        const queryBuilder = this.mangaRepository.buildBaseQuery();

        // 添加搜索条件
        if (options.title) {
            queryBuilder.andWhere('manga.title LIKE :title', { title: `%${options.title}%` });
        }

        if (options.author) {
            queryBuilder.andWhere('manga.author LIKE :author', { author: `%${options.author}%` });
        }

        if (options.status) {
            queryBuilder.andWhere('manga.status = :status', { status: options.status });
        }

        if (options.tags) {
            queryBuilder.andWhere('JSON_CONTAINS(manga.tags, :tags)', {
                tags: JSON.stringify(options.tags)
            });
        }

        if (options.categories) {
            queryBuilder.andWhere('JSON_CONTAINS(manga.categories, :categories)', {
                categories: JSON.stringify(options.categories)
            });
        }

        if (options.min_chapters !== undefined) {
            queryBuilder.andWhere('manga.total_chapters >= :min_chapters', {
                min_chapters: options.min_chapters
            });
        }

        if (options.max_chapters !== undefined) {
            queryBuilder.andWhere('manga.total_chapters <= :max_chapters', {
                max_chapters: options.max_chapters
            });
        }

        if (options.enabled !== undefined) {
            queryBuilder.andWhere('manga.enabled = :enabled', { enabled: options.enabled });
        }

        // 排序
        queryBuilder.orderBy('manga.createdAt', 'DESC');

        return super.paginate(options, async (qb) => {
            // 应用自定义查询条件
            if (options.title) {
                qb.andWhere('manga.title LIKE :title', { title: `%${options.title}%` });
            }
            if (options.author) {
                qb.andWhere('manga.author LIKE :author', { author: `%${options.author}%` });
            }
            if (options.status) {
                qb.andWhere('manga.status = :status', { status: options.status });
            }
            if (options.tags) {
                qb.andWhere('JSON_CONTAINS(manga.tags, :tags)', {
                    tags: JSON.stringify(options.tags)
                });
            }
            if (options.categories) {
                qb.andWhere('JSON_CONTAINS(manga.categories, :categories)', {
                    categories: JSON.stringify(options.categories)
                });
            }
            if (options.min_chapters !== undefined) {
                qb.andWhere('manga.total_chapters >= :min_chapters', {
                    min_chapters: options.min_chapters
                });
            }
            if (options.max_chapters !== undefined) {
                qb.andWhere('manga.total_chapters <= :max_chapters', {
                    max_chapters: options.max_chapters
                });
            }
            if (options.enabled !== undefined) {
                qb.andWhere('manga.enabled = :enabled', { enabled: options.enabled });
            }
            return qb;
        });
    }

    /**
     * 获取漫画章节列表
     */
    async getChapters(mangaId: string): Promise<MangaChapterEntity[]> {
        return this.chapterRepository.find({
            where: { manga_id: mangaId, enabled: true },
            order: { sort_order: 'ASC', createdAt: 'ASC' },
        });
    }

    /**
     * 获取漫画章节信息
     */
    async getChapter(mangaId: string, chapterId: string): Promise<MangaChapterEntity> {
        const chapter = await this.chapterRepository
            .createQueryBuilder('chapter')
            .leftJoinAndSelect('chapter.manga', 'manga')
            .where('chapter.id = :chapterId', { chapterId })
            .andWhere('manga.id = :mangaId', { mangaId })
            .andWhere('chapter.enabled = :enabled', { enabled: true })
            .getOne();

        if (!chapter) {
            throw new Error('章节不存在');
        }

        return chapter;
    }

    /**
     * 获取漫画章节图片列表
     */
    async getChapterImages(mangaId: string, chapterId: string): Promise<MangaImageEntity[]> {
        // 验证章节是否属于该漫画
        await this.getChapter(mangaId, chapterId);

        return this.imageRepository.find({
            where: { chapter_id: chapterId, enabled: true },
            order: { image_order: 'ASC' },
        });
    }

    /**
     * 获取漫画图片
     */
    async getImage(mangaId: string, chapterId: string, imageId: string): Promise<MangaImageEntity> {
        // 验证章节是否属于该漫画
        await this.getChapter(mangaId, chapterId);

        const image = await this.imageRepository.findOne({
            where: { id: imageId, chapter_id: chapterId, enabled: true },
        });

        if (!image) {
            throw new Error('图片不存在');
        }

        return image;
    }

    /**
     * 批量创建章节和图片
     */
    async createChaptersAndImages(
        mangaId: string,
        chaptersData: Array<{
            chapter_name: string;
            chapter_url?: string;
            sort_order?: number;
            images: Array<{
                image_url: string;
                image_order?: number;
                width?: number;
                height?: number;
                file_size?: number;
                format?: string;
            }>;
        }>
    ): Promise<void> {
        for (let i = 0; i < chaptersData.length; i++) {
            const chapterData = chaptersData[i];
            const chapter = this.chapterRepository.create({
                manga_id: mangaId,
                chapter_name: chapterData.chapter_name,
                chapter_url: chapterData.chapter_url,
                sort_order: chapterData.sort_order ?? i,
                image_count: chapterData.images.length,
            });
            const savedChapter = await this.chapterRepository.save(chapter);

            for (let j = 0; j < chapterData.images.length; j++) {
                const imageData = chapterData.images[j];
                const image = this.imageRepository.create({
                    chapter_id: savedChapter.id,
                    image_url: imageData.image_url,
                    image_order: imageData.image_order ?? j,
                    width: imageData.width,
                    height: imageData.height,
                    file_size: imageData.file_size,
                    format: imageData.format,
                });
                await this.imageRepository.save(image);
            }
        }
    }

    /**
     * 更新图片下载状态
     */
    async updateImageDownloadStatus(
        imageId: string,
        localPath: string,
        fileSize?: number
    ): Promise<MangaImageEntity> {
        await this.imageRepository.update(imageId, {
            local_path: localPath,
            downloaded: true,
            download_time: new Date(),
            file_size: fileSize,
        });
        return this.imageRepository.findOneOrFail({ where: { id: imageId } });
    }

    /**
     * 更新章节爬取状态
     */
    async updateChapterCrawlStatus(
        chapterId: string,
        imageCount: number
    ): Promise<MangaChapterEntity> {
        await this.chapterRepository.update(chapterId, {
            image_count: imageCount,
            images_crawled: true,
            crawl_time: new Date(),
        });
        return this.chapterRepository.findOneOrFail({ where: { id: chapterId } });
    }
}
