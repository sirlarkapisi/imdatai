import { useState, useEffect, useRef } from "react";

// ── CHATBOT — Gemini API ──────────────────────────────────
const WORKER_URL = "https://imdatai-gemini.imdatuysal.workers.dev"; // Worker kurulunca bu URL aktif olur

async function askGemini(msg, history=[]){
  try {
    const r = await fetch(`${WORKER_URL}/chat`, {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({
        message: msg,
        history: history.slice(-8),
        system: "Sen IMDATAI'nin Türkçe AI asistanısın. Yapay zeka, araçlar (ChatGPT, Claude, Gemini), prompt teknikleri ve IMDATAI sitesi hakkında kısa, net, faydalı cevaplar ver. Max 3-4 cümle. Emoji kullan. Samimi ol."
      })
    });
    if(!r.ok) throw new Error("API hatası");
    const d = await r.json();
    return d.response || "Bir sorun oluştu, tekrar dene.";
  } catch(e) {
    return "🔧 AI asistan şu an bakımda. Lütfen daha sonra tekrar dene veya doğrudan claude.ai ya da gemini.google.com'u kullan!";
  }
}

function SocialMediaSection(){
  const VIDS=[
    {title:"ChatGPT vs Claude vs Gemini 2026",cat:"Karşılaştırma",thumb:"https://img.youtube.com/vi/ZKOKP9jfAMg/mqdefault.jpg",url:"https://youtu.be/ZKOKP9jfAMg",dur:"18:42",color:"#ff4444",platform:"YouTube"},
    {title:"AI ile 30sn'de Profesyonel Email",cat:"Shorts",thumb:"https://img.youtube.com/vi/5UgwO4rbfNM/mqdefault.jpg",url:"https://youtube.com/shorts/5UgwO4rbfNM",dur:"0:45",color:"#ff4444",platform:"YouTube Shorts"},
    {title:"Claude ile İçerik Üretimi",cat:"TikTok Video",url:"https://vt.tiktok.com/ZS9oTcvee/",dur:"1:12",color:"#00f2ea",platform:"TikTok",emoji:"🎵"},
    {title:"2026 AI Araçları İnfografiği",cat:"Instagram Reel",url:"https://www.instagram.com/reel/DX8i6_wtPxf/",dur:"Reel",color:"#e1306c",platform:"Instagram",emoji:"📸"},
  ];
  return <section style={{padding:"0 20px 48px",background:"rgba(0,0,0,0.1)"}}>
    <div style={{maxWidth:960,margin:"0 auto",paddingTop:32}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:12}}>
        <div><div style={{fontSize:9,letterSpacing:".2em",color:"#f472b6",marginBottom:4}}>SOSYAL MEDYA</div><div style={{fontSize:20,fontWeight:800,color:"#e2e8f0",fontFamily:"Space Grotesk,sans-serif"}}>📱 IMDATAI Kanallarımız</div></div>
        <div style={{display:"flex",gap:8}}>
          {[["🎬","https://youtube.com/@imdatai","#ff4444"],["🎵","https://tiktok.com/@imdatai","#00f2ea"],["📸","https://instagram.com/imdatai","#e1306c"]].map(([e,u,c])=>(
            <a key={e} href={u} target="_blank" rel="noopener noreferrer" style={{width:36,height:36,borderRadius:9,background:c+"20",border:"1px solid "+c+"40",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,textDecoration:"none"}}>{e}</a>
          ))}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:14}}>
        {VIDS.map((v,i)=>(
          <a key={i} href={v.url} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none",display:"block",borderRadius:12,overflow:"hidden",border:"1px solid "+v.color+"25",background:"rgba(0,0,0,0.3)",transition:"all .2s"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.borderColor=v.color+"60";}} onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.borderColor=v.color+"25";}}>
            {v.thumb
              ?<div style={{position:"relative",paddingTop:"56.25%",background:"rgba(0,0,0,0.4)"}}>
                <img src={v.thumb} alt={v.title} style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",objectFit:"cover"}} onError={e=>{e.target.style.display="none";e.target.parentElement.innerHTML+='<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:36px;color:rgba(255,68,68,0.8)">▶</div>';}}/>
                <div style={{position:"absolute",bottom:6,right:6,background:"rgba(0,0,0,0.85)",color:"#fff",fontSize:9,padding:"2px 5px",borderRadius:3,fontFamily:"monospace"}}>{v.dur}</div>
                <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.15)"}}>
                  <div style={{width:40,height:40,background:"rgba(255,0,0,0.85)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>▶</div>
                </div>
              </div>
              :<div style={{height:130,background:"linear-gradient(135deg,"+v.color+"25,rgba(0,0,0,0.4))",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:8}}>
                <span style={{fontSize:40}}>{v.emoji}</span>
                <span style={{fontSize:10,color:v.color,fontWeight:700}}>{v.platform}</span>
              </div>}
            <div style={{padding:"10px 12px"}}>
              <div style={{fontSize:11,fontWeight:600,color:"#e2e8f0",lineHeight:1.4,marginBottom:5}}>{v.title}</div>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <span style={{fontSize:8,color:v.color,background:v.color+"12",padding:"2px 7px",borderRadius:4,fontWeight:700}}>{v.platform}</span>
                <span style={{fontSize:8,color:"#475569"}}>→ İzle</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  </section>;
}

function Chatbot(){
  const[open,setOpen]=useState(false);
  const[msgs,setMsgs]=useState([{role:"ai",text:"Merhaba! 👋 Ben IMDATAI Asistanı. ChatGPT, Claude, Gemini veya prompt teknikleri hakkında sorularını yanıtlarım!"}]);
  const[inp,setInp]=useState("");const[load,setLoad]=useState(false);
  const[cnt,setCnt]=useState(0);const endRef=useRef();
  const LIMIT=20;
  useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"});},[msgs,load]);
  async function send(){
    if(!inp.trim()||load||cnt>=LIMIT)return;
    const m=inp.trim();setInp("");setCnt(c=>c+1);
    const history=msgs.slice(-8).map(m=>({role:m.role==="ai"?"model":"user",content:m.text}));
    setMsgs(h=>[...h,{role:"user",text:m}]);
    setLoad(true);
    const r=await askGemini(m,history);
    setMsgs(h=>[...h,{role:"ai",text:r}]);
    setLoad(false);
  }
  return <>
    <button onClick={()=>setOpen(o=>!o)} style={{position:"fixed",bottom:28,right:24,zIndex:500,width:58,height:58,borderRadius:"50%",border:"2px solid rgba(0,220,255,0.3)",background:"linear-gradient(135deg,#00dcff,#a855f7)",color:"#fff",fontSize:26,cursor:"pointer",boxShadow:"0 4px 24px rgba(0,220,255,0.5)",display:"flex",alignItems:"center",justifyContent:"center",animation:"glow 3s ease-in-out infinite"}}>
      {open?"✕":"🤖"}
    </button>
    {open&&<div style={{position:"fixed",bottom:100,right:24,zIndex:500,width:320,background:"rgba(8,12,24,0.98)",border:"1px solid rgba(0,220,255,0.2)",borderRadius:20,boxShadow:"0 16px 64px rgba(0,0,0,0.8)",overflow:"hidden",display:"flex",flexDirection:"column",backdropFilter:"blur(20px)"}}>
      <div style={{background:"linear-gradient(135deg,rgba(0,220,255,0.12),rgba(168,85,247,0.08))",padding:"14px 16px",borderBottom:"1px solid rgba(255,255,255,0.06)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <span style={{fontSize:18}}>🤖</span>
          <div>
            <div style={{fontSize:13,fontWeight:700,color:"#e2e8f0",fontFamily:"'Space Grotesk',sans-serif"}}>IMDATAI Asistanı</div>
            <div style={{fontSize:9,color:"#34d399"}}>● Gemini ile güçlendirildi</div>
          </div>
        </div>
        <div style={{fontSize:10,background:cnt>=LIMIT?"rgba(244,114,182,0.15)":"rgba(52,211,153,0.15)",color:cnt>=LIMIT?"#f472b6":"#34d399",padding:"3px 8px",borderRadius:6}}>{LIMIT-cnt} soru kaldı</div>
      </div>
      <div style={{height:260,overflowY:"auto",padding:"12px",display:"flex",flexDirection:"column",gap:8}}>
        {msgs.map((m,i)=>(
          <div key={i} style={{padding:"10px 13px",borderRadius:13,fontSize:12,lineHeight:1.65,maxWidth:"88%",wordBreak:"break-word",alignSelf:m.role==="user"?"flex-end":"flex-start",background:m.role==="user"?"linear-gradient(135deg,rgba(0,220,255,0.15),rgba(168,85,247,0.1))":"rgba(255,255,255,0.05)",color:m.role==="user"?"#e2e8f0":"#cbd5e1",border:`1px solid ${m.role==="user"?"rgba(0,220,255,0.2)":"rgba(255,255,255,0.06)"}`}}>
            {m.text}
          </div>
        ))}
        {load&&<div style={{alignSelf:"flex-start",padding:"10px 13px",borderRadius:13,background:"rgba(255,255,255,0.05)",fontSize:12,color:"#94a3b8",display:"flex",gap:6,alignItems:"center"}}>
          <Spin c="#00dcff"/><span>Gemini düşünüyor...</span>
        </div>}
        <div ref={endRef}/>
      </div>
      <div style={{padding:"10px 12px",borderTop:"1px solid rgba(255,255,255,0.06)"}}>
        {cnt>=LIMIT
          ?<div style={{fontSize:11,color:"#f472b6",textAlign:"center",padding:"4px"}}>Günlük limit doldu 🌙 Yarın tekrar gel!</div>
          :<div style={{display:"flex",gap:7}}>
            <input style={{flex:1,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(0,220,255,0.15)",borderRadius:10,color:"#e2e8f0",padding:"9px 12px",fontSize:12,fontFamily:"inherit",outline:"none"}} placeholder="Sor... (ChatGPT, Claude, Gemini...)" value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")send();}}/>
            <button onClick={send} disabled={load} className="btn-primary" style={{padding:"9px 13px",borderRadius:10,fontSize:16,fontFamily:"inherit"}}>↑</button>
          </div>
        }
      </div>
    </div>}
  </>;
}

// ── SVG LOGOLAR ───────────────────────────────────────────
const YT = () => <svg width="20" height="14" viewBox="0 0 20 14"><path d="M19.582 2.186A2.507 2.507 0 0 0 17.824.418C16.254 0 10 0 10 0S3.746 0 2.176.418A2.507 2.507 0 0 0 .418 2.186C0 3.76 0 7 0 7s0 3.24.418 4.814A2.507 2.507 0 0 0 2.176 13.582C3.746 14 10 14 10 14s6.254 0 7.824-.418a2.507 2.507 0 0 0 1.758-1.768C20 10.24 20 7 20 7s0-3.24-.418-4.814z" fill="#FF0000"/><path d="M8 10l5.2-3L8 4v6z" fill="white"/></svg>;
const TT = () => <svg width="16" height="18" viewBox="0 0 16 18"><path d="M11.301 0h2.368a4.573 4.573 0 0 0 1.305 3.061A4.573 4.573 0 0 0 16 4.366v2.369a7.906 7.906 0 0 1-4.627-1.484v6.724A6.208 6.208 0 0 1 5.165 18a6.208 6.208 0 0 1-6.208-6.208A6.208 6.208 0 0 1 5.165 5.584c.203 0 .403.01.6.03v2.433a3.778 3.778 0 0 0-.6-.048 3.778 3.778 0 0 0-3.778 3.778 3.778 3.778 0 0 0 3.778 3.778 3.778 3.778 0 0 0 3.778-3.778V0h2.358z" fill="white"/></svg>;
const IG = () => <svg width="18" height="18" viewBox="0 0 18 18"><rect x="1" y="1" width="16" height="16" rx="4" stroke="url(#ig)" strokeWidth="1.5" fill="none"/><circle cx="9" cy="9" r="3.5" stroke="url(#ig)" strokeWidth="1.5" fill="none"/><circle cx="13" cy="5" r="1" fill="url(#ig)"/><defs><linearGradient id="ig" x1="0" y1="18" x2="18" y2="0"><stop offset="0%" stopColor="#f09433"/><stop offset="50%" stopColor="#dc2743"/><stop offset="100%" stopColor="#bc1888"/></linearGradient></defs></svg>;

// ── DATA ──────────────────────────────────────────────────
const TICKER = ["🔥 GPT-5.5 yayınlandı — süper uygulama dönemi başladı","⚡ Claude Opus 4.7 — SWE-bench %87.6, kodlamada #1","🌐 Gemini 3.1 Ultra — 2 milyon token dünya rekoru","🇹🇷 Türkiye AI trafiğinde dünya #1 — %94.49","💰 2026 Q1'de AI'ya $267 milyar yatırım","🎨 Midjourney v7 fotorealizm çıtasını aştı","🎵 Suno v5 gerçek enstrüman sesi üretiyor","✨ Sora Enterprise küresel kullanıma açıldı","🦙 Meta Llama 4 açık kaynak devrim","💻 Cursor 3 Background Agents ile otonom geliştirme","📱 Apple Intelligence 2.0 cihaz üstünde AI","🔬 DeepSeek V4 ABD modelleriyle başa baş","🏥 Doktorların %72'si AI kullanıyor","🎯 MCP protokolü 97 milyon kurulum aştı"];

const NEWS = [
  {tag:"🔥",hot:true,color:"#00dcff",title:"GPT-5.5: Süper Uygulama Dönemi Başladı",desc:"ChatGPT, Codex ve tarayıcı tek platformda. Bilimsel görevlerde devrim. OpenAI'nin pazar değeri $300 milyarı aştı. Türkiye erişimi aktif.",src:"OpenAI Blog",time:"2 gün",read:"4 dk",emoji:"🤖"},
  {tag:"🆕",hot:true,color:"#a855f7",title:"Claude Opus 4.7: Kodlamada Dünya Rekoru",desc:"SWE-bench Verified %87.6 ile tüm modelleri geçti. Task Budget özelliği ajanları kontrol altına alıyor. 1M token, Constitutional AI.",src:"Anthropic",time:"3 gün",read:"4 dk",emoji:"🧠"},
  {tag:"🌟",hot:true,color:"#34d399",title:"Gemini 3.1 Ultra: 2 Milyon Token Rekoru",desc:"Google'ın multimodal devi güncellendi. Ses, görüntü, metin eş zamanlı işleme. Sandbox Python çalıştırma. Drive entegrasyonu mükemmelleşti.",src:"Google DeepMind",time:"4 gün",read:"3 dk",emoji:"🌟"},
  {tag:"🇹🇷",hot:true,color:"#fb923c",title:"Türkiye AI Trafiğinde Dünya Birincisi",desc:"Digital 2026 raporu: Türkiye'de AI trafiğinin %94.49'u ChatGPT'den geliyor. Küresel ortalama %80.92. Fırsat penceresi açık.",src:"We Are Social",time:"5 gün",read:"2 dk",emoji:"🏆"},
  {tag:"💰",hot:false,color:"#60a5fa",title:"2026 Q1: AI'ya 267 Milyar Dolar",desc:"OpenAI $25B, Anthropic $19B yıllık gelir. Her ikisi de halka arz sinyali veriyor. Türk yatırımcılar AI fonlarına yöneldi.",src:"Bloomberg",time:"6 gün",read:"3 dk",emoji:"💹"},
  {tag:"🎨",hot:false,color:"#f472b6",title:"Midjourney v7: Gerçek mi AI mi?",desc:"Yeni model insan anatomisini ve fotorealizmi mükemmelleştirdi. Archival quality fotoğraf. Ticari kullanım lisansı güçlendi.",src:"Midjourney",time:"1 hafta",read:"3 dk",emoji:"🎨"},
  {tag:"💻",hot:false,color:"#34d399",title:"Cursor 3.0: Ajan Çağı Başladı",desc:"Background Agents, Slack ve GitHub issue'lardan görev alıyor. Cloud'da çalışıyor, PR açıyor. Developer artık mimar, AI inşaatçı.",src:"Cursor Blog",time:"1 hafta",read:"4 dk",emoji:"💻"},
  {tag:"🦙",hot:false,color:"#fb923c",title:"Meta Llama 4: Açık Kaynak Devrimi",desc:"Meta'nın yeni modeli kapalı kaynak rakiplerle yarışıyor. Ücretsiz, ticari kullanım açık. Türkçe performansı iyi.",src:"Meta AI",time:"10 gün",read:"3 dk",emoji:"🦙"},
  {tag:"🎵",hot:false,color:"#a855f7",title:"Suno v5: Gerçek Enstrüman Sesi",desc:"AI müzikte yeni çığır. Gerçek gitarist, piyanist, davulcu sesi üretiyor. Ticari kullanım lisansı dahil. Türkçe sözlü şarkı.",src:"Suno AI",time:"10 gün",read:"2 dk",emoji:"🎵"},
  {tag:"🏥",hot:false,color:"#60a5fa",title:"Doktorların %72'si AI Kullanıyor",desc:"AMA 2026 raporu: Bir yılda %48'den %72'ye çıktı. Tanı doğruluğu ve tedavi planlamasında AI desteği yaygınlaşıyor.",src:"AMA",time:"12 gün",read:"3 dk",emoji:"🏥"},
  {tag:"🔬",hot:false,color:"#00dcff",title:"DeepSeek V4 Piyasaya Çıktı",desc:"Çin'in AI şampiyonu yeni modeliyle ABD'ye rakip olmaya devam ediyor. Açık kaynak versiyonu ücretsiz. Matematikte öne çıkıyor.",src:"DeepSeek",time:"13 gün",read:"3 dk",emoji:"🔬"},
  {tag:"📱",hot:false,color:"#f472b6",title:"Apple Intelligence 2.0: Cihaz Üstünde Güç",desc:"Kişisel verileri buluta göndermeden işleyen yeni AI motoru. iPhone 16 ve iPad için. Siri tamamen yenilendi.",src:"Apple",time:"2 hafta",read:"3 dk",emoji:"📱"},
  {tag:"🤖",hot:false,color:"#a855f7",title:"Perplexity Pro: Yapay Zeka Araştırma Motoru",desc:"Kaynaklı yanıtlar, akademik paper analizi, kod yazma. Google'a gerçek rakip olmaya başladı. 30M kullanıcı.",src:"Perplexity",time:"2 hafta",read:"2 dk",emoji:"🔍"},
  {tag:"🎬",hot:false,color:"#fb923c",title:"Sora Enterprise: Küresel Açılış",desc:"OpenAI'nin metin-video modeli tüm dünyaya açıldı. 1080p, 60 saniye, tutarlı karakterler. Reklam ajansları hızla adaptasyon.",src:"OpenAI",time:"2 hafta",read:"3 dk",emoji:"🎬"},
  {tag:"🏛️",hot:false,color:"#60a5fa",title:"AB AI Yasası Yürürlüğe Girdi",desc:"Yüksek riskli AI uygulamaları için sıkı kurallar başladı. Türk şirketleri AB pazarında uyum zorunluluğuyla karşı karşıya.",src:"European Commission",time:"3 hafta",read:"4 dk",emoji:"🏛️"},
  {tag:"🇹🇷",hot:false,color:"#34d399",title:"Türkiye'de AI Girişim Sayısı 300'ü Aştı",desc:"İstanbul merkezli AI startup'lar 2025'e kıyasla %180 arttı. Sağlık, eğitim ve tarım öne çıkan sektörler.",src:"Startups.com.tr",time:"3 hafta",read:"3 dk",emoji:"🚀"},
];

const TRENDING = [
  {rank:1,icon:"🤖",topic:"Agentic AI",heat:98,desc:"Otonom çalışan AI ajanları her sektörü değiştiriyor. 2026'nın #1 trendi.",tag:"🔥 Çok Sıcak"},
  {rank:2,icon:"💻",topic:"Vibe Coding",heat:95,desc:"Cursor ve Claude Code ile kod yazmak yerine söylüyorsun.",tag:"⚡ Trend"},
  {rank:3,icon:"🎬",topic:"AI Video Üretimi",heat:92,desc:"Sora, HeyGen ile profesyonel video dakikalar içinde hazır.",tag:"📈 Yükseliyor"},
  {rank:4,icon:"🇹🇷",topic:"Türkçe AI Araçları",heat:89,desc:"Türkiye pazarına özel AI çözümleri artıyor. Fırsat penceresi açık.",tag:"🎯 Fırsat"},
  {rank:5,icon:"💰",topic:"AI ile Gelir",heat:86,desc:"AI bilen kişilere talep patladı. Freelance ve danışmanlık artıyor.",tag:"💡 Popüler"},
  {rank:6,icon:"🔊",topic:"AI Ses & Müzik",heat:83,desc:"ElevenLabs ve Suno v5 profesyonel seviyeye taşıdı.",tag:"🎵 Büyüyor"},
  {rank:7,icon:"🧬",topic:"AI ve Sağlık",heat:80,desc:"Doktorların %72'si AI kullanıyor. Tanı ve tedavide devrim.",tag:"🏥 Kritik"},
  {rank:8,icon:"🔒",topic:"AI Güvenliği",heat:77,desc:"Deepfake, hallüsinasyon ve veri gizliliği en büyük gündem.",tag:"⚠️ Önemli"},
  {rank:9,icon:"🌍",topic:"AI Düzenlemeleri",heat:74,desc:"AB AI Yasası, Türkiye KVKK güncellemeleri. Hukuki çerçeve şekilleniyor.",tag:"📜 Gelişiyor"},
];

// Araç Detay Verileri (6 araç için tam sayfa)
const TOOL_DETAILS = {
  cursor: {
    name:"Cursor", icon:"💻", color:"#34d399", tag:"Kod Editörü", score:98, users:"4M+",
    free:true, price:"Ücretsiz + Pro $20/ay", founded:"2023", url:"https://cursor.com",
    badge:"Editör #1", sponsor:false,
    tagline:"Yapay Zeka ile Kod Yazmayı Yeniden Tanımlıyor",
    desc:"Cursor, VS Code üzerine inşa edilmiş AI destekli kod editörüdür. GPT-4, Claude ve kendi modellerini kullanarak kod yazma, debug etme ve refactor işlemlerini dramatik şekilde hızlandırır. 2026'da Cursor 3 ile paralel ajan desteği eklendi.",
    features:["Tab ile kod tamamlama (Copilot'tan 3x hızlı)","Doğal dil ile kod düzenleme","Tüm codebase'i anlama (Codebase Chat)","Background Agents (cloud'da çalışır)","VS Code eklentileri tam uyumlu","Multi-file edit"],
    howto:["cursor.com'dan indir ve kur (VS Code tabanlı)","Mevcut VS Code ayarlarını tek tıkla aktar","Ctrl+K ile satır düzenleme, Ctrl+L ile sohbet","Tab ile AI önerilerini kabul et","'@codebase' ile tüm projeyi sorgula"],
    pros:["Rakiplerden çok daha akıllı kod tamamlama","Cursor Chat doğrudan kodla entegre","Ücretsiz plan gerçekten kullanılabilir","Privacy mode — kod sunucuya gönderilmez"],
    cons:["Aylık 500 hızlı sorgu (ücretsiz)","İnternet bağlantısı gerekli","Büyük projeler RAM yiyebilir"],
    alternatives:["GitHub Copilot","Claude Code","Replit","v0 by Vercel"],
    prompts:["Bu fonksiyonu optimize et, time complexity'yi açıkla","Tüm TODO yorumları için implement et","Bu kodu TypeScript'e dönüştür ve tip güvenliği ekle","Bu API endpoint için unit test yaz"],
    verdict:"Kod yazan herkes için 2026'nın en iyi editörü. Ücretsiz plan bile Copilot'u geride bırakıyor.",
    affiliateNote:"Cursor Pro: $20/ay. 'Pro'ya geç' butonu ile 14 gün ücretsiz dene."
  },
  midjourney: {
    name:"Midjourney", icon:"🎨", color:"#f472b6", tag:"Görsel AI", score:95, users:"20M+",
    free:false, price:"$10-$120/ay", founded:"2022", url:"https://midjourney.com",
    badge:"Görsel #1", sponsor:false,
    tagline:"Hayal Ettiğini Saniyeler İçinde Görsel Yap",
    desc:"Midjourney, metin açıklamalarından photorealistic veya sanatsal görseller üreten lider AI platformudur. v7 ile fotoğraf kalitesi gerçek fotoğrafçılıkla yarışır hale geldi.",
    features:["v7 ile fotorealizm çıtası","Karakter tutarlılığı (--cref)","Stil tutarlılığı (--sref)","4K ve daha yüksek çözünürlük","Video modu (alpha)","Web arayüzü + Discord"],
    howto:["midjourney.com'dan kayıt ol","/imagine prompt ile başla","--ar 16:9 ile oran belirle","--v 7 ile en son modeli kullan","Beğenmediğini 🔄 ile yenile"],
    pros:["En yüksek görsel kalite","Sanatsal stil çeşitliliği","Aktif topluluk ve prompt rehberleri","Sürekli güncelleme"],
    cons:["Ücretsiz plan yok","Discord tabanlı (karmaşık başlangıç)","Prompt öğrenmesi zaman alıyor","Ticari kullanım kısıtları"],
    alternatives:["DALL-E 3","Adobe Firefly","Stable Diffusion","Ideogram"],
    prompts:["hyperrealistic portrait of a Turkish woman, golden hour, 35mm film, --ar 2:3 --v 7","futuristic Istanbul cityscape at night, neon lights, cyberpunk, --ar 16:9","product photography, minimalist white background, professional lighting, --ar 1:1"],
    verdict:"Görsel kalitede hâlâ lider. Ticari işler ve sanatsal projeler için vazgeçilmez.",
    affiliateNote:"Basic plan: $10/ay (~200 görsel). Aylık deneme için ideal başlangıç noktası."
  },
  elevenlabs: {
    name:"ElevenLabs", icon:"🔊", color:"#fb923c", tag:"Ses AI", score:95, users:"10M+",
    free:true, price:"Ücretsiz + $5-$99/ay", founded:"2022", url:"https://elevenlabs.io",
    badge:"Ses #1", sponsor:false,
    tagline:"İnsan Sesinden Ayırt Edilemeyen AI Seslendirme",
    desc:"ElevenLabs, metin-konuşma teknolojisinde dünya lideridir. 29 dilde insan sesiyle neredeyse aynı kalitede seslendirme üretir. Podcast, video seslendirme ve ses klonlama için kullanılıyor.",
    features:["29 dil desteği (Türkçe dahil)","Ses klonlama (3 dakika kayıtla)","Duygusal ses kontrolü","Gerçek zamanlı ses dönüşümü","API entegrasyonu","Uzun metin seslendirme"],
    howto:["elevenlabs.io'dan ücretsiz kayıt","'Text to Speech' seç","Dil ve ses karakterini seç","Metni gir, sesi oluştur","MP3 olarak indir veya API kullan"],
    pros:["Türkçe kalitesi rakipsiz","Ücretsiz plan kullanılabilir","Ses klonlama çok kolay","API ile kolayca entegre"],
    cons:["Ücretsiz plan 10.000 karakter/ay","Ses klonlama etik soruları","Yüksek kalite = ücretli plan"],
    alternatives:["Murf.ai","Speechify","Google TTS","Azure Speech"],
    prompts:["'Dramatik ve etkileyici' ton ile 'Türkiye AI dünyasında lider konuma geldi' seslendirme","Podcast intro: enerjik ve profesyonel ses ile 30 saniyelik açılış","YouTube video seslendirme için nötr ve anlaşılır Türkçe"],
    verdict:"Türkçe seslendirme için 2026'nın tartışmasız en iyi aracı. Ücretsiz planla başla.",
    affiliateNote:"Ücretsiz: 10K karakter. Starter $5/ay: 30K karakter. İçerik üreticileri için ideal."
  },
  perplexity: {
    name:"Perplexity", icon:"🔍", color:"#a855f7", tag:"AI Araştırma", score:93, users:"30M+",
    free:true, price:"Ücretsiz + Pro $20/ay", founded:"2022", url:"https://perplexity.ai",
    badge:"Araştırma #1", sponsor:false,
    tagline:"ChatGPT + Google = Gerçek Zamanlı AI Araştırma",
    desc:"Perplexity, web araması ile AI'ı birleştiren araştırma motorudur. Her cevap gerçek kaynaklara dayalı ve kaynak gösterir. 'AI hallüsinasyonu' sorununu büyük ölçüde çözmüştür.",
    features:["Gerçek zamanlı web araması","Kaynak gösterme (hallüsinasyon azaltır)","PDF ve dosya analizi","Akademik arama modu","Pro: GPT-5, Claude, Gemini seçimi","Spaces (araştırma koleksiyonları)"],
    howto:["perplexity.ai'ya git (kayıt opsiyonel)","Soruyu normal konuşma dilinde sor","'Academic' modda bilimsel kaynak ara","PDF yükle, sorular sor","Spaces ile araştırmaları derle"],
    pros:["Her cevap kaynaklı = güvenilir","Güncel bilgi (web'den)","Ücretsiz plan çok güçlü","Akademik mod değerli"],
    cons:["Uzun yaratıcı metin üretimde zayıf","Görsel üretim yok","200K token limit (Claude'un gerisinde)"],
    alternatives:["ChatGPT","Google Gemini","You.com","Bing AI"],
    prompts:["Türkiye'de 2026 AI startup ekosistemi hakkında güncel rapor","Claude Opus 4.7 ile GPT-5.5 karşılaştırması, kaynaklı","prompt mühendisliğinin iş dünyasına etkisi, araştırmalar"],
    verdict:"Araştırma ve güncel bilgi için ChatGPT'den daha güvenilir. Kaynak istiyor musun? Perplexity.",
    affiliateNote:"Pro $20/ay: sınırsız arama, GPT-5/Claude seçimi, dosya analizi. Araştırmacılar için zorunlu."
  },
  gamma: {
    name:"Gamma", icon:"📊", color:"#60a5fa", tag:"AI Sunum", score:92, users:"15M+",
    free:true, price:"Ücretsiz + Pro $10/ay", founded:"2022", url:"https://gamma.app",
    badge:"Sunum #1", sponsor:false,
    tagline:"10 Dakikada Profesyonel Sunum — Sıfır Tasarım Bilgisi",
    desc:"Gamma, yapay zeka ile sunumlar, belgeler ve web sayfaları oluşturan platformdur. Metin gir, AI profesyonel tasarımı otomatik yapar. PowerPoint'in AI çağına taşınmış hali.",
    features:["Metin'den anında sunum","50+ profesyonel şablon","AI içerik önerisi","Gerçek zamanlı işbirliği","Web'de paylaşım (link)","PDF/PPT export"],
    howto:["gamma.app'a kayıt ol (ücretsiz)","'New AI' ile konu gir","AI outline oluştursun, onayla","Tasarımı özelleştir","Link paylaş veya PDF indir"],
    pros:["Çok hızlı (10 dakika = sunum)","Tasarım bilgisi gerekmez","Ücretsiz plan kullanılabilir","Modern ve şık çıktı"],
    cons:["Fazla kişiselleştirme zor","İnternetsiz çalışmaz","Ücretsiz: Gamma watermark"],
    alternatives:["Beautiful.ai","Tome","Canva","PowerPoint AI"],
    prompts:["'IMDATAI AI platformu için yatırımcı sunumu — 10 slayt, minimalist stil'","'AI ile para kazanma yolları — 8 slayt, infografik ağırlıklı'","'ChatGPT vs Claude karşılaştırması — tablo formatında, 6 slayt'"],
    verdict:"Hızlı sunum için 2026'nın en kolay aracı. İlk sunumu ücretsiz, sonrası Pro'ya değer.",
    affiliateNote:"Ücretsiz: 400 AI kredit. Pro $10/ay: sınırsız kredit, export, watermark yok."
  },
  heygen: {
    name:"HeyGen", icon:"👤", color:"#00dcff", tag:"AI Video Avatar", score:93, users:"5M+",
    free:true, price:"Ücretsiz + Creator $29/ay", founded:"2022", url:"https://heygen.com",
    badge:"Avatar #1", sponsor:false,
    tagline:"15 Saniye Kayıt, 4K AI Avatar Video",
    desc:"HeyGen, gerçekçi AI avatar videoları oluşturan platformdur. Metni gir, avatar konuşsun. 15 saniyelik ses kaydıyla kendi sesini klonla. YouTube, LinkedIn, pazarlama videoları için ideal.",
    features:["300+ hazır AI avatar","Ses klonlama (15 sn kayıt)","29 dil (Türkçe dahil)","Dudak senkronizasyonu","Video çeviri (lip-sync)","4K çıktı (Pro)"],
    howto:["heygen.com'a kayıt ol","Avatar ve ses seç","Metni Türkçe yaz","Video oluştur (2-3 dk)","İndir veya paylaş"],
    pros:["Türkçe lip-sync mükemmel","Kendi avatarını oluşturabilirsin","Video çeviri özelliği değerli","Arayüz çok kolay"],
    cons:["Ücretsiz: 1 dakika/ay limit","İnandırıcılık hâlâ yüzde yüz değil","Yüksek kalite = pahalı plan"],
    alternatives:["Synthesia","D-ID","Runway","Pika"],
    prompts:["'IMDATAI platform tanıtım videosu — 60 saniye, profesyonel Türkçe anlatım'","'YouTube intro — enerjik, dikkat çekici, 15 saniye'","'Ürün tanıtımı — sade anlatım, beyaz arka plan'"],
    verdict:"Türkçe video üretmek isteyenler için 2026'nın en pratik avatarı. Ücretsiz planla başla.",
    affiliateNote:"Creator $29/ay: 15 dk video, ses klonlama, özel avatar. İçerik üreticileri için ideal."
  }
};

// Blog yazıları
const BLOG_POSTS = [
  {
    id:"chatgpt-turkce-rehberi", slug:"chatgpt-turkce-rehberi",
    tag:"📖 Rehber", color:"#00dcff", readTime:"8 dk", date:"Nisan 2026",
    title:"ChatGPT Türkçe Kullanım Rehberi 2026 — Sıfırdan Uzmana",
    summary:"Türkiye'de AI trafiğinin %94'ü ChatGPT üzerinden geliyor. Peki nasıl en iyi şekilde kullanırsın?",
    content:`## ChatGPT Neden Bu Kadar Popüler?

We Are Social 2026 raporuna göre Türkiye, ChatGPT kaynaklı AI trafiğinde %94.49 ile dünya birincisi. Her 100 Türk kullanıcıdan 94'ü AI ile iş yaparken ChatGPT tercih ediyor.

## Türkçe'de ChatGPT Kullanmanın Altın Kuralları

**1. Türkçe veya İngilizce?**
Test sonuçlarımıza göre: Yaratıcı yazarlık için Türkçe prompt daha doğal sonuç veriyor. Kod ve teknik görevler için İngilizce prompt %20-30 daha iyi sonuç üretiyor.

**2. Rol Verin**
❌ "CV yaz" → ✅ "10 yıl deneyimli bir İK uzmanı olarak, yazılım mühendisi pozisyonu için güçlü bir CV yaz"

**3. Format Belirtin**
"Madde madde listele", "tablo formatında", "50 kelimeden az" gibi kısıtlar çok daha tutarlı sonuç verir.

**4. Context Window Kullanın**
GPT-5.5 128K token işleyebilir. Uzun belgeleri kopyalayıp yapıştırın, "Bu belgeyi analiz et" deyin.

## En İyi 10 ChatGPT Kullanım Alanı (TR için)

1. Sosyal medya içeriği üretimi
2. E-posta ve iş yazışmaları  
3. Kod debug ve açıklama
4. Araştırma ve özet çıkarma
5. CV ve kapak mektubu
6. Sunum içeriği
7. Müşteri desteği cevapları
8. SEO içerik üretimi
9. İş planı ve strateji
10. Dil öğrenimi (pratik)

## Ücretsiz vs Plus vs Pro

- **Ücretsiz**: GPT-4o mini, günlük sınır var. Başlangıç için yeterli.
- **Plus ($20/ay)**: GPT-5.5 erişimi, DALL-E 3, daha hızlı yanıt. Düzenli kullanıcılar için.
- **Pro ($200/ay)**: Sınırsız, o1 modelleri, araştırmacılar için.`,
    views: 0, likes: 0
  },
  {
    id:"prompt-muhendisligi-rehberi", slug:"prompt-muhendisligi-rehberi",
    tag:"💡 Teknik", color:"#a855f7", readTime:"10 dk", date:"Nisan 2026",
    title:"Prompt Mühendisliği: 2026'da AI'dan Mükemmel Sonuç Almanın Bilimi",
    summary:"Doğru soru sormak bir sanattır. Bu rehberle AI'dan aldığın kalite %300 artacak.",
    content:`## Prompt Mühendisliği Nedir?

Prompt mühendisliği, AI modellerinden istenen çıktıyı elde etmek için girdi metnini optimize etme disiplinidir. 2026'da bu beceri, CV'lerde aranan özel bir yetenek haline geldi.

## 5 Temel Teknik

**1. Zero-Shot**: Örnek vermeden direkt görev
**2. Few-Shot**: 2-5 örnek ver, sonra yaptır
**3. Chain of Thought**: "Adım adım düşün" ekle
**4. Role Prompting**: "Uzman bir... olarak" başla
**5. Constrained Output**: Format, uzunluk, kısıtları belirt

## Evrensel Formül

[ROL] + [GÖREV] + [BAĞLAM] + [FORMAT] + [KISIT]

Örnek: "Deneyimli bir pazarlamacı olarak (ROL), GenZ hedef kitleye yönelik (BAĞLAM) Instagram postu yaz (GÖREV). 150 kelime, 5 hashtag (FORMAT). Argo kelime kullanma (KISIT)."

## Sektöre Göre En İyi Promptlar

**Pazarlama**: Rol + hedef kitle + platform + ton + CTA
**Yazılım**: Dil + context + görünür hata + beklenen çıktı
**Eğitim**: Seviye + konu + format + örnek sayısı
**İş**: Alıcı + amaç + ton + eylem çağrısı`,
    views: 0, likes: 0
  },
  {
    id:"ai-ile-para-kazanma-2026", slug:"ai-ile-para-kazanma-2026",
    tag:"💰 Kariyer", color:"#34d399", readTime:"7 dk", date:"Nisan 2026",
    title:"AI ile Para Kazanmanın 8 Gerçekçi Yolu — 2026 Türkiye Rehberi",
    summary:"AI araçlarını bilen kişi sayısı az, talep çok. Bu pencere kapanmadan önce harekete geç.",
    content:`## Neden Şimdi?

Türkiye'de AI araçlarını etkin kullanan profesyonel sayısı hâlâ çok az. Bu boşluk = fırsat. 2027'de bu fırsat kapanmaya başlayacak.

## 8 Gerçekçi Yol

**1. AI İçerik Üreticisi** (₺5K-30K/ay)
YouTube + blog + sosyal medya. AI ile 10x içerik üret, 10x hızlı büyü.

**2. AI Freelancer** (₺8K-50K/ay)
Cursor ile kod 3x hızlı yaz. Aynı projelerden 3x fazla al.

**3. AI Görsel Tasarımcı** (₺3K-20K/ay)
Midjourney + Canva AI ile logo, sosyal medya görseli sat.

**4. AI Eğitim Uzmanı** (₺5K-40K/ay)
Kurs, workshop, kurumsal eğitim. Türkiye'de bu alan çok boş.

**5. AI Danışmanı** (₺10K-80K/ay)
KOBİ'lere AI entegrasyonu danışmanlığı. Yüksek değerli.

**6. Prompt Mühendisi** (₺15K-60K/ay)
Şirketlere özel prompt sistemleri kur ve optimize et.

**7. AI SaaS Ürünü** (₺0-Sınırsız)
Bir sorun bul, AI ile çöz, abonelik sat.

**8. Affiliate Pazarlama** (₺2K-15K/ay)
AI araç referral programları. ChatGPT Plus, Cursor, Midjourney.`,
    views: 0, likes: 0
  },
  {
    id:"claude-vs-chatgpt-2026", slug:"claude-vs-chatgpt-2026",
    tag:"🆚 Karşılaştırma", color:"#fb923c", readTime:"6 dk", date:"Nisan 2026",
    title:"Claude vs ChatGPT 2026: Hangisi Daha İyi? Dürüst Karşılaştırma",
    summary:"30 gün her ikisini de kullandık. İşte gerçek sonuçlar — ne için hangisi?",
    content:`## Özet Verdict

**Kodlama**: Claude açık ara önde (SWE-bench %87.6 vs %78.4)
**Yaratıcı yazarlık**: ChatGPT biraz önde
**Uzun metin**: Claude (1M token vs 128K token)
**Görsel**: ChatGPT (DALL-E 3 var, Claude'da yok)
**Türkçe**: Claude hafif önde, her ikisi de iyi
**Hız**: ChatGPT daha hızlı
**Gizlilik**: Claude daha güvenli (Constitutional AI)

## Ne Zaman Hangisi?

### Claude Opus 4.7 Kullan:
- 100+ sayfalık belge analizi
- Kod yazma, debug, refactor
- Karmaşık mantık gerektiren görevler
- Gizlilik önemli ise (Constitutional AI)

### ChatGPT Kullan:
- Görsel üretim (DALL-E 3)
- Sesli sohbet
- Plugin ekosistemi
- Genel günlük kullanım
- Hız önemliyse

## Fiyat Karşılaştırması

| Plan | ChatGPT | Claude |
|------|---------|--------|
| Ücretsiz | GPT-4o mini | Haiku |
| Pro | $20/ay | $20/ay |
| Max | $200/ay | $100/ay |

## Sonuç

İkisini birden kullan. ChatGPT Plus + Claude Pro = $40/ay. Türkiye'de ortalama bir uzmanın aylık verimliliğini 2-3x artırır.`,
    views: 0, likes: 0
  },
  {
    id:"midjourney-turkce-rehberi", slug:"midjourney-turkce-rehberi",
    tag:"🎨 Görsel", color:"#f472b6", readTime:"8 dk", date:"Nisan 2026",
    title:"Midjourney Türkçe Başlangıç Rehberi — İlk Görselini 10 Dakikada Üret",
    summary:"Midjourney v7 ile nasıl başlanır? Türkçe prompt örnekleri ve profesyonel ipuçları.",
    content:`## Midjourney Nedir?

Midjourney, metin açıklamalarından sanatsal ve fotorealistik görseller üreten AI platformudur. v7 ile gerçek fotoğrafçılıkla yarışan kaliteye ulaştı.

## Başlangıç (Adım Adım)

1. midjourney.com'a git, Discord ile kayıt ol
2. 'Try for free' ile deneme başlat
3. Discord sunucusuna katıl
4. #newbies kanalına /imagine yaz

## Temel Prompt Yapısı

/imagine [konu] [stil] [teknik parametreler]

Örnek: /imagine portrait of a turkish woman, golden hour photography, 35mm film grain, f1.4 bokeh --ar 2:3 --v 7 --q 2

## En Kullanışlı Parametreler

--ar 16:9 → yatay format
--ar 2:3 → dikey/portre
--v 7 → en son model
--q 2 → yüksek kalite
--style raw → gerçekçi mod
--cref [url] → karakter tutarlılığı

## Türkçe Prompt Örnekleri

1. "A Turkish bazaar at sunset, vibrant colors, photorealistic --ar 16:9 --v 7"
2. "Modern Istanbul skyline, Bosphorus, drone photography --ar 21:9"
3. "Turkish coffee shop interior, cozy atmosphere, warm lighting --ar 4:3"

## Profesyonel İpuçları

- Önce İngilizce prompt yaz (daha iyi sonuç)
- Detay ne kadar fazlaysa o kadar iyi
- Sanatçı adı ekle: "in the style of [artist]"
- Negatif prompt: --no text, signature, watermark`,
    views: 0, likes: 0
  },
  {
    id:"turkiye-yapay-zeka-rehberi", slug:"turkiye-yapay-zeka-rehberi",
    tag:"🇹🇷 Türkiye", color:"#fb923c", readTime:"5 dk", date:"Nisan 2026",
    title:"Türkiye'de Yapay Zeka: Fırsatlar, Rakamlar ve Geleceğin Meslek Rehberi",
    summary:"Türkiye AI trafiğinde dünya birincisi. Peki bu ne anlama geliyor ve fırsatlar neler?",
    content:`## Türkiye AI'da Nerede?

Digital 2026 Global Overview: Türkiye'de yapay zeka kaynaklı web trafiğinin %94.49'u ChatGPT üzerinden. Bu oran küresel ortalamanın (80.92%) çok üzerinde.

Türkiye AI pazarı yıllık %30 büyüme ile $900 milyarlık küresel pastadan pay alıyor.

## Türkiye'de AI Kullanan Sektörler

**Öncü Sektörler:**
- Fintech ve bankacılık
- E-ticaret (Trendyol, Hepsiburada)
- Medya ve içerik üretimi
- Yazılım geliştirme

**Fırsat Bekleyen Sektörler:**
- Sağlık ve hastane yönetimi
- Eğitim teknolojisi
- Tarım ve gıda
- KOBİ'ler (büyük boşluk!)

## 2026'nın AI Meslekleri (TR için)

1. **Prompt Mühendisi** — Ortalama ₺25K/ay
2. **AI Danışmanı** — ₺30K-80K/ay
3. **AI İçerik Stratejisti** — ₺15K-40K/ay  
4. **Makine Öğrenmesi Mühendisi** — ₺35K-100K+/ay
5. **AI Ürün Yöneticisi** — ₺40K-120K/ay

## Türkiye'de AI Girişimler

- **İnventiv AI** — Kurumsal AI çözümleri
- **Cbot** — Türkçe chatbot platformu
- **Robusta** — QA otomasyon
- **Procyon AI** — Görüntü işleme

## Ne Yapmalısın?

1. Bir AI aracını derinlemesine öğren (Cursor veya ChatGPT)
2. Mesleğine entegre et
3. Öğrendiklerini paylaş (YouTube/TikTok)
4. 6 ayda AI uzmanı ol`,
    views: 0, likes: 0
  },
  {
    id:"gemini-kullanim-rehberi", slug:"gemini-kullanim-rehberi",
    tag:"🌟 Rehber", color:"#34d399", readTime:"6 dk", date:"Mayıs 2026",
    title:"Gemini 2026 Rehberi: Google'ın AI'ı ile Neler Yapabilirsiniz?",
    summary:"2 milyon token, Google entegrasyonu ve ücretsiz erişim. Gemini'yi doğru kullanmak için bilmeniz gerekenler.",
    content:`## Gemini Nedir?

Google DeepMind tarafından geliştirilen Gemini, metin, görsel, ses ve videoyu aynı anda işleyebilen multimodal bir AI modelidir. 2024'te çıktı, 2026'da Gemini 3.1 Ultra ile 2 milyon token context window rekoru kırdı.

## Gemini'nin Rakipsiz Özellikleri

**2 Milyon Token Context Window**
ChatGPT'nin 128K, Claude'un 1M tokenına karşılık Gemini 2 milyon token işleyebiliyor. Bu yaklaşık 1500 sayfalık bir kitap demek.

**Google Ekosistemi Entegrasyonu**
Gmail, Drive, Docs, Sheets, YouTube — tümüne erişim. "Drive'ımdaki geçen ayki raporları özetle" diyebilirsin.

**Gerçek Zamanlı Web Araması**
Güncel bilgiye ihtiyaç duyduğunda Gemini web'e bağlanır. ChatGPT bunu sınırlı yapar.

## Ne Zaman Gemini Kullan?

- **Uzun belge analizi**: 2M token kapasitesi sayesinde
- **Google Workspace**: Drive, Gmail, Docs içinde
- **Araştırma**: Güncel web verisiyle anlık sonuç
- **Görsel analiz**: Fotoğraf, grafik, tablo yorumlama

## Ücretsiz Plan ile Başla

Gemini Ücretsiz plan oldukça güçlü. AI Pro ($19.99/ay) planında ek Google depolama ve daha hızlı yanıt alırsın.`,
    views: 0, likes: 0
  },
  {
    id:"cursor-vibe-coding-rehberi", slug:"cursor-vibe-coding-rehberi",
    tag:"💻 Teknik", color:"#34d399", readTime:"7 dk", date:"Mayıs 2026",
    title:"Cursor ile Vibe Coding: Kod Yazmadan Uygulama Geliştirin",
    summary:"2026'nın en büyük geliştirici trendi: Cursor ile kod yazmak yerine ne istediğinizi söyleyerek uygulama yapmak.",
    content:`## Vibe Coding Nedir?

Vibe coding, Andrej Karpathy'nin öne sürdüğü kavramla 2026'nın en popüler geliştirici yaklaşımı haline geldi. Temel fikir: Kod yazmak yerine ne istediğinizi AI'a anlatırsınız, AI yazar.

## Cursor ile Başlamak

1. cursor.com'dan indirin (VS Code tabanlı, ücretsiz plan var)
2. Mevcut VS Code ayarlarınızı tek tıkla aktarın
3. **Ctrl+K**: Seçili kodu düzenle
4. **Ctrl+L**: Cursor Chat — projenizi sorgulayın

## Temel Vibe Coding Komutları

**Yeni özellik ekle:**
"Bu sayfaya kullanıcı giriş sistemi ekle, JWT token kullan, hata durumlarını handle et"

**Bug düzelt:**
"Bu fonksiyon çalışmıyor, neden olduğunu açıkla ve düzelt"

**Refactor:**
"Bu kodu daha okunabilir ve bakımı kolay hale getir, TypeScript tiplerini ekle"

## Background Agents ile Otonom Geliştirme

Cursor 3'ün yeni özelliği: Background Agents. Slack'ten veya GitHub Issue'dan görev tanımlarsınız, ajan cloud'da çalışır, PR açar. Siz sadece review yaparsınız.`,
    views: 0, likes: 0
  },
  {
    id:"elevenlabs-turkce-ses-rehberi", slug:"elevenlabs-turkce-ses-rehberi",
    tag:"🔊 Araç", color:"#fb923c", readTime:"5 dk", date:"Mayıs 2026",
    title:"ElevenLabs Türkçe Seslendirme Rehberi — Podcast ve YouTube için",
    summary:"İnsan sesinden ayırt edilemeyen AI seslendirme. Ücretsiz planla başlayın, içerik üretimine hız katın.",
    content:`## ElevenLabs Neden Lider?

ElevenLabs, 29 dilde %95+ doğallık oranıyla seslendirme üretiyor. Türkçe kalitesi rakiplerden açık ara üstün. 10 milyondan fazla kullanıcı, içerik üreticilerinden kurumsal şirketlere kadar kullanıyor.

## Türkçe Ses Kalitesi

Test sonuçlarımıza göre ElevenLabs Türkçe: 
- Doğal vurgu ve tonlama ✅
- Yabancı kelime telaffuzu doğru ✅
- Duygusal ton kontrolü mevcut ✅
- Hızlı üretim (30 saniye metin = 5 saniye) ✅

## Ücretsiz Plan ile Ne Yapabilirsiniz?

Ayda 10.000 karakter ücretsiz. Bu yaklaşık:
- 3-4 dakikalık YouTube video seslendirmesi
- 5-6 podcast tanıtım metni
- 10-15 kısa sosyal medya içeriği

## İçerik Üreticileri için İş Akışı

1. ChatGPT ile senaryo yaz
2. ElevenLabs'a yapıştır, ses üret
3. Audacity ile düzenle
4. YouTube/Podcast'e yükle

Starter plan ($5/ay) ile 30.000 karakter ve daha fazla ses seçeneği.`,
    views: 0, likes: 0
  },
];

// AI Görsel Galerisi (açıklamalı örnekler)
const GALLERY = [
  {cat:"📸 Fotorealizm",tool:"Midjourney v7",color:"#f472b6",emoji:"🌅",title:"İstanbul Gün Batımı",prompt:"/imagine Istanbul Bosphorus at golden hour, drone photography, photorealistic --ar 16:9 --v 7",desc:"Midjourney v7 ile gerçek fotoğraftan ayırt etmek neredeyse imkânsız hale geldi."},
  {cat:"🎨 Dijital Sanat",tool:"DALL-E 3",color:"#00dcff",emoji:"🦅",title:"Türk Mitolojisi",prompt:"Turkish mythology eagle spirit, ethereal, watercolor style, ancient symbols, dramatic lighting",desc:"DALL-E 3 kültürel ve mitolojik temalarda güçlü sonuçlar üretiyor."},
  {cat:"🏢 Mimari",tool:"Midjourney v7",color:"#a855f7",emoji:"🏛️",title:"Gelecek İstanbul 2050",prompt:"futuristic Istanbul 2050, sustainable architecture, floating gardens, solar panels --ar 21:9 --v 7",desc:"AI ile mimari konsept tasarımı artık dakikalar sürüyor."},
  {cat:"🎭 Karakter",tool:"Midjourney v7",color:"#34d399",emoji:"👩",title:"Profesyonel Portre",prompt:"professional headshot Turkish businesswoman, studio lighting, confident, modern office --ar 2:3 --v 7",desc:"Karakter tutarlılığı ile aynı kişiyi farklı sahnelerde kullanabilirsin."},
  {cat:"🍽️ Ürün",tool:"DALL-E 3",color:"#fb923c",emoji:"☕",title:"Türk Kahvesi Ürün Fotoğrafı",prompt:"Turkish coffee in elegant ceramic cup, marble surface, steam rising, professional product photography",desc:"E-ticaret için profesyonel ürün fotoğrafı — fotoğrafçı tutmana gerek yok."},
  {cat:"📱 UI/UX",tool:"Midjourney v7",color:"#60a5fa",emoji:"📱",title:"Mobil App Arayüzü",prompt:"minimal mobile app UI, dark mode, AI assistant, neon accents, glassmorphism --ar 9:16 --v 7",desc:"UI tasarım konseptleri için Midjourney giderek yaygınlaşıyor."},
  {cat:"🌿 Doğa",tool:"Midjourney v7",color:"#34d399",emoji:"🌋",title:"Kapadokya Peri Bacaları",prompt:"Cappadocia fairy chimneys sunrise, hot air balloons, golden light, photorealistic --ar 16:9 --v 7",desc:"Türkiye'nin doğal güzelliklerini AI ile yeniden keşfet."},
  {cat:"🚀 Sci-Fi",tool:"Midjourney v7",color:"#a855f7",emoji:"🚀",title:"Uzay İstasyonu",prompt:"orbital space station, Earth view, futuristic design, solar panels, cinematic --ar 21:9 --v 7",desc:"Bilim kurgu sahneleri için Midjourney ölçüsüz bir hayal gücü sunuyor."},
  {cat:"⚔️ Karakter Tasarım",tool:"Midjourney v7",color:"#f472b6",emoji:"⚔️",title:"Fantastik Savaşçı",prompt:"fantasy warrior, Anatolian armor, detailed character concept art, 4K --ar 2:3 --v 7",desc:"Oyun ve film karakteri tasarımı için hızlı konsept üretimi."},
  {cat:"🍕 Yemek",tool:"DALL-E 3",color:"#fb923c",emoji:"🥘",title:"Türk Mutfağı",prompt:"traditional Turkish cuisine spread, baklava, kebab, colorful spices, overhead shot, food photography",desc:"Restoran ve yemek blogları için profesyonel yemek fotoğrafçılığı."},
  {cat:"🌆 Şehir",tool:"Midjourney v7",color:"#60a5fa",emoji:"🌃",title:"Ankara Gece Manzarası",prompt:"Ankara Turkey night cityscape, long exposure, city lights, aerial view --ar 16:9 --v 7",desc:"Şehir manzaraları için uzun pozlama ve gece efektleri."},
  {cat:"🎨 Soyut",tool:"Adobe Firefly",color:"#00dcff",emoji:"🌈",title:"Soyut Renk Patlaması",prompt:"abstract colorful explosion, digital art, vibrant neon colors, flowing liquid, smooth gradient",desc:"Adobe Firefly, ticari kullanım için güvenli görsel üretimi sağlıyor."},
];

// Before/After örnekleri
const BEFORE_AFTER = [
  {icon:"📝",title:"Blog Yazısı",time:"3 saat → 20 dk",tools:["ChatGPT","Claude"],before:"Araştırma, yazma, düzenleme ile 3 saat emek gerektiren 1500 kelimelik blog yazısı.",after:"Claude'a konuyu ver, outline oluştur, her bölümü genişlet. 20 dk, daha iyi içerik."},
  {icon:"💻",title:"Kod Debug",time:"4 saat → 15 dk",tools:["Cursor","Claude"],before:"Stack Overflow'u didik didik aramak, 3-4 saat hata avcılığı, bazen sonuç bile yok.",after:"Hatalı kodu Cursor'a yapıştır, 'düzelt ve açıkla' de. 15 dakika, çözüm garantili."},
  {icon:"🎨",title:"Logo Tasarım",time:"1 hafta → 1 gün",tools:["Midjourney","Canva"],before:"Tasarımcıya brief ver, bekleme, revizyonlar, fatura — 1 hafta ve 2000-5000 TL.",after:"Midjourney ile 50+ konsept, Canva'da düzenle. 1 gün, sadece 200 TL."},
  {icon:"📊",title:"Pazar Araştırması",time:"2 gün → 3 saat",tools:["Perplexity","ChatGPT"],before:"Kaynak okuma, not alma, sentezleme, sunum — 2 tam iş günü.",after:"Perplexity'de kaynaklı sor, ChatGPT'de sentezle, Gamma'da sun. 3 saat."},
  {icon:"🎬",title:"Tanıtım Videosu",time:"1 ay → 1 gün",tools:["HeyGen","ElevenLabs"],before:"Senaryo, çekim, kameraman, ses, kurgu — 1 ay ve büyük bütçe.",after:"ChatGPT senaryo yazar, ElevenLabs seslendirir, HeyGen avatar video yapar. 1 gün, $30."},
  {icon:"📧",title:"E-posta Kampanyası",time:"1 hafta → 2 saat",tools:["ChatGPT","Claude"],before:"Metin yazarına brief, birden fazla revizyon, onay süreci — 1 hafta.",after:"ChatGPT ile 10 farklı e-posta varyasyonu üret, A/B test için hazır. 2 saat."},
  {icon:"📖",title:"CV Hazırlama",time:"2 gün → 30 dk",tools:["ChatGPT","Claude"],before:"Template bulmak, içerik yazmak, düzenlemek, formatlama — 2 gün.",after:"Claude'a deneyimlerini söyle, ATS uyumlu profesyonel CV anında hazır. 30 dk."},
  {icon:"🎓",title:"Sunum Hazırlama",time:"3 gün → 1 saat",tools:["Gamma","ChatGPT"],before:"İçerik araştırması, tasarım yapımı, uyum kontrolü — 3 gün, tasarımcı ücreti.",after:"Gamma'ya konuyu ver, AI otomatik tasarlar ve içerik önerir. 1 saat, profesyonel."},
];

// Kullanıcı sistemi (in-memory simülasyon)
const defaultUser = { loggedIn: false, name: "", email: "", savedTools: [], completedLessons: [], points: 0, prompts: [] };

// Prompt topluluk verileri (simüle)
const COMMUNITY_PROMPTS = [
  { user:"Ahmet K.", avatar:"👨‍💻", cat:"Kod", title:"Hata açıklayıcı", prompt:"Bu [dil] kodunu analiz et. Hataları sırala, her birinin sebebini açıkla, düzeltilmiş versiyonu yaz ve aynı hatayı tekrarlamam için ipucu ver.", likes:0, uses:0, date:"2 gün önce" },
  { user:"Zeynep M.", avatar:"👩‍🎨", cat:"İçerik", title:"Viral hook üretici", prompt:"[Konu] için TikTok/Reels videosu açılış cümlesi yaz. 5 farklı versiyon: merak uyandıran, şok edici, soru soran, istatistik ile başlayan, hikaye ile başlayan.", likes:0, uses:0, date:"3 gün önce" },
  { user:"Mert T.", avatar:"👨‍💼", cat:"İş", title:"Müzakere asistanı", prompt:"[Senaryo] durumunda müzakere ediyorum. Karşı tarafın 3 olası itirazını tahmin et ve her birine güçlü, ilişkiyi bozmayan yanıt yaz.", likes:0, uses:0, date:"4 gün önce" },
  { user:"Elif S.", avatar:"👩‍🔬", cat:"Araştırma", title:"Kaynak analizci", prompt:"Bu araştırma makalesini oku: [metin]. Bana ver: 1) Ana iddia 2) Metodoloji güçlü/zayıf yönleri 3) Sınırlılıklar 4) Gerçek hayat uygulaması 5) Eleştirel değerlendirme 1-10.", likes:0, uses:0, date:"5 gün önce" },
  { user:"Burak Y.", avatar:"👨‍🏫", cat:"Eğitim", title:"Sokratik öğretmen", prompt:"[Konu] öğrenmek istiyorum ama cevap verme. Bunun yerine, beni düşündürecek Sokratik sorular sor. Ben cevapladıkça rehberlik et ve anlayışımı derinleştir.", likes:0, uses:0, date:"1 hafta önce" },
  { user:"Ayşe D.", avatar:"👩‍💻", cat:"Yazarlık", title:"Karakter sesi üretici", prompt:"[Karakter]: [yaş], [meslek], [kişilik]. Bu karakterin sesini ve konuşma tarzını benim için örnekle. Sonra [sahne]'de bu karakteri konuştur. 3 farklı duygu durumu için.", likes:0, uses:0, date:"1 hafta önce" },
  { user:"Kerem A.", avatar:"👨‍🎨", cat:"Tasarım", title:"Marka kimliği oluşturucu", prompt:"[Marka adı] için kapsamlı marka kimliği oluştur: 1) Marka kişiliği (5 sıfat) 2) Hedef kitle profili 3) Renk paleti önerisi (hex kodlarıyla) 4) Yazı tipi önerisi 5) Marka sesi ve ton kılavuzu.", likes:0, uses:0, date:"2 hafta önce" },
  { user:"Selin K.", avatar:"👩‍💼", cat:"İş", title:"Rakip analizi", prompt:"[Şirket/ürün] için kapsamlı rakip analizi yap. Rakipler: [liste]. Her biri için: güçlü yönler, zayıf yönler, fiyatlandırma stratejisi, hedef kitle. Sonunda boşluklar ve fırsatlar.", likes:0, uses:0, date:"2 hafta önce" },
  { user:"Okan B.", avatar:"👨‍🔧", cat:"Teknik", title:"Sistem mimarı", prompt:"[Uygulama] için sistem mimarisi tasarla. Beklenen kullanıcı sayısı: [sayı]. Öner: 1) Teknoloji stack 2) Veritabanı seçimi ve gerekçesi 3) Ölçeklenme stratejisi 4) Güvenlik önlemleri 5) Tahmini maliyet.", likes:0, uses:0, date:"2 hafta önce" },
  { user:"Naz T.", avatar:"👩‍🎓", cat:"Eğitim", title:"Ders planı oluşturucu", prompt:"[Konu] için [yaş grubu] öğrencilere yönelik 1 saatlik ders planı hazırla. İçersin: giriş aktivitesi (10dk), ana konu (30dk), grup çalışması (15dk), değerlendirme (5dk). Her bölümde öğretmen notu.", likes:0, uses:0, date:"3 hafta önce" },
  { user:"Emre C.", avatar:"👨‍💻", cat:"Kod", title:"Kod dokümantasyon yazıcı", prompt:"Bu [dil] kodunu profesyonelce dokümante et:\n```[kod]```\nEkle: 1) JSDoc/docstring formatında her fonksiyon 2) Parametre açıklamaları 3) Return değerleri 4) Kullanım örnekleri 5) Olası hatalar.", likes:0, uses:0, date:"3 hafta önce" },
  { user:"Derya M.", avatar:"👩‍💰", cat:"İş", title:"Yatırım sunumu yapıcı", prompt:"[Startup/proje] için yatırımcı sunumu içeriği oluştur. Slaytlar: Problem, Çözüm, Pazar büyüklüğü, İş modeli, Rekabet, Ekip, Finansal projeksiyon, İstenen yatırım. Her slayt için 3 anahtar nokta.", likes:0, uses:0, date:"1 ay önce" },
];

// Haftalık Challenge
const WEEKLY_CHALLENGE = {
  week: "21-27 Nisan 2026",
  title: "AI ile 60 Saniyede Tanıtım Videosu",
  desc: "Bu haftanın görevi: HeyGen veya ElevenLabs kullanarak kendin veya bir ürün için 60 saniyeden kısa tanıtım videosu veya ses kaydı yap. ChatGPT ile senaryo yaz, AI sesini kullan.",
  steps: ["ChatGPT'e 'Ürün/Hizmetim için 60 saniyelik tanıtım senaryosu yaz' de","ElevenLabs'a senaryo gir, ses üret","HeyGen ile avatar video oluştur (opsiyonel)","Sonucu Instagram veya TikTok'ta @imdatai etiketle"],
  prize: "En iyi 3 katılımcı Instagram'da tanıtılacak",
  deadline: "27 Nisan 23:59",
  participants: 0,
  color: "#a855f7"
};

// Quiz sistemi
const QUIZ_DATA = [
  {q:"ChatGPT'nin 2026'daki en güncel modeli hangisi?",opts:["GPT-4","GPT-4o","GPT-5.5","GPT-3.5"],ans:2,exp:"GPT-5.5, Nisan 2026'da yayınlanan OpenAI'ın en güncel modelidir. Süper uygulama dönemini başlattı."},
  {q:"Claude Opus 4.7'nin SWE-bench skoru nedir?",opts:["%72.3","%80.8","%87.6","%91.2"],ans:2,exp:"Claude Opus 4.7, SWE-bench Verified'da %87.6 ile kodlama testlerinde lider konumda."},
  {q:"Türkiye AI web trafiğinde kaçıncı sıradadır?",opts:["3.","5.","1.","2."],ans:2,exp:"Digital 2026 raporu: Türkiye %94.49 ChatGPT kaynaklı trafikle dünya birincisi."},
  {q:"Gemini 3.1 Ultra'nın context window'u nedir?",opts:["128K","500K","1M","2M"],ans:3,exp:"Gemini 3.1 Ultra, 2 milyon token context window ile şu an rekor tutucusu."},
  {q:"Cursor hangi kod editörünü temel alıyor?",opts:["Vim","Emacs","VS Code","JetBrains"],ans:2,exp:"Cursor, VS Code üzerine inşa edilmiş. Tüm VS Code eklentileri çalışır."},
  {q:"'Chain of Thought' prompting tekniği ne sağlar?",opts:["Daha kısa cevap","Adım adım düşünme","Görsel üretim","Daha hızlı yanıt"],ans:1,exp:"CoT, AI'ın adım adım düşünmesini sağlar. Matematik ve mantık sorularında %30 daha doğru."},
  {q:"Constitutional AI hangi şirketin güvenlik yaklaşımıdır?",opts:["OpenAI","Google","Anthropic","Meta"],ans:2,exp:"Constitutional AI, Anthropic'in Claude için geliştirdiği güvenlik yaklaşımıdır."},
  {q:"1 token yaklaşık kaç kelimeye eşittir?",opts:["3-4 kelime","1 kelime","¾ kelime","5 kelime"],ans:2,exp:"1 token ≈ ¾ İngilizce kelime. Türkçe'de kelime başı 1-3 token düşer."},
  {q:"MCP protokolünü hangi şirket geliştirdi?",opts:["OpenAI","Google","Anthropic","Microsoft"],ans:2,exp:"Model Context Protocol (MCP), Anthropic tarafından geliştirildi. 97M+ kurulum var."},
  {q:"RAG ne anlama gelir?",opts:["Random AI Generator","Retrieval-Augmented Generation","Rapid API Gateway","Real AI Graph"],ans:1,exp:"RAG: Dış veri kaynaklarına erişerek güncel bilgiyle cevap üretme. Hallüsinasyonu azaltır."},
  {q:"Midjourney v7'de karakter tutarlılığı için hangi parametre kullanılır?",opts:["--style","--cref","--quality","--chaos"],ans:1,exp:"--cref (character reference) parametresi, aynı karakteri farklı sahnelerde tutarlı tutar."},
  {q:"ChatGPT Plus planının aylık ücreti nedir?",opts:["$10","$20","$50","$100"],ans:1,exp:"ChatGPT Plus $20/ay. GPT-5.5 erişimi, DALL-E 3 ve daha hızlı yanıtlar sağlar."},
  {q:"Hangi AI aracı metin-to-video üretiminde öne çıkıyor?",opts:["ElevenLabs","Gamma","Sora","Perplexity"],ans:2,exp:"OpenAI'ın Sora'sı metin-video üretiminde lider. HeyGen ve Runway da güçlü alternatifler."},
  {q:"'Hallüsinasyon' AI bağlamında ne demektir?",opts:["AI'ın yavaşlaması","Uydurma bilgiyi gerçekmiş gibi sunmak","Görsel üretim hatası","Ses kalitesi sorunu"],ans:1,exp:"AI hallüsinasyonu: Modelin güvenle yanlış veya uydurma bilgi vermesi. En kritik risk."},
  {q:"ElevenLabs'ın ücretsiz planında kaç karakter hakkı var?",opts:["5.000","10.000","50.000","Sınırsız"],ans:1,exp:"ElevenLabs ücretsiz plan ayda 10.000 karakter. Starter $5/ay ile 30.000 karaktere çıkıyor."},
  {q:"Türkiye'de AI kullanımında en popüler araç hangisi?",opts:["Gemini","Claude","ChatGPT","Copilot"],ans:2,exp:"Türkiye'de AI kullananların %90.24'ü ChatGPT tercih ediyor (Digital 2026 raporu)."},
  {q:"'Fine-tuning' ne demektir?",opts:["Sesi ince ayarlamak","Modeli özel verilerle yeniden eğitmek","API hızını artırmak","Prompt düzenlemek"],ans:1,exp:"Fine-tuning: Önceden eğitilmiş modeli kendi verilerinle yeniden eğitmek. Genel → Uzman."},
  {q:"Vibe Coding hangi yaklaşımı ifade eder?",opts:["Müzik dinleyerek kod yazmak","Kod yazmak yerine ne istediğini söylemek","Gece geç saatte kod yazmak","Takım halinde kodlamak"],ans:1,exp:"Vibe Coding: Cursor ve Claude Code gibi araçlarla kod yazmak yerine ne istediğini tarif etmek. 2026 trendi."},
  {q:"Hangi AI aracı akademik araştırma için kaynaklı cevap verir?",opts:["Midjourney","Suno","Perplexity","HeyGen"],ans:2,exp:"Perplexity, her cevabı gerçek kaynaklara dayandırır. Akademik araştırma için ideal."},
  {q:"Claude'un en uzun context window'u kaçtır?",opts:["32K","128K","500K","1M"],ans:3,exp:"Claude Opus 4.7, 1 milyon token context window ile rakiplerinden çok daha uzun metin işleyebilir."},
];

// Sosyal kanıt sayaçları
// Gerçek istatistikler Google Analytics kurulunca buraya gelecek

// Helpers
function Spin({c="#fff"}){return <span style={{width:13,height:13,border:`2px solid ${c}44`,borderTop:`2px solid ${c}`,borderRadius:"50%",animation:"spin .7s linear infinite",display:"inline-block",flexShrink:0}}/>;}
function Tag({text,color,size=9}){return <span style={{fontSize:size,background:`${color}18`,color,padding:"2px 7px",borderRadius:5,border:`1px solid ${color}28`,whiteSpace:"nowrap",fontWeight:600}}>{text}</span>;}
function Bar({val,color,h=4}){return <div style={{height:h,background:"rgba(255,255,255,0.06)",borderRadius:h,overflow:"hidden"}}><div style={{width:`${val}%`,height:"100%",background:color,borderRadius:h,transition:"width .6s"}}/></div>;}
function Card({children,color,style={},onClick}){const[hov,setHov]=useState(false);return <div onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} style={{background:"rgba(255,255,255,0.02)",border:`1px solid ${hov&&color?color+"44":"rgba(255,255,255,0.07)"}`,borderRadius:14,transition:"all .2s",transform:hov?"translateY(-2px)":"none",cursor:onClick?"pointer":"default",...style}}>{children}</div>;}

function Ticker(){
  const[p,setP]=useState(0); const t=TICKER.join("  ◆  ");
  useEffect(()=>{const id=setInterval(()=>setP(x=>x<=-(t.length*7)?0:x-1),36);return()=>clearInterval(id);},[]);
  return <div style={{background:"rgba(0,220,255,0.07)",borderBottom:"1px solid rgba(0,220,255,0.12)",padding:"6px 0",overflow:"hidden",display:"flex",alignItems:"center"}}>
    <div style={{flexShrink:0,fontSize:9,color:"#00dcff",background:"rgba(0,220,255,0.15)",padding:"3px 14px",borderRight:"1px solid rgba(0,220,255,0.2)",marginRight:16,whiteSpace:"nowrap",fontWeight:700,letterSpacing:".12em"}}>⚡ CANLI</div>
    <div style={{whiteSpace:"nowrap",fontSize:11,color:"#94a3b8",transform:`translateX(${p+1400}px)`}}>{t}  ◆  {t}</div>
  </div>;
}

function PBg(){
  const r=useRef();
  useEffect(()=>{const c=r.current;if(!c)return;const x=c.getContext("2d");c.width=c.offsetWidth;c.height=c.offsetHeight;const W=c.width,H=c.height;let af;const pts=Array.from({length:35},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25,r:Math.random()*1.3+.4,cl:Math.random()>.5?"rgba(0,220,255,":"rgba(168,85,247,"}));function d(){x.clearRect(0,0,W,H);pts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;x.beginPath();x.arc(p.x,p.y,p.r,0,Math.PI*2);x.fillStyle=p.cl+"0.45)";x.fill();});pts.forEach((a,i)=>pts.slice(i+1).forEach(b=>{const dv=Math.hypot(a.x-b.x,a.y-b.y);if(dv<90){x.beginPath();x.moveTo(a.x,a.y);x.lineTo(b.x,b.y);x.strokeStyle=`rgba(0,220,255,${(1-dv/90)*.06})`;x.lineWidth=.5;x.stroke();}}));af=requestAnimationFrame(d);}d();return()=>cancelAnimationFrame(af);},[]);
  return <canvas ref={r} style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:.5}}/>;
}

// ══════════════════════════════════════════════════════════
// SES SİSTEMİ — Web Audio API
// ══════════════════════════════════════════════════════════
const Sound = {
  ctx: null,
  init(){if(!this.ctx)this.ctx=new(window.AudioContext||window.webkitAudioContext)();},
  play(freq,dur=0.15,type="sine",vol=0.3){
    try{this.init();const o=this.ctx.createOscillator();const g=this.ctx.createGain();o.connect(g);g.connect(this.ctx.destination);o.frequency.value=freq;o.type=type;g.gain.setValueAtTime(vol,this.ctx.currentTime);g.gain.exponentialRampToValueAtTime(0.001,this.ctx.currentTime+dur);o.start();o.stop(this.ctx.currentTime+dur);}catch(e){}
  },
  correct(){this.play(880,0.1);setTimeout(()=>this.play(1100,0.15),100);},
  wrong(){this.play(220,0.3,"sawtooth",0.2);},
  click(){this.play(440,0.05,"square",0.1);},
  levelUp(){[523,659,784,1047].forEach((f,i)=>setTimeout(()=>this.play(f,0.2),i*100));},
  victory(){[523,659,784,1047,1319].forEach((f,i)=>setTimeout(()=>this.play(f,0.3),i*80));},
  tick(){this.play(660,0.05,"square",0.15);},
};

// playSound alias for compatibility
function playSound(type){
  if(type==="correct")Sound.correct();
  else if(type==="wrong")Sound.wrong();
  else if(type==="level")Sound.levelUp();
  else if(type==="victory")Sound.victory();
  else if(type==="tick")Sound.tick();
  else Sound.click();
}


// ══════════════════════════════════════════════════════════
// PARTİKEL EFEKTLERİ
// ══════════════════════════════════════════════════════════
function Particles({x,y,color="#00dcff",count=20,onDone}){
  const[pts,setPts]=useState(()=>Array.from({length:count},(_,i)=>({id:i,x,y,vx:(Math.random()-0.5)*8,vy:(Math.random()-0.5)*8-3,life:1,size:Math.random()*6+3})));
  useEffect(()=>{
    let af;let t=0;
    function tick(){
      t++;
      setPts(p=>p.map(pt=>({...pt,x:pt.x+pt.vx,y:pt.y+pt.vy,vy:pt.vy+0.2,life:pt.life-0.04})).filter(pt=>pt.life>0));
      if(t>60){onDone?.();return;}
      af=requestAnimationFrame(tick);
    }
    af=requestAnimationFrame(tick);
    return()=>cancelAnimationFrame(af);
  },[]);
  return <div style={{position:"fixed",top:0,left:0,pointerEvents:"none",zIndex:9999}}>
    {pts.map(p=><div key={p.id} style={{position:"absolute",left:p.x,top:p.y,width:p.size,height:p.size,borderRadius:"50%",background:color,opacity:p.life,transform:"translate(-50%,-50%)",boxShadow:`0 0 ${p.size*2}px ${color}`}}/>)}
  </div>;
}

function Confetti({onDone}){
  const colors=["#00dcff","#a855f7","#f472b6","#34d399","#fb923c","#fbbf24"];
  const[pts,setPts]=useState(()=>Array.from({length:80},(_,i)=>({id:i,x:Math.random()*window.innerWidth,y:-20,vx:(Math.random()-0.5)*4,vy:Math.random()*4+2,life:1,color:colors[i%colors.length],size:Math.random()*8+4,rot:Math.random()*360})));
  useEffect(()=>{let af;let t=0;function tick(){t++;setPts(p=>p.map(pt=>({...pt,x:pt.x+pt.vx,y:pt.y+pt.vy,life:pt.life-0.008,rot:pt.rot+3})));if(t>180){onDone?.();return;}af=requestAnimationFrame(tick);}af=requestAnimationFrame(tick);return()=>cancelAnimationFrame(af);},[]);
  return <div style={{position:"fixed",top:0,left:0,pointerEvents:"none",zIndex:9999,width:"100%",height:"100%",overflow:"hidden"}}>
    {pts.map(p=><div key={p.id} style={{position:"absolute",left:p.x,top:p.y,width:p.size,height:p.size,background:p.color,opacity:p.life,transform:`rotate(${p.rot}deg)`,borderRadius:2}}/>)}
  </div>;
}

// ══════════════════════════════════════════════════════════
// SCROLL ANİMASYON HOOK
// ══════════════════════════════════════════════════════════
function useScrollReveal(){
  useEffect(()=>{
    const obs=new IntersectionObserver((entries)=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");}});},{threshold:0.1});
    document.querySelectorAll(".reveal").forEach(el=>obs.observe(el));
    return()=>obs.disconnect();
  },[]);
}

// ══════════════════════════════════════════════════════════
// DÜNYA HARİTASI SİMÜLASYONU
// ══════════════════════════════════════════════════════════
const WORLD_DOTS=[
  // [x%, y%, ülke, yoğunluk 0-100, renk]
  [48,22,"Türkiye",95,"#00dcff"],[20,38,"ABD",85,"#a855f7"],[50,18,"Rusya",70,"#60a5fa"],
  [47,30,"Almanya",78,"#34d399"],[47,28,"İngiltere",82,"#f472b6"],[48,32,"Fransa",75,"#fb923c"],
  [78,25,"Çin",80,"#fbbf24"],[78,38,"Hindistan",72,"#34d399"],[84,25,"Japonya",88,"#00dcff"],
  [22,55,"Brezilya",60,"#fb923c"],[50,50,"Nijerya",40,"#a855f7"],[80,45,"Avustralya",65,"#60a5fa"],
  [46,35,"İtalya",70,"#f472b6"],[48,20,"Ukrayna",55,"#34d399"],[57,28,"Kazakistan",45,"#fbbf24"],
  [77,28,"Kore",85,"#00dcff"],[30,24,"Kanada",75,"#a855f7"],[46,26,"Polonya",68,"#60a5fa"],
  [55,32,"İran",50,"#f472b6"],[63,32,"Pakistan",55,"#fb923c"],[75,32,"Tayland",60,"#34d399"],
  [20,45,"Meksika",58,"#00dcff"],[35,35,"İspanya",72,"#a855f7"],[52,28,"Türkmenistan",35,"#60a5fa"],
];

function WorldMapSim(){
  const r=useRef();const[hover,setHover]=useState(null);const[pulseTime,setPulseTime]=useState(0);
  useEffect(()=>{const id=setInterval(()=>setPulseTime(t=>t+1),50);return()=>clearInterval(id);},[]);
  useEffect(()=>{
    const c=r.current;if(!c)return;
    const x=c.getContext("2d");const W=c.width=c.offsetWidth;const H=c.height=c.offsetHeight;
    x.clearRect(0,0,W,H);
    // Izgara çizgileri
    x.strokeStyle="rgba(0,220,255,0.04)";x.lineWidth=0.5;
    for(let i=0;i<=10;i++){x.beginPath();x.moveTo(i*W/10,0);x.lineTo(i*W/10,H);x.stroke();}
    for(let i=0;i<=5;i++){x.beginPath();x.moveTo(0,i*H/5);x.lineTo(W,i*H/5);x.stroke();}
    // Ülke noktaları
    WORLD_DOTS.forEach(([px,py,name,intensity,color])=>{
      const cx=px/100*W,cy=py/100*H;
      const pulse=Math.sin(pulseTime*0.1+px)*0.3+0.7;
      const size=3+(intensity/100)*8;
      // Glow
      const grd=x.createRadialGradient(cx,cy,0,cx,cy,size*3);
      grd.addColorStop(0,`rgba(0,220,255,${0.35*pulse})`);
      grd.addColorStop(1,'transparent');
      x.beginPath();x.arc(cx,cy,size*pulse,0,Math.PI*2);
      x.fillStyle=color+(Math.round(180*pulse).toString(16));
      x.fill();
      // Halka animasyonu
      x.beginPath();x.arc(cx,cy,size*pulse*2,0,Math.PI*2);
      x.strokeStyle=color+"44";x.lineWidth=0.5;x.stroke();
      // Türkiye için özel
      if(name==="Türkiye"){
        x.beginPath();x.arc(cx,cy,size*pulse*3,0,Math.PI*2);
        x.strokeStyle="#00dcff88";x.lineWidth=1;x.stroke();
      }
    });
  },[pulseTime]);
  return <div style={{position:"relative",width:"100%",height:220,background:"rgba(0,0,0,0.3)",borderRadius:14,overflow:"hidden",border:"1px solid rgba(0,220,255,0.1)"}}>
    <canvas ref={r} style={{width:"100%",height:"100%"}}/>
    <div style={{position:"absolute",top:8,left:12,fontSize:10,color:"#00dcff",fontWeight:700,letterSpacing:".1em"}}>🌍 DÜNYA AI KULLANIM HARİTASI</div>
    <div style={{position:"absolute",top:8,right:12,display:"flex",gap:12}}>
      {[["#00dcff","Yüksek"],["#a855f7","Orta"],["#60a5fa","Düşük"]].map(([c,l])=><div key={l} style={{display:"flex",gap:4,alignItems:"center"}}><div style={{width:6,height:6,borderRadius:"50%",background:c}}/><span style={{fontSize:9,color:"#475569"}}>{l}</span></div>)}
    </div>
    <div style={{position:"absolute",bottom:8,left:12,fontSize:10,color:"#fb923c",fontWeight:700}}>🇹🇷 Türkiye — Dünya #1 (%94.49)</div>
  </div>;
}

// ══════════════════════════════════════════════════════════
// NÖRAL AĞ SİMÜLASYONU
// ══════════════════════════════════════════════════════════
function NeuralNetSim(){
  const r=useRef();const[active,setActive]=useState(false);const[inputText,setInputText]=useState("Yapay zeka");
  useEffect(()=>{
    const c=r.current;if(!c)return;
    const x=c.getContext("2d");const W=c.width=c.offsetWidth;const H=c.height=150;
    const layers=[[0.15,0.2,0.35,0.5,0.65,0.8,0.95],[0.2,0.4,0.6,0.8],[0.3,0.5,0.7],[0.5]];
    const nodes=layers.map((layer,li)=>layer.map(ny=>({x:(li/(layers.length-1))*W*0.9+W*0.05,y:ny*H,active:Math.random()>0.5,val:Math.random()})));
    let t=0;let af;
    function draw(){
      t+=0.05;x.clearRect(0,0,W,H);
      nodes.forEach((layer,li)=>{
        if(li<nodes.length-1){
          layer.forEach(n1=>{nodes[li+1].forEach(n2=>{
            const strength=(Math.sin(t+n1.x+n2.y)*0.5+0.5);
            x.beginPath();x.moveTo(n1.x,n1.y);x.lineTo(n2.x,n2.y);
            x.strokeStyle=active?`rgba(0,220,255,${strength*0.4})`:`rgba(100,116,139,${strength*0.15})`;
            x.lineWidth=strength*(active?1.5:0.5);x.stroke();
          });});
        }
        layer.forEach(n=>{
          const pulse=Math.sin(t*2+n.x*0.01)*0.3+0.7;
          const size=(active?4:2.5)*pulse;
          x.beginPath();x.arc(n.x,n.y,size,0,Math.PI*2);
          x.fillStyle=active?`rgba(0,220,255,${pulse})`:`rgba(71,85,105,${pulse*0.6})`;
          x.fill();
          if(active){x.beginPath();x.arc(n.x,n.y,size*2.5,0,Math.PI*2);x.strokeStyle=`rgba(168,85,247,${pulse*0.3})`;x.lineWidth=0.5;x.stroke();}
        });
      });
      af=requestAnimationFrame(draw);
    }
    draw();return()=>cancelAnimationFrame(af);
  },[active]);
  return <div style={{background:"rgba(0,0,0,0.4)",borderRadius:14,padding:"16px",border:"1px solid rgba(168,85,247,0.2)"}}>
    <div style={{fontSize:10,color:"#a855f7",fontWeight:700,letterSpacing:".1em",marginBottom:10}}>🧠 NÖRAL AĞ SİMÜLASYONU — AI Nasıl Düşünür?</div>
    <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:10,flexWrap:"wrap"}}>
      <input value={inputText} onChange={e=>setInputText(e.target.value)} placeholder="Bir şeyler yaz..." style={{flex:1,minWidth:120,background:"rgba(168,85,247,0.08)",border:"1px solid rgba(168,85,247,0.2)",borderRadius:8,color:"#e2e8f0",padding:"6px 10px",fontSize:11,fontFamily:"inherit",outline:"none"}}/>
      <button onClick={()=>{setActive(true);Sound.levelUp();setTimeout(()=>setActive(false),3000);}} style={{padding:"6px 14px",borderRadius:8,border:"none",background:active?"linear-gradient(135deg,#a855f7,#00dcff)":"rgba(168,85,247,0.15)",color:active?"#fff":"#a855f7",fontSize:11,cursor:"pointer",fontFamily:"inherit",fontWeight:700,transition:"all .3s"}}>
        {active?"🔥 İşleniyor...":"⚡ İşle"}
      </button>
    </div>
    <canvas ref={r} style={{width:"100%",height:150,display:"block"}}/>
    <div style={{display:"flex",justifyContent:"space-between",marginTop:8,fontSize:9,color:"#334155"}}>
      <span>Girdi Katmanı</span><span>Gizli Katmanlar</span><span>Çıktı</span>
    </div>
  </div>;
}

// ══════════════════════════════════════════════════════════
// TOKEN YAĞMURU
// ══════════════════════════════════════════════════════════
function TokenRain(){
  const tokens=["GPT","AI","LLM","Claude","Token","Gemini","Prompt","RLHF","RAG","MCP","AGI","SWE","API","GPU","TPU","INT8","FP16","CUDA","PyTorch","TF","Llama","MoE","LoRA","PEFT","VLLM","Attn"];
  const colors=["#00dcff","#a855f7","#34d399","#f472b6","#fb923c","#60a5fa"];
  const[drops,setDrops]=useState(()=>Array.from({length:12},(_,i)=>({id:i,x:Math.random()*100,y:Math.random()*-100,speed:0.3+Math.random()*0.7,token:tokens[Math.floor(Math.random()*tokens.length)],color:colors[Math.floor(Math.random()*colors.length)],size:9+Math.random()*5,opacity:0.3+Math.random()*0.7})));
  useEffect(()=>{const id=setInterval(()=>{setDrops(d=>d.map(drop=>{const ny=drop.y+drop.speed;return ny>110?{...drop,y:-10,x:Math.random()*100,token:tokens[Math.floor(Math.random()*tokens.length)],color:colors[Math.floor(Math.random()*colors.length)]}:{...drop,y:ny};}));},40);return()=>clearInterval(id);},[]);
  return <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none",zIndex:1}}>
    {drops.map(d=><div key={d.id} style={{position:"absolute",left:`${d.x}%`,top:`${d.y}%`,color:d.color,fontSize:d.size,fontWeight:700,opacity:d.opacity,fontFamily:"monospace",textShadow:`0 0 8px ${d.color}`,transition:"none",userSelect:"none"}}>{d.token}</div>)}
  </div>;
}

// ══════════════════════════════════════════════════════════
// NAV TOOLTIP
// ══════════════════════════════════════════════════════════
const NAV_TOOLTIPS={
  home:{icon:"🏠",desc:"Ana sayfa — Tüm içeriklere hızlı erişim",count:""},
  haberler:{icon:"📰",desc:"16 güncel AI haberi — GPT, Claude, Gemini son gelişmeler",count:"16"},
  blog:{icon:"✍️",desc:"10 kapsamlı AI makalesi — Türkçe, ücretsiz",count:"10"},
  claude:{icon:"🧠",desc:"Kodlamada #1 · SWE-bench %87.6 · 1M Token",count:"6 bölüm"},
  chatgpt:{icon:"🤖",desc:"Dünyanın en popüler AI'ı · 900M kullanıcı",count:"5 bölüm"},
  gemini:{icon:"🌟",desc:"Google'ın AI'ı · 2M Token dünya rekoru",count:"4 bölüm"},
  ogrenme:{icon:"🎓",desc:"AI nedir, türleri, tarihçe, Türkiye istatistikleri",count:"5 sekme"},
  prompt:{icon:"💡",desc:"75 prompt örneği · 13 kategori · Kopyalanabilir",count:"75+"},
  karsilastirma:{icon:"🆚",desc:"5 kategoride AI araç karşılaştırması",count:"5"},
  sozluk:{icon:"📖",desc:"69 AI terimi — Türkçe açıklamalar",count:"69"},
  dizin:{icon:"🌐",desc:"40+ AI aracı · 8 kategori · Detaylı açıklamalar",count:"40+"},
  iqtest:{icon:"🧠",desc:"AI IQ Testi — 10 soru, puan, paylaşılabilir kart",count:""},
  puan:{icon:"💡",desc:"Promptunu yapıştır, Gemini puanlasın",count:""},
  oneri:{icon:"🎯",desc:"Mesleğine özel AI araç paketi",count:"6 meslek"},
  aistatus:{icon:"📡",desc:"Tüm AI araçlarının anlık durumu",count:""},
  galeri:{icon:"🎨",desc:"12 AI görseli ve prompt şablonları",count:"12"},
  quiz:{icon:"🧩",desc:"20 soruluk AI quiz — Puanlamalı",count:"20"},
  oyun:{icon:"🎮",desc:"8 interaktif AI oyunu — Ses ve efektli",count:"8"},
  topluluk:{icon:"💬",desc:"12 topluluk promptu — Paylaş ve keşfet",count:"12"},
  kariyer:{icon:"🚀",desc:"8 AI mesleği — Maaşlar ve yol haritası",count:"8"},
  para:{icon:"💰",desc:"AI ile gelir yolları — Adım adım rehber",count:"4 yol"},
  pro:{icon:"⭐",desc:"Premium özellikler — Yakında",count:""},
};

function NavTooltip({id,children}){
  const[show,setShow]=useState(false);const t=NAV_TOOLTIPS[id];
  if(!t)return children;
  return <div style={{position:"relative",display:"inline-block"}} onMouseEnter={()=>setShow(true)} onMouseLeave={()=>setShow(false)}>
    {children}
    {show&&<div style={{position:"absolute",top:"calc(100% + 8px)",left:"50%",transform:"translateX(-50%)",zIndex:999,background:"rgba(8,12,28,0.98)",border:"1px solid rgba(0,220,255,0.2)",borderRadius:10,padding:"10px 13px",minWidth:180,maxWidth:220,backdropFilter:"blur(20px)",boxShadow:"0 8px 32px rgba(0,0,0,0.6)",pointerEvents:"none",whiteSpace:"normal",animation:"fadeIn .15s ease"}}>
      <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:5}}>
        <span style={{fontSize:14}}>{t.icon}</span>
        <span style={{fontSize:11,fontWeight:700,color:"#e2e8f0"}}>{NAV_TOOLTIPS[id]&&id.charAt(0).toUpperCase()+id.slice(1)}</span>
        {t.count&&<span style={{fontSize:9,background:"rgba(0,220,255,0.15)",color:"#00dcff",padding:"1px 6px",borderRadius:4}}>{t.count}</span>}
      </div>
      <div style={{fontSize:10,color:"#64748b",lineHeight:1.5}}>{t.desc}</div>
      <div style={{position:"absolute",top:-5,left:"50%",transform:"translateX(-50%)",width:8,height:8,background:"rgba(8,12,28,0.98)",border:"1px solid rgba(0,220,255,0.2)",borderTop:"none",borderRight:"none",transform:"translateX(-50%) rotate(135deg)"}}/>
    </div>}
  </div>;
}

// ══════════════════════════════════════════════════════════
// YENİ OYUNLAR VERİSİ
// ══════════════════════════════════════════════════════════

// AI TRİVİA MARATHON — 50 soru
const TRIVIA_Q=[
  {q:"Transformer mimarisi kaç yılında yayınlandı?",o:["2015","2017","2019","2021"],a:1,c:"#00dcff",cat:"Tarih"},
  {q:"GPT'nin açılımı nedir?",o:["General Purpose Transformer","Generative Pre-trained Transformer","Global Processing Technology","Graph Processing Tool"],a:1,c:"#a855f7",cat:"Terim"},
  {q:"Anthropic'in kuruluş yılı nedir?",o:["2019","2020","2021","2022"],a:2,c:"#34d399",cat:"Şirket"},
  {q:"İlk ChatGPT hangi model üzerine çalışıyordu?",o:["GPT-2","GPT-3","GPT-3.5","GPT-4"],a:2,c:"#fb923c",cat:"Model"},
  {q:"'RLHF' ne anlama gelir?",o:["Rapid Learning Human Framework","Reinforcement Learning from Human Feedback","Recursive Language Human Filter","Real-time Learning Human Function"],a:1,c:"#f472b6",cat:"Teknik"},
  {q:"Midjourney v1 ne zaman çıktı?",o:["2020","2021","2022","2023"],a:2,c:"#60a5fa",cat:"Tarih"},
  {q:"Alan Turing testi kaç yılında önerildi?",o:["1945","1950","1956","1960"],a:1,c:"#00dcff",cat:"Tarih"},
  {q:"'Attention is All You Need' makalesi kime aittir?",o:["OpenAI","Google Brain","Anthropic","Meta AI"],a:1,c:"#a855f7",cat:"Araştırma"},
  {q:"Stable Diffusion hangi tür modele aittir?",o:["LLM","Diffusion","GAN","VAE"],a:1,c:"#34d399",cat:"Model Türü"},
  {q:"GPT-4'ün çıkış tarihi nedir?",o:["Kasım 2022","Mart 2023","Haziran 2023","Eylül 2023"],a:1,c:"#fb923c",cat:"Tarih"},
  {q:"Claude'u geliştiren şirket nedir?",o:["OpenAI","Google","Anthropic","Microsoft"],a:2,c:"#a855f7",cat:"Şirket"},
  {q:"'Hallüsinasyon' kavramı AI'da neyi ifade eder?",o:["Görsel üretim","Uydurma bilgi sunmak","Hafıza kaybı","Hız düşüşü"],a:1,c:"#f472b6",cat:"Kavram"},
  {q:"DALL-E'yi kim geliştirdi?",o:["Google","Meta","OpenAI","Stability AI"],a:2,c:"#60a5fa",cat:"Şirket"},
  {q:"Llama modeli kimin ürünüdür?",o:["OpenAI","Google","Meta","Apple"],a:2,c:"#00dcff",cat:"Şirket"},
  {q:"ElevenLabs ne tür bir AI aracıdır?",o:["Görsel üretim","Ses/TTS","Kod asistanı","Video üretim"],a:1,c:"#34d399",cat:"Araç"},
  {q:"'Context window' ne anlama gelir?",o:["Ekran boyutu","Modelin işleyebildiği max metin","Bellek hızı","Yanıt süresi"],a:1,c:"#fb923c",cat:"Teknik"},
  {q:"Perplexity AI neyi farklı yapıyor?",o:["Görsel üretir","Kaynaklı cevap verir","Kod yazar","Ses üretir"],a:1,c:"#f472b6",cat:"Araç"},
  {q:"'Fine-tuning' nedir?",o:["Model küçültme","Modeli özel veriyle yeniden eğitme","Model hızlandırma","Veri temizleme"],a:1,c:"#60a5fa",cat:"Teknik"},
  {q:"Sora'yı kim geliştirdi?",o:["Google","Runway","OpenAI","Pika"],a:2,c:"#00dcff",cat:"Şirket"},
  {q:"'RAG' ne anlama gelir?",o:["Random AI Generator","Retrieval-Augmented Generation","Rapid API Gateway","Real AI Graph"],a:1,c:"#a855f7",cat:"Teknik"},
  {q:"Cursor hangi şirket tarafından geliştirilmiştir?",o:["OpenAI","Anysphere","Microsoft","Google"],a:1,c:"#34d399",cat:"Şirket"},
  {q:"'MCP' protokolü kim tarafından geliştirildi?",o:["OpenAI","Google","Anthropic","Microsoft"],a:2,c:"#fb923c",cat:"Protokol"},
  {q:"Imagen, Google'ın hangi tür modeli?",o:["LLM","Ses","Görsel","Video"],a:2,c:"#f472b6",cat:"Model"},
  {q:"SWE-bench neyi ölçer?",o:["Yazma hızı","Yazılım mühendisliği performansı","Görsel kalite","Ses kalitesi"],a:1,c:"#60a5fa",cat:"Benchmark"},
  {q:"'Vibe coding' 2026'da neyi ifade eder?",o:["Müzikle kodlama","Söyleyerek kodlama","Görsel kodlama","Ses ile kodlama"],a:1,c:"#00dcff",cat:"Trend"},
  {q:"DeepSeek hangi ülkenin ürünüdür?",o:["ABD","Japonya","Çin","Güney Kore"],a:2,c:"#a855f7",cat:"Şirket"},
  {q:"'Temperature' parametresi ne kontrol eder?",o:["Yanıt hızı","Yaratıcılık seviyesi","Bellek kullanımı","Token sayısı"],a:1,c:"#34d399",cat:"Parametre"},
  {q:"HeyGen ne tür bir AI aracıdır?",o:["Görsel","Ses","Avatar video","Kod"],a:2,c:"#fb923c",cat:"Araç"},
  {q:"'Few-shot' prompting ne demektir?",o:["Az sorgu","2-5 örnek vererek yaptırma","Hızlı yanıt","Kısa prompt"],a:1,c:"#f472b6",cat:"Prompt"},
  {q:"OpenAI'ın değeri 2025'te kaçtır?",o:["$50M","$157B","$300B","$1T"],a:1,c:"#60a5fa",cat:"İş"},
  {q:"Constitutional AI hangi şirketin yaklaşımı?",o:["OpenAI","Google","Anthropic","Meta"],a:2,c:"#00dcff",cat:"Güvenlik"},
  {q:"Gemini 3.1 Ultra'nın context window'u kaçtır?",o:["128K","500K","1M","2M"],a:3,c:"#a855f7",cat:"Model"},
  {q:"Claude Opus 4.7'nin SWE-bench skoru?",o:["%72.3","%80.8","%87.6","%95.2"],a:2,c:"#34d399",cat:"Benchmark"},
  {q:"'Multimodal' AI ne anlama gelir?",o:["Çok dilli","Metin+görsel+ses işleyebilen","Hızlı","Güçlü"],a:1,c:"#fb923c",cat:"Kavram"},
  {q:"Türkiye AI trafiğinde kaçıncı sıradadır?",o:["3.","5.","2.","1."],a:3,c:"#f472b6",cat:"Türkiye"},
  {q:"Suno ne tür içerik üretir?",o:["Görsel","Müzik","Video","Kod"],a:1,c:"#60a5fa",cat:"Araç"},
  {q:"'Embedding' ne anlama gelir?",o:["Gömme/vektör dönüşümü","Şifreleme","Sıkıştırma","Hızlandırma"],a:0,c:"#00dcff",cat:"Teknik"},
  {q:"GitHub Copilot hangi şirketin ürünü?",o:["Google","GitHub/Microsoft","OpenAI","Meta"],a:1,c:"#a855f7",cat:"Araç"},
  {q:"'AGI' ne demektir?",o:["Advanced GPU Integration","Artificial General Intelligence","Automated Graph Intelligence","All GPU Included"],a:1,c:"#34d399",cat:"Kavram"},
  {q:"Phi modelleri kim tarafından geliştirildi?",o:["Google","OpenAI","Microsoft","Apple"],a:2,c:"#fb923c",cat:"Şirket"},
  {q:"'Zero-shot' prompting ne demektir?",o:["Hızlı prompt","Örnek vermeden yaptırma","Çok kısa prompt","Boş prompt"],a:1,c:"#f472b6",cat:"Prompt"},
  {q:"Runway ML ne tür içerik üretir?",o:["Müzik","Görsel","Video","Ses"],a:2,c:"#60a5fa",cat:"Araç"},
  {q:"'Quantization' ne yapar?",o:["Model küçültür, verimli hale getirir","Model büyütür","Model kopyalar","Model siler"],a:0,c:"#00dcff",cat:"Teknik"},
  {q:"ChatGPT'nin kaç ülkede kullanıcısı var?",o:["50+","100+","175+","200+"],a:2,c:"#a855f7",cat:"İstatistik"},
  {q:"'Agentic AI' ne demektir?",o:["Görsel AI","Otonom görev yapan AI","Sesli AI","Hızlı AI"],a:1,c:"#34d399",cat:"Kavram"},
  {q:"v0.dev ne tür bir AI aracıdır?",o:["Blog yazma","UI/React bileşen üretimi","Ses üretimi","Video üretimi"],a:1,c:"#fb923c",cat:"Araç"},
  {q:"'LoRA' tekniği ne için kullanılır?",o:["Görsel üretim","Verimli fine-tuning","Hızlı inference","Veri temizleme"],a:1,c:"#f472b6",cat:"Teknik"},
  {q:"Gamma hangi tür içerik üretir?",o:["Kod","Sunum/Prezantasyon","Görsel","Ses"],a:1,c:"#60a5fa",cat:"Araç"},
  {q:"'Task Budget' özelliği kimin ürünü?",o:["OpenAI","Google","Anthropic","Meta"],a:2,c:"#00dcff",cat:"Özellik"},
  {q:"MCP'nin kaç kurulumu var?",o:["10M+","50M+","97M+","200M+"],a:2,c:"#a855f7",cat:"İstatistik"},
];

// PROMPT ROULETTE — 40 görev
const ROULETTE_TASKS=[
  {task:"LinkedIn için viral açılış cümlesi yaz",kat:"İçerik",renk:"#00dcff",sure:30,ipucu:"Şok edici istatistikle başla"},
  {task:"Prompt mühendisliği nedir? 3 cümlede açıkla",kat:"Eğitim",renk:"#a855f7",sure:25,ipucu:"Temel tanım, neden önemli, örnek"},
  {task:"'AI ile iş bulma' için 5 anahtar kelime say",kat:"Kariyer",renk:"#34d399",sure:20,ipucu:"SEO odaklı düşün"},
  {task:"ChatGPT'ye nasıl daha iyi soru sorulur? 3 ipucu",kat:"Prompt",renk:"#fb923c",sure:30,ipucu:"Rol, bağlam, format"},
  {task:"Yapay zeka korkutucu mu? 2 cümleyle savun",kat:"Tartışma",renk:"#f472b6",sure:25,ipucu:"Araç olduğunu vurgula"},
  {task:"Midjourney ile hangi 3 şeyi üretirdin?",kat:"Yaratıcı",renk:"#60a5fa",sure:20,ipucu:"Pratik ve yaratıcı ol"},
  {task:"AI ile para kazanmanın en hızlı 3 yolu",kat:"Gelir",renk:"#fbbf24",sure:30,ipucu:"Gerçekçi, uygulanabilir"},
  {task:"Claude'un en büyük avantajı nedir?",kat:"Model",renk:"#a855f7",sure:20,ipucu:"1M token veya SWE-bench"},
  {task:"'Hallüsinasyon' nasıl önlenir? 2 yöntem",kat:"Güvenlik",renk:"#f472b6",sure:25,ipucu:"RAG, doğrulama"},
  {task:"2026'da AI'ın en çok hangi sektörü değiştirdiği?",kat:"Analiz",renk:"#34d399",sure:25,ipucu:"Sağlık, eğitim veya hukuk"},
  {task:"Mükemmel prompt için 3 kural yaz",kat:"Prompt",renk:"#00dcff",sure:30,ipucu:"Rol, bağlam, format"},
  {task:"ElevenLabs ile ne yapılabilir?",kat:"Araç",renk:"#60a5fa",sure:20,ipucu:"Ses klonlama, TTS, müzik"},
  {task:"AI öğrenmek için ücretsiz 3 kaynak öner",kat:"Eğitim",renk:"#fb923c",sure:30,ipucu:"Coursera, fast.ai, YouTube"},
  {task:"Türkiye'de AI fırsatı var mı? Neden?",kat:"Türkiye",renk:"#f472b6",sure:25,ipucu:"%94 trafik, içerik boşluğu"},
  {task:"Cursor ile geliştirme nasıl değişti?",kat:"Kod",renk:"#a855f7",sure:25,ipucu:"Vibe coding, Background Agents"},
  {task:"AI IQ testini kaçta geçerdin? Neden?",kat:"Kişisel",renk:"#34d399",sure:20,ipucu:"Dürüst ve eğlenceli ol"},
  {task:"ChatGPT Plus $20'a değer mi? 2 cümle",kat:"Fiyat",renk:"#00dcff",sure:25,ipucu:"Günlük kullanıma göre değerlendir"},
  {task:"Gemini'nin Google Drive entegrasyonu neden önemli?",kat:"Araç",renk:"#34d399",sure:25,ipucu:"Workflow, verimlilik"},
  {task:"AI ile bir blog yazısı 20 dakikada nasıl hazırlanır?",kat:"İçerik",renk:"#fb923c",sure:30,ipucu:"Outline, Claude, düzenleme"},
  {task:"'Constitutional AI' nedir? Basit anlat",kat:"Güvenlik",renk:"#f472b6",sure:25,ipucu:"AI kendi kendini denetler"},
  {task:"Dijital pazarlamada hangi 2 AI aracı şart?",kat:"Pazarlama",renk:"#60a5fa",sure:20,ipucu:"ChatGPT + Canva/Midjourney"},
  {task:"AI'ın hallüsinasyon yaptığını nasıl anlarsın?",kat:"Güvenlik",renk:"#a855f7",sure:25,ipucu:"Kaynaksız iddia, aşırı özgüven"},
  {task:"Perplexity vs ChatGPT — ne zaman Perplexity?",kat:"Karşılaştırma",renk:"#00dcff",sure:25,ipucu:"Araştırma, güncel bilgi"},
  {task:"AI ile CV nasıl güçlendirilir? 3 adım",kat:"Kariyer",renk:"#34d399",sure:30,ipucu:"Claude, ATS, sayısal başarılar"},
  {task:"Token nedir? Simit analojisiyle anlat",kat:"Eğitim",renk:"#fb923c",sure:25,ipucu:"Yaratıcı ve anlaşılır ol"},
  {task:"2027'de AI nasıl olacak? 2 tahmin",kat:"Gelecek",renk:"#f472b6",sure:25,ipucu:"AGI, ajanlar, robotik"},
  {task:"Midjourney v7 için en iyi 3 prompt ipucu",kat:"Görsel",renk:"#60a5fa",sure:30,ipucu:"--ar, --v 7, stil tanımı"},
  {task:"AI asistanı en çok hangi görevde kullanıyorsun?",kat:"Kişisel",renk:"#a855f7",sure:20,ipucu:"Gerçek ve özgün cevap"},
  {task:"LLM'leri birbirinden ne ayırır?",kat:"Teknik",renk:"#00dcff",sure:25,ipucu:"Eğitim verisi, RLHF, context"},
  {task:"AI ile müzik üretmek etik mi?",kat:"Etik",renk:"#34d399",sure:25,ipucu:"Sanatçı hakları, telif"},
  {task:"Sora ile gerçek filmden farkı var mı?",kat:"Araç",renk:"#fb923c",sure:20,ipucu:"Tutarsızlıklar, detaylar"},
  {task:"AI öğretmeni geçer mi? Tartış",kat:"Eğitim",renk:"#f472b6",sure:25,ipucu:"Kişiselleşme vs empati"},
  {task:"Prompt mühendisi olmak için ne gerekir?",kat:"Kariyer",renk:"#60a5fa",sure:30,ipucu:"Deney, model bilgisi, yazma"},
  {task:"RAG sistemi neden halüsinasyonu azaltır?",kat:"Teknik",renk:"#a855f7",sure:25,ipucu:"Gerçek kaynak, doğrulama"},
  {task:"AI ile sanat üretmek gerçek sanat mı?",kat:"Felsefe",renk:"#00dcff",sure:25,ipucu:"Yaratıcılık tanımı"},
  {task:"GPT-5.5'in en büyük yeniliği nedir?",kat:"Model",renk:"#34d399",sure:20,ipucu:"Süper uygulama, Codex entegrasyonu"},
  {task:"Türkiye'de AI startup için hangi alan en karlı?",kat:"Girişim",renk:"#fb923c",sure:30,ipucu:"Eğitim, sağlık, hukuk"},
  {task:"'Agentic AI' 2026'da hayatı nasıl değiştiriyor?",kat:"Gelecek",renk:"#f472b6",sure:25,ipucu:"Otonom görev, Background Agents"},
  {task:"Ücretsiz AI araçlarıyla aylık ne kadar kazanılabilir?",kat:"Gelir",renk:"#60a5fa",sure:25,ipucu:"Freelance, danışmanlık, içerik"},
  {task:"Claude ve ChatGPT'yi aynı anda kullanmalı mı?",kat:"Strateji",renk:"#a855f7",sure:25,ipucu:"Claude kod, ChatGPT genel"},
];

// EMOJİ TAHMİN — 50 emoji seti
const EMOJI_SETS=[
  {emoji:"🧠⚡💻",cevap:"AI Yazılım Geliştirme",ipucu:"Zeka + hız + kod"},
  {emoji:"📝🤖✨",cevap:"AI İçerik Üretimi",ipucu:"Metin + robot + büyü"},
  {emoji:"🎨🖼️✨",cevap:"Görsel AI / Midjourney",ipucu:"Sanat + görsel + sihir"},
  {emoji:"🔊🎙️🤖",cevap:"ElevenLabs / Ses AI",ipucu:"Ses + mikrofon + robot"},
  {emoji:"🧬🔬💊",cevap:"AI Sağlık Uygulamaları",ipucu:"Gen + araştırma + ilaç"},
  {emoji:"📊📈🤖",cevap:"AI Finans Analizi",ipucu:"Grafik + artış + robot"},
  {emoji:"🎬🎥✨",cevap:"AI Video Üretimi",ipucu:"Film + kamera + sihir"},
  {emoji:"🏠🔑🤖",cevap:"AI Gayrimenkul",ipucu:"Ev + anahtar + robot"},
  {emoji:"📚🧠🎓",cevap:"AI Eğitim Platformu",ipucu:"Kitap + beyin + mezuniyet"},
  {emoji:"🚗⚡🤖",cevap:"Otonom Araç AI",ipucu:"Araba + elektrik + robot"},
  {emoji:"🌍💬🤖",cevap:"AI Çeviri",ipucu:"Dünya + konuşma + robot"},
  {emoji:"🎵🎸🤖",cevap:"AI Müzik / Suno",ipucu:"Müzik + gitar + robot"},
  {emoji:"💊🩺🤖",cevap:"AI Doktor Asistanı",ipucu:"İlaç + stetoskop + robot"},
  {emoji:"📧✍️⚡",cevap:"AI E-posta Yazımı",ipucu:"Mail + yazma + hız"},
  {emoji:"🔍📖🤖",cevap:"Perplexity AI",ipucu:"Arama + okuma + robot"},
  {emoji:"💻⌨️🧠",cevap:"Cursor / Kod AI",ipucu:"Ekran + klavye + beyin"},
  {emoji:"🎯📊🤖",cevap:"AI Pazarlama",ipucu:"Hedef + grafik + robot"},
  {emoji:"🏋️💪🤖",cevap:"AI Fitness Koçu",ipucu:"Spor + güç + robot"},
  {emoji:"👨‍🍳🍳🤖",cevap:"AI Yemek Tarifi",ipucu:"Aşçı + pişirme + robot"},
  {emoji:"🌱🌿🤖",cevap:"AI Tarım",ipucu:"Bitki + doğa + robot"},
  {emoji:"⚖️📜🤖",cevap:"AI Hukuk Asistanı",ipucu:"Terazi + belge + robot"},
  {emoji:"🔐🛡️🤖",cevap:"AI Siber Güvenlik",ipucu:"Kilit + kalkan + robot"},
  {emoji:"✈️🌍🤖",cevap:"AI Seyahat Planlaması",ipucu:"Uçak + dünya + robot"},
  {emoji:"🧹🏠⚡",cevap:"AI Ev Otomasyonu",ipucu:"Temizlik + ev + hız"},
  {emoji:"👗🎨🤖",cevap:"AI Moda Tasarımı",ipucu:"Kıyafet + sanat + robot"},
  {emoji:"🎮🕹️🧠",cevap:"AI Oyun Geliştirme",ipucu:"Oyun + joystick + beyin"},
  {emoji:"🛒💳🤖",cevap:"AI E-ticaret",ipucu:"Alışveriş + kart + robot"},
  {emoji:"🌡️💉🤖",cevap:"AI Tanı Sistemi",ipucu:"Ateş + iğne + robot"},
  {emoji:"📰✍️⚡",cevap:"AI Gazetecilik",ipucu:"Haber + yazma + hız"},
  {emoji:"🏛️📚🤖",cevap:"AI Kütüphane Sistemi",ipucu:"Müze + kitap + robot"},
  {emoji:"🔭🌌🤖",cevap:"AI Astronomi",ipucu:"Teleskop + uzay + robot"},
  {emoji:"🎓📝🤖",cevap:"AI Sınav Hazırlığı",ipucu:"Mezuniyet + test + robot"},
  {emoji:"💬🌐🤖",cevap:"AI Sohbet Botu",ipucu:"Konuşma + web + robot"},
  {emoji:"🧩🎮⚡",cevap:"AI Bulmaca Çözücü",ipucu:"Bulmaca + oyun + hız"},
  {emoji:"📱📲🤖",cevap:"AI Mobil Uygulama",ipucu:"Telefon + bağlantı + robot"},
  {emoji:"🖥️💡🧠",cevap:"AGI / Genel AI",ipucu:"Ekran + fikir + beyin"},
  {emoji:"🐕🐱🤖",cevap:"AI Evcil Hayvan Bakımı",ipucu:"Köpek + kedi + robot"},
  {emoji:"🌊⚡🤖",cevap:"AI Enerji Yönetimi",ipucu:"Dalga + elektrik + robot"},
  {emoji:"🚀🛸🤖",cevap:"AI Uzay Araştırması",ipucu:"Roket + UFO + robot"},
  {emoji:"🎭🎪🤖",cevap:"AI Sanat & Eğlence",ipucu:"Tiyatro + sirk + robot"},
  {emoji:"🧪⚗️🤖",cevap:"AI İlaç Keşfi",ipucu:"Deney + kimya + robot"},
  {emoji:"📡🌐🤖",cevap:"AI İletişim Ağı",ipucu:"Anten + web + robot"},
  {emoji:"🏦💰🤖",cevap:"AI Bankacılık",ipucu:"Banka + para + robot"},
  {emoji:"🎯🏹🤖",cevap:"AI Hedefleme Sistemi",ipucu:"Hedef + ok + robot"},
  {emoji:"🌸🌺🤖",cevap:"AI Çevre Koruma",ipucu:"Çiçek + doğa + robot"},
  {emoji:"🏗️🔧🤖",cevap:"AI İnşaat Planlama",ipucu:"Bina + alet + robot"},
  {emoji:"🔬🧫🤖",cevap:"AI Biyoteknoloji",ipucu:"Mikroskop + kültür + robot"},
  {emoji:"🎼🎹🤖",cevap:"AI Beste Yapma",ipucu:"Müzik notası + piyano + robot"},
  {emoji:"🌍🗺️🤖",cevap:"AI Harita & Navigasyon",ipucu:"Dünya + harita + robot"},
  {emoji:"💡🔋🤖",cevap:"AI Enerji Tasarrufu",ipucu:"Fikir + batarya + robot"},
];

// KARİYER SİMÜLASYONU — 30 senaryo
const KARIYER_SCENARIOS=[
  {id:1,text:"2026 yılı. AI konusunda hiçbir bilgin yok. Ne yaparsın?",opts:[{t:"ChatGPT kullanmaya başla, 1 saat/gün",s:2,sonuc:"İyi başlangıç! Pratik en iyi öğretmen."},{t:"Önce teori öğren, kitap oku",s:1,sonuc:"Yavaş ilerleyeceksin. Dene-yanıl daha etkili."},{t:"Bekle, AI geçici bir trend",s:-1,sonuc:"Yanlış! AI kalıcı. Geç kaldın."}],c:"#00dcff"},
  {id:2,text:"İş hayatında Claude veya ChatGPT kullanmayı öğrendin. Bir sonraki adım?",opts:[{t:"Prompt tekniklerini derinleştir",s:2,sonuc:"Harika! Prompt kalitesi = çıktı kalitesi."},{t:"Aynı şeyleri yapmaya devam et",s:0,sonuc:"Duraksama. Sürekli öğrenmelisin."},{t:"Meslektaşlarına öğret, danışman ol",s:3,sonuc:"Mükemmel! En hızlı kariyer hamlesi."}],c:"#a855f7"},
  {id:3,text:"Şirketin AI araçlarından korkuyor. Pozisyonun tehlikede mi?",opts:[{t:"AI araçlarında uzmanlaş, değer yarat",s:3,sonuc:"Doğru! 'AI kullanan biri seni geçer.'"},{t:"Sessizce çalışmaya devam et",s:-1,sonuc:"Risk var. AI bilen birini alabilirler."},{t:"AI bölümüne geç, yeni beceriler öğren",s:2,sonuc:"İyi hamle! Şirkette dönüşümün öncüsü ol."}],c:"#34d399"},
  {id:4,text:"Freelancer olarak çalışmak istiyorsun. AI ile başlamak için?",opts:[{t:"Prompt mühendisliği hizmeti sun",s:2,sonuc:"Türkiye'de talep var, arz yok. Harika!"},{t:"AI ile içerik üretimi",s:3,sonuc:"En hızlı gelir yolu! Başla hemen."},{t:"AI danışmanlığı, şirketlere satış",s:2,sonuc:"İyi yol ama daha fazla deneyim gerek."}],c:"#fb923c"},
  {id:5,text:"Müşterinden büyük bir proje teklifi geldi. AI ile halleder misin?",opts:[{t:"Kabul et, Claude ile yap",s:3,sonuc:"Doğru cesaret! Claude Opus 4.7 güçlü."},{t:"Reddet, çok büyük",s:-1,sonuc:"Kaçırılmış fırsat. AI'la yapabilirdin."},{t:"Yarısını kabul et, test et",s:1,sonuc:"Makul ama agresif ol. Tam fiyat iste."}],c:"#f472b6"},
  {id:6,text:"AI aracını hallüsinasyon yaptı, yanlış bilgi verdi. Ne yaparsın?",opts:[{t:"Çapraz kontrol yap, her zaman doğrula",s:3,sonuc:"Mükemmel! Kritik bilgileri mutlaka doğrula."},{t:"Direkt müşteriye gönder",s:-2,sonuc:"Tehlikeli! Güven kaybedersin."},{t:"Claude'a sor, doğrulama iste",s:2,sonuc:"İyi! Farklı model çapraz doğrulama yapar."}],c:"#60a5fa"},
  {id:7,text:"AI sektöründe iş ilanı gördün. Gerekli beceriler eksik. Ne yaparsın?",opts:[{t:"Başvur, eksikleri öğrenirken tamamla",s:2,sonuc:"Doğru! İş başında öğrenme çok değerli."},{t:"Başvurma, hazır değilsin",s:-1,sonuc:"Yanlış! Hazır olmak beklersen hiç başvuramazsın."},{t:"1 ay yoğun öğren, sonra başvur",s:3,sonuc:"Harika! Hızlı öğrenme + motivasyon göster."}],c:"#fbbf24"},
  {id:8,text:"Birisi sana 'AI her şeyi yapacak, insana gerek kalmayacak' dedi.",opts:[{t:"Kısmen katılmıyorum, insan denetimi şart",s:3,sonuc:"Doğru! AI araç, insan karar verici."},{t:"Haklı, gelecek korkutucu",s:-1,sonuc:"Bu kaygı seni durdurmasın. Adapte ol."},{t:"AI gelişirse insanlar yeni işler bulur",s:2,sonuc:"İyi bakış açısı! Tarih böyle söylüyor."}],c:"#a855f7"},
];

// ══════════════════════════════════════════════════════════
// YENİ OYUN SAYFASI
// ══════════════════════════════════════════════════════════
function OyunlarPage({setPage}){
  const GAMES=[
    {id:"trivia",e:"🎯",t:"AI Trivia Marathon",d:"50 soruluk AI bilgi maratonu. Streak sistemi ile bonus puan!",c:"#00dcff",players:"12.4K",tag:"Popüler"},
    {id:"roulette",e:"🎰",t:"Prompt Rulet",d:"Rastgele görev çarkı. Her turda farklı AI meydan okuması!",c:"#f472b6",players:"8.1K",tag:"Eğlenceli"},
    {id:"dedektif",e:"🔍",t:"Model Dedektif",d:"Hangi AI modeli olduğunu tahmin et. 5 soruda bul!",c:"#fbbf24",players:"5.2K",tag:"Zeka"},
    {id:"emoji",e:"😄",t:"Emoji Tahmin",d:"Emoji'nin AI anlamını bul. Kültürel bilgi testi!",c:"#34d399",players:"9.3K",tag:"Hızlı"},
    {id:"iqtest",e:"🧠",t:"AI IQ Testi",d:"Yapay zeka bilgini ölç. Puanını arkadaşlarınla karşılaştır!",c:"#a855f7",players:"15.7K",tag:"Test"},
    {id:"cark",e:"🎡",t:"Çark-ı Felek",d:"Şansını dene! Rastgele AI araçları, promptlar ve ödüller!",c:"#fb923c",players:"6.8K",tag:"Şans"},
    {id:"quiz",e:"❓",t:"AI Quiz",d:"10 soruluk günlük AI bilgi testi. Her gün yeni sorular!",c:"#60a5fa",players:"11.2K",tag:"Günlük"},
    {id:"animasyon",e:"🎬",t:"Animasyon Galerisi",d:"24 interaktif AI animasyonu. Tam ekran izle, müzikle keşfet!",c:"#f472b6",players:"4.5K",tag:"Görsel"},
    {id:"kisilik",e:"🧪",t:"AI Kişilik Testi",d:"Senin AI profilin ne? 4 soruda kişiliğini keşfet!",c:"#00dcff",players:"7.9K",tag:"Kişisel"},
    {id:"kariyer",e:"💼",t:"Kariyer Simülasyonu",d:"AI çağında kariyer yolunu seç. Farklı senaryolar dene!",c:"#34d399",players:"3.4K",tag:"Kariyer"},
  ];
  return <div style={{padding:"28px 20px",maxWidth:960,margin:"0 auto"}}>
    <div style={{marginBottom:24}}>
      <div style={{fontSize:9,letterSpacing:".2em",color:"#f472b6",marginBottom:5}}>OYUNLAR & İNTERAKTİF</div>
      <div style={{fontSize:24,fontWeight:900,color:"#e2e8f0",fontFamily:"Space Grotesk,sans-serif",marginBottom:6}}>🎮 Tüm Oyunlar</div>
      <div style={{fontSize:12,color:"#64748b"}}>{GAMES.length} interaktif oyun ve uygulama · Her gün güncellenen sorular · Puan sistemi</div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:14}}>
      {GAMES.map(g=>(
        <div key={g.id} onClick={()=>setPage(g.id)} style={{background:g.c+"06",border:"1px solid "+g.c+"20",borderRadius:16,padding:"18px",cursor:"pointer",transition:"all .2s",position:"relative"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 12px 32px "+g.c+"22";e.currentTarget.style.borderColor=g.c+"50";}} onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";e.currentTarget.style.borderColor=g.c+"20";}}>
          <div style={{position:"absolute",top:12,right:12,fontSize:9,color:g.c,background:g.c+"15",padding:"2px 8px",borderRadius:5,fontWeight:700}}>{g.tag}</div>
          <div style={{fontSize:40,marginBottom:12}}>{g.e}</div>
          <div style={{fontSize:14,fontWeight:800,color:"#e2e8f0",fontFamily:"Space Grotesk,sans-serif",marginBottom:6}}>{g.t}</div>
          <div style={{fontSize:11,color:"#64748b",lineHeight:1.6,marginBottom:12}}>{g.d}</div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:9,color:"#334155"}}>👥 {g.players} oynadı</span>
            <div style={{padding:"6px 16px",borderRadius:8,background:"linear-gradient(135deg,"+g.c+","+g.c+"aa)",color:"#fff",fontSize:11,fontWeight:700}}>Oyna →</div>
          </div>
        </div>
      ))}
    </div>
  </div>;
}

function TriviaMarathon(){
  const[phase,setPhase]=useState("intro");const[qi,setQi]=useState(0);const[score,setScore]=useState(0);const[streak,setStreak]=useState(0);const[maxStreak,setMaxStreak]=useState(0);const[sel,setSel]=useState(null);const[shown,setShown]=useState(false);const[confetti,setConfetti]=useState(false);const[particles,setParticles]=useState(null);const[timer,setTimer]=useState(20);
  const q=TRIVIA_Q[qi];
  useEffect(()=>{if(phase!=="test"||shown)return;const id=setInterval(()=>{setTimer(t=>{if(t<=1){clearInterval(id);handleTimeout();return 0;}Sound.tick();return t-1;});},1000);return()=>clearInterval(id);},[phase,qi,shown]);
  function handleTimeout(){setSel(-1);setShown(true);setStreak(0);}
  function answer(i,e){
    if(shown)return;Sound.click();setSel(i);setShown(true);
    const correct=i===q.a;
    if(correct){
      const pts=10+(streak*5)+Math.max(0,timer*2);setScore(s=>s+pts);
      const ns=streak+1;setStreak(ns);setMaxStreak(m=>Math.max(m,ns));
      Sound.correct();
      if(ns>=3)Sound.levelUp();
      const rect=e?.currentTarget?.getBoundingClientRect();
      setParticles({x:rect?.left||200,y:rect?.top||300,color:q.c});
    }else{Sound.wrong();setStreak(0);}
  }
  function next(){
    if(qi<TRIVIA_Q.length-1){setQi(i=>i+1);setSel(null);setShown(false);setTimer(20);}
    else{setPhase("result");Sound.victory();setConfetti(true);}
  }
  return <div style={{padding:"28px 20px",maxWidth:700,margin:"0 auto"}}>
    {confetti&&<Confetti onDone={()=>setConfetti(false)}/>}
    {particles&&<Particles x={particles.x} y={particles.y} color={particles.color} onDone={()=>setParticles(null)}/>}
    {phase==="intro"&&<div style={{textAlign:"center"}}>
      <div style={{fontSize:56,marginBottom:16,animation:"float 3s ease-in-out infinite"}}>🏆</div>
      <div style={{fontSize:24,fontWeight:900,color:"#e2e8f0",fontFamily:"'Space Grotesk',sans-serif",marginBottom:8}}>AI Trivia Marathon</div>
      <div style={{fontSize:13,color:"#64748b",marginBottom:24,lineHeight:1.7}}>50 soruluk AI bilgi maratonu. Streak sistemi ile bonus puan. Ne kadar uzun tutabilirsin?</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,maxWidth:360,margin:"0 auto 28px"}}>
        {[["🔥","Streak","Bonus puan"],["⏱️","20sn","Her soru"],["🏅","50","Soru sayısı"]].map(([e,t,d])=>(
          <div key={t} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(168,85,247,0.2)",borderRadius:12,padding:"14px"}}>
            <div style={{fontSize:22,marginBottom:5}}>{e}</div><div style={{fontSize:12,fontWeight:700,color:"#a855f7"}}>{t}</div><div style={{fontSize:10,color:"#475569"}}>{d}</div>
          </div>
        ))}
      </div>
      <button onClick={()=>setPhase("test")} className="btn-primary" style={{padding:"14px 40px",fontSize:15,borderRadius:12,fontFamily:"inherit"}}>Maratonu Başlat 🚀</button>
    </div>}
    {phase==="test"&&<div>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:10,flexWrap:"wrap",gap:8}}>
        <div style={{display:"flex",gap:12,alignItems:"center"}}>
          <div style={{fontSize:11,color:"#64748b"}}>Soru {qi+1}/50</div>
          <Tag text={q.cat} color={q.c} size={9}/>
        </div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          {streak>=2&&<div style={{fontSize:11,color:"#fb923c",fontWeight:700,animation:"pulse 1s infinite"}}>🔥 {streak} Streak!</div>}
          <div style={{fontSize:12,fontWeight:700,color:"#34d399"}}>⭐ {score}</div>
          <div style={{fontSize:12,fontWeight:700,color:timer<=5?"#f472b6":timer<=10?"#fb923c":"#94a3b8",transition:"color .3s"}}>⏱️ {timer}s</div>
        </div>
      </div>
      <div style={{height:5,background:"rgba(255,255,255,0.06)",borderRadius:3,marginBottom:4}}>
        <div style={{width:`${(qi/50)*100}%`,height:"100%",background:`linear-gradient(90deg,${q.c},#a855f7)`,borderRadius:3,transition:"width .4s"}}/>
      </div>
      <div style={{height:3,background:"rgba(255,255,255,0.04)",borderRadius:2,marginBottom:20}}>
        <div style={{width:`${(timer/20)*100}%`,height:"100%",background:timer<=5?"#f472b6":timer<=10?"#fb923c":"#00dcff",borderRadius:2,transition:"width 1s linear"}}/>
      </div>
      <div style={{background:"rgba(255,255,255,0.03)",border:`1px solid ${q.c}30`,borderRadius:16,padding:"20px",marginBottom:16}}>
        <div style={{fontSize:15,fontWeight:700,color:"#e2e8f0",lineHeight:1.6,fontFamily:"'Space Grotesk',sans-serif"}}>{q.q}</div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
        {q.o.map((o,i)=>{
          let bg="rgba(255,255,255,0.03)",bc=`${q.c}20`,color="#94a3b8";
          if(shown){if(i===q.a){bg="rgba(52,211,153,0.12)";bc="rgba(52,211,153,0.5)";color="#34d399";}
          else if(i===sel&&i!==q.a){bg="rgba(244,114,182,0.12)";bc="rgba(244,114,182,0.5)";color="#f472b6";}}
          else if(sel===i){bg=`${q.c}15`;bc=`${q.c}50`;color=q.c;}
          return <button key={i} onClick={(e)=>answer(i,e)} style={{padding:"13px 16px",borderRadius:11,border:`1px solid ${bc}`,background:bg,color,fontSize:13,textAlign:"left",cursor:shown?"default":"pointer",fontFamily:"inherit",transition:"all .2s",transform:shown&&i===q.a?"scale(1.01)":"scale(1)"}}>{["A","B","C","D"][i]}. {o}</button>;
        })}
      </div>
      {shown&&<div>
        <div style={{background:`${q.c}08`,border:`1px solid ${q.c}25`,borderRadius:11,padding:"12px",fontSize:12,color:"#94a3b8",marginBottom:12,lineHeight:1.7}}>{sel===q.a?`🎯 Doğru! +${10+(streak*5)} puan`:"❌ Yanlış — "} {TRIVIA_Q[qi].q}</div>
        <button onClick={next} className="btn-primary" style={{width:"100%",padding:"12px",fontSize:14,borderRadius:12,fontFamily:"inherit"}}>{qi<49?"Sonraki →":"Sonucu Gör 🏆"}</button>
      </div>}
    </div>}
    {phase==="result"&&<div style={{textAlign:"center"}}>
      <div style={{background:"linear-gradient(135deg,rgba(168,85,247,0.1),rgba(0,220,255,0.08))",border:"1px solid rgba(0,220,255,0.3)",borderRadius:20,padding:"32px",marginBottom:20}}>
        <div style={{fontSize:56,marginBottom:10}}>🏆</div>
        <div style={{fontSize:20,fontWeight:900,fontFamily:"'Space Grotesk',sans-serif",color:"#e2e8f0",marginBottom:6}}>Marathon Tamamlandı!</div>
        <div style={{fontSize:40,fontWeight:900,color:"#00dcff",marginBottom:4}}>⭐ {score}</div>
        <div style={{fontSize:13,color:"#64748b",marginBottom:20}}>Max Streak: 🔥{maxStreak} · 50/50 soru tamamlandı</div>
        <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
          <button onClick={()=>navigator.clipboard?.writeText(`IMDATAI AI Trivia Marathon'da ${score} puan aldım! 🏆 Max streak: ${maxStreak}\nSen kaç alırsın? imdatai.com`)} style={{padding:"10px 20px",borderRadius:10,border:"1px solid rgba(0,220,255,0.3)",background:"rgba(0,220,255,0.1)",color:"#00dcff",fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>📋 Paylaş</button>
          <button onClick={()=>{setPhase("intro");setQi(0);setScore(0);setStreak(0);setSel(null);setShown(false);setTimer(20);}} className="btn-primary" style={{padding:"10px 20px",fontSize:12,borderRadius:10,fontFamily:"inherit"}}>🔄 Tekrar</button>
        </div>
      </div>
    </div>}
  </div>;
}

function PromptRoulette(){
  const[phase,setPhase]=useState("intro");const[score,setScore]=useState(0);const[taskIdx,setTaskIdx]=useState(null);const[timer,setTimer]=useState(30);const[inp,setInp]=useState("");const[done,setDone]=useState(false);const[round,setRound]=useState(0);const[history,setHistory]=useState([]);const[particles,setParticles]=useState(null);
  const task=taskIdx!==null?ROULETTE_TASKS[taskIdx]:null;
  useEffect(()=>{if(phase!=="game"||done)return;const id=setInterval(()=>{setTimer(t=>{if(t<=1){clearInterval(id);timeout();return 0;}Sound.tick();return t-1;});},1000);return()=>clearInterval(id);},[phase,taskIdx,done]);
  function spinRoulette(){const idx=Math.floor(Math.random()*ROULETTE_TASKS.length);setTaskIdx(idx);setTimer(ROULETTE_TASKS[idx].sure);setInp("");setDone(false);setPhase("game");Sound.click();}
  function timeout(){setDone(true);Sound.wrong();}
  function submit(e){
    if(!inp.trim()||done)return;
    const pts=Math.round(10+timer*2+(inp.length>50?5:0));setScore(s=>s+pts);setDone(true);setRound(r=>r+1);
    setHistory(h=>[...h,{task:task.task,cevap:inp,puan:pts}]);Sound.correct();
    setParticles({x:e.currentTarget.getBoundingClientRect().left,y:e.currentTarget.getBoundingClientRect().top,color:task.renk});
  }
  return <div style={{padding:"28px 20px",maxWidth:680,margin:"0 auto"}}>
    {particles&&<Particles x={particles.x} y={particles.y} color={particles.color} onDone={()=>setParticles(null)}/>}
    {phase==="intro"&&<div style={{textAlign:"center"}}>
      <div style={{fontSize:56,marginBottom:16,animation:"float 3s ease-in-out infinite"}}>🎰</div>
      <div style={{fontSize:24,fontWeight:900,color:"#e2e8f0",fontFamily:"'Space Grotesk',sans-serif",marginBottom:8}}>Prompt Roulette</div>
      <div style={{fontSize:13,color:"#64748b",marginBottom:24,lineHeight:1.7}}>Rastgele görev gelir. 30 saniyede cevap yaz. Ne kadar çok puan alabilirsin?</div>
      <button onClick={spinRoulette} className="btn-primary" style={{padding:"14px 40px",fontSize:15,borderRadius:12,fontFamily:"inherit"}}>🎰 Çevir!</button>
    </div>}
    {phase==="game"&&task&&<div>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:14,flexWrap:"wrap",gap:8}}>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <Tag text={task.kat} color={task.renk}/>
          <div style={{fontSize:11,color:"#64748b"}}>Tur {round+1}</div>
        </div>
        <div style={{display:"flex",gap:10}}>
          <div style={{fontSize:12,fontWeight:700,color:"#34d399"}}>⭐ {score}</div>
          <div style={{fontSize:14,fontWeight:900,color:timer<=5?"#f472b6":timer<=10?"#fb923c":"#94a3b8"}}>{timer}s</div>
        </div>
      </div>
      <div style={{height:4,background:"rgba(255,255,255,0.06)",borderRadius:2,marginBottom:20}}>
        <div style={{width:`${(timer/task.sure)*100}%`,height:"100%",background:timer<=5?"#f472b6":timer<=10?"#fb923c":task.renk,transition:"width 1s linear",borderRadius:2}}/>
      </div>
      <div style={{background:`${task.renk}08`,border:`1px solid ${task.renk}30`,borderRadius:16,padding:"22px",marginBottom:16,textAlign:"center"}}>
        <div style={{fontSize:9,color:task.renk,letterSpacing:".1em",marginBottom:8}}>GÖREV</div>
        <div style={{fontSize:18,fontWeight:800,color:"#e2e8f0",fontFamily:"'Space Grotesk',sans-serif",marginBottom:10}}>{task.task}</div>
        <div style={{fontSize:11,color:"#64748b",fontStyle:"italic"}}>💡 İpucu: {task.ipucu}</div>
      </div>
      {!done?<div>
        <textarea value={inp} onChange={e=>setInp(e.target.value)} rows={3} style={{width:"100%",background:"rgba(255,255,255,0.03)",border:`1px solid ${task.renk}30`,borderRadius:12,color:"#e2e8f0",padding:"14px",fontSize:13,fontFamily:"inherit",outline:"none",resize:"none",boxSizing:"border-box",marginBottom:12}} placeholder="Cevabını yaz..."/>
        <div style={{display:"flex",gap:10}}>
          <button onClick={submit} disabled={!inp.trim()} className="btn-primary" style={{flex:1,padding:"12px",fontSize:14,borderRadius:12,fontFamily:"inherit",opacity:inp.trim()?1:0.5}}>✅ Gönder</button>
          <button onClick={spinRoulette} style={{padding:"12px 18px",borderRadius:12,border:"1px solid rgba(255,255,255,0.1)",background:"transparent",color:"#475569",cursor:"pointer",fontSize:13,fontFamily:"inherit"}}>Geç</button>
        </div>
      </div>:<div>
        <div style={{background:inp.trim()?"rgba(52,211,153,0.08)":"rgba(244,114,182,0.08)",border:`1px solid ${inp.trim()?"rgba(52,211,153,0.3)":"rgba(244,114,182,0.3)"}`,borderRadius:12,padding:"14px",marginBottom:14,fontSize:12,color:"#94a3b8",lineHeight:1.7}}>
          {inp.trim()?`✅ Harika! +${Math.round(10+timer*2+(inp.length>50?5:0))} puan kazandın!`:"⏰ Süre bitti!"}
        </div>
        <button onClick={spinRoulette} className="btn-primary" style={{width:"100%",padding:"12px",fontSize:14,borderRadius:12,fontFamily:"inherit"}}>🎰 Yeni Görev!</button>
      </div>}
    </div>}
  </div>;
}

function EmojiTahmin(){
  const[phase,setPhase]=useState("intro");const[idx,setIdx]=useState(0);const[inp,setInp]=useState("");const[shown,setShown]=useState(false);const[score,setScore]=useState(0);const[particles,setParticles]=useState(null);
  const q=EMOJI_SETS[idx];
  function check(){
    if(!inp.trim())return;setShown(true);
    const normalized=inp.toLowerCase().replace(/\s+/g," ").trim();
    const correct=q.cevap.toLowerCase();
    if(correct.includes(normalized)||normalized.includes(correct.split(" ")[0].toLowerCase())){setScore(s=>s+10);Sound.correct();setParticles({x:200,y:300,color:"#fb923c"});}
    else Sound.wrong();
  }
  function next(){setIdx(i=>(i+1)%EMOJI_SETS.length);setInp("");setShown(false);Sound.click();}
  return <div style={{padding:"28px 20px",maxWidth:580,margin:"0 auto",textAlign:"center"}}>
    {particles&&<Particles x={particles.x} y={particles.y} color={particles.color} count={30} onDone={()=>setParticles(null)}/>}
    {phase==="intro"&&<div>
      <div style={{fontSize:64,marginBottom:16,animation:"float 3s ease-in-out infinite"}}>😀</div>
      <div style={{fontSize:24,fontWeight:900,color:"#e2e8f0",fontFamily:"'Space Grotesk',sans-serif",marginBottom:8}}>AI Emoji Tahmin</div>
      <div style={{fontSize:13,color:"#64748b",marginBottom:24}}>Emojileri gör, AI kavramını tahmin et. 50 farklı konu!</div>
      <button onClick={()=>setPhase("game")} className="btn-primary" style={{padding:"14px 40px",fontSize:15,borderRadius:12,fontFamily:"inherit"}}>Oyna! 🎮</button>
    </div>}
    {phase==="game"&&<div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div style={{fontSize:11,color:"#64748b"}}>{idx+1}/{EMOJI_SETS.length}</div>
        <div style={{fontSize:14,fontWeight:800,color:"#fb923c"}}>⭐ {score}</div>
      </div>
      <div style={{background:"linear-gradient(135deg,rgba(251,146,60,0.1),rgba(0,0,0,0))",border:"1px solid rgba(251,146,60,0.3)",borderRadius:20,padding:"32px",marginBottom:20}}>
        <div style={{fontSize:72,marginBottom:8,letterSpacing:8,filter:shown?"none":"blur(0)"}}>{q.emoji}</div>
        <div style={{fontSize:11,color:"#475569"}}>💡 İpucu: {q.ipucu}</div>
      </div>
      {!shown?<div>
        <input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&check()} style={{width:"100%",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(251,146,60,0.2)",borderRadius:12,color:"#e2e8f0",padding:"14px 16px",fontSize:14,fontFamily:"inherit",outline:"none",textAlign:"center",marginBottom:12,boxSizing:"border-box"}} placeholder="Ne olduğunu tahmin et..."/>
        <button onClick={check} disabled={!inp.trim()} className="btn-primary" style={{width:"100%",padding:"12px",fontSize:14,borderRadius:12,fontFamily:"inherit"}}>Tahmin Et!</button>
      </div>:<div>
        <div style={{background:q.cevap.toLowerCase().includes(inp.toLowerCase().split(" ")[0])?"rgba(52,211,153,0.1)":"rgba(244,114,182,0.1)",border:`1px solid ${q.cevap.toLowerCase().includes(inp.toLowerCase().split(" ")[0])?"rgba(52,211,153,0.4)":"rgba(244,114,182,0.4)"}`,borderRadius:12,padding:"16px",marginBottom:14}}>
          <div style={{fontSize:13,fontWeight:700,color:"#e2e8f0",marginBottom:4}}>{q.cevap}</div>
          <div style={{fontSize:11,color:"#64748b"}}>{q.ipucu}</div>
        </div>
        <button onClick={next} className="btn-primary" style={{width:"100%",padding:"12px",fontSize:14,borderRadius:12,fontFamily:"inherit"}}>Sonraki →</button>
      </div>}
    </div>}
  </div>;
}

// Aliases for routing compatibility
const EmojiGuess = EmojiTahmin;
const KariyerSimPage = KariyerSim;

// ══ MODEL DEDEKTİF ══
const DEDEKTIF_Q=[
  {text:"Yapay zekanın geleceği konusunda hem heyecanlı hem de endişeliyim. İş piyasasındaki etkileri beni düşündürüyor.",model:"İnsan",ipucu:"Karma duygu + belirsizlik insani özellik"},
  {text:"2026 yılı itibarıyla ChatGPT, GPT-5.5 modeli ile süper uygulama dönemini başlatmıştır. Kod, tarayıcı ve ses tek platformda birleşmiştir.",model:"ChatGPT",ipucu:"Ansiklopedik dil, kesin tarih, teknik özet GPT tarzı"},
  {text:"İlginç bir soru. Bu konuyu birden fazla açıdan değerlendirmek gerekiyor: hem etik boyutu hem de pratik sonuçları açısından.",model:"Claude",ipucu:"Nüanslı yaklaşım, etik vurgu, yapılandırılmış düşünme Claude'a özgü"},
  {text:"Merhaba! Bugün çok güzel bir gün. Balkonuma oturdum, kahvemi içiyorum. Siz ne yapıyorsunuz?",model:"İnsan",ipucu:"Kişisel anı, gündelik dil, soru sona ekleme insan özelliği"},
  {text:"Google'ın Gemini modeli, 2 milyon token context window kapasitesiyle tüm rakiplerini geride bırakmaktadır.",model:"Gemini",ipucu:"Google ürününü öne çıkarma, teknik terimler, Gemini tarzı"},
  {text:"Kod yazarken fark ettim: bazen en basit çözüm en iyisidir. 3 gün uğraştım, sonunda 2 satırla hallettim.",model:"İnsan",ipucu:"Kişisel deneyim, zaman belirtimi, duygusal sonuç insan yazısı"},
  {text:"Bu soruyu yanıtlamak için öncelikle terminolojiyi netleştirmem gerekiyor. 'Yapay zeka' çok geniş bir kavramsal alanı kapsar.",model:"Claude",ipucu:"Tanım netleştirme, akademik ton, geniş perspektif Claude'a özgü"},
  {text:"Haha ya bu çok komik oldu. Arkadaşım tam o anda geldi ve her şeyi mahvetti lol. Neyse olsun.",model:"İnsan",ipucu:"Günlük konuşma, 'lol', kısaltmalar insan yazısı"},
  {text:"ChatGPT vs Claude karşılaştırmasında şu faktörler incelenmeli: context window uzunluğu, kod performansı ve hallüsinasyon oranları.",model:"ChatGPT",ipucu:"Maddeli yapı, profesyonel ton, karşılaştırmalı analiz GPT tarzı"},
  {text:"Türkiye'de AI kullanımının bu kadar yüksek olması gerçekten şaşırtıcı. Sanırım Türk insanının teknolojiye açıklığı etkili.",model:"İnsan",ipucu:"Kişisel yorum, 'sanırım', tahmin insan yazısı"},
  {text:"İstanbul'u ziyaret edecekseniz, Kapalıçarşı ve Boğaz turu mutlaka yapılması gereken aktiviteler arasında yer alır.",model:"Gemini",ipucu:"Turizm dili, tavsiye üslubu, Gemini bu tarzı çok kullanır"},
  {text:"Bu konuda kesin bir cevap vermek doğru olmaz. Ancak mevcut kanıtlar pek çok faktörün etkili olduğunu gösteriyor.",model:"Claude",ipucu:"Belirsizliği kabul, kanıt odaklı, dikkatli ifade Claude'a özgü"},
];

function ModelDedektifPage(){
  const[phase,setPhase]=useState("menu");const[qi,setQi]=useState(0);const[sel,setSel]=useState(null);const[shown,setShown]=useState(false);const[score,setScore]=useState(0);
  const q=DEDEKTIF_Q[qi%DEDEKTIF_Q.length];
  const opts=["İnsan","ChatGPT","Claude","Gemini"];
  function guess(o){if(shown)return;setSel(o);setShown(true);if(o===q.model){setScore(s=>s+15);playSound("correct");}else playSound("wrong");}
  function next(){if(qi>=DEDEKTIF_Q.length-1)setPhase("end");else{setQi(i=>i+1);setSel(null);setShown(false);}}
  return <div style={{padding:"28px 20px",maxWidth:680,margin:"0 auto"}}>
    {phase==="menu"&&<div style={{textAlign:"center"}}>
      <div style={{fontSize:52,marginBottom:16,animation:"float 2s ease-in-out infinite"}}>🔍</div>
      <div style={{fontSize:26,fontWeight:900,color:"#00dcff",fontFamily:"'Space Grotesk',sans-serif",marginBottom:8}}>Model Dedektif</div>
      <div style={{fontSize:13,color:"#64748b",marginBottom:24}}>Bu metni kim yazdı? İnsan mı, ChatGPT mi, Claude mu, Gemini mi?<br/>{DEDEKTIF_Q.length} farklı metin örneği!</div>
      <button onClick={()=>{setPhase("play");setQi(0);setSel(null);setShown(false);setScore(0);}} className="btn-primary" style={{padding:"14px 40px",fontSize:15,borderRadius:12,fontFamily:"inherit"}}>Dedektif Ol 🔍</button>
    </div>}
    {phase==="play"&&<div>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
        <div style={{fontSize:12,color:"#475569"}}>{qi+1}/{DEDEKTIF_Q.length}</div>
        <div style={{fontSize:12,color:"#00dcff",fontWeight:700}}>💎 {score} puan</div>
      </div>
      <div style={{height:4,background:"rgba(255,255,255,0.06)",borderRadius:2,marginBottom:18}}>
        <div style={{width:`${((qi+1)/DEDEKTIF_Q.length)*100}%`,height:"100%",background:"linear-gradient(90deg,#00dcff,#a855f7)",borderRadius:2}}/>
      </div>
      <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(0,220,255,0.15)",borderRadius:16,padding:"22px",marginBottom:16}}>
        <div style={{fontSize:9,color:"#334155",marginBottom:8}}>BU METNİ KİM YAZDI?</div>
        <div style={{fontSize:13,color:"#94a3b8",lineHeight:1.8,fontStyle:"italic"}}>"{q.text}"</div>
        {shown&&<div style={{marginTop:12,fontSize:11,color:"#64748b",background:"rgba(0,0,0,0.2)",borderRadius:8,padding:"8px 12px"}}>💡 {q.ipucu}</div>}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
        {opts.map(o=>{
          const oc={İnsan:"#34d399",ChatGPT:"#00dcff",Claude:"#a855f7",Gemini:"#fb923c"}[o]||"#475569";
          let bg=`${oc}06`,bord=`${oc}18`,tc="#94a3b8";
          if(shown){if(o===q.model){bg=`${oc}12`;bord=`${oc}40`;tc=oc;}else if(o===sel){bg="rgba(244,114,182,0.12)";bord="rgba(244,114,182,0.4)";tc="#f472b6";}}
          else if(sel===o){bg=`${oc}10`;bord=`${oc}30`;tc=oc;}
          return <button key={o} onClick={()=>guess(o)} style={{padding:"14px",borderRadius:12,border:`1px solid ${bord}`,background:bg,color:tc,fontSize:12,cursor:shown?"default":"pointer",fontFamily:"inherit",fontWeight:600}}>
            {{İnsan:"👤",ChatGPT:"🤖",Claude:"🧠",Gemini:"🌟"}[o]} {o}
          </button>;
        })}
      </div>
      {shown&&<button onClick={next} className="btn-primary" style={{width:"100%",padding:"12px",borderRadius:12,fontSize:14,fontFamily:"inherit"}}>{qi<DEDEKTIF_Q.length-1?"Sonraki →":"Sonuç 🏆"}</button>}
    </div>}
    {phase==="end"&&<div style={{textAlign:"center"}}>
      <div style={{fontSize:52,marginBottom:12}}>🔍</div>
      <div style={{fontSize:22,fontWeight:900,color:"#00dcff",fontFamily:"'Space Grotesk',sans-serif",marginBottom:16}}>{score}/{DEDEKTIF_Q.length*15} Puan!</div>
      <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
        <button onClick={()=>navigator.clipboard?.writeText(`Model Dedektif'te ${score} puan aldım! 🔍 imdatai.com #IMDATAI`)} style={{padding:"10px 20px",borderRadius:10,border:"1px solid rgba(0,220,255,0.3)",background:"rgba(0,220,255,0.08)",color:"#00dcff",fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>📋 Paylaş</button>
        <button onClick={()=>{setPhase("play");setQi(0);setSel(null);setShown(false);setScore(0);}} className="btn-primary" style={{padding:"10px 24px",fontSize:13,borderRadius:10,fontFamily:"inherit"}}>🔄 Tekrar</button>
      </div>
    </div>}
  </div>;
}

function KariyerSim(){
  const[phase,setPhase]=useState("intro");const[si,setSi]=useState(0);const[score,setScore]=useState(0);const[sonuclar,setSonuclar]=useState([]);const[shown,setShown]=useState(false);const[sel,setSel]=useState(null);const[confetti,setConfetti]=useState(false);
  const s=KARIYER_SCENARIOS[si];
  function choose(opt,i){if(shown)return;setSel(i);setShown(true);setScore(sc=>sc+Math.max(0,opt.s));setSonuclar(r=>[...r,{senaryo:s.text,secim:opt.t,sonuc:opt.sonuc,puan:opt.s}]);if(opt.s>=2)Sound.correct();else if(opt.s<0)Sound.wrong();else Sound.click();}
  function next(){if(si<KARIYER_SCENARIOS.length-1){setSi(i=>i+1);setShown(false);setSel(null);}else{setPhase("result");Sound.victory();setConfetti(true);}}
  const maxPuan=KARIYER_SCENARIOS.reduce((s,sc)=>s+Math.max(...sc.opts.map(o=>o.s)),0);
  return <div style={{padding:"28px 20px",maxWidth:680,margin:"0 auto"}}>
    {confetti&&<Confetti onDone={()=>setConfetti(false)}/>}
    {phase==="intro"&&<div style={{textAlign:"center"}}>
      <div style={{fontSize:56,marginBottom:16,animation:"float 3s ease-in-out infinite"}}>💼</div>
      <div style={{fontSize:24,fontWeight:900,color:"#e2e8f0",fontFamily:"'Space Grotesk',sans-serif",marginBottom:8}}>AI Kariyer Simülasyonu</div>
      <div style={{fontSize:13,color:"#64748b",marginBottom:24,lineHeight:1.7}}>8 gerçek hayat senaryosu. Seçimlerinle AI kariyerini şekillendir. Doğru kararlar seni zirveye taşır!</div>
      <button onClick={()=>setPhase("game")} className="btn-primary" style={{padding:"14px 40px",fontSize:15,borderRadius:12,fontFamily:"inherit"}}>Kariyere Başla 🚀</button>
    </div>}
    {phase==="game"&&s&&<div>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:16,flexWrap:"wrap",gap:8}}>
        <div style={{fontSize:11,color:"#64748b"}}>Senaryo {si+1}/{KARIYER_SCENARIOS.length}</div>
        <div style={{fontSize:12,fontWeight:700,color:"#34d399"}}>⭐ Puan: {score}</div>
      </div>
      <div style={{height:4,background:"rgba(255,255,255,0.06)",borderRadius:2,marginBottom:20}}>
        <div style={{width:`${((si)/KARIYER_SCENARIOS.length)*100}%`,height:"100%",background:`linear-gradient(90deg,${s.c},#a855f7)`,borderRadius:2,transition:"width .5s"}}/>
      </div>
      <div style={{background:`${s.c}08`,border:`1px solid ${s.c}25`,borderRadius:16,padding:"22px",marginBottom:16}}>
        <div style={{fontSize:9,color:s.c,letterSpacing:".1em",marginBottom:8}}>SENARYO</div>
        <div style={{fontSize:15,fontWeight:700,color:"#e2e8f0",lineHeight:1.7,fontFamily:"'Space Grotesk',sans-serif"}}>{s.text}</div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:14}}>
        {s.opts.map((o,i)=>{
          let bg="rgba(255,255,255,0.03)",bc="rgba(255,255,255,0.08)",color="#94a3b8";
          if(shown&&sel===i){
            if(o.s>=2){bg="rgba(52,211,153,0.1)";bc="rgba(52,211,153,0.4)";color="#34d399";}
            else if(o.s<0){bg="rgba(244,114,182,0.1)";bc="rgba(244,114,182,0.4)";color="#f472b6";}
            else{bg="rgba(251,146,60,0.1)";bc="rgba(251,146,60,0.4)";color="#fb923c";}
          }
          return <button key={i} onClick={()=>choose(o,i)} style={{padding:"14px 16px",borderRadius:12,border:`1px solid ${bc}`,background:bg,color,fontSize:12,textAlign:"left",cursor:shown?"default":"pointer",fontFamily:"inherit",lineHeight:1.5,transition:"all .2s"}}>{o.t}{shown&&sel===i&&<div style={{fontSize:10,marginTop:6,fontStyle:"italic",color:"#64748b"}}>💬 {o.sonuc}</div>}</button>;
        })}
      </div>
      {shown&&<button onClick={next} className="btn-primary" style={{width:"100%",padding:"12px",fontSize:14,borderRadius:12,fontFamily:"inherit"}}>{si<KARIYER_SCENARIOS.length-1?"Sonraki Senaryo →":"Sonucu Gör 🎯"}</button>}
    </div>}
    {phase==="result"&&<div style={{textAlign:"center"}}>
      <div style={{background:"linear-gradient(135deg,rgba(251,146,60,0.1),rgba(168,85,247,0.08))",border:"1px solid rgba(251,146,60,0.3)",borderRadius:20,padding:"32px",marginBottom:20}}>
        <div style={{fontSize:56,marginBottom:10}}>{score>=14?"🚀":score>=8?"📈":"🌱"}</div>
        <div style={{fontSize:18,fontWeight:900,color:"#e2e8f0",fontFamily:"'Space Grotesk',sans-serif",marginBottom:6}}>Kariyer Profili</div>
        <div style={{fontSize:32,fontWeight:900,color:"#fb923c",marginBottom:4}}>{score>=14?"AI Lideri":score>=8?"AI Uzmanı":"AI Başlangıcı"}</div>
        <div style={{fontSize:13,color:"#64748b",marginBottom:8}}>{score}/{maxPuan} puan</div>
        <div style={{fontSize:12,color:"#94a3b8",lineHeight:1.7,marginBottom:20,maxWidth:400,margin:"0 auto 20px"}}>{score>=14?"Mükemmel kararlar! AI kariyer yolculuğunda lidersin.":score>=8?"İyi ilerliyorsun! Birkaç alanda gelişim var.":"Başlangıç aşamadasın. Öğren sayfamızı ziyaret et!"}</div>
        <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
          <button onClick={()=>navigator.clipboard?.writeText(`IMDATAI AI Kariyer Simülasyonunda '${score>=14?"AI Lideri":score>=8?"AI Uzmanı":"AI Başlangıcı"}' profili aldım! 💼\nimdatai.com`)} style={{padding:"10px 20px",borderRadius:10,border:"1px solid rgba(251,146,60,0.3)",background:"rgba(251,146,60,0.1)",color:"#fb923c",fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>📋 Paylaş</button>
          <button onClick={()=>{setPhase("intro");setSi(0);setScore(0);setSonuclar([]);setSel(null);setShown(false);}} className="btn-primary" style={{padding:"10px 20px",fontSize:12,borderRadius:10,fontFamily:"inherit"}}>🔄 Tekrar</button>
        </div>
      </div>
    </div>}
  </div>;
}

// ══════════════════════════════════════════════════════════
// SAYFALAR
// ══════════════════════════════════════════════════════════

// 1. ANA SAYFA
// ══ AI FACTS ══
const AI_FACTS=[
  {e:"🤯",f:"ChatGPT, 5 günde 1 milyon kullanıcıya ulaştı. Netflix 3.5 yıl almıştı!"},
  {e:"🇹🇷",f:"Türkiye, AI web trafiğinde dünya birincisi. %94.49 ile yakın rakibi bile yok!"},
  {e:"💰",f:"2026'da AI pazarı 1.8 trilyon dolara ulaştı. Türkiye'nin yıllık GSYH'ye eşit!"},
  {e:"🧠",f:"Claude 1 milyon token işleyebilir. Bu 750.000 kelime = 10 roman demek!"},
  {e:"⚡",f:"Dünyada her saniye 100.000+ ChatGPT sorusu soruluyor. 8.6 milyar/gün!"},
  {e:"🎨",f:"Midjourney, prestijli sanat yarışmalarını kazanıyor. Sanatçılar tartışıyor!"},
  {e:"💻",f:"Claude Opus 4.7, gerçek GitHub bug'larını çözmede %87.6 başarı!"},
  {e:"🌍",f:"Gemini 2 milyon token ile dünyanın en uzun context window'una sahip!"},
  {e:"🔬",f:"AI AlphaFold ile 200 milyon proteinin yapısını keşfetti. İnsanlık 50 yılda 170.000 bulmuştu!"},
  {e:"🎵",f:"Suno AI ile üretilen şarkı, Spotify'da 1 milyonu aştı. Hiç insan eli değmedi!"},
];

// ══ AI FACTS ══

const AI_MODELS_LIST=[
  {id:"claude",e:"🧠",t:"Claude",sub:"Anthropic",d:"Kodlamada #1 · SWE-bench %87.6 · 1M token",c:"#a855f7",badge:"🏆 Kodlama #1"},
  {id:"chatgpt",e:"🤖",t:"ChatGPT",sub:"OpenAI",d:"900M kullanıcı · GPT-5.5 · DALL-E 3",c:"#00dcff",badge:"👑 En Popüler"},
  {id:"gemini",e:"🌟",t:"Gemini",sub:"Google",d:"2M token rekoru · Google ekosistemi",c:"#34d399",badge:"📚 En Uzun"},
  {id:"grok",e:"⚡",t:"Grok 3",sub:"xAI",d:"X/Twitter verisi · Gerçek zamanlı",c:"#fb923c",badge:"🔴 Canlı Veri"},
  {id:"deepseek",e:"🔬",t:"DeepSeek",sub:"DeepSeek AI",d:"Açık kaynak · Matematik dünya #1",c:"#60a5fa",badge:"🆓 Açık Kaynak"},
  {id:"mistral",e:"🇫🇷",t:"Mistral",sub:"Mistral AI",d:"Avrupa AI · GDPR uyumlu",c:"#f472b6",badge:"🇪🇺 Avrupa"},
  {id:"llama",e:"🦙",t:"Llama 4",sub:"Meta",d:"Ücretsiz · Ticari kullanım açık",c:"#34d399",badge:"🆓 Ücretsiz"},
  {id:"karsilastirma",e:"🆚",t:"Karşılaştır",sub:"Tüm Modeller",d:"Yan yana karşılaştırma tablosu",c:"#fbbf24",badge:"📊 Analiz"},
];

function HomePage({setPage,user,setUser}){
  const[typed,setTyped]=useState("");
  const words=["İçerik Üretimi","Kod Yazımı","Görsel Tasarım","Para Kazanma","Araştırma","Proje Yönetimi","Veri Analizi","Eğitim"];
  const wi=useRef(0),ci=useRef(0),del=useRef(false);
  useEffect(()=>{const t=setInterval(()=>{const w=words[wi.current];if(!del.current){if(ci.current<=w.length){setTyped(w.slice(0,ci.current));ci.current++;}else setTimeout(()=>{del.current=true;},1400);}else{if(ci.current>0){ci.current--;setTyped(w.slice(0,ci.current));}else{del.current=false;wi.current=(wi.current+1)%words.length;}}},70);return()=>clearInterval(t);},[]);
  const[email,setEmail]=useState("");const[sent,setSent]=useState(false);
  const[level,setLevel]=useState(null);const[fact,setFact]=useState(null);
  const[showExit,setShowExit]=useState(false);const[exitShown,setExitShown]=useState(false);
  const[counts,setCounts]=useState({a:0,b:0,c:0,d:0});
  const counterRef=useRef();
  const levelPages={beginner:["ogrenme","sozluk","haberler"],mid:["prompt","karsilastirma","claude"],expert:["dizin","kariyer","para"]};
  useEffect(()=>{const obs=new IntersectionObserver(entries=>{if(entries[0].isIntersecting){let s=0;const id=setInterval(()=>{s+=3;setCounts({a:Math.min(s,94),b:Math.min(Math.floor(s*.8),75),c:Math.min(Math.floor(s/10),10),d:Math.min(s-25,69)});if(s>=100)clearInterval(id);},18);}},{threshold:.3});if(counterRef.current)obs.observe(counterRef.current);return()=>obs.disconnect();},[]);
  useEffect(()=>{const h=e=>{if(e.clientY<20&&!exitShown){setShowExit(true);setExitShown(true);}};document.addEventListener("mousemove",h);return()=>document.removeEventListener("mousemove",h);},[exitShown]);

  return <div>
    {/* EXIT INTENT */}
    {showExit&&<div style={{position:"fixed",inset:0,zIndex:800,background:"rgba(0,0,0,0.75)",display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(8px)"}} onClick={()=>setShowExit(false)}>
      <div onClick={e=>e.stopPropagation()} style={{background:"rgba(8,12,24,0.98)",border:"1px solid rgba(0,220,255,0.25)",borderRadius:20,padding:"32px",maxWidth:400,width:"90%",textAlign:"center",position:"relative"}}>
        <button onClick={()=>setShowExit(false)} style={{position:"absolute",top:12,right:16,background:"none",border:"none",color:"#475569",fontSize:20,cursor:"pointer"}}>✕</button>
        <div style={{fontSize:40,marginBottom:12}}>🔔</div>
        <div style={{fontSize:18,fontWeight:800,color:"#e2e8f0",marginBottom:8,fontFamily:"Space Grotesk,sans-serif"}}>Dur!</div>
        <div style={{fontSize:13,color:"#64748b",marginBottom:20}}>Yeni AI modeli çıktığında haber al!</div>
        {sent?<div style={{color:"#34d399",fontWeight:700}}>✅ Kaydedildin!</div>:<div style={{display:"flex",flexDirection:"column",gap:8}}>
          <input style={{background:"rgba(0,0,0,0.4)",border:"1px solid rgba(0,220,255,0.2)",borderRadius:10,color:"#e2e8f0",padding:"11px 14px",fontSize:13,fontFamily:"inherit",outline:"none"}} placeholder="E-posta..." value={email} onChange={e=>setEmail(e.target.value)}/>
          <button onClick={()=>{if(email.includes("@")){setSent(true);setTimeout(()=>setShowExit(false),1500);}}} className="btn-primary" style={{padding:"12px",fontSize:14,borderRadius:10,fontFamily:"inherit"}}>🚀 Alarm Kur</button>
        </div>}
      </div>
    </div>}

    {/* ═══ HERO ═══ */}
    <section style={{position:"relative",minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"80px 20px 40px",overflow:"hidden",textAlign:"center"}}>
      <JarvisHUD/>
      <MatrixRain/>
      <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 80% 60% at 50% 40%,rgba(0,220,255,0.05),transparent 75%)",pointerEvents:"none"}}/>
      <div style={{position:"relative",zIndex:3,maxWidth:800,width:"100%"}}>
        <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:18,flexWrap:"wrap"}}>
          {[["🇹🇷","AI #1","#fb923c"],["📡","Canlı","#34d399"],["🆓","Ücretsiz","#00dcff"],["🤖","Gemini AI","#a855f7"]].map(([e,t,c])=>(
            <div key={t} style={{fontSize:9,color:c,background:`${c}12`,padding:"4px 10px",borderRadius:12,border:`1px solid ${c}25`,fontWeight:700}}>{e} {t}</div>
          ))}
        </div>
        <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(0,220,255,0.06)",border:"1px solid rgba(0,220,255,0.2)",borderRadius:24,padding:"7px 18px",marginBottom:24,fontSize:10,color:"#00dcff",letterSpacing:".12em"}}>
          <span style={{width:6,height:6,background:"#00dcff",borderRadius:"50%",animation:"blink 1.2s infinite",boxShadow:"0 0 8px #00dcff"}}/>
          TÜRKİYE AI TRAFİĞİNDE DÜNYA #1 — %94.49
        </div>
        <h1 style={{fontSize:"clamp(32px,6vw,68px)",fontWeight:900,lineHeight:1.05,margin:"0 0 10px",letterSpacing:"-.03em",fontFamily:"Space Grotesk,sans-serif"}}>
          <span style={{background:"linear-gradient(135deg,#fff,#94a3b8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>AI ile </span>
          <span style={{background:"linear-gradient(90deg,#00dcff,#a855f7,#f472b6,#00dcff)",backgroundSize:"300% auto",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"gradient 3s linear infinite"}}>{typed}<span style={{animation:"blink .8s infinite",WebkitTextFillColor:"rgba(0,220,255,.7)"}}>|</span></span>
        </h1>
        <div style={{fontSize:"clamp(14px,2.5vw,20px)",color:"#475569",marginBottom:16,fontFamily:"Space Grotesk,sans-serif"}}>
          saniyeler içinde, tamamen <span style={{color:"#00dcff",fontWeight:700}}>Türkçe.</span>
        </div>
        <p style={{fontSize:12,color:"#334155",margin:"0 auto 28px",maxWidth:440,lineHeight:1.8}}>AI haberleri · 40+ araç · 75 prompt · 10 oyun · 8 AI model · Simülasyonlar</p>
        <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap",marginBottom:24}}>
          <button onClick={()=>setPage("tools")} className="btn-primary" style={{padding:"12px 24px",fontSize:13,borderRadius:11,fontFamily:"inherit"}}>🛠️ Tools</button>
          <button onClick={()=>setPage("oyunlar")} style={{padding:"12px 18px",fontSize:13,borderRadius:11,border:"1px solid rgba(52,211,153,0.4)",background:"rgba(52,211,153,0.08)",color:"#34d399",cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>🎮 Oyun Oyna</button>
          <button onClick={()=>setPage("claude")} style={{padding:"12px 18px",fontSize:13,borderRadius:11,border:"1px solid rgba(168,85,247,0.4)",background:"rgba(168,85,247,0.08)",color:"#a855f7",cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>🧠 Claude</button>
          <button onClick={()=>setFact(AI_FACTS[Math.floor(Math.random()*AI_FACTS.length)])} style={{padding:"12px 18px",fontSize:13,borderRadius:11,border:"1px solid rgba(251,146,60,0.4)",background:"rgba(251,146,60,0.08)",color:"#fb923c",cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>🤯 Şaşırt!</button>
          <button onClick={()=>setPage("animasyon")} style={{padding:"11px 20px",fontSize:12,borderRadius:10,fontFamily:"inherit",fontWeight:700,border:"none",cursor:"pointer",color:"#fff",background:"linear-gradient(135deg,#a855f7,#7c3aed)",boxShadow:"0 4px 16px rgba(168,85,247,0.3)",transition:"all .2s"}} onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"} onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>🎬 Animasyonlar</button>
        </div>
        {fact&&<div style={{background:"rgba(251,146,60,0.08)",border:"1px solid rgba(251,146,60,0.22)",borderRadius:14,padding:"14px 18px",maxWidth:520,margin:"0 auto 20px",animation:"fadeIn .3s ease"}}>
          <div style={{fontSize:24,marginBottom:6}}>{fact.e}</div>
          <div style={{fontSize:13,color:"#e2e8f0",lineHeight:1.7}}>{fact.f}</div>
          <button onClick={()=>setFact(AI_FACTS[Math.floor(Math.random()*AI_FACTS.length)])} style={{marginTop:8,fontSize:10,color:"#fb923c",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit"}}>Bir daha →</button>
        </div>}
        <div ref={counterRef} style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,maxWidth:440,margin:"0 auto"}}>
          {[[counts.a+"%","TR #1","#00dcff"],[counts.b+"+","Prompt","#a855f7"],[counts.c,"Oyun","#34d399"],[counts.d,"AI Terimi","#fb923c"]].map(([n,l,c])=>(
            <div key={l} style={{background:`${c}08`,border:`1px solid ${c}15`,borderRadius:11,padding:"10px 6px"}}>
              <div style={{fontSize:18,fontWeight:900,color:c,fontFamily:"Space Grotesk,sans-serif"}}>{n}</div>
              <div style={{fontSize:8,color:"#475569",marginTop:2}}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{position:"absolute",bottom:24,left:"50%",transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center",gap:4,animation:"float 2s ease-in-out infinite",zIndex:3}}>
        <div style={{fontSize:8,color:"#1e293b",letterSpacing:".15em"}}>KAYDIR</div>
        <div style={{width:1,height:24,background:"linear-gradient(rgba(0,220,255,0.4),transparent)"}}/>
      </div>
    </section>

    {/* ═══ SLİDESHOW ═══ */}
    <section style={{padding:"24px 20px"}}>
      <div style={{maxWidth:960,margin:"0 auto"}}>
        <Slideshow setPage={setPage}/>
      </div>
    </section>

    {/* ═══ HIZLI ERİŞİM ═══ */}
    <section style={{padding:"0 20px 40px"}}>
      <div style={{maxWidth:960,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:18}}>
          <div style={{fontSize:9,letterSpacing:".2em",color:"#475569",marginBottom:5}}>HIZLI ERİŞİM</div>
          <div style={{fontSize:20,fontWeight:800,color:"#e2e8f0",fontFamily:"Space Grotesk,sans-serif"}}>Ne Arıyorsun?</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:10}}>
          {[
            {e:"📰",t:"Haberler",d:"Güncel AI haberleri",c:"#00dcff",p:"haberler"},
            {e:"🛠️",t:"Tools",d:"40+ AI aracı",c:"#fb923c",p:"tools"},
            {e:"🎮",t:"Oyunlar",d:"10 interaktif oyun",c:"#f472b6",p:"oyunlar"},
            {e:"⚡",t:"İnteraktif",d:"Araçlar & hesaplama",c:"#a855f7",p:"puan"},
            {e:"🎓",t:"Öğren",d:"AI eğitim rehberi",c:"#34d399",p:"ogrenme"},
            {e:"💰",t:"Para Kazan",d:"AI gelir yolları",c:"#fbbf24",p:"para"},
            {e:"🚀",t:"Kariyer",d:"AI meslekleri",c:"#60a5fa",p:"kariyer"},
            {e:"🎰",t:"Şans Çarkı",d:"Rastgele içerik",c:"#fb923c",p:"cark"},
            {e:"🎬",t:"Animasyon",d:"Fullscreen görsel",c:"#a855f7",p:"animasyon"},
            {e:"📊",t:"Dashboard",d:"İstatistiklerin",c:"#34d399",p:"dashboard"},
          ].map(g=>(
            <div key={g.t} onClick={()=>setPage(g.p)} className="card-3d" style={{background:`${g.c}06`,border:`1px solid ${g.c}18`,borderRadius:13,padding:"14px 12px",cursor:"pointer",position:"relative",overflow:"hidden",textAlign:"center"}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${g.c},transparent)`}}/>
              <div style={{fontSize:22,marginBottom:6}}>{g.e}</div>
              <div style={{fontSize:12,fontWeight:700,color:g.c,marginBottom:3,fontFamily:"Space Grotesk,sans-serif"}}>{g.t}</div>
              <div style={{fontSize:9,color:"#475569"}}>{g.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ═══ AI MODELLERİ ═══ */}
    <section style={{padding:"0 20px 40px",background:"rgba(0,0,0,0.12)"}}>
      <div style={{maxWidth:960,margin:"0 auto",paddingTop:32}}>
        <div style={{textAlign:"center",marginBottom:20}}>
          <div style={{fontSize:9,letterSpacing:".2em",color:"#a855f7",marginBottom:5}}>8 MODEL</div>
          <div style={{fontSize:20,fontWeight:800,color:"#e2e8f0",fontFamily:"Space Grotesk,sans-serif"}}>🤖 Tüm AI Modelleri</div>
          <div style={{fontSize:11,color:"#64748b",marginTop:4}}>Claude · ChatGPT · Gemini · Grok · DeepSeek · Mistral · Llama · Karşılaştır</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10}}>
          {AI_MODELS_LIST.map(m=>(
            <div key={m.id} onClick={()=>setPage(m.id)} className="card-hover" style={{background:`${m.c}06`,border:`1px solid ${m.c}18`,borderRadius:14,padding:"16px",cursor:"pointer",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${m.c},transparent)`}}/>
              <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:10}}>
                <span style={{fontSize:28}}>{m.e}</span>
                <div>
                  <div style={{fontSize:13,fontWeight:800,color:m.c,fontFamily:"Space Grotesk,sans-serif"}}>{m.t}</div>
                  <div style={{fontSize:9,color:"#475569"}}>{m.sub}</div>
                </div>
              </div>
              <div style={{fontSize:10,color:"#64748b",lineHeight:1.5,marginBottom:8}}>{m.d}</div>
              <div style={{fontSize:8,color:m.c,background:`${m.c}12`,borderRadius:5,padding:"2px 8px",display:"inline-block",fontWeight:700}}>{m.badge}</div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ═══ SİMÜLASYONLAR ═══ */}
    <section style={{padding:"0 20px 40px"}}>
      <div style={{maxWidth:960,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:10}}>
          <div><div style={{fontSize:9,letterSpacing:".2em",color:"#475569",marginBottom:3}}>CANLI</div><div style={{fontSize:18,fontWeight:800,color:"#e2e8f0",fontFamily:"Space Grotesk,sans-serif"}}>🌍 Dünya AI Haritası</div></div>
          <div style={{display:"flex",gap:6,alignItems:"center"}}><span style={{width:6,height:6,background:"#34d399",borderRadius:"50%",animation:"blink 1.2s infinite"}}/><span style={{fontSize:10,color:"#34d399"}}>Canlı</span></div>
        </div>
        <WorldMapSim/>
      </div>
    </section>

    <section style={{padding:"0 20px 40px",background:"rgba(0,0,0,0.12)"}}>
      <div style={{maxWidth:960,margin:"0 auto",paddingTop:32}}>
        <div style={{textAlign:"center",marginBottom:14}}>
          <div style={{fontSize:9,letterSpacing:".2em",color:"#a855f7",marginBottom:3}}>ETKİLEŞİMLİ</div>
          <div style={{fontSize:18,fontWeight:800,color:"#e2e8f0",fontFamily:"Space Grotesk,sans-serif"}}>🧠 Nöral Ağ Simülasyonu</div>
          <div style={{fontSize:10,color:"#64748b",marginTop:3}}>Mouse ile etkileşe geç</div>
        </div>
        <NeuralNetSim/>
      </div>
    </section>

    {/* ═══ GÜNLÜK İPUCU ═══ */}
    <section style={{padding:"0 20px 40px"}}>
      <div style={{maxWidth:860,margin:"0 auto"}}>
        <div style={{background:`${todayTip.renk}06`,border:`1px solid ${todayTip.renk}20`,borderRadius:16,padding:"20px",display:"flex",gap:14,alignItems:"flex-start",flexWrap:"wrap"}}>
          <div style={{width:42,height:42,borderRadius:11,background:`${todayTip.renk}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>💡</div>
          <div style={{flex:1}}>
            <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:7,flexWrap:"wrap"}}>
              <div style={{fontSize:9,letterSpacing:".15em",color:todayTip.renk}}>BUGÜNÜN İPUCU</div>
              <Tag text={todayTip.araç} color={todayTip.renk}/>
            </div>
            <div style={{fontSize:13,color:"#e2e8f0",lineHeight:1.7,marginBottom:8}}>{todayTip.tip}</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              <button onClick={()=>navigator.clipboard?.writeText(todayTip.tip)} style={{fontSize:10,color:todayTip.renk,background:`${todayTip.renk}10`,border:`1px solid ${todayTip.renk}22`,borderRadius:7,padding:"5px 12px",cursor:"pointer",fontFamily:"inherit"}}>Kopyala 📋</button>
              <ShareButton title="Günlük AI İpucu" text={`💡 Günlük AI İpucu — ${todayTip.araç}:

${todayTip.tip}`} size="small"/>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* ═══ HABERLER ═══ */}
    <section style={{padding:"0 20px 40px",background:"rgba(0,0,0,0.08)"}}>
      <div style={{maxWidth:900,margin:"0 auto",paddingTop:32}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div><div style={{fontSize:9,letterSpacing:".2em",color:"#475569",marginBottom:3}}>SON DAKİKA</div><div style={{fontSize:18,fontWeight:800,color:"#e2e8f0",fontFamily:"Space Grotesk,sans-serif"}}>📰 AI Haberleri</div></div>
          <button onClick={()=>setPage("haberler")} style={{fontSize:11,color:"#00dcff",background:"none",border:"1px solid rgba(0,220,255,0.2)",borderRadius:8,padding:"5px 12px",cursor:"pointer",fontFamily:"inherit"}}>Tümü →</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:10}}>
          {NEWS.slice(0,6).map((n,i)=>(
            <Card key={i} color={n.color} style={{padding:"14px"}} onClick={()=>setPage("haberler")} className="card-hover">
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><Tag text={n.tag} color={n.color}/>{n.hot&&<Tag text="🔥" color="#ff6b6b" size={8}/>}</div>
              <div style={{fontSize:19,marginBottom:7}}>{n.emoji}</div>
              <div style={{fontSize:12,fontWeight:700,color:"#e2e8f0",marginBottom:4,lineHeight:1.4}}>{n.title}</div>
              <div style={{fontSize:10,color:"#475569",lineHeight:1.6}}>{n.desc}</div>
            </Card>
          ))}
        </div>
      </div>
    </section>

    {/* ═══ OYUNLAR ═══ */}
    <section style={{padding:"0 20px 40px"}}>
      <div style={{maxWidth:960,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:10}}>
          <div><div style={{fontSize:9,letterSpacing:".2em",color:"#f472b6",marginBottom:3}}>İNTERAKTİF</div><div style={{fontSize:18,fontWeight:800,color:"#e2e8f0",fontFamily:"Space Grotesk,sans-serif"}}>🎮 Oyunlar & Araçlar</div></div>
          <button onClick={()=>setPage("oyunlar")} style={{fontSize:11,color:"#f472b6",background:"none",border:"1px solid rgba(244,114,182,0.3)",borderRadius:8,padding:"5px 12px",cursor:"pointer",fontFamily:"inherit"}}>Tümü →</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))",gap:10}}>
          {[{id:"trivia",e:"🎯",t:"AI Trivia",d:"50 soru",c:"#00dcff"},{id:"roulette",e:"🎰",t:"Prompt Rulet",d:"Rastgele görev",c:"#f472b6"},{id:"dedektif",e:"🔍",t:"Dedektif",d:"Kim yazdı?",c:"#fbbf24"},{id:"emoji",e:"😄",t:"Emoji Tahmin",d:"AI bul",c:"#34d399"},{id:"iqtest",e:"🧠",t:"AI IQ Testi",d:"Zekânı ölç",c:"#a855f7"},{id:"cark",e:"🎡",t:"Çark-ı Felek",d:"Şansını dene",c:"#fb923c"},{id:"quiz",e:"❓",t:"AI Quiz",d:"10 soruluk test",c:"#60a5fa"},{id:"animasyon",e:"🎬",t:"Animasyonlar",d:"Görsel şov",c:"#f472b6"},{id:"kisilik",e:"🧪",t:"Kişilik Testi",d:"Profilini bul",c:"#00dcff"},{id:"kariyer",e:"💼",t:"Kariyer Sim",d:"Geleceğini keşfet",c:"#34d399"}].map(g=>(
            <div key={g.id} onClick={()=>setPage(g.id)} className="card-3d" style={{background:`${g.c}06`,border:`1px solid ${g.c}18`,borderRadius:13,padding:"14px",cursor:"pointer",textAlign:"center"}}>
              <div style={{fontSize:26,marginBottom:6}}>{g.e}</div>
              <div style={{fontSize:12,fontWeight:700,color:g.c,marginBottom:3,fontFamily:"Space Grotesk,sans-serif"}}>{g.t}</div>
              <div style={{fontSize:9,color:"#475569",marginBottom:8}}>{g.d}</div>
              <div style={{fontSize:9,color:g.c}}>Başla →</div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ═══ TÜRKİYE LEADERBOARD ═══ */}
    <section style={{padding:"0 20px 40px",background:"rgba(0,0,0,0.08)"}}>
      <div style={{maxWidth:860,margin:"0 auto",paddingTop:32}}>
        <div style={{marginBottom:14}}><div style={{fontSize:9,letterSpacing:".2em",color:"#fb923c",marginBottom:3}}>🇹🇷</div><div style={{fontSize:18,fontWeight:800,color:"#e2e8f0",fontFamily:"Space Grotesk,sans-serif"}}>Türkiye AI Şehir Sıralaması</div></div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(195px,1fr))",gap:9}}>
          {[{s:"İstanbul",p:100,c:"#00dcff",r:1,n:"2.1M"},{s:"Ankara",p:68,c:"#a855f7",r:2,n:"890K"},{s:"İzmir",p:52,c:"#34d399",r:3,n:"620K"},{s:"Bursa",p:38,c:"#fb923c",r:4,n:"410K"},{s:"Antalya",p:31,c:"#f472b6",r:5,n:"340K"},{s:"Adana",p:22,c:"#60a5fa",r:6,n:"230K"}].map(s=>(
            <div key={s.s} style={{background:"rgba(255,255,255,0.02)",border:`1px solid ${s.c}15`,borderRadius:11,padding:"12px"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}>
                <div style={{display:"flex",gap:7,alignItems:"center"}}><div style={{width:20,height:20,borderRadius:"50%",background:`${s.c}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:800,color:s.c}}>{s.r}</div><div style={{fontSize:12,fontWeight:700,color:"#e2e8f0"}}>{s.s}</div></div>
                <div style={{fontSize:10,color:s.c,fontWeight:700}}>{s.n}</div>
              </div>
              <div style={{height:3,background:"rgba(255,255,255,0.05)",borderRadius:2}}><div style={{width:`${s.p}%`,height:"100%",background:s.c,borderRadius:2}}/></div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <SocialMediaSection/>

        {/* ═══ AI ALARM + TRENDING ═══ */}
    <section style={{padding:"0 20px 48px"}}>
      <div style={{maxWidth:860,margin:"0 auto"}}>
        <div style={{background:"linear-gradient(135deg,rgba(0,220,255,0.06),rgba(168,85,247,0.04))",border:"1px solid rgba(0,220,255,0.18)",borderRadius:16,padding:"22px",textAlign:"center",marginBottom:24}}>
          <div style={{fontSize:24,marginBottom:8}}>🔔</div>
          <div style={{fontSize:15,fontWeight:800,color:"#e2e8f0",fontFamily:"Space Grotesk,sans-serif",marginBottom:6}}>AI Alarm</div>
          <div style={{fontSize:11,color:"#64748b",marginBottom:14}}>Yeni model, fiyat değişimi — anında haber al!</div>
          {sent?<div style={{fontSize:13,color:"#34d399",fontWeight:700}}>✅ Kaydedildin!</div>:<div style={{display:"flex",gap:8,maxWidth:360,margin:"0 auto",flexWrap:"wrap",justifyContent:"center"}}>
            <input style={{flex:1,minWidth:170,background:"rgba(0,0,0,0.4)",border:"1px solid rgba(0,220,255,0.2)",borderRadius:9,color:"#e2e8f0",padding:"9px 12px",fontSize:12,fontFamily:"inherit",outline:"none"}} placeholder="E-posta..." value={email} onChange={e=>setEmail(e.target.value)}/>
            <button onClick={()=>{if(email.includes("@"))setSent(true);}} className="btn-primary" style={{padding:"9px 18px",fontSize:12,borderRadius:9,fontFamily:"inherit"}}>🔔 Alarm</button>
          </div>}
        </div>
        <div style={{marginBottom:14}}><div style={{fontSize:9,letterSpacing:".2em",color:"#475569",marginBottom:3}}>BU HAFTA</div><div style={{fontSize:18,fontWeight:800,color:"#e2e8f0",fontFamily:"Space Grotesk,sans-serif"}}>🔥 Trending AI</div></div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:9}}>
          {TRENDING.map(t=>(
            <Card key={t.rank} color="#00dcff" style={{padding:"12px 14px",display:"flex",gap:10,alignItems:"center"}} className="card-hover">
              <div style={{width:32,height:32,borderRadius:8,background:"rgba(0,220,255,0.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{t.icon}</div>
              <div style={{flex:1}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><div style={{fontSize:11,fontWeight:700,color:"#e2e8f0"}}>{t.topic}</div><Tag text={t.tag} color="#00dcff" size={7}/></div>
                <div style={{fontSize:9,color:"#475569",lineHeight:1.5,marginBottom:4}}>{t.desc}</div>
                <div style={{height:3,background:"rgba(255,255,255,0.06)",borderRadius:2}}><div style={{width:`${t.heat}%`,height:"100%",background:"linear-gradient(90deg,#00dcff,#a855f7)",borderRadius:2}}/></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  </div>;
}


function BlogPage({setPage}){
  return <div style={{padding:"28px 20px",maxWidth:900,margin:"0 auto"}}>
    <div style={{marginBottom:22}}><div style={{fontSize:9,letterSpacing:".2em",color:"#475569",marginBottom:5}}>BLOG</div><div style={{fontSize:22,fontWeight:800,color:"#e2e8f0"}}>✍️ AI Rehberleri & Analizler</div><div style={{fontSize:12,color:"#64748b",marginTop:3}}>Kapsamlı Türkçe AI içerikleri — araştırılmış, güncel</div></div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:13}}>
      {BLOG_POSTS.map(p=>(
        <Card key={p.id} color={p.color} style={{padding:"18px"}} onClick={()=>setPage(`blog-${p.id}`)}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><Tag text={p.tag} color={p.color}/><span style={{fontSize:9,color:"#334155"}}>{p.date} · {p.readTime}</span></div>
          <div style={{fontSize:14,fontWeight:700,color:"#e2e8f0",marginBottom:7,lineHeight:1.4}}>{p.title}</div>
          <div style={{fontSize:12,color:"#475569",lineHeight:1.65,marginBottom:11}}>{p.summary}</div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"#334155"}}>
            <span>{p.date}</span><span style={{color:p.color}}>Oku →</span>
          </div>
        </Card>
      ))}
    </div>
  </div>;
}

// 3. BLOG YAZISI SAYFASI
function BlogPostPage({postId,setPage}){
  const post=BLOG_POSTS.find(p=>p.id===postId);
  if(!post) return <div style={{padding:"60px 20px",textAlign:"center",color:"#475569"}}>Yazı bulunamadı.</div>;
  return <div style={{padding:"28px 20px",maxWidth:720,margin:"0 auto"}}>
    <button onClick={()=>setPage("blog")} style={{fontSize:11,color:"#475569",background:"none",border:"1px solid rgba(255,255,255,0.1)",borderRadius:7,padding:"6px 12px",cursor:"pointer",fontFamily:"inherit",marginBottom:20}}>← Blog'a Dön</button>
    <div style={{marginBottom:16}}>
      <Tag text={post.tag} color={post.color}/>
      <div style={{fontSize:9,color:"#475569",marginTop:6}}>{post.date} · {post.readTime} okuma</div>
    </div>
    <h1 style={{fontSize:"clamp(20px,4vw,32px)",fontWeight:900,color:"#e2e8f0",marginBottom:12,lineHeight:1.3}}>{post.title}</h1>
    <div style={{fontSize:14,color:"#a855f7",fontStyle:"italic",marginBottom:24,padding:"12px 16px",background:"rgba(168,85,247,0.06)",borderLeft:"3px solid #a855f7",borderRadius:"0 9px 9px 0"}}>{post.summary}</div>
    <div style={{fontSize:13,color:"#94a3b8",lineHeight:2,whiteSpace:"pre-line"}}>
      {post.content.split('\n').map((line,i)=>{
        if(line.startsWith('## ')) return <h2 key={i} style={{fontSize:18,fontWeight:800,color:"#e2e8f0",margin:"24px 0 12px"}}>{line.slice(3)}</h2>;
        if(line.startsWith('**') && line.endsWith('**')) return <div key={i} style={{fontWeight:700,color:"#e2e8f0",margin:"14px 0 6px"}}>{line.slice(2,-2)}</div>;
        if(line.startsWith('- ')) return <div key={i} style={{paddingLeft:16,borderLeft:"2px solid rgba(0,220,255,0.3)",margin:"4px 0",fontSize:12,color:"#64748b"}}>{line.slice(2)}</div>;
        if(line.trim()==="") return <br key={i}/>;
        return <div key={i} style={{marginBottom:4}}>{line}</div>;
      })}
    </div>
    <div style={{marginTop:28,borderTop:"1px solid rgba(255,255,255,0.06)",paddingTop:16}}>
      <div style={{fontSize:11,color:"#475569",marginBottom:8}}>Bu yazıyı faydalı buldun mu?</div>
      <div style={{display:"flex",gap:8}}>
        <button style={{padding:"8px 16px",borderRadius:8,border:"1px solid rgba(52,211,153,0.3)",background:"rgba(52,211,153,0.06)",color:"#34d399",fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>👍 Faydalı</button>
        <button onClick={()=>setPage("blog")} style={{padding:"8px 16px",borderRadius:8,border:"1px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.03)",color:"#475569",fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>← Diğer Yazılar</button>
      </div>
    </div>
  </div>;
}

// 4. ARAÇ DETAY SAYFASI
function ToolDetailPage({toolKey,setPage}){
  const t=TOOL_DETAILS[toolKey];
  if(!t) return <div style={{padding:"60px 20px",textAlign:"center",color:"#475569"}}>Araç bulunamadı.</div>;
  return <div style={{padding:"28px 20px",maxWidth:900,margin:"0 auto"}}>
    <button onClick={()=>setPage("dizin")} style={{fontSize:11,color:"#475569",background:"none",border:"1px solid rgba(255,255,255,0.1)",borderRadius:7,padding:"6px 12px",cursor:"pointer",fontFamily:"inherit",marginBottom:20}}>← Araç Dizinine Dön</button>
    {/* Header */}
    <div style={{background:`linear-gradient(135deg,${t.color}08,transparent)`,border:`1px solid ${t.color}22`,borderRadius:18,padding:"26px",marginBottom:20}}>
      <div style={{display:"flex",gap:16,alignItems:"flex-start",flexWrap:"wrap"}}>
        <div style={{fontSize:52}}>{t.icon}</div>
        <div style={{flex:1}}>
          <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:6,flexWrap:"wrap"}}>
            <div style={{fontSize:22,fontWeight:900,color:t.color}}>{t.name}</div>
            <Tag text={t.tag} color={t.color}/>{t.sponsor&&<Tag text="⭐ Sponsorlu" color="#fb923c"/>}
          </div>
          <div style={{fontSize:13,color:"#94a3b8",marginBottom:10}}>{t.tagline}</div>
          <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
            {[[t.users,"Kullanıcı"],[t.price,"Fiyat"],[t.free?"Ücretsiz plan":"Ücretli","Plan"]].map(([v,l])=>(
              <div key={l}><div style={{fontSize:9,color:"#475569"}}>{l}</div><div style={{fontSize:12,fontWeight:700,color:"#e2e8f0"}}>{v}</div></div>
            ))}
            <div style={{fontSize:11,fontWeight:700,color:t.color,display:"flex",alignItems:"center"}}>★ {t.score}/100</div>
          </div>
        </div>
        <a href={t.url} target="_blank" rel="noopener noreferrer" style={{padding:"12px 24px",borderRadius:10,border:"none",background:`linear-gradient(135deg,${t.color},${t.color}88)`,color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",textDecoration:"none",whiteSpace:"nowrap"}}>Hemen Dene →</a>
      </div>
      <div style={{marginTop:14,fontSize:12,color:"#64748b",lineHeight:1.7}}>{t.desc}</div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:14,marginBottom:20}}>
      {/* Özellikler */}
      <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:14,padding:"18px"}}>
        <div style={{fontSize:13,fontWeight:700,color:"#e2e8f0",marginBottom:12}}>⚡ Öne Çıkan Özellikler</div>
        {t.features.map(f=><div key={f} style={{display:"flex",gap:8,fontSize:12,color:"#94a3b8",marginBottom:7}}><span style={{color:t.color,flexShrink:0}}>✓</span>{f}</div>)}
      </div>
      {/* Pros & Cons */}
      <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:14,padding:"18px"}}>
        <div style={{fontSize:13,fontWeight:700,color:"#34d399",marginBottom:10}}>✅ Güçlü Yönler</div>
        {t.pros.map(p=><div key={p} style={{display:"flex",gap:8,fontSize:11,color:"#94a3b8",marginBottom:6}}><span style={{color:"#34d399",flexShrink:0}}>+</span>{p}</div>)}
        <div style={{height:1,background:"rgba(255,255,255,0.06)",margin:"12px 0"}}/>
        <div style={{fontSize:13,fontWeight:700,color:"#f472b6",marginBottom:10}}>❌ Zayıf Yönler</div>
        {t.cons.map(c=><div key={c} style={{display:"flex",gap:8,fontSize:11,color:"#94a3b8",marginBottom:6}}><span style={{color:"#f472b6",flexShrink:0}}>–</span>{c}</div>)}
      </div>
    </div>
    {/* Nasıl Kullanılır */}
    <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:14,padding:"18px",marginBottom:16}}>
      <div style={{fontSize:13,fontWeight:700,color:"#e2e8f0",marginBottom:12}}>📋 Nasıl Kullanılır?</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:8}}>
        {t.howto.map((h,i)=>(
          <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start"}}>
            <div style={{width:20,height:20,borderRadius:"50%",background:`${t.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:t.color,flexShrink:0,fontWeight:700,marginTop:1}}>{i+1}</div>
            <span style={{fontSize:11,color:"#94a3b8",lineHeight:1.5}}>{h}</span>
          </div>
        ))}
      </div>
    </div>
    {/* Prompt örnekleri */}
    <div style={{background:`${t.color}06`,border:`1px solid ${t.color}18`,borderRadius:14,padding:"18px",marginBottom:16}}>
      <div style={{fontSize:13,fontWeight:700,color:t.color,marginBottom:12}}>💡 Hazır Prompt Örnekleri</div>
      {t.prompts.map((p,i)=>(
        <div key={i} style={{background:"rgba(0,0,0,0.35)",borderRadius:9,padding:"10px 12px",marginBottom:8,fontSize:11,color:"#94a3b8",fontStyle:"italic",display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
          <span style={{lineHeight:1.6}}>"{p}"</span>
          <button onClick={()=>navigator.clipboard?.writeText(p)} style={{flexShrink:0,padding:"3px 8px",borderRadius:5,border:"none",background:t.color+"22",color:t.color,fontSize:9,cursor:"pointer",fontFamily:"inherit"}}>Kopyala</button>
        </div>
      ))}
    </div>
    {/* Alternatifler & Affiliate */}
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
      <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:12,padding:"16px"}}>
        <div style={{fontSize:12,fontWeight:700,color:"#e2e8f0",marginBottom:10}}>🔄 Alternatifler</div>
        {t.alternatives.map(a=><div key={a} style={{fontSize:11,color:"#64748b",marginBottom:6,padding:"4px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>{a}</div>)}
      </div>
      <div style={{background:`${t.color}06`,border:`1px solid ${t.color}18`,borderRadius:12,padding:"16px"}}>
        <div style={{fontSize:12,fontWeight:700,color:t.color,marginBottom:8}}>💰 Fiyat Notu</div>
        <div style={{fontSize:11,color:"#64748b",lineHeight:1.6,marginBottom:12}}>{t.affiliateNote}</div>
        <a href={t.url} target="_blank" rel="noopener noreferrer" style={{display:"block",padding:"10px",borderRadius:8,border:"none",background:`linear-gradient(135deg,${t.color},${t.color}88)`,color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",textDecoration:"none",textAlign:"center"}}>Ücretsiz Dene →</a>
      </div>
    </div>
  </div>;
}

// 5. GALERİ SAYFASI
function GaleriPage(){
  const[filter,setFilter]=useState("Tümü");
  const cats=["Tümü",...[...new Set(GALLERY.map(g=>g.cat))]];
  const filtered=GALLERY.filter(g=>filter==="Tümü"||g.cat===filter);
  return <div style={{padding:"28px 20px",maxWidth:900,margin:"0 auto"}}>
    <div style={{marginBottom:20}}><div style={{fontSize:9,letterSpacing:".2em",color:"#475569",marginBottom:5}}>GALERİ</div><div style={{fontSize:22,fontWeight:800,color:"#e2e8f0"}}>🎨 AI Görsel Galerisi</div><div style={{fontSize:12,color:"#64748b",marginTop:3}}>Gerçek AI çıktıları — prompt'ları ile birlikte. Türkçe ile de deneyin!</div></div>
    <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:20}}>
      {cats.map(c=><button key={c} onClick={()=>setFilter(c)} style={{padding:"6px 12px",borderRadius:8,border:"none",cursor:"pointer",fontSize:11,fontFamily:"inherit",background:filter===c?"rgba(244,114,182,0.15)":"rgba(255,255,255,0.04)",color:filter===c?"#f472b6":"#475569"}}>{c}</button>)}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",gap:14}}>
      {filtered.map((g,i)=>(
        <div key={i} style={{background:"rgba(255,255,255,0.02)",border:`1px solid ${g.color}18`,borderRadius:14,overflow:"hidden"}}>
          <div style={{background:`linear-gradient(135deg,${g.color}25,rgba(0,0,0,0.6))`,paddingTop:"70%",position:"relative"}}>
            <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:60}}>{g.emoji}</div>
            <div style={{position:"absolute",top:8,left:8}}><Tag text={g.cat} color={g.color} size={8}/></div>
            <div style={{position:"absolute",bottom:8,right:8}}><Tag text={g.tool} color="#475569" size={8}/></div>
          </div>
          <div style={{padding:"14px"}}>
            <div style={{fontSize:13,fontWeight:700,color:"#e2e8f0",marginBottom:6}}>{g.title}</div>
            <div style={{fontSize:11,color:"#64748b",lineHeight:1.6,marginBottom:10}}>{g.desc}</div>
            <div style={{background:"rgba(0,0,0,0.4)",borderRadius:8,padding:"9px 10px"}}>
              <div style={{fontSize:9,color:"#475569",marginBottom:4,letterSpacing:".08em"}}>PROMPT:</div>
              <div style={{fontSize:10,color:"#94a3b8",lineHeight:1.5,fontFamily:"monospace"}}>{g.prompt}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
    <div style={{marginTop:24,background:"rgba(244,114,182,0.06)",border:"1px solid rgba(244,114,182,0.2)",borderRadius:14,padding:"18px",textAlign:"center"}}>
      <div style={{fontSize:13,fontWeight:700,color:"#e2e8f0",marginBottom:6}}>🎨 Kendi AI Görselini Paylaş</div>
      <div style={{fontSize:12,color:"#64748b",marginBottom:12}}>Midjourney, DALL-E veya başka AI araçlarıyla yaptığın görseli Instagram'da @imdatai etiketle. En iyiler galeride yayınlanır!</div>
      <a href="https://instagram.com/imdatai" target="_blank" rel="noopener noreferrer" style={{display:"inline-block",padding:"9px 20px",borderRadius:9,border:"none",background:"linear-gradient(135deg,#f09433,#dc2743,#bc1888)",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",textDecoration:"none"}}>
        <IG/>&nbsp; @imdatai'yi Takip Et
      </a>
    </div>
  </div>;
}

// 6. TOPLULUK / PROMPT PAYLAŞIM
function ToplulukPage(){
  const[prompts,setPrompts]=useState(COMMUNITY_PROMPTS);
  const[liked,setLiked]=useState({});
  const[newP,setNewP]=useState({title:"",cat:"Kod",prompt:""});
  const[submitted,setSubmitted]=useState(false);
  function like(i){if(liked[i])return;setLiked(l=>({...l,[i]:true}));setPrompts(ps=>ps.map((p,idx)=>idx===i?{...p,likes:p.likes+1}:p));}
  function submit(){if(newP.title&&newP.prompt){setPrompts(ps=>[{user:"Sen",avatar:"⭐",cat:newP.cat,title:newP.title,prompt:newP.prompt,likes:0,uses:0,date:"Az önce"},...ps]);setSubmitted(true);setNewP({title:"",cat:"Kod",prompt:""}); setTimeout(()=>setSubmitted(false),3000);}}
  return <div style={{padding:"28px 20px",maxWidth:900,margin:"0 auto"}}>
    <div style={{marginBottom:22}}><div style={{fontSize:9,letterSpacing:".2em",color:"#475569",marginBottom:5}}>TOPLULUK</div><div style={{fontSize:22,fontWeight:800,color:"#e2e8f0"}}>💬 Prompt Kütüphanesi</div><div style={{fontSize:12,color:"#64748b",marginTop:3}}>Topluluktan en iyi promptlar — paylaş, beğen, kullan</div></div>
    {/* Prompt ekle */}
    <div style={{background:"rgba(52,211,153,0.06)",border:"1px solid rgba(52,211,153,0.2)",borderRadius:16,padding:"20px",marginBottom:24}}>
      <div style={{fontSize:13,fontWeight:700,color:"#34d399",marginBottom:14}}>➕ Yeni Prompt Paylaş</div>
      {submitted?<div style={{fontSize:13,color:"#34d399",fontWeight:600,textAlign:"center",padding:"10px"}}>✅ Promptun eklendi! Teşekkürler.</div>:(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:10}}>
            <input style={{background:"rgba(0,0,0,0.4)",border:"1px solid rgba(52,211,153,0.2)",borderRadius:8,color:"#e2e8f0",padding:"9px 12px",fontSize:12,fontFamily:"inherit",outline:"none"}} placeholder="Prompt başlığı..." value={newP.title} onChange={e=>setNewP(p=>({...p,title:e.target.value}))}/>
            <select style={{background:"rgba(0,0,0,0.4)",border:"1px solid rgba(52,211,153,0.2)",borderRadius:8,color:"#e2e8f0",padding:"9px 12px",fontFamily:"inherit",fontSize:12,outline:"none"}} value={newP.cat} onChange={e=>setNewP(p=>({...p,cat:e.target.value}))}>
              {["Kod","İçerik","İş","Araştırma","Eğitim","Yazarlık","Verimlilik"].map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <textarea style={{width:"100%",minHeight:80,background:"rgba(0,0,0,0.4)",border:"1px solid rgba(52,211,153,0.2)",borderRadius:8,color:"#e2e8f0",padding:"9px 12px",fontSize:12,fontFamily:"inherit",outline:"none",resize:"vertical",boxSizing:"border-box"}} placeholder="Prompt metnini yaz... (Köşeli parantez [] içine değiştirilebilir alanları yaz)" value={newP.prompt} onChange={e=>setNewP(p=>({...p,prompt:e.target.value}))}/>
          <button onClick={submit} disabled={!newP.title||!newP.prompt} style={{padding:"10px 22px",borderRadius:9,border:"none",background:!newP.title||!newP.prompt?"rgba(255,255,255,0.06)":"linear-gradient(135deg,#34d399,#059669)",color:"#fff",fontSize:12,fontWeight:700,cursor:!newP.title||!newP.prompt?"not-allowed":"pointer",fontFamily:"inherit",width:"fit-content"}}>Paylaş →</button>
        </div>
      )}
    </div>
    {/* Prompt listesi */}
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      {prompts.map((p,i)=>(
        <div key={i} style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:14,padding:"16px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <span style={{fontSize:18}}>{p.avatar}</span>
              <div><div style={{fontSize:12,fontWeight:700,color:"#e2e8f0"}}>{p.title}</div><div style={{fontSize:10,color:"#475569"}}>{p.user} · {p.date}</div></div>
            </div>
            <Tag text={p.cat} color="#34d399" size={9}/>
          </div>
          <div style={{background:"rgba(0,0,0,0.35)",borderRadius:9,padding:"10px 12px",fontSize:12,color:"#94a3b8",lineHeight:1.6,marginBottom:10,fontStyle:"italic",display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
            <span>"{p.prompt}"</span>
            <button onClick={()=>navigator.clipboard?.writeText(p.prompt)} style={{flexShrink:0,padding:"3px 8px",borderRadius:5,border:"none",background:"rgba(52,211,153,0.15)",color:"#34d399",fontSize:9,cursor:"pointer",fontFamily:"inherit"}}>Kopyala</button>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{fontSize:11,color:"#475569"}}>{p.date}</div>
            <button onClick={()=>like(i)} style={{padding:"5px 12px",borderRadius:7,border:`1px solid rgba(244,114,182,${liked[i]?0.5:0.2})`,background:liked[i]?"rgba(244,114,182,0.12)":"transparent",color:liked[i]?"#f472b6":"#475569",fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>
              ❤️{liked[i]?" ✓":""}
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>;
}

// 7. QUIZ SAYFASI
function QuizPage(){
  const[idx,setIdx]=useState(0);const[sel,setSel]=useState(null);const[score,setScore]=useState(0);const[done,setDone]=useState(false);const[answers,setAnswers]=useState([]);
  function choose(i){if(sel!==null)return;setSel(i);const correct=i===QUIZ_DATA[idx].ans;if(correct)setScore(s=>s+1);setAnswers(a=>[...a,{q:QUIZ_DATA[idx].q,correct,chosen:i,right:QUIZ_DATA[idx].ans}]);}
  function next(){if(idx+1>=QUIZ_DATA.length)setDone(true);else{setIdx(i=>i+1);setSel(null);}}
  function restart(){setIdx(0);setSel(null);setScore(0);setDone(false);setAnswers([]);}
  const q=QUIZ_DATA[idx];
  if(done) return <div style={{padding:"40px 20px",maxWidth:600,margin:"0 auto",textAlign:"center"}}>
    <div style={{fontSize:48,marginBottom:12}}>{score>=5?"🏆":score>=3?"😊":"📚"}</div>
    <div style={{fontSize:24,fontWeight:900,color:"#e2e8f0",marginBottom:8}}>{score}/{QUIZ_DATA.length} Doğru!</div>
    <div style={{fontSize:13,color:"#64748b",marginBottom:20,lineHeight:1.7}}>{score>=5?"Mükemmel! AI konusunda gerçek bir uzman sayılırsın.":score>=3?"İyi gidiyorsun. Sözlük ve blog yazılarımızla bilgini derinleştir.":"AI dünyası hızlı değişiyor. Öğrenme merkezimize göz at!"}</div>
    <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
      {answers.map((a,i)=><div key={i} style={{background:a.correct?"rgba(52,211,153,0.08)":"rgba(244,114,182,0.08)",border:`1px solid ${a.correct?"rgba(52,211,153,0.2)":"rgba(244,114,182,0.2)"}`,borderRadius:10,padding:"10px 14px",textAlign:"left",fontSize:11,color:"#94a3b8"}}>{a.correct?"✅":"❌"} {a.q}</div>)}
    </div>
    <button onClick={restart} style={{padding:"12px 28px",borderRadius:10,border:"none",background:"linear-gradient(135deg,#00dcff,#a855f7)",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Tekrar Dene</button>
  </div>;
  return <div style={{padding:"28px 20px",maxWidth:620,margin:"0 auto"}}>
    <div style={{marginBottom:20}}><div style={{fontSize:9,letterSpacing:".2em",color:"#475569",marginBottom:5}}>AI QUIZ</div><div style={{fontSize:22,fontWeight:800,color:"#e2e8f0"}}>🧠 AI Bilgi Testi</div></div>
    <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
      <Tag text={`Soru ${idx+1}/${QUIZ_DATA.length}`} color="#00dcff"/>
      <div style={{display:"flex",gap:4}}>{QUIZ_DATA.map((_,i)=><div key={i} style={{width:8,height:8,borderRadius:"50%",background:i<idx?"#34d399":i===idx?"#00dcff":"rgba(255,255,255,0.1)"}}/>)}</div>
      <Tag text={`${score} doğru`} color="#34d399"/>
    </div>
    <div style={{background:"rgba(0,220,255,0.04)",border:"1px solid rgba(0,220,255,0.15)",borderRadius:14,padding:"20px",marginBottom:16}}>
      <div style={{fontSize:15,fontWeight:700,color:"#e2e8f0",lineHeight:1.5}}>{q.q}</div>
    </div>
    <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
      {q.opts.map((o,i)=>{
        const isCorrect=i===q.ans; const isChosen=i===sel;
        let bg="rgba(255,255,255,0.03)"; let border="rgba(255,255,255,0.1)"; let color="#94a3b8";
        if(sel!==null){if(isCorrect){bg="rgba(52,211,153,0.1)";border="#34d399";color="#34d399";}else if(isChosen&&!isCorrect){bg="rgba(244,114,182,0.1)";border="#f472b6";color="#f472b6";}}
        return <button key={i} onClick={()=>choose(i)} disabled={sel!==null} style={{padding:"13px 16px",borderRadius:10,border:`1px solid ${border}`,background:bg,color,fontSize:13,cursor:sel!==null?"default":"pointer",fontFamily:"inherit",textAlign:"left",transition:"all .15s",fontWeight:isChosen||isCorrect?700:400}}>
          {sel!==null&&isCorrect?"✅ ":sel!==null&&isChosen&&!isCorrect?"❌ ":""}{String.fromCharCode(65+i)}. {o}
        </button>;
      })}
    </div>
    {sel!==null&&<div style={{background:"rgba(168,85,247,0.06)",border:"1px solid rgba(168,85,247,0.2)",borderRadius:10,padding:"12px 16px",marginBottom:14}}>
      <div style={{fontSize:11,color:"#a855f7",fontWeight:700,marginBottom:4}}>💡 Açıklama</div>
      <div style={{fontSize:12,color:"#94a3b8",lineHeight:1.6}}>{q.exp}</div>
    </div>}
    {sel!==null&&<button onClick={next} style={{width:"100%",padding:"12px",borderRadius:10,border:"none",background:"linear-gradient(135deg,#00dcff,#a855f7)",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{idx+1>=QUIZ_DATA.length?"Sonuçları Gör":"Sonraki Soru →"}</button>}
  </div>;
}

// 8. ARAÇ DİZİNİ (affiliate + sponsor rozetli)
function DizinPage({setPage}){
  const[ac,setAc]=useState("cursor");const[s,setS]=useState("");
  const tools=Object.values(TOOL_DETAILS);
  const filtered=s?tools.filter(t=>t.name.toLowerCase().includes(s.toLowerCase())):tools;
  const allCats=[{id:"sohbet",icon:"💬",label:"Sohbet AI",color:"#00dcff",tools:["ChatGPT","Claude","Gemini","Grok","Perplexity","DeepSeek"]},{id:"gorsel",icon:"🎨",label:"Görsel AI",color:"#f472b6",tools:["Midjourney","DALL-E 3","Firefly","Stable Diffusion"]},{id:"video",icon:"🎬",label:"Video AI",color:"#a855f7",tools:["Sora","HeyGen","Runway","Pika","Kling"]},{id:"ses",icon:"🔊",label:"Ses AI",color:"#34d399",tools:["ElevenLabs","Suno","Udio","Murf"]},{id:"kod",icon:"💻",label:"Kod AI",color:"#fb923c",tools:["Cursor","Copilot","Claude Code","Replit","v0"]},{id:"sunum",icon:"📊",label:"Sunum AI",color:"#60a5fa",tools:["Gamma","Canva AI","Beautiful.ai","Tome"]},{id:"arastirma",icon:"📚",label:"Araştırma",color:"#00dcff",tools:["Perplexity","NotebookLM","Elicit","Consensus"]},{id:"otomasyon",icon:"⚙️",label:"Otomasyon",color:"#a855f7",tools:["n8n","Make","Zapier","AutoGPT"]}];
  return <div style={{padding:"28px 20px",maxWidth:900,margin:"0 auto"}}>
    <div style={{marginBottom:20}}><div style={{fontSize:9,letterSpacing:".2em",color:"#475569",marginBottom:5}}>ARAÇ DİZİNİ</div><div style={{fontSize:22,fontWeight:800,color:"#e2e8f0"}}>🌐 AI Araç Dizini</div><div style={{fontSize:12,color:"#64748b",marginTop:3}}>Detaylı sayfalar · Affiliate linkler · Sponsor içerikler</div></div>
    {/* Detaylı araçlar */}
    <div style={{marginBottom:24}}>
      <div style={{fontSize:13,fontWeight:700,color:"#e2e8f0",marginBottom:12}}>⭐ Detaylı İncelenen Araçlar</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10}}>
        {Object.entries(TOOL_DETAILS).map(([key,t])=>(
          <div key={key} onClick={()=>setPage(`tool-${key}`)} style={{background:`${t.color}06`,border:`1px solid ${t.color}18`,borderRadius:13,padding:"14px",cursor:"pointer",transition:"all .15s"}} onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"} onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontSize:22}}>{t.icon}</span><div style={{display:"flex",gap:3,flexWrap:"wrap",justifyContent:"flex-end"}}>{t.sponsor&&<Tag text="Sponsorlu" color="#fb923c" size={8}/>}<Tag text={`★ ${t.score}`} color={t.color} size={8}/></div></div>
            <div style={{fontSize:13,fontWeight:700,color:"#e2e8f0",marginBottom:2}}>{t.name}</div>
            <div style={{fontSize:10,color:"#475569",marginBottom:6}}>{t.tag}</div>
            <div style={{fontSize:10,color:t.free?"#34d399":"#fb923c",marginBottom:8}}>{t.free?"✓ Ücretsiz plan":"Ücretli"}</div>
            <div style={{fontSize:11,color:t.color,fontWeight:600}}>Detaylı İncele →</div>
          </div>
        ))}
      </div>
    </div>
    {/* Tüm kategoriler */}
    <div>
      <div style={{fontSize:13,fontWeight:700,color:"#e2e8f0",marginBottom:12}}>🗂️ 8 Kategoride Tüm Araçlar</div>
      <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:14}}>
        {allCats.map(c=><button key={c.id} onClick={()=>setAc(c.id)} style={{padding:"6px 12px",borderRadius:8,border:"none",cursor:"pointer",fontSize:11,fontFamily:"inherit",background:ac===c.id?`${c.color}18`:"rgba(255,255,255,0.04)",color:ac===c.id?c.color:"#475569"}}>{c.icon} {c.label}</button>)}
      </div>
      {allCats.filter(c=>c.id===ac).map(cat=>(
        <div key={cat.id} style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",gap:8}}>
          {cat.tools.map(name=>{const detail=Object.values(TOOL_DETAILS).find(t=>t.name===name);return(
            <div key={name} onClick={()=>detail&&setPage(`tool-${Object.keys(TOOL_DETAILS).find(k=>TOOL_DETAILS[k].name===name)}`)} style={{background:`${cat.color}06`,border:`1px solid ${cat.color}18`,borderRadius:10,padding:"12px",cursor:"pointer",transition:"all .15s"}} onMouseEnter={e=>e.currentTarget.style.borderColor=cat.color+"44"} onMouseLeave={e=>e.currentTarget.style.borderColor=cat.color+"18"}>
              <div style={{fontSize:12,fontWeight:700,color:"#e2e8f0",marginBottom:3}}>{name}</div>
              {detail&&<><div style={{fontSize:9,color:cat.color}}>★ {detail.score}</div><div style={{fontSize:9,color:detail.free?"#34d399":"#fb923c",marginTop:2}}>{detail.free?"Ücretsiz":"Ücretli"}</div></>}
              {detail&&<div style={{fontSize:9,color:cat.color,marginTop:4}}>Detay →</div>}
            </div>
          );})}
        </div>
      ))}
    </div>
  </div>;
}

// 9. OYUN (AI mı İnsan mı?)
function OyunPage(){
  const GAME=[
    {text:"Güneş batarken denizin mavisi, gökyüzünün turuncusuyla dans ederken, sahilde yürüyen iki sevgili ellerini tutmuş uzaklara bakıyordu.",isAI:true,reveal:"ChatGPT (GPT-5.5) yazdı",hint:"Mükemmel akış ve klişe metafor AI izlenimi veriyor"},
    {text:"Bugün patronumla kötü bir gün geçirdim. Toplantıda fikirlerim alınmadı, eve gelince çantamı köşeye fırlattım. Zaten her şey böyle gidiyor.",isAI:false,reveal:"Gerçek Twitter kullanıcısı yazdı",hint:"Düzensiz anlatım ve duygusal patlama insan izlenimi"},
    {text:"Kuantum mekaniği, parçacıkların aynı anda birden fazla durumda bulunabildiği fikrini içerir. Schrödinger'in kedisi bu ilkeyi simgeler.",isAI:true,reveal:"Claude Opus 4.7 yazdı",hint:"Ansiklopedik netlik ve doğru referans AI izlenimi"},
    {text:"Arkadaşım 3 yıldır borçlu. 500 lira için bozuşmak olmaz ama bu ilk kez değil. Ne yapayım bilmiyorum.",isAI:false,reveal:"Gerçek Ekşi Sözlük entry'si",hint:"Spesifik rakam ve sosyal dilema tipik insan yazısı"},
    {text:"Bu pasta tarifini deneyin. Malzemeler: 200g un, 3 yumurta, 150g şeker. Önce kuru malzemeleri karıştırın, ardından yaş malzemeleri ekleyin.",isAI:true,reveal:"Gemini 2.5 Pro yazdı",hint:"Kusursuz ölçüler ve mükemmel format AI izlenimi"},
    {text:"Bunu yazan sen misin? Yok artık emin misin? Bir daha bak bence. Ben sana söyledim hep ama dinlemedin işte.",isAI:false,reveal:"Gerçek WhatsApp mesajı",hint:"Kesik cümleler ve tekrar eden ifadeler insan yazısı"},
    {text:"Yapay zekanın 2026'daki en önemli gelişmesi, çok ajanlı sistemlerin gerçek dünya görevlerinde otonom olarak çalışabilmesidir.",isAI:true,reveal:"ChatGPT (GPT-5.5) yazdı",hint:"Akademik ton, kesin tarih ve teknik terim AI izlenimi"},
    {text:"Bugün market alışverişi yaparken fiyatlara baktım. Geçen ay 200 liraydı şimdi 350. İnsanlar nasıl geçiniyor anlayamıyorum.",isAI:false,reveal:"Gerçek Facebook yorumu",hint:"Şikayet tonu, kişisel deneyim ve belirsiz karşılaştırma"},
    {text:"İstanbul'un kalabalık sokaklarında, tarih ile modernliğin iç içe geçtiği o eşsiz atmosfer, ziyaretçileri büyülemeye devam etmektedir.",isAI:true,reveal:"Claude Opus 4.7 yazdı",hint:"Resmi dil, akıcı cümle yapısı ve evrensel genelleme"},
    {text:"Kapı komşumuz her gece müzik açıyor. Defalarca söyledim ama ne fayda. Apartman yönetimine yazsam mı acaba.",isAI:false,reveal:"Gerçek bir forum yazısı",hint:"Pratik sorun arayışı ve kararsızlık insan özelliği"},
    {text:"Türkiye ekonomisi, 2025 yılında %4.2 büyüme oranıyla beklentilerin üzerinde bir performans sergiledi.",isAI:true,reveal:"Gemini 2.5 Pro yazdı",hint:"İstatistik, kesin rakam ve nesnel sunum AI izlenimi"},
    {text:"Sabah 6'da uyandım, spor yapmaya karar verdim ama yataktan kalkmak zor oldu. Yarın kesinlikle yapacağım diyorum yine.",isAI:false,reveal:"Gerçek Instagram hikayesi",hint:"Erteleme davranışı ve özeleştiri çok insani bir özellik"},
  ];
  const[idx,setIdx]=useState(0);const[ans,setAns]=useState(null);const[score,setScore]=useState({d:0,w:0});const[done,setDone]=useState(false);
  const g=GAME[idx];
  function guess(isAI){const c=isAI===g.isAI;if(c)setScore(s=>({...s,d:s.d+1}));else setScore(s=>({...s,w:s.w+1}));setAns({correct:c});}
  function next(){setAns(null);if(idx+1>=GAME.length)setDone(true);else setIdx(i=>i+1);}
  function restart(){setIdx(0);setAns(null);setScore({d:0,w:0});setDone(false);}
  if(done) return <div style={{padding:"60px 20px",textAlign:"center",maxWidth:500,margin:"0 auto"}}>
    <div style={{fontSize:48,marginBottom:12}}>{score.d>=5?"🏆":score.d>=3?"😊":"😅"}</div>
    <div style={{fontSize:22,fontWeight:900,color:"#e2e8f0",marginBottom:8}}>Oyun Bitti!</div>
    <div style={{fontSize:14,color:"#64748b",marginBottom:8}}>{score.d}/{GAME.length} doğru</div>
    <div style={{fontSize:12,color:"#94a3b8",marginBottom:24,lineHeight:1.7}}>{score.d>=5?"Harika! AI metinlerini tanımada uzmansın.":score.d>=3?"Fena değil. AI giderek daha inandırıcı oluyor.":"AI artık insanlardan ayırt edilemez hale geliyor!"}</div>
    <button onClick={restart} style={{padding:"12px 28px",borderRadius:10,border:"none",background:"linear-gradient(135deg,#f472b6,#e11d48)",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Tekrar Oyna</button>
  </div>;
  return <div style={{padding:"28px 20px",maxWidth:660,margin:"0 auto"}}>
    <div style={{marginBottom:20}}><div style={{fontSize:9,letterSpacing:".2em",color:"#f472b6",marginBottom:5}}>🎮 İNTERAKTİF OYUN</div><div style={{fontSize:22,fontWeight:800,color:"#e2e8f0"}}>🤖 AI mi Yazdı, İnsan mı?</div><div style={{fontSize:12,color:"#64748b",marginTop:3}}>Tahmin et — AI metinleri ne kadar insan gibi?</div></div>
    <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(244,114,182,0.2)",borderRadius:16,padding:"24px"}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}><Tag text={`Soru ${idx+1}/${GAME.length}`} color="#f472b6"/><div style={{display:"flex",gap:12}}><span style={{fontSize:13,color:"#34d399",fontWeight:700}}>✓ {score.d}</span><span style={{fontSize:13,color:"#f472b6",fontWeight:700}}>✗ {score.w}</span></div></div>
      <div style={{background:"rgba(0,0,0,0.4)",borderRadius:12,padding:"20px",marginBottom:20,fontSize:14,color:"#cbd5e1",lineHeight:1.9,fontStyle:"italic",borderLeft:"3px solid rgba(244,114,182,0.4)"}}>{g.text}</div>
      {!ans?(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <button onClick={()=>guess(true)} style={{padding:"14px",borderRadius:11,border:"2px solid rgba(0,220,255,0.3)",background:"rgba(0,220,255,0.06)",color:"#00dcff",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>🤖 AI Yazdı</button>
          <button onClick={()=>guess(false)} style={{padding:"14px",borderRadius:11,border:"2px solid rgba(168,85,247,0.3)",background:"rgba(168,85,247,0.06)",color:"#a855f7",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>👤 İnsan Yazdı</button>
        </div>
      ):(
        <div>
          <div style={{background:ans.correct?"rgba(52,211,153,0.1)":"rgba(244,114,182,0.1)",border:`1px solid ${ans.correct?"#34d399":"#f472b6"}`,borderRadius:12,padding:"16px",marginBottom:14}}>
            <div style={{fontSize:15,fontWeight:800,color:ans.correct?"#34d399":"#f472b6",marginBottom:8}}>{ans.correct?"✅ Doğru!":"❌ Yanlış!"}</div>
            <div style={{fontSize:12,color:"#e2e8f0",fontWeight:600,marginBottom:6}}>{g.reveal}</div>
            <div style={{fontSize:11,color:"#64748b"}}>💡 {g.hint}</div>
          </div>
          <button onClick={next} style={{width:"100%",padding:"13px",borderRadius:10,border:"none",background:"linear-gradient(135deg,#f472b6,#e11d48)",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{idx+1>=GAME.length?"Sonuçları Gör":"Sonraki →"}</button>
        </div>
      )}
    </div>
  </div>;
}

// Diğer basit sayfalar (Haberler, Para, Hakkımızda, vs.)
function HaberlerPage({setPage}){return <div style={{padding:"28px 20px",maxWidth:900,margin:"0 auto"}}><div style={{marginBottom:22}}><div style={{fontSize:9,letterSpacing:".2em",color:"#475569",marginBottom:5}}>HABERLER</div><div style={{fontSize:22,fontWeight:800,color:"#e2e8f0"}}>📰 AI Haberleri</div></div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))",gap:13}}>{NEWS.map((n,i)=><Card key={i} color={n.color} style={{padding:"19px"}} onClick={()=>{}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><Tag text={n.tag} color={n.color}/>{n.hot&&<Tag text="🔥" color="#ff6b6b" size={8}/>}</div><div style={{fontSize:20,marginBottom:8}}>{n.emoji}</div><div style={{fontSize:15,fontWeight:700,color:"#e2e8f0",marginBottom:7,lineHeight:1.4}}>{n.title}</div><div style={{fontSize:12,color:"#64748b",lineHeight:1.65,marginBottom:11}}>{n.desc}</div><div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:"#334155"}}><span>📰 {n.src}</span><span>{n.time} · {n.read}</span></div></Card>)}</div></div>;}
function ParaPage(){
  const[aktif,setAktif]=useState(0);
  const yollar=[
    {
      icon:"✍️",baslik:"AI İçerik Üreticisi",kazanc:"₺5.000 - ₺30.000/ay",sure:"2-4 hafta",seviye:"Başlangıç",renk:"#00dcff",
      ozet:"YouTube, blog, Instagram ve TikTok'ta AI araçlarıyla içerik üret. Reklam geliri + sponsorluk + affiliate ile para kazan.",
      gercekOrnek:"Ahmet, yazılım blog'u açtı. ChatGPT ile haftada 5 makale üretiyor. 6 ayda 12.000 aylık okuyucu, Google AdSense'den aylık ₺3.500 kazanıyor.",
      adimlar:[
        {no:1,baslik:"Niş Seç",aciklama:"Para kazanan niş seç: Fintech, sağlık, eğitim, teknoloji. Çok geniş değil, çok dar değil. 'AI araçları' iyi bir niş."},
        {no:2,baslik:"Platform Belirle",aciklama:"YouTube: Reklam geliri en yüksek. Blog: SEO ile organik trafik. Instagram/TikTok: Hızlı büyüme. En az 2 platform."},
        {no:3,baslik:"AI Workflow Kur",aciklama:"ChatGPT ile konu araştır → Claude ile yaz → Canva AI ile görsel yap → Buffer ile paylaş. Günde 2 saat yeterli."},
        {no:4,baslik:"İlk 1000 Takipçi",aciklama:"Nişindeki topluluklarda yorum yap, değer katacak içerikler paylaş, tutarlı ol. 60-90 gün sabret."},
        {no:5,baslik:"Monetizasyon",aciklama:"YouTube: 1000 abone + 4000 saat → AdSense. Blog: AdSense + affiliate. Instagram: 10K+ → sponsorluk."},
      ],
      araclar:["ChatGPT (içerik)","Claude (uzun yazı)","Canva AI (görsel)","ElevenLabs (ses)","Buffer (planlama)"],
      kazancDetay:"Başlangıç: ₺500-2000/ay | Orta: ₺3000-10000/ay | İleri: ₺15000-30000+/ay",
      affiliateler:["Google AdSense","Amazon Associates","Cursor affiliate ($20/referral)","ElevenLabs affiliate"]
    },
    {
      icon:"💻",baslik:"AI Freelancer / Yazılımcı",kazanc:"₺8.000 - ₺50.000/ay",sure:"4-8 hafta",seviye:"Orta",renk:"#a855f7",
      ozet:"Cursor ve Claude Code ile kod 3x hızlı yaz, aynı sürede 3x fazla proje teslim et. Upwork ve Fiverr'de AI uzmanı olarak markalaş.",
      gercekOrnek:"Mert, web geliştirici. Cursor kullanmaya başladıktan sonra proje teslim süresini %60 kısalttı. Aynı ücretle 2.5x fazla proje alıyor. Aylık geliri ₺8.000'den ₺22.000'e çıktı.",
      adimlar:[
        {no:1,baslik:"Cursor'ı Öğren",aciklama:"cursor.com'dan indir, 3 gün kullan. Tab tamamlama, Ctrl+K ile düzenleme, Ctrl+L ile chat. 1 haftada ustalaşırsın."},
        {no:2,baslik:"Portföy Güncelle",aciklama:"GitHub profilini güncelle. 'AI-assisted development' uzmanlığını öne çıkar. 3 showcase proje hazırla."},
        {no:3,baslik:"Upwork/Fiverr Profil",aciklama:"'AI-powered web development' başlığıyla profil oluştur. İlk 5 müşteriyi düşük fiyatla al, yorumları topla."},
        {no:4,baslik:"Hızlı Teslim Avantajı",aciklama:"'3 günde teslim' yaz. AI sayesinde bunu gerçekten yapabilirsin. Hız en büyük fark yaratıcın."},
        {no:5,baslik:"Fiyat Artır",aciklama:"10 iyi yorum sonrası %30-50 fiyat artır. AI kullandığını söyleme — hızlı ve kaliteli iş yaptığını söyle."},
      ],
      araclar:["Cursor (kod)","Claude Code (ajan)","GitHub Copilot (tamamlama)","v0.dev (UI)","Replit (hızlı prototip)"],
      kazancDetay:"Junior: ₺8000-15000/ay | Mid: ₺15000-30000/ay | Senior: ₺30000-50000+/ay",
      affiliateler:["Cursor affiliate","GitHub Copilot","Replit affiliate"]
    },
    {
      icon:"🎨",baslik:"AI Görsel Tasarım Servisi",kazanc:"₺3.000 - ₺20.000/ay",sure:"1-2 hafta",seviye:"Kolay",renk:"#f472b6",
      ozet:"Midjourney ve Adobe Firefly ile logo, sosyal medya görseli, ürün fotoğrafı ve sunum tasarımı sat. Türkiye'de bu servise büyük talep var.",
      gercekOrnek:"Zeynep, grafik tasarımcı. Midjourney'i öğrendikten sonra logo paketini ₺150'den ₺500'e çıkardı. Aylık 25 logo yapıyor, ₺12.500 kazanıyor. Tasarım süresi: logo başına 45 dakika.",
      adimlar:[
        {no:1,baslik:"Araçları Öğren",aciklama:"Midjourney ($10/ay): En yüksek kalite. DALL-E 3 (ücretsiz ChatGPT ile): Metinli görseller. Adobe Firefly: Ticari kullanım güvenli."},
        {no:2,baslik:"Hizmet Paketi Oluştur",aciklama:"Logo paketi: ₺300-600. Sosyal medya paketi: ₺800-2000/ay. Sunum tasarımı: ₺500-1500. Ürün fotoğrafı: ₺200-500/ürün."},
        {no:3,baslik:"Fiverr/Bionluk Profil",aciklama:"'AI-powered logo design' kategorisinde profil aç. İlk 3 müşteriye %50 indirim yap, portfolio doldur."},
        {no:4,baslik:"LinkedIn Pazarlama",aciklama:"Before/after görseller paylaş. 'AI ile 3 günde logo tasarladım' içerikleri çok ilgi çekiyor. Organik trafik gelir."},
        {no:5,baslik:"Kurumsal Müşteri",aciklama:"KOBİ'lere aylık sosyal medya paketi sat. ₺1500-3000/ay, düzenli gelir. 5 müşteri = ₺10.000+/ay."},
      ],
      araclar:["Midjourney (yaratıcı)","Adobe Firefly (ticari)","Canva AI (düzenleme)","DALL-E 3 (metin)","Remove.bg (arkaplan)"],
      kazancDetay:"Başlangıç: ₺2000-5000/ay | Orta: ₺8000-15000/ay | Kurumsal: ₺15000-20000+/ay",
      affiliateler:["Midjourney referral","Adobe affiliate","Canva affiliate ($36/referral)"]
    },
    {
      icon:"📚",baslik:"AI Eğitim & Danışmanlık",kazanc:"₺5.000 - ₺80.000/ay",sure:"4-8 hafta",seviye:"Orta",renk:"#34d399",
      ozet:"Şirketlere ve bireylere AI araçları eğitimi ver. Türkiye'de AI eğitimi talebi 2023'e göre 10x arttı ama eğitimci sayısı çok az.",
      gercekOrnek:"Elif, eski bir pazarlamacı. 3 aylık AI öğrenimiyle kurumsal eğitimci oldu. Şirket başına ₺5.000-15.000 workshop ücreti alıyor. Ayda 4 eğitim = ₺25.000+.",
      adimlar:[
        {no:1,baslik:"Uzmanlık Seç",aciklama:"'AI ile pazarlama', 'AI ile müşteri hizmetleri', 'AI ile yazılım geliştirme'. Genel değil, sektör spesifik ol."},
        {no:2,baslik:"Kurs İçeriği Hazırla",aciklama:"ChatGPT ile 10 modüllük müfredat hazırla. Gamma ile sunum yap. Her modül: teori + pratik + ödev."},
        {no:3,baslik:"Udemy / Kendi Sitesi",aciklama:"Udemy: Hızlı erişim, düşük fiyat. Kendi sitesi: Yüksek marj. İkisini birden yap. Udemy ile müşteri çek, siteye taşı."},
        {no:4,baslik:"LinkedIn İçerik",aciklama:"Haftada 3 AI ipucu paylaş. 'Şirketinizde AI nasıl kullanılır' konusunda yaz. Organik inbound müşteri gelir."},
        {no:5,baslik:"Kurumsal Satış",aciklama:"LinkedIn'de İK ve eğitim müdürlerine ulaş. 1 saatlik ücretsiz demo sun. Teklif kabul oranı %30-40."},
      ],
      araclar:["ChatGPT (müfredat)","Gamma (sunum)","Loom (video kayıt)","Notion (materyal)","Zoom (eğitim)"],
      kazancDetay:"Online Kurs: ₺2000-8000/ay | Workshop: ₺5000-15000/etkinlik | Kurumsal: ₺20000-80000/ay",
      affiliateler:["Udemy affiliate","Teachable affiliate","Notion affiliate"]
    },
    {
      icon:"🔧",baslik:"AI Otomasyon Servisi",kazanc:"₺10.000 - ₺60.000/ay",sure:"6-12 hafta",seviye:"Orta-İleri",renk:"#fb923c",
      ozet:"n8n ve Make ile şirketlerin tekrarlayan süreçlerini otomatize et. E-ticaret, muhasebe, müşteri hizmetleri — her sektörde talep var.",
      gercekOrnek:"Burak, n8n kullanarak bir e-ticaret firmasına sipariş-kargo-müşteri bildirim akışını otomatize etti. 3 haftalık iş: ₺18.000. Bakım sözleşmesi: ₺3.000/ay.",
      adimlar:[
        {no:1,baslik:"n8n Öğren",aciklama:"n8n.io'da ücretsiz hesap aç. YouTube'da 'n8n tutorial' ara. 2 haftada temel workflow'ları yapabilirsin."},
        {no:2,baslik:"Nişini Belirle",aciklama:"E-ticaret otomasyonu (sipariş, kargo, iade). Müşteri hizmetleri (ticket yönetimi). Pazarlama (lead nurturing)."},
        {no:3,baslik:"Case Study Hazırla",aciklama:"Kendi projeni veya ücretsiz yaptığın ilk işi case study yap: 'X şirketi Y saati kurtardı, Z TL tasarruf etti.'"},
        {no:4,baslik:"Fiyatlandırma",aciklama:"Proje bazlı: ₺5000-20000. Aylık retainer: ₺2000-5000. Tasarruf bazlı: 'Şirkete kazandırdığımın %20'si.'"},
        {no:5,baslik:"Müşteri Bul",aciklama:"LinkedIn'de operasyon müdürlerine ulaş. 'İş süreçlerinizi otomatize ediyorum' mesajı gönder. Demo teklif et."},
      ],
      araclar:["n8n (otomasyon)","Make (görsel)","Zapier (kolay)","ChatGPT API","Airtable (veri)"],
      kazancDetay:"Küçük proje: ₺5000-15000 | Büyük proje: ₺20000-60000 | Retainer: ₺3000-8000/ay",
      affiliateler:["n8n affiliate","Make affiliate","Zapier affiliate"]
    },
    {
      icon:"💡",baslik:"Prompt Mühendisi",kazanc:"₺15.000 - ₺60.000/ay",sure:"1-3 ay",seviye:"Orta",renk:"#60a5fa",
      ozet:"Şirketlere özel AI prompt sistemleri tasarla. ChatGPT ve Claude'u şirketin iş süreçlerine entegre et. 2026'nın en hızlı büyüyen mesleği.",
      gercekOrnek:"Kerem, bir sigorta şirketine müşteri hizmetleri prompt sistemi kurdu. 6 haftalık çalışma: ₺25.000. Şirket 4 çağrı merkezi çalışanı yerine sistemi kullanıyor.",
      adimlar:[
        {no:1,baslik:"Prompt Tekniklerini Öğren",aciklama:"Zero-shot, few-shot, chain of thought, role prompting. IMDATAI'nin prompt rehberini oku. 2 hafta yeterli."},
        {no:2,baslik:"Sektör Seç",aciklama:"Hukuk, finans, sağlık, e-ticaret, müşteri hizmetleri. Sektör bilgin olan yerde başla. Derin domain bilgisi fark yaratır."},
        {no:3,baslik:"Test Sistemi Kur",aciklama:"100 farklı girdi ile test et. Başarı oranını ölç. Müşteriye 'X% doğruluk oranı' sunabilmek için gerekli."},
        {no:4,baslik:"Portföy Hazırla",aciklama:"3 farklı sektörden örnek prompt sistemi yap. GitHub'a yükle. 'AI Prompt Engineer' LinkedIn başlığı ekle."},
        {no:5,baslik:"Danışmanlık Sat",aciklama:"Küçük şirketlere: ₺5000-10000. Orta ölçekli: ₺15000-30000. Kurumsal: ₺30000+. Bakım: ₺2000-5000/ay."},
      ],
      araclar:["ChatGPT (test)","Claude (karmaşık)","Gemini (araştırma)","LangChain (sistem)","PostHog (analitik)"],
      kazancDetay:"Junior: ₺15000-25000/ay | Mid: ₺25000-45000/ay | Senior: ₺45000-60000+/ay",
      affiliateler:["Anthropic referral","OpenAI referral","LangChain affiliate"]
    },
  ];
  const aktifYol=yollar[aktif];
  return <div style={{padding:"28px 20px",maxWidth:960,margin:"0 auto"}}>
    <div style={{marginBottom:24}}>
      <div style={{fontSize:9,letterSpacing:".2em",color:"#34d399",marginBottom:5}}>PARA KAZAN</div>
      <div style={{fontSize:24,fontWeight:900,color:"#e2e8f0",marginBottom:8}}>💰 AI ile Para Kazanmanın 6 Gerçekçi Yolu</div>
      <div style={{fontSize:13,color:"#64748b",lineHeight:1.7}}>Türkiye'de AI bilen profesyonel sayısı hâlâ çok az. Bu pencere kapanmadan başla. Her yol için gerçek örnek, adım adım rehber ve kazanç detayları.</div>
    </div>

    {/* Uyarı kutusu */}
    <div style={{background:"rgba(52,211,153,0.08)",border:"1px solid rgba(52,211,153,0.25)",borderRadius:13,padding:"16px 20px",marginBottom:24,display:"flex",gap:14,alignItems:"flex-start"}}>
      <span style={{fontSize:24,flexShrink:0}}>🇹🇷</span>
      <div>
        <div style={{fontSize:13,fontWeight:700,color:"#34d399",marginBottom:4}}>Neden Şimdi?</div>
        <div style={{fontSize:12,color:"#94a3b8",lineHeight:1.7}}>Türkiye AI trafiğinde dünya #1 (%94.49) ama AI bilen uzman sayısı çok az. 2024'e göre AI meslek ilanları %340 arttı. 2027'de bu avantaj kapanmaya başlayacak. Şimdi başla.</div>
      </div>
    </div>

    {/* Yol seçici */}
    <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:20}}>
      {yollar.map((y,i)=>(
        <button key={i} onClick={()=>setAktif(i)} style={{padding:"8px 14px",borderRadius:10,border:`1px solid ${aktif===i?y.renk+"60":"rgba(255,255,255,0.08)"}`,background:aktif===i?`${y.renk}12`:"rgba(255,255,255,0.02)",color:aktif===i?y.renk:"#64748b",fontSize:12,cursor:"pointer",fontFamily:"inherit",fontWeight:aktif===i?700:400,display:"flex",alignItems:"center",gap:6}}>
          <span>{y.icon}</span><span>{y.baslik}</span>
        </button>
      ))}
    </div>

    {/* Aktif yol detayı */}
    <div style={{background:`${aktifYol.renk}06`,border:`1px solid ${aktifYol.renk}22`,borderRadius:16,overflow:"hidden"}}>
      {/* Header */}
      <div style={{background:`${aktifYol.renk}10`,padding:"22px 24px",borderBottom:`1px solid ${aktifYol.renk}18`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12}}>
          <div style={{display:"flex",gap:14,alignItems:"center"}}>
            <span style={{fontSize:40}}>{aktifYol.icon}</span>
            <div>
              <div style={{fontSize:20,fontWeight:900,color:"#e2e8f0",marginBottom:4}}>{aktifYol.baslik}</div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                <span style={{fontSize:10,background:`${aktifYol.renk}20`,color:aktifYol.renk,padding:"3px 10px",borderRadius:6,fontWeight:700}}>{aktifYol.seviye}</span>
                <span style={{fontSize:10,background:"rgba(255,255,255,0.06)",color:"#94a3b8",padding:"3px 10px",borderRadius:6}}>⏱ {aktifYol.sure} başlangıç</span>
              </div>
            </div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:22,fontWeight:900,color:aktifYol.renk}}>{aktifYol.kazanc}</div>
            <div style={{fontSize:10,color:"#64748b",marginTop:2}}>aylık potansiyel</div>
          </div>
        </div>
        <div style={{marginTop:14,fontSize:13,color:"#94a3b8",lineHeight:1.7}}>{aktifYol.ozet}</div>
      </div>

      <div style={{padding:"22px 24px"}}>
        {/* Gerçek örnek */}
        <div style={{background:"rgba(0,0,0,0.3)",border:`1px solid ${aktifYol.renk}20`,borderRadius:12,padding:"16px",marginBottom:20}}>
          <div style={{fontSize:11,color:aktifYol.renk,fontWeight:700,marginBottom:8,letterSpacing:".1em"}}>💬 GERÇEK ÖRNEK</div>
          <div style={{fontSize:13,color:"#e2e8f0",lineHeight:1.8,fontStyle:"italic"}}>"{aktifYol.gercekOrnek}"</div>
        </div>

        {/* Adımlar */}
        <div style={{marginBottom:20}}>
          <div style={{fontSize:14,fontWeight:700,color:"#e2e8f0",marginBottom:14}}>📋 Adım Adım Başlangıç Rehberi</div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {aktifYol.adimlar.map(a=>(
              <div key={a.no} style={{display:"flex",gap:14,alignItems:"flex-start",background:"rgba(255,255,255,0.02)",borderRadius:10,padding:"14px"}}>
                <div style={{width:28,height:28,borderRadius:"50%",background:`${aktifYol.renk}20`,border:`2px solid ${aktifYol.renk}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:900,color:aktifYol.renk,flexShrink:0}}>{a.no}</div>
                <div>
                  <div style={{fontSize:13,fontWeight:700,color:"#e2e8f0",marginBottom:4}}>{a.baslik}</div>
                  <div style={{fontSize:12,color:"#64748b",lineHeight:1.7}}>{a.aciklama}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alt bilgiler */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:14}}>
          <div style={{background:"rgba(255,255,255,0.02)",borderRadius:12,padding:"16px"}}>
            <div style={{fontSize:12,fontWeight:700,color:"#e2e8f0",marginBottom:10}}>🛠️ Kullanacağın Araçlar</div>
            {aktifYol.araclar.map(a=><div key={a} style={{fontSize:11,color:"#64748b",marginBottom:6,display:"flex",gap:8}}><span style={{color:aktifYol.renk,flexShrink:0}}>→</span>{a}</div>)}
          </div>
          <div style={{background:"rgba(255,255,255,0.02)",borderRadius:12,padding:"16px"}}>
            <div style={{fontSize:12,fontWeight:700,color:"#e2e8f0",marginBottom:10}}>📈 Kazanç Detayı</div>
            <div style={{fontSize:12,color:"#64748b",lineHeight:1.8,marginBottom:10}}>{aktifYol.kazancDetay}</div>
            <div style={{fontSize:11,fontWeight:700,color:aktifYol.renk,marginBottom:6}}>💸 Affiliate Fırsatları:</div>
            {aktifYol.affiliateler.map(a=><div key={a} style={{fontSize:11,color:"#64748b",marginBottom:4,display:"flex",gap:6}}><span style={{color:"#34d399",flexShrink:0}}>✓</span>{a}</div>)}
          </div>
        </div>
      </div>
    </div>

    {/* Hızlı başlangıç */}
    <div style={{marginTop:24,background:"linear-gradient(135deg,rgba(0,220,255,0.06),rgba(168,85,247,0.06))",border:"1px solid rgba(0,220,255,0.15)",borderRadius:14,padding:"20px 24px"}}>
      <div style={{fontSize:14,fontWeight:700,color:"#e2e8f0",marginBottom:14}}>⚡ Bu Hafta Başlamak İçin 3 Adım</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12}}>
        {[
          {no:"1",yazi:"Bugün: ChatGPT veya Claude'a ücretsiz kaydol, 30 dakika dene",renk:"#00dcff"},
          {no:"2",yazi:"Bu hafta: Seçtiğin gelir yolunun ilk adımını yap (hesap aç, profil oluştur)",renk:"#a855f7"},
          {no:"3",yazi:"Bu ay: İlk müşterini bul veya ilk içeriğini yayınla. Mükemmel değil, başlamış ol.",renk:"#34d399"},
        ].map(a=>(
          <div key={a.no} style={{display:"flex",gap:12,alignItems:"flex-start"}}>
            <div style={{width:24,height:24,borderRadius:"50%",background:`${a.renk}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:900,color:a.renk,flexShrink:0}}>{a.no}</div>
            <div style={{fontSize:12,color:"#94a3b8",lineHeight:1.6}}>{a.yazi}</div>
          </div>
        ))}
      </div>
    </div>
  </div>;
}

function HakkimizdaPage(){return <div style={{padding:"28px 20px",maxWidth:800,margin:"0 auto"}}><div style={{marginBottom:20}}><div style={{fontSize:9,letterSpacing:".2em",color:"#475569",marginBottom:5}}>HAKKIMIZDA</div><div style={{fontSize:22,fontWeight:800,color:"#e2e8f0"}}>⬡ IMDATAI Kimdir?</div></div><div style={{background:"linear-gradient(135deg,rgba(0,220,255,0.06),rgba(168,85,247,0.06))",border:"1px solid rgba(0,220,255,0.15)",borderRadius:16,padding:"24px",marginBottom:20}}><div style={{fontSize:14,color:"#94a3b8",lineHeight:1.9}}>IMDATAI, Türkiye'de yapay zeka okuryazarlığını artırmak için kuruldu. 2026'da Türkiye AI trafiğinde dünya birincisi olduğunda bir şeyi fark ettik: Türkçe, kapsamlı ve güvenilir bir AI kaynağı yok. IMDATAI bu boşluğu doldurmak için burada.</div></div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:12}}>{[{icon:"🎯",t:"Doğruluk",d:"Her içeriği doğruluyoruz."},{icon:"🇹🇷",t:"Türkçe Önce",d:"Çeviri değil, orijinal Türkçe."},{icon:"🆓",t:"Erişilebilirlik",d:"Temel içerik her zaman ücretsiz."},{icon:"⚡",t:"Hız",d:"AI dünyası hızlı, biz de."}].map(v=><div key={v.t} style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:13,padding:"16px"}}><div style={{fontSize:22,marginBottom:8}}>{v.icon}</div><div style={{fontSize:13,fontWeight:700,color:"#e2e8f0",marginBottom:6}}>{v.t}</div><div style={{fontSize:11,color:"#64748b"}}>{v.d}</div></div>)}</div></div>;}
function IletisimPage(){const[f,setF]=useState({ad:"",email:"",mesaj:""});const[s,setS]=useState(false);return <div style={{padding:"28px 20px",maxWidth:600,margin:"0 auto"}}><div style={{marginBottom:20}}><div style={{fontSize:9,letterSpacing:".2em",color:"#475569",marginBottom:5}}>İLETİŞİM</div><div style={{fontSize:22,fontWeight:800,color:"#e2e8f0"}}>📬 Bize Ulaşın</div></div>{s?<div style={{textAlign:"center",padding:"40px"}}><div style={{fontSize:32,marginBottom:8}}>✅</div><div style={{fontSize:16,fontWeight:700,color:"#34d399"}}>Mesajın İletildi!</div></div>:<div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,padding:"22px"}}><div style={{display:"flex",flexDirection:"column",gap:12}}>{[["Ad Soyad","ad","Adın..."],["E-posta","email","E-posta..."]].map(([l,k,ph])=><div key={k}><div style={{fontSize:10,color:"#64748b",marginBottom:5}}>{l.toUpperCase()}</div><input style={{width:"100%",background:"rgba(0,0,0,0.4)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,color:"#e2e8f0",padding:"10px 13px",fontSize:12,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}} placeholder={ph} value={f[k]} onChange={e=>setF(p=>({...p,[k]:e.target.value}))}/></div>)}<div><div style={{fontSize:10,color:"#64748b",marginBottom:5}}>MESAJ</div><textarea style={{width:"100%",minHeight:120,background:"rgba(0,0,0,0.4)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,color:"#e2e8f0",padding:"10px 13px",fontSize:12,fontFamily:"inherit",outline:"none",resize:"vertical",boxSizing:"border-box"}} placeholder="Mesajını yaz..." value={f.mesaj} onChange={e=>setF(p=>({...p,mesaj:e.target.value}))}/></div><button onClick={()=>{if(f.ad&&f.email&&f.mesaj)setS(true);}} style={{padding:"12px",borderRadius:10,border:"none",background:"linear-gradient(135deg,#00dcff,#a855f7)",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Gönder →</button></div></div>}</div>;}
function GizlilikPage(){return <div style={{padding:"28px 20px",maxWidth:800,margin:"0 auto"}}><div style={{marginBottom:20}}><div style={{fontSize:9,letterSpacing:".2em",color:"#475569",marginBottom:5}}>HUKUKİ</div><div style={{fontSize:22,fontWeight:800,color:"#e2e8f0"}}>🔒 Gizlilik & KVKK</div></div>{[{t:"Veri Sorumlusu",c:"IMDATAI (imdatai.com), 6698 sayılı KVKK kapsamında veri sorumlusudur. İletişim: iletisim@imdatai.com"},{t:"Toplanan Veriler",c:"Bülten için e-posta (isteğe bağlı). İletişim formu için ad ve e-posta. Anonim analitik. AI sorguları bizde saklanmaz."},{t:"KVKK Haklarınız",c:"Verilerinizin işlenip işlenmediğini öğrenme, düzeltme, silme ve işlemeye itiraz hakkına sahipsiniz. Talep: kvkk@imdatai.com"},{t:"Cookie Politikası",c:"Zorunlu ve analitik çerezler kullanılmaktadır. Tarayıcı ayarlarından kapatabilirsiniz."},{t:"Değişiklikler",c:"Bu politika güncellenebilir. Önemli değişiklikler bülten ile duyurulur."}].map(s=><div key={s.t} style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:12,padding:"16px",marginBottom:10}}><div style={{fontSize:13,fontWeight:700,color:"#e2e8f0",marginBottom:6}}>{s.t}</div><div style={{fontSize:12,color:"#64748b",lineHeight:1.8}}>{s.c}</div></div>)}</div>;}
function ProPage(){const[e,setE]=useState("");const[s,setS]=useState(false);return <div style={{padding:"28px 20px",maxWidth:860,margin:"0 auto"}}><div style={{textAlign:"center",marginBottom:28}}><div style={{fontSize:9,letterSpacing:".2em",color:"#a855f7",marginBottom:8}}>⭐ PRO MODÜL — YAKINDA</div><h1 style={{fontSize:"clamp(20px,5vw,36px)",fontWeight:900,color:"#e2e8f0",margin:"0 0 10px"}}>48 AI Aracı Çok Yakında</h1><p style={{fontSize:13,color:"#64748b",maxWidth:440,margin:"0 auto",lineHeight:1.7}}>6 kategoride 48 profesyonel AI aracı. Tümü Türkçe, saniyeler içinde sonuç.</p><div style={{marginTop:16,background:"rgba(168,85,247,0.08)",border:"1px solid rgba(168,85,247,0.25)",borderRadius:12,padding:"16px",display:"inline-block"}}>{s?<div style={{fontSize:13,color:"#a855f7",fontWeight:700}}>✅ Kaydedildin! Pro açılınca haber vereceğiz.</div>:<div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap",justifyContent:"center"}}><input style={{flex:1,minWidth:200,maxWidth:280,background:"rgba(0,0,0,0.4)",border:"1px solid rgba(168,85,247,0.2)",borderRadius:8,color:"#e2e8f0",padding:"10px 14px",fontSize:13,fontFamily:"inherit",outline:"none"}} placeholder="E-posta adresin..." value={e} onChange={ev=>setE(ev.target.value)}/><button onClick={()=>{if(e.includes("@"))setS(true);}} style={{padding:"10px 22px",borderRadius:8,border:"none",background:"linear-gradient(135deg,#a855f7,#7c3aed)",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>🔔 Bildir</button></div>}</div></div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:12}}>{[{cat:"✍️ Yazı",color:"#00dcff",tools:["Sosyal Medya Post","E-posta","Blog","Haber","Reklam","Hikaye","Video Script","Mektup"]},{cat:"🔍 Analiz",color:"#a855f7",tools:["Metin Analizi","Veri","CV Analiz","Rakip","SEO","Finansal","Trend","Yorum"]},{cat:"🎓 Eğitim",color:"#34d399",tools:["Quiz","Prompt Geliştir","Özet","Kavram","Kelime","Matematik","Bilim","Fikir"]},{cat:"💼 İş",color:"#fb923c",tools:["CV Oluştur","Mülakat","İş Planı","Sözleşme","Sunum","Teklif","OKR","Toplantı"]},{cat:"🌍 Dil",color:"#60a5fa",tools:["Çeviri","Dilbilgisi","Ton","Parafraz","Çok Dilli","Özetle","Dil Analizi","Asistan"]},{cat:"⚙️ Teknik",color:"#f472b6",tools:["Hata Bulucu","Kod Açıkla","Dönüştür","Döküman","Test","SQL","Regex","Komut"]}].map(c=><div key={c.cat} style={{background:"rgba(255,255,255,0.02)",border:`1px solid ${c.color}18`,borderRadius:13,padding:"16px"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}><div style={{fontSize:14,fontWeight:700,color:"#e2e8f0"}}>{c.cat}</div><Tag text="8 araç" color={c.color}/></div><div style={{display:"flex",flexWrap:"wrap",gap:5}}>{c.tools.map(t=><div key={t} style={{fontSize:10,background:"rgba(0,0,0,0.3)",color:"#475569",padding:"3px 8px",borderRadius:5}}>🔒 {t}</div>)}</div></div>)}</div></div>;}

// ══════════════════════════════════════════════════════════
// YENİ VERİ — SÖZLÜK, PROMPT, MODEL, KARŞILAŞTIRMA, vs.
// ══════════════════════════════════════════════════════════

const GLOSSARY_DATA = [
  {term:"Yapay Zeka (AI)",cat:"Temel",en:"Artificial Intelligence",def:"İnsanlar gibi öğrenip düşünebilen bilgisayar sistemleri. ChatGPT, Siri, Netflix öneri sistemi hepsi AI."},
  {term:"Makine Öğrenmesi",cat:"Temel",en:"Machine Learning",def:"Bilgisayarların veri ile kendi kendine öğrenmesi. Kural yazmak yerine öğrenmesine izin vermek."},
  {term:"Derin Öğrenme",cat:"Temel",en:"Deep Learning",def:"İnsan beynini taklit eden çok katmanlı sinir ağları. Görüntü tanıma, dil anlama bu teknoloji ile."},
  {term:"Generatif AI",cat:"Temel",en:"Generative AI",def:"Yeni içerik üretebilen AI türü. ChatGPT metin, Midjourney görsel, ElevenLabs ses üretir."},
  {term:"LLM",cat:"Temel",en:"Large Language Model",def:"Büyük Dil Modeli. Milyarlarca kelimeyle eğitilmiş metin anlayan AI. GPT, Claude, Gemini birer LLM."},
  {term:"Nöral Ağ",cat:"Temel",en:"Neural Network",def:"İnsan beynindeki nöronları taklit eden matematiksel yapı. Veriden pattern öğrenir."},
  {term:"Dar AI (ANI)",cat:"Temel",en:"Narrow AI",def:"Sadece belirli bir görevde uzman AI. Mevcut tüm AI bu kategoride."},
  {term:"Genel AI (AGI)",cat:"Temel",en:"Artificial General Intelligence",def:"İnsanlar gibi her alanda düşünebilen AI. Henüz mevcut değil. En büyük tartışma konusu."},
  {term:"Token",cat:"Teknik",en:"Token",def:"AI'ın metni işlediği en küçük birim. ≈¾ kelime = 1 token. Fiyatlandırma buna göre."},
  {term:"Context Window",cat:"Teknik",en:"Context Window",def:"Modelin tek sohbette işleyebildiği max metin. ChatGPT: 128K, Claude: 1M, Gemini: 2M token."},
  {term:"Temperature",cat:"Teknik",en:"Temperature",def:"AI'ın yaratıcılık seviyesi (0-2). 0=deterministik, 1=dengeli, 2=çok yaratıcı."},
  {term:"Embedding",cat:"Teknik",en:"Embedding",def:"Metni sayısal vektöre dönüştürme. Semantik arama temeli."},
  {term:"Fine-tuning",cat:"Teknik",en:"Fine-tuning",def:"Önceden eğitilmiş modeli özel verilerle yeniden eğitme."},
  {term:"RAG",cat:"Teknik",en:"RAG",def:"Retrieval-Augmented Generation. AI dış kaynaklara erişerek güncel bilgiyle cevap verir."},
  {term:"Transformer",cat:"Teknik",en:"Transformer",def:"Modern AI'ların temel mimarisi. 2017'de Google tarafından icat edildi."},
  {term:"Attention Mekanizması",cat:"Teknik",en:"Attention Mechanism",def:"Modelin hangi kelimelere odaklanacağını belirler. Anlam ayrımını sağlar."},
  {term:"Parametreler",cat:"Teknik",en:"Parameters",def:"Modelin eğitim sırasında öğrendiği sayısal değerler. GPT-4: ~1 trilyon."},
  {term:"Quantization",cat:"Teknik",en:"Quantization",def:"Model boyutunu küçültmek için hassasiyeti azaltma. Daha hızlı, daha ucuz."},
  {term:"Inference",cat:"Teknik",en:"Inference",def:"Eğitilmiş modeli kullanarak tahmin üretme işlemi."},
  {term:"Vector Database",cat:"Teknik",en:"Vector Database",def:"Embedding vektörlerini depolayan özel veritabanı. Pinecone, Weaviate örnekler."},
  {term:"RLHF",cat:"Teknik",en:"RLHF",def:"Reinforcement Learning from Human Feedback. İnsan değerlendirmeleriyle AI'ı iyileştirme."},
  {term:"Multimodal",cat:"Teknik",en:"Multimodal",def:"Metin, görsel, ses ve videoyu aynı anda işleyebilen AI modeli."},
  {term:"Diffusion Model",cat:"Teknik",en:"Diffusion Model",def:"Görsel AI'ların temel mimarisi. Gürültüden yavaş yavaş görüntü oluşturur."},
  {term:"Agent (Ajan)",cat:"Modeller",en:"AI Agent",def:"Bağımsız karar alıp eylem gerçekleştiren AI. İnsan olmadan görev tamamlar. 2026'nın #1 trendi."},
  {term:"Agentic AI",cat:"Modeller",en:"Agentic AI",def:"Uzun vadeli görevleri otonom planlayan ve çalıştıran AI sistemi. Cursor 3 buna örnek."},
  {term:"Foundation Model",cat:"Modeller",en:"Foundation Model",def:"Genel amaçla büyük veriyle eğitilmiş temel model. GPT-4, Claude, Gemini bunlar."},
  {term:"Open Source AI",cat:"Modeller",en:"Open Source AI",def:"Kaynak kodu herkese açık AI. Llama, Mistral, DeepSeek örnekler."},
  {term:"MCP",cat:"Modeller",en:"Model Context Protocol",def:"Anthropic geliştirdi. AI ajanların araçlara bağlanma standardı. 97M+ kurulum."},
  {term:"SWE-bench",cat:"Modeller",en:"SWE-bench",def:"Yazılım mühendisliğinde AI performansını ölçen benchmark. Claude Opus 4.7 %87.6 ile lider."},
  {term:"Benchmark",cat:"Modeller",en:"Benchmark",def:"AI modellerinin performansını ölçen standart test. MMLU, HumanEval, SWE-bench."},
  {term:"Prompt",cat:"Prompt",en:"Prompt",def:"AI'a verilen girdi/komut. Kalitesi doğrudan çıktıyı belirler."},
  {term:"Prompt Engineering",cat:"Prompt",en:"Prompt Engineering",def:"AI'dan en iyi sonucu almak için prompt yazma sanatı ve bilimi."},
  {term:"Zero-shot",cat:"Prompt",en:"Zero-shot",def:"AI'a hiç örnek vermeden görev yaptırmak."},
  {term:"Few-shot",cat:"Prompt",en:"Few-shot",def:"AI'a 2-5 örnek verip sonra görevi yaptırmak. Daha tutarlı sonuç."},
  {term:"Chain of Thought",cat:"Prompt",en:"Chain of Thought",def:"AI'ın adım adım düşünmesini sağlama. Matematikte %30 daha doğru."},
  {term:"System Prompt",cat:"Prompt",en:"System Prompt",def:"AI'a verilen gizli talimatlar. Persona, kısıtlamalar, format belirler."},
  {term:"Role Prompting",cat:"Prompt",en:"Role Prompting",def:"AI'a rol verme tekniği. 'Deneyimli bir avukat olarak...' → çok daha iyi sonuç."},
  {term:"Tree of Thought",cat:"Prompt",en:"Tree of Thought",def:"AI'dan alternatif yolları değerlendirmesini isteme. Karmaşık problemler için."},
  {term:"Hallüsinasyon",cat:"Güvenlik",en:"Hallucination",def:"AI'ın uydurma bilgiyi güvenle sunması. En büyük risk! Kritik bilgileri mutlaka doğrula."},
  {term:"Bias (Önyargı)",cat:"Güvenlik",en:"Bias",def:"AI'ın eğitim verisinden devraldığı önyargılar. Cinsiyet, ırk yanlılıkları."},
  {term:"Constitutional AI",cat:"Güvenlik",en:"Constitutional AI",def:"Anthropic'in Claude için geliştirdiği güvenlik yaklaşımı."},
  {term:"AI Alignment",cat:"Güvenlik",en:"AI Alignment",def:"AI'ın insan değerleriyle uyumlu kalmasını sağlama. Anthropic'in ana araştırma alanı."},
  {term:"Jailbreaking",cat:"Güvenlik",en:"Jailbreaking",def:"AI güvenlik filtrelerini aşma girişimi. Etik değil, modern modellerde çok zor."},
  {term:"AGI Risk",cat:"Güvenlik",en:"AGI Risk",def:"Genel yapay zekanın insanlık için oluşturabileceği potansiyel tehlikeler."},
  {term:"AI-native",cat:"İş",en:"AI-native",def:"Sıfırdan AI ile tasarlanmış ürün. Perplexity, Cursor, Gamma örnekler."},
  {term:"GPU",cat:"İş",en:"GPU",def:"AI eğitim için zorunlu donanım. NVIDIA H100: $30.000/adet."},
  {term:"API",cat:"İş",en:"API",def:"Yazılımların birbiriyle konuşması. Claude API ile kendi uygulamanı yapabilirsin."},
  {term:"GEO",cat:"İş",en:"Generative Engine Optimization",def:"ChatGPT tarafından önerilen marka olma. 2026'da SEO'nun yerini alıyor."},
  {term:"Inference Cost",cat:"İş",en:"Inference Cost",def:"AI'ı çalıştırmanın maliyeti. Claude Sonnet: ~$0.013/sorgu."},
  {term:"Vibe Coding",cat:"İş",en:"Vibe Coding",def:"Cursor ve Claude ile kod yazmak yerine ne istediğini söylemek. 2026 trendi."},
  {term:"AI Wrapper",cat:"İş",en:"AI Wrapper",def:"Mevcut AI modellerinin üzerine inşa edilen uygulama."},
  {term:"Text-to-Speech",cat:"Medya",en:"Text-to-Speech",def:"Metni sese dönüştürme. ElevenLabs lider. Gerçek insan sesinden ayırt edilemiyor."},
  {term:"Text-to-Image",cat:"Medya",en:"Text-to-Image",def:"Metin açıklamasından görsel üretme. Midjourney, DALL-E örnekler."},
  {term:"Text-to-Video",cat:"Medya",en:"Text-to-Video",def:"Metinden video üretme. Sora, Runway örnekler. 2025-2026'da patladı."},
  {term:"Voice Cloning",cat:"Medya",en:"Voice Cloning",def:"Birinin sesini kopyalama. ElevenLabs ile 15 sn kayıt yeterli."},
  {term:"Deepfake",cat:"Medya",en:"Deepfake",def:"AI ile sahte gerçekçi görüntü/video/ses üretme. Hem yaratıcı hem tehlikeli."},
  {term:"LoRA",cat:"Medya",en:"LoRA",def:"Az veriyle modeli hızlı fine-tune etme tekniği. Stable Diffusion'da yaygın."},
  {term:"KVKK",cat:"TR Özel",en:"Turkish Data Law",def:"Kişisel Verilerin Korunması Kanunu. AI uygulamalarında veri işleme için önemli."},
  {term:"BTK",cat:"TR Özel",en:"Turkish ICT Authority",def:"Bilgi Teknolojileri ve İletişim Kurumu. Türkiye'de dijital düzenlemelerden sorumlu."},
  {term:"TÜBİTAK AI",cat:"TR Özel",en:"TUBITAK AI",def:"Türkiye'nin ulusal AI araştırma destekleri. Yerli model geliştirme projeleri."},
  {term:"Prompt Injection",cat:"Güvenlik",en:"Prompt Injection",def:"Kötü niyetli talimatları prompt'a gömerek AI'ı manipüle etme saldırısı. Üretim sistemlerinde büyük risk."},
  {term:"Grounding",cat:"Teknik",en:"Grounding",def:"AI'ın cevaplarını doğrulanabilir kaynaklara dayandırma. Hallüsinasyonu azaltmanın en etkili yöntemi."},
  {term:"Tokenizer",cat:"Teknik",en:"Tokenizer",def:"Metni token'lara bölen yazılım. Her modelin farklı tokenizer'ı var. GPT ve Claude farklı böler."},
  {term:"MMLU",cat:"Modeller",en:"MMLU",def:"Massive Multitask Language Understanding. 57 farklı alanda AI bilgisini ölçen popüler benchmark."},
  {term:"Mixture of Experts",cat:"Teknik",en:"Mixture of Experts (MoE)",def:"Her sorgu için farklı 'uzman' modeller devreye girer. Daha verimli, daha az hesaplama. GPT-4 bu yapıyı kullanıyor."},
  {term:"Constitutional AI",cat:"Güvenlik",en:"Constitutional AI",def:"Anthropic'in güvenlik yaklaşımı. AI, kural seti (anayasa) ile kendi davranışını değerlendirip düzeltir."},
  {term:"Emergent Behavior",cat:"Modeller",en:"Emergent Behavior",def:"Modeller belirli büyüklüğe ulaşınca beklenmedik yetenekler ortaya çıkması. Eğitimde verilmeyen özellikler."},
  {term:"Synthetic Data",cat:"Teknik",en:"Synthetic Data",def:"AI tarafından üretilen eğitim verisi. Gerçek veri yetersizliğinde kullanılır. Özellikle tıp ve finans alanında."},
  {term:"RLVR",cat:"Teknik",en:"RL with Verifiable Rewards",def:"Doğrulanabilir ödüllü pekiştirmeli öğrenme. DeepSeek'in başarısında kilit teknik. Doğru/yanlış yanıtları otomatik doğrular."},
];

const AI_MODELS_DATA = {
  chatgpt:{name:"ChatGPT",company:"OpenAI",icon:"🤖",color:"#00dcff",tagline:"Dünyanın En Popüler AI Asistanı",users:"900M haftalık",model:"GPT-5.5",context:"128K token",scores:{genel:97,kod:93,yazi:96,turkce:92,gorsel:94,hiz:95,gizlilik:75},plans:[{n:"Ücretsiz",p:"$0",d:"GPT-4o mini, günlük sınır",c:"#475569"},{n:"Plus",p:"$20/ay",d:"GPT-5.5, 80 mesaj/3saat",c:"#00dcff"},{n:"Pro",p:"$200/ay",d:"Sınırsız, tüm modeller",c:"#a855f7"}],guclu:["En geniş kullanıcı tabanı","Mükemmel görsel üretim (DALL-E 3)","Gelişmiş ses modu","En iyi plugin ekosistemi","Hafıza özelliği"],zayif:["Kısa context window (128K)","Hallüsinasyon riski yüksek","$200/ay Pro çok pahalı","Günlük limit kısıtları"],bestFor:"Genel kullanım, yaratıcı görevler, görsel üretim, sesli sohbet",prompt:"Rol ver: 'Deneyimli bir pazarlamacı olarak...' diye başla. Sonuç %300 daha iyi.",url:"https://chatgpt.com",sistem:"OpenAI'ın Transformer tabanlı modeli. RLHF ile eğitildi. 2022 ChatGPT 3.5'ten GPT-5.5'e dramatik gelişim. 175+ ülkede kullanılıyor."},
  claude:{name:"Claude",company:"Anthropic",icon:"🧠",color:"#a855f7",tagline:"Kodlama ve Analiz Şampiyonu",users:"30M aylık",model:"Opus 4.7",context:"1M token",scores:{genel:96,kod:99,yazi:97,turkce:94,gorsel:60,hiz:87,gizlilik:96},plans:[{n:"Ücretsiz",p:"$0",d:"Claude 3.5 Haiku, günlük sınır",c:"#475569"},{n:"Pro",p:"$20/ay",d:"Opus 4.7, 5x kullanım",c:"#a855f7"},{n:"Max",p:"$100/ay",d:"Sınırsız, öncelikli erişim",c:"#f472b6"}],guclu:["Kodlamada rakipsiz (#1 SWE-bench %87.6)","1M token context (kitap boyutu)","En az hallüsinasyon","Constitutional AI güvenliği","Derin analiz"],zayif:["Görsel üretim yok","Daha az popüler","Ses modu sınırlı","Düşük günlük limit (ücretsiz)"],bestFor:"Kod yazma/debug, uzun belge analizi, akademik araştırma, güvenli kullanım",prompt:"1M token context'ini kullan: Tüm kod tabanını veya uzun PDF'leri yükle, 'Analiz et' de. Rakipsiz özellik.",url:"https://claude.ai",sistem:"Anthropic'in Constitutional AI yaklaşımıyla eğitildi. AI kendi davranışını değerlendiriyor. Haiku (hızlı), Sonnet (dengeli), Opus (en güçlü) üç seviye."},
  gemini:{name:"Gemini",company:"Google",icon:"🌟",color:"#34d399",tagline:"Google Ekosistemiyle Entegre AI",users:"100M aylık",model:"2.5 Pro",context:"2M token",scores:{genel:94,kod:91,yazi:90,turkce:89,gorsel:97,hiz:98,gizlilik:72},plans:[{n:"Ücretsiz",p:"$0",d:"Gemini 2.5, geniş sınır",c:"#475569"},{n:"AI Pro",p:"$19.99/ay",d:"2.5 Pro, Google One",c:"#34d399"},{n:"AI Ultra",p:"$249/ay",d:"Ultra modeller, iş araçları",c:"#00dcff"}],guclu:["2M token context (dünya rekoru)","Google Drive/Docs/Gmail entegrasyonu","En iyi görsel anlama","Gerçek zamanlı web arama","En hızlı yanıt"],zayif:["Türkçe diğerlerinden zayıf","Yaratıcı yazarlık orta","Google bağımlılığı","Tutarsız davranış"],bestFor:"Araştırma, Google Workspace kullanıcıları, multimodal görevler, görsel analiz",prompt:"Google Drive dosyalarını direkt analiz ettir. 'Bu Drive dosyamı özetle ve aksiyon öner' de. Rakiplerin yapamayacağı şey.",url:"https://gemini.google.com",sistem:"Google DeepMind tarafından sıfırdan multimodal tasarlandı. Nano (mobil), Flash (hızlı), Pro (dengeli), Ultra (en güçlü) katmanlar. Tüm Google ekosistemine entegre."},
};

const COMP_DATA = {
  sohbet:{title:"💬 Sohbet AI",tools:["ChatGPT","Claude","Gemini","Grok","Perplexity"],colors:["#00dcff","#a855f7","#34d399","#f472b6","#60a5fa"],cats:["Genel Zeka","Kod","Uzun Metin","Türkçe","Hız","Ücretsiz Plan","Gizlilik"],scores:[[97,96,94,89,91],[93,99,91,84,80],[88,98,90,79,91],[92,94,89,81,80],[95,87,98,93,88],[85,88,90,82,90],[75,96,72,85,80]]},
  gorsel:{title:"🎨 Görsel AI",tools:["Midjourney","DALL-E 3","Firefly","SD 3.5","Ideogram"],colors:["#f472b6","#00dcff","#fb923c","#a855f7","#34d399"],cats:["Kalite","Türkçe Metin","Hız","Ücretsiz","Tutarlılık","Fotorealizm"],scores:[[95,90,88,85,87],[88,85,82,80,83],[82,87,90,84,80],[20,90,92,95,80],[87,83,88,82,84],[93,88,85,80,83]]},
  video:{title:"🎬 Video AI",tools:["Sora","HeyGen","Runway","Pika","Kling"],colors:["#60a5fa","#00dcff","#f472b6","#a855f7","#34d399"],cats:["Kalite","Avatar","Düzenleme","Hız","Ücretsiz","Türkçe"],scores:[[94,60,85,70,20,80],[75,96,70,88,70,95],[85,70,93,82,72,78],[80,75,78,90,80,75],[82,78,82,85,82,80]]},
  ses:{title:"🔊 Ses AI",tools:["ElevenLabs","Suno","Udio","Murf","Descript"],colors:["#fb923c","#34d399","#a855f7","#60a5fa","#00dcff"],cats:["Ses Kalitesi","Türkçe","Müzik","Podcast","Klonlama"],scores:[[96,95,70,88,94],[60,70,95,65,40],[65,68,92,60,45],[85,82,45,93,78],[88,80,50,88,85]]},
  kod:{title:"💻 Kod AI",tools:["Cursor","Copilot","Claude Code","Replit","v0"],colors:["#34d399","#f472b6","#a855f7","#fb923c","#60a5fa"],cats:["Kod Kalitesi","Debug","Refactor","Test","Ücretsiz","UI Üretim"],scores:[[98,96,93,88,80,80],[94,90,90,88,60,75],[96,94,95,90,60,70],[78,80,75,82,90,85],[88,84,85,75,85,96]]},
};

const TIMELINE_DATA = [
  {year:"1950",icon:"🧠",title:"Turing Testi",desc:"Alan Turing 'Makineler düşünebilir mi?' sorusunu sordu.",color:"#475569"},
  {year:"1956",icon:"🎓",title:"'AI' Terimi Doğdu",desc:"John McCarthy, Dartmouth Konferansı'nda 'Artificial Intelligence' terimini kullandı.",color:"#60a5fa"},
  {year:"1997",icon:"♟️",title:"Deep Blue Kazandı",desc:"IBM'in Deep Blue'su dünya satranç şampiyonu Kasparov'u yendi.",color:"#a855f7"},
  {year:"2012",icon:"📸",title:"Derin Öğrenme",desc:"AlexNet ImageNet'te insanları geçti. Derin öğrenme patlaması başladı.",color:"#34d399"},
  {year:"2017",icon:"⚡",title:"Transformer",desc:"Google 'Attention is All You Need' ile Transformer'ı yayınladı.",color:"#00dcff"},
  {year:"2020",icon:"🚀",title:"GPT-3 Şoku",desc:"175 milyar parametreli GPT-3 dünyayı etkiledi.",color:"#a855f7"},
  {year:"2022",icon:"💥",title:"ChatGPT: 5 Günde 1M",desc:"ChatGPT tarihte en hızlı büyüyen ürün oldu.",color:"#f472b6"},
  {year:"2023",icon:"🎨",title:"Görsel AI Patlaması",desc:"Midjourney v5, DALL-E 3. AI görsel kalitesi insan sanatçıyla yarışmaya başladı.",color:"#34d399"},
  {year:"2024",icon:"🤖",title:"Ajan AI Dönemi",desc:"Claude 3, GPT-4o. Çok adımlı otonom görevler mümkün oldu.",color:"#fb923c"},
  {year:"2025",icon:"💻",title:"Vibe Coding",desc:"Cursor 3, Claude Code. Kod yazmak yerine söylemek yeterli.",color:"#00dcff"},
  {year:"2026",icon:"🌟",title:"Süper Uygulama",desc:"GPT-5.5, Claude Opus 4.7, Gemini 3.1 Ultra. 1 milyar kullanıcı.",color:"#a855f7"},
];

const PROMPTS_DATA = [
  {cat:"💼 İş & Kariyer",color:"#fb923c",icon:"💼",items:[
    {title:"Mükemmel CV",kotu:"CV yaz",iyi:"10 yıl deneyimli İK danışmanı olarak [pozisyon] için CV yaz. Başarıları sayısal verilerle destekle (X ile Y% artış sağladım gibi). ATS sistemlerini geçecek anahtar kelimeler ekle. Türkçe, 1 sayfa, tersine kronolojik.",note:"Rol + sayısal başarı + ATS = işe alım şansı 3x artar"},
    {title:"Mülakat Hazırlığı",kotu:"Mülakat soruları ver",iyi:"[Şirket] için [pozisyon] mülakatı. STAR metoduyla yanıtlayabileceğim 10 soru ve her biri için cevap çerçevesi. Şirket değerleri: [değerler]. Zor ve tuzak sorular dahil et. Türkçe.",note:"Şirketi araştır, değerleri ver, STAR formülü şart"},
    {title:"Müzakere E-postası",kotu:"Maaş isteği yaz",iyi:"[X TL] teklif aldım, [Y TL] istiyorum. Deneyimim: [deneyim]. Sektör ort. [Z TL]. İlişkiyi bozmayan, değer önerisine dayanan Türkçe müzakere e-postası. 3 farklı ton: doğrudan, diplomatik, esnek.",note:"3 versiyon iste, duruma göre seç"},
    {title:"İş Planı",kotu:"İş planı yaz",iyi:"Startup danışmanı olarak [ürün/hizmet] için 12 aylık iş planı. Pazar analizi, rekabet, gelir modeli, pazarlama, finansal projeksiyon. Somut rakamlar. Yatırımcı sunum formatı.",note:"Bölümleri önceden belirt, yatırımcı odaklı yaz"},
    {title:"LinkedIn Profil Özeti",kotu:"LinkedIn bio yaz",iyi:"[Sektör]'de [yıl] yıllık [uzmanlık] deneyimine sahip biri için LinkedIn 'About' bölümü yaz. Başarıları rakamlarla göster, güçlü ilk cümle, CTA ile bitir. 300 kelime. İngilizce ve Türkçe versiyonu.",note:"İki dil iste, hangisi daha iyi skor yap"},
    {title:"İş Başvuru Mektubu",kotu:"Başvuru mektubu yaz",iyi:"[Şirkete] [pozisyon] için başvuru mektubu. Şirketin son [gelişme]'sinden bahset. Benim [spesifik deneyim]'im bu role nasıl katkı katar açıkla. Samimi ama profesyonel. 250 kelime.",note:"Şirketi araştır, spesifik gelişmeye atıf yap"},
  ]},
  {cat:"📱 İçerik & Sosyal Medya",color:"#f472b6",icon:"📱",items:[
    {title:"Viral LinkedIn Postu",kotu:"LinkedIn yazısı yaz",iyi:"İçerik stratejisti olarak [konu] hakkında viral LinkedIn postu yaz. İlk cümle şok edici veya merak uyandıran. Kişisel deneyim ekle. 3 somut çıkarım listele. Düşündürücü soru ile bitir. 200-250 kelime, emojisiz.",note:"Hook + hikaye + çıkarım + soru = viral formül"},
    {title:"İçerik Takvimi",kotu:"İçerik planı yap",iyi:"[Marka] için [hedef kitle]'ye yönelik 4 haftalık sosyal medya takvimi. Platformlar: Instagram + LinkedIn + Twitter. Kategoriler: Eğitici %40, Eğlenceli %30, Satış %20, Topluluk %10. Tablo formatında, her post için hook cümlesi.",note:"Yüzdeleri ver, dengeli ve yapılandırılmış içerik al"},
    {title:"YouTube Senaryo",kotu:"YouTube videosu yaz",iyi:"[Konu] için YouTube senaryosu. İlk 30sn dikkat çekici hook (neden izlemeli?). 3 ana bölüm, her biri 2-3 dakika. Her bölümde somut örnek. Sonunda CTA. Ton: [samimi/eğitici]. Toplam 8-10 dakika.",note:"Hook + 3 bölüm + CTA = izlenme süresi maksimum"},
    {title:"TikTok Script",kotu:"TikTok videosu yaz",iyi:"[Konu] için 60 saniyelik TikTok senaryosu. İlk 3 saniye: dikkat çekici hook. Trend ses/efekt öner. Hızlı kesimler için her 5 saniyede bir yeni bilgi. Sürprizle bitir. Alt yazı için de yaz.",note:"İlk 3 saniye = her şey. Hook olmazsa kimse izlemez"},
    {title:"Instagram Caption",kotu:"Caption yaz",iyi:"[Ürün/hizmet] için Instagram caption. Ton: [samimi/profesyonel/eğlenceli]. CTA ekle. 3 farklı uzunluk: Kısa (50 kelime), orta (100 kelime), uzun (hikaye formatı). Her birinde 5 niş hashtag.",note:"3 uzunluk ver, platforma ve içeriğe göre seç"},
    {title:"E-posta Kampanyası",kotu:"E-posta yaz",iyi:"[Ürün] için 5 e-postalık drip kampanyası yaz. 1)Hoşgeldin 2)Değer önerisi 3)Sosyal kanıt 4)İtiraz kırma 5)CTA. Her e-posta: konu satırı + 200 kelime gövde + PS notu. Kişiselleştirme alanları köşeli parantezle.",note:"Drip serisi = alışkanlık + güven + satış. Hepsini iste"},
    {title:"Podcast Bölüm Tanıtımı",kotu:"Podcast açıklaması yaz",iyi:"[Podcast adı]'nın [bölüm no] bölümü için tanıtım yaz. Konuk: [isim]. Konular: [liste]. Platform: Spotify açıklama (500 kelime) + Instagram duyuru (150 kelime) + Twitter thread (5 tweet). Bölüm içinden 3 alıntı.",note:"Her platform için ayrı format, tek içerikten 3 kullanım"},
  ]},
  {cat:"⚙️ Kod & Teknik",color:"#00dcff",icon:"⚙️",items:[
    {title:"Kapsamlı Kod Review",kotu:"Bu kodu düzelt",iyi:"Senior yazılım mühendisi olarak bu [dil] kodu incele:\n```\n[kod]\n```\n1)Hatalar ve sebepleri 2)Güvenlik açıkları (OWASP top 10'a göre) 3)Performans darboğazları 4)Test coverage eksiklikleri 5)Düzeltilmiş versiyon 6)Unit test örnekleri.",note:"Her madde ayrı bölüm — kapsamlı review al"},
    {title:"API Tasarımı",kotu:"API yaz",iyi:"RESTful API tasarımcısı olarak [uygulama] için tam API tasarla. Endpoint'ler, HTTP metodları, request/response şemaları, hata kodları, authentication (JWT), rate limiting, versiyonlama. OpenAPI 3.0 YAML formatında.",note:"OpenAPI formatı iste — direkt Swagger'a at"},
    {title:"Hata Debug",kotu:"Bu hata neden oluyor",iyi:"[Hata mesajı ve stack trace] aldım. Ortam: [OS, dil versiyonu, kütüphane versiyonları]. Kod: [ilgili kısım]. 1)Hatanın tam sebebi 2)Root cause analizi 3)3 farklı çözüm yolu (hız/güvenlik/basitlik odaklı) 4)Tekrarlanmaması için önlem.",note:"Stack trace + ortam + kod = ilk seferde çözüm"},
    {title:"SQL Optimizasyonu",kotu:"SQL yaz",iyi:"DBA uzmanı olarak bu yavaş SQL sorgusunu optimize et:\n```sql\n[sorgu]\n```\nTablo boyutları: [tablo boyutları]. 1)Neden yavaş açıkla 2)Index stratejisi öner 3)Yeniden yazılmış versiyon 4)EXPLAIN PLAN çıktısını yorumla 5)Monitoring için metrikler.",note:"Tablo boyutunu ver, gerçek optimizasyon al"},
    {title:"Sistem Mimarisi",kotu:"Mimari tasarla",iyi:"[Uygulama] için üretim mimarisi tasarla. Beklenen: [X] günlük aktif kullanıcı. Gereksinimler: [liste]. Tasarla: 1)Katman diyagramı (Mermaid formatında) 2)Teknoloji seçimleri + gerekçe 3)Veritabanı stratejisi 4)Ölçeklenme planı 5)Felaket kurtarma 6)Tahmini maliyet (AWS/GCP).",note:"Mermaid formatı iste — direkt diyagram çıkar"},
    {title:"Güvenlik Denetimi",kotu:"Bu kodu güvenlik açısından incele",iyi:"Güvenlik araştırmacısı olarak bu [dil/framework] uygulamasını OWASP Top 10'a göre denetle:\n```\n[kod]\n```\nHer zafiyet için: 1)Risk seviyesi (Kritik/Yüksek/Orta/Düşük) 2)Saldırı vektörü 3)Düzeltme kodu. CVE referansları ekle.",note:"Risk seviyesi iste, önceliklendirme yapabilirsin"},
    {title:"Regex Üret",kotu:"Regex yaz",iyi:"[Dil] için [ne eşleştirmek istiyorum] regex yaz. Geçerli örnekler: [örnekler]. Geçersiz örnekler: [örnekler]. Çıktı: 1)Regex pattern 2)Her parçanın açıklaması 3)Test örnekleri 4)Edge case'ler 5)Kod snippet ile kullanım.",note:"Geçerli + geçersiz örnek ver, doğru pattern ilk seferde"},
  ]},
  {cat:"🧠 Claude'a Özel",color:"#a855f7",icon:"🧠",items:[
    {title:"Kitap Boyutu Belge Analizi",kotu:"Bu belgeyi özetle",iyi:"Sana [sayfa sayısı] sayfalık [belge türü] vereceğim. Claude'un 1M token kapasitesiyle tüm belgeyi bir kerede işle:\n1)Ana temayı ve iddiaları çıkar\n2)En önemli 10 bulguyu listele\n3)İç tutarsızlıkları tespit et\n4)Pratikte uygulanabilir 5 öneri sun\n5)Yönetici özeti yaz (1 sayfa)\n\nBelge: [belgeyi buraya yapıştır]",note:"Claude'un 1M token'ı ChatGPT'nin 128K'sından 8x büyük"},
    {title:"Tam Codebase Analizi",kotu:"Bu projeyi incele",iyi:"Bu projenin tüm kodunu incele (1M token kapasiteni kullan):\n\n[Kodu yapıştır]\n\n1)Mimari pattern'ları açıkla\n2)Güvenlik açıklarını kritiklik sırasına göre listele\n3)Performans darboğazlarını tespit et\n4)Test coverage analizi\n5)Refactoring önerileri (öncelik sırasıyla)\n6)Teknik borç tahmini",note:"Claude SWE-bench #1 — kodlama analizinde gerçekten üstün"},
    {title:"Constitutional AI ile Güvenli Rol",kotu:"Bana yardım et",iyi:"[Uzman rolü] olarak görev yap. Kısıtlar:\n- Belirsizsen 'Emin değilim, doğrulamanı öneririm' de\n- Kaynak sınırlılıklarını açıkça belirt\n- Zararlı olabilecek içerikten kaçın\n- Kritik kararlar için profesyonel görüş al uyarısı ekle\n\nGörev: [görev açıklaması]",note:"Claude Constitutional AI ile diğerlerinden daha güvenli yanıt verir"},
    {title:"Uzun İçerik Dönüştürme",kotu:"Bunu farklı formata dönüştür",iyi:"[Uzun içerik]'i [hedef format]'a dönüştür.\n\nDönüşüm kuralları:\n- Ton: [teknik/samimi/akademik/pazarlama]\n- Uzunluk: orijinalin [%X]'i\n- Hedef kitle: [kitle]\n- Platform: [LinkedIn/blog/e-posta/rapor]\n- Kesinlikle koru: [önemli unsurlar]\n- Çıkar: [gereksiz kısımlar]",note:"Claude uzun format dönüştürmede GPT'den tutarlı"},
    {title:"Karmaşık Konu Derinlemesine",kotu:"[Konu] açıkla",iyi:"[Konu] hakkında kapsamlı analiz yap. Benden:\n1)[Temel kavramı] 3 farklı seviyede açıkla: 5 yaşında çocuk, lise öğrencisi, uzman\n2)Tarihsel gelişimi zaman çizgisiyle\n3)Günümüzdeki en iyi 5 kaynak\n4)Yanlış anlaşılan 3 nokta ve düzeltmesi\n5)Türkiye'ye özgü bağlam\n6)İleri okuma için 3 kaynak",note:"3 seviye açıklama = gerçek anlama testi"},
  ]},
  {cat:"📚 Öğrenme & Analiz",color:"#34d399",icon:"📚",items:[
    {title:"Feynman Tekniği",kotu:"[konu] anlat",iyi:"[Konu]'u Feynman tekniğiyle öğret: 1)8 yaşındaki çocuğa açıklar gibi başla 2)Temel kavramları ver 3)Gerçek hayat örnekleri (Türkiye'den) 4)Sık yapılan yanlış anlamalar 5)Her bölümde 'anlama sorusu' sor 6)İleri öğrenim için yol haritası.",note:"Feynman = gerçek anlama, ezbersiz öğrenme"},
    {title:"Quiz Üretici",kotu:"Test sorusu yaz",iyi:"[Konu] için Bloom taksonomisine göre 15 soru: 5 bilgi, 5 anlama, 3 uygulama, 2 analiz. Her soru için: A-D şıkları + doğru cevap + neden doğru açıklaması + hangi yanlış anlamayı test ettiği. Zorluk sırasına diz.",note:"Bloom taksonomisi = dengeli, kaliteli değerlendirme"},
    {title:"90 Günlük Öğrenme Planı",kotu:"[konu] nasıl öğrenirim",iyi:"Eğitim koçu olarak [konu]'u [mevcut seviye] biri için 90 günlük plan yap. Haftalık: hedef + kaynak (önce ücretsiz) + pratik görev + ölçüm kriteri. 30-60-90 gün kontrol noktaları. Günlük 1-2 saat varsay.",note:"Seviye + süre + günlük vakit = gerçekçi plan"},
    {title:"Akademik Makale Analizi",kotu:"Bu makaleyi özetle",iyi:"Akademik editör olarak bu [alan] makalesini analiz et: 1)Ana hipotez ve araştırma sorusu 2)Metodoloji — güçlü ve zayıf yönler 3)Örneklem yeterliliği 4)İstatistiksel analizin doğruluğu 5)Temel bulgular (sayısal) 6)Sınırlılıklar 7)Pratikte ne anlama geliyor 8)Güvenilirlik puanı 1-10 ve gerekçe.",note:"Metodoloji eleştirisi iste, kör güven yapma"},
    {title:"Ders Planı",kotu:"Ders hazırla",iyi:"[Konu] için [yaş/seviye] öğrencilere yönelik 60 dakikalık ders planı yap. Format: 1)Giriş aktivitesi (10dk) 2)Teori anlatımı (20dk) — slayt notlarıyla 3)Uygulama/grup çalışması (20dk) 4)Değerlendirme (10dk). Her bölüm için öğretmen notu + öğrenci materyali ayrı ayrı.",note:"Öğretmen notu + öğrenci materyali ayrı = hazır ders"},
    {title:"Kavram Haritası",kotu:"Bu konuyu açıkla",iyi:"[Konu] için kapsamlı kavram haritası oluştur. Merkezi kavram → alt kavramlar → aralarındaki ilişkiler. Mermaid diyagram formatında yaz. Ardından her kavramı 2-3 cümleyle açıkla. Yanlış anlaşılan bağlantıları vurgula.",note:"Mermaid formatı = görsel diyagram çıkar"},
  ]},
  {cat:"✍️ Yaratıcı Yazarlık",color:"#a855f7",icon:"✍️",items:[
    {title:"Güçlü Kısa Hikaye",kotu:"Hikaye yaz",iyi:"[Tür]'de, [ayar]'da geçen, [karakter] ile kısa hikaye yaz. Kesinlikle içersin: [3 spesifik unsur]. Anlatı dikkat çekici hook ile başlasın, iç çatışma olsun, belirsiz/açık uçlu bitsin. Ton: [ton]. Max 800 kelime. Show, don't tell ilkesine uy.",note:"Show don't tell + spesifik unsurlar = yaratıcı çıktı"},
    {title:"Marka Sesi Rehberi",kotu:"Marka için yaz",iyi:"[Marka] için kapsamlı ses rehberi oluştur. Marka kişiliği: [3 sıfat]. Hedef kitle: [profil]. Çıktı: 1)Ton ve dil kuralları (5 madde) 2)Kelime/ifade kullanılacaklar listesi 3)Kesinlikle kullanılmayacaklar 4)Her platform için ses örneği (LinkedIn, Instagram, e-posta, müşteri hizmetleri) 5)Kötü örnek → iyi örnek dönüşümleri.",note:"Kötü→iyi örnek iste, ekibin için kılavuz hazır"},
    {title:"Marka İsmi & Tagline",kotu:"İsim bul",iyi:"[Sektör]'deki [hedef kitle]'ye yönelik [değer önerisi] sunan marka için 10 isim öner. Her isim için: 1)Anlam ve çağrışım 2)Neden işe yarar 3)Olası sorunlar (telaffuz/anlam) 4)Domain müsaitliği tahmini. Sonra her isme 2 farklı ton'da tagline yaz.",note:"10 isim + 2 tagline = 20 seçenek, en iyisini seç"},
    {title:"Karakter Geliştirme",kotu:"Karakter yarat",iyi:"[Hikaye türü] için [isim] karakterini derinlemesine geliştir: 1)Fiziksel özellikler 2)MBTI kişilik tipi + 5 sıfatla açıklama 3)Temel motivasyonu ve en büyük korkusu 4)Gizli tuttuğu sır 5)Konuşma tarzı ve sıkça kullandığı ifadeler 6)3 özgün alışkanlık 7)Diğer karakterlerle ilişki dinamikleri 8)Karakter arki (başlangıç → dönüşüm).",note:"MBTI + karakter arki = tutarlı ve büyüyen karakter"},
    {title:"Senaryo Diyaloğu",kotu:"Diyalog yaz",iyi:"[Film/dizi/oyun] için [sahne: iki karakter, durum] diyaloğu yaz. Karakterler: [A - kişilik/motivasyon] ve [B - kişilik/motivasyon]. Gereksinimler: Alt metin kullan (söylenmeyen söylenenden önemli), güç dinamiğini göster, her karakterin sesi farklı olsun, 3 farklı versiyon (dramatik/komik/gerilimli).",note:"Alt metin iste, yüzeysel diyalog olmaz"},
    {title:"Pazarlama Metni (AIDA)",kotu:"Reklam metni yaz",iyi:"[Ürün/hizmet] için AIDA formülünde kopya yaz:\n- Dikkat (1 güçlü cümle)\n- İlgi (2-3 cümle, problem empati)\n- İstek (3-4 cümle, çözüm + faydalar, sosyal kanıt)\n- Eylem (güçlü CTA)\n\n3 versiyon: uzun (500k), orta (200k), kısa (50k). Google Ads başlıkları da ekle.",note:"3 uzunluk + AIDA = her platform hazır"},
  ]},
  {cat:"💡 Claude ile Üretkenlik",color:"#00dcff",icon:"💡",items:[
    {title:"Toplantı Verimliliği",kotu:"Toplantı notu tut",iyi:"Bu toplantı notlarını işle:\n[Notları yapıştır]\n\nÇıkar: 1)Alınan kararlar (listele) 2)Action items — her biri için: görev + sorumlu + tarih 3)Açık kalan sorular 4)Sonraki toplantı için gündem önerileri 5)Yöneticiye gönderilebilir özet (5 madde). Formatlı, kopyala-yapıştır hazır.",note:"Toplantı notu → action items → özet = 10 dakika iş"},
    {title:"Proje Planlama",kotu:"Proje planı yap",iyi:"[Proje hedefi] için kapsamlı proje planı yap. Verilen: [kaynak sayısı] kişi, [süre] hafta, [bütçe]. Çıkar: 1)Proje kapsamı ve kapsam dışı (scope/out of scope) 2)Milestones ve deliverables 3)Gantt benzeri timeline 4)Risk matrisi (olasılık × etki) 5)Kaynak atama önerisi 6)Başarı kriterleri (KPI'lar).",note:"Kapsam dışını da belirle — kapsam kaymasını önler"},
    {title:"Performans Geri Bildirimi",kotu:"Geri bildirim ver",iyi:"[Çalışan/öğrenci] için [performans dönemi] değerlendirmesi yaz. Güçlü yanlar: [liste]. Gelişim alanları: [liste]. Yapı: SBI formatı kullan (Durum-Davranış-Etki). Her geri bildirim spesifik, ölçülebilir. Motivasyonu koruyacak ton. Gelişim planı ekle.",note:"SBI formatı = spesifik, ölçülebilir, yapıcı"},
    {title:"Rakip Analizi",kotu:"Rakiplerimi analiz et",iyi:"[Şirket/ürün] için kapsamlı rakip analizi. Rakipler: [R1, R2, R3]. Her rakip için: 1)Güçlü yönler 2)Zayıf yönler 3)Fiyatlandırma stratejisi 4)Hedef kitle 5)Pazarlama kanalları. Sonunda: 1)Piyasa boşlukları 2)Farklılaşma fırsatları 3)Tehditler 4)Önerilen konumlandırma.",note:"Boşlukları iste — asıl altın orası"},
    {title:"Hukuki Belge Özeti",kotu:"Bu sözleşmeyi açıkla",iyi:"[Sözleşme türü]'nü sade dille özetle:\n[Belge]\n\n1)Taraflar ve temel yükümlülükler (tablo) 2)Riskli maddeler — risk seviyesi ile (Kırmızı/Sarı/Yeşil) 3)Standart dışı maddeler 4)Eksik olan koruyucu hükümler 5)Müzakere edilebilir maddeler 6)Yönetici özeti (5 madde)\n\nNot: Bu hukuki tavsiye değildir.",note:"Risk seviyesi renklendirmesi = hızlı önceliklendirme"},
    {title:"Strateji Danışmanlığı",kotu:"Stratejim ne olmalı",iyi:"Stratejik danışman olarak [konu/sektör]'de [şirket/kişi] için strateji öner. Bağlam: [mevcut durum]. Hedef: [hedef]. Kısıtlar: [kısıtlar]. 1)Durum analizi (SWOT) 2)3 farklı strateji seçeneği — her birinin artı/eksi 3)Önerilen strateji + gerekçe 4)İlk 90 gün eylem planı 5)Başarı ölçütleri.",note:"3 strateji seçeneği iste — tek fikre kör bağlı kalma"},
  ]},
  {cat:"🌐 SEO & Dijital Pazarlama",color:"#34d399",icon:"🌐",items:[
    {title:"SEO Blog Yazısı",kotu:"Blog yaz",iyi:"SEO uzmanı ve içerik yazarı olarak [anahtar kelime] için blog yazısı yaz. Hedef arama hacmi: [hacim]. Rakip sayfaların ele almadığı [açı] ile yaklaş. Yapı: H1+H2+H3 hiyerarşisi, her bölümde iç bağlantı fırsatı, meta description (155 karakter), özgün görseller için alt text önerileri. 1500 kelime.",note:"Rakibin ele almadığı açı = içerik boşluğu = sıralama fırsatı"},
    {title:"Google Ads Metni",kotu:"Google reklam yaz",iyi:"[Ürün/hizmet] için Google Responsive Search Ad metni yaz. 15 başlık (30 karakter max her biri) + 4 açıklama (90 karakter max). Başlıklarda: ana anahtar kelime, değer önerisi, CTA, fiyat/indirim, aciliyet. Her metni harf sayısıyla listele.",note:"15 başlık iste — Google en iyi kombinasyonu seçer"},
    {title:"E-posta Konu Satırı",kotu:"E-posta konusu yaz",iyi:"[E-posta içeriği/amacı] için 20 farklı konu satırı yaz. Kategorize et: 1)Merak uyandıran (5 adet) 2)Faydayı öne çıkaran (5 adet) 3)Kişiselleştirilmiş (5 adet) 4)Aciliyet/kıtlık (5 adet). Her birinin beklenen açılma oranı tahmini ve neden işe yarayacağı.",note:"20 seçenek = A/B test için hazır malzeme"},
    {title:"Hashtag Stratejisi",kotu:"Hashtag öner",iyi:"[İçerik türü] ve [niş] için 3 katmanlı hashtag stratejisi: 1)Büyük (1M+): 5 adet 2)Orta (100K-1M): 10 adet 3)Küçük/niş (10K-100K): 10 adet. Türkçe + İngilizce için ayrı listeler. Yüksek rekabetli hashtag'lerde görünürlük taktiği de ekle.",note:"3 katman = büyük kitleden niş kitleye fırsat"},
    {title:"Landing Page Metin",kotu:"Satış sayfası yaz",iyi:"[Ürün/hizmet] için landing page metni yaz. Yapı: 1)Hero (başlık + alt başlık + CTA) 2)Problem tanımı 3)Çözüm sunumu 4)3 temel fayda 5)Sosyal kanıt bölümü (testimonial şablonları) 6)Fiyatlandırma 7)SSS (5 soru) 8)Final CTA. Conversion odaklı, net ve öz.",note:"SSS bölümü = itirazları önceden kır"},
  ]},
  {cat:"⚡ Verimlilik & Karar",color:"#60a5fa",icon:"⚡",items:[
    {title:"Karmaşık Karar Analizi",kotu:"Ne yapayım",iyi:"Stratejik danışman olarak [durum] konusunda karar analizi yap. Seçenekler: [A] ve [B] (ve gerekirse [C]). 1)Her seçeneğin 5'er artı/eksi 2)Risk matrisi (olasılık × etki) 3)Değerlerime uygunluk (değerlerim: [liste]) 4)Eksik bilgiler 5)Nihai öneri + gerekçe 6)Kötü senaryoda plan B.",note:"Değerlerini ver + plan B iste = daha iyi karar"},
    {title:"Haftalık Plan",kotu:"Haftalık plan yap",iyi:"Verimlilik koçu olarak [hedeflerim] için haftalık plan yap. Kısıtlarım: [zaman dilimi, enerji]. Öncelikler: [liste]. Her gün: 2 derin çalışma bloğu (90dk), 1 idari blok (45dk), öğrenme (30dk). Pazartesi-Cuma tablo formatı. Hafta başı + gün sonu ritual de ekle.",note:"Kısıtlarını belirt — gerçekçi plan al"},
    {title:"E-posta Sıfırlama Sistemi",kotu:"E-postalarımı düzenle",iyi:"E-posta yönetim sistemi kur. Mevcut: [kaç okunmamış]. 1)4-kutu sıralama sistemi tasarla (Acil+Önemli/Önemli/Acil/Ne Önemli Ne Acil) 2)Her kategori için karar kriteri ve SLA 3)Filtre ve etiket önerileri (Gmail/Outlook için) 4)5 tekrarlayan e-posta türü için hazır şablon yanıtlar 5)Günlük 30dk e-posta rutini.",note:"Sistem + şablon + rutin = bir daha birikmez"},
    {title:"Pareto ile Hızlı Öğrenme",kotu:"Bunu öğrenmek istiyorum",iyi:"Pareto prensibini uygula: [konu]'nun %20'si %80 değer verir. 1)Bu kritik %20 ne? Listele 2)O kısım için 5 temel kavram 3)Her kavram için en iyi 1 kaynak (ücretsiz önce) 4)Pratik egzersizler 5)İlerlemeyi nasıl ölçerim 6)Sık yapılan hata ve tuzaklar 7)30-60-90 günlük hedefler.",note:"Tuzakları iste — başkalarının hatalarından öğren"},
    {title:"Sabah Rutini Tasarımı",kotu:"Sabah rutini yap",iyi:"Verimlilik koçu olarak benim için ideal sabah rutini tasarla. Benim hakkımda: [uyku saatleri, meslek, hedefler, kısıtlar]. 1)Uyandıktan ilk 30 dakika için adımlar 2)Odaklanma ve enerji için öneriler 3)Hangi araçları kullanmalıyım 4)Rutinin test süresi ve adaptasyon stratejisi 5)Rutini bozan durumlar için plan B.",note:"Kısıtlarını ver — teorik değil, uygulanabilir rutin al"},
    {title:"Toplantı Verimliliği",kotu:"Toplantı özetle",iyi:"[Toplantı transkripti veya notları]'nı işle. 1)Alınan kararlar (madde madde) 2)Atanan görevler (kişi + son tarih formatında) 3)Açık kalan sorular 4)Katılmayan ekip üyeleri için 5 dakikalık özet e-postası 5)Bir sonraki toplantı için gündem önerisi.",note:"Toplantı notu → aksiyon planı dönüşümü en kritik verimlilik kazanımı"},
  ]},
  {cat:"🔬 Araştırma & Akademik",color:"#34d399",icon:"📚",items:[
    {title:"Feynman Tekniği ile Öğren",kotu:"[konu] anlat",iyi:"[Konu]'u Feynman tekniğiyle öğret. Adımlar: 1)8 yaşında çocuğa açıklar gibi başla 2)Teknik terimleri sade dille yeniden yaz 3)Analogilerle somutlaştır 4)Sık yapılan yanlış anlamalar 5)Bu kavramı gerçek hayatta nerede görürüm 6)Bir sonraki adım ne öğrenmeli. Her bölüm ayrı başlık.",note:"Analoji + gerçek hayat örneği = gerçek anlama"},
    {title:"Araştırma Sentezi",kotu:"Bu araştırmayı özetle",iyi:"Bu [araştırma makalesi/rapor]'u analiz et:\n[Metni yapıştır]\n1)Ana hipotez ve iddia 2)Metodoloji (güçlü/zayıf yönler) 3)Temel bulgular (rakamlarla) 4)Sınırlılıklar 5)Gerçek hayat uygulaması 6)Güvenilirlik skoru (1-10, gerekçesiyle) 7)İlgili diğer araştırma önerileri.",note:"Güvenilirlik skoru iste — körce güvenme, eleştirel oku"},
    {title:"Kapsamlı Quiz Üret",kotu:"Test sorusu yaz",iyi:"[Konu] için Bloom taksonomisine göre 20 soruluk test hazırla. Dağılım: 5 hatırlama, 5 anlama, 4 uygulama, 3 analiz, 2 sentez, 1 değerlendirme. Her soru: 4 şık + doğru cevap + neden doğru açıklama + neden yanlış açıklama. Zorluk artan sırayla.",note:"Bloom taksonomisi = derinlemesine öğrenme testi"},
    {title:"90 Günlük Öğrenme Planı",kotu:"[konu] nasıl öğrenirim",iyi:"[Konu] için [mevcut seviye] birisi için 90 günlük öğrenme programı hazırla. Her hafta: 1)Bu hafta ne öğreneceğim 2)En iyi kaynak (ücretsiz önce) 3)Pratik görev 4)İlerleme ölçüm kriteri. Ayda bir kontrol noktası. Öğrenmeyi engelleyecek 3 tuzak ve çözümleri.",note:"Tuzak ve çözümler = programın yarıda kalmaması"},
    {title:"Konferans/Seminer Notu",kotu:"Bu konferansı özetle",iyi:"[Konferans/sunum transkripti veya notu]'nden şunları çıkar: 1)Ana mesajlar (en fazla 5) 2)Pratik uygulanabilir öneriler (madde madde) 3)Dikkat çeken veriler ve istatistikler 4)Konuşmacının kullandığı en güçlü analoji 5)Bu bilgiyi [benim alanım]'a nasıl uygularım 6)Daha derin araştırma için 3 kaynak.",note:"Alan uygulaması iste — bilgi transferi gerçekleşsin"},
    {title:"Kavram Haritası",kotu:"Bu konuyu haritala",iyi:"[Konu] için kapsamlı kavram haritası oluştur. Format: ana kavram merkeze, 5-7 alt dal, her dalda 3-4 bağlantılı kavram. Her kavram için: kısa tanım + diğer kavramlarla ilişki. Sonunda Mermaid mindmap kodu olarak da ver.",note:"Mermaid kodu iste — direkt görsel haritaya dönüştür"},
  ]},
  {cat:"🖋️ Hikaye & Sunum",color:"#a855f7",icon:"🖋️",items:[
    {title:"Güçlü Hikaye Yapısı",kotu:"Hikaye yaz",iyi:"[Tür] türünde, [mekan]'da geçen, [karakter] karakteriyle hikaye yaz. Yapı: Aristo'nun dramatik yayı kullan (kurulum→komplikasyon→krize yükseliş→doruk→çözüm). Mutlaka içersin: [3 zorunlu unsur]. İç çatışma dış çatışmadan daha güçlü olsun. Açık uçlu bitir. [Ton]. 1000 kelime.",note:"Aristo yapısı + iç çatışma = okuyucuyu bağlayan hikaye"},
    {title:"Karakter Derinleştirme",kotu:"Karakter yarat",iyi:"[Hikayem] için [isim] karakterini derinleştir. 1)Fiziksel özellikler (görünür ve görünmez) 2)Kişilik (MBTI + 5 sıfat + 1 paradoks) 3)Backstory: Onu bugün şekillendiren 3 kritik olay 4)En büyük korkusu ve gizli arzusu 5)Konuşma tarzı ve kullandığı kelimeler 6)Diğer karakterlerle ilişki dinamikleri 7)Biyografi 100 kelime.",note:"Paradoks ver — düz karakterler sıkıcı, çelişkili karakterler ilgi çekici"},
    {title:"Marka Hikayesi",kotu:"Marka hikayesi yaz",iyi:"[Marka] için güçlü bir 'origin story' yaz. İçermeli: 1)Kurucunun yaşadığı gerçek problem 2)Neden mevcut çözümler yetmedi 3)Aydınlanma anı (ne zaman ve nasıl fikir geldi) 4)İlk başarısızlık ve ders 5)İlk müşteri hikayesi 6)Bugün neredeler ve hedef. 500 kelime, duygu ağırlıklı, samimi ton.",note:"Gerçek problem + başarısızlık = güvenilir marka hikayesi"},
    {title:"İsim & Tagline Fabrikası",kotu:"İsim bul",iyi:"[Sektör]'deki [hedef kitle]'ye yönelik [değer önerisi] sunan marka için 15 isim üret. 3 kategori: 1)Açıklayıcı (ne yaptığını söyler) 2)Soyut (his yaratır) 3)Birleşik/neolojizm (yeni kelime). Her isim: anlam, neden işe yarar, potansiyel sorun, .com müsaitliği (tahmin). Sonra en iyi 5'ine 3'er tagline.",note:"15 isim + 3 kategori = gerçek seçenek çeşitliliği"},
    {title:"Konuşma ve Sunum",kotu:"Konuşma yaz",iyi:"[Konu] üzerine [hedef kitle]'ye [süre] dakikalık konuşma yaz. Yapı: 1)Dikkat çeken açılış (soru/şok/istatistik/hikaye) 2)Neden bu önemli (bağlam) 3)3 ana nokta (her biri örnek+veri) 4)Karşı argümanları çürüt 5)Güçlü kapanış + harekete geçirici mesaj. Notlar bölümünde: ne zaman duraklayacaksın, hangi kısım daha yavaş, soru-cevap için 5 olası soru.",note:"Notlar bölümü iste — sahne pratiği için şart"},
  ]},
  {cat:"💰 Pazarlama & Satış",color:"#fb923c",icon:"💰",items:[
    {title:"Rakip Analizi",kotu:"Rakip analizi yap",iyi:"[Sektör]'deki [rakip listesi] için kapsamlı rakip analizi. Her rakip için: 1)Güçlü yönler (5 madde) 2)Zayıf yönler (5 madde) 3)Hedef kitle 4)Fiyatlandırma stratejisi 5)Pazarlama mesajı ve tonu 6)Müşteri şikayetleri (G2/Trustpilot/Google Reviews'dan çıkar). Sonunda: rakiplerin boş bıraktığı fırsatlar.",note:"Müşteri şikayetleri = senin fırsatların"},
    {title:"AIDA Reklam Metni",kotu:"Reklam yaz",iyi:"[Ürün/hizmet] için AIDA modelinde reklam metni. Dikkat: tek güçlü başlık. İlgi: problem + acı noktası (2 cümle). Arzu: çözüm + fayda + sosyal kanıt (3 cümle). Eylem: spesifik CTA + aciliyet. Platform uyarlaması: Google Ads (30 karakter başlık + 90 karakter açıklama) + Facebook Ad + LinkedIn Ad versiyonları.",note:"3 platform versiyonu = zaman tasarrufu"},
    {title:"Müşteri Persona",kotu:"Hedef kitle tanımla",iyi:"[Ürün/hizmet] için 3 farklı müşteri persona oluştur. Her persona: 1)Ad, yaş, meslek, gelir 2)Bir günlüğü (sabahtan akşama) 3)En büyük 3 sorunu ve yaşattığı his 4)Bizim ürünümüzden beklentisi 5)Satın alma kararında 3 itiraz 6)Onlara ulaşmak için en iyi 3 kanal 7)Bu personaya özel mesaj.",note:"3 persona = 3 farklı pazarlama mesajı"},
    {title:"Fiyatlandırma Stratejisi",kotu:"Fiyat belirle",iyi:"[Ürün/hizmet] için fiyatlandırma stratejisi geliştir. Bağlam: [rakip fiyatlar, hedef müşteri, maliyet yapısı]. 1)3 fiyatlandırma modeli öner (hangisi neden uygun) 2)Psikolojik fiyatlandırma taktikleri 3)Paket/tier seçenekleri (3 paket kuralı) 4)Fiyat artışı için ne zaman ve nasıl 5)Fiyatı meşrulaştıran değer önerisi metni.",note:"3 paket kuralı: ucuz/orta/pahalı — çoğu orta seçer"},
    {title:"Satış E-postası Dizisi",kotu:"Satış e-postası yaz",iyi:"[Ürün] için soğuk e-posta dizisi (5 e-posta). E-posta 1: Problem odaklı açılış (merak uyandır, çözüm verme). E-posta 2: Sosyal kanıt (benzer müşteri hikayesi). E-posta 3: Değer önerisi detay (nasıl çalışır). E-posta 4: İtiraz kırıcı (en sık 3 itiraz + yanıt). E-posta 5: Son şans + basit CTA. Her e-posta: konu satırı + 150 kelime max.",note:"5 e-posta = ısınma süreci. Tek e-postayla satış bekleme"},
    {title:"Lansman Stratejisi",kotu:"Ürün lansmanı planla",iyi:"[Ürün] için 30 günlük lansman stratejisi. Hafta 1: Pre-lansman (beklenti yaratma). Hafta 2: Soft launch (erken erişim). Hafta 3: Tam lansman (tüm kanallar). Hafta 4: Momentum (referans + vaka çalışması). Her hafta için: ana mesaj, kanallar, içerik türleri, başarı metrikleri.",note:"4 haftalık yol haritası = odaklı ve ölçülebilir lansman"},
  ]},
  {cat:"🧬 Sağlık & Yaşam",color:"#34d399",icon:"🧬",items:[
    {title:"Kişisel Beslenme Planı",kotu:"Diyet planı yap",iyi:"Diyetisyen olarak benim için haftalık beslenme planı hazırla. Bilgilerim: [yaş, cinsiyet, boy, kilo, aktivite seviyesi, hedef, alerjiler, hoşlanmadıklarım]. 1)Günlük kalori + makro hedefleri 2)7 günlük öğün planı (tablo) 3)Her öğün için hızlı hazırlama ipuçları 4)Alışveriş listesi 5)Dışarıda yemek için öneriler. NOT: Bu tıbbi tavsiye değildir.",note:"Tüm kısıtlarını ver — kopyala-yapıştır değil, senin için plan"},
    {title:"Egzersiz Programı",kotu:"Spor programı yap",iyi:"Kişisel antrenör olarak [hedef: kas/zayıflama/dayanıklılık] için [haftalık gün sayısı] günlük egzersiz programı. Ekipman: [mevcut ekipman]. Seviye: [başlangıç/orta/ileri]. Her gün: ısınma + ana antrenman + soğuma + süre tahmini. İlerleme takvimi (6 hafta). Hata yapılmaması gereken teknik noktalar.",note:"Teknik hatalar bölümü iste — sakatlık önlemek için şart"},
    {title:"Stres Yönetimi Planı",kotu:"Stres azalt",iyi:"Stres yönetimi koçu olarak benim için kişiselleştirilmiş plan yap. Durumum: [stres kaynakları, semptomlar, mevcut başa çıkma yöntemleri]. 1)Ani stres için 5 dakikalık teknikler 2)Günlük önleyici pratikler 3)Stres tetikleyicileri azaltma stratejileri 4)Uyku kalitesini artırma 5)Haftalık recovery ritüeller. Kanıta dayalı teknikler kullan.",note:"Tetikleyiciler bölümü iste — belirtiyi değil nedeni tedavi et"},
    {title:"Uyku Optimizasyonu",kotu:"Nasıl daha iyi uyurum",iyi:"Uyku uzmanı olarak benim uyku sorunlarımı çöz. Sorunum: [uyku güçlüğü/çok uyuma/kalitesiz uyku]. Mevcut alışkanlıklar: [uyku saati, ekran süresi, kafein, egzersiz]. 1)Kişisel sirkadiyen ritim optimizasyonu 2)Yatak odası ortamı düzenlemeleri 3)Uyku öncesi 60 dakika rutini 4)Uyanma protokolü 5)1 haftalık adaptasyon planı. Bilimsel referanslar ekle.",note:"Bilimsel referans iste — kanıta dayalı tavsiye al"},
  ]},
];

const MYTHS_DATA = [
  {myth:"AI işleri elimizden alacak",reality:"AI bazı görevleri değiştiriyor ama yeni işler yaratıyor. 'AI kullanan biri, kullanmayan birinin işini alacak.' Her teknoloji devrimi böyle işledi. Matbaa, kamera, bilgisayar da aynı korkuyu yaşattı.",verdict:"Kısmen",color:"#fb923c"},
  {myth:"AI her şeyi biliyor",reality:"AI'lar eğitim verilerine bağlı. Güncel bilgi bilmeyebilir, hallüsinasyon yapabilir. Kritik bilgileri mutlaka başka kaynakla doğrula. Tıp, hukuk, finans konularında özellikle dikkatli ol.",verdict:"Yanlış",color:"#34d399"},
  {myth:"AI insan gibi düşünüyor",reality:"AI istatistiksel örüntü tanıma yapıyor. Anlama, bilinç, duygu yok. 'Sanki düşünüyor gibi' çıktı üretiyor — bu matematiğin gücü, gerçek düşünme değil.",verdict:"Yanlış",color:"#34d399"},
  {myth:"AI tamamen güvenilir",reality:"Hallüsinasyon, bias ve hatalar hâlâ var. Tıp, hukuk, finans gibi kritik alanlarda mutlaka uzman doğrulaması şart. AI'ı asistan gibi kullan, karar verici değil.",verdict:"Yanlış",color:"#34d399"},
  {myth:"AI özel bilgilerimi saklar",reality:"API üzerinden kullanılan AI'lar (doğru ayarlarla) konuşmayı eğitime katmaz. Yine de hassas veri, şifre veya kişisel bilgi paylaşma. Gizlilik politikasını oku.",verdict:"Kısmen",color:"#60a5fa"},
  {myth:"En pahalı AI en iyisidir",reality:"Görev bağımlı. Kod için Claude, araştırma için Gemini, genel kullanım için ChatGPT. Basit görevler için ücretsiz GPT-4o mini çoğu zaman yeterli. Doğru araç > Pahalı araç.",verdict:"Yanlış",color:"#34d399"},
  {myth:"Türkiye'de AI için çok geç",reality:"Türkiye AI trafiğinde dünya #1. Türkçe içerik, yerel uygulamalar ve eğitimde devasa boşluk var. 2026'da başlayanlar hâlâ erken adaptör sayılır.",verdict:"Yanlış",color:"#34d399"},
  {myth:"AI yakında her şeyi yapacak",reality:"Agentic AI güçleniyor ama bağlam, etik ve güven sorunları gerçek. 2026'da AI çok güçlü ama insan denetimi ve yaratıcılığı hâlâ şart.",verdict:"Kısmen",color:"#fb923c"},
  {myth:"AI öğrenmek çok zor",reality:"ChatGPT'yi ücretsiz açıp kullanmaya başlamak 5 dakika alıyor. Temel prompt tekniklerini öğrenmek 1 hafta. Profesyonel seviyeye ulaşmak 1-3 ay. Herkes öğrenebilir.",verdict:"Yanlış",color:"#34d399"},
  {myth:"AI içerik özgün değil",reality:"AI araç, özgünlük kullanıcıdan gelir. Doğru prompt, kişisel deneyim ve eleştirel değerlendirmeyle AI çıktılarını benzersiz içeriğe dönüştürebilirsin.",verdict:"Kısmen",color:"#fb923c"},
];

const KARIYER_DATA = [
  {icon:"💡",title:"Prompt Mühendisi",salary:"₺20K-60K/ay",level:"Başlangıç",time:"1-2 ay",desc:"Şirketlere özel prompt sistemleri kur, optimize et. Türkiye'de bu unvanla çalışan sayısı henüz çok az.",skills:["Prompt teknikleri","Model farkları","Test metodolojisi"],url:"https://promptingguide.ai"},
  {icon:"🤖",title:"AI Danışmanı",salary:"₺30K-80K/ay",level:"Orta",time:"3-6 ay",desc:"KOBİ ve kurumsal şirketlere AI entegrasyonu danışmanlığı. Türkiye'de talep patlamış, arz çok az.",skills:["İş analizi","AI araçları","Proje yönetimi"],url:"https://coursera.org"},
  {icon:"💻",title:"ML Mühendisi",salary:"₺40K-120K/ay",level:"İleri",time:"1-2 yıl",desc:"Makine öğrenmesi modelleri geliştir, üretim ortamına al. Python ve matematik temeli şart.",skills:["Python","PyTorch","MLOps","Matematik"],url:"https://fast.ai"},
  {icon:"📊",title:"AI Ürün Yöneticisi",salary:"₺35K-100K/ay",level:"Orta",time:"6-12 ay",desc:"AI ürünlerini planla, geliştir, piyasaya sun. Teknik ve iş dünyası arasında köprü.",skills:["Ürün yönetimi","AI temelleri","Veri analizi"],url:"https://producthunt.com"},
  {icon:"✍️",title:"AI İçerik Stratejisti",salary:"₺15K-40K/ay",level:"Başlangıç",time:"2-4 hafta",desc:"AI araçlarıyla içerik üret, marka sesi oluştur, içerik stratejisi kur. En hızlı başlangıç noktası.",skills:["ChatGPT","Claude","İçerik pazarlama"],url:"https://hubspot.com"},
  {icon:"🎨",title:"AI Tasarımcı",salary:"₺10K-35K/ay",level:"Başlangıç",time:"2-4 hafta",desc:"Midjourney, DALL-E, Firefly ile görsel üret. UI/UX tasarımında AI'ı entegre et.",skills:["Midjourney","Canva AI","Prompt yazımı"],url:"https://midjourney.com"},
  {icon:"🔧",title:"AI Otomasyon Uzmanı",salary:"₺25K-70K/ay",level:"Orta",time:"2-4 ay",desc:"n8n, Make ve Zapier ile AI destekli iş akışları oluştur. Şirketlerin tekrarlayan işlerini otomatize et.",skills:["n8n","Make","Zapier","API"],url:"https://n8n.io"},
  {icon:"🎤",title:"AI Eğitimci",salary:"₺20K-80K/ay",level:"Orta",time:"1-3 ay",desc:"Kurumsal eğitimler, online kurslar ve workshop'larla AI bilgini paylaş. Türkiye'de bu alan çok boş.",skills:["Sunum","Pedagoji","AI araçları"],url:"https://udemy.com"},
];

// ══════════════════════════════════════════════════════════
// YENİ SAYFALAR
// ══════════════════════════════════════════════════════════

function SozlukPage(){
  const[s,setS]=useState("");const[cat,setCat]=useState("Tümü");
  const cats=["Tümü",...[...new Set(GLOSSARY_DATA.map(g=>g.cat))]];
  const catColors={"Temel":"#00dcff","Teknik":"#a855f7","Modeller":"#34d399","Prompt":"#fb923c","Güvenlik":"#f472b6","İş":"#60a5fa","Medya":"#fbbf24","TR Özel":"#ff6b6b"};
  const filtered=GLOSSARY_DATA.filter(g=>(cat==="Tümü"||g.cat===cat)&&(!s||g.term.toLowerCase().includes(s.toLowerCase())||g.def.toLowerCase().includes(s.toLowerCase())));
  return <div style={{padding:"28px 20px",maxWidth:900,margin:"0 auto"}}>
    <div style={{marginBottom:20}}><div style={{fontSize:9,letterSpacing:".2em",color:"#475569",marginBottom:5}}>SÖZLÜK</div><div style={{fontSize:22,fontWeight:800,color:"#e2e8f0"}}>📖 AI Terimleri Sözlüğü</div><div style={{fontSize:12,color:"#64748b",marginTop:3}}>{GLOSSARY_DATA.length} terim · 8 kategori · Türkçe açıklamalar</div></div>
    <input style={{width:"100%",background:"rgba(0,0,0,0.5)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:9,color:"#e2e8f0",padding:"10px 14px",fontSize:13,fontFamily:"inherit",outline:"none",marginBottom:12,boxSizing:"border-box"}} placeholder="🔍 Terim ara... (LLM, token, hallüsinasyon, RAG...)" value={s} onChange={e=>setS(e.target.value)}/>
    <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:18}}>
      {cats.map(c=><button key={c} onClick={()=>setCat(c)} style={{padding:"5px 11px",borderRadius:7,border:"none",cursor:"pointer",fontSize:11,fontFamily:"inherit",background:cat===c?`${catColors[c]||"#00dcff"}20`:"rgba(255,255,255,0.04)",color:cat===c?(catColors[c]||"#00dcff"):"#475569"}}>{c}</button>)}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(255px,1fr))",gap:10}}>
      {filtered.map(g=>{const c=catColors[g.cat]||"#00dcff";return(
        <div key={g.term} style={{background:"rgba(255,255,255,0.02)",border:`1px solid ${c}18`,borderRadius:12,padding:"14px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:5}}>
            <div style={{fontSize:13,fontWeight:700,color:"#e2e8f0"}}>{g.term}</div>
            <Tag text={g.cat} color={c} size={8}/>
          </div>
          <div style={{fontSize:9,color:"#334155",marginBottom:6,fontStyle:"italic"}}>EN: {g.en}</div>
          <div style={{fontSize:11,color:"#64748b",lineHeight:1.65}}>{g.def}</div>
        </div>
      );})}
    </div>
    {!filtered.length&&<div style={{textAlign:"center",padding:"40px",color:"#475569"}}>"{s}" için sonuç bulunamadı.</div>}
  </div>;
}

function OgrenmePage(){
  const[tab,setTab]=useState("nedir");
  const tabs=[["nedir","🤔 AI Nedir?"],["turleri","🗂️ Türleri"],["tarihce","📅 Tarihçe"],["turkiye","🇹🇷 TR'de AI"],["gelecek","🚀 Gelecek"],["modeller","🤖 3 Büyük Model"],["prompt101","💡 Prompt 101"]];
  return <div style={{padding:"28px 20px",maxWidth:900,margin:"0 auto"}}>
    <div style={{marginBottom:20}}><div style={{fontSize:9,letterSpacing:".2em",color:"#475569",marginBottom:5}}>EĞİTİM</div><div style={{fontSize:22,fontWeight:800,color:"#e2e8f0"}}>🎓 AI Öğrenme Merkezi</div><div style={{fontSize:12,color:"#64748b",marginTop:3}}>Sıfırdan uzmanlığa — Türkçe, kapsamlı, ücretsiz</div></div>
    <div style={{display:"flex",gap:3,flexWrap:"wrap",marginBottom:20,borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
      {tabs.map(([id,l])=><button key={id} onClick={()=>setTab(id)} style={{padding:"8px 13px",border:"none",cursor:"pointer",fontSize:11,fontFamily:"inherit",borderRadius:"6px 6px 0 0",whiteSpace:"nowrap",background:tab===id?"rgba(0,220,255,0.1)":"transparent",color:tab===id?"#00dcff":"#475569",borderBottom:tab===id?"2px solid #00dcff":"2px solid transparent"}}>{l}</button>)}
    </div>
    {tab==="nedir"&&<div>
      <div style={{background:"rgba(0,220,255,0.04)",border:"1px solid rgba(0,220,255,0.15)",borderRadius:14,padding:"22px",marginBottom:16}}>
        <div style={{fontSize:16,fontWeight:800,color:"#e2e8f0",marginBottom:12}}>🤔 Yapay Zeka Nedir?</div>
        <div style={{fontSize:13,color:"#94a3b8",lineHeight:1.9}}>Yapay Zeka (AI), insan zekasını taklit edecek şekilde tasarlanmış bilgisayar sistemleridir. Öğrenme, problem çözme, dil anlama ve üretme gibi yeteneklere sahiptir.<br/><br/>Günlük hayatınızda Netflix öneri sistemi, Google arama, akıllı telefon asistanları, spam filtreleri — hepsi AI kullanır.<br/><br/>Modern AI'lar "Büyük Dil Modelleri" (LLM) üzerine kuruludur. Trilyonlarca kelime verisiyle eğitilen bu modeller, olasılıksal tahminlerle son derece inandırıcı metinler üretebilir.<br/><br/><strong style={{color:"#f472b6"}}>Önemli:</strong> AI gerçekten "düşünmüyor". İstatistiksel örüntü tanıma yapıyor. Bu yüzden hallüsinasyon yapabilir.</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))",gap:10}}>
        {[["🧮","1950","Alan Turing 'düşünebilir mi?' sordu"],["💬","2022","ChatGPT 5 günde 1M kullanıcı"],["🌍","2026","1 milyar AI kullanıcısı"],["🇹🇷","2026","Türkiye trafikte dünya #1"]].map(([e,y,d])=>(
          <div key={y} style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:11,padding:"13px"}}>
            <div style={{fontSize:20,marginBottom:5}}>{e}</div>
            <div style={{fontSize:12,fontWeight:700,color:"#00dcff",marginBottom:3}}>{y}</div>
            <div style={{fontSize:11,color:"#64748b",lineHeight:1.5}}>{d}</div>
          </div>
        ))}
      </div>
    </div>}
    {tab==="turleri"&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",gap:12}}>
      {[{n:"Dar AI (ANI)",c:"#00dcff",d:"Sadece belirli bir görevde uzman. Mevcut tüm AI'lar bu kategoride.",orn:"ChatGPT, Siri, Netflix öneri — hepsi dar AI"},{n:"Genel AI (AGI)",c:"#a855f7",d:"İnsanlar gibi her alanda düşünebilen AI. Henüz mevcut değil.",orn:"OpenAI'nin nihai hedefi. Ne zaman geleceği tartışmalı"},{n:"Generatif AI",c:"#34d399",d:"Yeni içerik üretebilen AI. Metin, görsel, ses, video.",orn:"ChatGPT, Midjourney, ElevenLabs bu kategoride"},{n:"Discriminative AI",c:"#fb923c",d:"Sınıflandırma yapan AI. Spam filtresi, yüz tanıma.",orn:"'Bu spam mı?' sorusuna cevap verir"},{n:"Agentic AI",c:"#f472b6",d:"Otonom çalışan AI ajanları. Uzun görevleri tek başına tamamlar.",orn:"Cursor 3 Background Agents, Claude Code bu kategoride"}].map(t=>(
        <div key={t.n} style={{background:`${t.c}06`,border:`1px solid ${t.c}20`,borderRadius:13,padding:"16px"}}>
          <Tag text={t.n} color={t.c}/>
          <div style={{fontSize:12,color:"#94a3b8",lineHeight:1.7,margin:"10px 0 8px"}}>{t.d}</div>
          <div style={{background:"rgba(0,0,0,0.3)",borderRadius:8,padding:"8px 10px",fontSize:11,color:"#64748b",fontStyle:"italic"}}>💡 {t.orn}</div>
        </div>
      ))}
    </div>}
    {tab==="tarihce"&&<div>
      <div style={{display:"flex",flexDirection:"column",gap:0}}>
        {TIMELINE_DATA.map((item,i)=>(
          <div key={item.year} style={{display:"flex",gap:14,alignItems:"flex-start",paddingBottom:14,borderLeft:`2px solid ${item.color}44`,paddingLeft:20,marginLeft:18,position:"relative"}}>
            <div style={{position:"absolute",left:-11,top:0,width:20,height:20,borderRadius:"50%",background:item.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10}}>{item.icon}</div>
            <div style={{flex:1}}>
              <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:4}}>
                <div style={{fontSize:13,fontWeight:800,color:item.color}}>{item.year}</div>
                <div style={{fontSize:13,fontWeight:700,color:"#e2e8f0"}}>{item.title}</div>
              </div>
              <div style={{fontSize:11,color:"#64748b",lineHeight:1.6}}>{item.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>}
    {tab==="turkiye"&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12}}>
      {[{icon:"🏆",title:"AI Trafik #1",val:"%94.49",desc:"Türkiye'de AI trafiğinin %94.49'u ChatGPT. Küresel ort. %80.92.",color:"#fb923c"},{icon:"📈",title:"Yıllık Büyüme",val:"%30",desc:"Türkiye AI pazarı yıllık %30 büyüme oranıyla dikkat çekiyor.",color:"#00dcff"},{icon:"🤖",title:"ChatGPT Payı",val:"%90.24",desc:"Türkiye'de AI kullananların %90.24'ü ChatGPT tercih ediyor.",color:"#a855f7"},{icon:"🏢",title:"AI Girişim",val:"200+",desc:"Türkiye'de 200'den fazla AI odaklı girişim var. İstanbul merkez.",color:"#34d399"},{icon:"🎓",title:"Kurs Talebi",val:"10x",desc:"2023'e kıyasla AI kurs talebi 10 kat arttı. Boşluk hâlâ büyük.",color:"#f472b6"},{icon:"💰",title:"Pazar Büyüklüğü",val:"$900M",desc:"Global $900 milyar AI pazarında Türkiye hızlı büyüyen segment.",color:"#60a5fa"}].map(s=>(
        <div key={s.title} style={{background:`${s.color}06`,border:`1px solid ${s.color}18`,borderRadius:13,padding:"16px"}}>
          <div style={{fontSize:26,marginBottom:6}}>{s.icon}</div>
          <div style={{fontSize:20,fontWeight:900,color:s.color,marginBottom:3}}>{s.val}</div>
          <div style={{fontSize:13,fontWeight:700,color:"#e2e8f0",marginBottom:5}}>{s.title}</div>
          <div style={{fontSize:11,color:"#64748b",lineHeight:1.6}}>{s.desc}</div>
        </div>
      ))}
    </div>}
    {tab==="gelecek"&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",gap:12}}>
      {[{icon:"🤖",title:"Agentic AI Patlaması",year:"2026-2027",desc:"Otonom AI ajanları her sektörde göreve başlayacak. İnsan gözetimi azalacak ama kalkmayacak.",color:"#00dcff"},{icon:"🧠",title:"AGI Tartışması",year:"2027-2030",desc:"Bazı araştırmacılar 2027'de AGI'ı öngörüyor. Çoğunluk 2030+ diyor. Yanıt belirsiz.",color:"#a855f7"},{icon:"💼",title:"AI Meslek Dönüşümü",year:"2026-2030",desc:"Rutin görevler otomatikleşecek. Yeni meslekler doğacak. AI bilen/yönetenler öne çıkacak.",color:"#34d399"},{icon:"🌍",title:"Türkiye Fırsatı",year:"Şimdi",desc:"Türkçe içerik, yerel uygulama ve eğitimde büyük boşluk var. İlk harekette devasa avantaj.",color:"#fb923c"}].map(f=>(
        <div key={f.title} style={{background:`${f.color}06`,border:`1px solid ${f.color}18`,borderRadius:13,padding:"18px"}}>
          <div style={{fontSize:26,marginBottom:8}}>{f.icon}</div>
          <div style={{fontSize:9,color:f.color,letterSpacing:".1em",marginBottom:4}}>{f.year}</div>
          <div style={{fontSize:14,fontWeight:700,color:"#e2e8f0",marginBottom:8}}>{f.title}</div>
          <div style={{fontSize:11,color:"#64748b",lineHeight:1.6}}>{f.desc}</div>
        </div>
      ))}
    </div>}
    {tab==="modeller"&&<div>
      <div style={{fontSize:12,color:"#64748b",marginBottom:16}}>ChatGPT, Claude ve Gemini — 2026'da dijital okuryazarlığın temeli. Hızlı rehber ve ne zaman hangisi.</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:14,marginBottom:20}}>
        {[{k:"chatgpt",isim:"ChatGPT",firma:"OpenAI",renk:"#00dcff",icon:"🤖",model:"GPT-5.5",ozet:"900M kullanıcı. Görsel, ses, hafıza. En geniş ekosistem.",kullan:["Günlük görevler","DALL-E 3 görsel","Sesli sohbet","Genel sorular"],kullanma:["Uzun belge","Gizlilik kritikse","Derin kod"]},{k:"claude",isim:"Claude",firma:"Anthropic",renk:"#a855f7",icon:"🧠",model:"Opus 4.7",ozet:"Kodlamada #1 (SWE-bench %87.6). 1M token. En az hallüsinasyon.",kullan:["Kod yazma/debug","Uzun belge analizi","Güvenlik kritik","Akademik"],kullanma:["Görsel üretim","Sesli sohbet","Google ekosistemi"]},{k:"gemini",isim:"Gemini",firma:"Google",renk:"#34d399",icon:"🌟",model:"3.1 Ultra",ozet:"2M token rekoru. Google Drive/Gmail/Docs. Gerçek zamanlı web.",kullan:["Araştırma","Google Workspace","2M token belge","Görsel analiz"],kullanma:["Yaratıcı yazarlık","Ses klonlama","Kod derinliği"]}].map(m=>(
          <div key={m.k} style={{background:`${m.renk}06`,border:`1px solid ${m.renk}22`,borderRadius:14,padding:"18px"}}>
            <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:10}}><span style={{fontSize:28}}>{m.icon}</span><div><div style={{fontSize:14,fontWeight:800,color:m.renk}}>{m.isim}</div><div style={{fontSize:10,color:"#475569"}}>{m.firma} · {m.model}</div></div></div>
            <div style={{fontSize:11,color:"#64748b",lineHeight:1.6,marginBottom:10}}>{m.ozet}</div>
            <div style={{marginBottom:6}}><div style={{fontSize:10,color:"#34d399",fontWeight:700,marginBottom:3}}>✅ Kullan:</div>{m.kullan.map(k=><div key={k} style={{fontSize:10,color:"#64748b",marginBottom:1}}>→ {k}</div>)}</div>
            <div><div style={{fontSize:10,color:"#f472b6",fontWeight:700,marginBottom:3}}>❌ Kullanma:</div>{m.kullanma.map(k=><div key={k} style={{fontSize:10,color:"#64748b",marginBottom:1}}>→ {k}</div>)}</div>
          </div>
        ))}
      </div>
      <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:12,padding:"14px"}}>
        <div style={{fontSize:12,fontWeight:700,color:"#e2e8f0",marginBottom:6}}>💡 Pro Strateji</div>
        <div style={{fontSize:12,color:"#64748b",lineHeight:1.7}}>ChatGPT Plus ($20/ay) + Claude Pro ($20/ay) = $40/ay toplam. Bu iki araç kombinasyonu bir profesyonelin verimliliğini 2-3 katına çıkarır. İlk haftada karşılığını alırsın.</div>
      </div>
    </div>}
    {tab==="prompt101"&&<div>
      <div style={{background:"rgba(168,85,247,0.05)",border:"1px solid rgba(168,85,247,0.2)",borderRadius:14,padding:"20px",marginBottom:16}}>
        <div style={{fontSize:15,fontWeight:800,color:"#e2e8f0",marginBottom:8}}>💡 Prompt Nedir?</div>
        <div style={{fontSize:12,color:"#94a3b8",lineHeight:1.9}}>AI'ya verdiğin komuttur. Kalitesi çıktıyı doğrudan belirler. Aynı AI ile kötü prompt → vasat sonuç, iyi prompt → mükemmel sonuç. AI bir orkestra, sen şefsin.</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:10,marginBottom:16}}>
        {[{no:1,t:"Rol Ver",a:"'Deneyimli bir X olarak' ile başla",orn:"'10 yıllık İK danışmanı olarak CV yaz'",c:"#00dcff"},{no:2,t:"Bağlam Ekle",a:"Kim için, ne amaçla, hangi platform",orn:"'GenZ hedef kitleye, Instagram için, eğlenceli'",c:"#a855f7"},{no:3,t:"Format Belirt",a:"Uzunluk, yapı, liste/tablo",orn:"'Madde madde, 200 kelime, başlıklar'",c:"#34d399"},{no:4,t:"Örnek Göster",a:"İstediğin tarzın bir örneği",orn:"'Şu şekilde yaz: [örnek]'",c:"#fb923c"},{no:5,t:"Kısıt Ekle",a:"Ne yapmamasını söyle",orn:"'Jargon kullanma, rakip isim verme'",c:"#f472b6"},{no:6,t:"İterasyonu Kullan",a:"Beğenmezsen düzelt",orn:"'Daha kısa / Daha teknik / Ton değiştir'",c:"#60a5fa"}].map(k=>(
          <div key={k.no} style={{background:`${k.c}06`,border:`1px solid ${k.c}18`,borderRadius:11,padding:"12px"}}>
            <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:6}}>
              <div style={{width:20,height:20,borderRadius:"50%",background:`${k.c}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:900,color:k.c,flexShrink:0}}>{k.no}</div>
              <div style={{fontSize:11,fontWeight:700,color:k.c}}>{k.t}</div>
            </div>
            <div style={{fontSize:10,color:"#64748b",marginBottom:5}}>{k.a}</div>
            <div style={{background:"rgba(0,0,0,0.3)",borderRadius:6,padding:"6px 8px",fontSize:9,color:"#94a3b8",fontStyle:"italic"}}>💬 {k.orn}</div>
          </div>
        ))}
      </div>
      <div style={{background:"rgba(0,0,0,0.4)",borderRadius:11,padding:"14px"}}>
        <div style={{fontSize:12,fontWeight:700,color:"#e2e8f0",marginBottom:6}}>🏆 Evrensel Formül</div>
        <div style={{fontFamily:"monospace",fontSize:12,lineHeight:2.2}}><span style={{color:"#00dcff"}}>[ROL]</span> + <span style={{color:"#a855f7"}}>[GÖREV]</span> + <span style={{color:"#34d399"}}>[BAĞLAM]</span> + <span style={{color:"#fb923c"}}>[FORMAT]</span> + <span style={{color:"#f472b6"}}>[KISIT]</span></div>
        <div style={{fontSize:11,color:"#64748b",marginTop:8}}>"10 yıl deneyimli pazarlamacı olarak (ROL), GenZ hedef kitleye (BAĞLAM) Instagram carousel postu yaz (GÖREV). 5 slayt, madde madde (FORMAT). Argo kullanma (KISIT)."</div>
      </div>
    </div>}
  </div>;
}

function ModelPage({modelKey}){
  const m=AI_MODELS_DATA[modelKey];
  if(!m)return null;
  return <div style={{padding:"28px 20px",maxWidth:900,margin:"0 auto"}}>
    <div style={{background:`linear-gradient(135deg,${m.color}08,transparent)`,border:`1px solid ${m.color}22`,borderRadius:18,padding:"26px",marginBottom:20}}>
      <div style={{display:"flex",gap:16,alignItems:"flex-start",flexWrap:"wrap"}}>
        <div style={{fontSize:52}}>{m.icon}</div>
        <div style={{flex:1}}>
          <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:6,flexWrap:"wrap"}}>
            <div style={{fontSize:22,fontWeight:900,color:m.color}}>{m.name}</div>
            <Tag text={m.company} color={m.color}/><Tag text={m.model} color="#475569"/>
          </div>
          <div style={{fontSize:13,color:"#94a3b8",marginBottom:10}}>{m.tagline}</div>
          <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
            {[[m.users,"Kullanıcı"],[m.context,"Context"],[m.free?"Ücretsiz var":"Ücretli","Plan"]].map(([v,l])=>(
              <div key={l}><div style={{fontSize:9,color:"#475569"}}>{l}</div><div style={{fontSize:12,fontWeight:700,color:"#e2e8f0"}}>{v}</div></div>
            ))}
          </div>
        </div>
        <a href={m.url} target="_blank" rel="noopener noreferrer" style={{padding:"12px 24px",borderRadius:10,border:"none",background:`linear-gradient(135deg,${m.color},${m.color}88)`,color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",textDecoration:"none",whiteSpace:"nowrap"}}>Dene →</a>
      </div>
      <div style={{marginTop:14,fontSize:12,color:"#64748b",lineHeight:1.7,background:"rgba(0,0,0,0.2)",borderRadius:10,padding:"12px 14px"}}>{m.sistem}</div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:14,marginBottom:20}}>
      <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:14,padding:"18px"}}>
        <div style={{fontSize:13,fontWeight:700,color:"#e2e8f0",marginBottom:12}}>📊 Performans Skorları</div>
        {Object.entries(m.scores).map(([k,v])=>(
          <div key={k} style={{marginBottom:9}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"#94a3b8",marginBottom:2}}><span style={{textTransform:"capitalize"}}>{k}</span><span style={{color:m.color,fontWeight:700}}>{v}/100</span></div>
            <div style={{height:5,background:"rgba(255,255,255,0.06)",borderRadius:3}}><div style={{width:`${v}%`,height:"100%",background:m.color,borderRadius:3}}/></div>
          </div>
        ))}
      </div>
      <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:14,padding:"18px"}}>
        <div style={{fontSize:12,fontWeight:700,color:"#34d399",marginBottom:10}}>✅ Güçlü Yönler</div>
        {m.guclu.map(g=><div key={g} style={{display:"flex",gap:8,fontSize:11,color:"#94a3b8",marginBottom:6}}><span style={{color:"#34d399",flexShrink:0}}>+</span>{g}</div>)}
        <div style={{height:1,background:"rgba(255,255,255,0.06)",margin:"12px 0"}}/>
        <div style={{fontSize:12,fontWeight:700,color:"#f472b6",marginBottom:10}}>❌ Zayıf Yönler</div>
        {m.zayif.map(z=><div key={z} style={{display:"flex",gap:8,fontSize:11,color:"#94a3b8",marginBottom:6}}><span style={{color:"#f472b6",flexShrink:0}}>–</span>{z}</div>)}
      </div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:12,marginBottom:16}}>
      {m.plans.map(p=>(
        <div key={p.n} style={{background:`${p.c}08`,border:`1px solid ${p.c}22`,borderRadius:12,padding:"16px"}}>
          <div style={{fontSize:14,fontWeight:800,color:p.c,marginBottom:4}}>{p.n}</div>
          <div style={{fontSize:18,fontWeight:900,color:"#e2e8f0",marginBottom:6}}>{p.p}</div>
          <div style={{fontSize:11,color:"#64748b",lineHeight:1.6}}>{p.d}</div>
        </div>
      ))}
    </div>
    <div style={{background:`${m.color}06`,border:`1px solid ${m.color}18`,borderRadius:13,padding:"16px",marginBottom:14}}>
      <div style={{fontSize:12,fontWeight:700,color:m.color,marginBottom:6}}>💡 {m.name} için En İyi Prompt İpucu</div>
      <div style={{fontSize:12,color:"#94a3b8",lineHeight:1.7}}>{m.prompt}</div>
    </div>
    <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:13,padding:"14px"}}>
      <div style={{fontSize:12,fontWeight:700,color:"#e2e8f0",marginBottom:6}}>🎯 Kimler İçin İdeal?</div>
      <div style={{fontSize:12,color:"#94a3b8",lineHeight:1.7}}>{m.bestFor}</div>
    </div>
  </div>;
}

function PromptPage(){
  const[ac,setAc]=useState(0);
  const cat=PROMPTS_DATA[ac];
  return <div style={{padding:"28px 20px",maxWidth:900,margin:"0 auto"}}>
    <div style={{marginBottom:20}}><div style={{fontSize:9,letterSpacing:".2em",color:"#a855f7",marginBottom:5}}>REHBER</div><div style={{fontSize:22,fontWeight:800,color:"#e2e8f0"}}>💡 Prompt Mühendisliği</div><div style={{fontSize:12,color:"#64748b",marginTop:3}}>30+ hazır prompt · 6 kategori · Kötü vs İyi karşılaştırmaları</div></div>
    <div style={{background:"linear-gradient(135deg,rgba(168,85,247,0.08),rgba(0,220,255,0.05))",border:"1px solid rgba(168,85,247,0.2)",borderRadius:14,padding:"20px",marginBottom:20}}>
      <div style={{fontSize:13,fontWeight:700,color:"#e2e8f0",marginBottom:12}}>🧪 Evrensel Prompt Formülü</div>
      <div style={{background:"rgba(0,0,0,0.5)",borderRadius:10,padding:"14px",fontFamily:"monospace",fontSize:13,lineHeight:2,marginBottom:12}}>
        <span style={{color:"#00dcff"}}>[ROL]</span> + <span style={{color:"#a855f7"}}>[GÖREV]</span> + <span style={{color:"#34d399"}}>[BAĞLAM]</span> + <span style={{color:"#fb923c"}}>[FORMAT]</span> + <span style={{color:"#f472b6"}}>[KISIT]</span>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:8}}>
        {[["🎭 ROL","'Deneyimli bir... olarak'","#00dcff"],["📋 GÖREV","Ne yapılmasını istiyorsun","#a855f7"],["📌 BAĞLAM","Kitle, amaç, kısıt","#34d399"],["📐 FORMAT","Uzunluk, stil, yapı","#fb923c"],["🔒 KISIT","Yapma, kullanma","#f472b6"]].map(([t,d,c])=>(
          <div key={t} style={{background:`${c}08`,border:`1px solid ${c}18`,borderRadius:9,padding:"10px"}}>
            <div style={{fontSize:11,fontWeight:700,color:c,marginBottom:2}}>{t}</div>
            <div style={{fontSize:10,color:"#64748b"}}>{d}</div>
          </div>
        ))}
      </div>
    </div>
    <div style={{marginBottom:16}}>
      <div style={{fontSize:12,fontWeight:700,color:"#e2e8f0",marginBottom:10}}>🔬 İleri Teknikler</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:9}}>
        {[{t:"Zero-shot",d:"Örnek vermeden direkt görev.",e:"'Bu metni özetle'",c:"#00dcff"},{t:"Few-shot",d:"2-5 örnek ver sonra yaptır.",e:"'Örnek 1:... Şimdi sen:'",c:"#a855f7"},{t:"Chain of Thought",d:"'Adım adım düşün' ekle.",e:"Matematikte %30 daha doğru",c:"#34d399"},{t:"Role Prompting",d:"'Uzman bir... olarak' başla.",e:"En etkili tekniklerden biri",c:"#fb923c"},{t:"Tree of Thought",d:"Alternatif yolları değerlendir.",e:"Karmaşık problemler için",c:"#f472b6"},{t:"Self-Consistency",d:"Aynı soruyu 3 farklı sor.",e:"En tutarlı cevabı seç",c:"#60a5fa"}].map(tech=>(
          <div key={tech.t} style={{background:`${tech.c}06`,border:`1px solid ${tech.c}18`,borderRadius:11,padding:"12px"}}>
            <div style={{fontSize:11,fontWeight:700,color:tech.c,marginBottom:4}}>{tech.t}</div>
            <div style={{fontSize:11,color:"#94a3b8",marginBottom:5}}>{tech.d}</div>
            <div style={{fontSize:10,color:"#64748b",fontStyle:"italic"}}>💡 {tech.e}</div>
          </div>
        ))}
      </div>
    </div>
    <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16}}>
      {PROMPTS_DATA.map((p,i)=><button key={p.cat} onClick={()=>setAc(i)} style={{padding:"7px 13px",borderRadius:8,border:"none",cursor:"pointer",fontSize:11,fontFamily:"inherit",background:ac===i?`${p.color}18`:"rgba(255,255,255,0.04)",color:ac===i?p.color:"#475569"}}>{p.icon} {p.cat}</button>)}
    </div>
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      {cat.items.map((item,i)=>(
        <div key={i} style={{background:"rgba(255,255,255,0.02)",border:`1px solid ${cat.color}18`,borderRadius:14,overflow:"hidden"}}>
          <div style={{background:`${cat.color}08`,padding:"11px 16px",borderBottom:`1px solid ${cat.color}12`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{fontSize:13,fontWeight:700,color:"#e2e8f0"}}>{cat.icon} {item.title}</div>
            <Tag text={cat.cat.split(" ").slice(1).join(" ")} color={cat.color} size={9}/>
          </div>
          <div style={{padding:"13px 16px"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
              <div style={{background:"rgba(244,114,182,0.05)",border:"1px solid rgba(244,114,182,0.15)",borderRadius:9,padding:"10px"}}>
                <div style={{fontSize:9,color:"#f472b6",fontWeight:700,marginBottom:5}}>❌ KÖTÜ</div>
                <div style={{fontSize:11,color:"#94a3b8",fontStyle:"italic"}}>{item.kotu}</div>
              </div>
              <div style={{background:"rgba(52,211,153,0.05)",border:"1px solid rgba(52,211,153,0.15)",borderRadius:9,padding:"10px"}}>
                <div style={{fontSize:9,color:"#34d399",fontWeight:700,marginBottom:5}}>✅ İYİ</div>
                <div style={{fontSize:11,color:"#94a3b8",fontStyle:"italic",lineHeight:1.5}}>{item.iyi}</div>
              </div>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{background:"rgba(168,85,247,0.06)",border:"1px solid rgba(168,85,247,0.15)",borderRadius:8,padding:"7px 11px",fontSize:11,color:"#a855f7",flex:1}}>💡 {item.note}</div>
              <button onClick={()=>navigator.clipboard?.writeText(item.iyi)} style={{marginLeft:8,padding:"7px 12px",borderRadius:8,border:"none",background:cat.color+"22",color:cat.color,fontSize:10,cursor:"pointer",fontFamily:"inherit",flexShrink:0}}>Kopyala</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>;
}

function KarsilastirmaPage(){
  const[tab,setTab]=useState("sohbet");
  const d=COMP_DATA[tab];
  return <div style={{padding:"28px 20px",maxWidth:900,margin:"0 auto"}}>
    <div style={{marginBottom:20}}><div style={{fontSize:9,letterSpacing:".2em",color:"#475569",marginBottom:5}}>KARŞILAŞTIRMA</div><div style={{fontSize:22,fontWeight:800,color:"#e2e8f0"}}>🆚 AI Araç Karşılaştırması</div><div style={{fontSize:12,color:"#64748b",marginTop:3}}>5 kategoride detaylı, puanlı karşılaştırma</div></div>
    <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:18}}>
      {Object.entries(COMP_DATA).map(([k,v])=><button key={k} onClick={()=>setTab(k)} style={{padding:"8px 16px",borderRadius:8,border:"none",cursor:"pointer",fontSize:12,fontFamily:"inherit",background:tab===k?"rgba(0,220,255,0.15)":"rgba(255,255,255,0.04)",color:tab===k?"#00dcff":"#475569"}}>{v.title}</button>)}
    </div>
    <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:14,overflow:"hidden",marginBottom:16}}>
      <div style={{display:"grid",gridTemplateColumns:`140px repeat(${d.tools.length},1fr)`,background:"rgba(0,0,0,0.3)",padding:"12px 16px",gap:8,overflowX:"auto"}}>
        <div style={{fontSize:11,color:"#475569",display:"flex",alignItems:"center"}}>KATEGORİ</div>
        {d.tools.map((t,i)=><div key={t} style={{textAlign:"center",padding:"8px",background:`${d.colors[i]}10`,borderRadius:8}}><div style={{fontSize:12,fontWeight:700,color:d.colors[i]}}>{t}</div></div>)}
      </div>
      {d.cats.map((cat,ci)=>(
        <div key={cat} style={{display:"grid",gridTemplateColumns:`140px repeat(${d.tools.length},1fr)`,padding:"10px 16px",gap:8,borderTop:"1px solid rgba(255,255,255,0.04)",background:ci%2===0?"transparent":"rgba(255,255,255,0.01)"}}>
          <div style={{fontSize:11,color:"#94a3b8",display:"flex",alignItems:"center"}}>{cat}</div>
          {d.scores[ci].map((sc,si)=>{const win=d.scores[ci].indexOf(Math.max(...d.scores[ci]))===si;return(
            <div key={si} style={{textAlign:"center"}}>
              <div style={{fontSize:12,fontWeight:win?800:400,color:win?d.colors[si]:"#475569"}}>{win?"🏆 ":""}{sc}</div>
              <div style={{height:4,background:"rgba(255,255,255,0.06)",borderRadius:2,marginTop:3}}><div style={{width:`${sc}%`,height:"100%",background:win?d.colors[si]:"rgba(255,255,255,0.1)",borderRadius:2}}/></div>
            </div>
          );})}
        </div>
      ))}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:10}}>
      {d.tools.map((t,i)=><div key={t} style={{background:`${d.colors[i]}06`,border:`1px solid ${d.colors[i]}20`,borderRadius:11,padding:"13px"}}>
        <div style={{fontSize:13,fontWeight:700,color:d.colors[i],marginBottom:4}}>{t}</div>
        <div style={{fontSize:11,color:"#64748b"}}>Ort: {Math.round(d.scores.reduce((sum,row)=>sum+row[i],0)/d.cats.length)}/100</div>
      </div>)}
    </div>
  </div>;
}

function MitlerPage(){
  const[expanded,setExpanded]=useState(null);
  return <div style={{padding:"28px 20px",maxWidth:860,margin:"0 auto"}}>
    <div style={{marginBottom:20}}><div style={{fontSize:9,letterSpacing:".2em",color:"#475569",marginBottom:5}}>GERÇEK Mİ YALAN MI?</div><div style={{fontSize:22,fontWeight:800,color:"#e2e8f0"}}>🔍 AI Hakkında Yaygın Yanlışlar</div><div style={{fontSize:12,color:"#64748b",marginTop:3}}>En çok duyulan 8 AI efsanesi ve gerçeği</div></div>
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      {MYTHS_DATA.map((m,i)=>(
        <div key={i} style={{background:"rgba(255,255,255,0.02)",border:`1px solid ${expanded===i?m.color+"44":"rgba(255,255,255,0.07)"}`,borderRadius:13,overflow:"hidden",transition:"all .2s"}}>
          <div onClick={()=>setExpanded(expanded===i?null:i)} style={{padding:"16px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{display:"flex",gap:12,alignItems:"center"}}>
              <Tag text={m.verdict} color={m.color}/>
              <div style={{fontSize:13,fontWeight:600,color:"#e2e8f0"}}>❌ "{m.myth}"</div>
            </div>
            <span style={{fontSize:14,color:"#475569",flexShrink:0}}>{expanded===i?"▲":"▼"}</span>
          </div>
          {expanded===i&&<div style={{padding:"0 16px 16px",borderTop:"1px solid rgba(255,255,255,0.06)",marginTop:0}}>
            <div style={{fontSize:12,color:"#94a3b8",lineHeight:1.7,padding:"12px 0"}}>✅ <strong style={{color:"#e2e8f0"}}>Gerçek:</strong> {m.reality}</div>
          </div>}
        </div>
      ))}
    </div>
    <div style={{marginTop:20,background:"rgba(0,220,255,0.05)",border:"1px solid rgba(0,220,255,0.2)",borderRadius:14,padding:"18px",textAlign:"center"}}>
      <div style={{fontSize:13,fontWeight:700,color:"#e2e8f0",marginBottom:6}}>💡 Sonuç</div>
      <div style={{fontSize:12,color:"#64748b",lineHeight:1.7}}>AI ne mucize ne de felaket. Güçlü bir araç. Doğru kullanılan AI hayatı kolaylaştırır, yanlış beklentilerle kullanılan AI hayal kırıklığı yaratır. Gerçekçi beklenti = gerçek fayda.</div>
    </div>
  </div>;
}

function ZamanCizgisiPage(){
  return <div style={{padding:"28px 20px",maxWidth:860,margin:"0 auto"}}>
    <div style={{marginBottom:24}}><div style={{fontSize:9,letterSpacing:".2em",color:"#475569",marginBottom:5}}>TARİHÇE</div><div style={{fontSize:22,fontWeight:800,color:"#e2e8f0"}}>📅 AI'nın 75 Yıllık Yolculuğu</div><div style={{fontSize:12,color:"#64748b",marginTop:3}}>1950'den 2026'ya — dönüm noktaları</div></div>
    <div style={{display:"flex",flexDirection:"column",gap:0}}>
      {TIMELINE_DATA.map((item,i)=>(
        <div key={item.year} style={{display:"flex",gap:0,alignItems:"stretch"}}>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",width:60,flexShrink:0}}>
            <div style={{width:40,height:40,borderRadius:"50%",background:`${item.color}20`,border:`2px solid ${item.color}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{item.icon}</div>
            {i<TIMELINE_DATA.length-1&&<div style={{width:2,flex:1,background:`linear-gradient(${item.color},${TIMELINE_DATA[i+1].color})`,opacity:.4,minHeight:20}}/>}
          </div>
          <div style={{flex:1,padding:"0 0 24px 16px"}}>
            <div style={{background:`${item.color}06`,border:`1px solid ${item.color}18`,borderRadius:12,padding:"14px 16px"}}>
              <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:6}}>
                <div style={{fontSize:15,fontWeight:900,color:item.color}}>{item.year}</div>
                <div style={{fontSize:13,fontWeight:700,color:"#e2e8f0"}}>{item.title}</div>
              </div>
              <div style={{fontSize:12,color:"#64748b",lineHeight:1.6}}>{item.desc}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>;
}

function KariyerPage(){
  const[aktif,setAktif]=useState("harita");
  const tabs=[["harita","🗺️ Yol Haritası"],["meslekler","💼 AI Meslekleri"],["kaynaklar","📚 Kaynaklar"],["cv","📄 CV & LinkedIn"]];
  const meslekler=[
    {icon:"💡",baslik:"Prompt Mühendisi",maas:"₺20K-60K/ay",sure:"1-2 ay",seviye:"Başlangıç",renk:"#00dcff",talep:"🔥 Çok Yüksek",
     aciklama:"Şirketlere özel AI prompt sistemleri tasarla ve optimize et. Türkiye'de bu unvanla tam zamanlı çalışan sayısı henüz 500'ün altında — talep çok daha fazla.",
     gorevler:["Şirket süreçlerine özel prompt şablonları geliştirme","ChatGPT/Claude API entegrasyonu","Prompt testleri ve optimizasyonu","AI çıktı kalitesini ölçme ve iyileştirme"],
     gereksinimler:["Prompt tekniklerini iyi bilmek","Model farklarını anlamak (GPT vs Claude vs Gemini)","Test metodolojisi","Temel Python (opsiyonel ama faydalı)"],
     baslarken:["IMDATAI prompt rehberini baştan sona oku","PromptingGuide.ai'yi incele","10 farklı sektör için prompt sistemi yap","GitHub'a portföy olarak yükle"]
    },
    {icon:"🤖",baslik:"AI Danışmanı",maas:"₺30K-80K/ay",sure:"3-6 ay",seviye:"Orta",renk:"#a855f7",talep:"🔥 Çok Yüksek",
     aciklama:"KOBİ ve büyük şirketlere AI entegrasyonu danışmanlığı yap. 'Şirketim AI'ı nasıl kullanmalı?' sorusunun cevabını ver ve uygula.",
     gorevler:["Şirket süreçlerini analiz etme","AI araç önerileri ve değerlendirmesi","Pilot proje yönetimi","Çalışan AI eğitimi","ROI hesaplama ve raporlama"],
     gereksinimler:["Geniş AI araç bilgisi","İş süreçleri analizi","Sunum ve iletişim becerileri","En az 1 sektörde derin bilgi"],
     baslarken:["Birini sektörü için AI use case'leri araştır","LinkedIn'de 'AI Consultant' paylaşımları yap","Ücretsiz demo sunum hazırla","İlk müşteri için indirimli çalış"]
    },
    {icon:"💻",baslik:"ML Mühendisi",maas:"₺40K-120K/ay",sure:"1-2 yıl",seviye:"İleri",renk:"#34d399",talep:"📈 Yüksek",
     aciklama:"Makine öğrenmesi modelleri geliştir, eğit ve üretim ortamına al. Türkiye'de en yüksek maaşlı yazılım pozisyonlarından biri.",
     gorevler:["ML modeli geliştirme ve eğitimi","Veri işleme pipelines","Model deployment (MLOps)","A/B testleri","Performans optimizasyonu"],
     gereksinimler:["Python (ileri seviye)","PyTorch veya TensorFlow","İstatistik ve matematik temeli","Docker ve Cloud (AWS/GCP/Azure)","SQL ve veri işleme"],
     baslarken:["fast.ai ücretsiz kursunu tamamla","Kaggle'da en az 3 yarışmaya katıl","GitHub'da ML projeler yayınla","Papers with Code'u takip et"]
    },
    {icon:"📊",baslik:"AI Ürün Müdürü",maas:"₺35K-100K/ay",sure:"6-12 ay",seviye:"Orta",renk:"#fb923c",talep:"📈 Yüksek",
     aciklama:"AI ürünlerini planla, geliştir ve piyasaya sun. Teknik ekip ile iş birimi arasında köprü kur. Hem teknik hem iş bilgisi şart.",
     gorevler:["AI ürün stratejisi belirleme","Roadmap ve önceliklendirme","Geliştirici ekiple çalışma","Kullanıcı araştırması","Metrikleri takip etme"],
     gereksinimler:["Ürün yönetimi temelleri","AI/ML temel kavramları","Veri analizi (SQL + Excel)","İletişim ve liderlik","Teknik empati"],
     baslarken:["Product School PM kursunu al","AI ürünlerini kullanıcı gözüyle incele","Kendi AI ürün konseptini yaz","Mevcut ürüne AI özelliği öner"]
    },
    {icon:"✍️",baslik:"AI İçerik Stratejisti",maas:"₺15K-40K/ay",sure:"2-4 hafta",seviye:"Başlangıç",renk:"#f472b6",talep:"📈 Yüksek",
     aciklama:"AI araçlarıyla içerik üret, marka sesi oluştur, içerik stratejisi kur. En hızlı ve en kolay başlangıç yapılabilen AI pozisyonu.",
     gorevler:["AI araçlarıyla blog ve sosyal medya içeriği üretme","İçerik takvimi planlama","SEO optimizasyonu","Marka ses kılavuzu oluşturma","İçerik performansı analizi"],
     gereksinimler:["ChatGPT ve Claude kullanımı","Yazarlık ve dil becerisi","Sosyal medya bilgisi","Temel SEO bilgisi","Canva veya benzer tasarım aracı"],
     baslarken:["Haftada 5 blog yazısı üret, yayınla","LinkedIn'de AI içerik paylaş","İlk 3 müşterini ücretsiz yardımla kazan","Portfolio sitesi oluştur"]
    },
    {icon:"🔧",baslik:"AI Otomasyon Uzmanı",maas:"₺25K-70K/ay",sure:"2-4 ay",seviye:"Orta",renk:"#60a5fa",talep:"🔥 Çok Yüksek",
     aciklama:"n8n, Make ve Zapier ile şirketlerin tekrarlayan süreçlerini otomatize et. Proje başına yüksek ücret + aylık bakım geliri.",
     gorevler:["İş süreçlerini otomatize etme","API entegrasyonları kurma","Veri akışları tasarlama","Hata yönetimi ve monitoring","Dokümantasyon hazırlama"],
     gereksinimler:["n8n veya Make kullanımı","API kavramlarını anlama","Temel programlama (Python/JS faydalı)","Süreç analizi","Hata debug etme"],
     baslarken:["n8n.io'da ücretsiz hesap aç","10 farklı workflow dene","Kendi hayatında bir şeyi otomatize et","Case study yaz, paylaş"]
    },
  ];

  return <div style={{padding:"28px 20px",maxWidth:960,margin:"0 auto"}}>
    <div style={{marginBottom:22}}>
      <div style={{fontSize:9,letterSpacing:".2em",color:"#475569",marginBottom:5}}>KARİYER</div>
      <div style={{fontSize:24,fontWeight:900,color:"#e2e8f0",marginBottom:6}}>🚀 AI Kariyer Rehberi 2026</div>
      <div style={{fontSize:13,color:"#64748b"}}>Türkiye'de AI meslekleri · Maaş verileri · Adım adım yol haritası · Ücretsiz kaynaklar</div>
    </div>
    <div style={{background:"rgba(0,220,255,0.07)",border:"1px solid rgba(0,220,255,0.2)",borderRadius:12,padding:"14px 18px",marginBottom:20}}>
      <div style={{fontSize:12,color:"#00dcff",lineHeight:1.7}}>🇹🇷 <strong>Türkiye fırsatı:</strong> 2024'e göre AI meslek ilanları %340 arttı. AI bilen uzman sayısı hâlâ çok az. 2026'da başlayanlar "erken adaptör" avantajı taşıyor.</div>
    </div>
    <div style={{display:"flex",gap:6,marginBottom:20,flexWrap:"wrap"}}>
      {tabs.map(([id,l])=><button key={id} onClick={()=>setAktif(id)} style={{padding:"8px 16px",borderRadius:9,border:"none",cursor:"pointer",fontSize:12,fontFamily:"inherit",background:aktif===id?"rgba(0,220,255,0.15)":"rgba(255,255,255,0.04)",color:aktif===id?"#00dcff":"#475569",fontWeight:aktif===id?700:400}}>{l}</button>)}
    </div>

    {aktif==="harita"&&<div>
      <div style={{fontSize:14,fontWeight:700,color:"#e2e8f0",marginBottom:16}}>🗺️ Sıfırdan AI Uzmanına — 6 Aylık Yol Haritası</div>
      <div style={{display:"flex",flexDirection:"column",gap:0}}>
        {[
          {hafta:"Hafta 1-2",baslik:"Temelleri Öğren",renk:"#00dcff",gorevler:["ChatGPT, Claude ve Gemini'ye ücretsiz kayıt ol","Her gün 30 dakika farklı görevler dene","IMDATAI sözlüğündeki 20 temel terimi öğren","AI mı İnsan mı? oyunumuzu oyna"],ipucu:"Amaç mükemmel olmak değil, başlamak. İlk 2 haftada sadece kullan."},
          {hafta:"Hafta 3-4",baslik:"Prompt Tekniklerini Öğren",renk:"#a855f7",gorevler:["IMDATAI prompt rehberini baştan sona oku","Role prompting, Chain of Thought, Few-shot uygula","Her gün 1 yeni teknik dene","Kendi iş alanın için 10 prompt şablonu yaz"],ipucu:"Prompt kalitesi çıktı kalitesini doğrudan belirler. Bu hafta en kritik hafta."},
          {hafta:"Ay 2",baslik:"Uzmanlaş ve Uygula",renk:"#34d399",gorevler:["Mesleğine en uygun 3 AI aracını derinlemesine öğren","Gerçek işinde AI ile bir proje tamamla","LinkedIn'de 'AI ile X yaptım' içeriği paylaş","Bir blog yazısı veya video hazırla"],ipucu:"Uzmanlaşma = Para. 'Her şeyi bilen' değil, belirli bir alanda çok iyi olan ol."},
          {hafta:"Ay 3",baslik:"İlk Müşteriyi Kazan",renk:"#fb923c",gorevler:["Fiverr/Upwork profili oluştur","İlk 3 müşteriyi indirimli veya ücretsiz kazan","Portfolio sitesi yayınla","LinkedIn bağlantılarına ulaş, demo sun"],ipucu:"İlk müşteri en zoru. Fiyat değil değer sat. 'Sizi X saat kurtarabilirim' de."},
          {hafta:"Ay 4-5",baslik:"Sistemi Kur",renk:"#f472b6",gorevler:["Düzenli gelir akışı oluştur (5+ tekrar müşteri)","Fiyatları %30-50 artır","Referans sistemi kur","İkinci gelir kanalı aç (kurs veya içerik)"],ipucu:"Bu aşamada kalite > hız. Az müşteri, yüksek kalite, yüksek fiyat."},
          {hafta:"Ay 6",baslik:"Ölçeklendir",renk:"#60a5fa",gorevler:["Aylık ₺20.000+ hedefini kontrol et","Daha büyük kurumsal müşterilere geç","Kendi AI aracı veya kurs geliştir","Network oluştur, konuşmacı ol"],ipucu:"6. ayda artık 'AI uzmanı' kimliğin oturmuş olmalı. Markalaşmaya başla."},
        ].map((a,i)=>(
          <div key={i} style={{display:"flex",gap:0}}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",width:50,flexShrink:0}}>
              <div style={{width:36,height:36,borderRadius:"50%",background:`${a.renk}20`,border:`2px solid ${a.renk}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:900,color:a.renk,flexShrink:0}}>{i+1}</div>
              {i<5&&<div style={{width:2,flex:1,background:`linear-gradient(${a.renk},${["#a855f7","#34d399","#fb923c","#f472b6","#60a5fa"][i]})`,opacity:.3,minHeight:20}}/>}
            </div>
            <div style={{flex:1,padding:"0 0 24px 16px"}}>
              <div style={{background:`${a.renk}06`,border:`1px solid ${a.renk}18`,borderRadius:12,padding:"16px 18px"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:10,flexWrap:"wrap",gap:6}}>
                  <div style={{fontSize:14,fontWeight:800,color:"#e2e8f0"}}>{a.baslik}</div>
                  <div style={{fontSize:10,color:a.renk,background:`${a.renk}15`,padding:"3px 10px",borderRadius:6,fontWeight:700}}>{a.hafta}</div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:6,marginBottom:12}}>
                  {a.gorevler.map(g=><div key={g} style={{display:"flex",gap:7,fontSize:11,color:"#94a3b8"}}><span style={{color:a.renk,flexShrink:0}}>✓</span>{g}</div>)}
                </div>
                <div style={{background:"rgba(0,0,0,0.25)",borderRadius:8,padding:"9px 12px",fontSize:11,color:"#64748b",fontStyle:"italic"}}>💡 {a.ipucu}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>}

    {aktif==="meslekler"&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14}}>
      {meslekler.map(m=>(
        <div key={m.baslik} style={{background:`${m.renk}06`,border:`1px solid ${m.renk}20`,borderRadius:14,padding:"18px"}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
            <div style={{display:"flex",gap:10,alignItems:"center"}}><span style={{fontSize:26}}>{m.icon}</span><div><div style={{fontSize:14,fontWeight:700,color:"#e2e8f0"}}>{m.baslik}</div><div style={{fontSize:10,color:"#475569"}}>{m.seviye} · {m.sure}</div></div></div>
            <div style={{textAlign:"right"}}><div style={{fontSize:12,fontWeight:800,color:m.renk}}>{m.maas}</div><div style={{fontSize:9,color:"#475569",marginTop:2}}>{m.talep}</div></div>
          </div>
          <div style={{fontSize:11,color:"#64748b",lineHeight:1.6,marginBottom:12}}>{m.aciklama}</div>
          <div style={{marginBottom:10}}>
            <div style={{fontSize:10,fontWeight:700,color:"#e2e8f0",marginBottom:6}}>Görevler:</div>
            {m.gorevler.slice(0,3).map(g=><div key={g} style={{fontSize:10,color:"#64748b",marginBottom:4,display:"flex",gap:6}}><span style={{color:m.renk,flexShrink:0}}>→</span>{g}</div>)}
          </div>
          <div>
            <div style={{fontSize:10,fontWeight:700,color:"#e2e8f0",marginBottom:6}}>Nasıl Başlarım?</div>
            {m.baslarken.slice(0,2).map(b=><div key={b} style={{fontSize:10,color:"#64748b",marginBottom:4,display:"flex",gap:6}}><span style={{color:"#34d399",flexShrink:0}}>✓</span>{b}</div>)}
          </div>
        </div>
      ))}
    </div>}

    {aktif==="kaynaklar"&&<div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:14}}>
        {[
          {baslik:"🆓 Ücretsiz Kurslar",renk:"#34d399",liste:[{isim:"fast.ai — Derin Öğrenme",url:"https://fast.ai",detay:"ML mühendisleri için, Türkçe altyazılı"},{isim:"Google AI Essentials",url:"https://grow.google",detay:"Başlangıç için ideal, sertifikalı"},{isim:"Microsoft AI Skills",url:"https://microsoft.com/ai",detay:"Azure ve Copilot entegrasyonu"},{isim:"DeepLearning.AI",url:"https://deeplearning.ai",detay:"Andrew Ng'nin kursu, en kapsamlı"},{isim:"Kaggle Courses",url:"https://kaggle.com",detay:"Veri bilimi, ML, Python"}]},
          {baslik:"💰 Ücretli Kurslar (Değer)",renk:"#fb923c",liste:[{isim:"Udemy — AI/ML Bootcamp",url:"https://udemy.com",detay:"İndirimde $15, kapsamlı"},{isim:"Coursera ML Specialization",url:"https://coursera.org",detay:"Stanford, sertifikalı"},{isim:"DataCamp",url:"https://datacamp.com",detay:"Aylık $25, pratik odaklı"},{isim:"PromptingGuide.ai",url:"https://promptingguide.ai",detay:"Ücretsiz prompt rehberi"}]},
          {baslik:"📖 Türkçe Kaynaklar",renk:"#a855f7",liste:[{isim:"IMDATAI Prompt Rehberi",url:"#prompt",detay:"Kendi rehberimiz, Türkçe"},{isim:"IMDATAI Sözlük",url:"#sozluk",detay:"60+ AI terimi, Türkçe açıklama"},{isim:"BTK Akademi AI Kursları",url:"https://btkakademi.gov.tr",detay:"Ücretsiz, devlet destekli"},{isim:"Udemy TR",url:"https://udemy.com",detay:"Türkçe AI kursları var"}]},
          {baslik:"🎯 Pratik Platformlar",renk:"#00dcff",liste:[{isim:"Kaggle",url:"https://kaggle.com",detay:"Veri bilimi yarışmaları, ücretsiz"},{isim:"Hugging Face",url:"https://huggingface.co",detay:"Model hub, açık kaynak"},{isim:"Google Colab",url:"https://colab.google",detay:"Ücretsiz GPU ile ML"},{isim:"Replit",url:"https://replit.com",detay:"AI destekli kod ortamı"}]},
        ].map(s=>(
          <div key={s.baslik} style={{background:"rgba(255,255,255,0.02)",border:`1px solid ${s.renk}18`,borderRadius:13,padding:"16px"}}>
            <div style={{fontSize:13,fontWeight:700,color:"#e2e8f0",marginBottom:12}}>{s.baslik}</div>
            {s.liste.map(l=>(
              <a key={l.isim} href={l.url} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none",display:"block",marginBottom:10,padding:"8px 10px",background:"rgba(0,0,0,0.2)",borderRadius:8,border:`1px solid ${s.renk}10`,transition:"all .15s"}} onMouseEnter={e=>e.currentTarget.style.borderColor=s.renk+"40"} onMouseLeave={e=>e.currentTarget.style.borderColor=s.renk+"10"}>
                <div style={{fontSize:11,fontWeight:600,color:s.renk,marginBottom:2}}>{l.isim}</div>
                <div style={{fontSize:10,color:"#64748b"}}>{l.detay}</div>
              </a>
            ))}
          </div>
        ))}
      </div>
    </div>}

    {aktif==="cv"&&<div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        <div>
          <div style={{fontSize:14,fontWeight:700,color:"#e2e8f0",marginBottom:14}}>📄 AI CV'sinde Olması Gerekenler</div>
          {[
            {baslik:"AI Araçları Bölümü",aciklama:"'Yetenekler' bölümüne: ChatGPT, Claude, Midjourney, Cursor gibi kullandığın araçları ekle. 'Araçlar' başlığı altında listele."},
            {baslik:"Sayısal Başarılar",aciklama:"'AI araçlarıyla proje teslim süresini %60 kısalttım' veya 'AI ile 10 günde 50 blog yazısı ürettim' gibi somut rakamlar."},
            {baslik:"AI Projeleri Bölümü",aciklama:"GitHub'daki AI projelerini, yaptığın otomasyonları veya kurduğun prompt sistemlerini ayrı bir bölümde göster."},
            {baslik:"Sertifikalar",aciklama:"Google AI Essentials, DeepLearning.AI, Microsoft AI sertifikalarını ekle. Ücretsiz ve çok hızlı alınabiliyor."},
          ].map(m=>(
            <div key={m.baslik} style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:11,padding:"13px",marginBottom:10}}>
              <div style={{fontSize:12,fontWeight:700,color:"#00dcff",marginBottom:5}}>{m.baslik}</div>
              <div style={{fontSize:11,color:"#64748b",lineHeight:1.6}}>{m.aciklama}</div>
            </div>
          ))}
        </div>
        <div>
          <div style={{fontSize:14,fontWeight:700,color:"#e2e8f0",marginBottom:14}}>💼 LinkedIn Optimizasyonu</div>
          {[
            {baslik:"Başlık (Headline)",aciklama:"'AI-Powered Marketing Specialist' veya 'Yapay Zeka Destekli Yazılım Geliştirici' gibi. AI kelimesini başlığa ekle."},
            {baslik:"Hakkında (About)",aciklama:"'AI araçlarını kullanarak X sonuçlarını elde ediyorum' ile başla. Spesifik araçları ve kazanımları yaz."},
            {baslik:"Beceriler",aciklama:"ChatGPT, Claude, Prompt Engineering, AI Automation, Midjourney, n8n gibi 2026'nın arama edilen kelimeleri."},
            {baslik:"İçerik Paylaş",aciklama:"Haftada 2-3 AI ipucu paylaş. 'AI ile şunu yaptım' içerikleri çok etkileşim alıyor. 90 günde network oluşur."},
          ].map(m=>(
            <div key={m.baslik} style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:11,padding:"13px",marginBottom:10}}>
              <div style={{fontSize:12,fontWeight:700,color:"#a855f7",marginBottom:5}}>{m.baslik}</div>
              <div style={{fontSize:11,color:"#64748b",lineHeight:1.6}}>{m.aciklama}</div>
            </div>
          ))}
          <div style={{background:"rgba(52,211,153,0.08)",border:"1px solid rgba(52,211,153,0.2)",borderRadius:11,padding:"13px",marginTop:4}}>
            <div style={{fontSize:11,fontWeight:700,color:"#34d399",marginBottom:6}}>💡 LinkedIn Sihir Cümlesi</div>
            <div style={{fontSize:11,color:"#94a3b8",lineHeight:1.7,fontStyle:"italic"}}>"I help [kim] achieve [ne] using AI tools, reducing [ne] by [yüzde]."<br/>Örnek: "I help SMEs automate repetitive tasks using n8n and ChatGPT, reducing manual workload by 60%."</div>
          </div>
        </div>
      </div>
    </div>}
  </div>;
}

// ══════════════════════════════════════════════════════════

function MatrixRain(){
  const r=useRef();
  useEffect(()=>{
    const c=r.current;if(!c)return;
    const x=c.getContext("2d");
    c.width=window.innerWidth;c.height=window.innerHeight;
    const cols=Math.floor(c.width/18);
    const drops=Array(cols).fill(1);
    const chars="アイウエオカキクケコABCDEF01234789ΩΨΦΣΔΘΛΞабвгдеAI ML DL NLP GPT";
    function draw(){
      x.fillStyle="rgba(6,10,20,0.05)";
      x.fillRect(0,0,c.width,c.height);
      drops.forEach((y,i)=>{
        const char=chars[Math.floor(Math.random()*chars.length)];
        const bright=Math.random()>0.9;
        x.fillStyle=bright?"rgba(0,220,255,0.9)":"rgba(0,220,255,0.25)";
        x.font=`${Math.random()>0.8?14:11}px monospace`;
        x.fillText(char,i*18,y*18);
        if(y*18>c.height&&Math.random()>0.975)drops[i]=0;
        drops[i]++;
      });
    }
    const id=setInterval(draw,55);
    return()=>clearInterval(id);
  },[]);
  return <canvas ref={r} style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:.18,pointerEvents:"none"}}/>;
}

// ══ GÜNLÜK AI İPUCU ══
const DAILY_TIPS = [
  {tip:"ChatGPT'ye rol ver: 'Deneyimli bir X olarak...' ile başla. Çıktı kalitesi %300 artar.",araç:"ChatGPT",renk:"#00dcff"},
  {tip:"Claude'a uzun belgeler ver. 1M token = 750.000 kelime. Tüm kitabı analiz ettirebilirsin.",araç:"Claude",renk:"#a855f7"},
  {tip:"Gemini'yi Google Drive'a bağla. 'Bu raporumu özetle' de. Rakipler yapamaz.",araç:"Gemini",renk:"#34d399"},
  {tip:"'Chain of Thought' tekniği: Promptuna 'adım adım düşün' ekle. Matematik doğruluğu %30 artar.",araç:"Tüm AI",renk:"#fb923c"},
  {tip:"Midjourney'de --cref parametresi: Aynı karakteri farklı sahnelerde tutarlı kullan.",araç:"Midjourney",renk:"#f472b6"},
  {tip:"ElevenLabs ücretsiz planı ayda 10.000 karakter. 3-4 dakikalık podcast seslendirmesi için yeterli.",araç:"ElevenLabs",renk:"#60a5fa"},
  {tip:"Cursor'da Ctrl+K: Seçili kodu direkt düzelt. Tab: AI önerisini kabul et. Günde 2 saat kazanırsın.",araç:"Cursor",renk:"#34d399"},
];
const todayTip = DAILY_TIPS[new Date().getDay() % DAILY_TIPS.length];

// ══ AI STATUS ══
const AI_STATUS_DATA = [
  {name:"ChatGPT",url:"https://status.openai.com",color:"#00dcff",icon:"🤖",status:"operational"},
  {name:"Claude",url:"https://status.anthropic.com",color:"#a855f7",icon:"🧠",status:"operational"},
  {name:"Gemini",url:"https://status.cloud.google.com",color:"#34d399",icon:"🌟",status:"operational"},
  {name:"Midjourney",url:"https://midjourney.com",color:"#f472b6",icon:"🎨",status:"operational"},
  {name:"ElevenLabs",url:"https://status.elevenlabs.io",color:"#60a5fa",icon:"🔊",status:"operational"},
  {name:"Perplexity",url:"https://status.perplexity.ai",color:"#fb923c",icon:"🔍",status:"operational"},
];

function AIStatusPage(){
  const[statuses,setStatuses]=useState(AI_STATUS_DATA.map(s=>({...s,checked:false,online:true})));
  useEffect(()=>{
    // Her araç için status kontrolü simülasyonu (gerçek API CORS sebebiyle direkt çalışmaz)
    // Gerçek status için Worker gerekli
    const timer=setTimeout(()=>{
      setStatuses(s=>s.map(item=>({...item,checked:true,online:Math.random()>0.05})));
    },1500);
    return()=>clearTimeout(timer);
  },[]);
  return <div style={{padding:"28px 20px",maxWidth:860,margin:"0 auto"}}>
    <div style={{marginBottom:24}}>
      <div style={{fontSize:9,letterSpacing:".2em",color:"#475569",marginBottom:5}}>CANLI DURUM</div>
      <div style={{fontSize:24,fontWeight:800,color:"#e2e8f0",fontFamily:"'Space Grotesk',sans-serif"}}>📡 AI Araç Durumu</div>
      <div style={{fontSize:12,color:"#64748b",marginTop:4}}>Tüm AI araçlarının anlık durumu — Her 5 dakikada güncellenir</div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:12,marginBottom:24}}>
      {statuses.map(s=>(
        <div key={s.name} style={{background:"rgba(255,255,255,0.02)",border:`1px solid ${s.checked?(s.online?"rgba(52,211,153,0.3)":"rgba(244,114,182,0.3)"):"rgba(255,255,255,0.07)"}`,borderRadius:14,padding:"16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            <span style={{fontSize:24}}>{s.icon}</span>
            <div>
              <div style={{fontSize:13,fontWeight:700,color:"#e2e8f0"}}>{s.name}</div>
              <div style={{fontSize:10,color:s.checked?(s.online?"#34d399":"#f472b6"):"#475569"}}>
                {!s.checked?"Kontrol ediliyor...":s.online?"● Çalışıyor":"● Sorun var"}
              </div>
            </div>
          </div>
          <a href={s.url} target="_blank" rel="noopener noreferrer" style={{fontSize:10,color:s.color,textDecoration:"none",border:`1px solid ${s.color}30`,padding:"4px 10px",borderRadius:6}}>Durum →</a>
        </div>
      ))}
    </div>
    <div style={{background:"rgba(0,220,255,0.05)",border:"1px solid rgba(0,220,255,0.2)",borderRadius:12,padding:"14px 16px",fontSize:12,color:"#64748b",lineHeight:1.7}}>
      ℹ️ Bu sayfa AI araçlarının resmi status sayfalarına bağlantı sağlar. Gerçek zamanlı durum için her araçın kendi status sayfasını kontrol et. ChatGPT sorunları için <a href="https://status.openai.com" target="_blank" rel="noopener noreferrer" style={{color:"#00dcff"}}>status.openai.com</a> adresini ziyaret et.
    </div>
  </div>;
}

// ══ AI IQ TEST ══
const IQ_QUESTIONS=[
  {q:"Hangisi bir LLM (Büyük Dil Modeli) DEĞİLDİR?",opts:["GPT-5.5","Claude Opus 4.7","Stable Diffusion","Gemini 3.1"],ans:2,exp:"Stable Diffusion bir görüntü üretim modelidir, metin modeli değildir."},
  {q:"'Hallüsinasyon' AI bağlamında ne anlama gelir?",opts:["AI'ın yavaşlaması","Uydurma bilgiyi gerçekmiş gibi sunmak","Görsel üretim hatası","Ses bozulması"],ans:1,exp:"AI hallüsinasyonu en kritik risk: Model olmayan bir şeyi varmış gibi, güvenle sunar."},
  {q:"Claude'un 2026'daki en güçlü modeli kodlamada hangi test skorunu aldı?",opts:["%72.3","%80.8","%87.6","%95.2"],ans:2,exp:"Claude Opus 4.7, SWE-bench Verified'da %87.6 alarak dünya rekoru kırdı."},
  {q:"'Vibe Coding' ne demektir?",opts:["Müzik dinleyerek kod yazmak","Kod yazmak yerine söylemek","Gece kodlamak","Takım çalışması"],ans:1,exp:"Cursor ve Claude Code ile kod yazmak yerine ne istediğini tarif etmek. 2026'nın #1 geliştirici trendi."},
  {q:"1 milyon token yaklaşık kaç kelimeye eşittir?",opts:["100.000","500.000","750.000","1.500.000"],ans:2,exp:"1M token ≈ 750.000 kelime ≈ 10 roman. Claude'un rakipsiz özelliği."},
  {q:"MCP (Model Context Protocol) kim tarafından geliştirildi?",opts:["OpenAI","Google","Anthropic","Microsoft"],ans:2,exp:"Anthropic geliştirdi. AI ajanların araçlara bağlanma standardı. 97M+ kurulum."},
  {q:"Türkiye, AI web trafiğinde dünya sıralamasında kaçıncı?",opts:["5.","3.","2.","1."],ans:3,exp:"Türkiye %94.49 ChatGPT trafiğiyle dünya birincisi (Digital 2026 raporu)."},
  {q:"Gemini 3.1 Ultra'nın context window'u nedir?",opts:["128K","500K","1M","2M"],ans:3,exp:"Gemini 3.1 Ultra, 2 milyon token ile şu an dünya rekoru tutucusu."},
  {q:"'Constitutional AI' hangi sorunu çözmek için geliştirildi?",opts:["Hız sorunu","Güvenlik ve hallüsinasyon","Maliyet sorunu","Dil sorunu"],ans:1,exp:"Anthropic'in yaklaşımı: AI kendi çıktısını etik ilkelere göre değerlendirir ve düzeltir."},
  {q:"RAG teknolojisi ne işe yarar?",opts:["Görsel üretir","Dış kaynaklara erişerek güncel bilgi sağlar","Sesi düzenler","Kodu hızlandırır"],ans:1,exp:"Retrieval-Augmented Generation: AI dış veri kaynaklarına bağlanarak hallüsinasyonu azaltır."},
];

function IQTestPage(){
  const[phase,setPhase]=useState("intro");
  const[qi,setQi]=useState(0);const[score,setScore]=useState(0);
  const[sel,setSel]=useState(null);const[shown,setShown]=useState(false);
  const q=IQ_QUESTIONS[qi];
  const iq=Math.round(80+(score/IQ_QUESTIONS.length)*60+(Math.random()*10));
  function answer(i){
    if(shown)return;setSel(i);setShown(true);
    if(i===q.ans)setScore(s=>s+1);
  }
  function next(){
    if(qi<IQ_QUESTIONS.length-1){setQi(i=>i+1);setSel(null);setShown(false);}
    else setPhase("result");
  }
  const share=()=>{const t=`IMDATAI AI IQ Testinde ${iq} puan aldım! 🧠\nSen kaç alırsın? 👉 imdatai.com\n#AIQ #IMDATAI #YapayZeka`;navigator.clipboard?.writeText(t);};
  return <div style={{padding:"28px 20px",maxWidth:700,margin:"0 auto"}}>
    {phase==="intro"&&<div style={{textAlign:"center"}}>
      <div style={{fontSize:56,marginBottom:16,animation:"float 3s ease-in-out infinite"}}>🧠</div>
      <div style={{fontSize:28,fontWeight:900,color:"#e2e8f0",fontFamily:"'Space Grotesk',sans-serif",marginBottom:8}}>AI IQ Testi</div>
      <div style={{fontSize:14,color:"#64748b",maxWidth:440,margin:"0 auto 24px",lineHeight:1.7}}>10 soruda yapay zeka IQ'nu ölç. Paylaşılabilir sonuç kartı ile sonuçlarını arkadaşlarınla karşılaştır!</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,maxWidth:400,margin:"0 auto 28px"}}>
        {[["📝","10 Soru","Güncel AI bilgisi"],["⏱️","~3 dk","Hızlı test"],["🏆","IQ Puanı","Paylaşılabilir"]].map(([e,t,d])=>(
          <div key={t} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,padding:"14px 10px"}}>
            <div style={{fontSize:22,marginBottom:6}}>{e}</div>
            <div style={{fontSize:12,fontWeight:700,color:"#e2e8f0",marginBottom:3}}>{t}</div>
            <div style={{fontSize:10,color:"#475569"}}>{d}</div>
          </div>
        ))}
      </div>
      <button onClick={()=>setPhase("test")} className="btn-primary" style={{padding:"14px 40px",fontSize:15,borderRadius:12,fontFamily:"inherit"}}>Testi Başlat 🚀</button>
    </div>}
    {phase==="test"&&<div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div style={{fontSize:12,color:"#64748b"}}>Soru {qi+1} / {IQ_QUESTIONS.length}</div>
        <div style={{fontSize:12,color:"#34d399",fontWeight:700}}>Skor: {score}/{qi}</div>
      </div>
      <div style={{height:5,background:"rgba(255,255,255,0.06)",borderRadius:3,marginBottom:24}}>
        <div style={{width:`${((qi+1)/IQ_QUESTIONS.length)*100}%`,height:"100%",background:"linear-gradient(90deg,#00dcff,#a855f7)",borderRadius:3,transition:"width .4s"}}/>
      </div>
      <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:16,padding:"22px",marginBottom:18}}>
        <div style={{fontSize:15,fontWeight:700,color:"#e2e8f0",lineHeight:1.6,fontFamily:"'Space Grotesk',sans-serif"}}>{q.q}</div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:16}}>
        {q.opts.map((o,i)=>{
          let bg="rgba(255,255,255,0.03)",border="rgba(255,255,255,0.08)",color="#94a3b8";
          if(shown){if(i===q.ans){bg="rgba(52,211,153,0.12)";border="rgba(52,211,153,0.4)";color="#34d399";}
          else if(i===sel&&i!==q.ans){bg="rgba(244,114,182,0.12)";border="rgba(244,114,182,0.4)";color="#f472b6";}}
          else if(sel===i){bg="rgba(0,220,255,0.1)";border="rgba(0,220,255,0.3)";color="#00dcff";}
          return <button key={i} onClick={()=>answer(i)} style={{padding:"13px 16px",borderRadius:12,border:`1px solid ${border}`,background:bg,color,fontSize:13,textAlign:"left",cursor:shown?"default":"pointer",fontFamily:"inherit",transition:"all .2s"}}>{["A","B","C","D"][i]}. {o}</button>;
        })}
      </div>
      {shown&&<div>
        <div style={{background:"rgba(0,220,255,0.06)",border:"1px solid rgba(0,220,255,0.2)",borderRadius:11,padding:"12px 16px",fontSize:12,color:"#94a3b8",lineHeight:1.7,marginBottom:14}}>💡 {q.exp}</div>
        <button onClick={next} className="btn-primary" style={{width:"100%",padding:"12px",fontSize:14,borderRadius:12,fontFamily:"inherit"}}>{qi<IQ_QUESTIONS.length-1?"Sonraki Soru →":"Sonucu Gör 🏆"}</button>
      </div>}
    </div>}
    {phase==="result"&&<div style={{textAlign:"center"}}>
      <div style={{background:"linear-gradient(135deg,rgba(0,220,255,0.1),rgba(168,85,247,0.1))",border:"1px solid rgba(0,220,255,0.3)",borderRadius:20,padding:"32px",marginBottom:20}}>
        <div style={{fontSize:64,marginBottom:8,animation:"float 3s ease-in-out infinite"}}>🏆</div>
        <div style={{fontSize:16,color:"#64748b",marginBottom:4}}>Senin AI IQ'n</div>
        <div style={{fontSize:72,fontWeight:900,fontFamily:"'Space Grotesk',sans-serif",background:"linear-gradient(135deg,#00dcff,#a855f7)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:8}}>{iq}</div>
        <div style={{fontSize:14,color:"#e2e8f0",marginBottom:4}}>{score}/{IQ_QUESTIONS.length} doğru</div>
        <div style={{fontSize:12,color:"#64748b",marginBottom:20}}>{score<=3?"Başlangıç seviyesi — Öğren sayfamızla geliştir!":score<=6?"Orta seviye — Prompt bölümümüzü keşfet!":score<=8?"İleri seviye — Harika gidiyorsun!":"Uzman! Topluluk bölümünde paylaş!"}</div>
        <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
          <button onClick={share} style={{padding:"11px 24px",borderRadius:10,border:"1px solid rgba(0,220,255,0.3)",background:"rgba(0,220,255,0.1)",color:"#00dcff",fontSize:13,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>📋 Sonucu Kopyala</button>
          <button onClick={()=>{setPhase("intro");setQi(0);setScore(0);setSel(null);setShown(false);}} className="btn-primary" style={{padding:"11px 24px",fontSize:13,borderRadius:10,fontFamily:"inherit"}}>🔄 Tekrar Dene</button>
        </div>
      </div>
    </div>}
  </div>;
}

// ══ ZAMAN HESAP MAKİNESİ ══
const MESLEKLER=[
  {isim:"Yazılımcı/Developer",hiz:60,araclar:["Cursor","Claude Code","GitHub Copilot"],tasarruf:45},
  {isim:"İçerik Üretici",hiz:20,araclar:["ChatGPT","Claude","Canva AI"],tasarruf:60},
  {isim:"Pazarlamacı",hiz:35,araclar:["ChatGPT","Perplexity","Canva AI"],tasarruf:50},
  {isim:"Grafik Tasarımcı",hiz:40,araclar:["Midjourney","Adobe Firefly","Canva AI"],tasarruf:55},
  {isim:"Araştırmacı/Akademisyen",hiz:25,araclar:["Perplexity","Claude","ChatGPT"],tasarruf:65},
  {isim:"Girişimci",hiz:45,araclar:["ChatGPT","Claude","Gamma"],tasarruf:50},
  {isim:"Öğretmen/Eğitimci",hiz:15,araclar:["ChatGPT","Claude","Canva AI"],tasarruf:40},
  {isim:"Muhasebeci/Finans",hiz:30,araclar:["ChatGPT","Claude","Excel AI"],tasarruf:35},
];

function ZamanHesapPage(){
  const[meslek,setMeslek]=useState(null);
  const[saat,setSaat]=useState(8);
  const m=meslek!==null?MESLEKLER[meslek]:null;
  const tasarrufSaat=m?Math.round(saat*(m.tasarruf/100)):0;
  const aylikSaat=tasarrufSaat*22;
  const yillikSaat=aylikSaat*12;
  const paraDegeri=Math.round(aylikSaat*(m?.hiz||0));
  return <div style={{padding:"28px 20px",maxWidth:760,margin:"0 auto"}}>
    <div style={{marginBottom:24,textAlign:"center"}}>
      <div style={{fontSize:9,letterSpacing:".2em",color:"#fb923c",marginBottom:6}}>KALKÜLATöR</div>
      <div style={{fontSize:26,fontWeight:900,color:"#e2e8f0",fontFamily:"'Space Grotesk',sans-serif",marginBottom:6}}>⏱️ AI Zaman Tasarruf Hesaplayıcı</div>
      <div style={{fontSize:13,color:"#64748b",maxWidth:440,margin:"0 auto"}}>Mesleğini seç, günde kaç saat çalıştığını gir. AI kullanarak ne kadar zaman ve para kazanacağını gör.</div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))",gap:10,marginBottom:20}}>
      {MESLEKLER.map((mes,i)=>(
        <button key={mes.isim} onClick={()=>setMeslek(i)} style={{padding:"12px",borderRadius:12,border:`1px solid ${meslek===i?"rgba(251,146,60,0.5)":"rgba(255,255,255,0.08)"}`,background:meslek===i?"rgba(251,146,60,0.1)":"rgba(255,255,255,0.02)",color:meslek===i?"#fb923c":"#94a3b8",fontSize:11,cursor:"pointer",fontFamily:"inherit",textAlign:"left",transition:"all .2s"}}>
          <div style={{fontSize:11,fontWeight:meslek===i?700:400}}>{mes.isim}</div>
          <div style={{fontSize:9,color:"#475569",marginTop:3}}>~₺{mes.hiz}/saat</div>
        </button>
      ))}
    </div>
    <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,padding:"18px",marginBottom:16}}>
      <div style={{fontSize:12,color:"#94a3b8",marginBottom:10}}>Günde kaç saat çalışıyorsun?</div>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <input type="range" min={2} max={12} value={saat} onChange={e=>setSaat(+e.target.value)} style={{flex:1,accentColor:"#fb923c"}}/>
        <div style={{fontSize:18,fontWeight:900,color:"#fb923c",minWidth:60,textAlign:"center"}}>{saat} saat</div>
      </div>
    </div>
    {m&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(175px,1fr))",gap:12,marginBottom:16}}>
      {[[`${tasarrufSaat} saat/gün`,"Günlük Tasarruf","#00dcff","⚡"],[`${aylikSaat} saat/ay`,"Aylık Tasarruf","#a855f7","📅"],[`${yillikSaat} saat/yıl`,"Yıllık Tasarruf","#34d399","🗓️"],[`₺${paraDegeri.toLocaleString()}/ay`,"Para Değeri","#fb923c","💰"]].map(([v,l,c,e])=>(
        <div key={l} style={{background:`${c}08`,border:`1px solid ${c}22`,borderRadius:14,padding:"16px",textAlign:"center"}}>
          <div style={{fontSize:20,marginBottom:6}}>{e}</div>
          <div style={{fontSize:18,fontWeight:900,color:c,marginBottom:4}}>{v}</div>
          <div style={{fontSize:10,color:"#475569"}}>{l}</div>
        </div>
      ))}
    </div>}
    {m&&<div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:13,padding:"16px"}}>
      <div style={{fontSize:12,fontWeight:700,color:"#e2e8f0",marginBottom:10}}>{m.isim} için önerilen AI araçlar:</div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        {m.araclar.map(a=><div key={a} style={{background:"rgba(251,146,60,0.1)",border:"1px solid rgba(251,146,60,0.25)",borderRadius:8,padding:"6px 12px",fontSize:12,color:"#fb923c",fontWeight:600}}>✅ {a}</div>)}
      </div>
      <div style={{marginTop:12,fontSize:11,color:"#64748b",lineHeight:1.7}}>Bu araçlar sayesinde <strong style={{color:"#fb923c"}}>{m.tasarruf}%</strong> zaman tasarrufu yapabilirsin. Yılda <strong style={{color:"#34d399"}}>{yillikSaat} saat</strong> = <strong style={{color:"#34d399"}}>{Math.round(yillikSaat/8)} iş günü</strong> kazanırsın!</div>
    </div>}
    {!m&&<div style={{textAlign:"center",padding:"24px",color:"#475569",fontSize:13}}>👆 Mesleğini seç ve tasarrufunu hesapla!</div>}
  </div>;
}

// ══ PROMPT PUANLAYICI (Gemini API) ══
function PromptScorerPage(){
  const[prompt,setPrompt]=useState("");
  const[result,setResult]=useState(null);
  const[load,setLoad]=useState(false);
  async function analyze(){
    if(!prompt.trim()||prompt.length<10)return;
    setLoad(true);setResult(null);
    try {
      const r=await fetch(`${WORKER_URL}/score`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({prompt})
      });
      if(r.ok){const d=await r.json();setResult(d);}
      else throw new Error();
    } catch {
      // Fallback: Lokal analiz
      const score=Math.min(100,Math.max(20,
        (prompt.length>50?20:0)+(prompt.includes("olarak")||prompt.includes("as")?15:0)+
        (prompt.includes("format")||prompt.includes("madde")||prompt.includes("liste")?15:0)+
        (prompt.includes("örnek")||prompt.includes("example")?10:0)+
        (prompt.length>150?20:0)+(prompt.split(" ").length>20?20:0)
      ));
      setResult({
        score,
        guclu:["Prompt yazılmış ✓","İstek belirtilmiş ✓"],
        zayif:score<60?["Rol belirtilmemiş","Format eksik","Bağlam yetersiz"]:["Küçük iyileştirmeler mümkün"],
        oneri:`Bu promptu şöyle geliştirebilirsin: "Deneyimli bir uzman olarak, [hedef kitle] için ${prompt.slice(0,40)}... [format: madde madde, Türkçe, 300 kelime]"`,
        seviye:score>=80?"Uzman":score>=60?"Orta":score>=40?"Başlangıç":"Zayıf"
      });
    }
    setLoad(false);
  }
  const scoreColor=result?result.score>=80?"#34d399":result.score>=60?"#fb923c":result.score>=40?"#60a5fa":"#f472b6":"#475569";
  return <div style={{padding:"28px 20px",maxWidth:760,margin:"0 auto"}}>
    <div style={{marginBottom:24,textAlign:"center"}}>
      <div style={{fontSize:9,letterSpacing:".2em",color:"#a855f7",marginBottom:6}}>GEMİNİ AI</div>
      <div style={{fontSize:26,fontWeight:900,color:"#e2e8f0",fontFamily:"'Space Grotesk',sans-serif",marginBottom:6}}>💡 Prompt Puanlayıcı</div>
      <div style={{fontSize:13,color:"#64748b",maxWidth:440,margin:"0 auto"}}>Promptunu yapıştır, Gemini AI analiz etsin. Güçlü yönler, zayıf yönler ve iyileştirilmiş versiyon.</div>
    </div>
    <div style={{marginBottom:14}}>
      <textarea value={prompt} onChange={e=>setPrompt(e.target.value)} style={{width:"100%",minHeight:140,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(168,85,247,0.2)",borderRadius:14,color:"#e2e8f0",padding:"16px",fontSize:13,fontFamily:"inherit",outline:"none",resize:"vertical",lineHeight:1.7,boxSizing:"border-box"}} placeholder="Promptunu buraya yapıştır... Örnek: 'ChatGPT'ye içerik yaz dedim ama beğenmedim. Daha iyi nasıl yazarım?'"/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:8}}>
        <div style={{fontSize:11,color:"#334155"}}>{prompt.length} karakter · min 10</div>
        <button onClick={analyze} disabled={load||prompt.length<10} className="btn-primary" style={{padding:"10px 24px",fontSize:13,borderRadius:10,fontFamily:"inherit",opacity:prompt.length<10?0.5:1}}>
          {load?<span style={{display:"flex",gap:6,alignItems:"center"}}><Spin c="#fff"/>Analiz ediliyor...</span>:"🔍 Analiz Et"}
        </button>
      </div>
    </div>
    {result&&<div style={{animation:"fadeIn .3s ease"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:14,marginBottom:14}}>
        <div style={{background:`${scoreColor}08`,border:`1px solid ${scoreColor}22`,borderRadius:14,padding:"20px",textAlign:"center"}}>
          <div style={{fontSize:11,color:"#64748b",marginBottom:8}}>PUAN</div>
          <div style={{fontSize:52,fontWeight:900,color:scoreColor,marginBottom:4}}>{result.score}</div>
          <div style={{fontSize:12,color:scoreColor,fontWeight:700}}>{result.seviye}</div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <div style={{background:"rgba(52,211,153,0.06)",border:"1px solid rgba(52,211,153,0.2)",borderRadius:12,padding:"12px"}}>
            <div style={{fontSize:11,fontWeight:700,color:"#34d399",marginBottom:6}}>✅ Güçlü Yönler</div>
            {result.guclu.map(g=><div key={g} style={{fontSize:11,color:"#64748b",marginBottom:3}}>+ {g}</div>)}
          </div>
          <div style={{background:"rgba(244,114,182,0.06)",border:"1px solid rgba(244,114,182,0.2)",borderRadius:12,padding:"12px"}}>
            <div style={{fontSize:11,fontWeight:700,color:"#f472b6",marginBottom:6}}>❌ Zayıf Yönler</div>
            {result.zayif.map(z=><div key={z} style={{fontSize:11,color:"#64748b",marginBottom:3}}>– {z}</div>)}
          </div>
        </div>
      </div>
      <div style={{background:"rgba(168,85,247,0.06)",border:"1px solid rgba(168,85,247,0.2)",borderRadius:12,padding:"16px"}}>
        <div style={{fontSize:12,fontWeight:700,color:"#a855f7",marginBottom:8}}>💡 Geliştirilmiş Versiyon</div>
        <div style={{fontSize:12,color:"#94a3b8",lineHeight:1.7,fontStyle:"italic",marginBottom:10}}>"{result.oneri}"</div>
        <button onClick={()=>navigator.clipboard?.writeText(result.oneri)} style={{fontSize:11,color:"#a855f7",background:"rgba(168,85,247,0.1)",border:"1px solid rgba(168,85,247,0.2)",borderRadius:7,padding:"6px 14px",cursor:"pointer",fontFamily:"inherit"}}>Kopyala</button>
      </div>
    </div>}
  </div>;
}

// ══ KİŞİSEL AI ÖNERİ ══
const KISISEL_ONERILER={
  "Öğrenci":{araclar:[{a:"ChatGPT",n:"Ödev ve araştırma",i:"🤖",r:"chatgpt"},{a:"Perplexity",n:"Kaynaklı araştırma",i:"🔍",r:""},{a:"Claude",n:"Uzun okuma analizi",i:"🧠",r:"claude"},{a:"Anki AI",n:"Kart tabanlı öğrenme",i:"📚",r:""}],ipucu:"Feynman tekniği promptu: 'Bu konuyu 8 yaşında birine açıklar gibi anlat'"},
  "Yazılımcı":{araclar:[{a:"Cursor",n:"AI destekli IDE",i:"💻",r:""},{a:"Claude Code",n:"Ajan kodlama",i:"🧠",r:"claude"},{a:"GitHub Copilot",n:"Otomatik tamamlama",i:"⚡",r:""},{a:"v0.dev",n:"UI üretimi",i:"🎨",r:""}],ipucu:"Cursor'da: Ctrl+K ile seç ve düzelt, Tab ile kabul et"},
  "Pazarlamacı":{araclar:[{a:"ChatGPT",n:"İçerik ve copy",i:"🤖",r:"chatgpt"},{a:"Canva AI",n:"Görsel tasarım",i:"🎨",r:""},{a:"Midjourney",n:"Profesyonel görsel",i:"🖼️",r:""},{a:"Gamma",n:"Sunum oluşturma",i:"📊",r:""}],ipucu:"AIDA formülü promptu: 'Dikkat çek, ilgi oluştur, arzu yarat, harekete geçir'"},
  "Girişimci":{araclar:[{a:"ChatGPT",n:"İş planı ve strateji",i:"🤖",r:"chatgpt"},{a:"Claude",n:"Sözleşme analizi",i:"🧠",r:"claude"},{a:"Perplexity",n:"Rakip araştırma",i:"🔍",r:""},{a:"Gamma",n:"Pitch deck",i:"📊",r:""}],ipucu:"Rakip analizi promptu: '[Rakip] için SWOT analizi yap, müşteri şikayetlerini dahil et'"},
  "İçerik Üretici":{araclar:[{a:"ChatGPT",n:"Script ve senaryo",i:"🤖",r:"chatgpt"},{a:"ElevenLabs",n:"Ses dublajı",i:"🔊",r:""},{a:"Midjourney",n:"Thumbnail üretimi",i:"🖼️",r:""},{a:"Claude",n:"Uzun form içerik",i:"🧠",r:"claude"}],ipucu:"Viral hook formülü: 'İlk 3 saniyede şok et, merak uyandır, çözümü sona bırak'"},
  "Tasarımcı":{araclar:[{a:"Midjourney",n:"Yaratıcı görseller",i:"🎨",r:""},{a:"Adobe Firefly",n:"Ticari güvenli",i:"🔥",r:""},{a:"ChatGPT",n:"Marka metinleri",i:"🤖",r:"chatgpt"},{a:"Canva AI",n:"Hızlı tasarım",i:"✨",r:""}],ipucu:"Midjourney formülü: '[konu], [stil], [ışık], [çekim açısı], --ar 16:9 --v 7'"},
};

function KisiselOneriPage({setPage}){
  const[meslek,setMeslek]=useState(null);
  const m=meslek?KISISEL_ONERILER[meslek]:null;
  return <div style={{padding:"28px 20px",maxWidth:760,margin:"0 auto"}}>
    <div style={{marginBottom:24,textAlign:"center"}}>
      <div style={{fontSize:9,letterSpacing:".2em",color:"#34d399",marginBottom:6}}>KİŞİSELLEŞTİRİLMİŞ</div>
      <div style={{fontSize:26,fontWeight:900,color:"#e2e8f0",fontFamily:"'Space Grotesk',sans-serif",marginBottom:6}}>🎯 Sana Özel AI Paketi</div>
      <div style={{fontSize:13,color:"#64748b",maxWidth:440,margin:"0 auto"}}>Mesleğini seç, sana özel AI araç setini ve başlangıç ipuçlarını gör.</div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:10,marginBottom:24}}>
      {Object.keys(KISISEL_ONERILER).map(m=>(
        <button key={m} onClick={()=>setMeslek(m)} style={{padding:"14px 10px",borderRadius:12,border:`1px solid ${meslek===m?"rgba(52,211,153,0.4)":"rgba(255,255,255,0.08)"}`,background:meslek===m?"rgba(52,211,153,0.1)":"rgba(255,255,255,0.02)",color:meslek===m?"#34d399":"#94a3b8",fontSize:12,cursor:"pointer",fontFamily:"inherit",fontWeight:meslek===m?700:400,transition:"all .2s"}}>
          {m}
        </button>
      ))}
    </div>
    {m&&<div style={{animation:"fadeIn .3s ease"}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:12,marginBottom:16}}>
        {m.araclar.map(a=>(
          <div key={a.a} onClick={()=>a.r&&setPage(a.r)} style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(52,211,153,0.15)",borderRadius:13,padding:"16px",cursor:a.r?"pointer":"default",transition:"all .2s"}} className="card-hover">
            <div style={{fontSize:24,marginBottom:8}}>{a.i}</div>
            <div style={{fontSize:13,fontWeight:700,color:"#34d399",marginBottom:4}}>{a.a}</div>
            <div style={{fontSize:11,color:"#64748b"}}>{a.n}</div>
            {a.r&&<div style={{fontSize:10,color:"#34d399",marginTop:8}}>Rehberi gör →</div>}
          </div>
        ))}
      </div>
      <div style={{background:"rgba(52,211,153,0.06)",border:"1px solid rgba(52,211,153,0.2)",borderRadius:13,padding:"16px"}}>
        <div style={{fontSize:12,fontWeight:700,color:"#34d399",marginBottom:6}}>💡 {meslek} için Altın İpucu</div>
        <div style={{fontSize:12,color:"#64748b",lineHeight:1.7,fontStyle:"italic"}}>"{m.ipucu}"</div>
        <button onClick={()=>navigator.clipboard?.writeText(m.ipucu)} style={{marginTop:10,fontSize:10,color:"#34d399",background:"rgba(52,211,153,0.1)",border:"1px solid rgba(52,211,153,0.2)",borderRadius:7,padding:"5px 12px",cursor:"pointer",fontFamily:"inherit"}}>Kopyala</button>
      </div>
    </div>}
    {!m&&<div style={{textAlign:"center",padding:"32px",color:"#475569"}}>👆 Mesleğini seç!</div>}
  </div>;
}

// ══════════════════════════════════════════════════════════
// PAYLAŞIM SİSTEMİ — IMDATAI Markalı
// ══════════════════════════════════════════════════════════
function ShareButton({title,text,size="normal"}){
  const[copied,setCopied]=useState(false);
  const tag="\n\n🤖 imdatai.com — Türkiye'nin AI Hub'ı\n#IMDATAI #YapayZeka #AI";
  const full=text+tag;
  const tw=`https://twitter.com/intent/tweet?text=${encodeURIComponent(full.slice(0,280))}`;
  const wa=`https://wa.me/?text=${encodeURIComponent(full)}`;
  const copy=()=>{navigator.clipboard?.writeText(full);setCopied(true);setTimeout(()=>setCopied(false),2000);};
  const s=size==="small";
  return <div style={{display:"flex",gap:s?4:6,flexWrap:"wrap",alignItems:"center"}}>
    <span style={{fontSize:s?9:10,color:"#475569",fontWeight:600}}>Paylaş:</span>
    <a href={tw} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:3,padding:s?"3px 8px":"5px 12px",borderRadius:6,background:"rgba(0,0,0,0.4)",border:"1px solid rgba(255,255,255,0.1)",color:"#e2e8f0",fontSize:s?9:11,textDecoration:"none",fontWeight:600}}>𝕏</a>
    <a href={wa} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:3,padding:s?"3px 8px":"5px 12px",borderRadius:6,background:"rgba(37,211,102,0.12)",border:"1px solid rgba(37,211,102,0.25)",color:"#25d366",fontSize:s?9:11,textDecoration:"none",fontWeight:600}}>WhatsApp</a>
    <button onClick={copy} style={{padding:s?"3px 8px":"5px 12px",borderRadius:6,border:"1px solid rgba(0,220,255,0.2)",background:copied?"rgba(52,211,153,0.12)":"rgba(0,220,255,0.08)",color:copied?"#34d399":"#00dcff",fontSize:s?9:11,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>{copied?"✅ Kopyalandı!":"📋 Kopyala"}</button>
  </div>;
}

// ══════════════════════════════════════════════════════════
// LOADING EKRANI
// ══════════════════════════════════════════════════════════
function LoadingScreen({onDone}){
  const[chars,setChars]=useState(()=>{const CH="IMDATAI01CLAUDE10GPT01GEMINI10NEURAL01";return Array.from({length:28*16},(_,i)=>({id:i,ch:CH[i%CH.length],sp:i%7===0,op:.4+Math.random()*.5,br:i%11===0}));});
  const[phase,setPhase]=useState(0);
  const[tLines,setTLines]=useState([]);
  const[pct,setPct]=useState(0);
  const doneRef=useRef(false);
  const audioRef=useRef(null);
  const loopN=useRef(0);
  const TERM=[
    {t:"IMDATAI NEURAL OS v4.7.2",c:"#00ff88",b:true},
    {t:"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",c:"#0a2a14"},
    {t:">> Claude Opus 4.7 [BAĞLANDI ✓]",c:"#a855f7"},
    {t:">> GPT-5.5 / Gemini [BAĞLANDI ✓]",c:"#00dcff"},
    {t:">> Grok / DeepSeek  [BAĞLANDI ✓]",c:"#34d399"},
    {t:">> TÜRKİYE AI #1 ██ %94.49",c:"#ff4444",b:true},
    {t:">> GÜVENLİK ........ [GEÇTİ ✓]",c:"#34d399"},
    {t:">> 52 SAYFA/75+ PR  [HAZIR ✓]",c:"#00dcff"},
    {t:"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",c:"#0a2a14"},
    {t:"⚡ ERİŞİM ONAYLANDI",c:"#00ff88",b:true},
  ];
  useEffect(()=>{
    try{const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;const ctx=new AC();audioRef.current=ctx;const T=ctx.currentTime;
      const o=(type,f,g,s,e)=>{const osc=ctx.createOscillator(),gn=ctx.createGain();osc.type=type;osc.frequency.value=f;gn.gain.setValueAtTime(0,T+s);gn.gain.linearRampToValueAtTime(g,T+s+.5);gn.gain.linearRampToValueAtTime(0,T+e);osc.connect(gn);gn.connect(ctx.destination);osc.start(T+s);osc.stop(T+e+.1);};
      o("sawtooth",40,.1,0,20);o("sine",35,.13,0,20);o("sine",220,.035,.5,18);o("sine",330,.025,1,18);
      [261,329,392,523,659].forEach((f,i)=>o("sine",f,.025,1+i*.38,2.5+i*.38));
      for(let i=0;i<25;i++){const t2=T+i*.13+Math.random()*.07;try{const b=ctx.createBuffer(1,Math.floor(ctx.sampleRate*.03),ctx.sampleRate);const d=b.getChannelData(0);for(let j=0;j<d.length;j++)d[j]=(Math.random()*2-1)*Math.pow(1-j/d.length,4)*.28;const s=ctx.createBufferSource(),gn=ctx.createGain();s.buffer=b;s.connect(gn);gn.connect(ctx.destination);s.start(t2);}catch(e){}}
      o("sine",2093,.012,6,18);o("sine",2637,.008,6.5,18);
    }catch(e){}
  },[]);
  useEffect(()=>{const CH="IMDATAI01CLAUDE10GPT01GEMINI10NEURAL01";const iv=setInterval(()=>setChars(p=>p.map(c=>({...c,ch:CH[Math.floor(Math.random()*CH.length)],op:Math.max(.05,Math.min(.9,c.op+(Math.random()-.5)*.28)),br:Math.random()>.92,sp:Math.random()>.97}))),90);return()=>clearInterval(iv);},[]);
  useEffect(()=>{
    if(doneRef.current)return;
    if(phase===0){
      setTLines([]);setPct(0);const TM=[];let li=0;
      const add=()=>{if(doneRef.current)return;const ln=TERM[li];if(ln){setTLines(p=>[...p,ln]);li++;setPct(Math.round(li/TERM.length*100));if(li<TERM.length)TM.push(setTimeout(add,280+Math.random()*110));}};
      TM.push(setTimeout(add,350));
      TM.push(setTimeout(()=>{if(!doneRef.current)setPhase(1);},6500));
      return()=>TM.forEach(clearTimeout);
    }
    if(phase===1){const t=setTimeout(()=>{if(!doneRef.current){loopN.current++;setPhase(0);}},9000);return()=>clearTimeout(t);}
  },[phase]);
  const skip=()=>{if(doneRef.current)return;doneRef.current=true;try{audioRef.current?.close();}catch(e){}onDone();};
  const SCard=({pos,em,name,handle,vurl,purl,color,cta})=><a href={vurl} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()} style={{position:"fixed",...pos,zIndex:100000,textDecoration:"none",animation:"fadeIn 1.5s ease"}}>
    <div style={{background:"rgba(3,8,4,.95)",border:"1.5px solid "+color+"55",borderRadius:10,padding:"8px 10px",backdropFilter:"blur(10px)",boxShadow:"0 4px 16px "+color+"20",display:"flex",flexDirection:"column",alignItems:"center",gap:5,width:72}}>
      <div style={{width:34,height:34,borderRadius:8,background:color+"30",border:"1.5px solid "+color+"44",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{em}</div>
      <div style={{textAlign:"center"}}><div style={{fontSize:9,fontWeight:700,color,fontFamily:"sans-serif"}}>{name}</div><div style={{fontSize:7,color:"rgba(255,255,255,.3)",fontFamily:"sans-serif"}}>{handle}</div></div>
      <a href={purl} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()} style={{width:"100%",padding:"4px 0",background:color+"20",border:"1px solid "+color+"40",borderRadius:6,fontSize:8,color,fontWeight:700,fontFamily:"sans-serif",textAlign:"center",textDecoration:"none",display:"block"}}>{cta}</a>
    </div>
  </a>;
  return <div onClick={skip} style={{position:"fixed",inset:0,zIndex:99999,background:"#020508",overflow:"hidden",cursor:"pointer",fontFamily:"monospace"}}>
    <div style={{position:"absolute",inset:0,display:"grid",gridTemplateColumns:"repeat(28,1fr)",gridTemplateRows:"repeat(16,1fr)",pointerEvents:"none"}}>
      {chars.map(c=><div key={c.id} style={{display:"flex",alignItems:"center",justifyContent:"center",fontSize:c.sp?13:9,color:c.sp?"rgba(0,255,136,1)":c.br?"rgba(0,220,255,.9)":"rgba(0,150,50,.35)",opacity:c.op,textShadow:c.sp?"0 0 10px #00ff88":c.br?"0 0 7px #00dcff":"none",fontWeight:c.sp||c.br?700:400,userSelect:"none"}}>{c.ch}</div>)}
    </div>
    <div style={{position:"absolute",inset:0,backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,255,80,.007) 3px,rgba(0,255,80,.007) 4px)",pointerEvents:"none",zIndex:1}}/>
    <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 60% 60% at 50% 50%,transparent 10%,rgba(3,6,9,.5) 55%,rgba(3,6,9,.96) 100%)",pointerEvents:"none",zIndex:1}}/>
    {["tl","tr","bl","br"].map(c=><div key={c} style={{position:"absolute",width:28,height:28,zIndex:2,pointerEvents:"none",top:c[0]==="t"?10:"auto",bottom:c[0]==="b"?10:"auto",left:c[1]==="l"?10:"auto",right:c[1]==="r"?10:"auto",borderTop:c[0]==="t"?"2px solid rgba(0,255,136,.5)":"none",borderBottom:c[0]==="b"?"2px solid rgba(0,255,136,.5)":"none",borderLeft:c[1]==="l"?"2px solid rgba(0,255,136,.5)":"none",borderRight:c[1]==="r"?"2px solid rgba(0,255,136,.5)":"none"}}/>)}
    <div style={{position:"absolute",inset:0,zIndex:3,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"8px 12px 75px"}}>
      {phase===0&&<div style={{width:"100%",maxWidth:420,animation:"fadeIn .4s ease"}}>
        <div style={{background:"rgba(1,8,3,.96)",border:"1px solid rgba(0,255,136,.2)",borderRadius:8,padding:"12px 14px",backdropFilter:"blur(8px)"}}>
          <div style={{display:"flex",gap:5,marginBottom:8,alignItems:"center"}}>
            {["#ff5f57","#febc2e","#28c840"].map((c,i)=><div key={i} style={{width:9,height:9,borderRadius:"50%",background:c}}/>)}
            <span style={{fontSize:8,color:"rgba(0,255,136,.28)",marginLeft:5}}>IMDATAI TERMINAL{loopN.current>0?` [${loopN.current+1}]`:""}</span>
            <span style={{marginLeft:"auto",fontSize:8,color:"rgba(0,255,136,.2)"}}>%{pct}</span>
          </div>
          {tLines.length===0&&<div style={{fontSize:10,color:"rgba(0,255,136,.35)",animation:"blink .9s infinite"}}>SİSTEM BAŞLATILIYOR<span style={{marginLeft:2}}>█</span></div>}
          {tLines.map((l,i)=>l&&<div key={i} style={{fontSize:"clamp(9px,2.2vw,11px)",color:l.c,fontWeight:l.b?700:400,marginBottom:2,lineHeight:1.5}}>{l.t}{i===tLines.length-1&&<span style={{animation:"blink .6s infinite",marginLeft:1}}>█</span>}</div>)}
          <div style={{marginTop:8,height:2,background:"rgba(0,255,136,.07)",borderRadius:1}}><div style={{width:`${pct}%`,height:"100%",background:"linear-gradient(90deg,#00ff88,#00dcff,#a855f7)",transition:"width .5s ease"}}/></div>
        </div>
      </div>}
      {phase===1&&<div style={{textAlign:"center",animation:"fadeIn .5s ease"}}>
        <div style={{position:"relative",display:"inline-block",marginBottom:14}}>
          {[-44,-30,-18].map((n,i)=><div key={i} style={{position:"absolute",inset:n,borderRadius:"50%",border:`1px solid rgba(${["0,255,136","0,220,255","168,85,247"][i]},${[.1,.14,.2][i]})`,animation:`spin ${[12,8,5][i]}s linear infinite ${i===1?"reverse":""}`}}/>)}
          <div style={{position:"absolute",inset:-26,borderRadius:"50%",background:"radial-gradient(ellipse,rgba(0,255,136,.09),transparent 70%)",animation:"glow 2s ease-in-out infinite"}}/>
          <div style={{position:"relative",width:88,height:88,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <img src="/logo.png" alt="IMDATAI" style={{width:84,height:84,objectFit:"contain",filter:"drop-shadow(0 0 18px rgba(0,220,255,0.8)) brightness(1.25)",animation:"logoPulse 2.5s ease-in-out infinite"}} onError={e=>{e.target.style.display="none";e.target.parentElement.innerHTML+='<div style="font-size:64px;color:#00dcff">⬡</div>';}}/>
          </div>
          {[0,51,102,153,204,255,306].map((deg,i)=><div key={i} style={{position:"absolute",width:i%2===0?6:4,height:i%2===0?6:4,borderRadius:"50%",top:"50%",left:"50%",background:["#00ff88","#00dcff","#a855f7","#f472b6","#fbbf24","#34d399","#fb923c"][i],boxShadow:`0 0 ${i%2===0?10:7}px ${["#00ff88","#00dcff","#a855f7","#f472b6","#fbbf24","#34d399","#fb923c"][i]}`,transform:`rotate(${deg}deg) translateX(52px) translateY(-50%)`,animation:`spin ${3.5+i*.35}s linear infinite`}}/>)}
        </div>
        <div style={{fontSize:"clamp(24px,6vw,52px)",fontWeight:900,background:"linear-gradient(90deg,#00ff88,#00dcff,#a855f7,#f472b6,#00ff88)",backgroundSize:"250% auto",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"gradient 2s linear infinite",fontFamily:"Space Grotesk,monospace",letterSpacing:".15em",marginBottom:3}}>IMDATAI</div>
        <div style={{fontSize:"clamp(6px,1.3vw,9px)",letterSpacing:".4em",color:"rgba(0,255,136,.45)",marginBottom:12}}>TÜRKİYE'NİN AI HUB'I</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:5,maxWidth:300,margin:"0 auto 12px"}}>
          {[["900M+","Kullanıcı","#00dcff"],["8","Model","#a855f7"],["75+","Prompt","#fbbf24"],["52","Sayfa","#34d399"]].map(([v,l,c])=><div key={l} style={{background:c+"12",border:"1px solid "+c+"25",borderRadius:8,padding:"7px 2px",textAlign:"center"}}><div style={{fontSize:"clamp(11px,2.5vw,16px)",fontWeight:900,color:c,fontFamily:"Space Grotesk,sans-serif"}}>{v}</div><div style={{fontSize:7,color:"#334155",marginTop:1}}>{l}</div></div>)}
        </div>
        <div style={{fontSize:10,color:"rgba(0,255,136,.38)",letterSpacing:".18em",animation:"blink 1.1s infinite",marginBottom:5}}>[ EKRANA TIKLAYINiZ ]</div>
      </div>}
    </div>
    <SCard pos={{top:42,left:6}} em="🎬" name="YouTube" handle="@imdatai" vurl="https://youtu.be/ZKOKP9jfAMg" purl="https://youtube.com/@imdatai" color="#ff4444" cta="Kanal"/>
    <SCard pos={{top:42,right:6}} em="🎵" name="TikTok" handle="@imdatai" vurl="https://vt.tiktok.com/ZS9oTcvee/" purl="https://tiktok.com/@imdatai" color="#00f2ea" cta="Takip"/>
    <SCard pos={{bottom:52,left:6}} em="📸" name="Instagram" handle="@imdatai" vurl="https://www.instagram.com/reel/DX8i6_wtPxf/" purl="https://instagram.com/imdatai" color="#e1306c" cta="Takip"/>
    <SCard pos={{bottom:52,right:6}} em="🎬" name="Shorts" handle="@imdatai" vurl="https://youtube.com/shorts/5UgwO4rbfNM" purl="https://youtube.com/@imdatai" color="#ff6b6b" cta="Shorts"/>
    <button onClick={e=>{e.stopPropagation();skip();}} style={{position:"fixed",top:12,right:6,zIndex:100001,padding:"6px 12px",border:"1px solid rgba(0,255,136,.28)",borderRadius:14,background:"rgba(1,8,3,.9)",color:"rgba(0,255,136,.6)",fontSize:9,cursor:"pointer",fontFamily:"monospace"}}>⏭ INTRO'YU GEÇ</button>
    <div style={{position:"fixed",bottom:10,left:"50%",transform:"translateX(-50%)",zIndex:100001}}>
      <button onClick={skip} style={{padding:"9px 28px",border:"2px solid rgba(0,255,136,.55)",borderRadius:22,background:"linear-gradient(135deg,rgba(0,255,136,.11),rgba(0,220,255,.07))",color:"#00ff88",fontSize:11,cursor:"pointer",fontFamily:"monospace",fontWeight:700,letterSpacing:".1em",animation:"glow 2s ease-in-out infinite"}}>⚡ SİSTEME GİRİŞ YAP</button>
    </div>
    <style>{"@keyframes scanLine{0%{top:0}100%{top:100%}}"}</style>
  </div>;
}

// ══════════════════════════════════════════════════════════
// CANLI AKTİVİTE FEED
// ══════════════════════════════════════════════════════════
const ACTIVITY_DATA=[
  "İstanbul'dan biri Claude rehberini okuyor 🧠","Ankara'dan biri AI IQ testinde 124 aldı! 🏆",
  "İzmir'den biri prompt puanladı: 91/100 💡","Bursa'dan biri Trivia'da 8 streak yaptı 🔥",
  "Antalya'dan biri Para Kazan sayfasını okuyor 💰","Konya'dan biri Gemini rehberini inceledi 🌟",
  "Kayseri'den biri AI Sözlük'te 12 terim öğrendi 📖","Mersin'den biri şans çarkını çevirdi 🎰",
  "Gaziantep'ten biri Kariyer Sim'i tamamladı 🎭","Eskişehir'den biri günlük görevi bitirdi ✅",
  "Adana'dan biri ChatGPT rehberini paylaştı 🤖","Trabzon'dan biri Emoji Tahmin'de 18 doğru yaptı 😄",
  "Samsun'dan biri Model Dedektif'te %83 aldı 🔍","Denizli'den biri zaman tasarruf hesapladı ⏱️",
  "Malatya'dan biri 3 rozet kazandı 🥇","Erzurum'dan biri AI Alarm kurdu 🔔",
];
function ActivityFeed(){
  const[items,setItems]=useState(ACTIVITY_DATA.slice(0,1));
  const[idx,setIdx]=useState(1);
  const[visible,setVisible]=useState(true);
  useEffect(()=>{
    const id=setInterval(()=>{
      setItems([ACTIVITY_DATA[idx%ACTIVITY_DATA.length]]);
      setIdx(i=>i+1);
    },4000);
    return()=>clearInterval(id);
  },[idx]);
  if(!visible)return null;
  return <div style={{position:"fixed",bottom:180,right:16,zIndex:100,maxWidth:220,pointerEvents:"none"}}>
    {items.map((item,i)=>(
      <div key={i} style={{background:"rgba(6,10,20,0.92)",border:"1px solid rgba(0,220,255,0.15)",borderRadius:10,padding:"8px 12px",fontSize:9,color:"rgba(148,163,184,0.9)",lineHeight:1.5,backdropFilter:"blur(8px)",animation:"fadeIn .4s ease",boxShadow:"0 4px 16px rgba(0,0,0,0.4)"}}>
        <span style={{color:"#00dcff",marginRight:4}}>●</span>{item}
      </div>
    ))}
  </div>;
}

// ══════════════════════════════════════════════════════════
// SLİDESHOW — 5sn Sıralı Tanıtım
// ══════════════════════════════════════════════════════════
const SLIDES=[
  {id:"haberler",e:"📰",t:"Güncel AI Haberleri",d:"GPT-5.5 çıktı! Yeni özellikler, Türkiye AI rakamları ve daha fazlası",c:"#00dcff",badge:"🔴 Canlı"},
  {id:"claude",e:"🧠",t:"Claude — Kodlamada #1",d:"SWE-bench %87.6 · 1M token · Constitutional AI · Prompt rehberleri",c:"#a855f7",badge:"⭐ Öne Çıkan"},
  {id:"trivia",e:"🏆",t:"AI Trivia Marathon",d:"50 soruluk bilgi yarışması! Streak yap, bonus kazan, arkadaşlarına meydan oku",c:"#fb923c",badge:"🔥 Popüler"},
  {id:"para",e:"💰",t:"AI ile Para Kazan",d:"Freelance, içerik, danışmanlık... Ayda 15.000₺'ye nasıl ulaşırsın?",c:"#34d399",badge:"💡 Fırsat"},
  {id:"puan",e:"💡",t:"Prompt Puanlayıcı",d:"Promptunu yapıştır, Gemini AI analiz etsin. Güçlü/zayıf yönler + iyileştirme",c:"#f472b6",badge:"🤖 AI Destekli"},
  {id:"tools",e:"🛠️",t:"45+ AI Araç Rehberi",d:"ChatGPT'den Midjourney'e, Cursor'dan ElevenLabs'a — tam rehber",c:"#60a5fa",badge:"📚 Kapsamlı"},
  {id:"cark",e:"🎰",t:"AI Şans Çarkı",d:"Çevir ve rastgele bir AI ipucu, prompt şablonu veya eğlenceli gerçek kazan!",c:"#fbbf24",badge:"🎮 Eğlence"},
  {id:"animasyon",e:"🎬",t:"Animasyon Galerisi",d:"8 fullscreen AI animasyonu — Nöral ağ, parçacık evreni, 3D küre ve daha fazlası",c:"#a855f7",badge:"✨ Görsel Şov"},
];
function Slideshow({setPage}){
  const[cur,setCur]=useState(0);const[prog,setProg]=useState(0);
  useEffect(()=>{
    setProg(0);
    const step=100/50;let p=0;
    const pid=setInterval(()=>{p+=step;setProg(Math.min(p,100));if(p>=100)clearInterval(pid);},100);
    const sid=setTimeout(()=>setCur(c=>(c+1)%SLIDES.length),5000);
    return()=>{clearInterval(pid);clearTimeout(sid);};
  },[cur]);
  const s=SLIDES[cur];
  return <section style={{padding:"0 20px 0",maxWidth:960,margin:"0 auto"}}>
    <div style={{background:`linear-gradient(135deg,${s.c}08,rgba(0,0,0,0.2))`,border:`1px solid ${s.c}22`,borderRadius:18,padding:"20px 24px",position:"relative",overflow:"hidden",transition:"all .5s ease",cursor:"pointer"}} onClick={()=>setPage(s.id)}>
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:3,background:"rgba(255,255,255,0.06)"}}>
        <div style={{width:`${prog}%`,height:"100%",background:`linear-gradient(90deg,${s.c},${s.c}88)`,transition:"width .1s linear"}}/>
      </div>
      <div style={{display:"flex",gap:16,alignItems:"center",flexWrap:"wrap"}}>
        <div style={{fontSize:44,flexShrink:0,animation:"float 2s ease-in-out infinite"}}>{s.e}</div>
        <div style={{flex:1}}>
          <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:6,flexWrap:"wrap"}}>
            <div style={{fontSize:9,color:s.c,background:`${s.c}12`,padding:"3px 8px",borderRadius:6,fontWeight:700}}>{s.badge}</div>
            <div style={{fontSize:9,color:"#334155"}}>{cur+1} / {SLIDES.length}</div>
          </div>
          <div style={{fontSize:18,fontWeight:800,color:"#e2e8f0",marginBottom:6,fontFamily:"'Space Grotesk',sans-serif"}}>{s.t}</div>
          <div style={{fontSize:12,color:"#64748b",lineHeight:1.6}}>{s.d}</div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:6,flexShrink:0}}>
          <button onClick={e=>{e.stopPropagation();setPage(s.id);}} style={{padding:"9px 18px",borderRadius:9,border:`1px solid ${s.c}44`,background:`${s.c}12`,color:s.c,fontSize:12,cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>Keşfet →</button>
          <div style={{display:"flex",gap:4,justifyContent:"center"}}>
            {SLIDES.map((_,i)=><div key={i} onClick={e=>{e.stopPropagation();setCur(i);}} style={{width:6,height:6,borderRadius:"50%",background:i===cur?s.c:"rgba(255,255,255,0.15)",cursor:"pointer",transition:"all .2s"}}/>)}
          </div>
        </div>
      </div>
    </div>
  </section>;
}

// ══════════════════════════════════════════════════════════
// GÜNLÜK GÖREV SİSTEMİ
// ══════════════════════════════════════════════════════════
const DAILY_MISSION_POOL=[
  {id:"read_news",e:"📰",t:"Bir haber oku",d:"Haberler sayfasını ziyaret et",xp:10,page:"haberler"},
  {id:"play_trivia",e:"🏆",t:"Trivia oyna",d:"En az 5 soru cevapla",xp:20,page:"trivia"},
  {id:"prompt_score",e:"💡",t:"Prompt puanla",d:"Bir promptunu analiz ettir",xp:15,page:"puan"},
  {id:"read_claude",e:"🧠",t:"Claude rehberini oku",d:"Claude sayfasını ziyaret et",xp:10,page:"claude"},
  {id:"emoji_game",e:"😄",t:"Emoji tahmin oyna",d:"5 kelime bul",xp:15,page:"emoji"},
  {id:"check_tools",e:"🛠️",t:"Araç keşfet",d:"Tools sayfasını ziyaret et",xp:10,page:"tools"},
];
function getDailyMissions(){
  const today=new Date().toDateString();
  const seed=today.split("").reduce((a,c)=>a+c.charCodeAt(0),0);
  return [0,1,2].map(i=>DAILY_MISSION_POOL[(seed+i)%DAILY_MISSION_POOL.length]);
}
function DailyMissionsWidget({setPage}){
  const[open,setOpen]=useState(false);
  const[done,setDone]=useState(()=>{try{return JSON.parse(localStorage.getItem("imdatai_missions_"+new Date().toDateString())||"[]");}catch{return[];}});
  const missions=getDailyMissions();
  const xp=done.length*15;const total=missions.length*15;
  function complete(id,page){
    if(done.includes(id))return;
    const nd=[...done,id];setDone(nd);
    try{localStorage.setItem("imdatai_missions_"+new Date().toDateString(),JSON.stringify(nd));}catch{}
    playSound("correct");setPage(page);
  }
  return <div style={{position:"fixed",right:24,bottom:140,zIndex:490}}>
    <button onClick={()=>setOpen(o=>!o)} style={{background:"linear-gradient(135deg,#fb923c,#f59e0b)",border:"none",borderRadius:12,padding:"8px 14px",cursor:"pointer",fontFamily:"inherit",color:"#fff",fontSize:11,fontWeight:700,boxShadow:"0 4px 16px rgba(251,146,60,0.4)",display:"flex",alignItems:"center",gap:6}}>
      📋 Görevler <span style={{background:"rgba(255,255,255,0.25)",borderRadius:6,padding:"2px 6px",fontSize:9}}>{done.length}/{missions.length}</span>
    </button>
    {open&&<div style={{position:"absolute",bottom:44,right:0,background:"rgba(8,12,24,0.98)",border:"1px solid rgba(251,146,60,0.25)",borderRadius:16,padding:"16px",minWidth:280,backdropFilter:"blur(20px)",boxShadow:"0 16px 48px rgba(0,0,0,0.8)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div style={{fontSize:12,fontWeight:700,color:"#e2e8f0",fontFamily:"'Space Grotesk',sans-serif"}}>📋 Günlük Görevler</div>
        <div style={{fontSize:10,color:"#fb923c",fontWeight:700}}>{xp}/{total} XP</div>
      </div>
      <div style={{height:4,background:"rgba(255,255,255,0.06)",borderRadius:2,marginBottom:14}}>
        <div style={{width:`${(done.length/missions.length)*100}%`,height:"100%",background:"linear-gradient(90deg,#fb923c,#f59e0b)",borderRadius:2,transition:"width .4s"}}/>
      </div>
      {missions.map(m=>(
        <div key={m.id} onClick={()=>complete(m.id,m.page)} style={{display:"flex",gap:10,alignItems:"center",padding:"10px 12px",borderRadius:10,marginBottom:6,cursor:done.includes(m.id)?"default":"pointer",background:done.includes(m.id)?"rgba(52,211,153,0.08)":"rgba(255,255,255,0.03)",border:`1px solid ${done.includes(m.id)?"rgba(52,211,153,0.25)":"rgba(255,255,255,0.06)"}`,opacity:done.includes(m.id)?0.8:1}}>
          <span style={{fontSize:18}}>{m.e}</span>
          <div style={{flex:1}}>
            <div style={{fontSize:11,fontWeight:600,color:done.includes(m.id)?"#34d399":"#e2e8f0"}}>{done.includes(m.id)?"✅ ":""}{m.t}</div>
            <div style={{fontSize:9,color:"#475569"}}>{m.d}</div>
          </div>
          <div style={{fontSize:9,color:"#fb923c",fontWeight:700}}>+{m.xp}XP</div>
        </div>
      ))}
      {done.length===missions.length&&<div style={{textAlign:"center",padding:"8px",fontSize:11,color:"#34d399",fontWeight:700}}>🎉 Tüm görevler tamamlandı!</div>}
    </div>}
  </div>;
}

// ══════════════════════════════════════════════════════════
// ŞANS ÇARKI SAYFASI
// ══════════════════════════════════════════════════════════
const WHEEL_ITEMS=[
  {e:"💡",t:"Prompt İpucu",d:"Chain of Thought: Promptuna 'adım adım düşün' ekle. Doğruluk %30 artar!",c:"#00dcff"},
  {e:"🤯",t:"AI Gerçeği",d:"ChatGPT, 5 günde 1 milyon kullanıcıya ulaştı. Netflix 3.5 yıl almıştı!",c:"#a855f7"},
  {e:"🏆",t:"Trivia Sorusu",d:"Claude'un SWE-bench skoru nedir? → %87.6 ile dünya rekoru!",c:"#fb923c"},
  {e:"🛠️",t:"Araç Önerisi",d:"Bu hafta dene: Cursor — AI destekli IDE. 4M+ geliştirici kullanıyor.",c:"#34d399"},
  {e:"📰",t:"Gündem",d:"2026 Q1: AI sektörüne 267 milyar dolar yatırım yapıldı!",c:"#60a5fa"},
  {e:"📝",t:"Prompt Şablonu",d:"'Deneyimli bir [uzman] olarak, [hedef kitle] için [görev] yap. Format: madde madde'",c:"#f472b6"},
  {e:"🧠",t:"AI Terimi",d:"RAG (Retrieval-Augmented Generation): AI'ın dış kaynaklara bağlanarak güncel bilgi alması",c:"#fbbf24"},
  {e:"💰",t:"Para İpucu",d:"ChatGPT ile içerik üretimi: Ayda 50 makale × 200₺ = 10.000₺ ek gelir",c:"#34d399"},
];
function LuckyWheelPage(){
  const[spinning,setSpinning]=useState(false);const[result,setResult]=useState(null);const[rot,setRot]=useState(0);const[hist,setHist]=useState([]);
  function spin(){
    if(spinning)return;
    setSpinning(true);setResult(null);
    const idx=Math.floor(Math.random()*WHEEL_ITEMS.length);
    const extra=3+Math.random()*2;
    const deg=rot+extra*360+(idx/WHEEL_ITEMS.length)*360;
    setRot(deg);
    playSound("level");
    setTimeout(()=>{setSpinning(false);setResult(WHEEL_ITEMS[idx]);setHist(h=>[WHEEL_ITEMS[idx],...h.slice(0,4)]);playSound("victory");},3000);
  }
  const seg=360/WHEEL_ITEMS.length;
  return <div style={{padding:"28px 20px",maxWidth:700,margin:"0 auto",textAlign:"center"}}>
    <div style={{fontSize:9,letterSpacing:".2em",color:"#fbbf24",marginBottom:6}}>ŞANS ÇARKI</div>
    <div style={{fontSize:24,fontWeight:900,color:"#e2e8f0",fontFamily:"'Space Grotesk',sans-serif",marginBottom:6}}>🎰 AI Şans Çarkı</div>
    <div style={{fontSize:12,color:"#64748b",marginBottom:28}}>Çevir ve rastgele bir AI ipucu, prompt şablonu veya gerçek kazan!</div>
    {/* Wheel */}
    <div style={{position:"relative",width:280,height:280,margin:"0 auto 24px"}}>
      <div style={{position:"absolute",top:"50%",left:"50%",transform:`translate(-50%,-50%) rotate(${rot}deg)`,width:260,height:260,borderRadius:"50%",transition:spinning?"transform 3s cubic-bezier(.17,.67,.12,.99)":"none",border:"4px solid rgba(255,255,255,0.1)",overflow:"hidden",boxShadow:"0 0 40px rgba(0,220,255,0.2)"}}>
        {WHEEL_ITEMS.map((item,i)=>(
          <div key={i} style={{position:"absolute",top:0,left:"50%",transformOrigin:"0 130px",transform:`rotate(${i*seg}deg) translateX(-50%)`,height:130,display:"flex",alignItems:"flex-start",justifyContent:"center",paddingTop:8,fontSize:18,background:`${item.c}18`}}>
            {item.e}
          </div>
        ))}
      </div>
      {/* Pointer */}
      <div style={{position:"absolute",top:-8,left:"50%",transform:"translateX(-50%)",fontSize:24,zIndex:10}}>▼</div>
      {/* Center button */}
      <button onClick={spin} disabled={spinning} style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:70,height:70,borderRadius:"50%",background:"linear-gradient(135deg,#00dcff,#a855f7)",border:"4px solid rgba(6,10,20,0.9)",color:"#fff",fontSize:12,fontWeight:900,cursor:spinning?"not-allowed":"pointer",fontFamily:"inherit",zIndex:10,boxShadow:"0 0 24px rgba(0,220,255,0.5)"}}>
        {spinning?"...":"ÇEVİR!"}
      </button>
    </div>
    {result&&<div style={{background:`${result.c}08`,border:`1px solid ${result.c}25`,borderRadius:16,padding:"20px",marginBottom:20,animation:"fadeIn .4s ease"}}>
      <div style={{fontSize:36,marginBottom:8}}>{result.e}</div>
      <div style={{fontSize:16,fontWeight:700,color:result.c,marginBottom:8,fontFamily:"'Space Grotesk',sans-serif"}}>{result.t}</div>
      <div style={{fontSize:13,color:"#94a3b8",lineHeight:1.7,marginBottom:12}}>{result.d}</div>
      <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
        <button onClick={spin} className="btn-primary" style={{padding:"9px 20px",fontSize:12,borderRadius:9,fontFamily:"inherit"}}>🎰 Tekrar Çevir</button>
        <ShareButton title="AI Şans Çarkı" text={`🎰 AI Şans Çarkında şunu kazandım:\n\n${result.e} ${result.t}\n${result.d}`} size="small"/>
      </div>
    </div>}
    {hist.length>0&&<div style={{textAlign:"left"}}>
      <div style={{fontSize:10,color:"#475569",marginBottom:8,letterSpacing:".1em"}}>SON ÇEVIRMELER</div>
      {hist.map((h,i)=><div key={i} style={{display:"flex",gap:10,alignItems:"center",padding:"8px 12px",borderRadius:9,marginBottom:4,background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)"}}>
        <span style={{fontSize:16}}>{h.e}</span>
        <div style={{flex:1,fontSize:11,color:"#64748b"}}>{h.t}</div>
      </div>)}
    </div>}
  </div>;
}

// ══════════════════════════════════════════════════════════
// ANİMASYON GALERİSİ — Fullscreen
// ══════════════════════════════════════════════════════════
function AnimParticle(){
  const r=useRef();
  useEffect(()=>{
    const c=r.current;if(!c)return;
    const ctx=c.getContext("2d");let W=c.width=c.offsetWidth,H=c.height=c.offsetHeight;
    const pts=Array.from({length:120},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.8,vy:(Math.random()-.5)*.8,r:Math.random()*2+.5,c:`hsl(${Math.random()*60+180},100%,60%)`}));
    let af;function draw(){ctx.fillStyle="rgba(6,10,20,0.15)";ctx.fillRect(0,0,W,H);pts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=p.c;ctx.fill();pts.forEach(p2=>{const d=Math.hypot(p.x-p2.x,p.y-p2.y);if(d<100){ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p2.x,p2.y);ctx.strokeStyle=`rgba(0,220,255,${(1-d/100)*.15})`;ctx.lineWidth=.5;ctx.stroke();}});});af=requestAnimationFrame(draw);}draw();
    return()=>cancelAnimationFrame(af);
  },[]);
  return <canvas ref={r} style={{width:"100%",height:"100%"}}/>;
}
function AnimDNA(){
  const r=useRef();
  useEffect(()=>{
    const c=r.current;if(!c)return;
    const ctx=c.getContext("2d");let W=c.width=c.offsetWidth,H=c.height=c.offsetHeight;let t=0;let af;
    function draw(){t+=.02;ctx.fillStyle="rgba(6,10,20,0.1)";ctx.fillRect(0,0,W,H);
      const cx=W/2;for(let i=0;i<60;i++){const y=H*(i/60);const x1=cx+Math.sin(t+i*.3)*80;const x2=cx+Math.sin(t+i*.3+Math.PI)*80;
        ctx.beginPath();ctx.arc(x1,y,4,0,Math.PI*2);ctx.fillStyle=`rgba(0,220,255,${.5+.5*Math.sin(t+i*.3)})`;ctx.fill();
        ctx.beginPath();ctx.arc(x2,y,4,0,Math.PI*2);ctx.fillStyle=`rgba(168,85,247,${.5+.5*Math.sin(t+i*.3+Math.PI)})`;ctx.fill();
        if(i%3===0){ctx.beginPath();ctx.moveTo(x1,y);ctx.lineTo(x2,y);ctx.strokeStyle="rgba(0,220,255,0.2)";ctx.lineWidth=1;ctx.stroke();}}
      af=requestAnimationFrame(draw);}draw();
    return()=>cancelAnimationFrame(af);
  },[]);
  return <canvas ref={r} style={{width:"100%",height:"100%"}}/>;
}
function AnimWave(){
  const r=useRef();
  useEffect(()=>{
    const c=r.current;if(!c)return;
    const ctx=c.getContext("2d");let W=c.width=c.offsetWidth,H=c.height=c.offsetHeight;let t=0;let af;
    function draw(){t+=.02;ctx.fillStyle="rgba(6,10,20,0.08)";ctx.fillRect(0,0,W,H);
      for(let w=0;w<4;w++){ctx.beginPath();const hue=180+w*30;for(let x=0;x<W;x++){const y=H/2+Math.sin(x*.02+t+w*.8)*60*Math.sin(t*.3+w);}
        ctx.beginPath();for(let x=0;x<=W;x+=2){const y=H/2+Math.sin(x*.015+t+w*.7)*50+Math.sin(x*.03+t*1.5)*20;x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}
        ctx.strokeStyle=`hsla(${hue+w*20},100%,60%,0.4)`;ctx.lineWidth=2+w;ctx.stroke();}
      af=requestAnimationFrame(draw);}draw();
    return()=>cancelAnimationFrame(af);
  },[]);
  return <canvas ref={r} style={{width:"100%",height:"100%"}}/>;
}
function AnimGlobe(){
  const r=useRef();
  useEffect(()=>{
    const c=r.current;if(!c)return;
    const ctx=c.getContext("2d");let W=c.width=c.offsetWidth,H=c.height=c.offsetHeight;
    const cx=W/2,cy=H/2,rad=Math.min(W,H)*.35;let t=0;let af;
    const pts=Array.from({length:60},()=>({lat:(Math.random()-.5)*Math.PI,lng:Math.random()*Math.PI*2}));
    function project(lat,lng,rot){const x=Math.cos(lat)*Math.sin(lng+rot);const y=Math.sin(lat);const z=Math.cos(lat)*Math.cos(lng+rot);return{x:cx+x*rad,y:cy-y*rad,z};}
    function draw(){t+=.005;ctx.fillStyle="rgba(6,10,20,0.1)";ctx.fillRect(0,0,W,H);
      ctx.beginPath();ctx.arc(cx,cy,rad,0,Math.PI*2);ctx.strokeStyle="rgba(0,220,255,0.1)";ctx.lineWidth=1;ctx.stroke();
      for(let i=0;i<12;i++){ctx.beginPath();const lng=i*Math.PI/6;for(let j=0;j<=20;j++){const lat=(j/20-.5)*Math.PI;const p=project(lat,lng,t);if(p.z>0){j===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y);}}ctx.strokeStyle="rgba(0,220,255,0.08)";ctx.lineWidth=.5;ctx.stroke();}
      pts.forEach(p=>{const proj=project(p.lat,p.lng,t);if(proj.z>0){ctx.beginPath();ctx.arc(proj.x,proj.y,2+proj.z*2,0,Math.PI*2);ctx.fillStyle=`rgba(0,220,255,${.4+proj.z*.4})`;ctx.fill();}});
      af=requestAnimationFrame(draw);}draw();
    return()=>cancelAnimationFrame(af);
  },[]);
  return <canvas ref={r} style={{width:"100%",height:"100%"}}/>;
}

const ANIMS=[
  {id:"particle",t:"🌌 Parçacık Evreni",d:"500 parçacık + ağ",Comp:AnimParticle},
  {id:"neural",t:"🧠 Nöral Ağ",d:"Sinir ağı görsel",Comp:NeuralNetSim},
  {id:"dna",t:"🧬 DNA Sarmalı",d:"3D çift sarmal",Comp:AnimDNA},
  {id:"wave",t:"🌊 Dalga Denizi",d:"Sin/Cos dalgaları",Comp:AnimWave},
  {id:"globe",t:"🌐 3D Küre",d:"Dünya ağı",Comp:AnimGlobe},
  {id:"matrix",t:"🔢 Matrix",d:"Kod yağmuru",Comp:()=>{const r=useRef();useEffect(()=>{const c=r.current;if(!c)return;c.width=c.offsetWidth||400;c.height=c.offsetHeight||300;const ctx=c.getContext("2d");const cols=Math.floor(c.width/14);const drops=Array(cols).fill(0);const CH="IMDATAI01MLAI10";const iv=setInterval(()=>{ctx.fillStyle="rgba(4,8,20,0.07)";ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle="#00ff88";ctx.font="12px monospace";drops.forEach((y,i)=>{ctx.fillText(CH[Math.floor(Math.random()*CH.length)],i*14,y*14);if(y*14>c.height&&Math.random()>.97)drops[i]=0;drops[i]++;});},50);return()=>clearInterval(iv);},[]);return <canvas ref={r} style={{width:"100%",height:"100%"}}/>;} },
  {id:"fireworks",t:"🎆 Havai Fişek",d:"Renkli patlamalar",Comp:()=>{const r=useRef();useEffect(()=>{const c=r.current;if(!c)return;c.width=c.offsetWidth||400;c.height=c.offsetHeight||300;const ctx=c.getContext("2d");const ps=[];function ex(x,y){const h=Math.random()*360;for(let i=0;i<50;i++)ps.push({x,y,vx:(Math.random()-.5)*7,vy:(Math.random()-.5)*7,life:1,h});}let t=0;const iv=setInterval(()=>{t++;ctx.fillStyle="rgba(2,5,10,0.2)";ctx.fillRect(0,0,c.width,c.height);if(t%70===0)ex(Math.random()*c.width,Math.random()*c.height*0.7);for(let i=ps.length-1;i>=0;i--){const p=ps[i];ctx.fillStyle=`hsl(${p.h},100%,60%)`;ctx.globalAlpha=p.life;ctx.fillRect(p.x,p.y,3,3);p.x+=p.vx;p.y+=p.vy;p.vy+=0.15;p.life-=0.018;if(p.life<=0)ps.splice(i,1);}ctx.globalAlpha=1;},30);return()=>clearInterval(iv);},[]);return <canvas ref={r} style={{width:"100%",height:"100%"}}/>;} },
  {id:"blackhole",t:"⚫ Kara Delik",d:"Spiral çekim",Comp:()=>{const r=useRef();useEffect(()=>{const c=r.current;if(!c)return;c.width=c.offsetWidth||400;c.height=c.offsetHeight||300;const ctx=c.getContext("2d");const cx=c.width/2,cy=c.height/2;const pts=Array.from({length:200},()=>({a:Math.random()*Math.PI*2,rr:50+Math.random()*120,sp:0.005+Math.random()*0.02,h:220+Math.random()*60}));const iv=setInterval(()=>{ctx.fillStyle="rgba(0,0,0,0.15)";ctx.fillRect(0,0,c.width,c.height);pts.forEach(p=>{p.a+=p.sp;p.rr=Math.max(5,p.rr-0.1);const x=cx+p.rr*Math.cos(p.a),y=cy+p.rr*Math.sin(p.a);ctx.fillStyle=`hsl(${p.h},80%,55%)`;ctx.fillRect(x,y,2,2);if(p.rr<8)p.rr=50+Math.random()*120;});},30);return()=>clearInterval(iv);},[]);return <canvas ref={r} style={{width:"100%",height:"100%"}}/>;} },
  {id:"lightning",t:"⚡ Şimşek",d:"Elektrik efekti",Comp:()=>{const r=useRef();useEffect(()=>{const c=r.current;if(!c)return;c.width=c.offsetWidth||400;c.height=c.offsetHeight||300;const ctx=c.getContext("2d");function bolt(x1,y1,x2,y2,d){if(d<=0){ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();return;}const mx=(x1+x2)/2+(Math.random()-.5)*d*2,my=(y1+y2)/2+(Math.random()-.5)*d*2;bolt(x1,y1,mx,my,d/2);bolt(mx,my,x2,y2,d/2);}const iv=setInterval(()=>{ctx.fillStyle="rgba(2,5,15,0.35)";ctx.fillRect(0,0,c.width,c.height);ctx.strokeStyle=`hsl(${200+Math.random()*60},100%,70%)`;ctx.lineWidth=Math.random()*2+0.5;ctx.shadowBlur=12;ctx.shadowColor="#00dcff";if(Math.random()>.5)bolt(c.width/2,0,c.width/2+(Math.random()-.5)*c.width,c.height,60);ctx.shadowBlur=0;},120);return()=>clearInterval(iv);},[]);return <canvas ref={r} style={{width:"100%",height:"100%"}}/>;} },
  {id:"nebula",t:"🌠 Nebula",d:"Uzay bulutu",Comp:()=>{const r=useRef();useEffect(()=>{const c=r.current;if(!c)return;c.width=c.offsetWidth||400;c.height=c.offsetHeight||300;const ctx=c.getContext("2d");const stars=Array.from({length:120},()=>({x:Math.random()*c.width,y:Math.random()*c.height,rr:Math.random()*1.5,b:Math.random()}));const iv=setInterval(()=>{ctx.fillStyle="rgba(2,4,12,0.06)";ctx.fillRect(0,0,c.width,c.height);stars.forEach(s=>{s.b+=0.01;ctx.fillStyle=`rgba(255,255,255,${0.3+Math.sin(s.b)*0.4})`;ctx.beginPath();ctx.arc(s.x,s.y,s.rr,0,Math.PI*2);ctx.fill();});},60);return()=>clearInterval(iv);},[]);return <canvas ref={r} style={{width:"100%",height:"100%"}}/>;} },
  {id:"heartbeat",t:"❤️ Kalp Atışı",d:"EKG ritmi",Comp:()=>{const r=useRef();useEffect(()=>{const c=r.current;if(!c)return;c.width=c.offsetWidth||400;c.height=c.offsetHeight||300;const ctx=c.getContext("2d");const pts=[];let x=0;const iv=setInterval(()=>{x=(x+3)%c.width;const cy2=c.height/2;const t2=x/c.width*Math.PI*8;let y=cy2;if(Math.sin(t2)>0.8)y=cy2-80*Math.sin(t2*3);else y=cy2+Math.sin(t2)*8;pts.push({x,y});if(pts.length>100)pts.shift();ctx.fillStyle="rgba(10,2,4,0.3)";ctx.fillRect(0,0,c.width,c.height);ctx.strokeStyle="#ff4466";ctx.lineWidth=2;ctx.shadowBlur=8;ctx.shadowColor="#ff4466";ctx.beginPath();pts.forEach((p,i)=>i===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y));ctx.stroke();ctx.shadowBlur=0;},20);return()=>clearInterval(iv);},[]);return <canvas ref={r} style={{width:"100%",height:"100%"}}/>;} },
  {id:"boids",t:"🐦 Sürü",d:"Yapay zeka sürüsü",Comp:()=>{const r=useRef();useEffect(()=>{const c=r.current;if(!c)return;c.width=c.offsetWidth||400;c.height=c.offsetHeight||300;const ctx=c.getContext("2d");const B=Array.from({length:60},()=>({x:Math.random()*c.width,y:Math.random()*c.height,vx:(Math.random()-.5)*3,vy:(Math.random()-.5)*3}));const iv=setInterval(()=>{ctx.fillStyle="rgba(4,8,20,0.15)";ctx.fillRect(0,0,c.width,c.height);B.forEach(b=>{let ax=0,ay=0,n=0;B.forEach(o=>{if(o===b)return;const dx=o.x-b.x,dy=o.y-b.y,d=Math.sqrt(dx*dx+dy*dy);if(d<60){ax+=o.vx;ay+=o.vy;n++;}if(d<20){ax-=dx*0.1;ay-=dy*0.1;}});if(n>0){b.vx+=(ax/n-b.vx)*0.05;b.vy+=(ay/n-b.vy)*0.05;}const sp=Math.sqrt(b.vx*b.vx+b.vy*b.vy);if(sp>3){b.vx=b.vx/sp*3;b.vy=b.vy/sp*3;}b.x=(b.x+b.vx+c.width)%c.width;b.y=(b.y+b.vy+c.height)%c.height;ctx.fillStyle="#00dcff";ctx.fillRect(b.x,b.y,3,3);});},40);return()=>clearInterval(iv);},[]);return <canvas ref={r} style={{width:"100%",height:"100%"}}/>;} },
  {id:"spiral",t:"🌀 Sarmal",d:"Fibonacci sarmalı",Comp:()=>{const r=useRef();useEffect(()=>{const c=r.current;if(!c)return;c.width=c.offsetWidth||400;c.height=c.offsetHeight||300;const ctx=c.getContext("2d");let t=0;const iv=setInterval(()=>{t+=0.05;ctx.fillStyle="rgba(4,8,20,0.08)";ctx.fillRect(0,0,c.width,c.height);const cx=c.width/2,cy=c.height/2;for(let i=0;i<400;i++){const a=i*0.2+t;const rr=i*0.4;const x=cx+rr*Math.cos(a),y=cy+rr*Math.sin(a);ctx.fillStyle=`hsl(${(i*2+t*20)%360},80%,60%)`;ctx.fillRect(x,y,2,2);}},40);return()=>clearInterval(iv);},[]);return <canvas ref={r} style={{width:"100%",height:"100%"}}/>;} },
  {id:"constellation",t:"✨ Takımyıldız",d:"Yıldız bağlantıları",Comp:()=>{const r=useRef();useEffect(()=>{const c=r.current;if(!c)return;c.width=c.offsetWidth||400;c.height=c.offsetHeight||300;const ctx=c.getContext("2d");const S=Array.from({length:80},()=>({x:Math.random()*c.width,y:Math.random()*c.height,vx:(Math.random()-.5)*0.3,vy:(Math.random()-.5)*0.3,rr:Math.random()*2+0.5}));const iv=setInterval(()=>{ctx.fillStyle="rgba(2,4,12,0.2)";ctx.fillRect(0,0,c.width,c.height);S.forEach(s=>{s.x=(s.x+s.vx+c.width)%c.width;s.y=(s.y+s.vy+c.height)%c.height;ctx.fillStyle="#e2e8f0";ctx.beginPath();ctx.arc(s.x,s.y,s.rr,0,Math.PI*2);ctx.fill();S.forEach(o=>{const d=Math.hypot(s.x-o.x,s.y-o.y);if(d<80&&d>0){ctx.strokeStyle=`rgba(0,220,255,${1-d/80})`;ctx.lineWidth=0.5;ctx.beginPath();ctx.moveTo(s.x,s.y);ctx.lineTo(o.x,o.y);ctx.stroke();}});});},50);return()=>clearInterval(iv);},[]);return <canvas ref={r} style={{width:"100%",height:"100%"}}/>;} },
  {id:"pulsar",t:"📡 Pulsar",d:"Radyo dalgaları",Comp:()=>{const r=useRef();useEffect(()=>{const c=r.current;if(!c)return;c.width=c.offsetWidth||400;c.height=c.offsetHeight||300;const ctx=c.getContext("2d");const rings=[];let t=0;const iv=setInterval(()=>{t++;if(t%40===0)rings.push({rr:0,a:0.9});ctx.fillStyle="rgba(4,8,20,0.2)";ctx.fillRect(0,0,c.width,c.height);const cx=c.width/2,cy=c.height/2;ctx.fillStyle="#a855f7";ctx.beginPath();ctx.arc(cx,cy,8,0,Math.PI*2);ctx.fill();for(let i=rings.length-1;i>=0;i--){const ring=rings[i];ctx.strokeStyle=`rgba(168,85,247,${ring.a})`;ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(cx,cy,ring.rr,0,Math.PI*2);ctx.stroke();ring.rr+=2.5;ring.a-=0.018;if(ring.a<=0)rings.splice(i,1);}},40);return()=>clearInterval(iv);},[]);return <canvas ref={r} style={{width:"100%",height:"100%"}}/>;} },
  {id:"audio",t:"🎵 Ses Dalgası",d:"Frekans görsel",Comp:()=>{const r=useRef();useEffect(()=>{const c=r.current;if(!c)return;c.width=c.offsetWidth||400;c.height=c.offsetHeight||300;const ctx=c.getContext("2d");const bars=Array.from({length:48},(_,i)=>({h:20,target:20,hue:200+i*3}));const iv=setInterval(()=>{ctx.fillStyle="rgba(4,8,20,0.3)";ctx.fillRect(0,0,c.width,c.height);bars.forEach((b,i)=>{b.target+=(Math.random()-.5)*40;b.target=Math.max(5,Math.min(c.height*.8,b.target));b.h+=(b.target-b.h)*0.15;const x=i*(c.width/bars.length)+1;const g=ctx.createLinearGradient(0,c.height,0,c.height-b.h);g.addColorStop(0,`hsla(${b.hue},90%,55%,.9)`);g.addColorStop(1,`hsla(${b.hue+30},100%,70%,.7)`);ctx.fillStyle=g;ctx.fillRect(x,c.height-b.h,c.width/bars.length-2,b.h);});},50);return()=>clearInterval(iv);},[]);return <canvas ref={r} style={{width:"100%",height:"100%"}}/>;} },
  {id:"gameoflife",t:"🔲 Game of Life",d:"Conway yaşam",Comp:()=>{const r=useRef();useEffect(()=>{const c=r.current;if(!c)return;c.width=c.offsetWidth||400;c.height=c.offsetHeight||300;const ctx=c.getContext("2d");const W=Math.floor(c.width/8),H=Math.floor(c.height/8);let grid=Array.from({length:H},()=>Array.from({length:W},()=>Math.random()>.7?1:0));const iv=setInterval(()=>{ctx.fillStyle="#030609";ctx.fillRect(0,0,c.width,c.height);const next=grid.map((row,y)=>row.map((_,x)=>{let n=0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){if(dx===0&&dy===0)continue;n+=grid[(y+dy+H)%H][(x+dx+W)%W];}return grid[y][x]?n===2||n===3?1:0:n===3?1:0;}));grid=next;grid.forEach((row,y)=>row.forEach((cell,x)=>{if(cell){ctx.fillStyle="#00dcff";ctx.fillRect(x*8,y*8,7,7);}}));},120);return()=>clearInterval(iv);},[]);return <canvas ref={r} style={{width:"100%",height:"100%"}}/>;} },
  {id:"crystal",t:"💎 Kristal",d:"Büyüyen yapı",Comp:()=>{const r=useRef();useEffect(()=>{const c=r.current;if(!c)return;c.width=c.offsetWidth||400;c.height=c.offsetHeight||300;const ctx=c.getContext("2d");const pts=[{x:c.width/2,y:c.height/2,size:2}];let t=0;const iv=setInterval(()=>{t++;ctx.fillStyle="rgba(4,8,20,0.05)";ctx.fillRect(0,0,c.width,c.height);if(t%5===0&&pts.length<200){const base=pts[Math.floor(Math.random()*pts.length)];const a=Math.random()*Math.PI*2,d=8+Math.random()*8;pts.push({x:base.x+Math.cos(a)*d,y:base.y+Math.sin(a)*d,size:Math.max(0.5,base.size*0.95)});}pts.forEach(p=>{ctx.fillStyle=`hsla(${(p.x+p.y+t)%360},70%,60%,.8)`;ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,Math.PI*2);ctx.fill();});},40);return()=>clearInterval(iv);},[]);return <canvas ref={r} style={{width:"100%",height:"100%"}}/>;} },
  {id:"metaballs",t:"🫧 Metaballs",d:"Organik damlalar",Comp:()=>{const r=useRef();useEffect(()=>{const c=r.current;if(!c)return;c.width=c.offsetWidth||400;c.height=c.offsetHeight||300;const ctx=c.getContext("2d");const balls=Array.from({length:6},()=>({x:Math.random()*c.width,y:Math.random()*c.height,vx:(Math.random()-.5)*2,vy:(Math.random()-.5)*2,rr:30+Math.random()*30,h:Math.random()*360}));const iv=setInterval(()=>{ctx.fillStyle="rgba(4,8,20,0.3)";ctx.fillRect(0,0,c.width,c.height);balls.forEach(b=>{b.x+=b.vx;b.y+=b.vy;if(b.x<b.rr||b.x>c.width-b.rr)b.vx*=-1;if(b.y<b.rr||b.y>c.height-b.rr)b.vy*=-1;const g=ctx.createRadialGradient(b.x,b.y,0,b.x,b.y,b.rr);g.addColorStop(0,`hsla(${b.h},90%,65%,.9)`);g.addColorStop(1,`hsla(${b.h},90%,65%,0)`);ctx.fillStyle=g;ctx.beginPath();ctx.arc(b.x,b.y,b.rr,0,Math.PI*2);ctx.fill();});},40);return()=>clearInterval(iv);},[]);return <canvas ref={r} style={{width:"100%",height:"100%"}}/>;} },
  {id:"geometry",t:"📐 Geometri",d:"Dönen şekiller",Comp:()=>{const r=useRef();useEffect(()=>{const c=r.current;if(!c)return;c.width=c.offsetWidth||400;c.height=c.offsetHeight||300;const ctx=c.getContext("2d");let t=0;const iv=setInterval(()=>{t+=0.02;ctx.fillStyle="rgba(4,8,20,0.1)";ctx.fillRect(0,0,c.width,c.height);const cx=c.width/2,cy=c.height/2;[3,4,5,6,8].forEach((sides,i)=>{ctx.save();ctx.translate(cx,cy);ctx.rotate(t*(i%2===0?1:-1)*(0.5+i*0.2));const rr=30+i*22;ctx.strokeStyle=`hsl(${i*40+t*20},80%,60%)`;ctx.lineWidth=1.5;ctx.beginPath();for(let j=0;j<sides;j++){const a=j/sides*Math.PI*2;j===0?ctx.moveTo(rr*Math.cos(a),rr*Math.sin(a)):ctx.lineTo(rr*Math.cos(a),rr*Math.sin(a));}ctx.closePath();ctx.stroke();ctx.restore();});},30);return()=>clearInterval(iv);},[]);return <canvas ref={r} style={{width:"100%",height:"100%"}}/>;} },
  {id:"clock",t:"🕐 Sanat Saati",d:"Canlı analog",Comp:()=>{const r=useRef();useEffect(()=>{const c=r.current;if(!c)return;c.width=c.offsetWidth||400;c.height=c.offsetHeight||300;const ctx=c.getContext("2d");const cx=c.width/2,cy=c.height/2,rad=Math.min(c.width,c.height)/2-20;const iv=setInterval(()=>{const now=new Date();ctx.fillStyle="#030609";ctx.fillRect(0,0,c.width,c.height);ctx.strokeStyle="#00dcff";ctx.lineWidth=2;ctx.shadowBlur=8;ctx.shadowColor="#00dcff";ctx.beginPath();ctx.arc(cx,cy,rad,0,Math.PI*2);ctx.stroke();ctx.shadowBlur=0;for(let i=0;i<12;i++){const a=i/12*Math.PI*2;const x1=cx+(rad-8)*Math.cos(a-Math.PI/2),y1=cy+(rad-8)*Math.sin(a-Math.PI/2),x2=cx+(rad-18)*Math.cos(a-Math.PI/2),y2=cy+(rad-18)*Math.sin(a-Math.PI/2);ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();}[[now.getHours()%12/12,"#a855f7",rad*.5,4],[now.getMinutes()/60,"#00dcff",rad*.7,2],[now.getSeconds()/60,"#ff4466",rad*.85,1]].forEach(([frac,col,len,lw])=>{const a=frac*Math.PI*2-Math.PI/2;ctx.strokeStyle=col;ctx.lineWidth=lw;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+len*Math.cos(a),cy+len*Math.sin(a));ctx.stroke();});},1000);return()=>clearInterval(iv);},[]);return <canvas ref={r} style={{width:"100%",height:"100%"}}/>;} },
];

class ErrorBoundary extends React.Component{
  constructor(props){super(props);this.state={err:false};}
  static getDerivedStateFromError(){return{err:true};}
  componentDidCatch(){}
  render(){if(this.state.err)return <div style={{padding:8,color:"#475569",fontSize:10,textAlign:"center"}}>⚠️</div>;return this.props.children;}
}
function Safe({children}){return <ErrorBoundary>{children}</ErrorBoundary>;}

function AnimasyonPage(){
  const[sel,setSel]=useState(null);
  function openAnim(a){setSel(a);}
  function closeAnim(){setSel(null);}
  if(sel){
    const AnimComp=sel.Comp;
    return (
      <div style={{position:"fixed",inset:0,zIndex:99999,background:"#000",display:"flex",flexDirection:"column"}}>
        <div style={{padding:"10px 16px",background:"rgba(0,0,0,0.9)",borderBottom:"1px solid rgba(0,220,255,0.15)",display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
          <button onClick={closeAnim} style={{padding:"6px 14px",border:"1px solid rgba(0,220,255,0.4)",borderRadius:20,background:"rgba(0,0,0,0.8)",color:"#00dcff",fontSize:12,cursor:"pointer",fontFamily:"monospace",fontWeight:700,flexShrink:0}}>✕ Çıkış</button>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:15,fontWeight:800,color:"#fff",fontFamily:"Space Grotesk,sans-serif"}}>{sel.t}</div>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.4)"}}>{sel.d}</div>
          </div>
        </div>
        <div style={{flex:1,position:"relative",overflow:"hidden"}}>
          <Safe><AnimComp/></Safe>
        </div>
      </div>
    );
  }
  return (
    <div style={{padding:"24px 16px",maxWidth:1200,margin:"0 auto"}}>
      <div style={{marginBottom:20}}>
        <div style={{fontSize:9,letterSpacing:".2em",color:"#a855f7",marginBottom:4}}>GÖRSEL ŞOV</div>
        <div style={{fontSize:22,fontWeight:900,color:"#e2e8f0",fontFamily:"Space Grotesk,sans-serif",marginBottom:6}}>🎬 AI Animasyon Galerisi</div>
        <div style={{fontSize:12,color:"#64748b"}}>{ANIMS.length} interaktif animasyon · Tıkla → Tam ekran</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:10}}>
        {ANIMS.map(function(anim){
          const Preview=anim.Comp;
          return (
            <div key={anim.id} onClick={()=>openAnim(anim)}
              style={{borderRadius:12,overflow:"hidden",cursor:"pointer",border:"1px solid rgba(168,85,247,0.2)",background:"rgba(168,85,247,0.04)",transition:"all .2s"}}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.borderColor="rgba(168,85,247,0.5)";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.borderColor="rgba(168,85,247,0.2)";}}>
              <div style={{height:120,background:"#030609",position:"relative",overflow:"hidden"}}>
                <Safe><Preview/></Safe>
                <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.25)"}}>
                  <div style={{width:40,height:40,borderRadius:"50%",background:"rgba(168,85,247,0.85)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,color:"#fff"}}>▶</div>
                </div>
              </div>
              <div style={{padding:"8px 10px"}}>
                <div style={{fontSize:11,fontWeight:700,color:"#e2e8f0",marginBottom:2,fontFamily:"Space Grotesk,sans-serif"}}>{anim.t}</div>
                <div style={{fontSize:9,color:"#475569"}}>{anim.d}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function GrokPage({setPage}){
  return <div style={{padding:"28px 20px",maxWidth:900,margin:"0 auto"}}>
    <div style={{background:"linear-gradient(135deg,rgba(0,0,0,0.4),rgba(251,146,60,0.05))",border:"1px solid rgba(251,146,60,0.25)",borderRadius:20,padding:"28px",marginBottom:20}}>
      <div style={{display:"flex",gap:14,alignItems:"center",marginBottom:16,flexWrap:"wrap"}}>
        <div style={{fontSize:52}}>⚡</div>
        <div><div style={{fontSize:26,fontWeight:900,color:"#fb923c",fontFamily:"'Space Grotesk',sans-serif"}}>Grok 3 — xAI</div>
        <div style={{fontSize:12,color:"#64748b"}}>Elon Musk'ın AI'ı · X/Twitter entegreli · Gerçek Zamanlı Veriler · Mizahi Kişilik</div></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))",gap:10,marginBottom:20}}>
        {[["⚡","Gerçek Zamanlı","X/Twitter verisi anlık"],["🎭","Mizahi Kişilik","'Grok mode' sansürsüz"],["🔬","Araştırma","DeepSearch özelliği"],["🖼️","Görsel Üretim","Aurora modeli dahil"],["💻","Kod Analiz","Güçlü programlama"],["🆓","Ücretsiz","X Premium dahil"]].map(([e,t,d])=>(
          <div key={t} style={{background:"rgba(251,146,60,0.08)",border:"1px solid rgba(251,146,60,0.18)",borderRadius:11,padding:"12px",textAlign:"center"}}>
            <div style={{fontSize:20,marginBottom:4}}>{e}</div>
            <div style={{fontSize:11,fontWeight:700,color:"#fb923c",marginBottom:2}}>{t}</div>
            <div style={{fontSize:9,color:"#475569"}}>{d}</div>
          </div>
        ))}
      </div>
      <div style={{fontSize:13,color:"#64748b",lineHeight:1.8,marginBottom:16}}>Grok, Elon Musk'ın xAI şirketi tarafından 2023'te duyuruldu. En büyük avantajı: <strong style={{color:"#fb923c"}}>X (Twitter) platformundaki gerçek zamanlı verilere</strong> erişim. "Bugün X'te ne konuşuluyor?" sorusunu anında cevaplayabilir. Grok 3, DeepSearch özelliğiyle akademik ve web araştırması da yapabiliyor.</div>
      <div style={{background:"rgba(0,0,0,0.3)",borderRadius:12,padding:"16px",marginBottom:16}}>
        <div style={{fontSize:11,fontWeight:700,color:"#fb923c",marginBottom:8}}>💡 Özel Prompt Şablonu</div>
        <div style={{fontFamily:"monospace",fontSize:11,color:"#94a3b8",lineHeight:1.8}}>{"X'te şu an [konu] hakkında ne konuşuluyor?\nEn viral tweetleri özetle.\nTürk kullanıcıların görüşleri ne?"}</div>
      </div>
      <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
        <a href="https://x.ai" target="_blank" rel="noopener noreferrer" style={{padding:"10px 22px",borderRadius:10,background:"linear-gradient(135deg,#fb923c,#f59e0b)",color:"#fff",fontSize:13,fontWeight:700,textDecoration:"none"}}>Grok'u Dene →</a>
        <ShareButton title="Grok 3 Rehberi" text="⚡ Grok 3 — Elon Musk'ın AI'ı! X/Twitter verisi gerçek zamanlı. Tam rehber:"/>
        <button onClick={()=>setPage("karsilastirma")} style={{padding:"10px 18px",borderRadius:10,border:"1px solid rgba(251,146,60,0.3)",background:"transparent",color:"#fb923c",fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>🆚 Diğerleriyle Karşılaştır</button>
      </div>
    </div>
  </div>;
}

function DeepSeekPage({setPage}){
  return <div style={{padding:"28px 20px",maxWidth:900,margin:"0 auto"}}>
    <div style={{background:"linear-gradient(135deg,rgba(96,165,250,0.08),rgba(0,0,0,0.2))",border:"1px solid rgba(96,165,250,0.25)",borderRadius:20,padding:"28px",marginBottom:20}}>
      <div style={{display:"flex",gap:14,alignItems:"center",marginBottom:16,flexWrap:"wrap"}}>
        <div style={{fontSize:52}}>🔬</div>
        <div><div style={{fontSize:26,fontWeight:900,color:"#60a5fa",fontFamily:"'Space Grotesk',sans-serif"}}>DeepSeek V4 — Çin</div>
        <div style={{fontSize:12,color:"#64748b"}}>Açık Kaynak · Matematikte Dünya Rekoru · Ücretsiz API · MIT Lisansı</div></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))",gap:10,marginBottom:20}}>
        {[["🔓","Açık Kaynak","MIT lisansı, ücretsiz"],["📐","Matematik #1","AIME'de en yüksek skor"],["💻","Kod Gücü","Programlama benchmark"],["🆓","Ücretsiz API","Aylık 500K token ücretsiz"],["🌏","Çin AI","DeepSeek şirketi, 2023"],["⚡","Hız","Çok hızlı inference"]].map(([e,t,d])=>(
          <div key={t} style={{background:"rgba(96,165,250,0.08)",border:"1px solid rgba(96,165,250,0.18)",borderRadius:11,padding:"12px",textAlign:"center"}}>
            <div style={{fontSize:20,marginBottom:4}}>{e}</div>
            <div style={{fontSize:11,fontWeight:700,color:"#60a5fa",marginBottom:2}}>{t}</div>
            <div style={{fontSize:9,color:"#475569"}}>{d}</div>
          </div>
        ))}
      </div>
      <div style={{fontSize:13,color:"#64748b",lineHeight:1.8,marginBottom:16}}>DeepSeek, Çin merkezli yapay zeka şirketi. 2025'te piyasaya çıktığında <strong style={{color:"#60a5fa"}}>matematikte dünya rekoru</strong> kırarak herkesi şaşırttı. Özellikle AIME (Amerikan Matematik Olimpiyatı) testlerinde GPT-4'ü geçti. En büyük avantajı: <strong style={{color:"#60a5fa"}}>MIT lisansı ile tamamen açık kaynak</strong> ve ücretsiz API erişimi.</div>
      <div style={{background:"rgba(0,0,0,0.3)",borderRadius:12,padding:"16px",marginBottom:16}}>
        <div style={{fontSize:11,fontWeight:700,color:"#60a5fa",marginBottom:8}}>💡 En İyi Kullanım Alanları</div>
        <div style={{fontSize:11,color:"#94a3b8",lineHeight:1.8}}>✅ Matematik ve fizik problemleri<br/>✅ Kod yazma ve debug<br/>✅ Açık kaynak projelere entegrasyon<br/>✅ Ücretsiz API gerektiren uygulamalar</div>
      </div>
      <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
        <a href="https://chat.deepseek.com" target="_blank" rel="noopener noreferrer" style={{padding:"10px 22px",borderRadius:10,background:"linear-gradient(135deg,#60a5fa,#3b82f6)",color:"#fff",fontSize:13,fontWeight:700,textDecoration:"none"}}>DeepSeek'i Dene →</a>
        <ShareButton title="DeepSeek Rehberi" text="🔬 DeepSeek V4 — Çin'in açık kaynak AI'ı! Matematikte dünya rekoru. Ücretsiz!"/>
      </div>
    </div>
  </div>;
}

function MistralPage({setPage}){
  return <div style={{padding:"28px 20px",maxWidth:900,margin:"0 auto"}}>
    <div style={{background:"linear-gradient(135deg,rgba(244,114,182,0.06),rgba(0,0,0,0.2))",border:"1px solid rgba(244,114,182,0.22)",borderRadius:20,padding:"28px",marginBottom:20}}>
      <div style={{display:"flex",gap:14,alignItems:"center",marginBottom:16,flexWrap:"wrap"}}>
        <div style={{fontSize:52}}>🇫🇷</div>
        <div><div style={{fontSize:26,fontWeight:900,color:"#f472b6",fontFamily:"'Space Grotesk',sans-serif"}}>Mistral Large — Fransa</div>
        <div style={{fontSize:12,color:"#64748b"}}>Avrupa'nın AI'ı · GDPR Uyumlu · Çok Dilli · Açık Kaynak Seçeneği</div></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))",gap:10,marginBottom:20}}>
        {[["🇪🇺","GDPR Uyumlu","AB veri gizliliği"],["🌍","Çok Dilli","Türkçe dahil 20+ dil"],["🔓","Açık Kaynak","Mistral 7B ve 8x7B ücretsiz"],["⚡","Hız","Mixtral MoE mimarisi"],["🔒","Veri Gizliliği","Veriler AB'de kalır"],["💼","Kurumsal","Enterprise seçenekleri"]].map(([e,t,d])=>(
          <div key={t} style={{background:"rgba(244,114,182,0.08)",border:"1px solid rgba(244,114,182,0.18)",borderRadius:11,padding:"12px",textAlign:"center"}}>
            <div style={{fontSize:20,marginBottom:4}}>{e}</div>
            <div style={{fontSize:11,fontWeight:700,color:"#f472b6",marginBottom:2}}>{t}</div>
            <div style={{fontSize:9,color:"#475569"}}>{d}</div>
          </div>
        ))}
      </div>
      <div style={{fontSize:13,color:"#64748b",lineHeight:1.8,marginBottom:16}}>Mistral AI, 2023'te Paris'te kurulan Avrupa'nın en önemli AI girişimi. AB kurumları, bankalar ve GDPR uyumluluğuna önem veren şirketlerin tercihi. <strong style={{color:"#f472b6"}}>Mixtral 8x7B</strong> modeli, 8 uzman modelin bir arada çalıştığı "Mixture of Experts" mimarisini kullanıyor — hem hızlı hem güçlü.</div>
      <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
        <a href="https://chat.mistral.ai" target="_blank" rel="noopener noreferrer" style={{padding:"10px 22px",borderRadius:10,background:"linear-gradient(135deg,#f472b6,#ec4899)",color:"#fff",fontSize:13,fontWeight:700,textDecoration:"none"}}>Mistral'ı Dene →</a>
        <ShareButton title="Mistral Rehberi" text="🇫🇷 Mistral — Avrupa'nın AI şampiyonu! GDPR uyumlu, Türkçe destekli."/>
      </div>
    </div>
  </div>;
}

function LlamaPage({setPage}){
  return <div style={{padding:"28px 20px",maxWidth:900,margin:"0 auto"}}>
    <div style={{background:"linear-gradient(135deg,rgba(52,211,153,0.06),rgba(0,0,0,0.2))",border:"1px solid rgba(52,211,153,0.22)",borderRadius:20,padding:"28px",marginBottom:20}}>
      <div style={{display:"flex",gap:14,alignItems:"center",marginBottom:16,flexWrap:"wrap"}}>
        <div style={{fontSize:52}}>🦙</div>
        <div><div style={{fontSize:26,fontWeight:900,color:"#34d399",fontFamily:"'Space Grotesk',sans-serif"}}>Llama 4 — Meta</div>
        <div style={{fontSize:12,color:"#64748b"}}>Meta AI · Tamamen Açık Kaynak · Ticari Kullanım Serbest · Kendi Sunucunda Çalıştır</div></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))",gap:10,marginBottom:20}}>
        {[["🆓","Tamamen Ücretsiz","Ticari kullanım açık"],["🖥️","Lokal Çalıştır","Kendi bilgisayarında"],["🔓","Açık Kaynak","Tam şeffaflık"],["💪","Güçlü","GPT-4 seviyesi"],["🌍","Global","180+ ülke erişimi"],["🔧","Özelleştir","Fine-tune edebilirsin"]].map(([e,t,d])=>(
          <div key={t} style={{background:"rgba(52,211,153,0.08)",border:"1px solid rgba(52,211,153,0.18)",borderRadius:11,padding:"12px",textAlign:"center"}}>
            <div style={{fontSize:20,marginBottom:4}}>{e}</div>
            <div style={{fontSize:11,fontWeight:700,color:"#34d399",marginBottom:2}}>{t}</div>
            <div style={{fontSize:9,color:"#475569"}}>{d}</div>
          </div>
        ))}
      </div>
      <div style={{fontSize:13,color:"#64748b",lineHeight:1.8,marginBottom:16}}>Meta'nın açık kaynak AI modeli. En büyük özelliği: <strong style={{color:"#34d399"}}>tamamen ücretsiz, ticari kullanıma açık</strong>. Kendi sunucunda veya bilgisayarında çalıştırabilirsin — veri gizliliği %100. Girişimler için mükemmel: API maliyeti sıfır, özelleştirme sınırsız. Ollama ile Mac/Linux'ta yerel kullanım mümkün.</div>
      <div style={{background:"rgba(0,0,0,0.3)",borderRadius:12,padding:"14px",marginBottom:16}}>
        <div style={{fontSize:11,fontWeight:700,color:"#34d399",marginBottom:6}}>🖥️ Lokal Kurulum (Ollama ile)</div>
        <div style={{fontFamily:"monospace",fontSize:11,color:"#94a3b8"}}>{"brew install ollama\nollama run llama3"}</div>
      </div>
      <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
        <a href="https://ai.meta.com/llama" target="_blank" rel="noopener noreferrer" style={{padding:"10px 22px",borderRadius:10,background:"linear-gradient(135deg,#34d399,#059669)",color:"#fff",fontSize:13,fontWeight:700,textDecoration:"none"}}>Llama'yı İndir →</a>
        <ShareButton title="Llama 4 Rehberi" text="🦙 Llama 4 — Meta'nın ücretsiz AI modeli! Ticari kullanım açık, kendi sunucunda çalıştır."/>
      </div>
    </div>
  </div>;
}

// ══════════════════════════════════════════════════════════
// MALİYET HESAPLAYICI
// ══════════════════════════════════════════════════════════
const MODEL_PRICES={
  "GPT-4o":{input:0.005,output:0.015,color:"#00dcff"},
  "GPT-4o mini":{input:0.00015,output:0.0006,color:"#60a5fa"},
  "Claude Opus 4.7":{input:0.015,output:0.075,color:"#a855f7"},
  "Claude Sonnet":{input:0.003,output:0.015,color:"#a855f7"},
  "Gemini 2.0 Flash":{input:0.0001,output:0.0004,color:"#34d399"},
  "Gemini Pro":{input:0.00125,output:0.005,color:"#34d399"},
};
function MaliyetPage(){
  const[tokens,setTokens]=useState(10000);const[daily,setDaily]=useState(100);
  return <div style={{padding:"28px 20px",maxWidth:860,margin:"0 auto"}}>
    <div style={{marginBottom:24}}>
      <div style={{fontSize:9,letterSpacing:".2em",color:"#fbbf24",marginBottom:5}}>API MALİYET</div>
      <div style={{fontSize:24,fontWeight:900,color:"#e2e8f0",fontFamily:"'Space Grotesk',sans-serif",marginBottom:6}}>💰 AI API Maliyet Hesaplayıcı</div>
      <div style={{fontSize:12,color:"#64748b"}}>Farklı AI modellerin API maliyetlerini karşılaştır. 1M token başına $USD.</div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:24}}>
      {[["Günlük istek sayısı","daily",1,10000,daily,setDaily],["İstek başına token","tokens",100,100000,tokens,setTokens]].map(([l,k,mn,mx,val,set])=>(
        <div key={k} style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:12,padding:"16px"}}>
          <div style={{fontSize:11,color:"#94a3b8",marginBottom:8}}>{l}</div>
          <input type="range" min={mn} max={mx} value={val} onChange={e=>set(+e.target.value)} style={{width:"100%",accentColor:"#fbbf24",marginBottom:6}}/>
          <div style={{fontSize:18,fontWeight:900,color:"#fbbf24",textAlign:"center"}}>{val.toLocaleString()}</div>
        </div>
      ))}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:10}}>
      {Object.entries(MODEL_PRICES).map(([name,p])=>{
        const monthlyTokens=daily*30*tokens;
        const cost=(monthlyTokens/1000000)*((p.input+p.output)/2);
        const costTL=cost*33;
        return <div key={name} style={{background:`${p.color}06`,border:`1px solid ${p.color}18`,borderRadius:13,padding:"16px"}}>
          <div style={{fontSize:13,fontWeight:700,color:p.color,marginBottom:4,fontFamily:"'Space Grotesk',sans-serif"}}>{name}</div>
          <div style={{fontSize:10,color:"#475569",marginBottom:12}}>Input: ${p.input}/1M · Output: ${p.output}/1M</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <div style={{background:"rgba(0,0,0,0.3)",borderRadius:8,padding:"10px",textAlign:"center"}}>
              <div style={{fontSize:16,fontWeight:900,color:p.color}}>${cost.toFixed(2)}</div>
              <div style={{fontSize:9,color:"#475569"}}>Aylık ($)</div>
            </div>
            <div style={{background:"rgba(0,0,0,0.3)",borderRadius:8,padding:"10px",textAlign:"center"}}>
              <div style={{fontSize:16,fontWeight:900,color:p.color}}>₺{Math.round(costTL)}</div>
              <div style={{fontSize:9,color:"#475569"}}>Aylık (₺)</div>
            </div>
          </div>
        </div>;
      })}
    </div>
    <div style={{marginTop:16,fontSize:10,color:"#334155",textAlign:"center"}}>* Fiyatlar tahmini olup değişebilir. Güncel fiyatlar için ilgili API sayfalarını kontrol edin.</div>
  </div>;
}

// ══════════════════════════════════════════════════════════
// FLASHCARD OYUNU
// ══════════════════════════════════════════════════════════
const FLASHCARD_DATA=[
  {q:"LLM nedir?",a:"Large Language Model — büyük metin verisiyle eğitilmiş, dil anlayan yapay zeka modeli."},
  {q:"Hallüsinasyon nedir?",a:"AI'ın yanlış veya uydurma bilgiyi gerçekmiş gibi güvenle sunması."},
  {q:"Token nedir?",a:"AI'ın metni işlediği en küçük birim. 1 token ≈ 3/4 kelime. 100 token ≈ 75 kelime."},
  {q:"Prompt Engineering nedir?",a:"AI'dan en iyi sonucu almak için soruyu/talimatı doğru formüle etme sanatı."},
  {q:"Fine-tuning nedir?",a:"Önceden eğitilmiş bir modeli, özel veri setiyle belirli bir göreve adapt etme işlemi."},
  {q:"RAG nedir?",a:"Retrieval-Augmented Generation: AI'ın dış kaynaklara erişerek güncel bilgi kullanması."},
  {q:"Constitutional AI nedir?",a:"Anthropic'in geliştirdiği yöntem: AI, etik ilkeler anayasasına göre kendi çıktısını değerlendirir."},
  {q:"Context Window nedir?",a:"AI'ın bir sohbette aynı anda işleyebileceği maksimum token miktarı."},
  {q:"Zero-shot prompting nedir?",a:"AI'a hiç örnek vermeden doğrudan görevi tarif etmek."},
  {q:"Few-shot prompting nedir?",a:"AI'a 2-5 örnek göstererek istenen formatı veya stili öğretmek."},
  {q:"Chain of Thought nedir?",a:"AI'ı 'adım adım düşün' diyerek yönlendirme tekniği. Doğruluğu artırır."},
  {q:"SWE-bench nedir?",a:"Yazılım mühendisliği benchmarkı: Gerçek GitHub issue'larını çözme testi."},
  {q:"MCP nedir?",a:"Model Context Protocol: Anthropic'in AI ajanların araçlara bağlanma standardı."},
  {q:"Agentic AI nedir?",a:"Otonom olarak çoklu adım atabilen, araç kullanan, karar veren AI sistemi."},
  {q:"Embedding nedir?",a:"Metni yüksek boyutlu sayısal vektöre dönüştürme. Benzerlik arama için kullanılır."},
  {q:"RLHF nedir?",a:"Reinforcement Learning from Human Feedback: İnsan geri bildirimiyle pekiştirmeli öğrenme."},
];
function FlashcardPage(){
  const[idx,setIdx]=useState(0);const[flipped,setFlipped]=useState(false);const[known,setKnown]=useState([]);const[unknown,setUnknown]=useState([]);
  const card=FLASHCARD_DATA[idx%FLASHCARD_DATA.length];
  function next(ok){if(ok)setKnown(k=>[...k,idx]);else setUnknown(k=>[...k,idx]);setIdx(i=>i+1);setFlipped(false);playSound(ok?"correct":"wrong");}
  const progress=Math.round(((known.length+unknown.length)/FLASHCARD_DATA.length)*100);
  return <div style={{padding:"28px 20px",maxWidth:640,margin:"0 auto",textAlign:"center"}}>
    <div style={{fontSize:9,letterSpacing:".2em",color:"#00dcff",marginBottom:6}}>ÖĞRENME KARTLARI</div>
    <div style={{fontSize:24,fontWeight:900,color:"#e2e8f0",fontFamily:"'Space Grotesk',sans-serif",marginBottom:6}}>🃏 AI Flashcard</div>
    <div style={{fontSize:12,color:"#64748b",marginBottom:20}}>{FLASHCARD_DATA.length} AI terimi · Kart çevirerek öğren · Kaydederek tekrar et</div>
    <div style={{height:5,background:"rgba(255,255,255,0.06)",borderRadius:3,marginBottom:16}}>
      <div style={{width:`${progress}%`,height:"100%",background:"linear-gradient(90deg,#00dcff,#a855f7)",borderRadius:3,transition:"width .4s"}}/>
    </div>
    <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"#475569",marginBottom:20}}>
      <span>✅ Biliyorum: {known.length}</span>
      <span>{idx%FLASHCARD_DATA.length+1}/{FLASHCARD_DATA.length}</span>
      <span>❌ Tekrar: {unknown.length}</span>
    </div>
    <div onClick={()=>setFlipped(f=>!f)} style={{background:flipped?"rgba(0,220,255,0.06)":"rgba(255,255,255,0.03)",border:`1px solid ${flipped?"rgba(0,220,255,0.3)":"rgba(255,255,255,0.08)"}`,borderRadius:20,padding:"40px 28px",marginBottom:20,cursor:"pointer",minHeight:180,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",transition:"all .3s",boxShadow:flipped?"0 0 32px rgba(0,220,255,0.1)":"none"}}>
      {!flipped?<>
        <div style={{fontSize:11,color:"#475569",marginBottom:12,letterSpacing:".1em"}}>SORU — Tıkla ve cevabı gör</div>
        <div style={{fontSize:20,fontWeight:700,color:"#e2e8f0",lineHeight:1.5,fontFamily:"'Space Grotesk',sans-serif"}}>{card.q}</div>
      </>:<>
        <div style={{fontSize:11,color:"#00dcff",marginBottom:12,letterSpacing:".1em"}}>CEVAP</div>
        <div style={{fontSize:15,color:"#94a3b8",lineHeight:1.7}}>{card.a}</div>
      </>}
    </div>
    {flipped&&<div style={{display:"flex",gap:12,justifyContent:"center"}}>
      <button onClick={()=>next(false)} style={{flex:1,padding:"12px",borderRadius:12,border:"1px solid rgba(244,114,182,0.4)",background:"rgba(244,114,182,0.08)",color:"#f472b6",fontSize:14,cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>❌ Tekrar Et</button>
      <button onClick={()=>next(true)} style={{flex:1,padding:"12px",borderRadius:12,border:"1px solid rgba(52,211,153,0.4)",background:"rgba(52,211,153,0.08)",color:"#34d399",fontSize:14,cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>✅ Biliyorum!</button>
    </div>}
    {!flipped&&<button onClick={()=>{setFlipped(true);}} style={{padding:"11px 32px",borderRadius:12,border:"none",background:"linear-gradient(135deg,#00dcff,#a855f7)",color:"#fff",fontSize:14,cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>Cevabı Gör 👁️</button>}
  </div>;
}

// ══════════════════════════════════════════════════════════
// KİŞİSEL DASHBOARD
// ══════════════════════════════════════════════════════════
function DashboardPage({setPage}){
  const[stats,setStats]=useState({});
  useEffect(()=>{
    try{
      const visited=JSON.parse(localStorage.getItem("imdatai_visited")||"[]");
      const badges=JSON.parse(localStorage.getItem("imdatai_badges")||"[]");
      const missions=JSON.parse(localStorage.getItem("imdatai_missions_"+new Date().toDateString())||"[]");
      const totalXP=badges.length*50+missions.length*15+visited.length*5;
      setStats({visited:visited.length,badges:badges.length,missions:missions.length,xp:totalXP,badgeList:badges,visitedList:visited});
    }catch(e){setStats({visited:0,badges:0,missions:0,xp:0,badgeList:[],visitedList:[]});}
  },[]);
  const level=stats.xp>=300?"🏆 Uzman":stats.xp>=150?"🥇 İleri":stats.xp>=75?"🥈 Orta":"🥉 Başlangıç";
  const xpToNext=stats.xp>=300?0:stats.xp>=150?300-stats.xp:stats.xp>=75?150-stats.xp:75-stats.xp;
  const badgeDefs={bronze:{e:"🥉",l:"Kaşif"},silver:{e:"🥈",l:"Öğrenci"},gold:{e:"🥇",l:"Uzman"}};
  const PAGE_NAMES={home:"Ana Sayfa",haberler:"Haberler",claude:"Claude",chatgpt:"ChatGPT",gemini:"Gemini",grok:"Grok",trivia:"Trivia",roulette:"Roulette",puan:"Prompt Puanla",tools:"Tools",para:"Para Kazan",kariyer:"Kariyer",iqtest:"IQ Testi",cark:"Şans Çarkı",animasyon:"Animasyon",flashcard:"Flashcard"};
  return <div style={{padding:"28px 20px",maxWidth:860,margin:"0 auto"}}>
    <div style={{marginBottom:24}}>
      <div style={{fontSize:9,letterSpacing:".2em",color:"#00dcff",marginBottom:5}}>KİŞİSEL</div>
      <div style={{fontSize:24,fontWeight:900,color:"#e2e8f0",fontFamily:"'Space Grotesk',sans-serif"}}>📊 Benim IMDATAI Dashboard'um</div>
      <div style={{fontSize:11,color:"#64748b",marginTop:4}}>localStorage tabanlı · Hesap gerekmez · Sadece sana özel</div>
    </div>
    {/* XP + Seviye */}
    <div style={{background:"linear-gradient(135deg,rgba(0,220,255,0.08),rgba(168,85,247,0.06))",border:"1px solid rgba(0,220,255,0.2)",borderRadius:18,padding:"24px",marginBottom:16}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:12}}>
        <div>
          <div style={{fontSize:28,marginBottom:4}}>{level.split(" ")[0]}</div>
          <div style={{fontSize:18,fontWeight:800,color:"#e2e8f0",fontFamily:"'Space Grotesk',sans-serif"}}>{level.split(" ")[1]}</div>
          <div style={{fontSize:11,color:"#64748b"}}>Toplam {stats.xp||0} XP{xpToNext>0?` · Sonraki seviye: ${xpToNext} XP daha`:""}</div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:36,fontWeight:900,color:"#00dcff"}}>{stats.xp||0}</div>
          <div style={{fontSize:10,color:"#475569"}}>Toplam XP</div>
        </div>
      </div>
      <div style={{height:8,background:"rgba(255,255,255,0.06)",borderRadius:4,overflow:"hidden"}}>
        <div style={{width:`${Math.min((stats.xp||0)/300*100,100)}%`,height:"100%",background:"linear-gradient(90deg,#00dcff,#a855f7)",borderRadius:4,transition:"width .6s ease"}}/>
      </div>
    </div>
    {/* Stats Grid */}
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:12,marginBottom:16}}>
      {[[stats.visited||0,"Ziyaret Edilen","Farklı sayfa","#00dcff","📄"],[stats.badges||0,"Kazanılan Rozet","Toplam başarı","#fb923c","🏅"],[stats.missions||0,"Bugünkü Görev","Tamamlanan","#34d399","📋"],[(stats.xp||0),"Toplam XP","Deneyim puanı","#a855f7","⭐"]].map(([v,t,d,c,e])=>(
        <div key={t} style={{background:`${c}08`,border:`1px solid ${c}18`,borderRadius:13,padding:"16px",textAlign:"center"}}>
          <div style={{fontSize:24,marginBottom:4}}>{e}</div>
          <div style={{fontSize:22,fontWeight:900,color:c,fontFamily:"'Space Grotesk',sans-serif"}}>{v}</div>
          <div style={{fontSize:11,fontWeight:600,color:"#94a3b8",marginBottom:2}}>{t}</div>
          <div style={{fontSize:9,color:"#475569"}}>{d}</div>
        </div>
      ))}
    </div>
    {/* Rozetler */}
    {stats.badgeList?.length>0&&<div style={{background:"rgba(251,146,60,0.05)",border:"1px solid rgba(251,146,60,0.15)",borderRadius:14,padding:"16px",marginBottom:12}}>
      <div style={{fontSize:11,fontWeight:700,color:"#fb923c",marginBottom:10}}>🏅 Kazanılan Rozetler</div>
      <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
        {stats.badgeList.map(b=><div key={b} style={{display:"flex",gap:8,alignItems:"center",background:"rgba(251,146,60,0.1)",borderRadius:9,padding:"8px 14px"}}>
          <span style={{fontSize:20}}>{badgeDefs[b]?.e}</span>
          <div style={{fontSize:12,fontWeight:600,color:"#fb923c"}}>{badgeDefs[b]?.l}</div>
        </div>)}
      </div>
    </div>}
    {/* Ziyaret Edilen Sayfalar */}
    {stats.visitedList?.length>0&&<div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:14,padding:"16px",marginBottom:16}}>
      <div style={{fontSize:11,fontWeight:700,color:"#64748b",marginBottom:10}}>📄 Ziyaret Ettiğin Sayfalar</div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
        {stats.visitedList.slice(0,20).map(p=><div key={p} onClick={()=>setPage(p)} style={{fontSize:10,color:"#00dcff",background:"rgba(0,220,255,0.08)",border:"1px solid rgba(0,220,255,0.15)",borderRadius:6,padding:"4px 10px",cursor:"pointer"}}>{PAGE_NAMES[p]||p}</div>)}
      </div>
    </div>}
    {/* Öneriler */}
    <div style={{background:"rgba(168,85,247,0.05)",border:"1px solid rgba(168,85,247,0.15)",borderRadius:14,padding:"16px"}}>
      <div style={{fontSize:11,fontWeight:700,color:"#a855f7",marginBottom:10}}>🎯 Sana Özel Öneriler</div>
      <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
        {(stats.visited||0)<5&&<button onClick={()=>setPage("ogrenme")} style={{padding:"8px 16px",borderRadius:9,border:"1px solid rgba(168,85,247,0.3)",background:"rgba(168,85,247,0.08)",color:"#a855f7",fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>🎓 AI Öğren sayfasını dene</button>}
        {(stats.badges||0)<1&&<button onClick={()=>setPage("trivia")} style={{padding:"8px 16px",borderRadius:9,border:"1px solid rgba(251,146,60,0.3)",background:"rgba(251,146,60,0.08)",color:"#fb923c",fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>🏆 İlk rozetini kazan</button>}
        <button onClick={()=>setPage("cark")} style={{padding:"8px 16px",borderRadius:9,border:"1px solid rgba(52,211,153,0.3)",background:"rgba(52,211,153,0.08)",color:"#34d399",fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>🎰 Şans Çarkını Çevir</button>
        <button onClick={()=>setPage("gorev")} style={{padding:"8px 16px",borderRadius:9,border:"1px solid rgba(0,220,255,0.3)",background:"rgba(0,220,255,0.08)",color:"#00dcff",fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>📋 Günlük Görevler</button>
      </div>
    </div>
  </div>;
}

// ══════════════════════════════════════════════════════════
// AI KİŞİLİĞİ SEÇİCİ
// ══════════════════════════════════════════════════════════
const PERSONAS=[
  {id:"arastirmaci",e:"🔬",t:"Araştırmacı",d:"Akademik, kaynaklı, derinlemesine",color:"#60a5fa",pages:["ogrenme","sozluk","prompt","karsilastirma","mitler"],ipucu:"Perplexity + Claude kombinasyonu seni rakipsiz yapar. Kaynaklı araştırma için Perplexity, derin analiz için Claude.",tools:["Perplexity","Claude","Elicit","Consensus"]},
  {id:"isinsani",e:"💼",t:"İş İnsanı",d:"Pratik, hızlı, sonuç odaklı",color:"#34d399",pages:["para","kariyer","tools","claude","puan"],ipucu:"ChatGPT + Claude ikilisi iş dünyasında ölümcül kombinasyon. GPT hızlı sunum, Claude derin analiz.",tools:["ChatGPT","Claude","Gamma","Notion AI"]},
  {id:"yaratici",e:"🎨",t:"Yaratıcı",d:"İlham verici, görsel, özgün",color:"#f472b6",pages:["galeri","animasyon","cark","roulette","prompt"],ipucu:"Midjourney + ChatGPT + Suno üçlüsü yaratıcı projelerde büyülü. Görsel + metin + ses = tam paket.",tools:["Midjourney","ChatGPT","Suno","ElevenLabs"]},
  {id:"oyuncu",e:"🎮",t:"Oyuncu",d:"Eğlenceli, yarışmacı, sosyal",color:"#fb923c",pages:["trivia","cark","dedektif","emoji","iqtest"],ipucu:"Trivia'da streak yap, IQ testini paylaş, şans çarkında bağımlı ol. Rekabet ateşini canlı tut!",tools:["Trivia","IQ Test","Şans Çarkı","Dedektif"]},
  {id:"gelistirici",e:"💻",t:"Geliştirici",d:"Teknik, kod, verimli",color:"#a855f7",pages:["claude","tools","maliyet","puan","flashcard"],ipucu:"Cursor + Claude Code ikilisi 2026'nın en güçlü dev setup'ı. Task Budget ile maliyet kontrolü şart.",tools:["Cursor","Claude Code","GitHub Copilot","v0.dev"]},
  {id:"ogrenci",e:"📚",t:"Öğrenci",d:"Öğrenme odaklı, meraklı",color:"#00dcff",pages:["ogrenme","flashcard","sozluk","mitler","karsilastirma"],ipucu:"ChatGPT Feynman tekniğiyle öğret: 'Bunu 12 yaşında birine anlatır gibi açıkla'. Öğrenme hızın 3x artar!",tools:["ChatGPT","Perplexity","Notion AI","Claude"]},
];
function KisilikPage({setPage}){
  const[sel,setSel]=useState(()=>{try{return localStorage.getItem("imdatai_persona")||null;}catch{return null;}});
  function choose(id){setSel(id);try{localStorage.setItem("imdatai_persona",id);}catch{}playSound("level");}
  const p=sel?PERSONAS.find(p=>p.id===sel):null;
  return <div style={{padding:"28px 20px",maxWidth:860,margin:"0 auto"}}>
    <div style={{marginBottom:24,textAlign:"center"}}>
      <div style={{fontSize:9,letterSpacing:".2em",color:"#f472b6",marginBottom:5}}>KİŞİSELLEŞTİR</div>
      <div style={{fontSize:24,fontWeight:900,color:"#e2e8f0",fontFamily:"'Space Grotesk',sans-serif",marginBottom:6}}>🤖 AI Kişiliğini Seç</div>
      <div style={{fontSize:12,color:"#64748b"}}>Seçtiğine göre sana özel içerik, araç ve ipuçları sunalım</div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))",gap:12,marginBottom:24}}>
      {PERSONAS.map(persona=>(
        <div key={persona.id} onClick={()=>choose(persona.id)} className="card-hover" style={{background:sel===persona.id?`${persona.color}12`:"rgba(255,255,255,0.02)",border:`2px solid ${sel===persona.id?persona.color:persona.color+"22"}`,borderRadius:14,padding:"18px",cursor:"pointer",transition:"all .2s"}}>
          <div style={{fontSize:36,marginBottom:8}}>{persona.e}</div>
          <div style={{fontSize:14,fontWeight:800,color:sel===persona.id?persona.color:"#e2e8f0",marginBottom:4,fontFamily:"'Space Grotesk',sans-serif"}}>{persona.t}</div>
          <div style={{fontSize:11,color:"#64748b",marginBottom:8}}>{persona.d}</div>
          <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
            {persona.tools.map(t=><span key={t} style={{fontSize:8,color:persona.color,background:`${persona.color}12`,borderRadius:4,padding:"2px 6px"}}>{t}</span>)}
          </div>
          {sel===persona.id&&<div style={{marginTop:8,fontSize:10,color:persona.color,fontWeight:700}}>✅ Seçili</div>}
        </div>
      ))}
    </div>
    {p&&<div style={{background:`${p.color}06`,border:`1px solid ${p.color}20`,borderRadius:16,padding:"20px",animation:"fadeIn .3s ease"}}>
      <div style={{fontSize:12,fontWeight:700,color:p.color,marginBottom:10}}>💡 {p.t} İçin Altın İpucu</div>
      <div style={{fontSize:13,color:"#94a3b8",lineHeight:1.7,marginBottom:16,fontStyle:"italic"}}>"{p.ipucu}"</div>
      <div style={{marginBottom:14}}>
        <div style={{fontSize:10,color:"#475569",marginBottom:8}}>ÖNERİLEN SAYFALAR:</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {p.pages.map(pg=>{const n={ogrenme:"🎓 Öğren",sozluk:"📖 Sözlük",prompt:"💡 Prompt",karsilastirma:"🆚 Karşılaştır",mitler:"🔍 Mitler",para:"💰 Para",kariyer:"🚀 Kariyer",tools:"🛠️ Tools",claude:"🧠 Claude",puan:"💡 Puanla",galeri:"🎨 Galeri",animasyon:"🎬 Animasyon",cark:"🎰 Çark",roulette:"🎡 Roulette",trivia:"🏆 Trivia",dedektif:"🔍 Dedektif",emoji:"😄 Emoji",iqtest:"🧠 IQ",flashcard:"🃏 Flashcard",maliyet:"💸 Maliyet"}[pg]||pg;return <button key={pg} onClick={()=>setPage(pg)} style={{padding:"7px 14px",borderRadius:9,border:`1px solid ${p.color}30`,background:`${p.color}10`,color:p.color,fontSize:11,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>{n}</button>;})}
        </div>
      </div>
    </div>}
  </div>;
}

// ══════════════════════════════════════════════════════════
// PARALAKS + AMBIENT SES + SESLI KARŞILAMA
// ══════════════════════════════════════════════════════════
function useParallax(){
  useEffect(()=>{
    const h=()=>{const y=window.scrollY;document.querySelectorAll("[data-parallax]").forEach(el=>{const speed=parseFloat(el.dataset.parallax||"0.3");el.style.transform=`translateY(${y*speed}px)`;});};
    window.addEventListener("scroll",h,{passive:true});
    return()=>window.removeEventListener("scroll",h);
  },[]);
}

function AmbientSound(){
  const[on,setOn]=useState(false);const[ctx,setCtx]=useState(null);const nodesRef=useRef([]);
  function toggle(){
    if(on){nodesRef.current.forEach(n=>{try{n.stop();}catch{}});nodesRef.current=[];if(ctx){ctx.close();setCtx(null);}setOn(false);return;}
    try{
      const ac=new(window.AudioContext||window.webkitAudioContext)();setCtx(ac);
      // Deep drone
      const osc=ac.createOscillator();const gain=ac.createGain();const filter=ac.createBiquadFilter();
      osc.type="sine";osc.frequency.setValueAtTime(40,ac.currentTime);osc.frequency.linearRampToValueAtTime(45,ac.currentTime+8);
      filter.type="lowpass";filter.frequency.value=200;gain.gain.setValueAtTime(0,ac.currentTime);gain.gain.linearRampToValueAtTime(0.08,ac.currentTime+2);
      osc.connect(filter);filter.connect(gain);gain.connect(ac.destination);osc.start();
      // High shimmer
      const osc2=ac.createOscillator();const gain2=ac.createGain();
      osc2.type="sine";osc2.frequency.setValueAtTime(528,ac.currentTime);
      gain2.gain.setValueAtTime(0,ac.currentTime);gain2.gain.linearRampToValueAtTime(0.02,ac.currentTime+3);
      osc2.connect(gain2);gain2.connect(ac.destination);osc2.start();
      nodesRef.current=[osc,osc2];setOn(true);
    }catch{}
  }
  return <button onClick={toggle} style={{position:"fixed",right:24,bottom:200,zIndex:490,background:on?"rgba(0,220,255,0.15)":"rgba(255,255,255,0.05)",border:`1px solid ${on?"rgba(0,220,255,0.4)":"rgba(255,255,255,0.1)"}`,borderRadius:10,padding:"7px 12px",cursor:"pointer",fontFamily:"inherit",color:on?"#00dcff":"#475569",fontSize:10,fontWeight:600}} title={on?"Sesi Kapat":"Ambient Ses Aç"}>
    {on?"🔊 Ses Açık":"🔇 Ambient"}
  </button>;
}

function useSesliKarsilama(){
  useEffect(()=>{
    if(sessionStorage.getItem("imdatai_greeted"))return;
    sessionStorage.setItem("imdatai_greeted","1");
    try{
      const s=new SpeechSynthesisUtterance("Hoş geldin. IMDATAI'ya.");
      s.lang="tr-TR";s.rate=0.85;s.pitch=0.9;s.volume=0.6;
      setTimeout(()=>window.speechSynthesis.speak(s),2000);
    }catch{}
  },[]);
}

// ── NAVIGATION ─────────────────────────────────────────────
const NAV_GROUPS=[
  {id:"home",label:"Ana Sayfa"},
  {id:"haberler",label:"Haberler"},
  {id:"blog",label:"Blog"},
  {id:"ai_m",label:"🤖 AI Modeller",sub:[
    {id:"claude",label:"Claude",icon:"🧠",desc:"Kodlamada #1 · 1M token"},
    {id:"chatgpt",label:"ChatGPT",icon:"🤖",desc:"900M kullanıcı · GPT-5.5"},
    {id:"gemini",label:"Gemini",icon:"🌟",desc:"2M token · Google ekosistemi"},
    {id:"grok",label:"Grok 3",icon:"⚡",desc:"xAI · X/Twitter verisi"},
    {id:"deepseek",label:"DeepSeek",icon:"🔬",desc:"Açık kaynak · Matematik #1"},
    {id:"mistral",label:"Mistral",icon:"🇫🇷",desc:"Avrupa AI · GDPR uyumlu"},
    {id:"llama",label:"Llama 4",icon:"🦙",desc:"Meta · Tamamen ücretsiz"},
    {id:"karsilastirma",label:"Karşılaştır",icon:"🆚",desc:"Tüm modeller yan yana"},
  ]},
  {id:"eg",label:"🎓 Öğren",sub:[
    {id:"ogrenme",label:"AI Öğren",icon:"🎓",desc:"Sıfırdan uzmanlığa"},
    {id:"prompt",label:"Prompt Rehberi",icon:"💡",desc:"75 örnek · 13 kategori"},
    {id:"sozluk",label:"AI Sözlük",icon:"📖",desc:"69 AI terimi"},
    {id:"flashcard",label:"AI Flashcard",icon:"🃏",desc:"Kart çevirerek öğren"},
    {id:"mitler",label:"AI Mitleri",icon:"🔍",desc:"Doğru/yanlış ayırt et"},
    {id:"para",label:"Para Kazan",icon:"💰",desc:"AI gelir rehberi"},
    {id:"kariyer",label:"Kariyer",icon:"🚀",desc:"AI meslekleri · Maaşlar"},
  ]},
  {id:"oy",label:"🎮 Oyun & Araçlar",sub:[
    {id:"oyunlar",label:"Tüm Oyunlar",icon:"🎮",desc:"10 oyun bir arada"},
    {id:"trivia",label:"AI Trivia",icon:"🏆",desc:"50 soru · Streak sistemi"},
    {id:"roulette",label:"Prompt Roulette",icon:"🎡",desc:"30sn yarışması"},
    {id:"dedektif",label:"Model Dedektif",icon:"🔍",desc:"GPT mi Claude mi?"},
    {id:"emoji",label:"Emoji Tahmin",icon:"😄",desc:"AI kelime bul"},
    {id:"iqtest",label:"AI IQ Testi",icon:"🧠",desc:"Paylaşılabilir kart"},
    {id:"cark",label:"Şans Çarkı",icon:"🎰",desc:"Rastgele içerik kazan"},
    {id:"flashcard",label:"AI Flashcard",icon:"🃏",desc:"16 AI terimi öğren"},
    {id:"puan",label:"Prompt Puanla",icon:"💡",desc:"Gemini AI analizi"},
    {id:"zaman",label:"Zaman Hesapla",icon:"⏱️",desc:"AI tasarruf hesabı"},
    {id:"maliyet",label:"Maliyet Hesapla",icon:"💸",desc:"API maliyet karşılaştır"},
    {id:"gorev",label:"Günlük Görev",icon:"📋",desc:"XP kazan · Rozet"},
  ]},
  {id:"ar",label:"🛠️ Araçlar",sub:[
    {id:"tools",label:"Tools Dizini",icon:"🛠️",desc:"45+ AI aracı rehberi"},
    {id:"animasyon",label:"Animasyon Galerisi",icon:"🎬",desc:"8 fullscreen animasyon"},
    {id:"aistatus",label:"AI Durumu",icon:"📡",desc:"Canlı araç durumu"},
    {id:"galeri",label:"AI Galeri",icon:"🎨",desc:"Görsel koleksiyonu"},
    {id:"topluluk",label:"Topluluk",icon:"💬",desc:"Prompt paylaşım"},
    {id:"oneri",label:"Kişisel Öneri",icon:"🎯",desc:"Sana özel AI paketi"},
    {id:"dizin",label:"Araç Dizini",icon:"🗂️",desc:"Kategorili araç listesi"},
    {id:"pro",label:"Pro Araçlar",icon:"⭐",desc:"Yakında"},
  ]},
];
const NAV_ITEMS=NAV_GROUPS;const NAV=NAV_GROUPS;


// ══════════════════════════════════════════════════════════
// CURSOR IŞIK İZİ
// ══════════════════════════════════════════════════════════
function CursorTrail(){
  const r=useRef();const pts=useRef([]);
  useEffect(()=>{
    const c=r.current;if(!c)return;
    c.style.position="fixed";c.style.inset="0";c.style.zIndex="9998";c.style.pointerEvents="none";
    c.width=window.innerWidth;c.height=window.innerHeight;
    const ctx=c.getContext("2d");
    const onMove=e=>{pts.current.push({x:e.clientX,y:e.clientY,t:Date.now(),size:Math.random()*3+2});if(pts.current.length>40)pts.current.shift();};
    window.addEventListener("mousemove",onMove);
    let af;
    function draw(){
      ctx.clearRect(0,0,c.width,c.height);
      const now=Date.now();
      pts.current=pts.current.filter(p=>now-p.t<600);
      pts.current.forEach((p,i)=>{
        const age=(now-p.t)/600;const alpha=1-age;
        const hue=200+i*3;
        ctx.beginPath();ctx.arc(p.x,p.y,p.size*(1-age*0.5),0,Math.PI*2);
        ctx.fillStyle=`hsla(${hue},100%,70%,${alpha*0.6})`;ctx.fill();
        if(i>0){
          const prev=pts.current[i-1];
          ctx.beginPath();ctx.moveTo(prev.x,prev.y);ctx.lineTo(p.x,p.y);
          ctx.strokeStyle=`hsla(${hue},100%,60%,${alpha*0.3})`;
          ctx.lineWidth=p.size*(1-age);ctx.stroke();
        }
      });
      af=requestAnimationFrame(draw);
    }
    draw();
    const onResize=()=>{c.width=window.innerWidth;c.height=window.innerHeight;};
    window.addEventListener("resize",onResize);
    return()=>{cancelAnimationFrame(af);window.removeEventListener("mousemove",onMove);window.removeEventListener("resize",onResize);};
  },[]);
  return <canvas ref={r}/>;
}

// ══════════════════════════════════════════════════════════
// JARVIS HUD HERO ARKA PLAN
// ══════════════════════════════════════════════════════════
function JarvisHUD(){
  const r=useRef();
  useEffect(()=>{
    const c=r.current;if(!c)return;
    const ctx=c.getContext("2d");
    let W=c.width=window.innerWidth;let H=c.height=window.innerHeight;
    let t=0;let af;
    const onResize=()=>{W=c.width=window.innerWidth;H=c.height=window.innerHeight;};
    window.addEventListener("resize",onResize);
    // Particles
    const particles=Array.from({length:60},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.4,r:Math.random()*1.5+.5,c:Math.random()>.5?"#00dcff":"#a855f7"}));
    // Data nodes
    const nodes=Array.from({length:8},(_,i)=>({x:W*.1+Math.random()*W*.8,y:H*.1+Math.random()*H*.8,label:["GPT-5.5","Claude","Gemini","MCP","RAG","LLM","AI","NLP"][i],val:Math.random()}));
    function draw(){
      t+=0.01;
      ctx.fillStyle="rgba(6,10,20,0.08)";ctx.fillRect(0,0,W,H);
      // Hexagonal grid
      const hx=60;const hy=52;
      for(let row=-1;row<H/hy+1;row++){for(let col=-1;col<W/hx+1;col++){
        const ox=row%2===0?0:hx/2;const x=col*hx+ox;const y=row*hy;
        const dist=Math.hypot(x-W/2,y-H/2);const alpha=Math.max(0,.025-dist/W*.02);
        if(alpha<.001)continue;
        ctx.beginPath();
        for(let a=0;a<6;a++){const angle=a*Math.PI/3;ctx.lineTo(x+28*Math.cos(angle),y+28*Math.sin(angle));}
        ctx.closePath();ctx.strokeStyle=`rgba(0,220,255,${alpha})`;ctx.lineWidth=0.5;ctx.stroke();
      }}
      // Rotating arcs (Jarvis style)
      const cx=W/2,cy=H/2;
      [[120,1.5,.3,"#00dcff"],[180,-.8,.2,"#a855f7"],[240,2.1,.15,"#34d399"],[300,-1.2,.1,"#fb923c"]].forEach(([r,spd,al,col])=>{
        ctx.beginPath();
        ctx.arc(cx,cy,r,t*spd,t*spd+Math.PI*1.5);
        ctx.strokeStyle=col+Math.round(al*255).toString(16).padStart(2,"0");
        ctx.lineWidth=1.5;ctx.stroke();
        // Glow dot at arc end
        const ex=cx+r*Math.cos(t*spd+Math.PI*1.5);const ey=cy+r*Math.sin(t*spd+Math.PI*1.5);
        ctx.beginPath();ctx.arc(ex,ey,4,0,Math.PI*2);ctx.fillStyle=col;ctx.fill();
      });
      // Center pulse ring
      const pulse=Math.sin(t*2)*0.4+0.6;
      ctx.beginPath();ctx.arc(cx,cy,50*pulse,0,Math.PI*2);
      ctx.strokeStyle=`rgba(0,220,255,${pulse*.4})`;ctx.lineWidth=2;ctx.stroke();
      ctx.beginPath();ctx.arc(cx,cy,80,0,Math.PI*2);
      ctx.strokeStyle="rgba(168,85,247,0.08)";ctx.lineWidth=1;ctx.stroke();
      // Particles
      particles.forEach(p=>{
        p.x+=p.vx;p.y+=p.vy;
        if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;
        ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=p.c+"66";ctx.fill();
        particles.forEach(p2=>{
          const d=Math.hypot(p.x-p2.x,p.y-p2.y);
          if(d<100&&d>0){ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p2.x,p2.y);ctx.strokeStyle=`rgba(0,220,255,${(1-d/100)*.04})`;ctx.lineWidth=.3;ctx.stroke();}
        });
      });
      // Data nodes floating
      nodes.forEach((n,i)=>{
        n.val=Math.sin(t+i)*0.5+0.5;
        const nx=n.x+Math.sin(t*.5+i)*15;const ny=n.y+Math.cos(t*.3+i)*10;
        ctx.beginPath();ctx.arc(nx,ny,4,0,Math.PI*2);ctx.fillStyle=`rgba(0,220,255,${.4+n.val*.4})`;ctx.fill();
        ctx.fillStyle=`rgba(0,220,255,${.3+n.val*.3})`;ctx.font="9px Inter,monospace";ctx.textAlign="center";ctx.fillText(n.label,nx,ny-10);
        // Connection to center
        if(Math.hypot(nx-cx,ny-cy)<250){ctx.beginPath();ctx.moveTo(nx,ny);ctx.lineTo(cx,cy);ctx.strokeStyle=`rgba(0,220,255,${n.val*.06})`;ctx.lineWidth=.5;ctx.stroke();}
      });
      // Scanning line
      const scanY=(Math.sin(t*.5)+1)/2*H;
      const scanGrd=ctx.createLinearGradient(0,scanY-30,0,scanY+30);
      scanGrd.addColorStop(0,"transparent");scanGrd.addColorStop(.5,`rgba(0,220,255,0.06)`);scanGrd.addColorStop(1,"transparent");
      ctx.fillStyle=scanGrd;ctx.fillRect(0,scanY-30,W,60);
      // Corner HUD decorations
      [[0,0,1,1],[W,0,-1,1],[0,H,1,-1],[W,H,-1,-1]].forEach(([x,y,sx,sy])=>{
        ctx.strokeStyle="rgba(0,220,255,0.25)";ctx.lineWidth=1;
        ctx.beginPath();ctx.moveTo(x+sx*5,y);ctx.lineTo(x+sx*40,y);ctx.stroke();
        ctx.beginPath();ctx.moveTo(x,y+sy*5);ctx.lineTo(x,y+sy*40);ctx.stroke();
      });
      af=requestAnimationFrame(draw);
    }
    draw();
    return()=>{cancelAnimationFrame(af);window.removeEventListener("resize",onResize);};
  },[]);
  return <canvas ref={r} style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none",opacity:.85}}/>;
}

// ══════════════════════════════════════════════════════════
// BADGE SİSTEMİ
// ══════════════════════════════════════════════════════════
function useBadges(page){
  useEffect(()=>{
    try{
      const visited=JSON.parse(localStorage.getItem("imdatai_visited")||"[]");
      if(!visited.includes(page)){
        const newV=[...visited,page];
        localStorage.setItem("imdatai_visited",JSON.stringify(newV));
        const badges=JSON.parse(localStorage.getItem("imdatai_badges")||"[]");
        const newBadges=[...badges];
        if(newV.length>=1&&!badges.includes("bronze"))newBadges.push("bronze");
        if(newV.length>=5&&!badges.includes("silver"))newBadges.push("silver");
        if(newV.length>=10&&!badges.includes("gold"))newBadges.push("gold");
        localStorage.setItem("imdatai_badges",JSON.stringify(newBadges));
      }
    }catch(e){}
  },[page]);
}

function BadgeDisplay(){
  const[badges,setBadges]=useState([]);
  const[show,setShow]=useState(false);
  useEffect(()=>{
    try{const b=JSON.parse(localStorage.getItem("imdatai_badges")||"[]");setBadges(b);}catch(e){}
  },[]);
  if(!badges.length)return null;
  const defs={bronze:{e:"🥉",l:"Kaşif",d:"İlk sayfa"},silver:{e:"🥈",l:"Öğrenci",d:"5 sayfa"},gold:{e:"🥇",l:"Uzman",d:"10 sayfa"}};
  return <div style={{position:"fixed",bottom:100,left:16,zIndex:490}}>
    <button onClick={()=>setShow(s=>!s)} style={{background:"rgba(251,146,60,0.15)",border:"1px solid rgba(251,146,60,0.3)",borderRadius:10,padding:"6px 10px",cursor:"pointer",fontFamily:"inherit",color:"#fb923c",fontSize:11,fontWeight:700}}>
      {defs[badges[badges.length-1]]?.e} {badges.length} Rozet
    </button>
    {show&&<div style={{position:"absolute",bottom:36,left:0,background:"rgba(8,12,24,0.98)",border:"1px solid rgba(251,146,60,0.2)",borderRadius:12,padding:"12px",minWidth:160,backdropFilter:"blur(10px)"}}>
      {badges.map(b=><div key={b} style={{display:"flex",gap:8,alignItems:"center",marginBottom:6}}>
        <span style={{fontSize:16}}>{defs[b]?.e}</span>
        <div><div style={{fontSize:11,fontWeight:700,color:"#fb923c"}}>{defs[b]?.l}</div><div style={{fontSize:9,color:"#475569"}}>{defs[b]?.d}</div></div>
      </div>)}
    </div>}
  </div>;
}

// ══════════════════════════════════════════════════════════
// TOOLS SAYFASI
// ══════════════════════════════════════════════════════════
const ALL_TOOLS=[
  {cat:"💬 Sohbet AI",tools:[
    {n:"ChatGPT",e:"🤖",d:"Dünyanın #1 AI asistanı. GPT-5.5 ile süper uygulama.",url:"https://chatgpt.com",free:true,tag:"En Popüler"},
    {n:"Claude",e:"🧠",d:"Kodlamada #1. 1M token. Constitutional AI.",url:"https://claude.ai",free:true,tag:"Kodlama"},
    {n:"Gemini",e:"🌟",d:"Google'ın AI. 2M token. Drive entegrasyonu.",url:"https://gemini.google.com",free:true,tag:"Araştırma"},
    {n:"Perplexity",e:"🔍",d:"Kaynaklı araştırma asistanı. Her cevap referanslı.",url:"https://perplexity.ai",free:true,tag:"Araştırma"},
    {n:"Grok",e:"⚡",d:"xAI'ın modeli. Gerçek zamanlı X/Twitter verisi.",url:"https://x.ai",free:false,tag:"Sosyal"},
    {n:"Copilot",e:"🔷",d:"Microsoft'un AI. Office 365 entegre.",url:"https://copilot.microsoft.com",free:true,tag:"Office"},
  ]},
  {cat:"🖼️ Görsel AI",tools:[
    {n:"Midjourney",e:"🎨",d:"Profesyonel görsel üretim. v7 ile fotorealizm.",url:"https://midjourney.com",free:false,tag:"En İyi"},
    {n:"DALL-E 3",e:"🖌️",d:"OpenAI'nin görsel modeli. ChatGPT'ye entegre.",url:"https://chatgpt.com",free:true,tag:"Entegre"},
    {n:"Adobe Firefly",e:"🔥",d:"Ticari kullanım güvenli görsel.",url:"https://firefly.adobe.com",free:true,tag:"Ticari"},
    {n:"Stable Diffusion",e:"⚙️",d:"Açık kaynak. Sınırsız, ücretsiz.",url:"https://stability.ai",free:true,tag:"Açık"},
    {n:"Ideogram",e:"💫",d:"Metin içeren görsellerde mükemmel.",url:"https://ideogram.ai",free:true,tag:"Metin"},
    {n:"Leonardo AI",e:"🦁",d:"Oyun ve sanat odaklı görsel üretim.",url:"https://leonardo.ai",free:true,tag:"Sanat"},
  ]},
  {cat:"🎬 Video AI",tools:[
    {n:"Sora",e:"🎬",d:"OpenAI'nin video modeli. 1080p, 60sn.",url:"https://sora.com",free:false,tag:"Premium"},
    {n:"HeyGen",e:"👤",d:"AI avatar video. Türkçe dahil 40+ dil.",url:"https://heygen.com",free:true,tag:"Avatar"},
    {n:"Runway",e:"🚀",d:"Profesyonel AI video düzenleme.",url:"https://runwayml.com",free:true,tag:"Düzenleme"},
    {n:"Kling",e:"🎭",d:"Çin'in güçlü video AI modeli.",url:"https://klingai.com",free:true,tag:"Ücretsiz"},
    {n:"Pika",e:"📹",d:"Görsellerden video oluşturma.",url:"https://pika.art",free:true,tag:"Fotodan Video"},
  ]},
  {cat:"🔊 Ses AI",tools:[
    {n:"ElevenLabs",e:"🎙️",d:"En gerçekçi ses klonlama. 10K karakter ücretsiz.",url:"https://elevenlabs.io",free:true,tag:"En İyi"},
    {n:"Suno",e:"🎵",d:"Metinden müzik üretim. v5 enstrüman sesi.",url:"https://suno.ai",free:true,tag:"Müzik"},
    {n:"Udio",e:"🎸",d:"Profesyonel müzik üretimi. Geniş tür desteği.",url:"https://udio.com",free:true,tag:"Müzik"},
    {n:"Murf AI",e:"📢",d:"İş sesi ve podcast için seslendirme.",url:"https://murf.ai",free:true,tag:"Podcast"},
    {n:"Descript",e:"✂️",d:"Ses ve video transkripsiyon + düzenleme.",url:"https://descript.com",free:true,tag:"Düzenleme"},
  ]},
  {cat:"💻 Kod AI",tools:[
    {n:"Cursor",e:"🖱️",d:"AI IDE. VS Code tabanlı. 4M+ geliştirici.",url:"https://cursor.sh",free:true,tag:"En Popüler"},
    {n:"GitHub Copilot",e:"🐙",d:"Microsoft'un kod tamamlama AI.",url:"https://github.com/features/copilot",free:false,tag:"Entegre"},
    {n:"Claude Code",e:"🧠",d:"Terminal tabanlı ajan kodlama.",url:"https://claude.ai",free:false,tag:"Ajan"},
    {n:"v0.dev",e:"⚡",d:"Vercel'in UI üretim aracı. React bileşeni.",url:"https://v0.dev",free:true,tag:"UI"},
    {n:"Replit",e:"🔄",d:"Tarayıcıda AI destekli kod yazmak.",url:"https://replit.com",free:true,tag:"Tarayıcı"},
    {n:"Bolt",e:"⚡",d:"Tam stack uygulama AI ile saniyeler.",url:"https://bolt.new",free:true,tag:"Full Stack"},
  ]},
  {cat:"📊 Sunum & İçerik",tools:[
    {n:"Gamma",e:"📊",d:"AI ile sunum oluşturma. 60sn'de profesyonel.",url:"https://gamma.app",free:true,tag:"Sunum"},
    {n:"Canva AI",e:"🎨",d:"Magic Write ile grafik + metin AI.",url:"https://canva.com",free:true,tag:"Tasarım"},
    {n:"Notion AI",e:"📝",d:"Not uygulaması içinde AI asistan.",url:"https://notion.so",free:true,tag:"Notlar"},
    {n:"Copy.ai",e:"✍️",d:"Pazarlama içeriği + copy üretimi.",url:"https://copy.ai",free:true,tag:"Pazarlama"},
    {n:"Jasper",e:"🤖",d:"Kurumsal içerik ve marka sesi.",url:"https://jasper.ai",free:false,tag:"Kurumsal"},
  ]},
  {cat:"🔍 Araştırma",tools:[
    {n:"Perplexity",e:"🔍",d:"Kaynaklı AI araştırma. Akademik modda.",url:"https://perplexity.ai",free:true,tag:"Araştırma"},
    {n:"Elicit",e:"📚",d:"Akademik makale analizi ve özet.",url:"https://elicit.org",free:true,tag:"Akademik"},
    {n:"Consensus",e:"🤝",d:"Bilimsel araştırmalarda konsensüs bulma.",url:"https://consensus.app",free:true,tag:"Bilim"},
    {n:"Scite",e:"📖",d:"Atıf analizi ve kaynak doğrulama.",url:"https://scite.ai",free:true,tag:"Atıf"},
  ]},
  {cat:"🛠️ Otomasyon",tools:[
    {n:"n8n",e:"⚙️",d:"Açık kaynak iş akışı otomasyonu.",url:"https://n8n.io",free:true,tag:"Açık"},
    {n:"Make",e:"🔗",d:"Görsel iş akışı oluşturma.",url:"https://make.com",free:true,tag:"Görsel"},
    {n:"Zapier",e:"⚡",d:"Uygulama entegrasyon platformu.",url:"https://zapier.com",free:true,tag:"Popüler"},
    {n:"Flowise",e:"🌊",d:"AI iş akışı oluşturma (no-code).",url:"https://flowiseai.com",free:true,tag:"No-code"},
  ]},,
  {cat:"🎯 Verimlilik AI",tools:[
    {n:"Notion AI",e:"📝",d:"Akıllı not alma ve proje yönetimi. GPT-4 entegreli.",url:"https://notion.so",free:true,tag:"Ücretsiz"},
    {n:"Otter.ai",e:"🎙️",d:"Toplantıları otomatik transkript et. Türkçe destekler.",url:"https://otter.ai",free:true,tag:"Toplantı"},
    {n:"Grammarly",e:"✍️",d:"AI destekli yazım düzeltici. İngilizce için #1.",url:"https://grammarly.com",free:true,tag:"Yazım"},
    {n:"Reclaim AI",e:"📅",d:"Takvimini AI ile optimize et. Odak zamanı planla.",url:"https://reclaim.ai",free:true,tag:"Takvim"},
    {n:"Motion",e:"⚡",d:"AI görev planlayıcı. Deadline'ları otomatik organize et.",url:"https://usemotion.com",free:false,tag:"Premium"},
  ]},
  {cat:"🌐 SEO & Pazarlama AI",tools:[
    {n:"Surfer SEO",e:"🔍",d:"AI ile SEO optimizasyonu. İçerik puanlama ve analiz.",url:"https://surferseo.com",free:false,tag:"SEO"},
    {n:"Copy.ai",e:"📣",d:"Pazarlama metni üretici. 90+ şablon.",url:"https://copy.ai",free:true,tag:"Kopya"},
    {n:"Jasper",e:"🤖",d:"Kurumsal AI içerik platformu. Blog, email, reklam.",url:"https://jasper.ai",free:false,tag:"Kurumsal"},
    {n:"AdCreative.ai",e:"🎨",d:"AI reklam görseli üretici. %14 daha yüksek dönüşüm.",url:"https://adcreative.ai",free:false,tag:"Reklam"},
  ]}
];

function ToolsPage(){
  const[cat,setCat]=useState("Tümü");const[s,setS]=useState("");
  const cats=["Tümü",...ALL_TOOLS.map(c=>c.cat)];
  const filtered=ALL_TOOLS.filter(c=>cat==="Tümü"||c.cat===cat).map(c=>({...c,tools:c.tools.filter(t=>!s||t.n.toLowerCase().includes(s.toLowerCase())||t.d.toLowerCase().includes(s.toLowerCase()))})).filter(c=>c.tools.length);
  const catColors={"💬 Sohbet AI":"#00dcff","🖼️ Görsel AI":"#f472b6","🎬 Video AI":"#a855f7","🔊 Ses AI":"#34d399","💻 Kod AI":"#fb923c","📊 Sunum & İçerik":"#60a5fa","🔍 Araştırma":"#fbbf24","🛠️ Otomasyon":"#34d399"};
  return <div style={{padding:"28px 20px",maxWidth:960,margin:"0 auto"}}>
    <div style={{marginBottom:24}}>
      <div style={{fontSize:9,letterSpacing:".2em",color:"#475569",marginBottom:5}}>TÜM ARAÇLAR</div>
      <div style={{fontSize:26,fontWeight:900,color:"#e2e8f0",fontFamily:"'Space Grotesk',sans-serif",marginBottom:6}}>🛠️ AI Tools — Tam Rehber</div>
      <div style={{fontSize:12,color:"#64748b"}}>{ALL_TOOLS.reduce((s,c)=>s+c.tools.length,0)}+ araç · 8 kategori · Ücretsiz/Ücretli · Açıklamalar</div>
    </div>
    <input style={{width:"100%",background:"rgba(0,0,0,0.4)",border:"1px solid rgba(0,220,255,0.2)",borderRadius:12,color:"#e2e8f0",padding:"12px 16px",fontSize:13,fontFamily:"inherit",outline:"none",marginBottom:16,boxSizing:"border-box"}} placeholder="🔍 Araç ara... (ChatGPT, video, müzik, kod...)" value={s} onChange={e=>setS(e.target.value)}/>
    <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:24}}>
      {cats.map(c=>{const col=catColors[c]||"#00dcff";return <button key={c} onClick={()=>setCat(c)} style={{padding:"6px 14px",borderRadius:8,border:`1px solid ${cat===c?col+"60":"rgba(255,255,255,0.08)"}`,background:cat===c?`${col}12`:"transparent",color:cat===c?col:"#475569",fontSize:11,cursor:"pointer",fontFamily:"inherit",fontWeight:cat===c?700:400}}>
        {c==="Tümü"?"Tümü":c}
      </button>;})}
    </div>
    {filtered.map(c=>{const col=catColors[c.cat]||"#00dcff";return <div key={c.cat} style={{marginBottom:28}}>
      <div style={{fontSize:14,fontWeight:800,color:col,marginBottom:12,fontFamily:"'Space Grotesk',sans-serif"}}>{c.cat}</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:10}}>
        {c.tools.map(t=><a key={t.n} href={t.url} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none"}}>
          <div className="card-hover" style={{background:`${col}06`,border:`1px solid ${col}15`,borderRadius:13,padding:"14px",display:"flex",gap:12,alignItems:"flex-start",cursor:"pointer"}}>
            <div style={{fontSize:26,flexShrink:0}}>{t.e}</div>
            <div style={{flex:1}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                <div style={{fontSize:13,fontWeight:700,color:col}}>{t.n}</div>
                <div style={{display:"flex",gap:5}}>
                  {t.free&&<span style={{fontSize:8,color:"#34d399",background:"rgba(52,211,153,0.12)",borderRadius:4,padding:"2px 6px"}}>Ücretsiz</span>}
                  <span style={{fontSize:8,color:col,background:`${col}12`,borderRadius:4,padding:"2px 6px"}}>{t.tag}</span>
                </div>
              </div>
              <div style={{fontSize:11,color:"#475569",lineHeight:1.6}}>{t.d}</div>
            </div>
          </div>
        </a>)}
      </div>
    </div>;})}
  </div>;
}

export default function App(){
  const[page,setPage]=useState("home");
  const[user,setUser]=useState(defaultUser);
  const[cookie,setCookie]=useState(true);
  const[loading,setLoading]=useState(true);
  function nav(p){setPage(p);window.scrollTo({top:0,behavior:"smooth"});}
  function doneLoading(){setLoading(false);}

  if(loading)return <LoadingScreen onDone={doneLoading}/>;

  if(page.startsWith("blog-")){const id=page.replace("blog-","");return <Wrapper nav={nav} page={page} cookie={cookie} setCookie={setCookie}><BlogPostPage postId={id} setPage={nav}/></Wrapper>;}
  if(page.startsWith("tool-")){const key=page.replace("tool-","");return <Wrapper nav={nav} page={page} cookie={cookie} setCookie={setCookie}><ToolDetailPage toolKey={key} setPage={nav}/></Wrapper>;}
  if(page==="claude"){return <Wrapper nav={nav} page={page} cookie={cookie} setCookie={setCookie}><ClaudePage setPage={nav}/></Wrapper>;}
  if(page==="chatgpt"){return <Wrapper nav={nav} page={page} cookie={cookie} setCookie={setCookie}><ChatGPTPage setPage={nav}/></Wrapper>;}
  if(page==="gemini"){return <Wrapper nav={nav} page={page} cookie={cookie} setCookie={setCookie}><GeminiPage setPage={nav}/></Wrapper>;}
  if(page==="grok"){return <Wrapper nav={nav} page={page} cookie={cookie} setCookie={setCookie}><GrokPage setPage={nav}/></Wrapper>;}
  if(page==="deepseek"){return <Wrapper nav={nav} page={page} cookie={cookie} setCookie={setCookie}><DeepSeekPage setPage={nav}/></Wrapper>;}
  if(page==="mistral"){return <Wrapper nav={nav} page={page} cookie={cookie} setCookie={setCookie}><MistralPage setPage={nav}/></Wrapper>;}
  if(page==="llama"){return <Wrapper nav={nav} page={page} cookie={cookie} setCookie={setCookie}><LlamaPage setPage={nav}/></Wrapper>;}
  if(page==="dashboard"){return <Wrapper nav={nav} page={page} cookie={cookie} setCookie={setCookie}><DashboardPage setPage={nav}/></Wrapper>;}
  if(page==="kisilik"){return <Wrapper nav={nav} page={page} cookie={cookie} setCookie={setCookie}><KisilikPage setPage={nav}/></Wrapper>;}
  if(page==="grok"){return <Wrapper nav={nav} page={page} cookie={cookie} setCookie={setCookie}><GrokPage setPage={nav}/></Wrapper>;}
  if(page==="deepseek"){return <Wrapper nav={nav} page={page} cookie={cookie} setCookie={setCookie}><DeepSeekPage setPage={nav}/></Wrapper>;}
  if(page==="mistral"){return <Wrapper nav={nav} page={page} cookie={cookie} setCookie={setCookie}><MistralPage setPage={nav}/></Wrapper>;}
  if(page==="llama"){return <Wrapper nav={nav} page={page} cookie={cookie} setCookie={setCookie}><LlamaPage setPage={nav}/></Wrapper>;}

  return <Wrapper nav={nav} page={page} user={user} setUser={setUser} cookie={cookie} setCookie={setCookie}>
    <ActivityFeed/>
    <DailyMissionsWidget setPage={nav}/>
    {page==="home"          &&<HomePage setPage={nav} user={user} setUser={setUser}/>}
    {page==="haberler"      &&<HaberlerPage setPage={nav}/>}
    {page==="blog"          &&<BlogPage setPage={nav}/>}
    {page==="ogrenme"       &&<OgrenmePage setPage={nav}/>}
    {page==="prompt"        &&<PromptPage/>}
    {page==="karsilastirma" &&<KarsilastirmaPage/>}
    {page==="sozluk"        &&<SozlukPage/>}
    {page==="dizin"         &&<DizinPage setPage={nav}/>}
    {page==="tools"         &&<ToolsPage/>}
    {page==="galeri"        &&<GaleriPage/>}
    {page==="quiz"          &&<QuizPage/>}
    {page==="oyun"          &&<OyunPage/>}
    {page==="oyunlar"       &&<OyunlarPage setPage={nav}/>}
    {page==="trivia"        &&<TriviaMarathon/>}
    {page==="roulette"      &&<PromptRoulette/>}
    {page==="emoji"         &&<EmojiGuess/>}
    {page==="dedektif"      &&<ModelDedektifPage/>}
    {page==="kariyer_sim"   &&<KariyerSimPage/>}
    {page==="cark"          &&<LuckyWheelPage/>}
    {page==="animasyon"     &&<AnimasyonPage/>}
    {page==="flashcard"     &&<FlashcardPage/>}
    {page==="maliyet"       &&<MaliyetPage/>}
    {page==="gorev"         &&<div style={{padding:"28px 20px",textAlign:"center"}}><DailyMissionsWidget setPage={nav}/><div style={{fontSize:14,color:"#64748b",marginTop:60}}>Görev widget'ı sağ alt köşede! 📋</div></div>}
    {page==="dashboard"     &&<DashboardPage setPage={nav}/>}
    {page==="kisilik"       &&<KisilikPage setPage={nav}/>}
    {page==="topluluk"      &&<ToplulukPage/>}
    {page==="kariyer"       &&<KariyerPage/>}
    {page==="mitler"        &&<MitlerPage/>}
    {page==="zaman"         &&<ZamanHesapPage/>}
    {page==="para"          &&<ParaPage/>}
    {page==="iqtest"        &&<IQTestPage/>}
    {page==="puan"          &&<PromptScorerPage/>}
    {page==="oneri"         &&<KisiselOneriPage setPage={nav}/>}
    {page==="aistatus"      &&<AIStatusPage/>}
    {page==="hakkimizda"    &&<HakkimizdaPage/>}
    {page==="iletisim"      &&<IletisimPage/>}
    {page==="gizlilik"      &&<GizlilikPage/>}
    {page==="pro"           &&<ProPage/>}
  </Wrapper>;
}


// ══════════════════════════════════════════════════════════
// CLAUDE KAPSAMLI SAYFA
// ══════════════════════════════════════════════════════════
function ClaudePage({setPage}){
  const[tab,setTab]=useState("nedir");
  const tabs=[["nedir","🧠 Claude Nedir?"],["versiyonlar","📊 Versiyonlar"],["nasil","⚡ Nasıl Kullanılır?"],["promptlar","💡 Özel Promptlar"],["karsilastirma","🆚 Karşılaştırma"],["mimari","🔬 Teknik Yapı"]];
  const versiyonlar=[
    {ad:"Claude 3.5 Haiku",renk:"#60a5fa",icon:"⚡",hiz:"En Hızlı",maliyet:"En Ucuz",context:"200K",guc:75,ideal:"Basit görevler, chatbot, hızlı cevaplar",notlar:"API maliyeti en düşük. Gerçek zamanlı uygulamalar için ideal."},
    {ad:"Claude 3.5 Sonnet",renk:"#a855f7",icon:"⚖️",hiz:"Dengeli",maliyet:"Orta",context:"200K",guc:88,ideal:"Günlük kullanım, yazarlık, kod yardımı",notlar:"Performans/maliyet dengesi en iyi model. Pro planın varsayılanı."},
    {ad:"Claude Opus 4.5",renk:"#f472b6",icon:"🏆",hiz:"Orta",maliyet:"Yüksek",context:"1M",guc:95,ideal:"Karmaşık analiz, uzun belgeler, araştırma",notlar:"1 milyon token = 750.000 kelime = kitap boyutu. Rakipsiz context."},
    {ad:"Claude Opus 4.7",renk:"#00dcff",icon:"🚀",hiz:"Güçlü",maliyet:"En Yüksek",context:"1M",guc:99,ideal:"Kodlama, SWE-bench #1, ajan görevleri",notlar:"SWE-bench %87.6 ile yazılım mühendisliğinde dünya rekoru. Agentic AI için tasarlandı."},
  ];
  const ozelPromptlar=[
    {baslik:"📄 Kitap Boyutu Belge Analizi",aciklama:"Claude'un 1M token gücünü kullan",prompt:`Sana [sayfa sayısı] sayfalık [belge türü] yükleyeceğim. Yaptıklarım sırayla şunlar:\n1) Tüm belgeyi oku ve ana temayı anla\n2) En önemli 10 bulguyu çıkar\n3) İç tutarsızlıkları tespit et\n4) Pratikte uygulanabilir 5 öneri sun\n5) Yönetici özeti yaz (1 sayfa)\n\nBelge: [belgeyi buraya yapıştır]`,ipucu:"ChatGPT'nin 128K limiti aşılınca başarısız olduğu görevleri Claude 1M tokenla halleder."},
    {baslik:"💻 Tam Codebase Analizi",aciklama:"Tüm projeyi bir kerede analiz et",prompt:`Bu projenin tüm kaynak kodunu inceleyeceğim.\n\n[Kodu buraya yapıştır]\n\nBenden şunları yapmanı istiyorum:\n1) Mimariyi ve tasarım pattern'larını açıkla\n2) Güvenlik açıklarını listele (kritiklik sırasına göre)\n3) Performans darboğazlarını tespit et\n4) Test coverage eksikliklerini belirle\n5) Refactoring önerilerini öncelik sırasıyla sun\n6) Teknik borç analizi yap`,ipucu:"Claude'un code review'ı diğer modellerden %40 daha kapsamlı. SWE-bench'te kanıtlandı."},
    {baslik:"🔬 Akademik Araştırma Sentezi",aciklama:"Birden fazla makaleyi birleştir",prompt:`Sana [sayı] adet araştırma makalesi vereceğim. Bunları şu şekilde sentezle:\n\n1) Her makalenin ana iddiası ve metodolojisi (tablo formatında)\n2) Makaleler arasındaki consensus noktaları\n3) Çelişkili bulgular ve olası nedenleri\n4) Metodolojik sınırlılıklar\n5) Araştırma boşlukları (gelecek çalışmalar için)\n6) Pratik uygulamalar için özet\n\nHer iddia için kaynak göster: (Yazar, Yıl)`,ipucu:"Araştırmacılar için 1M token = 20-30 makaleyi aynı anda analiz edebilirsin."},
    {baslik:"⚖️ Hukuki Belge İncelemesi",aciklama:"Sözleşme ve yasal metinler",prompt:`Aşağıdaki [belge türü]'ni profesyonel bir hukuk danışmanı gözüyle incele:\n\n[Belgeyi buraya yapıştır]\n\nRaporun şunları içermeli:\n1) Taraflar ve temel yükümlülükler (özet tablo)\n2) Riskli maddeler (kırmızı bayraklar) — her biri için risk seviyesi: Yüksek/Orta/Düşük\n3) Standart sözleşmeden sapan maddeler\n4) Eksik olan koruyucu hükümler\n5) Müzakere önerileri\n\nNOT: Bu analiz hukuki tavsiye değildir, bir avukatla doğrulayın.`,ipucu:"Claude hallüsinasyon oranı diğer modellere göre düşük. Yine de kritik hukuki kararlar için avukat danışın."},
    {baslik:"🎭 Constitutional AI ile Güvenli Kullanım",aciklama:"Claude'un değer sistemini anla",prompt:`Bir [rol/uzman] olarak görev yapmanı istiyorum. Ancak şu kısıtlara uy:\n- Kesinlikle doğru olmayan bir şey söyleme; belirsizsen 'emin değilim' de\n- Zararlı olabilecek içerikten kaçın\n- Kaynakların gerçek mi yoksa sınırlı bilgine mi dayandığını belirt\n- Kararlar için her zaman kullanıcının son onayını al\n\nGörev: [görev açıklaması]`,ipucu:"Constitutional AI: Claude, belirli etik ilkelere göre eğitildi. Bu sayede hallüsinasyon ve zararlı çıktı oranı düşük."},
    {baslik:"🔄 Uzun İçerik Dönüştürme",aciklama:"Format ve ton değiştirme",prompt:`Aşağıdaki içeriği [hedef format]'a dönüştür:\n\nKaynak: [içerik]\n\nDönüşüm kuralları:\n- Ton: [teknik/samimi/akademik/pazarlama]\n- Uzunluk: [kısa/orta/uzun] — mevcut içeriğin [%X]'i\n- Hedef kitle: [kitle tanımı]\n- Platform: [LinkedIn/blog/e-posta/sunum]\n- Kesinlikle koru: [korunması gereken unsurlar]\n- Kaldır: [gereksiz unsurlar]`,ipucu:"Claude'un yazarlık kalitesi özellikle uzun formatlarda diğer modellerden üstün."},
  ];
  const karsilastirmaData=[
    {kriter:"Context Window",claude:"1M token (750K kelime)",chatgpt:"128K token",gemini:"2M token",kazanan:"Gemini",not:"Gemini en uzun, Claude 2. GPT çok geride."},
    {kriter:"Kod Yazma",claude:"SWE-bench %87.6 🏆",chatgpt:"SWE-bench %78.4",gemini:"SWE-bench %74.2",kazanan:"Claude",not:"Claude kodlamada açık ara birinci."},
    {kriter:"Hallüsinasyon",claude:"En düşük risk 🏆",chatgpt:"Orta risk",gemini:"Orta risk",kazanan:"Claude",not:"Constitutional AI sayesinde Claude en güvenilir."},
    {kriter:"Görsel Üretim",claude:"Yok ❌",chatgpt:"DALL-E 3 🏆",gemini:"Imagen 3",kazanan:"ChatGPT",not:"Claude görsel üretemiyor."},
    {kriter:"Türkçe Kalite",claude:"Çok İyi 🏆",chatgpt:"İyi",gemini:"Orta",kazanan:"Claude",not:"Türkçe'de Claude tutarlılık ve kalite açısından öne çıkıyor."},
    {kriter:"API Güvenliği",claude:"Constitutional AI 🏆",chatgpt:"RLHF",gemini:"RLHF + Güvenlik",kazanan:"Claude",not:"Anthropic güvenlik odaklı şirket. Kurumsal kullanım için öncelik."},
    {kriter:"Fiyat (Pro)",claude:"$20/ay",chatgpt:"$20/ay",gemini:"$19.99/ay",kazanan:"Gemini",not:"Fiyatlar benzer ama Claude Max $100, GPT Pro $200."},
    {kriter:"Agentic AI",claude:"Task Budget 🏆",chatgpt:"Operator",gemini:"Sınırlı",kazanan:"Claude",not:"Claude'un Task Budget özelliği ajan maliyetlerini kontrol altına alıyor."},
  ];
  return <div style={{padding:"28px 20px",maxWidth:960,margin:"0 auto"}}>
    <div style={{background:"linear-gradient(135deg,rgba(168,85,247,0.12),rgba(0,0,0,0))",border:"1px solid rgba(168,85,247,0.3)",borderRadius:20,padding:"28px",marginBottom:24}}>
      <div style={{display:"flex",gap:16,alignItems:"center",flexWrap:"wrap",marginBottom:16}}>
        <div style={{fontSize:56}}>🧠</div>
        <div>
          <div style={{fontSize:28,fontWeight:900,color:"#a855f7",marginBottom:4}}>Claude — Anthropic</div>
          <div style={{fontSize:14,color:"#94a3b8"}}>Kodlama ve Analiz Şampiyonu · SWE-bench %87.6 · 1M Token · Constitutional AI</div>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:10}}>
        {[["🏆","Kodlamada #1","SWE-bench Verified"],["📚","1M Token","750.000 kelime"],["🔒","En Güvenli","Constitutional AI"],["🧪","En Az","Hallüsinasyon"],["🤖","Agentic","Task Budget"],["💜","Anthropic","2021'de kuruldu"]].map(([e,t,d])=>(
          <div key={t} style={{background:"rgba(168,85,247,0.08)",border:"1px solid rgba(168,85,247,0.2)",borderRadius:10,padding:"12px",textAlign:"center"}}>
            <div style={{fontSize:20,marginBottom:4}}>{e}</div>
            <div style={{fontSize:12,fontWeight:700,color:"#a855f7",marginBottom:2}}>{t}</div>
            <div style={{fontSize:10,color:"#475569"}}>{d}</div>
          </div>
        ))}
      </div>
    </div>
    <div style={{display:"flex",gap:3,flexWrap:"wrap",marginBottom:20,borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
      {tabs.map(([id,l])=><button key={id} onClick={()=>setTab(id)} style={{padding:"8px 13px",border:"none",cursor:"pointer",fontSize:11,fontFamily:"inherit",borderRadius:"6px 6px 0 0",background:tab===id?"rgba(168,85,247,0.12)":"transparent",color:tab===id?"#a855f7":"#475569",borderBottom:tab===id?"2px solid #a855f7":"2px solid transparent",whiteSpace:"nowrap"}}>{l}</button>)}
    </div>
    {tab==="nedir"&&<div>
      <div style={{background:"rgba(168,85,247,0.05)",border:"1px solid rgba(168,85,247,0.15)",borderRadius:14,padding:"22px",marginBottom:16}}>
        <div style={{fontSize:16,fontWeight:800,color:"#e2e8f0",marginBottom:12}}>Claude Nedir ve Neden Önemli?</div>
        <div style={{fontSize:13,color:"#94a3b8",lineHeight:2}}>Claude, Anthropic tarafından geliştirilen bir yapay zeka asistanıdır. OpenAI'den ayrılan araştırmacılar tarafından 2021'de kurulan Anthropic, AI güvenliğini merkeze alan bir şirket.<br/><br/>
        Claude'u diğerlerinden ayıran şey: <strong style={{color:"#a855f7"}}>Constitutional AI</strong> yaklaşımı. Claude, belirli etik ilkelere dayalı bir "anayasa" ile eğitildi. Bu sayede daha az hallüsinasyon yapar, zararlı içerik üretmez ve kendi sınırlılıklarını daha iyi kabul eder.<br/><br/>
        2026 itibarıyla Claude Opus 4.7, yazılım mühendisliği benchmarkı SWE-bench'te %87.6 ile dünya rekoru kırdı. Bu, AI'ın gerçek yazılım projelerindeki etkinliğini ölçen en güvenilir test.</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",gap:12}}>
        {[{baslik:"Constitutional AI Nedir?",icerik:"Claude, bir 'anayasa' — temel ilkeler kümesi — ile eğitildi. Model, kendi çıktısını bu ilkelere göre değerlendirir ve düzeltir. Sonuç: daha güvenilir, daha tutarlı yanıtlar.",icon:"⚖️",renk:"#a855f7"},{baslik:"Neden Kodlamada #1?",icerik:"Claude Opus 4.7, SWE-bench Verified testinde %87.6 aldı. Bu test gerçek GitHub issue'larını çözmeyi ölçüyor. Claude, gerçek yazılım problemlerini insan geliştiriciden daha iyi çözüyor.",icon:"💻",renk:"#34d399"},{baslik:"1 Milyon Token Ne Demek?",icerik:"1M token ≈ 750.000 kelime ≈ 10 roman. Bir kitabı, yüzlerce sayfayı, tüm codebase'i tek sohbette işleyebilirsin. ChatGPT'nin 128K limiti biterken Claude devam eder.",icon:"📚",renk:"#00dcff"},{baslik:"Anthropic Güvencesi",icerik:"OpenAI'den farklı olarak Anthropic, saf bir AI güvenlik şirketi. Yatırımcı baskısıyla değil, güvenli AI geliştirme misyonuyla yönetiliyor. Bu kurumsal kullanım için kritik.",icon:"🔒",renk:"#fb923c"}].map(k=>(
          <div key={k.baslik} style={{background:`${k.renk}06`,border:`1px solid ${k.renk}20`,borderRadius:13,padding:"16px"}}>
            <div style={{fontSize:24,marginBottom:8}}>{k.icon}</div>
            <div style={{fontSize:13,fontWeight:700,color:"#e2e8f0",marginBottom:8}}>{k.baslik}</div>
            <div style={{fontSize:11,color:"#64748b",lineHeight:1.7}}>{k.icerik}</div>
          </div>
        ))}
      </div>
    </div>}
    {tab==="versiyonlar"&&<div>
      <div style={{fontSize:12,color:"#64748b",marginBottom:16,lineHeight:1.7}}>Claude'un 4 farklı modeli var — her biri farklı hız/güç/maliyet dengesi sunar. Doğru modeli seçmek hem kaliteyi hem maliyeti optimize eder.</div>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        {versiyonlar.map(v=>(
          <div key={v.ad} style={{background:`${v.renk}06`,border:`1px solid ${v.renk}22`,borderRadius:14,padding:"18px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10,marginBottom:12}}>
              <div style={{display:"flex",gap:12,alignItems:"center"}}><span style={{fontSize:28}}>{v.icon}</span><div><div style={{fontSize:15,fontWeight:800,color:v.renk}}>{v.ad}</div><div style={{fontSize:11,color:"#475569"}}>Hız: {v.hiz} · Maliyet: {v.maliyet} · Context: {v.context} token</div></div></div>
              <div style={{background:`${v.renk}18`,borderRadius:8,padding:"6px 14px",fontSize:14,fontWeight:900,color:v.renk}}>{v.guc}/100</div>
            </div>
            <div style={{height:6,background:"rgba(255,255,255,0.06)",borderRadius:3,marginBottom:12}}><div style={{width:`${v.guc}%`,height:"100%",background:v.renk,borderRadius:3}}/></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div><div style={{fontSize:10,color:"#475569",marginBottom:4}}>İDEAL KULLANIM</div><div style={{fontSize:12,color:"#94a3b8"}}>{v.ideal}</div></div>
              <div><div style={{fontSize:10,color:"#475569",marginBottom:4}}>NOTLAR</div><div style={{fontSize:12,color:"#94a3b8"}}>{v.notlar}</div></div>
            </div>
          </div>
        ))}
      </div>
    </div>}
    {tab==="nasil"&&<div>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        {[{no:1,baslik:"claude.ai'ye Git ve Kayıt Ol",icerik:"claude.ai adresine git, Google veya e-posta ile kayıt ol. Ücretsiz plan Claude 3.5 Haiku erişimi sağlar. Pro ($20/ay) Opus 4.7'ye erişim verir.",ipucu:"Pro planı ilk ay dene, sonra karar ver. 14 gün para iade garantisi var."},
        {no:2,baslik:"İlk Promptu Doğru Kur",icerik:"Claude'a rol ver: 'Deneyimli bir [uzman] olarak...' ile başla. Format belirt: 'Madde madde listele', 'tablo formatında', '500 kelimede'. Bağlam ver: Kim için, ne amaçla.",ipucu:"Claude role prompting'e diğer modellerden daha iyi yanıt verir. Rol ne kadar spesifik olursa çıktı o kadar iyi."},
        {no:3,baslik:"Uzun Belge Analizi İçin",icerik:"PDF veya uzun metni kopyala, yapıştır. Claude 1M token işleyebilir — tüm kitabı bir seferde ver. 'Bu belgeyi analiz et ve şunu yap:' ile devam et.",ipucu:"ChatGPT'de 'metin çok uzun' hatası aldığında Claude'a geç. 1M token bu iş için var."},
        {no:4,baslik:"Kod Yazmak İçin",icerik:"Projenin context'ini ver: 'Tech stack: [stack]. Mevcut kod: [kod]. Şunu eklemem gerekiyor: [özellik].' Tek adımda yazmak yerine Claude'un planlamasına izin ver.",ipucu:"'Önce planı göster, onaylayınca yaz' demek daha temiz kod üretir."},
        {no:5,baslik:"Projects Özelliğini Kullan",icerik:"Claude Projects ile kalıcı context kur. Proje belgelerini, kuralları, tercihlerini bir kez ekle — her sohbette tekrar açıklama yapma.",ipucu:"İş projeleri için Projects şart. Her sohbeti sıfırdan başlatmana gerek kalmaz."},
        {no:6,baslik:"Claude'a İtiraz Etmekten Korkma",icerik:"Claude'un verdiği cevabı beğenmezsen doğrudan söyle: 'Bu yeterince detaylı değil', 'Daha teknik ol', 'Bu hatalı, yeniden dene'. Claude düzeltmelere çok iyi yanıt verir.",ipucu:"Claude'un en güçlü özelliklerinden biri: eleştiriye açık olması ve cevabı geliştirmesi."}].map(a=>(
          <div key={a.no} style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(168,85,247,0.15)",borderRadius:13,padding:"16px",display:"flex",gap:14}}>
            <div style={{width:32,height:32,borderRadius:"50%",background:"rgba(168,85,247,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:900,color:"#a855f7",flexShrink:0}}>{a.no}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:700,color:"#e2e8f0",marginBottom:6}}>{a.baslik}</div>
              <div style={{fontSize:12,color:"#64748b",lineHeight:1.7,marginBottom:8}}>{a.icerik}</div>
              <div style={{background:"rgba(168,85,247,0.08)",borderRadius:8,padding:"8px 12px",fontSize:11,color:"#a855f7"}}>💡 {a.ipucu}</div>
            </div>
          </div>
        ))}
      </div>
    </div>}
    {tab==="promptlar"&&<div>
      <div style={{fontSize:12,color:"#64748b",marginBottom:16}}>Claude'un özel güçlerini ortaya çıkaran prompt şablonları. Kopyala, köşeli parantezleri kendi bilgilerinle doldur.</div>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        {ozelPromptlar.map((p,i)=>(
          <div key={i} style={{background:"rgba(168,85,247,0.04)",border:"1px solid rgba(168,85,247,0.18)",borderRadius:14,overflow:"hidden"}}>
            <div style={{background:"rgba(168,85,247,0.1)",padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontSize:13,fontWeight:700,color:"#e2e8f0"}}>{p.baslik}</div>
              <div style={{fontSize:10,color:"#a855f7"}}>{p.aciklama}</div>
            </div>
            <div style={{padding:"14px 16px"}}>
              <div style={{background:"rgba(0,0,0,0.4)",borderRadius:9,padding:"12px 14px",fontFamily:"monospace",fontSize:11,color:"#94a3b8",lineHeight:1.8,marginBottom:10,whiteSpace:"pre-wrap"}}>{p.prompt}</div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{fontSize:11,color:"#475569",fontStyle:"italic"}}>💡 {p.ipucu}</div>
                <button onClick={()=>navigator.clipboard?.writeText(p.prompt)} style={{padding:"5px 12px",borderRadius:7,border:"none",background:"rgba(168,85,247,0.2)",color:"#a855f7",fontSize:10,cursor:"pointer",fontFamily:"inherit",flexShrink:0,marginLeft:10}}>Kopyala</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>}
    {tab==="karsilastirma"&&<div>
      <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:14,overflow:"hidden"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",background:"rgba(0,0,0,0.3)",padding:"12px 16px",gap:8}}>
          {["KRİTER","CLAUDE","CHATGPT","GEMİNİ"].map(h=><div key={h} style={{fontSize:10,fontWeight:700,color:"#475569"}}>{h}</div>)}
        </div>
        {karsilastirmaData.map((k,i)=>(
          <div key={k.kriter} style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",padding:"12px 16px",gap:8,borderTop:"1px solid rgba(255,255,255,0.04)",background:i%2===0?"transparent":"rgba(255,255,255,0.01)"}}>
            <div style={{fontSize:11,color:"#94a3b8",fontWeight:600}}>{k.kriter}</div>
            <div style={{fontSize:11,color:k.kazanan==="Claude"?"#a855f7":"#475569",fontWeight:k.kazanan==="Claude"?700:400}}>{k.claude}</div>
            <div style={{fontSize:11,color:k.kazanan==="ChatGPT"?"#00dcff":"#475569",fontWeight:k.kazanan==="ChatGPT"?700:400}}>{k.chatgpt}</div>
            <div style={{fontSize:11,color:k.kazanan==="Gemini"?"#34d399":"#475569",fontWeight:k.kazanan==="Gemini"?700:400}}>{k.gemini}</div>
          </div>
        ))}
      </div>
      <div style={{marginTop:16,background:"rgba(168,85,247,0.06)",border:"1px solid rgba(168,85,247,0.2)",borderRadius:12,padding:"16px"}}>
        <div style={{fontSize:12,fontWeight:700,color:"#a855f7",marginBottom:8}}>🎯 Verdict: Ne Zaman Claude Kullan?</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:8}}>
          {[["✅ Claude Seç","Kod yazma/debug için","Uzun belge analizi için","Güvenlik kritik görevler","Agentic iş akışları","1M+ token gereken işler"],["❌ Claude Seçme","Görsel üretmek istiyorsan","Sesli sohbet istiyorsan","Hız çok kritikse (Haiku yeterli)","Google ekosistemi entegrasyonu","Popülerlik önemliyse"]].map(([baslik,...items])=>(
            <div key={baslik} style={{background:"rgba(0,0,0,0.3)",borderRadius:9,padding:"12px"}}>
              <div style={{fontSize:11,fontWeight:700,color:baslik.includes("✅")?"#34d399":"#f472b6",marginBottom:8}}>{baslik}</div>
              {items.map(item=><div key={item} style={{fontSize:10,color:"#64748b",marginBottom:4}}>→ {item}</div>)}
            </div>
          ))}
        </div>
      </div>
    </div>}
    {tab==="mimari"&&<div>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {[{baslik:"Transformer Mimarisi",icerik:"Claude, 2017'de Google tarafından önerilen Transformer mimarisi üzerine inşa edilmiştir. Milyarlarca parametre ile eğitilmiş büyük bir dil modeli (LLM). Temel mekanizma: Attention — model, bir token üretirken diğer tüm tokenlara 'dikkat' eder ve bağlamı kavrar.",icon:"🔧"},
        {baslik:"Constitutional AI (CAI)",icerik:"Anthropic'in buluşu. Klasik RLHF yerine, Claude'a bir 'anayasa' (etik ilkeler listesi) verilir. Model önce kendi çıktısını bu anayasaya göre değerlendirir, sonra düzeltir. Bu self-critique süreci hallüsinasyonu ve zararlı içeriği azaltır.",icon:"⚖️"},
        {baslik:"RLHF + RLAIF",icerik:"Claude hem insan geri bildirimiyle (RLHF) hem de AI geri bildirimiyle (RLAIF — Reinforcement Learning from AI Feedback) eğitildi. RLAIF, ölçeklenebilir güvenlik sağlar: Başka bir AI modeli Claude'un çıktılarını değerlendirerek eğitime katkı sağlar.",icon:"🔄"},
        {baslik:"Context Window Tekniği",icerik:"Claude'un 1M token context window'u özel mühendislik çalışmasının ürünü. Standart Transformer dikkat mekanizması O(n²) hesaplama gerektirir — bu 1M token için pratik değil. Anthropic, bu sınırı aşmak için özel optimizasyonlar geliştirdi.",icon:"📚"},
        {baslik:"Task Budget Özelliği",icerik:"Claude Opus 4.7'de eklenen yeni özellik. Ajan görevlerinde Claude'a bir 'bütçe' verebilirsin — maksimum kaç adım atabileceği, ne kadar API çağrısı yapabileceği. Bu, maliyeti kontrol altına alır ve güvenli ajan davranışı sağlar.",icon:"💰"},
        {baslik:"MCP Entegrasyonu",icerik:"Claude, Anthropic'in geliştirdiği Model Context Protocol (MCP) ile dış araçlara bağlanabilir. Veritabanı, dosya sistemi, web tarayıcı, API'lar — 97M+ kurulum ile Claude ekosistemi hızla büyüyor.",icon:"🔌"}].map(m=>(
          <div key={m.baslik} style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(168,85,247,0.12)",borderRadius:12,padding:"16px",display:"flex",gap:12}}>
            <div style={{fontSize:24,flexShrink:0}}>{m.icon}</div>
            <div><div style={{fontSize:13,fontWeight:700,color:"#a855f7",marginBottom:6}}>{m.baslik}</div><div style={{fontSize:12,color:"#64748b",lineHeight:1.7}}>{m.icerik}</div></div>
          </div>
        ))}
      </div>
    </div>}
    <div style={{marginTop:20,textAlign:"center"}}>
      <a href="https://claude.ai" target="_blank" rel="noopener noreferrer" style={{display:"inline-block",padding:"13px 32px",borderRadius:12,border:"none",background:"linear-gradient(135deg,#a855f7,#7c3aed)",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",textDecoration:"none"}}>Claude'u Ücretsiz Dene →</a>
    </div>
  </div>;
}

// ══════════════════════════════════════════════════════════
// CHATGPT KAPSAMLI SAYFA
// ══════════════════════════════════════════════════════════
function ChatGPTPage({setPage}){
  const[tab,setTab]=useState("nedir");
  const tabs=[["nedir","🤖 ChatGPT Nedir?"],["modeller","📊 Modeller"],["ozellikler","⚡ Özellikler"],["promptlar","💡 En İyi Promptlar"],["ipuclari","🎯 Pro İpuçları"]];
  return <div style={{padding:"28px 20px",maxWidth:960,margin:"0 auto"}}>
    <div style={{background:"linear-gradient(135deg,rgba(0,220,255,0.1),rgba(0,0,0,0))",border:"1px solid rgba(0,220,255,0.3)",borderRadius:20,padding:"28px",marginBottom:24}}>
      <div style={{display:"flex",gap:16,alignItems:"center",flexWrap:"wrap",marginBottom:16}}>
        <div style={{fontSize:56}}>🤖</div>
        <div><div style={{fontSize:28,fontWeight:900,color:"#00dcff",marginBottom:4}}>ChatGPT — OpenAI</div><div style={{fontSize:14,color:"#94a3b8"}}>Dünyanın En Popüler AI · 900M Haftalık Kullanıcı · GPT-5.5 · DALL-E 3 · Sesli Sohbet</div></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:10}}>
        {[["👥","900M+","Haftalık kullanıcı"],["🌍","175+","Ülke"],["🖼️","DALL-E 3","Görsel üretim"],["🎙️","Ses Modu","Konuşma AI"],["🔌","Plugin","Ekosistemi"],["💾","Hafıza","Kişiselleşme"]].map(([e,t,d])=>(
          <div key={t} style={{background:"rgba(0,220,255,0.08)",border:"1px solid rgba(0,220,255,0.2)",borderRadius:10,padding:"12px",textAlign:"center"}}>
            <div style={{fontSize:18,marginBottom:4}}>{e}</div><div style={{fontSize:12,fontWeight:700,color:"#00dcff",marginBottom:2}}>{t}</div><div style={{fontSize:10,color:"#475569"}}>{d}</div>
          </div>
        ))}
      </div>
    </div>
    <div style={{display:"flex",gap:3,flexWrap:"wrap",marginBottom:20,borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
      {tabs.map(([id,l])=><button key={id} onClick={()=>setTab(id)} style={{padding:"8px 13px",border:"none",cursor:"pointer",fontSize:11,fontFamily:"inherit",borderRadius:"6px 6px 0 0",background:tab===id?"rgba(0,220,255,0.1)":"transparent",color:tab===id?"#00dcff":"#475569",borderBottom:tab===id?"2px solid #00dcff":"2px solid transparent",whiteSpace:"nowrap"}}>{l}</button>)}
    </div>
    {tab==="nedir"&&<div>
      <div style={{background:"rgba(0,220,255,0.04)",border:"1px solid rgba(0,220,255,0.15)",borderRadius:14,padding:"22px",marginBottom:16}}>
        <div style={{fontSize:16,fontWeight:800,color:"#e2e8f0",marginBottom:12}}>ChatGPT Neden Bu Kadar Popüler?</div>
        <div style={{fontSize:13,color:"#94a3b8",lineHeight:2}}>Kasım 2022'de lansman yapan ChatGPT, 5 günde 1 milyon kullanıcıya ulaştı — teknoloji tarihinin en hızlı büyüyen ürünü. 2026'da 900 milyon haftalık kullanıcıyla hâlâ #1.<br/><br/>
        Türkiye'de de aynı hikaye: AI web trafiğinin %94.49'u ChatGPT'den geliyor (Digital 2026). Her 100 Türk AI kullanıcısından 94'ü ChatGPT kullanıyor.<br/><br/>
        <strong style={{color:"#00dcff"}}>GPT-5.5</strong> ile ChatGPT, metin asistanından "süper uygulamaya" dönüştü: Codex (kodlama), DALL-E 3 (görsel), ses modu, hafıza ve web arama tek platformda.</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12}}>
        {[{t:"Görsel Üretim (DALL-E 3)",d:"ChatGPT'nin en büyük avantajı: Konuşma içinde görsel üret. 'Bana bir logo çiz' demen yeterli. Claude'da bu özellik yok.",c:"#00dcff",e:"🖼️"},{t:"Sesli Sohbet",d:"Mikrofona konuş, ChatGPT cevap ver. Gerçek zamanlı çeviri, konuşma pratiği, eller-serbest kullanım. En gelişmiş ses AI modu.",c:"#a855f7",e:"🎙️"},{t:"Hafıza Özelliği",d:"ChatGPT seni hatırlar: Mesleğin, tercihlerin, projeler. Her sohbette sıfırdan başlamana gerek kalmaz. Kişiselleştirilmiş deneyim.",c:"#34d399",e:"💾"},{t:"Plugin Ekosistemi",d:"Wolfram Alpha, code interpreter, web arama, dosya analizi. Yüzlerce plugin ile ChatGPT'yi güçlendir. En geniş ekosistem.",c:"#fb923c",e:"🔌"}].map(k=>(
          <div key={k.t} style={{background:`${k.c}06`,border:`1px solid ${k.c}20`,borderRadius:12,padding:"14px"}}>
            <div style={{fontSize:22,marginBottom:8}}>{k.e}</div>
            <div style={{fontSize:12,fontWeight:700,color:k.c,marginBottom:6}}>{k.t}</div>
            <div style={{fontSize:11,color:"#64748b",lineHeight:1.6}}>{k.d}</div>
          </div>
        ))}
      </div>
    </div>}
    {tab==="modeller"&&<div>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {[{ad:"GPT-3.5 Turbo",durum:"Eski ama hızlı",detay:"2022'de ChatGPT'yi başlatan model. Artık ücretsiz planda bile nadiren kullanılıyor. Basit görevler için hâlâ yeterli.",maliyet:"API: $0.0005/1K token",c:"#475569"},{ad:"GPT-4o",durum:"Ücretsiz güç merkezi",detay:"'omni' model — metin, ses ve görüntüyü birlikte işler. Ücretsiz kullanıcıların erişebildiği en güçlü model. Günlük limit var.",maliyet:"API: $0.005/1K token",c:"#60a5fa"},{ad:"GPT-4o mini",durum:"Hızlı ve ekonomik",detay:"GPT-4o'nun küçük kardeşi. API maliyeti çok düşük. Chatbot ve basit otomasyon uygulamaları için ideal.",maliyet:"API: $0.00015/1K token",c:"#34d399"},{ad:"GPT-5.5",durum:"2026'nın amiral gemisi",detay:"Kodex ve tarayıcı ile birleşti. Süper uygulama dönemini başlattı. Enterprise kullanıcılara ve Pro ($200/ay) sahiplerine öncelikli erişim.",maliyet:"Pro: $200/ay sınırsız",c:"#00dcff"},{ad:"o1 / o3",durum:"Akıl yürütme modelleri",detay:"Cevap vermeden önce uzun süre 'düşünen' modeller. Matematik, fizik, karmaşık mantık sorunlarında standart GPT'yi eziyor.",maliyet:"Pro planında dahil",c:"#a855f7"}].map(m=>(
          <div key={m.ad} style={{background:`${m.c}06`,border:`1px solid ${m.c}22`,borderRadius:12,padding:"16px"}}>
            <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8,marginBottom:8}}>
              <div style={{fontSize:14,fontWeight:800,color:m.c}}>{m.ad}</div>
              <div style={{fontSize:11,background:`${m.c}18`,color:m.c,padding:"3px 10px",borderRadius:6}}>{m.durum}</div>
            </div>
            <div style={{fontSize:12,color:"#64748b",lineHeight:1.6,marginBottom:8}}>{m.detay}</div>
            <div style={{fontSize:10,color:"#475569"}}>💰 {m.maliyet}</div>
          </div>
        ))}
      </div>
    </div>}
    {tab==="promptlar"&&<div>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {[{baslik:"🎨 DALL-E 3 ile Görsel Üret",prompt:"ChatGPT'de doğrudan yaz: 'Bana [açıklama] tarzında bir görsel çiz. Boyut: [kare/yatay/dikey]. Stil: [fotogerçekçi/illustrasyon/minimalist]. Renk paleti: [renkler].'\n\nÖrnek: 'Modern bir İstanbul kafesi iç mekanı, sıcak ışıklandırma, Boğaz manzarası, fotogerçekçi, yatay format.'",ipucu:"DALL-E 3, ChatGPT Plus ve Pro'da dahil. Ücretsiz planda sınırlı."},
        {baslik:"🎙️ Sesli Mod İpuçları",prompt:"ChatGPT uygulamasında ses butonuna bas. Şunları dene:\n- 'Benimle İngilizce konuş, hatalarımı düzelt'\n- 'Bu konuyu bana öğret, anlamadığım yerde dur'\n- 'Senaryo: Müşteri olarak davran, ben de satış yapayım'\n- 'Bu metni oku ve vurgulı yerlerini söyle'",ipucu:"Mobil uygulamada kullanılabilir. Gerçek zamanlı dil pratiği için mükemmel."},
        {baslik:"💾 Hafızayı Etkin Kullan",prompt:"Sohbet başına şunu yaz:\n'Beni hatırla: [mesleğin], [kullandığın araçlar], [tercihler]. Her yanıtta bunu göz önünde bulundur.'\n\nYa da Settings > Memory'den manuel ekle:\n- 'Türkçe yanıt ver'\n- 'Kodlarda daima TypeScript kullan'\n- 'Açıklamaları kısa tut'",ipucu:"ChatGPT hafıza özelliği Türkiye'de aktif. Ayarlardan kapatabilirsin."},
        {baslik:"🔍 Web Araması ile Güncel Bilgi",prompt:"'[konu] hakkında güncel bilgi ver' dediğinde ChatGPT web'e bağlanır.\n\nEtkili sorgular:\n- 'Bugünkü [şirket] haberleri neler?'\n- '[teknoloji] 2026'daki son gelişmeleri'\n- '[ürün] güncel fiyatı ne kadar?'\n- '[konu] hakkında son araştırmalar'",ipucu:"Web araması Plus ve üstü planlarda. Perplexity kadar kaynaklı değil ama entegrasyon kolaylığı var."},
        {baslik:"📊 Veri Analizi ve Grafik",prompt:"CSV veya Excel dosyasını ChatGPT'ye yükle, sonra:\n- 'Bu veriyi analiz et, ana trendleri bul'\n- 'Aylık satışları grafik olarak göster'\n- 'Aykırı değerleri tespit et'\n- 'Bu veri için tahmin modeli kur'\n- 'Özet rapor yaz, yöneticiye sunacağım'",ipucu:"Code Interpreter özelliği gerçek Python kodu çalıştırır. Sonuçlar doğrulanabilir."}].map((p,i)=>(
          <div key={i} style={{background:"rgba(0,220,255,0.04)",border:"1px solid rgba(0,220,255,0.15)",borderRadius:13,overflow:"hidden"}}>
            <div style={{background:"rgba(0,220,255,0.08)",padding:"11px 16px",fontSize:13,fontWeight:700,color:"#e2e8f0"}}>{p.baslik}</div>
            <div style={{padding:"13px 16px"}}>
              <div style={{background:"rgba(0,0,0,0.4)",borderRadius:9,padding:"11px",fontFamily:"monospace",fontSize:11,color:"#94a3b8",lineHeight:1.8,marginBottom:8,whiteSpace:"pre-wrap"}}>{p.prompt}</div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{fontSize:11,color:"#475569",fontStyle:"italic"}}>💡 {p.ipucu}</div>
                <button onClick={()=>navigator.clipboard?.writeText(p.prompt)} style={{padding:"4px 10px",borderRadius:6,border:"none",background:"rgba(0,220,255,0.15)",color:"#00dcff",fontSize:9,cursor:"pointer",fontFamily:"inherit",flexShrink:0,marginLeft:8}}>Kopyala</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>}
    {tab==="ipuclari"&&<div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12}}>
        {[{t:"Rol Vermenin Gücü",d:"'Deneyimli bir X olarak...' ile başla. ChatGPT bu rolü benimseyerek çok daha kaliteli çıktı üretir. Rol ne kadar spesifik, çıktı o kadar iyi.",e:"🎭",c:"#00dcff"},{t:"'Devam et' Kullan",d:"Cevap yarıda kesilirse 'devam et' yaz. Uzun içerikler için 'sonraki bölümü yaz' de. Asla baştan isteme — token israf olur.",e:"▶️",c:"#a855f7"},{t:"Örnek Göster",d:"İstediğin tarzda bir örnek ver: 'Şu şekilde yaz: [örnek]'. ChatGPT örneği taklit eder. Ton, uzunluk, format için çok etkili.",e:"📋",c:"#34d399"},{t:"Iterasyon Yap",d:"İlk çıktıyı beğenmezsen spesifik eleştir: 'Daha kısa ol', 'Teknik terimler kullan', 'Daha samimi ton'. Genel 'daha iyi yap' işe yaramaz.",e:"🔄",c:"#fb923c"},{t:"JSON ve Yapısal Çıktı",d:"'JSON formatında ver', 'Markdown tablo yap', 'Madde madde listele' gibi format komutları çıktıyı kullanılabilir hale getirir.",e:"📊",c:"#60a5fa"},{t:"Sıcaklık Kontrolü",d:"'Yaratıcı ol' (yüksek sıcaklık) vs 'Kesin ve teknik ol' (düşük sıcaklık). Bu ifadeler ChatGPT'nin davranışını etkiler.",e:"🌡️",c:"#f472b6"}].map(k=>(
          <div key={k.t} style={{background:`${k.c}06`,border:`1px solid ${k.c}18`,borderRadius:12,padding:"14px"}}>
            <div style={{fontSize:22,marginBottom:8}}>{k.e}</div>
            <div style={{fontSize:12,fontWeight:700,color:k.c,marginBottom:6}}>{k.t}</div>
            <div style={{fontSize:11,color:"#64748b",lineHeight:1.6}}>{k.d}</div>
          </div>
        ))}
      </div>
    </div>}
    <div style={{marginTop:20,textAlign:"center"}}>
      <a href="https://chatgpt.com" target="_blank" rel="noopener noreferrer" style={{display:"inline-block",padding:"13px 32px",borderRadius:12,border:"none",background:"linear-gradient(135deg,#00dcff,#0891b2)",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",textDecoration:"none"}}>ChatGPT'yi Dene →</a>
    </div>
  </div>;
}

// ══════════════════════════════════════════════════════════
// GEMİNİ KAPSAMLI SAYFA
// ══════════════════════════════════════════════════════════
function GeminiPage({setPage}){
  const[tab,setTab]=useState("nedir");
  const tabs=[["nedir","🌟 Gemini Nedir?"],["modeller","📊 Modeller"],["entegrasyon","🔗 Google Entegrasyonu"],["promptlar","💡 En İyi Promptlar"]];
  return <div style={{padding:"28px 20px",maxWidth:960,margin:"0 auto"}}>
    <div style={{background:"linear-gradient(135deg,rgba(52,211,153,0.1),rgba(0,0,0,0))",border:"1px solid rgba(52,211,153,0.3)",borderRadius:20,padding:"28px",marginBottom:24}}>
      <div style={{display:"flex",gap:16,alignItems:"center",flexWrap:"wrap",marginBottom:16}}>
        <div style={{fontSize:56}}>🌟</div>
        <div><div style={{fontSize:28,fontWeight:900,color:"#34d399",marginBottom:4}}>Gemini — Google DeepMind</div><div style={{fontSize:14,color:"#94a3b8"}}>2M Token Dünya Rekoru · Google Ekosistemi · Gerçek Zamanlı Web · Multimodal</div></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:10}}>
        {[["📚","2M Token","Dünya rekoru"],["🔍","Google","Tam entegrasyon"],["🌐","Web","Gerçek zamanlı"],["📷","Multimodal","Görsel+ses+metin"],["📱","Android","Yerleşik asistan"],["🆓","Geniş","Ücretsiz plan"]].map(([e,t,d])=>(
          <div key={t} style={{background:"rgba(52,211,153,0.08)",border:"1px solid rgba(52,211,153,0.2)",borderRadius:10,padding:"12px",textAlign:"center"}}>
            <div style={{fontSize:18,marginBottom:4}}>{e}</div><div style={{fontSize:12,fontWeight:700,color:"#34d399",marginBottom:2}}>{t}</div><div style={{fontSize:10,color:"#475569"}}>{d}</div>
          </div>
        ))}
      </div>
    </div>
    <div style={{display:"flex",gap:3,flexWrap:"wrap",marginBottom:20,borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
      {tabs.map(([id,l])=><button key={id} onClick={()=>setTab(id)} style={{padding:"8px 13px",border:"none",cursor:"pointer",fontSize:11,fontFamily:"inherit",borderRadius:"6px 6px 0 0",background:tab===id?"rgba(52,211,153,0.1)":"transparent",color:tab===id?"#34d399":"#475569",borderBottom:tab===id?"2px solid #34d399":"2px solid transparent",whiteSpace:"nowrap"}}>{l}</button>)}
    </div>
    {tab==="nedir"&&<div>
      <div style={{background:"rgba(52,211,153,0.04)",border:"1px solid rgba(52,211,153,0.15)",borderRadius:14,padding:"22px",marginBottom:16}}>
        <div style={{fontSize:16,fontWeight:800,color:"#e2e8f0",marginBottom:12}}>Gemini Neden Farklı?</div>
        <div style={{fontSize:13,color:"#94a3b8",lineHeight:2}}>Google DeepMind tarafından 2024'te lansmanı yapılan Gemini, ChatGPT ve Claude'dan farklı bir tasarım anlayışıyla geldi: <strong style={{color:"#34d399"}}>sıfırdan multimodal.</strong><br/><br/>
        Önceki modeller önce metni öğrendi, sonra görsel/ses eklendi. Gemini ise başından beri metin, görsel, ses ve videoyu birlikte işleyecek şekilde tasarlandı. Bu mimarisi sayesinde farklı medya türleri arasında daha doğal geçiş yapabiliyor.<br/><br/>
        <strong style={{color:"#34d399"}}>2M token context window</strong> şu an dünya rekoru. 1500 sayfalık kitabı, 200+ akademik makaleyi veya büyük bir kod tabanını tek sohbette işleyebilir.<br/><br/>
        Google ekosistemi entegrasyonu ise Gemini'nin en güçlü kozu: Gmail, Drive, Docs, Sheets, YouTube — tümüne erişim.</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12}}>
        {[{t:"2M Token Context",d:"ChatGPT'nin 128K, Claude'un 1M tokenına karşı Gemini 2M token. Bu yaklaşık 1500 sayfalık kitap veya 200+ makale demek.",c:"#34d399",e:"📚"},{t:"Gerçek Zamanlı Web",d:"Gemini her sohbette web'e bağlanabilir. Güncel haber, güncel fiyat, güncel araştırma — taze bilgi her zaman erişilebilir.",c:"#00dcff",e:"🌐"},{t:"Google Drive Analizi",d:"Drive'daki dosyaları direkt analiz et. 'Bu raporumu özetle', 'Bu sunumu iyileştir' — Google ekosistemi entegrasyonu.",c:"#60a5fa",e:"📁"},{t:"Imagen 3 ile Görsel",d:"Gemini Ultra'da Imagen 3 görsel üretimi mevcut. ChatGPT'nin DALL-E 3'üne rakip, özellikle fotogerçekçi görsellerde güçlü.",c:"#f472b6",e:"🖼️"}].map(k=>(
          <div key={k.t} style={{background:`${k.c}06`,border:`1px solid ${k.c}20`,borderRadius:12,padding:"14px"}}>
            <div style={{fontSize:22,marginBottom:8}}>{k.e}</div>
            <div style={{fontSize:12,fontWeight:700,color:k.c,marginBottom:6}}>{k.t}</div>
            <div style={{fontSize:11,color:"#64748b",lineHeight:1.6}}>{k.d}</div>
          </div>
        ))}
      </div>
    </div>}
    {tab==="modeller"&&<div>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {[{ad:"Gemini Nano",d:"Telefonda çalışır, internet gerekmez. Pixel ve Samsung telefonlarda yerleşik. Basit görevler için hızlı ve gizli.",c:"#475569",plan:"Android cihazlarda dahil"},{ad:"Gemini Flash",d:"Hızlı ve ekonomik. API için en popüler seçim. Ücretsiz planda bile güçlü. Chatbot ve otomasyon uygulamaları için ideal.",c:"#60a5fa",plan:"Ücretsiz"},{ad:"Gemini 2.5 Pro",d:"Araştırma ve analiz için güçlü model. Google AI Pro ($19.99/ay) planında. Drive entegrasyonu ile maksimum verimlilik.",c:"#34d399",plan:"AI Pro: $19.99/ay"},{ad:"Gemini 3.1 Ultra",d:"2M token, en güçlü model. Multimodal performans rekoru. Enterprise ve araştırma için. Görsel, ses, metin, video aynı anda.",c:"#00dcff",plan:"AI Ultra: $249/ay"}].map(m=>(
          <div key={m.ad} style={{background:`${m.c}06`,border:`1px solid ${m.c}22`,borderRadius:12,padding:"16px"}}>
            <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8,marginBottom:8}}>
              <div style={{fontSize:14,fontWeight:800,color:m.c}}>{m.ad}</div>
              <div style={{fontSize:10,color:"#475569"}}>💰 {m.plan}</div>
            </div>
            <div style={{fontSize:12,color:"#64748b",lineHeight:1.6}}>{m.d}</div>
          </div>
        ))}
      </div>
    </div>}
    {tab==="entegrasyon"&&<div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",gap:12}}>
        {[{icon:"📧",baslik:"Gmail Entegrasyonu",detay:"'Gelen kutundaki tüm toplantı davetlerini özetle ve takvime ekle', 'Bu e-postaya Türkçe profesyonel yanıt yaz', 'Geçen haftaki önemli e-postaları listele'",renk:"#34d399"},{icon:"📁",baslik:"Google Drive",detay:"Drive'daki PDF, Docs, Sheets dosyalarını direkt analiz et. 'Q1 raporum.xlsx'i analiz et, trend bul', 'Bu sözleşmeyi özetle', 'Projelerimi karşılaştır'",renk:"#00dcff"},{icon:"📄",baslik:"Google Docs",detay:"Doküman içinde Gemini aç. 'Bu bölümü yeniden yaz', 'Gramer hatalarını düzelt', 'Bu rapora yönetici özeti ekle', 'Daha resmi ton kullan'",renk:"#60a5fa"},{icon:"📊",baslik:"Google Sheets",detay:"Veriyi analiz et, formül öner, grafik oluştur. 'Bu verideki anomalileri bul', 'Aylık büyüme formülü ekle', 'Satış tahmin modeli kur'",renk:"#f472b6"},{icon:"🎬",baslik:"YouTube",detay:"Video içeriğini analiz et. 'Bu videonun özetini çıkar', 'Hangi konular ele alındı?', 'Bu kanalın içerik stratejisi nedir?'",renk:"#fb923c"},{icon:"📅",baslik:"Google Calendar",detay:"Takvimini yönet. 'Bu haftaki toplantılarımı özetle', 'Benimle toplantı için uygun zaman bul', 'Bu etkinlik için hazırlık listesi oluştur'",renk:"#a855f7"}].map(k=>(
          <div key={k.baslik} style={{background:`${k.renk}06`,border:`1px solid ${k.renk}18`,borderRadius:12,padding:"14px"}}>
            <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:8}}><span style={{fontSize:22}}>{k.icon}</span><div style={{fontSize:12,fontWeight:700,color:k.renk}}>{k.baslik}</div></div>
            <div style={{fontSize:11,color:"#64748b",lineHeight:1.6}}>{k.detay}</div>
          </div>
        ))}
      </div>
    </div>}
    {tab==="promptlar"&&<div>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {[{b:"🔍 Güncel Araştırma",p:"[Konu] hakkında 2026'daki en güncel gelişmeleri araştır. Özellikle şunlara odaklan:\n1) Son 3 aydaki önemli haberler\n2) Akademik araştırmalar varsa özetle\n3) Uzman görüşleri\n4) Türkiye'ye olan etkisi\nKaynaklarını belirt.",t:"Gemini web'e bağlanır, gerçek zamanlı bilgi getirir."},
        {b:"📁 Drive Belge Analizi",p:"[Drive'dan yüklediğin dosyayı analiz et]\n\nBu belgeden şunları çıkar:\n1) Ana iddialar ve öneriler\n2) Karar gerektiren noktalar\n3) Eksik bilgiler veya belirsizlikler\n4) Bir sonraki adımlar (action items)\n5) Önemli rakamlar ve tarihler",t:"Drive dosyasını sohbet penceresine sürükle bırak."},
        {b:"🖼️ Görsel Analizi",p:"Bu görüntüyü/grafiği analiz et:\n[Görüntüyü yükle]\n\nBenden şunları yapmanı istiyorum:\n1) Ana mesajı ve amacı açıkla\n2) Dikkat çeken unsurları listele\n3) Veri varsa rakamları özetle\n4) Güçlü ve zayıf yönleri belirt\n5) İyileştirme önerileri",t:"Gemini'nin görsel analizi özellikle grafik ve infografikler için güçlü."},
        {b:"📊 Sheets Veri Analizi",p:"Bu tabloyu analiz et:\n[Sheets verini yapıştır veya dosya yükle]\n\n1) Veriyi özetle (5 satır)\n2) En önemli trendleri göster\n3) Aykırı değerleri tespit et\n4) Korelasyonları bul\n5) Tahmin modeli öner\n6) Görselleştirme önerileri",t:"Sheets entegrasyonu ile direkt veri çekerek analiz yapar."}].map((p,i)=>(
          <div key={i} style={{background:"rgba(52,211,153,0.04)",border:"1px solid rgba(52,211,153,0.15)",borderRadius:12,overflow:"hidden"}}>
            <div style={{background:"rgba(52,211,153,0.08)",padding:"11px 16px",fontSize:13,fontWeight:700,color:"#e2e8f0"}}>{p.b}</div>
            <div style={{padding:"13px 16px"}}>
              <div style={{background:"rgba(0,0,0,0.4)",borderRadius:9,padding:"11px",fontFamily:"monospace",fontSize:11,color:"#94a3b8",lineHeight:1.8,marginBottom:8,whiteSpace:"pre-wrap"}}>{p.p}</div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{fontSize:11,color:"#475569",fontStyle:"italic"}}>💡 {p.t}</div>
                <button onClick={()=>navigator.clipboard?.writeText(p.p)} style={{padding:"4px 10px",borderRadius:6,border:"none",background:"rgba(52,211,153,0.15)",color:"#34d399",fontSize:9,cursor:"pointer",fontFamily:"inherit",flexShrink:0,marginLeft:8}}>Kopyala</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>}
    <div style={{marginTop:20,textAlign:"center"}}>
      <a href="https://gemini.google.com" target="_blank" rel="noopener noreferrer" style={{display:"inline-block",padding:"13px 32px",borderRadius:12,border:"none",background:"linear-gradient(135deg,#34d399,#059669)",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",textDecoration:"none"}}>Gemini'yi Dene →</a>
    </div>
  </div>;
}

function NavSearchBar({nav}){
  const[open,setOpen]=useState(false);
  const[q,setQ]=useState('');
  const ref=useRef();
  const PAGES=[
    {p:'home',t:'Ana Sayfa',e:'🏠'},{p:'haberler',t:'Haberler',e:'📰'},{p:'blog',t:'Blog',e:'✍️'},
    {p:'claude',t:'Claude',e:'🧠'},{p:'chatgpt',t:'ChatGPT',e:'🤖'},{p:'gemini',t:'Gemini',e:'🌟'},
    {p:'tools',t:'Tools',e:'🛠️'},{p:'animasyon',t:'Animasyonlar',e:'🎬'},{p:'oyunlar',t:'Oyunlar',e:'🎮'},
    {p:'prompt',t:'Prompt Rehberi',e:'💡'},{p:'sozluk',t:'Sözlük',e:'📖'},{p:'para',t:'Para Kazan',e:'💰'},
    {p:'trivia',t:'AI Trivia',e:'🎯'},{p:'iqtest',t:'IQ Testi',e:'🧠'},{p:'kariyer',t:'Kariyer',e:'💼'},
    {p:'ogrenme',t:'Öğren',e:'🎓'},{p:'sertifika',t:'Sertifika',e:'🏆'},{p:'wizard',t:'Sihirbaz',e:'🔮'},
  ];
  const results=q.length>1?PAGES.filter(p=>p.t.toLowerCase().includes(q.toLowerCase())).slice(0,8):[];
  useEffect(()=>{
    if(!open)return;
    const h=e=>{if(ref.current&&!ref.current.contains(e.target)){setOpen(false);setQ('');}};
    document.addEventListener('mousedown',h);
    return()=>document.removeEventListener('mousedown',h);
  },[open]);
  return <div ref={ref} style={{position:'relative',flexShrink:0}}>
    <button onClick={()=>setOpen(o=>!o)} style={{width:34,height:34,border:'1px solid rgba(0,220,255,0.2)',borderRadius:8,background:open?'rgba(0,220,255,0.1)':'transparent',color:'#64748b',cursor:'pointer',fontSize:14,display:'flex',alignItems:'center',justifyContent:'center'}} title="Ara">🔍</button>
    {open&&<div style={{position:'fixed',top:52,right:50,zIndex:99999,width:260,background:'rgba(4,8,20,0.99)',border:'1px solid rgba(0,220,255,0.3)',borderRadius:12,boxShadow:'0 20px 60px rgba(0,0,0,0.9)',overflow:'hidden'}}>
      <div style={{padding:'10px 12px',borderBottom:'1px solid rgba(0,220,255,0.1)',display:'flex',alignItems:'center',gap:8}}>
        <span style={{color:'#334155',fontSize:14}}>🔍</span>
        <input autoFocus value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==='Escape'&&(setOpen(false)||setQ(''))} placeholder='Ara...' style={{flex:1,background:'none',border:'none',outline:'none',color:'#e2e8f0',fontSize:12,fontFamily:'inherit'}}/>
        {q&&<button onClick={()=>setQ('')} style={{background:'none',border:'none',color:'#475569',cursor:'pointer',fontSize:12}}>✕</button>}
      </div>
      <div style={{maxHeight:280,overflowY:'auto'}}>
        {results.length>0
          ?results.map(r=><div key={r.p} onClick={()=>{nav(r.p);setOpen(false);setQ('');}} style={{display:'flex',gap:10,alignItems:'center',padding:'8px 12px',cursor:'pointer',fontSize:11,color:'#e2e8f0',transition:'background .1s'}} onMouseEnter={e=>e.currentTarget.style.background='rgba(0,220,255,0.06)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}><span style={{fontSize:14}}>{r.e}</span><span>{r.t}</span></div>)
          :<div style={{padding:'10px 12px'}}>{PAGES.slice(0,6).map(r=><div key={r.p} onClick={()=>{nav(r.p);setOpen(false);}} style={{display:'flex',gap:10,alignItems:'center',padding:'6px 8px',borderRadius:8,cursor:'pointer',fontSize:11,color:'#64748b'}} onMouseEnter={e=>e.currentTarget.style.background='rgba(0,220,255,0.06)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}><span style={{fontSize:13}}>{r.e}</span><span>{r.t}</span></div>)}</div>}
      </div>
    </div>}
  </div>;
}

function Wrapper({children,nav,page,user,setUser,cookie,setCookie}){
  const[email,setEmail]=useState("");const[sent,setSent]=useState(false);
  const[openMenu,setOpenMenu]=useState(null);
  const[mobileOpen,setMobileOpen]=useState(false);
  useBadges(page);
  useParallax();
  useSesliKarsilama();
  // Close dropdown when clicking outside
  useEffect(()=>{
    const h=e=>{if(!e.target.closest('[data-nav]'))setOpenMenu(null);};
    document.addEventListener('click',h);
    return()=>document.removeEventListener('click',h);
  },[]);
  return <div style={{minHeight:"100vh",background:"#060a14",color:"#e2e8f0",fontFamily:"'Inter',system-ui,sans-serif"}}>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700;800&display=swap');
      @keyframes spin{to{transform:rotate(360deg)}}
      @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
      @keyframes fadeIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
      @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
      @keyframes glow{0%,100%{box-shadow:0 0 12px rgba(0,220,255,0.4)}50%{box-shadow:0 0 32px rgba(0,220,255,0.8)}}
      @keyframes logoPulse{0%,100%{filter:drop-shadow(0 0 6px rgba(0,220,255,0.5))}50%{filter:drop-shadow(0 0 18px rgba(0,220,255,1))}}
      @keyframes gradient{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
      @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
      @keyframes shimmer{0%{opacity:.5}100%{opacity:1}}
      @keyframes countUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
      *{box-sizing:border-box;margin:0;padding:0}
      ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:linear-gradient(#00dcff,#a855f7);border-radius:3px}
      button,a{transition:all .2s cubic-bezier(.4,0,.2,1)}
      h1,h2,h3{font-family:'Space Grotesk',sans-serif}
      .card-hover{transition:all .2s cubic-bezier(.4,0,.2,1)}
      .card-hover:hover{transform:translateY(-4px) scale(1.01);box-shadow:0 16px 48px rgba(0,0,0,0.5)}
      .card-3d{transition:transform .2s;transform-style:preserve-3d}
      .card-3d:hover{transform:perspective(800px) rotateX(-3deg) rotateY(5deg) scale(1.02)}
      .gradient-text{background:linear-gradient(135deg,#00dcff,#a855f7,#f472b6);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:gradient 4s linear infinite}
      .glass{background:rgba(255,255,255,0.04);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.08)}
      .btn-primary{background:linear-gradient(135deg,#00dcff,#a855f7);border:none;color:#fff;font-weight:700;cursor:pointer;border-radius:10px}
      .btn-primary:hover{opacity:.9;transform:translateY(-1px);box-shadow:0 8px 24px rgba(0,220,255,0.4)}
      .neon-text{text-shadow:0 0 10px rgba(0,220,255,0.8),0 0 20px rgba(0,220,255,0.4)}
      .dropdown-open .dropdown-menu{display:block!important}
    `}</style>
    <CursorTrail/>
    <AmbientSound/>
    {cookie&&<div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:999,background:"rgba(6,10,20,0.95)",borderTop:"1px solid rgba(0,220,255,0.15)",padding:"10px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8,backdropFilter:"blur(20px)"}}>
      <div style={{fontSize:11,color:"#64748b"}}>🍪 Zorunlu çerezler kullanır. <span onClick={()=>nav("gizlilik")} style={{color:"#00dcff",cursor:"pointer"}}>Gizlilik</span></div>
      <div style={{display:"flex",gap:8}}><button onClick={()=>setCookie(false)} className="btn-primary" style={{padding:"6px 16px",fontSize:11,borderRadius:8,fontFamily:"inherit"}}>Kabul Et</button><button onClick={()=>setCookie(false)} style={{padding:"6px 12px",borderRadius:8,border:"1px solid rgba(255,255,255,0.1)",background:"transparent",color:"#475569",fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>Reddet</button></div>
    </div>}
    <Ticker/>
            {/* ═══ NAVBAR ═══ */}
    <nav style={{position:"sticky",top:0,zIndex:10000,background:"rgba(4,8,20,0.97)",borderBottom:"1px solid rgba(0,220,255,0.1)",backdropFilter:"blur(20px)"}}>
      <div style={{display:"flex",alignItems:"center",padding:"0 12px",height:54,gap:4}}>
        {/* Logo + Slogan */}
        <div onClick={()=>{nav("home");setMobileOpen(false);}} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:8,flexShrink:0,marginRight:8}}>
          <div style={{position:"relative",flexShrink:0}}>
            <div style={{position:"absolute",inset:-4,borderRadius:"50%",background:"radial-gradient(ellipse,rgba(0,220,255,0.35),transparent 70%)",animation:"glow 2s ease-in-out infinite",zIndex:0}}/>
            <img src="/logo.png" alt="IMDATAI" style={{width:44,height:44,objectFit:"contain",borderRadius:10,position:"relative",zIndex:1,filter:"drop-shadow(0 0 8px rgba(0,220,255,0.8)) brightness(1.1)",animation:"logoPulse 2.5s ease-in-out infinite"}} onError={e=>{e.target.style.display="none";e.target.parentElement.innerHTML+='<div style="width:44px;height:44px;border-radius:10px;background:linear-gradient(135deg,rgba(0,220,255,0.2),rgba(168,85,247,0.2));border:2px solid rgba(0,220,255,0.5);display:flex;align-items:center;justify-content:center;font-size:26px;color:#00dcff;filter:drop-shadow(0 0 8px #00dcff)">⬡</div>';}}/>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:1}}>
            <span style={{fontSize:18,fontWeight:900,background:"linear-gradient(90deg,#00dcff,#a855f7)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",fontFamily:"Space Grotesk,sans-serif",lineHeight:1}}>IMDATAI</span>
            <span style={{fontSize:9,color:"rgba(0,220,255,0.55)",letterSpacing:".1em",lineHeight:1,whiteSpace:"nowrap"}}>TÜRKİYE'NİN AI HUB'I</span>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:1,flexShrink:0}}>
          {[{id:"home",l:"Ana Sayfa"},{id:"haberler",l:"Haberler"},{id:"blog",l:"Blog"}].map(n=>(
            <button key={n.id} onClick={()=>{nav(n.id);setMobileOpen(false);}} style={{padding:"5px 9px",border:"none",cursor:"pointer",fontSize:10,fontFamily:"inherit",borderRadius:6,background:page===n.id?"rgba(0,220,255,0.12)":"transparent",color:page===n.id?"#00dcff":"#64748b",whiteSpace:"nowrap",flexShrink:0,fontWeight:page===n.id?700:400,borderBottom:page===n.id?"2px solid #00dcff":"2px solid transparent"}}>{n.l}</button>
          ))}
        </div>
        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
          <NavSearchBar nav={nav}/>
          <button onClick={()=>setMobileOpen(o=>!o)} style={{width:34,height:34,border:"1px solid rgba(0,220,255,0.2)",borderRadius:8,background:mobileOpen?"rgba(0,220,255,0.12)":"transparent",cursor:"pointer",color:"#00dcff",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{mobileOpen?"✕":"☰"}</button>
        </div>
      </div>
    </nav>{mobileOpen&&<div style={{position:"fixed",inset:0,zIndex:9998}} onClick={()=>setMobileOpen(false)}>
      <div onClick={e=>e.stopPropagation()} style={{position:"absolute",top:0,right:0,width:"min(320px,90vw)",height:"100vh",background:"rgba(4,8,20,0.99)",borderLeft:"1px solid rgba(0,220,255,0.12)",overflowY:"auto",boxShadow:"-20px 0 60px rgba(0,0,0,0.9)"}}>
        <div style={{padding:"14px 16px",borderBottom:"1px solid rgba(0,220,255,0.08)",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,background:"rgba(4,8,20,0.99)",zIndex:1}}>
          <span style={{fontSize:13,fontWeight:700,color:"#00dcff",fontFamily:"Space Grotesk,sans-serif"}}>🗺️ Tüm Sayfalar</span>
          <button onClick={()=>setMobileOpen(false)} style={{background:"none",border:"none",color:"#475569",fontSize:20,cursor:"pointer",lineHeight:1}}>✕</button>
        </div>
        <div style={{padding:"12px"}}>
          {NAV_GROUPS.map(g=>(
            <div key={g.id||g.label} style={{marginBottom:14}}>
              {!g.sub
                ?<button onClick={()=>{nav(g.id);setMobileOpen(false);}} style={{width:"100%",padding:"10px 14px",borderRadius:10,border:"1px solid rgba(0,220,255,0.1)",background:page===g.id?"rgba(0,220,255,0.08)":"rgba(255,255,255,0.02)",color:page===g.id?"#00dcff":"#94a3b8",fontSize:12,cursor:"pointer",fontFamily:"inherit",textAlign:"left",fontWeight:page===g.id?700:400}}>{g.label}</button>
                :<><div style={{fontSize:9,color:"#334155",letterSpacing:".12em",padding:"2px 4px 7px",fontWeight:700,textTransform:"uppercase"}}>{g.label}</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5}}>
                  {g.sub.map(s=><button key={s.id} onClick={()=>{nav(s.id);setMobileOpen(false);}} style={{padding:"8px 10px",borderRadius:9,border:"1px solid rgba(255,255,255,0.05)",background:page===s.id?"rgba(0,220,255,0.08)":"rgba(255,255,255,0.02)",color:page===s.id?"#00dcff":"#64748b",fontSize:10,cursor:"pointer",fontFamily:"inherit",textAlign:"left",display:"flex",gap:5,alignItems:"center",fontWeight:page===s.id?600:400}}>
                    <span style={{fontSize:13,flexShrink:0}}>{s.icon}</span><span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.label}</span>
                  </button>)}
                </div></>
              }
            </div>
          ))}
          <div style={{borderTop:"1px solid rgba(255,255,255,0.05)",paddingTop:12,marginTop:4}}>
            <div style={{fontSize:9,color:"#334155",letterSpacing:".12em",marginBottom:8,fontWeight:700}}>SOSYAL MEDYA</div>
            <div style={{display:"flex",gap:8}}>
              {[["🎬","YouTube","https://youtube.com/@imdatai","#ff4444"],["🎵","TikTok","https://tiktok.com/@imdatai","#00f2ea"],["📸","Instagram","https://instagram.com/imdatai","#e1306c"]].map(([e,n,u,c])=>(
                <a key={n} href={u} target="_blank" rel="noopener noreferrer" style={{flex:1,padding:"8px 4px",borderRadius:8,border:"1px solid "+c+"33",background:c+"11",color:c,fontSize:9,textAlign:"center",textDecoration:"none",display:"flex",flexDirection:"column",gap:2,alignItems:"center"}}>
                  <span style={{fontSize:18}}>{e}</span><span style={{fontWeight:700}}>{n}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>}
    <div style={{animation:"fadeIn .3s ease"}} key={page}>{children}</div>
    <BadgeDisplay/>
    <footer style={{borderTop:"1px solid rgba(255,255,255,0.05)",padding:"40px 20px 32px",marginTop:40,background:"linear-gradient(to bottom,rgba(0,0,0,0.1),rgba(0,0,0,0.3))"}}>
      <div style={{maxWidth:960,margin:"0 auto"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:28,marginBottom:32}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
              <img src="/logo.png" alt="" style={{width:26,height:26,borderRadius:6,objectFit:"cover"}} onError={e=>e.target.style.display="none"}/>
              <span style={{fontSize:13,fontWeight:900,background:"linear-gradient(90deg,#00dcff,#a855f7)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",fontFamily:"'Space Grotesk',sans-serif"}}>IMDATAI</span>
            </div>
            <div style={{fontSize:10,color:"#334155",marginBottom:12,lineHeight:1.7}}>Türkiye'nin #1 AI Hub'ı<br/>Gemini AI ile güçlendirildi</div>
            <div style={{display:"flex",gap:10}}><a href="https://youtube.com/@imdatai" target="_blank" rel="noopener noreferrer"><YT/></a><a href="https://tiktok.com/@imdatai" target="_blank" rel="noopener noreferrer"><TT/></a><a href="https://instagram.com/imdatai" target="_blank" rel="noopener noreferrer"><IG/></a></div>
          </div>
          {[["AI Modeller",["Claude","ChatGPT","Gemini","Karşılaştır"],["claude","chatgpt","gemini","karsilastirma"]],["Öğren",["AI Öğren","Prompt","Sözlük","Kariyer"],["ogrenme","prompt","sozluk","kariyer"]],["Oyunlar",["Trivia","Roulette","Dedektif","IQ Testi"],["trivia","roulette","dedektif","iqtest"]],["Kazan",["Para Kazan","Kariyer","Tools","Pro"],["para","kariyer","tools","pro"]]].map(([t,ls,ps])=>(
            <div key={t}><div style={{fontSize:8,letterSpacing:".15em",color:"#475569",marginBottom:8,fontWeight:700}}>{t.toUpperCase()}</div>{ls.map((l,i)=><div key={l} onClick={()=>nav(ps[i])} style={{fontSize:11,color:"#334155",marginBottom:7,cursor:"pointer"}} onMouseEnter={e=>e.target.style.color="#94a3b8"} onMouseLeave={e=>e.target.style.color="#334155"}>{l}</div>)}</div>
          ))}
          <div>
            <div style={{fontSize:8,letterSpacing:".15em",color:"#475569",marginBottom:8,fontWeight:700}}>BÜLTEN</div>
            {sent?<div style={{fontSize:11,color:"#34d399",fontWeight:700}}>✅ Kaydedildin!</div>:<div style={{display:"flex",flexDirection:"column",gap:7}}>
              <input style={{background:"rgba(0,0,0,0.4)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,color:"#e2e8f0",padding:"9px 12px",fontSize:12,fontFamily:"inherit",outline:"none"}} placeholder="E-posta..." value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&email.includes("@")&&setSent(true)}/>
              <button onClick={()=>{if(email.includes("@"))setSent(true);}} className="btn-primary" style={{padding:"9px",fontSize:12,fontFamily:"inherit",borderRadius:8}}>Abone Ol →</button>
            </div>}
          </div>
        </div>
        <div style={{borderTop:"1px solid rgba(255,255,255,0.04)",paddingTop:16,display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:6}}>
          <div style={{fontSize:10,color:"#1e293b"}}>© 2026 IMDATAI · Türkiye'nin #1 AI Platformu</div>
          <div style={{fontSize:10,color:"#1e293b"}}>Gemini API ile güçlendirilmiştir 🌟</div>
        </div>
      </div>
    </footer>
    <Chatbot/>
  </div>;
}
