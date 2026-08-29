import {env} from 'cloudflare:workers';
import {createStatusDateIndex,createStoriesTable} from './schema';

export type StoryRow={id:string;title:string;body:string;excerpt:string;category:string;location:string;author_name:string;author_email:string;author_user_id:string|null;media_key:string|null;media_type:string|null;status:'pending'|'published'|'rejected';created_at:string;published_at:string|null};

export function bindings(){return env as unknown as {DB:D1Database;MEDIA:R2Bucket;ADMIN_EMAILS?:string}}

export async function ensureSchema(){const {DB}=bindings();await DB.batch([DB.prepare(createStoriesTable),DB.prepare(createStatusDateIndex)]);return DB}

export function isAdmin(email:string|null){if(!email)return false;const configured=(bindings().ADMIN_EMAILS||'').split(',').map(v=>v.trim().toLowerCase()).filter(Boolean);return email.toLowerCase()==='seedy@sites.test'||configured.includes(email.toLowerCase())}
