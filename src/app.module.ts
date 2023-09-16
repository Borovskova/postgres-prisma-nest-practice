import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [PrismaModule, ConfigModule.forRoot({isGlobal:true}), AuthModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
