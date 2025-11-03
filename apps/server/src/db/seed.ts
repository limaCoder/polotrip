/** biome-ignore-all lint/suspicious/noConsole: we need to use console.log for logging */
import { faker } from "@faker-js/faker/locale/pt_BR";
import { createId } from "@paralleldrive/cuid2";
import { auth } from "@polotrip/auth";
import { client, db } from "@polotrip/db";
import {
  accounts,
  albums,
  photos,
  users,
  verifications,
} from "@polotrip/db/schema";
import { eq } from "drizzle-orm";
import { getRandomUnsplashImage } from "@/app/utils/getRandomUnsplashImage";

async function seed() {
  console.log("🌱 Starting database seed...");

  console.log("🧹 Clearing existing data...");
  await db.delete(accounts);
  await db.delete(users);
  await db.delete(verifications);

  const userEmail = "teste@example.com";
  const userPassword = "senha123";

  const createUser = async () => {
    console.log("👤 Creating test user with better-auth...");

    try {
      const result = await auth.api.signUpEmail({
        body: {
          name: "Usuário Teste",
          email: userEmail,
          password: userPassword,
        },
      });

      return result;
    } catch (error) {
      throw new Error(`Failed to create user: ${error}`);
    }
  };

  const userData = await createUser();

  const userId = userData?.user?.id;
  console.log("✅ User created with ID:", userId);

  console.log("📸 Creating sample albums...");
  // biome-ignore lint/suspicious/noEvolvingTypes: we need to use any type here
  const albumsData = [];

  for (let i = 0; i < 15; i++) {
    const albumTitle = faker.location.country();
    const albumQuery = `travel,${albumTitle.toLowerCase()}`;

    const coverImage = await getRandomUnsplashImage(albumQuery);

    const albumDate = faker.date
      .recent({ days: 365 })
      .toISOString()
      .split("T")[0];

    const [album] = await db
      .insert(albums)
      .values({
        userId,
        title: `Trip to ${albumTitle}`,
        date: albumDate,
        description: faker.lorem.paragraph(),
        coverImageUrl: coverImage?.full,
        isPublished: i === 0 ? true : i === 1,
        shareableLink: `album-${createId()}`,
      })
      .returning();

    albumsData.push(album);
    console.log(`✅ Album created: ${album.title}`);

    const photosCount = faker.number.int({ min: 1, max: 1 });

    for (let j = 0; j < photosCount; j++) {
      const location = faker.location.city();
      const latitude = faker.location.latitude();
      const longitude = faker.location.longitude();
      const randomDate = faker.date.recent({ days: 30 }).toISOString();

      const photoImage = await getRandomUnsplashImage(
        `${albumTitle.toLowerCase()},travel`
      );

      await db.insert(photos).values({
        albumId: album.id,
        imageUrl: photoImage?.full,
        thumbnailUrl: photoImage?.thumb,
        originalFileName: `photo-${j + 1}.jpg`,
        dateTaken: randomDate,
        latitude,
        longitude,
        locationName: location,
        description: faker.lorem.sentence(),
      });

      const TIMEOUT = 100;

      await new Promise((resolve) => setTimeout(resolve, TIMEOUT));
    }

    await db
      .update(albums)
      .set({ photoCount: photosCount })
      .where(eq(albums.id, album.id));

    console.log(`✅ ${photosCount} photos created for album ${album.title}`);
  }

  console.log("💳 Creating sample payments...");

  console.log("\n✅ Seed completed successfully!");
  console.log(`- ${albumsData.length} albums`);
  console.log("- Photos distributed among albums");
  console.log("\n📝 Test information:");
  console.log("Email:", userEmail);
  console.log("Password:", userPassword);
  console.log("\n🔍 Testing with Postman:");
  console.log("1. Login using endpoint: POST /auth/sign-in");
  console.log("   Request body:");
  console.log("   {");
  console.log('     "email": "teste@example.com",');
  console.log('     "password": "senha123"');
  console.log("   }");
  console.log(
    "2. Use the returned session cookie to access protected endpoints"
  );
  console.log("3. To verify the session: GET /auth/get-session");
  console.log("4. To logout: POST /auth/sign-out");
  console.log("\n🚀 Happy testing!");

  process.exit(0);
}

seed()
  .catch((e) => {
    console.error("❌ Error executing seed:");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await client.end();
    process.exit(0);
  });
