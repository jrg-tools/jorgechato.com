import type { LinkType, SnSType } from '@/utils/helper';
import locations from '@/content/locations.json';
import { SOCIAL_MEDIA } from '@/utils/helper';

export const ThumbnailLocations: Record<string, string> = locations;

export const SNS: SnSType[] = [
  {
    name: 'Newsletter',
    url: 'https://elmailde.jrg.tools',
    inHeader: true,
    icon: SOCIAL_MEDIA.newsletter,
  },
  {
    name: 'GitHub',
    url: 'https://github.com/jorgechato',
    inHeader: true,
    icon: SOCIAL_MEDIA.github,
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/jorgechato/',
    inHeader: false,
    icon: SOCIAL_MEDIA.linkedin,
  },
  {
    name: 'X',
    url: 'https://x.com/jorgechato',
    inHeader: false,
    icon: SOCIAL_MEDIA.x,
  },
];

export const SITE_MAP: LinkType[] = [
  {
    name: 'Home',
    url: '/',
    inHeader: false,
  },
  {
    name: 'How',
    url: '/how-to-work-with-me',
    inHeader: true,
  },
  {
    name: 'Where',
    url: '/where-i-am-today',
    inHeader: true,
  },
  {
    name: 'Status Page',
    url: 'https://status.jrg.tools/',
    inHeader: false,
  },
];
