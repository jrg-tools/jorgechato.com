import type { TravelData } from '@/utils/api.d';
import type { Location, NomadList } from '@/utils/schema.d';
import { NOMADLIST_KEY, NOMADLIST_USERNAME } from 'astro:env/server';
import { ThumbnailLocations } from '@/content/siteMap';

function cleanURL(url: string | undefined): string {
    if (!url) {
        return '';
    }

    const marker = '/assets/img/places/';
    const lastIdx = url.lastIndexOf(marker);

    if (lastIdx === -1) {
        // No marker found — treat as a relative nomads.com path
        if (!url.includes('https://')) {
            return `https://nomads.com${url.replace('width=100,height=100', 'width=250,height=320')}`;
        }
        return url;
    }

    // Take everything after the LAST marker (real file), then strip query junk
    const after = url.slice(lastIdx + marker.length);
    const filename = after.split('?')[0];

    if (!/\.(jpg|jpeg|png|webp)$/i.test(filename)) {
        return url; // couldn't confidently parse — fall back to original
    }

    return `https://nomads.com/cdn-cgi/image/format=auto,fit=cover,width=250,height=320${marker}${filename}`;
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
