import { Module } from '@nestjs/common';
import { CharacterService } from './character.service';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Module({
  providers: [CharacterService, PrismaService],
  controllers: [],
})
export class CharacterModule {}
