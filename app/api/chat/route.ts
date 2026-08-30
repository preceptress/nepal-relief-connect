import {NextRequest,NextResponse} from 'next/server';

export const dynamic='force-dynamic';

type ChatMessage={role:'user'|'assistant';content:string};

const humanAvailable=()=>process.env.HUMAN_CHAT_AVAILABLE==='true'&&Boolean(process.env.HUMAN_SUPPORT_URL);

export async function GET(){
  return NextResponse.json({humanAvailable:humanAvailable()});
}

export async function POST(request:NextRequest){
  const body=await request.json().catch(()=>({})) as {messages?:ChatMessage[];mode?:'ai'|'human'};
  if(body.mode==='human'){
    const available=humanAvailable();
    return NextResponse.json({
      humanAvailable:available,
      message:available?'A human coordinator is available. Opening the secure human-support channel now.':'No human coordinator is online right now. The AI assistant can still help with general information.',
      supportUrl:available?process.env.HUMAN_SUPPORT_URL:null,
    });
  }

  const messages=(body.messages||[]).filter(message=>message&&['user','assistant'].includes(message.role)&&typeof message.content==='string').slice(-10).map(message=>({role:message.role,content:message.content.slice(0,2000)}));
  if(!messages.length)return NextResponse.json({error:'Please enter a message.'},{status:400});
  if(!process.env.OPENAI_API_KEY)return NextResponse.json({error:'The AI assistant is not configured yet.'},{status:503});

  const response=await fetch('https://api.openai.com/v1/responses',{
    method:'POST',
    headers:{'Authorization':`Bearer ${process.env.OPENAI_API_KEY}`,'Content-Type':'application/json'},
    body:JSON.stringify({
      model:process.env.OPENAI_CHAT_MODEL||'gpt-5.4-mini',
      instructions:'You are the Nepal Relief Connect AI assistant. Be calm, concise, compassionate, and practical. Help visitors understand this site, relief resources, volunteering, story submissions, and how to seek verified support. Never claim to be a human or emergency service. Never invent live incident data, helpline numbers, availability, organizations, or guarantees. Clearly say when information is unverified. If someone may be in immediate danger, tell them to contact verified local emergency services and trusted people nearby. Keep answers under 140 words unless the visitor asks for detail.',
      input:messages,
      max_output_tokens:350,
      store:false,
    }),
  });
  const data=await response.json().catch(()=>({})) as {output_text?:string;output?:Array<{content?:Array<{type?:string;text?:string}>}>;error?:{message?:string}};
  if(!response.ok)return NextResponse.json({error:data.error?.message||'The AI assistant is temporarily unavailable.'},{status:502});
  const answer=data.output_text||data.output?.flatMap(item=>item.content||[]).find(item=>item.type==='output_text')?.text;
  return NextResponse.json({message:answer||'I could not produce a response. Please try again.',humanAvailable:humanAvailable()});
}
