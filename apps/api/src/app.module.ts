import { Module } from '@nestjs/common';
import { APP_CONFIG, validateConfig } from './config';
import { HealthController } from './health.controller';

@Module({
  controllers: [HealthController],
  providers: [
    { provide: APP_CONFIG, useFactory: () => validateConfig(process.env) },
  ],
})
export class AppModule {}
