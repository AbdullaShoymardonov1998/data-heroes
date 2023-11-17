import { Injectable, OnModuleInit } from '@nestjs/common';
import axios from 'axios';
import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
@Injectable()
export class CharacterService implements OnModuleInit {
  async onModuleInit() {
    let fetchUrl = 'https://rickandmortyapi.com/api/character?page=1';
    const pool = new Pool({
      //   user: 'candidate',
      //   host: 'rc1b-r21uoagjy1t7k77h.mdb.yandexcloud.net',
      //   database: 'db1',
      //   password: '62I8anq3cFq5GYh2u4Lh',
      //   port: 6432,
      connectionString:
        'postgres://candidate:62I8anq3cFq5GYh2u4Lh@rc1b-r21uoagjy1t7k77h.mdb.yandexcloud.net:6432/db1',
      ssl: {
        rejectUnauthorized: true,
        ca: fs.readFileSync('root.crt'),
      },
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
        CREATE TABLE IF NOT EXISTS public."abdulla" (
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
            'INSERT INTO "abdulla" (name, data) VALUES ($1, $2) ON CONFLICT(name) DO NOTHING';
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
