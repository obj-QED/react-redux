import { DiscordAuth } from './DiscordAuth/DiscordAuth';
import { FacebookAuth } from './FacebookAuth/FacebookAuth';
import { GoogleAuth } from './GoogleAuth/GoogleAuth';
import { SlackAuth } from './SlackAuth/SlackAuth';
import { InstagramAuth } from './InstagramAuth/InstagramAuth';
import { TelegramAuth } from './TelegramAuth/TelegramAuth';
import { WhatsappAuth } from './WhatsappAuth/WhatsappAuth';

export const SOCIAL_AUTH = {
  google: GoogleAuth,
  facebook: FacebookAuth,
  discord: DiscordAuth,
  slack: SlackAuth,
  instagram: InstagramAuth,
  telegram: TelegramAuth,
  whatsApp: WhatsappAuth,
};
