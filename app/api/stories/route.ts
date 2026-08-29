import {NextRequest,NextResponse} from 'next/server';
import {bindings,ensureSchema,isAdmin,StoryRow} from '@/db';

export const dynamic='force-dynamic';
const categories=new Set(['Community','Resilience','Photo Essay','Voices','Response']);

export async function GET(request:NextRequest){
  const DB=await ensureSchema();
  const review=request.nextUrl.searchParams.get('review')==='1';
  const email=request.headers.get('oai-authenticated-user-email');
  if(review&&!isAdmin(email))return NextResponse.json({error:'Not authorized'},{status:403});
  const query=review?'SELECT * FROM stories ORDER BY created_at DESC':'SELECT * FROM stories WHERE status = ? ORDER BY published_at DESC, created_at DESC';
  const result=review?await DB.prepare(query).all<StoryRow>():await DB.prepare(query).bind('published').all<StoryRow>();
  return NextResponse.json({stories:result.results.map(s=>({...s,media_url:s.media_key?`/api/media/${encodeURIComponent(s.media_key)}`:null}))});
}

export async function POST(request:NextRequest){
  const form=await request.formData();
  const title=String(form.get('title')||'').trim().slice(0,120),body=String(form.get('body')||'').trim().slice(0,12000),location=String(form.get('location')||'').trim().slice(0,100),authorName=String(form.get('author_name')||'').trim().slice(0,100),authorEmail=String(form.get('author_email')||'').trim().slice(0,180),category=String(form.get('category')||'Community');
  if(!title||!body||!location||!authorName||!authorEmail||!categories.has(category)||form.get('consent')!=='on')return NextResponse.json({error:'Please complete every required field and confirm permission.'},{status:400});
  const id=crypto.randomUUID(),createdAt=new Date().toISOString(),userId=request.headers.get('oai-authenticated-user-id');
  let mediaKey:string|null=null,mediaType:string|null=null;
  const media=form.get('media');
  if(media instanceof File&&media.size>0){
    const allowed=['image/jpeg','image/png','image/webp','video/mp4','video/webm'];
    if(!allowed.includes(media.type))return NextResponse.json({error:'Please upload a JPG, PNG, WebP, MP4 or WebM file.'},{status:400});
    if(media.size>25*1024*1024)return NextResponse.json({error:'Media must be 25 MB or smaller.'},{status:400});
    const extension=(media.name.split('.').pop()||'bin').replace(/[^a-z0-9]/gi,'').toLowerCase();mediaKey=`stories/${id}.${extension}`;mediaType=media.type;
    await bindings().MEDIA.put(mediaKey,media.stream(),{httpMetadata:{contentType:media.type},customMetadata:{storyId:id}});
  }
  const DB=await ensureSchema(),excerpt=body.replace(/\s+/g,' ').slice(0,220);
  await DB.prepare('INSERT INTO stories (id,title,body,excerpt,category,location,author_name,author_email,author_user_id,media_key,media_type,status,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)').bind(id,title,body,excerpt,category,location,authorName,authorEmail,userId,mediaKey,mediaType,'pending',createdAt).run();
  return NextResponse.json({ok:true,id,status:'pending'},{status:201});
}

export async function PATCH(request:NextRequest){
  const email=request.headers.get('oai-authenticated-user-email');if(!isAdmin(email))return NextResponse.json({error:'Not authorized'},{status:403});
  const input=await request.json() as {id?:string;status?:string};if(!input.id||!['published','rejected','pending'].includes(input.status||''))return NextResponse.json({error:'Invalid update'},{status:400});
  const DB=await ensureSchema(),publishedAt=input.status==='published'?new Date().toISOString():null;
  await DB.prepare('UPDATE stories SET status = ?, published_at = ? WHERE id = ?').bind(input.status,publishedAt,input.id).run();
  return NextResponse.json({ok:true});
}
