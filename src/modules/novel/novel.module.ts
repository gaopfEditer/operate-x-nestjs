import { ModuleBuilder } from '../core/decorators';
import { DatabaseModule } from '../database/database.module';
import { addEntities } from '../database/helpers';
import { ElasticModule } from '../elastic/elastic.module';
import { RbacModule } from '../rbac/rbac.module';
import { UserModule } from '../user/user.module';

import * as DtoMaps from './dtos';
import * as EntityMaps from './entities';
import { NovelRbac } from './rbac';
import * as RepositoryMaps from './repositories';
import * as ServiceMaps from './services';

const entities = Object.values(EntityMaps);
const repositories = Object.values(RepositoryMaps);
const services = Object.values(ServiceMaps);
const dtos = Object.values(DtoMaps);

@ModuleBuilder(async (configure) => {
    return {
        imports: [
            UserModule,
            RbacModule,
            ElasticModule,
            await addEntities(configure, entities),
            DatabaseModule.forRepository(repositories),
        ],
        providers: [...dtos, ...services, NovelRbac],
        exports: [DatabaseModule.forRepository(repositories), ...services],
    };
})
export class NovelModule {}
