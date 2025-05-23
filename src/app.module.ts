import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { RegionModule } from './region/region.module';
import { MailModule } from './mail/mail.module';
import { ProductModule } from './product/product.module';
import { ColorModule } from './color/color.module';
import { CategoryModule } from './category/category.module';
import { CommentModule } from './comment/comment.module';
import { SesionModule } from './sesion/sesion.module';
import { LikeModule } from './like/like.module';
import { OrderModule } from './order/order.module';
import { ChatModule } from './chat/chat.module';
import { ViewModule } from './view/view.module';
import { UploadController } from './upload/upload.controller';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    RegionModule,
    MailModule,
    ProductModule,
    ColorModule,
    CategoryModule,
    CommentModule,
    SesionModule,
    LikeModule,
    OrderModule,
    ChatModule,
    ViewModule,
  ],
  controllers: [AppController, UploadController],
  providers: [AppService],
})
export class AppModule {}
