import {
    Body,
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    Post,
    Put,
    Delete,
    Query,
    SerializeOptions,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ClassToPlain } from '@/modules/core/types';
import { IPaginateDto } from '@/modules/database/types';
import { Depends } from '@/modules/restful/decorators';
import { Guest, ReqUser } from '@/modules/user/decorators';
import { UserEntity } from '@/modules/user/entities';

import { CreateMangaDto, QueryMangaDto, UpdateMangaDto } from '../dtos/manga.dto';
import { MangaEntity } from '../entities/manga.entity';
import { MangaModule } from '../manga.module';
import { MangaSearchService } from '../services/manga-search.service';
import { MangaService } from '../services/manga.service';

/**
 * 漫画控制器
 */
@ApiTags('漫画操作')
@Depends(MangaModule)
@Controller('mangas')
export class MangaController {
    constructor(
        private readonly mangaService: MangaService,
        private readonly searchService: MangaSearchService,
    ) {}

    @Get()
    @Guest()
    @ApiOperation({ summary: '获取漫画列表' })
    @SerializeOptions({ groups: ['manga-list'] })
    async getMangas(
        @Query() options: IPaginateDto & QueryMangaDto,
        @ReqUser() user?: ClassToPlain<UserEntity>,
    ) {
        return this.mangaService.paginate(options);
    }

    @Get('search')
    @Guest()
    @ApiOperation({ summary: '搜索漫画' })
    @SerializeOptions({ groups: ['manga-list'] })
    async search(
        @Query('q') query: string,
        @Query() filters: QueryMangaDto,
        @ReqUser() user?: ClassToPlain<UserEntity>,
    ) {
        return this.searchService.searchMangas(query, filters);
    }

    @Get(':id')
    @Guest()
    @ApiOperation({ summary: '获取漫画详情' })
    @SerializeOptions({ groups: ['manga-detail'] })
    async getManga(
        @Param('id', new ParseUUIDPipe()) id: string,
        @ReqUser() user?: ClassToPlain<UserEntity>,
    ) {
        return this.mangaService.detail(id);
    }

    @Post()
    @Guest()
    @ApiOperation({ summary: '创建漫画' })
    @SerializeOptions({ groups: ['manga-detail'] })
    async createManga(
        @Body() data: CreateMangaDto,
        @ReqUser() user: ClassToPlain<UserEntity>,
    ): Promise<MangaEntity> {
        const manga = await this.mangaService.create(data);
        // 异步创建搜索索引
        this.searchService.indexManga(manga).catch(console.error);
        return manga;
    }

    @Put(':id')
    @Guest()
    @ApiOperation({ summary: '更新漫画' })
    @SerializeOptions({ groups: ['manga-detail'] })
    async updateManga(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() data: UpdateMangaDto,
        @ReqUser() user: ClassToPlain<UserEntity>,
    ): Promise<MangaEntity> {
        const manga = await this.mangaService.update(id, data);
        // 异步更新搜索索引
        this.searchService.indexManga(manga).catch(console.error);
        return manga;
    }

    @Delete(':id')
    @Guest()
    @ApiOperation({ summary: '删除漫画' })
    async deleteManga(
        @Param('id', new ParseUUIDPipe()) id: string,
        @ReqUser() user: ClassToPlain<UserEntity>,
    ) {
        const result = await this.mangaService.delete([id], false);
        // 异步删除搜索索引
        this.searchService.deleteManga(id).catch(console.error);
        return result;
    }

    @Get(':id/chapters')
    @Guest()
    @ApiOperation({ summary: '获取漫画章节列表' })
    async getChapters(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.mangaService.getChapters(id);
    }

    @Get(':id/chapters/:chapterId')
    @Guest()
    @ApiOperation({ summary: '获取漫画章节信息' })
    async getChapter(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Param('chapterId', new ParseUUIDPipe()) chapterId: string,
    ) {
        return this.mangaService.getChapter(id, chapterId);
    }

    @Get(':id/chapters/:chapterId/images')
    @Guest()
    @ApiOperation({ summary: '获取漫画章节图片列表' })
    async getChapterImages(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Param('chapterId', new ParseUUIDPipe()) chapterId: string,
    ) {
        return this.mangaService.getChapterImages(id, chapterId);
    }

    @Get(':id/chapters/:chapterId/images/:imageId')
    @Guest()
    @ApiOperation({ summary: '获取漫画图片' })
    async getImage(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Param('chapterId', new ParseUUIDPipe()) chapterId: string,
        @Param('imageId', new ParseUUIDPipe()) imageId: string,
    ) {
        return this.mangaService.getImage(id, chapterId, imageId);
    }
}
