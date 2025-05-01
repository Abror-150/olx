import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports: [
    JwtModule.register({
      secret: 'lorem',
      global: true,
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, MailService],
})
export class UserModule {}
