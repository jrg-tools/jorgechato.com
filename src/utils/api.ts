import type { TravelData } from '@/utils/api.d';
import type { Location, NomadList } from '@/utils/schema.d';
import { NOMADLIST_KEY, NOMADLIST_USERNAME } from 'astro:env/server';
import { ThumbnailLocations } from '@/content/siteMap';

function cleanURL(url: string | undefined): string {
  if (!url) {
    return '';
  }

  if (url.includes('https://')) {
    const match = url.match(/\/assets\/img\/places\/.*\.(jpg|png|webp|jpeg)(\?.*)?$/);
    if (!match)
      return url; // Return the original URL if no match is found

    const imagePath = match[0]; // Extract the required image path
    return `https://nomads.com/cdn-cgi/image/format=auto,fit=cover,width=250,height=320${imagePath}`;
  }
  return `https://nomads.com${url.replace('width=100,height=100', 'width=250,height=320')}`;
}

function nomadLocationToLocation(nomadLocation: any, thumbnailOverwrite: Record<string, string>): Location {
  const city = nomadLocation.place ?? nomadLocation.city;
  const citySlug = nomadLocation.place_slug ?? nomadLocation.city_slug;
  const thumbnail = thumbnailOverwrite[city] ?? cleanURL(nomadLocation.place_photo);

  return {
    city,
    citySlug,
    country: nomadLocation.country,
    countrySlug: nomadLocation.country_slug,
    countryCode: nomadLocation.country_code,
    thumbnail,
    latitude: nomadLocation.latitude,
    longitude: nomadLocation.longitude,
    dateStart: nomadLocation.date_start,
    dateEnd: nomadLocation.date_end,
    length: nomadLocation.length,
  } as Location;
}

export async function loader() {
  try {
    const response = await fetch(`https://nomads.com/@${NOMADLIST_USERNAME}.json?key=${NOMADLIST_KEY}`);
    const data: TravelData = await response.json();
    const thumbnailOverwrite: Record<string, string> = ThumbnailLocations;

    const trips: Location[] = Array.isArray(data.trips)
      ? data.trips
          .filter((trip: any) => new Date(trip.date_start) > new Date())
          .map((trip: any) => nomadLocationToLocation(trip, thumbnailOverwrite))
          .sort((a: Location, b: Location) => new Date(a.dateStart).getTime() - new Date(b.dateStart).getTime())
      : [data.trips];

    return {
      location: {
        now: nomadLocationToLocation(data.location.now, thumbnailOverwrite) || [],
        next: nomadLocationToLocation(data.location.next, thumbnailOverwrite) || [],
      },
      trips,
    } as NomadList;
  }
  catch {
    return { location: { now: null, next: null }, trips: [] };
  }
}
