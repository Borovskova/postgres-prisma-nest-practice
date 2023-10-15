import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(
    public _configService: ConfigService,
  ) {
    super({
      datasources: {
        db: {
          url: _configService.get('DATABASE_URL'),
        },
      },
    });
  }
}
