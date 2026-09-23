import { Body, Controller, Get, Param } from '@nestjs/common';
import { redisClient } from './redis';

@Controller('redis')
export class RedisController {
  @Get('ping')
  async ping() {
    const pong = await redisClient.ping();
    return { pong };
  }

  @Get(':key')
  async get(@Param('key') key: string) {
    const value = await redisClient.get(key);
    return { key, value };
  }

  @Get(':key/:value')
  async set(@Param('key') key: string, @Param('value') value: string) {
    await redisClient.set(key, value);
    return { key, value, saved: true };
  }
}
