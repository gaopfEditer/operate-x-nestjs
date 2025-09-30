# 小说和漫画API测试示例

## 小说API测试

### 1. 创建小说
```bash
curl -X POST http://localhost:3101/api/v1/novels \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "赘婿的荣耀",
    "cover": "https://cdn.uameta.ai/file/bucket-media/image/cover/5ba775766a794def87a1b66214c68ce7.webp",
    "detail_url": "https://www.uaa.com/novel/intro?id=925266579644616704",
    "status": "连载中",
    "rank": 1,
    "author": "棺材里的笑声",
    "rating": 7.34,
    "themes": ["乱伦", "系统"],
    "tags": ["#后宫", "#母女花", "#全家桶", "#爽文", "#姐妹花", "#人妻", "#熟女", "#无绿", "#女性视角", "#调教"],
    "latest_chapter": "第5章",
    "update_time": "2025-09-28T18:11:10.000Z",
    "view_count_parsed": 6980000,
    "word_count_parsed": 2910000,
    "meat_level_parsed": 29.31,
    "feature_value": "微肉",
    "crawl_time": "2025-09-29T16:11:10.000Z"
  }'
```

### 2. 查询小说列表
```bash
curl -X GET "http://localhost:3101/api/v1/novels?page=1&limit=10&author=棺材里的笑声" \
  -H "Content-Type: application/json"
```

### 3. 搜索小说
```bash
curl -X GET "http://localhost:3101/api/v1/novels/search?q=赘婿&min_rating=7&max_rating=8" \
  -H "Content-Type: application/json"
```

### 4. 获取小说详情
```bash
curl -X GET http://localhost:3101/api/v1/novels/{novel_id} \
  -H "Content-Type: application/json"
```

### 5. 创建分卷和章节
```bash
curl -X POST http://localhost:3101/api/v1/novels/{novel_id}/volumes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "volumes": [
      {
        "volume_name": "第一卷",
        "chapters": [
          {
            "chapter_title": "第1章",
            "chapter_url": "https://www.uaa.com/novel/chapter?id=925266579657199617",
            "sort_order": 0
          },
          {
            "chapter_title": "第2章", 
            "chapter_url": "https://www.uaa.com/novel/chapter?id=925266579673976832",
            "sort_order": 1
          }
        ]
      }
    ]
  }'
```

### 6. 获取小说章节内容
```bash
curl -X GET http://localhost:3101/api/v1/novels/{novel_id}/chapters/{chapter_id} \
  -H "Content-Type: application/json"
```

## 漫画API测试

### 1. 创建漫画
```bash
curl -X POST http://localhost:3101/api/v1/mangas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "[3D]吸血鬼绿茶妈妈第1-2季",
    "source_url": "https://smtt6.com/man-hua-yue-du/12347037.html",
    "cover": "https://example.com/cover.jpg",
    "author": "未知作者",
    "total_chapters": 52,
    "status": "连载中",
    "tags": ["3D", "吸血鬼", "绿茶", "妈妈"],
    "categories": ["成人", "3D"],
    "description": "这是一个关于吸血鬼绿茶妈妈的故事",
    "generated_time": "2025-09-21T18:22:42.000Z",
    "crawl_statistics": {
      "success_chapters": 52,
      "failed_chapters": 0,
      "success_rate": 100.0,
      "success_list": [
        {
          "name": "第01话-第一季",
          "url": "https://smtt6.com/man-hua-yue-du/12347037/lFFKphpdVmkIAhbdddNq.html",
          "images": 70
        }
      ]
    }
  }'
```

### 2. 查询漫画列表
```bash
curl -X GET "http://localhost:3101/api/v1/mangas?page=1&limit=10&status=连载中" \
  -H "Content-Type: application/json"
```

### 3. 搜索漫画
```bash
curl -X GET "http://localhost:3101/api/v1/mangas/search?q=吸血鬼&min_chapters=50" \
  -H "Content-Type: application/json"
```

### 4. 获取漫画详情
```bash
curl -X GET http://localhost:3101/api/v1/mangas/{manga_id} \
  -H "Content-Type: application/json"
```

### 5. 创建章节和图片
```bash
curl -X POST http://localhost:3101/api/v1/mangas/{manga_id}/chapters \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "chapters": [
      {
        "chapter_name": "第01话-第一季",
        "chapter_url": "https://smtt6.com/man-hua-yue-du/12347037/lFFKphpdVmkIAhbdddNq.html",
        "sort_order": 0,
        "images": [
          {
            "image_url": "https://example.com/image1.jpg",
            "image_order": 0,
            "width": 800,
            "height": 1200,
            "format": "jpg"
          },
          {
            "image_url": "https://example.com/image2.jpg",
            "image_order": 1,
            "width": 800,
            "height": 1200,
            "format": "jpg"
          }
        ]
      }
    ]
  }'
```

### 6. 获取漫画章节图片列表
```bash
curl -X GET http://localhost:3101/api/v1/mangas/{manga_id}/chapters/{chapter_id}/images \
  -H "Content-Type: application/json"
```

### 7. 获取漫画图片
```bash
curl -X GET http://localhost:3101/api/v1/mangas/{manga_id}/chapters/{chapter_id}/images/{image_id} \
  -H "Content-Type: application/json"
```

## 高级搜索示例

### 小说高级搜索
```bash
# 按标签搜索
curl -X GET "http://localhost:3101/api/v1/novels/search?q=&tags=后宫,爽文&min_word_count=1000000&max_meat_level=50" \
  -H "Content-Type: application/json"

# 按作者和评分搜索
curl -X GET "http://localhost:3101/api/v1/novels/search?q=&author=棺材里的笑声&min_rating=7&max_rating=8" \
  -H "Content-Type: application/json"
```

### 漫画高级搜索
```bash
# 按分类和标签搜索
curl -X GET "http://localhost:3101/api/v1/mangas/search?q=&categories=成人&tags=3D&min_chapters=20" \
  -H "Content-Type: application/json"
```

## 权限测试

### 需要管理员权限的操作
```bash
# 删除小说
curl -X DELETE http://localhost:3101/api/v1/novels/{novel_id} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -d '{"items": ["novel_id"]}'

# 删除漫画
curl -X DELETE http://localhost:3101/api/v1/mangas/{manga_id} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -d '{"items": ["manga_id"]}'
```

## 响应示例

### 小说列表响应
```json
{
  "items": [
    {
      "id": "uuid",
      "name": "赘婿的荣耀",
      "author": "棺材里的笑声",
      "status": "连载中",
      "rating": 7.34,
      "view_count_parsed": 6980000,
      "word_count_parsed": 2910000,
      "meat_level_parsed": 29.31,
      "cover": "https://cdn.uameta.ai/file/bucket-media/image/cover/5ba775766a794def87a1b66214c68ce7.webp",
      "createdAt": "2025-01-20T10:00:00.000Z"
    }
  ],
  "meta": {
    "totalItems": 100,
    "itemCount": 10,
    "itemsPerPage": 10,
    "totalPages": 10,
    "currentPage": 1
  }
}
```

### 搜索响应
```json
{
  "hits": [
    {
      "id": "uuid",
      "name": "赘婿的荣耀",
      "author": "棺材里的笑声",
      "score": 1.5,
      "highlight": {
        "name": ["<em>赘婿</em>的荣耀"],
        "author": ["棺材里的<em>笑声</em>"]
      }
    }
  ],
  "total": 1,
  "took": 15
}
```
