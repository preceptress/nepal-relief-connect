import Link from 'next/link';
/* eslint-disable @next/next/no-img-element */

const previewRecords=[
  {type:'REQUEST',title:'Verified relief request',location:'Sindhupalchowk',status:'PUBLISHED',tone:'red'},
  {type:'UPDATE',title:'Community situation update',location:'Kathmandu',status:'VERIFIED',tone:'blue'},
  {type:'ORGANIZATION',title:'Local response partner',location:'Pokhara',status:'PENDING',tone:'green'},
];

export default function AdminPreview({accessDenied=false}:{accessDenied?:boolean}){
  return <main className="admin-preview">
    <nav className="preview-nav"><Link href="/">♡ <b>NEPAL RELIEF CONNECT</b></Link><span>READ-ONLY ADMIN PREVIEW</span><Link className="preview-back" href="/">← RETURN TO SITE</Link></nav>
    <header className="preview-hero">
      <div><span>BEHIND THE PUBLIC SITE</span><h1>See how information is reviewed before it appears.</h1><p>This visual tour shows the coordinator and editorial tools. It contains sample content only—nothing here can be edited, submitted, or published.</p><div className="preview-actions"><a href="#preview-dashboard">EXPLORE THE PREVIEW ↓</a><a className="coordinator-login" href="/signin-with-chatgpt?return_to=/admin">COORDINATOR SIGN IN</a></div>{accessDenied&&<div className="preview-denied">Your signed-in account is not on the coordinator allowlist. You can still explore this read-only preview.</div>}</div>
      <div className="preview-collage" aria-label="Nepal community photographs"><img src="/story-mothers.jpg" alt="Nepal community story preview"/><img src="/story-community.jpg" alt="Nepal community gathering preview"/><img src="/story-humla.jpg" alt="Nepal landscape and community preview"/></div>
    </header>
    <section className="preview-section" id="preview-dashboard"><span>01 · OPERATIONS</span><h2>A coordinator dashboard built around verification.</h2><p>Authorized teams can organize requests, offers, updates, alerts, organizations and map records before choosing what becomes public.</p>
      <div className="preview-admin-frame">
        <aside><b>♡ NRC</b>{['Overview','Requests','Offers','Updates','Organizations','Stories','System'].map((item,index)=><i className={index===0?'active':''} key={item}>{item}</i>)}</aside>
        <div className="preview-admin-main"><header><div><small>OPERATIONS COMMAND CENTER</small><b>Dashboard overview</b></div><button disabled>＋ NEW RECORD</button></header><div className="preview-metrics">{[['0','Active requests'],['0','Published offers'],['0','Pending review'],['0','Verified partners']].map(([value,label])=><article key={label}><b>{value}</b><small>{label}</small></article>)}</div><section><div className="preview-table-head"><b>RECENT RECORDS</b><span>TYPE</span><span>STATUS</span></div>{previewRecords.map(record=><div className="preview-table-row" key={record.title}><i className={record.tone}>◆</i><span><b>{record.title}</b><small>{record.location}</small></span><em>{record.type}</em><strong>{record.status}</strong></div>)}</section></div>
        <div className="readonly-seal">VIEW ONLY</div>
      </div>
    </section>
    <section className="preview-section editorial-preview"><span>02 · EDITORIAL REVIEW</span><h2>Stories remain private until an editor approves them.</h2><p>Submitted photographs and stories enter a moderation queue. The public media route serves an upload only after publication.</p><div className="preview-story-grid">{[
        ['/story-mothers.jpg','Community','A story waiting for review'],
        ['/story-radio.jpg','Voices','Local voices and connection'],
        ['/story-humla.jpg','Photo Essay','Life across remote Nepal'],
      ].map(([image,category,title])=><article key={title}><img src={image} alt="Story review preview"/><div><small>{category}</small><h3>{title}</h3><p>Sample editorial content for demonstration only.</p><button disabled>REVIEW DISABLED</button></div></article>)}</div></section>
    <section className="preview-explainer"><div><span>WHAT VISITORS CAN DO</span><h2>Explore without changing anything.</h2></div><div className="preview-rules"><p><b>✓ View</b> dashboard examples and editorial workflows</p><p><b>✓ Understand</b> how verification protects public information</p><p><b>× Edit</b> records, stories, priorities or publication status</p><p><b>× Access</b> private contacts, submissions or uploaded media</p></div></section>
    <footer className="preview-footer"><p><b>Need the real console?</b> Authorized coordinators can sign in with an allowlisted account.</p><a href="/signin-with-chatgpt?return_to=/admin">COORDINATOR SIGN IN →</a></footer>
  </main>;
}
