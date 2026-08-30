import {headers} from 'next/headers';
import {isAdmin} from '@/db';
import AdminConsole from './AdminConsole';
export const dynamic='force-dynamic';
export default async function AdminPage(){const requestHeaders=await headers();const email=requestHeaders.get('oai-authenticated-user-email')||(process.env.NODE_ENV==='development'?'seedy@sites.test':null);if(!email)return <main className="review-gate"><h1>Command-center sign-in</h1><p>Sign in with ChatGPT to access Nepal Relief Connect operations.</p><a href="/signin-with-chatgpt?return_to=/admin">SIGN IN WITH CHATGPT</a></main>;if(!isAdmin(email))return <main className="review-gate"><h1>Administrator access only</h1><p>This account is not on the command-center allowlist.</p><a href="/">RETURN HOME</a></main>;return <AdminConsole adminEmail={email}/>}
