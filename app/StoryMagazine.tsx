'use client';

import {FormEvent, useEffect, useMemo, useState} from 'react';

type Story={id:string;title:string;excerpt:string;category:string;location:string;date:string;image:string;credit:string;creditUrl:string;featured?:boolean;video?:boolean};

const placeholderStories:Story[]=[
  {id:'mountain-mothers',title:'In the high hills, mothers build a circle of care',excerpt:'A community gathering becomes a place to share knowledge, meals and the quiet work of looking after one another.',category:'Community',location:'Sindhupalchowk',date:'2026-08-28',image:'/story-mothers.jpg',credit:'People in Need Nepal',creditUrl:'https://nepal.peopleinneed.net/en/our-work/civil-society-inclusive-governance',featured:true},
  {id:'jumla-table',title:'A table long enough for the whole village',excerpt:'Food, conversation and plans for the next harvest bring neighbors together in Jumla.',category:'Resilience',location:'Jumla',date:'2026-08-26',image:'/story-community.jpg',credit:'Visible Impact',creditUrl:'https://visibleimpact.org/projects/1506-jumla-sinja-development-project/show/embed-summary'},
  {id:'humla-road',title:'Two days from the nearest road, life keeps moving',excerpt:'Families in Humla share what it means to make a home where every journey takes patience.',category:'Photo Essay',location:'Humla',date:'2026-08-24',image:'/story-humla.jpg',credit:'Nepali Times',creditUrl:'https://nepalitimes.com/life-and-livelihood-in-remote-nepal'},
  {id:'voices-radio',title:'The radio station keeping local voices on air',excerpt:'Community broadcasters carry language, weather and messages across the hills when other connections fail.',category:'Voices',location:'Eastern Nepal',date:'2026-08-22',image:'/story-radio.jpg',credit:'ACORAB Nepal',creditUrl:'https://www.acorab.org.np/detail/community-radios-as-guardians-of-indigenous-languages--dialects',video:true},
  {id:'neighbors-first',title:'When neighbors are the first responders',excerpt:'Before formal help arrives, local knowledge and small acts of courage hold a community together.',category:'Response',location:'Gorkha',date:'2026-08-20',image:'/story-community.jpg',credit:'Visible Impact',creditUrl:'https://visibleimpact.org/projects/1506-jumla-sinja-development-project/show/embed-summary'},
];

function StoryVisual({story}:{story:Story}){return <div className="story-image">{story.video&&story.image.startsWith('/api/media/')?<video src={story.image} controls preload="metadata"/>:<img src={story.image} alt="Nepal community story"/>}<span>{story.category}</span>{story.video&&<i>▶ VIDEO</i>}</div>}

export default function StoryMagazine(){
  const [published,setPublished]=useState<Story[]>([]);
  const [category,setCategory]=useState('All stories');
  const [sort,setSort]=useState('Newest');
  const [showForm,setShowForm]=useState(false);
  const [message,setMessage]=useState('');
  useEffect(()=>{fetch('/api/stories').then(async r=>r.ok?await r.json() as {stories?:Array<{id:string;title:string;excerpt:string;category:string;location:string;published_at?:string;created_at:string;media_url?:string;author_name:string;media_type?:string}>}:{stories:[]}).then(data=>setPublished((data.stories||[]).map(s=>({id:s.id,title:s.title,excerpt:s.excerpt,category:s.category,location:s.location,date:s.published_at||s.created_at,image:s.media_url||'/story-community.jpg',credit:`Submitted by ${s.author_name}`,creditUrl:'#',video:s.media_type?.startsWith('video/')})))).catch(()=>{});},[]);
  const stories=useMemo(()=>{
    const all=[...published,...placeholderStories];const filtered=category==='All stories'?all:all.filter(s=>s.category===category);
    return [...filtered].sort((a,b)=>sort==='Newest'?b.date.localeCompare(a.date):sort==='Oldest'?a.date.localeCompare(b.date):a.location.localeCompare(b.location));
  },[category,sort,published]);
  const featured=stories.find(s=>s.featured)||stories[0];
  const rest=stories.filter(s=>s.id!==featured?.id);
  const submit=async(e:FormEvent<HTMLFormElement>)=>{
    e.preventDefault();setMessage('Sending your story…');
    const response=await fetch('/api/stories',{method:'POST',body:new FormData(e.currentTarget)});
    const data=await response.json().catch(()=>({})) as {error?:string};
    setMessage(response.ok?'Thank you. Your story is in the review queue.':data.error||'We could not send this story yet.');
    if(response.ok)e.currentTarget.reset();
  };
  return <section className="magazine" id="stories">
    <header className="magazine-masthead"><div><span>THE HUMAN STORY</span><h2>Stories from Nepal</h2><p>People, places and the moments behind every request for help.</p></div><div className="masthead-actions"><a href="/admin">ADMIN CONTROL</a><button onClick={()=>setShowForm(true)}>＋ SHARE YOUR STORY</button></div></header>
    <div className="story-toolbar"><div className="story-tabs">{['All stories','Community','Resilience','Photo Essay','Voices','Response'].map(c=><button className={category===c?'active':''} onClick={()=>setCategory(c)} key={c}>{c}</button>)}</div><label>Sort <select value={sort} onChange={e=>setSort(e.target.value)}><option>Newest</option><option>Oldest</option><option>Location</option></select></label></div>
    {featured?<div className="story-layout"><article className="lead-story"><StoryVisual story={featured}/><div className="lead-copy"><small>{featured.location} · {new Date(featured.date).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}</small><h3>{featured.title}</h3><p>{featured.excerpt}</p><button>READ THE STORY →</button>{featured.creditUrl!=='#'&&<a href={featured.creditUrl} target="_blank" rel="noreferrer">Placeholder photo: {featured.credit}</a>}</div></article><div className="story-grid">{rest.map(story=><article className="story-card" key={story.id}><StoryVisual story={story}/><small>{story.location} · {new Date(story.date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</small><h3>{story.title}</h3><p>{story.excerpt}</p><div><button>MORE →</button>{story.creditUrl!=='#'&&<a href={story.creditUrl} target="_blank" rel="noreferrer">Photo credit</a>}</div></article>)}</div></div>:<div className="no-stories">No stories in this category yet.</div>}
    <div className="story-callout"><div><span>YOUR VOICE MATTERS</span><h3>Help the world see the human side of Nepal.</h3><p>Share a story, photograph or short video. Every submission is reviewed before publication to protect contributors and preserve trust.</p></div><button onClick={()=>setShowForm(true)}>SUBMIT A STORY</button></div>
    {showForm&&<div className="story-modal" role="dialog" aria-modal="true" aria-label="Share your story"><form onSubmit={submit}><button type="button" className="modal-close" onClick={()=>setShowForm(false)}>×</button><span>CONTRIBUTE</span><h3>Share your story</h3><p>Submissions are private until reviewed by the Nepal Relief Connect editorial team.</p><div className="form-grid"><label>Your name<input name="author_name" required/></label><label>Email<input name="author_email" type="email" required/></label><label>Story headline<input name="title" required maxLength={120}/></label><label>Location<input name="location" required/></label><label>Category<select name="category"><option>Community</option><option>Resilience</option><option>Photo Essay</option><option>Voices</option><option>Response</option></select></label><label>Photo or short video<input name="media" type="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"/></label></div><label>Your story<textarea name="body" required rows={7}/></label><label className="consent"><input name="consent" type="checkbox" required/> I have permission to share this story and any people shown in the media.</label><button className="submit-story" type="submit">SEND FOR REVIEW</button>{message&&<div className="form-message">{message}</div>}</form></div>}
  </section>;
}
