import { Module } from '@nestjs/common';
import { CharacterService } from './character.service';
import { CharacterController } from './character.controller';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Module({
  providers: [CharacterService, PrismaService],
  controllers: [CharacterController],
})
export class CharacterModule {}
