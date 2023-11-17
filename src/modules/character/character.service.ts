import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class CharacterService {
  constructor(private prisma: PrismaService) {}

  async fetchAndStoreCharacters() {
    let fetchUrl: string = 'https://rickandmortyapi.com/api/character/';

    while (fetchUrl) {
      try {
        const { data } = await axios({
          method: 'GET',
          url: fetchUrl,
          validateStatus: (status) => status >= 200 && status < 300,
        });

        const characters = data.results;

        const characterData = characters.map((character) => ({
          name: character.name,
          data: character,
        }));

        await this.prisma.character.createMany({
          data: characterData,
          skipDuplicates: true,
        });

        fetchUrl = data.info.next;

        return {
          message: 'Data successfully created',
        };
      } catch (error) {
        console.error('Error fetching or storing characters:', error);
        break;
      }
    }
  }
}
