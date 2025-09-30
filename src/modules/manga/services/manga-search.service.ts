import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

import { MangaEntity } from '../entities/manga.entity';
import { MangaSearchFields } from '../constants';

/**
 * 漫画搜索服务
 */
@Injectable()
export class MangaSearchService {
    private readonly indexName = 'mangas';

    constructor(private readonly elasticsearchService: ElasticsearchService) {}

    /**
     * 创建或更新漫画索引
     */
    async indexManga(manga: MangaEntity): Promise<void> {
        const document = {
            id: manga.id,
            title: manga.title,
            author: manga.author,
            status: manga.status,
            tags: manga.tags || [],
            categories: manga.categories || [],
            description: manga.description,
            total_chapters: manga.total_chapters,
            generated_time: manga.generated_time,
            created_at: manga.createdAt,
            updated_at: manga.updatedAt,
        };

        await this.elasticsearchService.index({
            index: this.indexName,
            id: manga.id,
            body: document,
        });
    }

    /**
     * 批量索引漫画
     */
    async indexMangas(mangas: MangaEntity[]): Promise<void> {
        const body = mangas.flatMap(manga => [
            { index: { _index: this.indexName, _id: manga.id } },
            {
                id: manga.id,
                title: manga.title,
                author: manga.author,
                status: manga.status,
                tags: manga.tags || [],
                categories: manga.categories || [],
                description: manga.description,
                total_chapters: manga.total_chapters,
                generated_time: manga.generated_time,
                created_at: manga.createdAt,
                updated_at: manga.updatedAt,
            }
        ]);

        await this.elasticsearchService.bulk({ body });
    }

    /**
     * 搜索漫画
     */
    async searchMangas(query: string, filters: any = {}): Promise<{
        hits: any[];
        total: number;
        took: number;
    }> {
        const searchQuery: any = {
            bool: {
                must: [],
                filter: [],
            },
        };

        // 全文搜索
        if (query) {
            searchQuery.bool.must.push({
                multi_match: {
                    query,
                    fields: MangaSearchFields,
                    type: 'best_fields',
                    fuzziness: 'AUTO',
                },
            });
        }

        // 过滤条件
        if (filters.author) {
            searchQuery.bool.filter.push({
                match: { author: filters.author },
            });
        }

        if (filters.status) {
            searchQuery.bool.filter.push({
                term: { status: filters.status },
            });
        }

        if (filters.min_chapters !== undefined) {
            searchQuery.bool.filter.push({
                range: { total_chapters: { gte: filters.min_chapters } },
            });
        }

        if (filters.max_chapters !== undefined) {
            searchQuery.bool.filter.push({
                range: { total_chapters: { lte: filters.max_chapters } },
            });
        }

        if (filters.tags && filters.tags.length > 0) {
            searchQuery.bool.filter.push({
                terms: { tags: filters.tags },
            });
        }

        if (filters.categories && filters.categories.length > 0) {
            searchQuery.bool.filter.push({
                terms: { categories: filters.categories },
            });
        }

        const response = await this.elasticsearchService.search({
            index: this.indexName,
            body: {
                query: searchQuery,
                sort: filters.sort || [{ created_at: { order: 'desc' } }],
                from: filters.from || 0,
                size: filters.size || 20,
                highlight: {
                    fields: {
                        title: {},
                        author: {},
                        tags: {},
                        categories: {},
                        description: {},
                    },
                },
            },
        });

        return {
            hits: response.hits.hits.map((hit: any) => ({
                ...hit._source,
                highlight: hit.highlight,
                score: hit._score,
            })),
            total: typeof response.hits.total === 'number' ? response.hits.total : response.hits.total.value,
            took: response.took,
        };
    }

    /**
     * 删除漫画索引
     */
    async deleteManga(id: string): Promise<void> {
        await this.elasticsearchService.delete({
            index: this.indexName,
            id,
        });
    }

    /**
     * 创建索引映射
     */
    async createIndex(): Promise<void> {
        const exists = await this.elasticsearchService.indices.exists({
            index: this.indexName,
        });

        if (!exists) {
            await this.elasticsearchService.indices.create({
                index: this.indexName,
                body: {
                    mappings: {
                        properties: {
                            id: { type: 'keyword' },
                            title: {
                                type: 'text',
                                analyzer: 'ik_max_word',
                                search_analyzer: 'ik_smart',
                            },
                            author: {
                                type: 'text',
                                analyzer: 'ik_max_word',
                                search_analyzer: 'ik_smart',
                            },
                            status: { type: 'keyword' },
                            tags: { type: 'keyword' },
                            categories: { type: 'keyword' },
                            description: {
                                type: 'text',
                                analyzer: 'ik_max_word',
                                search_analyzer: 'ik_smart',
                            },
                            total_chapters: { type: 'integer' },
                            generated_time: { type: 'date' },
                            created_at: { type: 'date' },
                            updated_at: { type: 'date' },
                        },
                    },
                    settings: {
                        number_of_shards: 1,
                        number_of_replicas: 0,
                        analysis: {
                            analyzer: {
                                ik_max_word: {
                                    type: 'custom',
                                    tokenizer: 'ik_max_word',
                                },
                                ik_smart: {
                                    type: 'custom',
                                    tokenizer: 'ik_smart',
                                },
                            },
                        },
                    },
                },
            });
        }
    }
}
