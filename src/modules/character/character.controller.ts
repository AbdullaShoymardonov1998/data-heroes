import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CharacterService } from './character.service';

@ApiTags('Characters')
@Controller({ path: 'characters', version: '1' })
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Get()
  @ApiOperation({ summary: 'Get characters and create in the DB' })
  async fetchCharacters() {
    return this.characterService.fetchAndStoreCharacters();
  }
}
