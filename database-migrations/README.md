# 小说和漫画模块数据库迁移脚本

## 📁 文件说明

### 1. `novel-manga-migration.sql` - 完整版迁移脚本
- 包含完整的表结构、索引、外键约束
- 包含示例数据和权限配置
- 适用于生产环境部署

### 2. `novel-manga-simple.sql` - 简化版迁移脚本
- 包含核心表结构和基本索引
- 包含示例数据
- 适用于快速测试和开发环境

### 3. `1737360000000-CreateNovelMangaTables.ts` - TypeORM迁移文件
- 适用于使用TypeORM迁移的项目
- 支持回滚操作

## 🚀 使用方法

### 方法一：直接执行SQL脚本

#### 生产环境
```bash
mysql -u username -p database_name < novel-manga-migration.sql
```

#### 开发/测试环境
```bash
mysql -u username -p database_name < novel-manga-simple.sql
```

### 方法二：使用TypeORM迁移

#### 生成迁移文件
```bash
npm run migration:generate -- CreateNovelMangaTables
```

#### 运行迁移
```bash
npm run migration:run
```

#### 回滚迁移
```bash
npm run migration:revert
```

## 📊 表结构说明

### 小说模块表

#### `novels` - 小说主表
- 存储小说的基本信息（名称、作者、封面、状态等）
- 包含评分、标签、字数、肉度等扩展信息
- 支持软删除

#### `novel_volumes` - 小说分卷表
- 存储小说的分卷信息
- 与小说表一对多关系
- 支持排序和描述

#### `novel_chapters` - 小说章节表
- 存储章节的标题、内容、URL等信息
- 与分卷表一对多关系
- 支持内容爬取状态跟踪

### 漫画模块表

#### `mangas` - 漫画主表
- 存储漫画的基本信息（标题、作者、封面等）
- 包含标签、分类、章节数等信息
- 支持爬取统计信息

#### `manga_chapters` - 漫画章节表
- 存储章节的基本信息
- 与漫画表一对多关系
- 跟踪图片爬取状态

#### `manga_images` - 漫画图片表
- 存储图片的URL、本地路径、尺寸等信息
- 与章节表一对多关系
- 支持下载状态跟踪

## 🔍 索引说明

### 主要索引
- **复合索引**：`(name, author)`, `(title, author)` - 用于搜索
- **单字段索引**：`status`, `rating`, `view_count_parsed` 等 - 用于过滤和排序
- **外键索引**：所有外键字段都有索引

### JSON字段索引（MySQL 5.7+）
- 为JSON字段创建虚拟列索引，提高查询性能
- 支持标签和分类的快速搜索

## 🔐 权限配置

### 权限列表
- `novel.create` - 创建小说
- `novel.read` - 查看小说
- `novel.update` - 更新小说
- `novel.delete` - 删除小说
- `novel.manage` - 管理小说
- `manga.*` - 漫画相关权限

### 角色配置
- `novel-editor` - 小说编辑
- `novel-manager` - 小说管理员
- `manga-editor` - 漫画编辑
- `manga-manager` - 漫画管理员

## 📝 示例数据

脚本包含以下示例数据：
- 1个示例小说（赘婿的荣耀）
- 1个分卷和2个章节
- 1个示例漫画（吸血鬼绿茶妈妈）
- 1个章节和2张图片

## ⚠️ 注意事项

1. **字符集**：使用 `utf8mb4_unicode_ci` 支持完整的Unicode字符
2. **时区**：所有时间字段使用UTC时区
3. **软删除**：所有表都支持软删除功能
4. **外键约束**：使用CASCADE删除，确保数据一致性
5. **JSON字段**：MySQL 5.7+支持，低版本需要调整

## 🔧 自定义配置

### 修改表前缀
如果项目使用表前缀，请在所有表名前添加前缀：
```sql
-- 例如：将 novels 改为 app_novels
CREATE TABLE `app_novels` (
    -- ...
);
```

### 调整字段长度
根据实际需求调整字段长度：
```sql
-- 例如：增加作者名称长度
`author` varchar(200) NOT NULL COMMENT '作者',
```

### 添加自定义字段
可以在相应表中添加业务需要的字段：
```sql
-- 例如：添加推荐字段
`recommended` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否推荐',
```

## 🐛 故障排除

### 常见问题

1. **外键约束错误**
   - 确保先创建被引用的表
   - 检查外键字段的数据类型是否匹配

2. **JSON字段不支持**
   - 升级MySQL到5.7+版本
   - 或使用TEXT字段存储JSON字符串

3. **字符集问题**
   - 确保数据库和表都使用utf8mb4字符集
   - 检查连接字符集设置

4. **权限问题**
   - 确保数据库用户有CREATE TABLE权限
   - 检查外键约束权限

### 回滚脚本
如果需要回滚，可以执行以下SQL：
```sql
-- 删除表（注意顺序）
DROP TABLE IF EXISTS `manga_images`;
DROP TABLE IF EXISTS `manga_chapters`;
DROP TABLE IF EXISTS `mangas`;
DROP TABLE IF EXISTS `novel_chapters`;
DROP TABLE IF EXISTS `novel_volumes`;
DROP TABLE IF EXISTS `novels`;
```

## 📞 支持

如有问题，请检查：
1. MySQL版本是否支持（建议5.7+）
2. 字符集配置是否正确
3. 用户权限是否充足
4. 表名是否冲突


