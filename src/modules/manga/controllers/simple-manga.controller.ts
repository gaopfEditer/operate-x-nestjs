import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { Guest } from '@/modules/user/decorators';

/**
 * 简单漫画控制器 - 无权限检查
 */
@ApiTags('简单漫画接口')
@Controller('simple-mangas')
export class SimpleMangaController {
    @Get()
    @Guest()
    @ApiOperation({ summary: '获取漫画列表' })
    async getMangas() {
        return {
            message: '漫画列表获取成功',
            timestamp: new Date().toISOString(),
            data: {
                mangas: [
                    { id: 1, title: '测试漫画1', author: '测试作者1', status: '连载中' },
                    { id: 2, title: '测试漫画2', author: '测试作者2', status: '已完结' },
                ],
                total: 2,
            },
        };
    }

    @Get('test')
    @Guest()
    @ApiOperation({ summary: '测试接口' })
    async test() {
        return {
            message: '简单漫画接口测试成功',
            timestamp: new Date().toISOString(),
            success: true,
        };
    }
}
