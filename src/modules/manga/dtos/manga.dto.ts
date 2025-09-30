import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsArray,
    IsBoolean,
    IsDateString,
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
    IsUrl,
    Length,
    Min,
} from 'class-validator';

import { DtoValidation } from '@/modules/core/decorators';
import { ListQueryDto } from '@/modules/restful/dtos';

import { MangaDtoGroups } from '../constants';

/**
 * 创建漫画DTO
 */
@DtoValidation({ groups: [MangaDtoGroups.CREATE] })
export class CreateMangaDto {
    @ApiProperty({ description: '漫画标题', maxLength: 200 })
    @IsString()
    @Length(1, 200, { message: '漫画标题长度必须在1-200个字符之间' })
    title!: string;

    @ApiPropertyOptional({ description: '源站URL' })
    @IsOptional()
    @IsUrl({}, { message: '源站URL格式不正确' })
    @Length(1, 500)
    source_url?: string;

    @ApiPropertyOptional({ description: '封面图片URL' })
    @IsOptional()
    @IsUrl({}, { message: '封面图片URL格式不正确' })
    @Length(1, 500)
    cover?: string;

    @ApiPropertyOptional({ description: '作者', maxLength: 100 })
    @IsOptional()
    @IsString()
    @Length(1, 100)
    author?: string;

    @ApiPropertyOptional({ description: '总章节数', minimum: 0 })
    @IsOptional()
    @IsNumber({}, { message: '总章节数必须是数字' })
    @Min(0)
    total_chapters?: number;

    @ApiPropertyOptional({
        description: '连载状态',
        enum: ['连载中', '已完结', '暂停更新'],
        default: '连载中'
    })
    @IsOptional()
    @IsEnum(['连载中', '已完结', '暂停更新'])
    status?: string;

    @ApiPropertyOptional({ description: '标签', type: [String] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];

    @ApiPropertyOptional({ description: '分类', type: [String] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    categories?: string[];

    @ApiPropertyOptional({ description: '描述' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ description: '生成时间' })
    @IsDateString({}, { message: '生成时间格式不正确' })
    generated_time!: string;

    @ApiPropertyOptional({ description: '爬取统计' })
    @IsOptional()
    crawl_statistics?: {
        success_chapters: number;
        failed_chapters: number;
        success_rate: number;
        success_list: Array<{
            name: string;
            url: string;
            images: number;
        }>;
    };

    @ApiPropertyOptional({ description: '是否启用', default: true })
    @IsOptional()
    @IsBoolean()
    enabled?: boolean;
}

/**
 * 更新漫画DTO
 */
@DtoValidation({ groups: [MangaDtoGroups.UPDATE] })
export class UpdateMangaDto extends CreateMangaDto {
    @ApiPropertyOptional({ description: '漫画ID' })
    @IsOptional()
    @IsString()
    id?: string;
}

/**
 * 查询漫画DTO
 */
@DtoValidation({ groups: [MangaDtoGroups.QUERY] })
export class QueryMangaDto extends ListQueryDto {
    @ApiPropertyOptional({ description: '漫画标题' })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiPropertyOptional({ description: '作者' })
    @IsOptional()
    @IsString()
    author?: string;

    @ApiPropertyOptional({ description: '连载状态' })
    @IsOptional()
    @IsString()
    status?: string;

    @ApiPropertyOptional({ description: '标签' })
    @IsOptional()
    @IsString()
    tags?: string;

    @ApiPropertyOptional({ description: '分类' })
    @IsOptional()
    @IsString()
    categories?: string;

    @ApiPropertyOptional({ description: '最小章节数' })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    min_chapters?: number;

    @ApiPropertyOptional({ description: '最大章节数' })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    max_chapters?: number;

    @ApiPropertyOptional({ description: '是否启用' })
    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    enabled?: boolean;
}
