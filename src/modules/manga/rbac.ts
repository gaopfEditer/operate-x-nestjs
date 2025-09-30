import { Injectable, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import { PermissionAction, SystemRoles } from '../rbac/constants';
import { RbacResolver } from '../rbac/rbac.resolver';

import { MangaEntity } from './entities/manga.entity';
import { MangaChapterEntity } from './entities/manga-chapter.entity';
import { MangaImageEntity } from './entities/manga-image.entity';

@Injectable()
export class MangaRbac implements OnModuleInit {
    constructor(private moduleRef: ModuleRef) {}

    onModuleInit() {
        const resolver = this.moduleRef.get(RbacResolver, { strict: false });
        resolver.addPermissions([
            {
                name: 'manga.create',
                rule: {
                    action: PermissionAction.CREATE,
                    subject: MangaEntity,
                },
            },
            {
                name: 'manga.read',
                rule: {
                    action: PermissionAction.READ,
                    subject: MangaEntity,
                },
            },
            {
                name: 'manga.update',
                rule: {
                    action: PermissionAction.UPDATE,
                    subject: MangaEntity,
                },
            },
            {
                name: 'manga.delete',
                rule: {
                    action: PermissionAction.DELETE,
                    subject: MangaEntity,
                },
            },
            {
                name: 'manga.manage',
                rule: {
                    action: PermissionAction.MANAGE,
                    subject: MangaEntity,
                },
            },
            {
                name: 'manga-chapter.manage',
                rule: {
                    action: PermissionAction.MANAGE,
                    subject: MangaChapterEntity,
                },
            },
            {
                name: 'manga-image.manage',
                rule: {
                    action: PermissionAction.MANAGE,
                    subject: MangaImageEntity,
                },
            },
        ]);
        resolver.addRoles([
            {
                name: SystemRoles.USER,
                permissions: ['manga.read'],
            },
            {
                name: 'manga-editor',
                label: '漫画编辑',
                description: '可以创建和编辑漫画内容',
                permissions: [
                    'manga.create',
                    'manga.read',
                    'manga.update',
                    'manga-chapter.manage',
                    'manga-image.manage',
                ],
            },
            {
                name: 'manga-manager',
                label: '漫画管理员',
                description: '管理所有漫画相关功能',
                permissions: [
                    'manga.manage',
                    'manga-chapter.manage',
                    'manga-image.manage',
                ],
            },
        ]);
    }
}
