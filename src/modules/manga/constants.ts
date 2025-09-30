/**
 * 漫画模块常量
 */
export const MangaDtoGroups = {
    CREATE: 'manga-create',
    UPDATE: 'manga-update',
    QUERY: 'manga-query',
} as const;

export const MangaChapterDtoGroups = {
    CREATE: 'manga-chapter-create',
    UPDATE: 'manga-chapter-update',
    QUERY: 'manga-chapter-query',
} as const;

export const MangaImageDtoGroups = {
    CREATE: 'manga-image-create',
    UPDATE: 'manga-image-update',
    QUERY: 'manga-image-query',
} as const;

/**
 * 漫画状态枚举
 */
export enum MangaStatus {
    SERIALIZING = '连载中',
    COMPLETED = '已完结',
    PAUSED = '暂停更新',
}

/**
 * 漫画排序字段
 */
export enum MangaSortField {
    CREATED_AT = 'createdAt',
    UPDATED_AT = 'updatedAt',
    TOTAL_CHAPTERS = 'total_chapters',
    GENERATED_TIME = 'generated_time',
}

/**
 * 漫画搜索字段
 */
export const MangaSearchFields = [
    'title',
    'author',
    'tags',
    'categories',
    'description',
] as const;
