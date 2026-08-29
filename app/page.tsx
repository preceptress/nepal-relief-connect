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

export default function Home(){return <main>
  <nav className="topbar">
    <a className="brand" href="#top"><span className="brand-mark">♡</span><span><strong>NEPAL RELIEF CONNECT</strong><small>CODES WITH CONSCIENCE</small></span></a>
    <div className="navlinks"><a href="#top">HOME</a><a href="#needs">I NEED HELP</a><a href="#help">I CAN HELP</a><a href="#resources">RESOURCES</a><a href="#updates">UPDATES</a><a href="#about">ABOUT</a></div>
    <div className="nav-actions"><span className="prelaunch"><i/> PRE-LAUNCH</span><button>EN⌄</button><button className="alert">DATA CONNECTION PENDING</button></div>
  </nav>

  <div className="demo-banner"><b>PRE-LAUNCH PREVIEW</b><span>No live operational data is connected. All verified feeds currently show zero.</span></div>

  <header className="hero" id="top">
    <div className="hero-copy"><div className="eyebrow">DISASTER RESPONSE · NEPAL · PRE-LAUNCH</div><h1>TOGETHER FOR NEPAL <span>🇳🇵</span></h1><h3>Connect. Coordinate. Save Lives.</h3><p>A coordination platform being prepared to connect people in need<br/>with verified people and organizations who can help.</p><div className="hero-buttons"><a href="#needs" className="red-button">♧ <span><b>I NEED HELP</b><small>Preview Request Options</small></span></a><a href="#help" className="green-button">♡ <span><b>I CAN HELP</b><small>Preview Support Options</small></span></a></div></div>
    <section className="situation pending" id="updates"><div className="situation-head"><span><b>SITUATION DATA</b><small>AWAITING FIRST VERIFIED UPDATE</small></span><em>○ NOT LIVE</em></div><div className="stats"><div><span className="red">♧</span><small>People in Need</small><b>0</b></div><div><span className="blue">⌖</span><small>Active Requests</small><b>0</b></div><div><span className="green">✓</span><small>Help Provided</small><b>0</b></div><div><span className="orange">♙</span><small>Verified Volunteers</small><b>0</b></div></div><p><b>Status:</b> No verified incident reports or operational feeds are connected yet.</p><span className="report-pending">Situation reports will appear after source verification.</span></section>
    <div className="helpline"><b>Important:</b> This site is not yet an emergency service. For immediate danger, contact verified local emergency services. Helpline numbers are pending confirmation.</div>
  </header>

  <div className="dashboard"><div className="top-grid"><div id="needs"><ActionPanel kind="need"/></div><div id="help"><ActionPanel kind="help"/></div>
    <section className="panel map-panel" id="resources"><h2>♧ LIVE NEEDS MAP <small className="pending-chip">NOT CONNECTED</small></h2><div className="map empty-map"><span className="city kathmandu">Kathmandu</span><span className="city pokhara">Pokhara</span><span className="city lalitpur">Lalitpur</span><span className="river"/><div className="map-empty"><b>0 verified locations</b><span>Map markers will appear after reports are reviewed and approved.</span></div><div className="zoom">+<hr/>−</div></div><div className="legend muted"><span>● Medical</span><span>● Food/Water</span><span>● Shelter</span><span>● Rescue</span><span>● Other</span></div></section>
    <section className="panel family-panel disabled-panel"><h2>♟ FAMILY REUNIFICATION <small className="pending-chip">COMING SOON</small></h2><div className="tabs"><b>I&apos;M LOOKING FOR SOMEONE</b><span>I WANT TO BE FOUND</span></div><label>Name of Missing Person<input disabled placeholder="Intake not active"/></label><label>Last Seen Location<input disabled placeholder="Intake not active"/></label><label>Any other details<input disabled placeholder="Intake not active"/></label><button disabled>SEARCH INTAKE NOT YET ACTIVE</button></section>
  </div>

  <div className="bottom-grid">
    <section className="panel feed-panel"><h2>▣ REAL-TIME FEED</h2><div className="empty-state"><i>○</i><b>No verified reports yet</b><span>Updates will appear here only after a trusted source or authorized coordinator verifies them.</span><small>Last updated: Not yet available</small></div></section>
    <section className="panel how-panel"><h2>HOW IT WILL WORK</h2><div className="steps"><div><i>▤</i><b>1. Submit</b><small>A request or offer<br/>is received</small></div><em>→</em><div><i>♙</i><b>2. Verify</b><small>Coordinators review<br/>the information</small></div><em>→</em><div><i>✓</i><b>3. Publish</b><small>Verified information<br/>becomes visible</small></div></div></section>
    <section className="panel org-panel empty-org"><h2>VERIFIED ORGANIZATIONS</h2><div className="empty-state"><i>○</i><b>0 verified partners</b><span>Organizations will be listed only after identity and authorization checks.</span></div></section>
    <section className="panel share-panel"><h2>CONNECT & SHARE</h2><p>Sharing tools will be enabled after verified feeds are active.</p><div className="socials disabled-socials"><i>f</i><i>♥</i><i>☏</i><i>◎</i><i>✉</i></div><div className="broadcast pending-broadcast"><b>○</b><span>Automated broadcasting is not connected.<br/>No updates are currently being distributed.</span></div></section>
  </div></div>

  <footer id="about"><div><b>○</b><span><strong>Pre-launch system</strong><small>Live connections are pending.</small></span></div><div><b>◇</b><span><strong>Codes with Conscience</strong><small>Technology with humanity at heart.</small></span></div><div><b>♙</b><span><strong>Verification first</strong><small>No unverified relief data is published.</small></span></div></footer>
</main>}
