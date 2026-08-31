import StoryMagazine from './StoryMagazine';
import ChatWidget from './ChatWidget';
import {ensureSchema,OperationRow} from '@/db';

export const dynamic='force-dynamic';

const needItems = [['✚','Medical Assistance'],['♜','Food & Water'],['⌂','Shelter'],['♧','Clothing'],['♨','Rescue / Evacuation'],['⊕','Other Needs']];
const helpItems = [['♙','Volunteer On-Site'],['♧','Donate Funds'],['♜','Donate Supplies'],['♧','Share Skills'],['▣','Transport / Logistics'],['◇','Other Ways to Help']];

function ActionPanel({kind}:{kind:'need'|'help'}) {
  const isNeed=kind==='need';
  const items=isNeed?needItems:helpItems;
  return <section className={`panel action-panel ${kind}`}>
    <h2><span>{isNeed?'♧':'♡'}</span>{isNeed?'I NEED HELP':'I CAN HELP'}</h2>
    <p>{isNeed?'Request intake is being prepared.':'Volunteer intake is being prepared.'}</p>
    <div className="action-list">{items.map(([icon,label])=><button disabled key={label}><b>{icon}</b>{label}</button>)}</div>
    <button className="primary-action" disabled>{isNeed?'REQUESTS OPENING SOON':'OFFERS OPENING SOON'}</button>
    <small className="panel-notice">Preview only · Submissions are not yet active</small>
  </section>;
}

export default async function Home(){
  const DB=await ensureSchema();
  const result=await DB.prepare("SELECT * FROM operations_records WHERE status IN ('published','resolved') ORDER BY published_at DESC, updated_at DESC").all<OperationRow>();
  const published=result.results;
  const byType=(type:string)=>published.filter(r=>r.record_type===type);
  const requestRecords=byType('request'),offerRecords=byType('offer'),mapRecords=published.filter(r=>(r.record_type==='map'||r.record_type==='request')&&r.latitude!==null&&r.longitude!==null),feedRecords=published.filter(r=>['request','offer','update','alert'].includes(r.record_type)).slice(0,4),organizations=byType('organization').slice(0,4),latestUpdate=published.find(r=>r.record_type==='update'||r.record_type==='alert');
  const peopleInNeed=requestRecords.reduce((n,r)=>n+r.people_count,0),volunteers=offerRecords.reduce((n,r)=>n+r.people_count,0),hasLive=published.length>0;
  return <main>
  <nav className="topbar">
    <a className="brand" href="#top"><span className="brand-mark">♡</span><span><strong>NEPAL RELIEF CONNECT</strong><small>CODES WITH CONSCIENCE</small></span></a>
    <div className="navlinks"><a href="#top">HOME</a><a href="#needs">I NEED HELP</a><a href="#help">I CAN HELP</a><a href="#resources">RESOURCES</a><a href="#updates">UPDATES</a><a href="#about">ABOUT</a></div>
    <div className="nav-actions"><span className={hasLive?'online':'prelaunch'}><i/> {hasLive?'NETWORK ONLINE':'PRE-LAUNCH'}</span><button>EN⌄</button><a className="alert-nav-link" href="#updates">♧ EMERGENCY ALERTS</a><a className="admin-nav-link" href="/admin">ADMIN PREVIEW</a></div>
  </nav>

  <div className={hasLive?'demo-banner live-data-banner':'demo-banner'}><b>{hasLive?'VERIFIED FEED':'PRE-LAUNCH PREVIEW'}</b><span>{hasLive?'This page displays records published by authorized coordinators.':'No live operational data is connected. All verified feeds currently show zero.'}</span></div>

  <header className="hero" id="top">
    <div className="hero-copy"><div className="eyebrow">DISASTER RESPONSE · NEPAL · PRE-LAUNCH</div><h1>TOGETHER FOR NEPAL <span>🇳🇵</span></h1><h3>Connect. Coordinate. Save Lives.</h3><p>A coordination platform being prepared to connect people in need<br/>with verified people and organizations who can help.</p><div className="hero-buttons"><a href="#needs" className="red-button">♧ <span><b>I NEED HELP</b><small>Preview Request Options</small></span></a><a href="#help" className="green-button">♡ <span><b>I CAN HELP</b><small>Preview Support Options</small></span></a></div></div>
    <section className={hasLive?'situation':'situation pending'} id="updates"><div className="situation-head"><span><b>LIVE SITUATION UPDATE</b><small>{latestUpdate?`UPDATED ${new Date(latestUpdate.updated_at).toLocaleString()}`:'AWAITING FIRST VERIFIED UPDATE'}</small></span><em>{hasLive?'● VERIFIED':'○ NOT LIVE'}</em></div><div className="stats"><div><span className="red">♧</span><small>People in Need</small><b>{peopleInNeed.toLocaleString()}</b></div><div><span className="blue">⌖</span><small>Active Requests</small><b>{requestRecords.length}</b></div><div><span className="green">✓</span><small>Help Provided</small><b>{published.filter(r=>r.status==='resolved').length}</b></div><div><span className="orange">♙</span><small>Verified Volunteers</small><b>{volunteers.toLocaleString()}</b></div></div><p><b>Latest update:</b> {latestUpdate?latestUpdate.description||latestUpdate.title:'No verified incident reports or operational feeds are connected yet.'}</p><span className="report-pending">{hasLive?'Only coordinator-approved records are shown.':'Situation reports will appear after source verification.'}</span></section>
    <div className="helpline"><b>Important:</b> This site is not yet an emergency service. For immediate danger, contact verified local emergency services. Helpline numbers are pending confirmation.</div>
  </header>

  <div className="dashboard"><div className="top-grid"><div id="needs"><ActionPanel kind="need"/></div><div id="help"><ActionPanel kind="help"/></div>
    <section className="panel map-panel" id="resources"><h2>♧ LIVE NEEDS MAP <small className="pending-chip">{mapRecords.length?`${mapRecords.length} VERIFIED`:'NOT CONNECTED'}</small></h2><div className={mapRecords.length?'map':'map empty-map'}><span className="city kathmandu">Kathmandu</span><span className="city pokhara">Pokhara</span><span className="city lalitpur">Lalitpur</span><span className="river"/>{mapRecords.map((r,i)=><i key={r.id} className={`pin ${r.record_type==='request'?'medical':'food'}`} style={{left:`${15+(i*17)%70}%`,top:`${18+(i*23)%65}%`}} title={`${r.title} — ${r.location}`}>{r.record_type==='request'?'✚':'⌖'}</i>)}{!mapRecords.length&&<div className="map-empty"><b>0 verified locations</b><span>Map markers will appear after reports are reviewed and approved.</span></div>}<div className="zoom">+<hr/>−</div></div><div className={mapRecords.length?'legend':'legend muted'}><span>● Medical</span><span>● Food/Water</span><span>● Shelter</span><span>● Rescue</span><span>● Other</span></div></section>
    <section className="panel family-panel disabled-panel"><h2>♟ FAMILY REUNIFICATION <small className="pending-chip">COMING SOON</small></h2><div className="tabs"><b>I&apos;M LOOKING FOR SOMEONE</b><span>I WANT TO BE FOUND</span></div><label>Name of Missing Person<input disabled placeholder="Intake not active"/></label><label>Last Seen Location<input disabled placeholder="Intake not active"/></label><label>Any other details<input disabled placeholder="Intake not active"/></label><button disabled>SEARCH INTAKE NOT YET ACTIVE</button></section>
  </div>

  <div className="bottom-grid">
    <section className="panel feed-panel"><h2>▣ REAL-TIME FEED</h2>{feedRecords.length?feedRecords.map(r=><div className={`feed-row ${r.record_type==='request'?'need-row':r.record_type==='offer'?'offer-row':'info-row'}`} key={r.id}><b>{r.record_type==='request'?'♧ NEED':r.record_type==='offer'?'⌖ OFFER':'⊙ INFO'}</b><span><strong>{r.title}</strong><small>{r.description}</small></span><time>{new Date(r.updated_at).toLocaleDateString()}<small>{r.location}</small></time></div>):<div className="empty-state"><i>○</i><b>No verified reports yet</b><span>Updates will appear here only after a trusted source or authorized coordinator verifies them.</span><small>Last updated: Not yet available</small></div>}</section>
    <section className="panel how-panel"><h2>HOW IT WILL WORK</h2><div className="steps"><div><i>▤</i><b>1. Submit</b><small>A request or offer<br/>is received</small></div><em>→</em><div><i>♙</i><b>2. Verify</b><small>Coordinators review<br/>the information</small></div><em>→</em><div><i>✓</i><b>3. Publish</b><small>Verified information<br/>becomes visible</small></div></div></section>
    <section className={organizations.length?'panel org-panel':'panel org-panel empty-org'}><h2>VERIFIED ORGANIZATIONS</h2>{organizations.length?organizations.map(r=><div key={r.id}><i>◆</i><span><b>{r.title}</b><small>{r.category||r.location}</small></span><em>✓</em></div>):<div className="empty-state"><i>○</i><b>0 verified partners</b><span>Organizations will be listed only after identity and authorization checks.</span></div>}</section>
    <section className="panel share-panel"><h2>CONNECT & SHARE</h2><p>Sharing tools will be enabled after verified feeds are active.</p><div className="socials disabled-socials"><i>f</i><i>♥</i><i>☏</i><i>◎</i><i>✉</i></div><div className="broadcast pending-broadcast"><b>○</b><span>Automated broadcasting is not connected.<br/>No updates are currently being distributed.</span></div></section>
  </div></div>

  <StoryMagazine/>
  <ChatWidget/>
  <footer id="about"><div><b>○</b><span><strong>Pre-launch system</strong><small>Live connections are pending.</small></span></div><div><b>◇</b><span><strong>Codes with Conscience</strong><small>Technology with humanity at heart.</small></span></div><div><b>♙</b><span><strong>Verification first</strong><small>No unverified relief data is published.</small></span></div></footer>
</main>}
