-- 小说和漫画模块数据库迁移脚本
-- 创建时间: 2025-01-20
-- 描述: 添加小说和漫画相关表结构

-- =============================================
-- 小说相关表
-- =============================================

-- 创建小说表
CREATE TABLE `novels` (
    `id` char(36) NOT NULL COMMENT '小说ID',
    `name` varchar(200) NOT NULL COMMENT '小说名称',
    `cover` varchar(500) DEFAULT NULL COMMENT '封面图片URL',
    `detail_url` varchar(500) DEFAULT NULL COMMENT '详情页面URL',
    `status` enum('连载中','已完结','暂停更新') NOT NULL DEFAULT '连载中' COMMENT '连载状态',
    `rank` int DEFAULT NULL COMMENT '排名',
    `author` varchar(100) NOT NULL COMMENT '作者',
    `rating` decimal(3,2) DEFAULT NULL COMMENT '评分',
    `themes` json DEFAULT NULL COMMENT '主题标签',
    `tags` json DEFAULT NULL COMMENT '内容标签',
    `latest_chapter` varchar(100) DEFAULT NULL COMMENT '最新章节',
    `update_time` timestamp NULL DEFAULT NULL COMMENT '更新时间',
    `view_count_parsed` bigint NOT NULL DEFAULT '0' COMMENT '观看次数',
    `word_count_parsed` bigint NOT NULL DEFAULT '0' COMMENT '字数',
    `meat_level_parsed` decimal(5,2) DEFAULT NULL COMMENT '肉度等级',
    `feature_value` varchar(50) DEFAULT NULL COMMENT '特征值',
    `crawl_time` timestamp NOT NULL COMMENT '爬取时间',
    `enabled` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否启用',
    `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
    `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
    `deleted_at` timestamp(6) NULL DEFAULT NULL COMMENT '删除时间',
    PRIMARY KEY (`id`),
    KEY `IDX_novels_name_author` (`name`,`author`),
    KEY `IDX_novels_status` (`status`),
    KEY `IDX_novels_rating` (`rating`),
    KEY `IDX_novels_view_count_parsed` (`view_count_parsed`),
    KEY `IDX_novels_word_count_parsed` (`word_count_parsed`),
    KEY `IDX_novels_meat_level_parsed` (`meat_level_parsed`),
    KEY `IDX_novels_crawl_time` (`crawl_time`),
    KEY `IDX_novels_created_at` (`created_at`),
    KEY `IDX_novels_updated_at` (`updated_at`),
    KEY `IDX_novels_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='小说表';

-- 创建小说分卷表
CREATE TABLE `novel_volumes` (
    `id` char(36) NOT NULL COMMENT '分卷ID',
    `volume_name` varchar(100) NOT NULL COMMENT '分卷名称',
    `sort_order` int NOT NULL DEFAULT '0' COMMENT '分卷排序',
    `description` text DEFAULT NULL COMMENT '分卷描述',
    `enabled` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否启用',
    `novel_id` char(36) NOT NULL COMMENT '小说ID',
    `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
    `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
    `deleted_at` timestamp(6) NULL DEFAULT NULL COMMENT '删除时间',
    PRIMARY KEY (`id`),
    KEY `IDX_novel_volumes_novel_id_volume_name` (`novel_id`,`volume_name`),
    KEY `IDX_novel_volumes_created_at` (`created_at`),
    KEY `IDX_novel_volumes_updated_at` (`updated_at`),
    KEY `IDX_novel_volumes_deleted_at` (`deleted_at`),
    CONSTRAINT `FK_novel_volumes_novel_id` FOREIGN KEY (`novel_id`) REFERENCES `novels` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='小说分卷表';

-- 创建小说章节表
CREATE TABLE `novel_chapters` (
    `id` char(36) NOT NULL COMMENT '章节ID',
    `chapter_title` varchar(200) NOT NULL COMMENT '章节标题',
    `chapter_url` varchar(500) DEFAULT NULL COMMENT '章节URL',
    `content` longtext DEFAULT NULL COMMENT '章节内容',
    `sort_order` int NOT NULL DEFAULT '0' COMMENT '章节排序',
    `word_count` int NOT NULL DEFAULT '0' COMMENT '字数统计',
    `content_crawled` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否已爬取内容',
    `crawl_time` timestamp NULL DEFAULT NULL COMMENT '爬取时间',
    `enabled` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否启用',
    `volume_id` char(36) NOT NULL COMMENT '分卷ID',
    `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
    `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
    `deleted_at` timestamp(6) NULL DEFAULT NULL COMMENT '删除时间',
    PRIMARY KEY (`id`),
    KEY `IDX_novel_chapters_volume_id_chapter_title` (`volume_id`,`chapter_title`),
    KEY `IDX_novel_chapters_chapter_url` (`chapter_url`),
    KEY `IDX_novel_chapters_created_at` (`created_at`),
    KEY `IDX_novel_chapters_updated_at` (`updated_at`),
    KEY `IDX_novel_chapters_deleted_at` (`deleted_at`),
    CONSTRAINT `FK_novel_chapters_volume_id` FOREIGN KEY (`volume_id`) REFERENCES `novel_volumes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='小说章节表';

-- =============================================
-- 漫画相关表
-- =============================================

-- 创建漫画表
CREATE TABLE `mangas` (
    `id` char(36) NOT NULL COMMENT '漫画ID',
    `title` varchar(200) NOT NULL COMMENT '漫画标题',
    `source_url` varchar(500) DEFAULT NULL COMMENT '源站URL',
    `cover` varchar(500) DEFAULT NULL COMMENT '封面图片URL',
    `author` varchar(100) DEFAULT NULL COMMENT '作者',
    `total_chapters` int NOT NULL DEFAULT '0' COMMENT '总章节数',
    `status` enum('连载中','已完结','暂停更新') NOT NULL DEFAULT '连载中' COMMENT '连载状态',
    `tags` json DEFAULT NULL COMMENT '标签',
    `categories` json DEFAULT NULL COMMENT '分类',
    `description` text DEFAULT NULL COMMENT '描述',
    `generated_time` timestamp NOT NULL COMMENT '生成时间',
    `crawl_statistics` json DEFAULT NULL COMMENT '爬取统计',
    `enabled` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否启用',
    `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
    `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
    `deleted_at` timestamp(6) NULL DEFAULT NULL COMMENT '删除时间',
    PRIMARY KEY (`id`),
    KEY `IDX_mangas_title_author` (`title`,`author`),
    KEY `IDX_mangas_status` (`status`),
    KEY `IDX_mangas_total_chapters` (`total_chapters`),
    KEY `IDX_mangas_generated_time` (`generated_time`),
    KEY `IDX_mangas_created_at` (`created_at`),
    KEY `IDX_mangas_updated_at` (`updated_at`),
    KEY `IDX_mangas_deleted_at` (`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='漫画表';

-- 创建漫画章节表
CREATE TABLE `manga_chapters` (
    `id` char(36) NOT NULL COMMENT '章节ID',
    `chapter_name` varchar(200) NOT NULL COMMENT '章节名称',
    `chapter_url` varchar(500) DEFAULT NULL COMMENT '章节URL',
    `sort_order` int NOT NULL DEFAULT '0' COMMENT '章节排序',
    `image_count` int NOT NULL DEFAULT '0' COMMENT '图片数量',
    `images_crawled` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否已爬取图片',
    `crawl_time` timestamp NULL DEFAULT NULL COMMENT '爬取时间',
    `enabled` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否启用',
    `manga_id` char(36) NOT NULL COMMENT '漫画ID',
    `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
    `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
    `deleted_at` timestamp(6) NULL DEFAULT NULL COMMENT '删除时间',
    PRIMARY KEY (`id`),
    KEY `IDX_manga_chapters_manga_id_chapter_name` (`manga_id`,`chapter_name`),
    KEY `IDX_manga_chapters_chapter_url` (`chapter_url`),
    KEY `IDX_manga_chapters_created_at` (`created_at`),
    KEY `IDX_manga_chapters_updated_at` (`updated_at`),
    KEY `IDX_manga_chapters_deleted_at` (`deleted_at`),
    CONSTRAINT `FK_manga_chapters_manga_id` FOREIGN KEY (`manga_id`) REFERENCES `mangas` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='漫画章节表';

-- 创建漫画图片表
CREATE TABLE `manga_images` (
    `id` char(36) NOT NULL COMMENT '图片ID',
    `image_url` varchar(500) NOT NULL COMMENT '图片URL',
    `local_path` varchar(500) DEFAULT NULL COMMENT '本地存储路径',
    `image_order` int NOT NULL DEFAULT '0' COMMENT '图片排序',
    `width` int DEFAULT NULL COMMENT '图片宽度',
    `height` int DEFAULT NULL COMMENT '图片高度',
    `file_size` bigint DEFAULT NULL COMMENT '文件大小(字节)',
    `format` varchar(10) DEFAULT NULL COMMENT '图片格式',
    `downloaded` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否已下载',
    `download_time` timestamp NULL DEFAULT NULL COMMENT '下载时间',
    `enabled` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否启用',
    `chapter_id` char(36) NOT NULL COMMENT '章节ID',
    `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
    `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6) COMMENT '更新时间',
    `deleted_at` timestamp(6) NULL DEFAULT NULL COMMENT '删除时间',
    PRIMARY KEY (`id`),
    KEY `IDX_manga_images_chapter_id_image_order` (`chapter_id`,`image_order`),
    KEY `IDX_manga_images_image_url` (`image_url`),
    KEY `IDX_manga_images_created_at` (`created_at`),
    KEY `IDX_manga_images_updated_at` (`updated_at`),
    KEY `IDX_manga_images_deleted_at` (`deleted_at`),
    CONSTRAINT `FK_manga_images_chapter_id` FOREIGN KEY (`chapter_id`) REFERENCES `manga_chapters` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='漫画图片表';

-- =============================================
-- 索引优化
-- =============================================

-- 为JSON字段创建虚拟列索引（MySQL 5.7+）
-- 小说标签索引
ALTER TABLE `novels` ADD COLUMN `tags_search` text GENERATED ALWAYS AS (JSON_UNQUOTE(JSON_EXTRACT(`tags`, '$'))) VIRTUAL;
CREATE INDEX `IDX_novels_tags_search` ON `novels` (`tags_search`(255));

-- 小说主题索引
ALTER TABLE `novels` ADD COLUMN `themes_search` text GENERATED ALWAYS AS (JSON_UNQUOTE(JSON_EXTRACT(`themes`, '$'))) VIRTUAL;
CREATE INDEX `IDX_novels_themes_search` ON `novels` (`themes_search`(255));

-- 漫画标签索引
ALTER TABLE `mangas` ADD COLUMN `tags_search` text GENERATED ALWAYS AS (JSON_UNQUOTE(JSON_EXTRACT(`tags`, '$'))) VIRTUAL;
CREATE INDEX `IDX_mangas_tags_search` ON `mangas` (`tags_search`(255));

-- 漫画分类索引
ALTER TABLE `mangas` ADD COLUMN `categories_search` text GENERATED ALWAYS AS (JSON_UNQUOTE(JSON_EXTRACT(`categories`, '$'))) VIRTUAL;
CREATE INDEX `IDX_mangas_categories_search` ON `mangas` (`categories_search`(255));

-- =============================================
-- 示例数据插入
-- =============================================

-- 插入示例小说数据
INSERT INTO `novels` (
    `id`, `name`, `cover`, `detail_url`, `status`, `rank`, `author`, `rating`,
    `themes`, `tags`, `latest_chapter`, `update_time`, `view_count_parsed`,
    `word_count_parsed`, `meat_level_parsed`, `feature_value`, `crawl_time`, `enabled`
) VALUES (
    '550e8400-e29b-41d4-a716-446655440001',
    '赘婿的荣耀',
    'https://cdn.uameta.ai/file/bucket-media/image/cover/5ba775766a794def87a1b66214c68ce7.webp',
    'https://www.uaa.com/novel/intro?id=925266579644616704',
    '连载中',
    1,
    '棺材里的笑声',
    7.34,
    '["乱伦", "系统"]',
    '["#后宫", "#母女花", "#全家桶", "#爽文", "#姐妹花", "#人妻", "#熟女", "#无绿", "#女性视角", "#调教"]',
    '第5章',
    '2025-09-28 18:11:10',
    6980000,
    2910000,
    29.31,
    '微肉',
    '2025-09-29 16:11:10',
    1
);

-- 插入示例分卷数据
INSERT INTO `novel_volumes` (
    `id`, `volume_name`, `sort_order`, `description`, `enabled`, `novel_id`
) VALUES (
    '550e8400-e29b-41d4-a716-446655440002',
    '第一卷',
    0,
    '第一卷内容描述',
    1,
    '550e8400-e29b-41d4-a716-446655440001'
);

-- 插入示例章节数据
INSERT INTO `novel_chapters` (
    `id`, `chapter_title`, `chapter_url`, `sort_order`, `word_count`,
    `content_crawled`, `crawl_time`, `enabled`, `volume_id`
) VALUES
(
    '550e8400-e29b-41d4-a716-446655440003',
    '第1章',
    'https://www.uaa.com/novel/chapter?id=925266579657199617',
    0,
    3000,
    1,
    '2025-09-29 16:11:10',
    1,
    '550e8400-e29b-41d4-a716-446655440002'
),
(
    '550e8400-e29b-41d4-a716-446655440004',
    '第2章',
    'https://www.uaa.com/novel/chapter?id=925266579673976832',
    1,
    3200,
    1,
    '2025-09-29 16:11:10',
    1,
    '550e8400-e29b-41d4-a716-446655440002'
);

-- 插入示例漫画数据
INSERT INTO `mangas` (
    `id`, `title`, `source_url`, `cover`, `author`, `total_chapters`,
    `status`, `tags`, `categories`, `description`, `generated_time`,
    `crawl_statistics`, `enabled`
) VALUES (
    '550e8400-e29b-41d4-a716-446655440005',
    '[3D]吸血鬼绿茶妈妈第1-2季',
    'https://smtt6.com/man-hua-yue-du/12347037.html',
    'https://example.com/cover.jpg',
    '未知作者',
    52,
    '连载中',
    '["3D", "吸血鬼", "绿茶", "妈妈"]',
    '["成人", "3D"]',
    '这是一个关于吸血鬼绿茶妈妈的故事',
    '2025-09-21 18:22:42',
    '{"success_chapters": 52, "failed_chapters": 0, "success_rate": 100.0, "success_list": [{"name": "第01话-第一季", "url": "https://smtt6.com/man-hua-yue-du/12347037/lFFKphpdVmkIAhbdddNq.html", "images": 70}]}',
    1
);

-- 插入示例漫画章节数据
INSERT INTO `manga_chapters` (
    `id`, `chapter_name`, `chapter_url`, `sort_order`, `image_count`,
    `images_crawled`, `crawl_time`, `enabled`, `manga_id`
) VALUES (
    '550e8400-e29b-41d4-a716-446655440006',
    '第01话-第一季',
    'https://smtt6.com/man-hua-yue-du/12347037/lFFKphpdVmkIAhbdddNq.html',
    0,
    70,
    1,
    '2025-09-21 18:22:42',
    1,
    '550e8400-e29b-41d4-a716-446655440005'
);

-- 插入示例漫画图片数据
INSERT INTO `manga_images` (
    `id`, `image_url`, `image_order`, `width`, `height`, `file_size`,
    `format`, `downloaded`, `download_time`, `enabled`, `chapter_id`
) VALUES
(
    '550e8400-e29b-41d4-a716-446655440007',
    'https://example.com/image1.jpg',
    0,
    800,
    1200,
    1024000,
    'jpg',
    1,
    '2025-09-21 18:22:42',
    1,
    '550e8400-e29b-41d4-a716-446655440006'
),
(
    '550e8400-e29b-41d4-a716-446655440008',
    'https://example.com/image2.jpg',
    1,
    800,
    1200,
    1056000,
    'jpg',
    1,
    '2025-09-21 18:22:42',
    1,
    '550e8400-e29b-41d4-a716-446655440006'
);

-- =============================================
-- 权限相关数据
-- =============================================

-- 插入小说相关权限
INSERT INTO `rbac_permissions` (`id`, `name`, `label`, `description`, `rule`) VALUES
('550e8400-e29b-41d4-a716-446655440009', 'novel.create', '创建小说', '创建新小说的权限', '{"action": "create", "subject": "NovelEntity"}'),
('550e8400-e29b-41d4-a716-446655440010', 'novel.read', '查看小说', '查看小说内容的权限', '{"action": "read", "subject": "NovelEntity"}'),
('550e8400-e29b-41d4-a716-446655440011', 'novel.update', '更新小说', '更新小说信息的权限', '{"action": "update", "subject": "NovelEntity"}'),
('550e8400-e29b-41d4-a716-446655440012', 'novel.delete', '删除小说', '删除小说的权限', '{"action": "delete", "subject": "NovelEntity"}'),
('550e8400-e29b-41d4-a716-446655440013', 'novel.manage', '管理小说', '管理所有小说相关功能的权限', '{"action": "manage", "subject": "NovelEntity"}'),
('550e8400-e29b-41d4-a716-446655440014', 'novel-volume.manage', '管理分卷', '管理小说分卷的权限', '{"action": "manage", "subject": "NovelVolumeEntity"}'),
('550e8400-e29b-41d4-a716-446655440015', 'novel-chapter.manage', '管理章节', '管理小说章节的权限', '{"action": "manage", "subject": "NovelChapterEntity"}');

-- 插入漫画相关权限
INSERT INTO `rbac_permissions` (`id`, `name`, `label`, `description`, `rule`) VALUES
('550e8400-e29b-41d4-a716-446655440016', 'manga.create', '创建漫画', '创建新漫画的权限', '{"action": "create", "subject": "MangaEntity"}'),
('550e8400-e29b-41d4-a716-446655440017', 'manga.read', '查看漫画', '查看漫画内容的权限', '{"action": "read", "subject": "MangaEntity"}'),
('550e8400-e29b-41d4-a716-446655440018', 'manga.update', '更新漫画', '更新漫画信息的权限', '{"action": "update", "subject": "MangaEntity"}'),
('550e8400-e29b-41d4-a716-446655440019', 'manga.delete', '删除漫画', '删除漫画的权限', '{"action": "delete", "subject": "MangaEntity"}'),
('550e8400-e29b-41d4-a716-446655440020', 'manga.manage', '管理漫画', '管理所有漫画相关功能的权限', '{"action": "manage", "subject": "MangaEntity"}'),
('550e8400-e29b-41d4-a716-446655440021', 'manga-chapter.manage', '管理漫画章节', '管理漫画章节的权限', '{"action": "manage", "subject": "MangaChapterEntity"}'),
('550e8400-e29b-41d4-a716-446655440022', 'manga-image.manage', '管理漫画图片', '管理漫画图片的权限', '{"action": "manage", "subject": "MangaImageEntity"}');

-- 插入小说编辑角色
INSERT INTO `rbac_roles` (`id`, `name`, `label`, `description`, `systemed`) VALUES
('550e8400-e29b-41d4-a716-446655440023', 'novel-editor', '小说编辑', '可以创建和编辑小说内容', 0),
('550e8400-e29b-41d4-a716-446655440024', 'novel-manager', '小说管理员', '管理所有小说相关功能', 0),
('550e8400-e29b-41d4-a716-446655440025', 'manga-editor', '漫画编辑', '可以创建和编辑漫画内容', 0),
('550e8400-e29b-41d4-a716-446655440026', 'manga-manager', '漫画管理员', '管理所有漫画相关功能', 0);

-- 关联角色和权限
INSERT INTO `rbac_role_permissions` (`role_id`, `permission_id`) VALUES
-- 小说编辑角色权限
('550e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440009'),
('550e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440010'),
('550e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440011'),
('550e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440014'),
('550e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440015'),
-- 小说管理员角色权限
('550e8400-e29b-41d4-a716-446655440024', '550e8400-e29b-41d4-a716-446655440013'),
('550e8400-e29b-41d4-a716-446655440024', '550e8400-e29b-41d4-a716-446655440014'),
('550e8400-e29b-41d4-a716-446655440024', '550e8400-e29b-41d4-a716-446655440015'),
-- 漫画编辑角色权限
('550e8400-e29b-41d4-a716-446655440025', '550e8400-e29b-41d4-a716-446655440016'),
('550e8400-e29b-41d4-a716-446655440025', '550e8400-e29b-41d4-a716-446655440017'),
('550e8400-e29b-41d4-a716-446655440025', '550e8400-e29b-41d4-a716-446655440018'),
('550e8400-e29b-41d4-a716-446655440025', '550e8400-e29b-41d4-a716-446655440021'),
('550e8400-e29b-41d4-a716-446655440025', '550e8400-e29b-41d4-a716-446655440022'),
-- 漫画管理员角色权限
('550e8400-e29b-41d4-a716-446655440026', '550e8400-e29b-41d4-a716-446655440020'),
('550e8400-e29b-41d4-a716-446655440026', '550e8400-e29b-41d4-a716-446655440021'),
('550e8400-e29b-41d4-a716-446655440026', '550e8400-e29b-41d4-a716-446655440022');

-- 为普通用户角色添加查看权限
INSERT INTO `rbac_role_permissions` (`role_id`, `permission_id`) VALUES
-- 假设普通用户角色ID为 'custom-user-role-id'，请根据实际情况调整
('custom-user-role-id', '550e8400-e29b-41d4-a716-446655440010'), -- novel.read
('custom-user-role-id', '550e8400-e29b-41d4-a716-446655440017'); -- manga.read

-- =============================================
-- 完成
-- =============================================

-- 脚本执行完成
SELECT 'Novel and Manga database migration completed successfully!' as message;


