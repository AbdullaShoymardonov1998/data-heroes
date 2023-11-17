import { Injectable, OnModuleInit } from '@nestjs/common';
import axios from 'axios';
import { Pool } from 'pg';

@Injectable()
export class CharacterService implements OnModuleInit {
  async onModuleInit() {
    let fetchUrl = 'https://rickandmortyapi.com/api/character?page=1';
    const pool = new Pool({
      user: 'user',
      host: '38.242.252.210',
      database: 'database',
      password: 'password',
      port: 5432,
    });

    const checkSchemaQuery = `
        DO $$ 
        BEGIN
            IF NOT EXISTS (SELECT schema_name
                           FROM information_schema.schemata 
                           WHERE schema_name = 'public') THEN
                CREATE SCHEMA public;
            END IF;
        END
        $$;
    `;

    await pool.query(checkSchemaQuery);

    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS public."characters" (
            "id" SERIAL NOT NULL,
            "name" TEXT NOT NULL UNIQUE,
            "data" JSONB NOT NULL,
            CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
        );
    `;
    await pool.query(createTableQuery);
    while (fetchUrl) {
      try {
        const page = fetchUrl.split('=')[1];
        console.log('Fetching page:', page);

        const response = await axios.get(fetchUrl);
        const characters = response.data.results;

        for (const character of characters) {
          const text =
            'INSERT INTO "characters" (name, data) VALUES ($1, $2) ON CONFLICT(name) DO NOTHING';
          const values = [character.name, character];

          await pool.query(text, values);
        }

        fetchUrl = response.data.info.next;
      } catch (error) {
        console.error('Error fetching or storing characters:', error);
      }
    }
    console.log(`Finished successfully`);
    await pool.end();
  }
}
