import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

import { NovelSearchFields } from '../constants';
import { NovelEntity } from '../entities/novel.entity';

/**
 * 小说搜索服务
 */
@Injectable()
export class NovelSearchService {
    private readonly indexName = 'novels';

    constructor(private readonly elasticsearchService: ElasticsearchService) {}

    /**
     * 创建或更新小说索引
     */
    async indexNovel(novel: NovelEntity): Promise<void> {
        const document = {
            id: novel.id,
            name: novel.name,
            author: novel.author,
            status: novel.status,
            rating: novel.rating,
            themes: novel.themes || [],
            tags: novel.tags || [],
            feature_value: novel.feature_value,
            view_count_parsed: novel.view_count_parsed,
            word_count_parsed: novel.word_count_parsed,
            meat_level_parsed: novel.meat_level_parsed,
            crawl_time: novel.crawl_time,
            created_at: novel.createdAt,
            updated_at: novel.updatedAt,
        };

        await this.elasticsearchService.index({
            index: this.indexName,
            id: novel.id,
            body: document,
        });
    }

    /**
     * 批量索引小说
     */
    async indexNovels(novels: NovelEntity[]): Promise<void> {
        const body = novels.flatMap((novel) => [
            { index: { _index: this.indexName, _id: novel.id } },
            {
                id: novel.id,
                name: novel.name,
                author: novel.author,
                status: novel.status,
                rating: novel.rating,
                themes: novel.themes || [],
                tags: novel.tags || [],
                feature_value: novel.feature_value,
                view_count_parsed: novel.view_count_parsed,
                word_count_parsed: novel.word_count_parsed,
                meat_level_parsed: novel.meat_level_parsed,
                crawl_time: novel.crawl_time,
                created_at: novel.createdAt,
                updated_at: novel.updatedAt,
            },
        ]);

        await this.elasticsearchService.bulk({ body });
    }

    /**
     * 搜索小说
     */
    async searchNovels(
        query: string,
        filters: any = {},
    ): Promise<{
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
                    fields: NovelSearchFields,
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

        if (filters.min_rating !== undefined) {
            searchQuery.bool.filter.push({
                range: { rating: { gte: filters.min_rating } },
            });
        }

        if (filters.max_rating !== undefined) {
            searchQuery.bool.filter.push({
                range: { rating: { lte: filters.max_rating } },
            });
        }

        if (filters.min_word_count !== undefined) {
            searchQuery.bool.filter.push({
                range: { word_count_parsed: { gte: filters.min_word_count } },
            });
        }

        if (filters.max_word_count !== undefined) {
            searchQuery.bool.filter.push({
                range: { word_count_parsed: { lte: filters.max_word_count } },
            });
        }

        if (filters.min_meat_level !== undefined) {
            searchQuery.bool.filter.push({
                range: { meat_level_parsed: { gte: filters.min_meat_level } },
            });
        }

        if (filters.max_meat_level !== undefined) {
            searchQuery.bool.filter.push({
                range: { meat_level_parsed: { lte: filters.max_meat_level } },
            });
        }

        if (filters.themes && filters.themes.length > 0) {
            searchQuery.bool.filter.push({
                terms: { themes: filters.themes },
            });
        }

        if (filters.tags && filters.tags.length > 0) {
            searchQuery.bool.filter.push({
                terms: { tags: filters.tags },
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
                        name: {},
                        author: {},
                        themes: {},
                        tags: {},
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
     * 删除小说索引
     */
    async deleteNovel(id: string): Promise<void> {
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
                            name: {
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
                            rating: { type: 'float' },
                            themes: { type: 'keyword' },
                            tags: { type: 'keyword' },
                            feature_value: {
                                type: 'text',
                                analyzer: 'ik_max_word',
                            },
                            view_count_parsed: { type: 'long' },
                            word_count_parsed: { type: 'long' },
                            meat_level_parsed: { type: 'float' },
                            crawl_time: { type: 'date' },
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
