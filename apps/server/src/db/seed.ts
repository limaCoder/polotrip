import { db, client } from '.';
import { albums, users, photos } from './schema';
import { env } from '@/env';

import { fastify } from 'fastify';
import fastifyJwt from '@fastify/jwt';

import { eq } from 'drizzle-orm';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { createId } from '@paralleldrive/cuid2';

async function seed() {
  console.log('🌱 Starting database seed...');

  const app = fastify();
  await app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
  });

  await db.delete(photos);
  await db.delete(albums);
  await db.delete(users);

  console.log('✅ Database cleared');

  const userId = createId();

  const [user] = await db
    .insert(users)
    .values({
      id: userId,
      name: 'Test User',
      email: 'teste@polotrip.com',
      provider: 'google',
      providerUserId: 'test-user-123',
      avatarUrl: 'https://i.pravatar.cc/150?u=teste@polotrip.com',
    })
    .returning();

  console.log(`✅ User created: ${user.name} (${user.email})`);

  const albumsData = [];

  for (let i = 0; i < 3; i++) {
    const albumTitle = faker.location.country();
    const [album] = await db
      .insert(albums)
      .values({
        userId: user.id,
        title: `Trip to ${albumTitle}`,
        description: faker.lorem.paragraph(),
        coverImageUrl: `https://source.unsplash.com/random/800x600/?travel,${albumTitle.toLowerCase()}`,
        isPublished: i === 0 ? true : i === 1,
        shareableLink: `album-${createId()}`,
      })
      .returning();

    albumsData.push(album);
    console.log(`✅ Album created: ${album.title}`);

    const photosCount = faker.number.int({ min: 5, max: 15 });

    for (let j = 0; j < photosCount; j++) {
      const location = faker.location.city();
      const latitude = faker.location.latitude();
      const longitude = faker.location.longitude();
      const randomDate = faker.date.recent({ days: 30 }).toISOString();

      await db.insert(photos).values({
        albumId: album.id,
        imageUrl: `https://source.unsplash.com/random/800x600/?${albumTitle.toLowerCase()},travel`,
        thumbnailUrl: `https://source.unsplash.com/random/400x300/?${albumTitle.toLowerCase()},travel`,
        originalFileName: `photo-${j + 1}.jpg`,
        dateTaken: randomDate,
        latitude,
        longitude,
        locationName: location,
        description: faker.lorem.sentence(),
      });
    }

    await db.update(albums).set({ photoCount: photosCount }).where(eq(albums.id, album.id));

    console.log(`✅ ${photosCount} photos created for album ${album.title}`);
  }

  const accessToken = app.jwt.sign(
    {
      sub: user.id,
      name: user.name,
      email: user.email,
    },
    { expiresIn: '5m' },
  );

  const refreshToken = app.jwt.sign({ sub: user.id }, { expiresIn: '7d' });

  console.log('🎉 Seed completed successfully!');
  console.log('📝 Summary:');
  console.log(`- 1 user: ${user.email}`);
  console.log(`- User ID: ${user.id}`);
  console.log(`- ${albumsData.length} albums`);
  console.log('- Photos distributed among albums');
  console.log('\n📋 INFORMATION FOR POSTMAN TESTING:');
  console.log('========================================');
  console.log('1. TEST USER:');
  console.log(`   Email: ${user.email}`);
  console.log(`   ID: ${user.id}`);
  console.log('\n2. PRE-GENERATED TOKENS (valid for a limited time):');
  console.log(`   Access Token: ${accessToken}`);
  console.log(`   Refresh Token: ${refreshToken}`);
  console.log('\n3. AUTHENTICATION INSTRUCTIONS:');
  console.log('   a) Use the /auth/sync-user endpoint to simulate login and get new tokens');
  console.log('   b) For authenticated requests:');
  console.log('      - Add the header: Authorization: Bearer <access_token>');
  console.log('   c) To renew the token when it expires:');
  console.log('      - Use the /auth/token endpoint with the refreshToken cookie');
  console.log('========================================');
}

seed()
  .catch(e => {
    console.error('❌ Error executing seed:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await client.end();
    process.exit(0);
  });
