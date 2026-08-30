'use client';

import {FormEvent,useEffect,useRef,useState} from 'react';

type Message={role:'user'|'assistant';content:string};

export default function ChatWidget(){
  const [open,setOpen]=useState(false),[messages,setMessages]=useState<Message[]>([{role:'assistant',content:'Namaste. I’m the Nepal Relief Connect AI assistant. How can I help?'}]),[input,setInput]=useState(''),[sending,setSending]=useState(false),[humanAvailable,setHumanAvailable]=useState(false),[notice,setNotice]=useState('');
  const endRef=useRef<HTMLDivElement>(null);
  useEffect(()=>{fetch('/api/chat').then(response=>response.ok?response.json():null).then(data=>setHumanAvailable(Boolean(data?.humanAvailable))).catch(()=>{});},[]);
  useEffect(()=>{endRef.current?.scrollIntoView({behavior:'smooth'});},[messages,notice]);
  const send=async(event:FormEvent)=>{
    event.preventDefault();const text=input.trim();if(!text||sending)return;
    const next=[...messages,{role:'user' as const,content:text}];setMessages(next);setInput('');setSending(true);setNotice('');
    const response=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:next,mode:'ai'})});
    const data=await response.json().catch(()=>({})) as {message?:string;error?:string;humanAvailable?:boolean};
    setMessages(current=>[...current,{role:'assistant',content:data.message||data.error||'Chat is temporarily unavailable.'}]);
    setHumanAvailable(Boolean(data.humanAvailable));setSending(false);
  };
  const requestHuman=async()=>{
    setNotice('Checking coordinator availability…');
    const response=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({mode:'human'})});
    const data=await response.json().catch(()=>({})) as {message?:string;humanAvailable?:boolean;supportUrl?:string|null};
    setHumanAvailable(Boolean(data.humanAvailable));setNotice(data.message||'Human support is unavailable right now.');
    if(data.humanAvailable&&data.supportUrl)window.open(data.supportUrl,'_blank','noopener,noreferrer');
  };
  return <div className={`help-chat ${open?'open':''}`}>
    {open&&<section className="chat-panel" role="dialog" aria-label="Nepal Relief Connect chat">
      <header><div><span className="chat-avatar">✦</span><span><b>RELIEF CHAT</b><small><i/> AI ONLINE · {humanAvailable?'HUMAN AVAILABLE':'HUMAN OFFLINE'}</small></span></div><button onClick={()=>setOpen(false)} aria-label="Close chat">×</button></header>
      <div className="chat-safety">For immediate danger, contact verified local emergency services.</div>
      <div className="chat-messages" aria-live="polite">{messages.map((message,index)=><div className={`chat-message ${message.role}`} key={index}><small>{message.role==='assistant'?'AI ASSISTANT':'YOU'}</small><p>{message.content}</p></div>)}{sending&&<div className="chat-typing">AI is responding <span>•••</span></div>}{notice&&<div className="chat-notice">{notice}</div>}<div ref={endRef}/></div>
      <button className="human-handoff" onClick={requestHuman}><span>♙</span><b>{humanAvailable?'TALK TO A HUMAN':'CHECK FOR A HUMAN'}</b></button>
      <form onSubmit={send}><input value={input} onChange={event=>setInput(event.target.value)} placeholder="Ask how we can help…" maxLength={2000} aria-label="Chat message"/><button disabled={sending||!input.trim()} aria-label="Send message">↑</button></form>
      <footer>AI responses may be inaccurate. Verify critical information.</footer>
    </section>}
    <button className="chat-launcher" onClick={()=>setOpen(value=>!value)} aria-label={open?'Close chat':'Open AI and human support chat'}><span>{open?'×':'✦'}</span><b>{open?'CLOSE':'CHAT WITH US'}</b><i/></button>
  </div>;
}
