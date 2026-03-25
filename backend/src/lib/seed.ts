import { prisma } from './prisma';
import type { SettingDefinition } from '../types';

// ─── Setting definitions ──────────────────────────────────────────────────────
// This is the only place that defines what settings exist in the system.
// After the initial seed, definitions are managed in the database directly
// (or via a future admin UI / migration scripts).

const definitions: SettingDefinition[] = [
  {
    key: 'enable_notifications',
    label: 'Enable Notifications',
    description: 'Send email and in-app notifications to account users.',
    type: 'boolean',
    defaultValue: true,
    sortOrder: 0,
  },
  {
    key: 'support_email',
    label: 'Support Email',
    description: 'Email address used for incoming support requests.',
    type: 'text',
    defaultValue: '',
    sortOrder: 1,
  },
  {
    key: 'daily_email_limit',
    label: 'Daily Email Limit',
    description: 'Maximum number of outbound emails per day (0 = unlimited).',
    type: 'number',
    defaultValue: 500,
    sortOrder: 2,
  },
  {
    key: 'timezone',
    label: 'Timezone',
    description: 'Timezone used for scheduling and reporting.',
    type: 'select',
    defaultValue: 'UTC',
    sortOrder: 3,
    options: [
      { label: 'UTC', value: 'UTC' },
      { label: 'US / Eastern (UTC-5)', value: 'America/New_York' },
      { label: 'US / Central (UTC-6)', value: 'America/Chicago' },
      { label: 'US / Pacific (UTC-8)', value: 'America/Los_Angeles' },
      { label: 'Europe / London (UTC+0)', value: 'Europe/London' },
      { label: 'Europe / Paris (UTC+1)', value: 'Europe/Paris' },
      { label: 'Asia / Dubai (UTC+4)', value: 'Asia/Dubai' },
      { label: 'Asia / Yerevan (UTC+4)', value: 'Asia/Yerevan' },
      { label: 'Asia / Tokyo (UTC+9)', value: 'Asia/Tokyo' },
    ],
  },
  {
    key: 'allowed_channels',
    label: 'Allowed Channels',
    description: 'Communication channels enabled for this account.',
    type: 'multiselect',
    defaultValue: ['email'],
    sortOrder: 4,
    options: [
      { label: 'Email', value: 'email' },
      { label: 'SMS', value: 'sms' },
      { label: 'Push Notification', value: 'push' },
      { label: 'In-App Message', value: 'in_app' },
      { label: 'Webhook', value: 'webhook' },
    ],
  },
  {
    key: 'language',
    label: 'Interface Language',
    description: 'Default language for the account dashboard.',
    type: 'select',
    defaultValue: 'en',
    sortOrder: 5,
    options: [
      { label: 'English', value: 'en' },
      { label: 'French', value: 'fr' },
      { label: 'German', value: 'de' },
      { label: 'Spanish', value: 'es' },
      { label: 'Armenian', value: 'hy' },
    ],
  },
  {
    key: 'two_factor_auth',
    label: 'Two-Factor Authentication',
    description: 'Require 2FA for all users in this account.',
    type: 'boolean',
    defaultValue: false,
    sortOrder: 6,
  },
  {
    key: 'api_rate_limit',
    label: 'API Rate Limit (req/min)',
    description: 'Maximum API requests allowed per minute.',
    type: 'number',
    defaultValue: 60,
    sortOrder: 7,
  },
];

// ─── Accounts ─────────────────────────────────────────────────────────────────

const accounts = [
  { name: 'Acme Corporation' },
  { name: 'Globex Industries' },
  { name: 'Initech Solutions' },
  { name: 'Umbrella Corp' },
  { name: 'Stark Enterprises' },
];

async function main() {
  console.log('Seeding database...');

  await prisma.accountSetting.deleteMany();
  await prisma.account.deleteMany();

  // Upsert definitions so re-running seed is safe
  for (const def of definitions) {
    await prisma.settingDefinition.upsert({
      where: { key: def.key },
      create: {
        key: def.key,
        label: def.label,
        description: def.description,
        type: def.type,
        defaultValue: JSON.stringify(def.defaultValue),
        options: def.options ? JSON.stringify(def.options) : null,
        sortOrder: def.sortOrder ?? 0,
      },
      update: {
        label: def.label,
        description: def.description,
        type: def.type,
        defaultValue: JSON.stringify(def.defaultValue),
        options: def.options ? JSON.stringify(def.options) : null,
        sortOrder: def.sortOrder ?? 0,
      },
    });
  }
  console.log(`Upserted ${definitions.length} setting definitions.`);

  for (const account of accounts) {
    await prisma.account.create({ data: account });
  }
  console.log(`Created ${accounts.length} accounts.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
