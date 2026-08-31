import {headers} from 'next/headers';
import {isAdmin} from '@/db';
import AdminConsole from './AdminConsole';
import AdminPreview from './AdminPreview';
export const dynamic='force-dynamic';
export default async function AdminPage(){const requestHeaders=await headers();const email=requestHeaders.get('oai-authenticated-user-email')||(process.env.NODE_ENV==='development'?'seedy@sites.test':null);if(!email)return <AdminPreview/>;if(!isAdmin(email))return <AdminPreview accessDenied/>;return <AdminConsole adminEmail={email}/>}
