import {headers} from 'next/headers';
/* eslint-disable @next/next/no-html-link-for-pages */
import {ensureSchema,isAdmin,StoryRow} from '@/db';
import ManageStories from './ManageStories';

export const dynamic='force-dynamic';
export default async function ManagePage(){const requestHeaders=await headers();const email=requestHeaders.get('oai-authenticated-user-email');if(!email)return <main className="review-gate"><h1>Editorial sign-in required</h1><p>Sign in with ChatGPT to open the story review desk.</p><a href="/signin-with-chatgpt?return_to=/stories/manage">SIGN IN WITH CHATGPT</a></main>;if(!isAdmin(email))return <main className="review-gate"><h1>Editorial access only</h1><p>This account is not on the Nepal Relief Connect editorial list.</p><a href="/">RETURN HOME</a></main>;const DB=await ensureSchema();const result=await DB.prepare('SELECT * FROM stories ORDER BY created_at DESC').all<StoryRow>();return <ManageStories initialStories={result.results}/>}
