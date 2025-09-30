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
    Max,
    Min,
} from 'class-validator';

import { DtoValidation } from '@/modules/core/decorators';

import { NovelDtoGroups } from '../constants';

/**
 * 创建小说DTO
 */
@DtoValidation({ groups: [NovelDtoGroups.CREATE] })
export class CreateNovelDto {
    @ApiProperty({ description: '小说名称', maxLength: 200 })
    @IsString()
    @Length(1, 200, { message: '小说名称长度必须在1-200个字符之间' })
    name!: string;

    @ApiPropertyOptional({ description: '封面图片URL' })
    @IsOptional()
    @IsUrl({}, { message: '封面图片URL格式不正确' })
    @Length(1, 500)
    cover?: string;

    @ApiPropertyOptional({ description: '详情页面URL' })
    @IsOptional()
    @IsUrl({}, { message: '详情页面URL格式不正确' })
    @Length(1, 500)
    detail_url?: string;

    @ApiPropertyOptional({
        description: '连载状态',
        enum: ['连载中', '已完结', '暂停更新'],
        default: '连载中'
    })
    @IsOptional()
    @IsEnum(['连载中', '已完结', '暂停更新'])
    status?: string;

    @ApiPropertyOptional({ description: '排名' })
    @IsOptional()
    @IsNumber({}, { message: '排名必须是数字' })
    @Min(1)
    rank?: number;

    @ApiProperty({ description: '作者', maxLength: 100 })
    @IsString()
    @Length(1, 100, { message: '作者名称长度必须在1-100个字符之间' })
    author!: string;

    @ApiPropertyOptional({ description: '评分', minimum: 0, maximum: 10 })
    @IsOptional()
    @IsNumber({}, { message: '评分必须是数字' })
    @Min(0)
    @Max(10)
    rating?: number;

    @ApiPropertyOptional({ description: '主题标签', type: [String] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    themes?: string[];

    @ApiPropertyOptional({ description: '内容标签', type: [String] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];

    @ApiPropertyOptional({ description: '最新章节', maxLength: 100 })
    @IsOptional()
    @IsString()
    @Length(1, 100)
    latest_chapter?: string;

    @ApiPropertyOptional({ description: '更新时间' })
    @IsOptional()
    @IsDateString({}, { message: '更新时间格式不正确' })
    update_time?: string;

    @ApiPropertyOptional({ description: '观看次数', minimum: 0 })
    @IsOptional()
    @IsNumber({}, { message: '观看次数必须是数字' })
    @Min(0)
    view_count_parsed?: number;

    @ApiPropertyOptional({ description: '字数', minimum: 0 })
    @IsOptional()
    @IsNumber({}, { message: '字数必须是数字' })
    @Min(0)
    word_count_parsed?: number;

    @ApiPropertyOptional({ description: '肉度等级', minimum: 0, maximum: 100 })
    @IsOptional()
    @IsNumber({}, { message: '肉度等级必须是数字' })
    @Min(0)
    @Max(100)
    meat_level_parsed?: number;

    @ApiPropertyOptional({ description: '特征值', maxLength: 50 })
    @IsOptional()
    @IsString()
    @Length(1, 50)
    feature_value?: string;

    @ApiProperty({ description: '爬取时间' })
    @IsDateString({}, { message: '爬取时间格式不正确' })
    crawl_time!: string;

    @ApiPropertyOptional({ description: '是否启用', default: true })
    @IsOptional()
    @IsBoolean()
    enabled?: boolean;
}

/**
 * 更新小说DTO
 */
@DtoValidation({ groups: [NovelDtoGroups.UPDATE] })
export class UpdateNovelDto extends CreateNovelDto {
    @ApiPropertyOptional({ description: '小说ID' })
    @IsOptional()
    @IsString()
    id?: string;
}

/**
 * 查询小说DTO
 */
@DtoValidation({ groups: [NovelDtoGroups.QUERY] })
export class QueryNovelDto {
    @ApiPropertyOptional({ description: '小说名称' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ description: '作者' })
    @IsOptional()
    @IsString()
    author?: string;

    @ApiPropertyOptional({ description: '连载状态' })
    @IsOptional()
    @IsString()
    status?: string;

    @ApiPropertyOptional({ description: '主题标签' })
    @IsOptional()
    @IsString()
    themes?: string;

    @ApiPropertyOptional({ description: '内容标签' })
    @IsOptional()
    @IsString()
    tags?: string;

    @ApiPropertyOptional({ description: '最小评分' })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    min_rating?: number;

    @ApiPropertyOptional({ description: '最大评分' })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    max_rating?: number;

    @ApiPropertyOptional({ description: '最小字数' })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    min_word_count?: number;

    @ApiPropertyOptional({ description: '最大字数' })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    max_word_count?: number;

    @ApiPropertyOptional({ description: '最小肉度' })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    min_meat_level?: number;

    @ApiPropertyOptional({ description: '最大肉度' })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    max_meat_level?: number;

    @ApiPropertyOptional({ description: '是否启用' })
    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    enabled?: boolean;
}
