-- 小说和漫画模块 - 简化版SQL脚本
-- 适用于快速部署和测试

-- =============================================
-- 小说相关表
-- =============================================

-- 创建小说表
CREATE TABLE `novels` (
    `id` char(36) NOT NULL,
    `name` varchar(200) NOT NULL,
    `cover` varchar(500) DEFAULT NULL,
    `detail_url` varchar(500) DEFAULT NULL,
    `status` enum('连载中','已完结','暂停更新') NOT NULL DEFAULT '连载中',
    `rank` int DEFAULT NULL,
    `author` varchar(100) NOT NULL,
    `rating` decimal(3,2) DEFAULT NULL,
    `themes` json DEFAULT NULL,
    `tags` json DEFAULT NULL,
    `latest_chapter` varchar(100) DEFAULT NULL,
    `update_time` timestamp NULL DEFAULT NULL,
    `view_count_parsed` bigint NOT NULL DEFAULT '0',
    `word_count_parsed` bigint NOT NULL DEFAULT '0',
    `meat_level_parsed` decimal(5,2) DEFAULT NULL,
    `feature_value` varchar(50) DEFAULT NULL,
    `crawl_time` timestamp NOT NULL,
    `enabled` tinyint(1) NOT NULL DEFAULT '1',
    `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    `deleted_at` timestamp(6) NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_novels_name_author` (`name`,`author`),
    KEY `idx_novels_status` (`status`),
    KEY `idx_novels_rating` (`rating`),
    KEY `idx_novels_view_count` (`view_count_parsed`),
    KEY `idx_novels_word_count` (`word_count_parsed`),
    KEY `idx_novels_meat_level` (`meat_level_parsed`),
    KEY `idx_novels_crawl_time` (`crawl_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建小说分卷表
CREATE TABLE `novel_volumes` (
    `id` char(36) NOT NULL,
    `volume_name` varchar(100) NOT NULL,
    `sort_order` int NOT NULL DEFAULT '0',
    `description` text DEFAULT NULL,
    `enabled` tinyint(1) NOT NULL DEFAULT '1',
    `novel_id` char(36) NOT NULL,
    `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    `deleted_at` timestamp(6) NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_novel_volumes_novel_id` (`novel_id`),
    CONSTRAINT `fk_novel_volumes_novel_id` FOREIGN KEY (`novel_id`) REFERENCES `novels` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建小说章节表
CREATE TABLE `novel_chapters` (
    `id` char(36) NOT NULL,
    `chapter_title` varchar(200) NOT NULL,
    `chapter_url` varchar(500) DEFAULT NULL,
    `content` longtext DEFAULT NULL,
    `sort_order` int NOT NULL DEFAULT '0',
    `word_count` int NOT NULL DEFAULT '0',
    `content_crawled` tinyint(1) NOT NULL DEFAULT '0',
    `crawl_time` timestamp NULL DEFAULT NULL,
    `enabled` tinyint(1) NOT NULL DEFAULT '1',
    `volume_id` char(36) NOT NULL,
    `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    `deleted_at` timestamp(6) NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_novel_chapters_volume_id` (`volume_id`),
    KEY `idx_novel_chapters_url` (`chapter_url`),
    CONSTRAINT `fk_novel_chapters_volume_id` FOREIGN KEY (`volume_id`) REFERENCES `novel_volumes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- 漫画相关表
-- =============================================

-- 创建漫画表
CREATE TABLE `mangas` (
    `id` char(36) NOT NULL,
    `title` varchar(200) NOT NULL,
    `source_url` varchar(500) DEFAULT NULL,
    `cover` varchar(500) DEFAULT NULL,
    `author` varchar(100) DEFAULT NULL,
    `total_chapters` int NOT NULL DEFAULT '0',
    `status` enum('连载中','已完结','暂停更新') NOT NULL DEFAULT '连载中',
    `tags` json DEFAULT NULL,
    `categories` json DEFAULT NULL,
    `description` text DEFAULT NULL,
    `generated_time` timestamp NOT NULL,
    `crawl_statistics` json DEFAULT NULL,
    `enabled` tinyint(1) NOT NULL DEFAULT '1',
    `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    `deleted_at` timestamp(6) NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_mangas_title_author` (`title`,`author`),
    KEY `idx_mangas_status` (`status`),
    KEY `idx_mangas_total_chapters` (`total_chapters`),
    KEY `idx_mangas_generated_time` (`generated_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建漫画章节表
CREATE TABLE `manga_chapters` (
    `id` char(36) NOT NULL,
    `chapter_name` varchar(200) NOT NULL,
    `chapter_url` varchar(500) DEFAULT NULL,
    `sort_order` int NOT NULL DEFAULT '0',
    `image_count` int NOT NULL DEFAULT '0',
    `images_crawled` tinyint(1) NOT NULL DEFAULT '0',
    `crawl_time` timestamp NULL DEFAULT NULL,
    `enabled` tinyint(1) NOT NULL DEFAULT '1',
    `manga_id` char(36) NOT NULL,
    `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    `deleted_at` timestamp(6) NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_manga_chapters_manga_id` (`manga_id`),
    KEY `idx_manga_chapters_url` (`chapter_url`),
    CONSTRAINT `fk_manga_chapters_manga_id` FOREIGN KEY (`manga_id`) REFERENCES `mangas` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 创建漫画图片表
CREATE TABLE `manga_images` (
    `id` char(36) NOT NULL,
    `image_url` varchar(500) NOT NULL,
    `local_path` varchar(500) DEFAULT NULL,
    `image_order` int NOT NULL DEFAULT '0',
    `width` int DEFAULT NULL,
    `height` int DEFAULT NULL,
    `file_size` bigint DEFAULT NULL,
    `format` varchar(10) DEFAULT NULL,
    `downloaded` tinyint(1) NOT NULL DEFAULT '0',
    `download_time` timestamp NULL DEFAULT NULL,
    `enabled` tinyint(1) NOT NULL DEFAULT '1',
    `chapter_id` char(36) NOT NULL,
    `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    `deleted_at` timestamp(6) NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_manga_images_chapter_id` (`chapter_id`),
    KEY `idx_manga_images_url` (`image_url`),
    CONSTRAINT `fk_manga_images_chapter_id` FOREIGN KEY (`chapter_id`) REFERENCES `manga_chapters` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- 示例数据
-- =============================================

-- 插入示例小说
INSERT INTO `novels` (
    `id`, `name`, `cover`, `detail_url`, `status`, `rank`, `author`, `rating`,
    `themes`, `tags`, `latest_chapter`, `update_time`, `view_count_parsed`,
    `word_count_parsed`, `meat_level_parsed`, `feature_value`, `crawl_time`
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
    '2025-09-29 16:11:10'
);

-- 插入示例分卷
INSERT INTO `novel_volumes` (`id`, `volume_name`, `novel_id`) VALUES
('550e8400-e29b-41d4-a716-446655440002', '第一卷', '550e8400-e29b-41d4-a716-446655440001');

-- 插入示例章节
INSERT INTO `novel_chapters` (`id`, `chapter_title`, `chapter_url`, `volume_id`) VALUES
('550e8400-e29b-41d4-a716-446655440003', '第1章', 'https://www.uaa.com/novel/chapter?id=925266579657199617', '550e8400-e29b-41d4-a716-446655440002'),
('550e8400-e29b-41d4-a716-446655440004', '第2章', 'https://www.uaa.com/novel/chapter?id=925266579673976832', '550e8400-e29b-41d4-a716-446655440002');

-- 插入示例漫画
INSERT INTO `mangas` (
    `id`, `title`, `source_url`, `cover`, `author`, `total_chapters`,
    `status`, `tags`, `categories`, `description`, `generated_time`
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
    '2025-09-21 18:22:42'
);

-- 插入示例漫画章节
INSERT INTO `manga_chapters` (`id`, `chapter_name`, `chapter_url`, `image_count`, `manga_id`) VALUES
('550e8400-e29b-41d4-a716-446655440006', '第01话-第一季', 'https://smtt6.com/man-hua-yue-du/12347037/lFFKphpdVmkIAhbdddNq.html', 70, '550e8400-e29b-41d4-a716-446655440005');

-- 插入示例漫画图片
INSERT INTO `manga_images` (`id`, `image_url`, `image_order`, `width`, `height`, `format`, `chapter_id`) VALUES
('550e8400-e29b-41d4-a716-446655440007', 'https://example.com/image1.jpg', 0, 800, 1200, 'jpg', '550e8400-e29b-41d4-a716-446655440006'),
('550e8400-e29b-41d4-a716-446655440008', 'https://example.com/image2.jpg', 1, 800, 1200, 'jpg', '550e8400-e29b-41d4-a716-446655440006');

-- 完成
SELECT 'Novel and Manga tables created successfully!' as message;


