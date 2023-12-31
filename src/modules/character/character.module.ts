import { Module } from '@nestjs/common';
import { CharacterService } from './character.service';

@Module({
  providers: [CharacterService],
  controllers: [],
})
export class CharacterModule {}
