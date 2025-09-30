import { Injectable, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import { PermissionAction, SystemRoles } from '../rbac/constants';
import { RbacResolver } from '../rbac/rbac.resolver';

import { NovelChapterEntity } from './entities/novel-chapter.entity';
import { NovelVolumeEntity } from './entities/novel-volume.entity';
import { NovelEntity } from './entities/novel.entity';

@Injectable()
export class NovelRbac implements OnModuleInit {
    constructor(private moduleRef: ModuleRef) {}

    onModuleInit() {
        const resolver = this.moduleRef.get(RbacResolver, { strict: false });
        resolver.addPermissions([
            {
                name: 'novel.create',
                rule: {
                    action: PermissionAction.CREATE,
                    subject: NovelEntity,
                },
            },
            {
                name: 'novel.read',
                rule: {
                    action: PermissionAction.READ,
                    subject: NovelEntity,
                },
            },
            {
                name: 'novel.update',
                rule: {
                    action: PermissionAction.UPDATE,
                    subject: NovelEntity,
                },
            },
            {
                name: 'novel.delete',
                rule: {
                    action: PermissionAction.DELETE,
                    subject: NovelEntity,
                },
            },
            {
                name: 'novel.manage',
                rule: {
                    action: PermissionAction.MANAGE,
                    subject: NovelEntity,
                },
            },
            {
                name: 'novel-volume.manage',
                rule: {
                    action: PermissionAction.MANAGE,
                    subject: NovelVolumeEntity,
                },
            },
            {
                name: 'novel-chapter.manage',
                rule: {
                    action: PermissionAction.MANAGE,
                    subject: NovelChapterEntity,
                },
            },
        ]);
        resolver.addRoles([
            {
                name: SystemRoles.USER,
                permissions: ['novel.read'],
            },
            {
                name: 'novel-editor',
                label: '小说编辑',
                description: '可以创建和编辑小说内容',
                permissions: [
                    'novel.create',
                    'novel.read',
                    'novel.update',
                    'novel-volume.manage',
                    'novel-chapter.manage',
                ],
            },
            {
                name: 'novel-manager',
                label: '小说管理员',
                description: '管理所有小说相关功能',
                permissions: ['novel.manage', 'novel-volume.manage', 'novel-chapter.manage'],
            },
        ]);
    }
}
