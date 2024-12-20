import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { PoliciesModule } from './policies/policies.module';
import { ClaimsModule } from './claims/claims.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: process.env.MY_SQL_PASSWORD,
      database: 'insurance_system',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    PoliciesModule,
    ClaimsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
