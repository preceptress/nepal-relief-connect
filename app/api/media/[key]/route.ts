import {NextRequest,NextResponse} from 'next/server';
import {bindings,ensureSchema} from '@/db';

export const dynamic='force-dynamic';
export async function GET(_request:NextRequest,{params}:{params:Promise<{key:string}>}){const {key}=await params;const mediaKey=decodeURIComponent(key);const DB=await ensureSchema();const story=await DB.prepare('SELECT status FROM stories WHERE media_key = ?').bind(mediaKey).first<{status:string}>();if(!story||story.status!=='published')return new NextResponse('Not found',{status:404});const object=await bindings().MEDIA.get(mediaKey);if(!object)return new NextResponse('Not found',{status:404});const headers=new Headers();object.writeHttpMetadata(headers);headers.set('Cache-Control','public, max-age=3600');return new NextResponse(object.body,{headers});}
