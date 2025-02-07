import { PrismaClient } from '@prisma/client';
import { parse } from 'csv-parse';
import { createReadStream } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient();

type EarthquakeStrings =
  | 'DateTime'
  | 'Latitude'
  | 'Longitude'
  | 'Depth'
  | 'Magnitude'
  | 'MagType'
  | 'NbStations'
  | 'Gap'
  | 'Distance'
  | 'RMS'
  | 'Source'
  | 'EventID';

type EarthquakeRecord = Record<EarthquakeStrings, string>;

async function seed() {
  try {
    console.log('🌱 Starting seeding...');

    await prisma.earthquake.deleteMany();
    console.log('🧹 Cleared existing data');

    const records: Array<{
      location: string;
      magnitude: number;
      date: Date;
    }> = [];

    const csvPath = join(process.cwd(), 'src', 'assets', 'Global_Earthquakes_1970-2014.csv');
    console.log(`📁 Reading CSV from: ${csvPath}`);

    const parser = createReadStream(csvPath).pipe(
      parse({
        columns: true,
        skip_empty_lines: true,
        trim: true,
      })
    );

    let processedCount = 0;

    for await (const record of parser) {
      const data = record as EarthquakeRecord;

      try {
        const magnitude = parseFloat(data.Magnitude);
        const date = new Date(data.DateTime);

        if (!isNaN(magnitude) && date.toString() !== 'Invalid Date') {
          records.push({
            location: `${data.Latitude}, ${data.Longitude}`,
            magnitude,
            date,
          });

          processedCount++;

          if (records.length === 100) {
            await prisma.earthquake.createMany({
              data: records,
            });
            console.log(
              `📊 Inserted batch of ${records.length} records (Total: ${processedCount})`
            );
            records.length = 0;
          }
        }
      } catch (err) {
        console.warn('⚠️ Skipped invalid record:', err);
      }
    }

    if (records.length > 0) {
      await prisma.earthquake.createMany({
        data: records,
      });
      console.log(
        `📊 Inserted final batch of ${records.length} records (Total: ${
          processedCount + records.length
        })`
      );
    }

    const totalCount = await prisma.earthquake.count();
    console.log('✅ Seeding completed successfully');
    console.log(`📊 Total records in database: ${totalCount}`);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
