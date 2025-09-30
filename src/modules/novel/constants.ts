/**
 * 小说模块常量
 */
export const NovelDtoGroups = {
    CREATE: 'novel-create',
    UPDATE: 'novel-update',
    QUERY: 'novel-query',
} as const;

export const NovelVolumeDtoGroups = {
    CREATE: 'novel-volume-create',
    UPDATE: 'novel-volume-update',
    QUERY: 'novel-volume-query',
} as const;

export const NovelChapterDtoGroups = {
    CREATE: 'novel-chapter-create',
    UPDATE: 'novel-chapter-update',
    QUERY: 'novel-chapter-query',
} as const;

/**
 * 小说状态枚举
 */
export enum NovelStatus {
    SERIALIZING = '连载中',
    COMPLETED = '已完结',
    PAUSED = '暂停更新',
}

/**
 * 小说排序字段
 */
export enum NovelSortField {
    CREATED_AT = 'createdAt',
    UPDATED_AT = 'updatedAt',
    RATING = 'rating',
    VIEW_COUNT = 'view_count_parsed',
    WORD_COUNT = 'word_count_parsed',
    MEAT_LEVEL = 'meat_level_parsed',
    CRAWL_TIME = 'crawl_time',
}

/**
 * 小说搜索字段
 */
export const NovelSearchFields = [
    'name',
    'author',
    'themes',
    'tags',
    'feature_value',
] as const;
