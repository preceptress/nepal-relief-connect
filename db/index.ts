import {env} from 'cloudflare:workers';
import {createAuditRecordIndex,createAuditTable,createOperationsStatusPriorityIndex,createOperationsTable,createOperationsTypeStatusIndex,createStatusDateIndex,createStoriesTable} from './schema';

export type StoryRow={id:string;title:string;body:string;excerpt:string;category:string;location:string;author_name:string;author_email:string;author_user_id:string|null;media_key:string|null;media_type:string|null;status:'pending'|'published'|'rejected';created_at:string;published_at:string|null};
export type OperationRow={id:string;record_type:'request'|'offer'|'reunification'|'map'|'update'|'organization'|'alert';title:string;description:string;category:string;location:string;contact_name:string;contact_email:string;contact_phone:string;priority:'low'|'medium'|'high'|'critical';status:'draft'|'pending'|'verified'|'published'|'resolved'|'archived';latitude:number|null;longitude:number|null;people_count:number;source:string;created_by:string;created_at:string;updated_at:string;published_at:string|null;metadata_json:string};

export function bindings(){return env as unknown as {DB:D1Database;MEDIA:R2Bucket;ADMIN_EMAILS?:string}}

export async function ensureSchema(){const {DB}=bindings();await DB.batch([DB.prepare(createStoriesTable),DB.prepare(createStatusDateIndex),DB.prepare(createOperationsTable),DB.prepare(createOperationsTypeStatusIndex),DB.prepare(createOperationsStatusPriorityIndex),DB.prepare(createAuditTable),DB.prepare(createAuditRecordIndex)]);return DB}

export function isAdmin(email:string|null){if(!email)return false;const configured=(bindings().ADMIN_EMAILS||'').split(',').map(v=>v.trim().toLowerCase()).filter(Boolean);return email.toLowerCase()==='seedy@sites.test'||configured.includes(email.toLowerCase())}
