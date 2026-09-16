import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return 'Hola desde NestJS corriendo en Kubernetes!';
  }

  @Get('health')
  getHealth(): { status: string } {
    return { status: 'ok' };
  }
}
