import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ItemsController } from './items.controller';
import { RedisController } from './redis.controller';

@Module({
  controllers: [AppController, ItemsController, RedisController],
})
export class AppModule {}
