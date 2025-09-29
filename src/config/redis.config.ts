import { createRedisConfig } from '@/modules/redis/helpers';

export const redis = createRedisConfig((configure) => ({
    host: configure.env('REDIS_HOST', '127.0.0.1'),
    port: configure.env<number>('REDIS_PORT', 6379),
    password: configure.env('REDIS_PASSWORD', '123456'),
}));
