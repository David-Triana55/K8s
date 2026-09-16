import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ItemsController } from './items.controller';

@Module({
  controllers: [AppController, ItemsController],
})
export class AppModule {}
