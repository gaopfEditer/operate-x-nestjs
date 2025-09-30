import {
    Body,
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    Query,
    SerializeOptions,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ClassToPlain } from '@/modules/core/types';
import { BaseController } from '@/modules/restful/base.controller';
import { Crud, Depends } from '@/modules/restful/decorators';
import { DeleteDto, ListQueryDto } from '@/modules/restful/dtos';
import { Guest, ReqUser } from '@/modules/user/decorators';
import { UserEntity } from '@/modules/user/entities';

import { CreateNovelDto, QueryNovelDto, UpdateNovelDto } from '../dtos/novel.dto';
import { NovelEntity } from '../entities/novel.entity';
import { NovelModule } from '../novel.module';
import { NovelSearchService } from '../services/novel-search.service';
import { NovelService } from '../services/novel.service';


/**
 * 小说控制器
 */
@ApiTags('小说操作')
@Depends(NovelModule)
@Controller('novels')
@Crud(() => ({
    id: 'novel',
    enabled: [
        { name: 'list', option: { allowGuest: true, description: '查询小说列表,分页展示' } },
        { name: 'detail', option: { allowGuest: true, description: '查询小说详情' } },
        { name: 'store', option: { allowGuest: true, description: '新增小说' } },
        { name: 'update', option: { allowGuest: true, description: '修改小说信息' } },
        { name: 'delete', option: { allowGuest: true, description: '删除小说,支持批量删除' } },
        { name: 'restore', option: { allowGuest: true, description: '恢复回收站中的小说' } },
    ],
    dtos: {
        list: QueryNovelDto,
        store: CreateNovelDto,
        update: UpdateNovelDto,
    },
}))
export class NovelController extends BaseController<NovelService> {
    constructor(protected novelService: NovelService, protected searchService: NovelSearchService) {
        super(novelService);
    }

    @Get('search')
    @Guest()
    @ApiOperation({ summary: '搜索小说' })
    @SerializeOptions({ groups: ['novel-list'] })
    async search(
        @Query('q') query: string,
        @Query() filters: QueryNovelDto,
        @ReqUser() user?: ClassToPlain<UserEntity>,
    ) {
        return this.searchService.searchNovels(query, filters);
    }

    // 重写基类方法，添加搜索索引功能
    @Guest()
    async list(@Query() options: ListQueryDto & QueryNovelDto, @ReqUser() user?: ClassToPlain<UserEntity>) {
        return this.novelService.paginate(options);
    }

    async store(
        @Body() data: CreateNovelDto,
        @ReqUser() user: ClassToPlain<UserEntity>,
    ): Promise<NovelEntity> {
        const novel = await this.novelService.create(data);
        // 异步创建搜索索引
        this.searchService.indexNovel(novel).catch(console.error);
        return novel;
    }

    async update(
        @Param('item', new ParseUUIDPipe()) item: string,
        @Body() data: UpdateNovelDto,
    ): Promise<NovelEntity> {
        const novel = await this.novelService.update(item, data);
        // 异步更新搜索索引
        this.searchService.indexNovel(novel).catch(console.error);
        return novel;
    }

    async delete(@Body() { items }: DeleteDto) {
        const result = await this.novelService.delete(items, false);
        // 异步删除搜索索引
        items.forEach((id) => {
            this.searchService.deleteNovel(id).catch(console.error);
        });
        return result;
    }

    @Get(':item/volumes')
    @Guest()
    @ApiOperation({ summary: '获取小说分卷列表' })
    async getVolumes(@Param('item', new ParseUUIDPipe()) item: string) {
        return this.novelService.getVolumes(item);
    }

    @Get(':item/chapters')
    @Guest()
    @ApiOperation({ summary: '获取小说章节列表' })
    async getChapters(
        @Param('item', new ParseUUIDPipe()) item: string,
        @Query('volume_id') volumeId?: string,
    ) {
        return this.novelService.getChapters(item, volumeId);
    }

    @Get(':item/chapters/:chapter_id')
    @Guest()
    @ApiOperation({ summary: '获取小说章节内容' })
    async getChapterContent(
        @Param('item', new ParseUUIDPipe()) item: string,
        @Param('chapter_id', new ParseUUIDPipe()) chapterId: string,
    ) {
        return this.novelService.getChapterContent(item, chapterId);
    }
}
