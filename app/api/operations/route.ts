import {NextResponse} from 'next/server';
import {ensureSchema,OperationRow} from '@/db';
export const dynamic='force-dynamic';
export async function GET(){const DB=await ensureSchema();const records=await DB.prepare("SELECT id,record_type,title,description,category,location,priority,status,latitude,longitude,people_count,source,updated_at,published_at FROM operations_records WHERE status = 'published' ORDER BY published_at DESC LIMIT 250").all<OperationRow>();return NextResponse.json({records:records.results})}
