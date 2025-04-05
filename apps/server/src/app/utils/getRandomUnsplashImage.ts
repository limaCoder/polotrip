import { env } from '@/env';

export async function getRandomUnsplashImage(query: string) {
  try {
    const response = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${env.UNSPLASH_ACCESS_KEY}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      full: data?.urls?.regular,
      thumb: data?.urls?.thumb,
      photographer: data?.user?.name,
      profileUrl: data?.user?.links?.html,
    };
  } catch (error) {
    console.error('Error fetching from Unsplash:', error);
  }
}
