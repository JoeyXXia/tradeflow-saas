import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  // Liveness only: no database or message broker is connected on Day 1.
  @Get()
  health(): { status: 'ok'; service: 'tradeflow-api' } {
    return { status: 'ok', service: 'tradeflow-api' };
  }
}
