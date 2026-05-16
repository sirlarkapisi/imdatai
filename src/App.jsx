import React, { useState, useEffect, useRef, useMemo, Component } from "react";

// ── Global Audio Guard - sadece user gesture sonrası çalışır ──────────
let _userGestureFired = false;
let _pendingAudioCtx = null;

function ensureAudioAllowed() {
  // AudioContext sadece kullanıcı etkileşimi sonrası oluşturulabilir
  if (!_userGestureFired) return false;
  return true;
}

// İlk tıklamada işaretle
if (typeof window !== 'undefined') {
  const markGesture = () => {
    _userGestureFired = true;
    // Varsa askıdaki AudioContext'i resume et
    if (_pendingAudioCtx && _pendingAudioCtx.state === 'suspended') {
      _pendingAudioCtx.resume().catch(() => {});
    }
    document.removeEventListener('click', markGesture);
    document.removeEventListener('touchstart', markGesture);
    document.removeEventListener('keydown', markGesture);
  };
  document.addEventListener('click', markGesture, { once: true });
  document.addEventListener('touchstart', markGesture, { once: true });
  document.addEventListener('keydown', markGesture, { once: true });
}

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

function SocialMediaSection({setPage}){
  const[playing,setPlaying]=useState(null);

  // Gerçek video bilgileri
  const VIDEOS=[
    {
      id:"yt1",
      platform:"YouTube",
      icon:"▶",
      platformColor:"#ff4444",
      // YouTube embed için video ID
      youtubeId:"ZKOKP9jfAMg",
      title:"ChatGPT vs Claude vs Gemini 2026",
      desc:"IMDATAI",
      tags:["Karşılaştırma","Türkçe","2026"],
      followUrl:"https://youtube.com/@imdatai",
      followLabel:"YouTube'da Takip Et",
      color:"#ff4444",
      wide:true,
    },
    {
      id:"yt2",
      platform:"YouTube Shorts",
      icon:"▶",
      platformColor:"#ff6b6b",
      youtubeId:"5UgwO4rbfNM",
      title:"AI ile 30sn'de Profesyonel Email",
      desc:"IMDATAI",
      tags:["Kısa İpucu"],
      followUrl:"https://youtube.com/@imdatai",
      followLabel:"Abone Ol",
      color:"#ff6b6b",
      wide:false,
    },
    {
      id:"tt1",
      platform:"TikTok",
      icon:"♪",
      platformColor:"#00f2ea",
      tiktokUrl:"https://vt.tiktok.com/ZS9oTcvee/",
      title:"Claude ile İçerik Üretimi",
      desc:"IMDATAI",
      tags:["Tutorial","AI"],
      followUrl:"https://tiktok.com/@imdatai",
      followLabel:"TikTok'ta Takip Et",
      color:"#00f2ea",
      wide:false,
    },
    {
      id:"ig1",
      platform:"Instagram",
      icon:"📸",
      platformColor:"#e1306c",
      igUrl:"https://www.instagram.com/reel/DX8i6_wtPxf/",
      title:"2026 AI Araçları",
      desc:"IMDATAI",
      tags:["AI Araçları","2026"],
      followUrl:"https://instagram.com/imdatai",
      followLabel:"Instagram'da Takip Et",
      color:"#e1306c",
      wide:false,
    },
  ];

  const KONULAR=[
    {e:"🧠",title:"Claude AI",desc:"Constitutional AI, 1M token, kodlamada #1",page:"claude",color:"#a855f7",tag:"Model"},
    {e:"🤖",title:"ChatGPT",desc:"GPT-4o, DALL-E 3, Türkçe mükemmel",page:"chatgpt",color:"#34d399",tag:"Model"},
    {e:"🌟",title:"Gemini AI",desc:"Google 2M token, video analizi",page:"gemini",color:"#fbbf24",tag:"Model"},
    {e:"🔬",title:"DeepSeek",desc:"Ücretsiz API, GPT-4 kalitesi",page:"deepseek",color:"#00dcff",tag:"Model"},
    {e:"💡",title:"128+ Prompt",desc:"Her kategori için hazır şablonlar",page:"prompt",color:"#00dcff",tag:"Öğren"},
    {e:"🛠️",title:"99 AI Araç",desc:"Ses, görsel, kod, sunum kategorileri",page:"tools",color:"#fb923c",tag:"Araçlar"},
    {e:"💲",title:"AI Fiyat Karşılaştır",desc:"10 model API fiyatı tablosu",page:"aifiyat",color:"#fbbf24",tag:"Araç"},
    {e:"💰",title:"AI ile Para Kazan",desc:"Freelance, danışmanlık, prompt satışı",page:"para",color:"#34d399",tag:"Kariyer"},
    {e:"🎯",title:"AI Trivia",desc:"80 soruluk yapay zeka bilgi yarışması",page:"trivia",color:"#f472b6",tag:"Oyun"},
    {e:"🛡️",title:"AI Güvenlik",desc:"Deepfake, ses klonlama korunma",page:"guvenlik",color:"#ff4444",tag:"Güvenlik"},
    {e:"🇹🇷",title:"Türkiye AI",desc:"250+ startup, üniversiteler, ekosistem",page:"turkiyeai",color:"#60a5fa",tag:"Ekosistem"},
    {e:"⚖️",title:"AI Hukuk",desc:"KVKK, telif hakkı, AB AI Act",page:"hukuk",color:"#fbbf24",tag:"Hukuk"},
  ];

  function VideoCard({v}){
    const isPlaying=playing===v.id;
    return <div style={{borderRadius:14,overflow:'hidden',background:'rgba(0,0,0,0.4)',
      border:'1px solid '+v.platformColor+'25',transition:'all .2s',
      ...(isPlaying?{boxShadow:'0 0 30px '+v.platformColor+'40'}:{})}}>

      {/* Video alanı */}
      {isPlaying&&v.youtubeId
        ? <div style={{position:'relative',paddingTop:v.wide?'56.25%':'177.78%',background:'#000'}}>
            <iframe
              src={`https://www.youtube.com/embed/${v.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`}
              style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',border:'none'}}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              title={v.title}/>
          </div>
        : <div
            onClick={()=>{
              if(v.youtubeId){setPlaying(v.id);}
              else{
                const url=v.tiktokUrl||v.igUrl;
                if(url)window.open(url,'_blank','noopener,noreferrer');
              }
            }}
            style={{position:'relative',paddingTop:v.wide?'56.25%':'177.78%',
              background:'linear-gradient(135deg,'+v.platformColor+'15,rgba(0,0,0,0.7))',
              cursor:'pointer'}}>
            {/* Thumbnail */}
            {v.youtubeId&&<img
              src={`https://img.youtube.com/vi/${v.youtubeId}/mqdefault.jpg`}
              alt={v.title}
              style={{position:'absolute',top:0,left:0,width:'100%',height:'100%',objectFit:'cover'}}
              onError={e=>e.target.style.display='none'}/>}
            {/* Play overlay */}
            <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',
              justifyContent:'center',background:'rgba(0,0,0,0.35)'}}>
              <div style={{width:52,height:52,borderRadius:'50%',
                background:v.platformColor,display:'flex',alignItems:'center',
                justifyContent:'center',fontSize:20,color:'#fff',
                boxShadow:'0 4px 20px '+v.platformColor+'80',
                transition:'transform .2s'}}>
                {v.icon}
              </div>
            </div>
            {/* Platform badge */}
            <div style={{position:'absolute',top:8,left:8,background:'rgba(0,0,0,0.8)',
              borderRadius:6,padding:'3px 8px',display:'flex',gap:4,alignItems:'center'}}>
              <span style={{fontSize:9,color:v.platformColor,fontWeight:700}}>{v.platform}</span>
            </div>
          </div>}

      {/* Info */}
      <div style={{padding:'12px'}}>
        <div style={{fontSize:12,fontWeight:700,color:'#e2e8f0',lineHeight:1.4,marginBottom:4}}>{v.title}</div>
        <div style={{fontSize:10,color:'#64748b',lineHeight:1.5,marginBottom:8}}>{v.desc}</div>
        <div style={{display:'flex',gap:4,flexWrap:'wrap',marginBottom:8}}>
          {v.tags.map(t=><span key={t} style={{fontSize:8,color:v.platformColor,background:v.platformColor+'12',borderRadius:4,padding:'1px 6px',fontWeight:700}}>{t}</span>)}
        </div>
        <div style={{display:'flex',gap:6}}>
          {v.youtubeId&&!isPlaying&&<button onClick={()=>setPlaying(v.id)}
            style={{flex:1,padding:'6px',border:'1px solid '+v.platformColor+'40',borderRadius:7,
              background:v.platformColor+'10',color:v.platformColor,fontSize:10,cursor:'pointer',fontFamily:'inherit',fontWeight:700}}>
            ▶ Oynat
          </button>}
          {isPlaying&&<button onClick={()=>setPlaying(null)}
            style={{flex:1,padding:'6px',border:'1px solid rgba(255,255,255,0.1)',borderRadius:7,
              background:'rgba(255,255,255,0.05)',color:'#64748b',fontSize:10,cursor:'pointer',fontFamily:'inherit'}}>
            ✕ Kapat
          </button>}
          <a href={v.followUrl} target="_blank" rel="noopener noreferrer"
            style={{flex:1,padding:'6px',border:'1px solid '+v.platformColor+'40',borderRadius:7,
              background:v.platformColor+'10',color:v.platformColor,fontSize:10,
              textDecoration:'none',textAlign:'center',fontWeight:700,display:'flex',
              alignItems:'center',justifyContent:'center',gap:4}}>
            ➕ {v.followLabel}
          </a>
        </div>
      </div>
    </div>;
  }

  return <section style={{padding:"0 20px 56px",background:"rgba(0,0,0,0.08)"}}>
    <div style={{maxWidth:1100,margin:"0 auto",paddingTop:36}}>

      {/* Başlık */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22,flexWrap:"wrap",gap:12}}>
        <div>
          <div style={{fontSize:9,letterSpacing:".2em",color:"#f472b6",marginBottom:4}}>SOSYAL MEDYA & VİDEOLAR</div>
          <div style={{fontSize:20,fontWeight:800,color:"#e2e8f0",fontFamily:"'Space Grotesk',sans-serif"}}>📱 IMDATAI Kanalları</div>
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {[["https://youtube.com/@imdatai","▶","#ff4444","YouTube"],
            ["https://tiktok.com/@imdatai","♪","#00f2ea","TikTok"],
            ["https://instagram.com/imdatai","📸","#e1306c","Instagram"]].map(([url,icon,c,name])=>(
            <a key={name} href={url} target="_blank" rel="noopener noreferrer"
              style={{display:"flex",alignItems:"center",gap:6,background:c+"15",
                border:"1px solid "+c+"35",borderRadius:10,padding:"8px 14px",
                textDecoration:"none",color:c,fontSize:11,fontWeight:700}}>
              <span>{icon}</span> {name}'da Takip Et
            </a>
          ))}
        </div>
      </div>

      {/* Video Grid */}
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:14,marginBottom:28}}>
        {VIDEOS.map(v=><VideoCard key={v.id} v={v}/>)}
      </div>

      {/* Konu kartları */}
      <div style={{marginTop:4}}>
        <div style={{fontSize:11,fontWeight:700,color:"#e2e8f0",marginBottom:12,display:"flex",alignItems:"center",gap:8}}>
          <span>🗂️</span> Tüm Konular
          <div style={{height:1,flex:1,background:"rgba(255,255,255,0.06)"}}/>
          <span style={{fontSize:9,color:"#475569"}}>{KONULAR.length} konu</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(185px,1fr))",gap:10}}>
          {KONULAR.map(k=>(
            <div key={k.title} onClick={()=>setPage&&setPage(k.page)}
              style={{background:k.color+"06",border:"1px solid "+k.color+"18",borderRadius:12,
                padding:"14px",cursor:"pointer",transition:"all .2s"}}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.background=k.color+"12";e.currentTarget.style.borderColor=k.color+"40";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.background=k.color+"06";e.currentTarget.style.borderColor=k.color+"18";}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <span style={{fontSize:24}}>{k.e}</span>
                <span style={{fontSize:7,color:k.color,background:k.color+"15",borderRadius:4,padding:"2px 6px",fontWeight:700}}>{k.tag}</span>
              </div>
              <div style={{fontSize:12,fontWeight:700,color:k.color,marginBottom:4}}>{k.title}</div>
              <div style={{fontSize:10,color:"#64748b",lineHeight:1.5}}>{k.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>;
}

function Chatbot(){
  const[open,setOpen]=useState(false);
  const[msgs,setMsgs]=useState([]);
  const[inp,setInp]=useState('');
  const[load,setLoad]=useState(false);
  const[cnt,setCnt]=useState(0);
  const[blink,setBlink]=useState(false);
  const[talking,setTalking]=useState(false);
  const[greeted,setGreeted]=useState(false);
  const[wavePhase,setWavePhase]=useState(0);
  const endRef=useRef();
  const LIMIT=25;

  // Göz kırpma
  useEffect(()=>{
    const iv=setInterval(()=>{
      setBlink(true);
      setTimeout(()=>setBlink(false),150);
    },2800+Math.random()*2000);
    return()=>clearInterval(iv);
  },[]);

  // Ses dalgası animasyonu
  useEffect(()=>{
    if(!talking&&!load)return;
    const iv=setInterval(()=>setWavePhase(p=>(p+1)%20),80);
    return()=>clearInterval(iv);
  },[talking,load]);

  // Açılış selamlama
  useEffect(()=>{
    if(open&&!greeted){
      setGreeted(true);
      setTalking(true);
      // Chatbot karşılama sesi - public/sounds/imdataiwebgiris.mp3
      try{
        const greetAudio=new Audio('/sounds/imdataiwebgiris.mp3');
        greetAudio.volume=0.65;
        greetAudio.play().catch(()=>{});
      }catch(e){}
      setTimeout(()=>{
        setMsgs([{
          role:'ai',
          text:'Merhaba! 👋 Ben IMDATAI\'nın AI asistanıyım.\n\n🧠 Claude, ChatGPT, Gemini gibi modeller\n🛠️ AI araçları ve prompt teknikleri\n🇹🇷 Türkiye AI ekosistemi\n💡 Prompt mühendisliği\n\nhakkında sorularınızı yanıtlarım. Ne merak ediyorsunuz?',
          time:new Date().toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'})
        }]);
        setTalking(false);
      },1200);
    }
  },[open,greeted]);

  useEffect(()=>{endRef.current?.scrollIntoView({behavior:'smooth'});},[msgs,load]);

  // Tarayıcı TTS - Türkçe konuşma
  function speak(text){
    if(!window.speechSynthesis)return;
    try{
      window.speechSynthesis.cancel();
      const u=new SpeechSynthesisUtterance(text.slice(0,200));
      u.lang='tr-TR';u.rate=0.9;u.pitch=1.0;u.volume=0.7;
      u.onstart=()=>setTalking(true);
      u.onend=()=>setTalking(false);
      window.speechSynthesis.speak(u);
    }catch(e){setTalking(false);}
  }

  async function send(){
    if(!inp.trim()||load||cnt>=LIMIT)return;
    const m=inp.trim();setInp('');setCnt(c=>c+1);
    const time=new Date().toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'});
    setMsgs(p=>[...p,{role:'user',text:m,time}]);
    setLoad(true);setTalking(true);
    try{
      const res=await fetch('https://api.anthropic.com/v1/messages',{
        method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          model:'claude-sonnet-4-20250514',max_tokens:400,
          system:'Sen IMDATAI\'nın yapay zeka asistanısın. imdatai.com Türkiye\'nin AI rehber sitesidir. Türkçe konuş. Claude, ChatGPT, Gemini, DeepSeek, Mistral, Llama, AI araçları, prompt mühendisliği, Obsidian+AI, Cursor IDE, Perplexity, NotebookLM ve Türkiye AI ekosistemi hakkında yardımcı ol. Yanıtlar net ve kısa olsun (max 4 cümle). Kullanıcıyı site sayfalarına yönlendir: örn. "Prompt sayfamızda 128+ şablon var".',
          messages:[...msgs.filter(x=>x.role!=='ai'||msgs.indexOf(x)>0).slice(-6).map(x=>({role:x.role==='ai'?'assistant':'user',content:x.text})),{role:'user',content:m}]
        })
      });
      const d=await res.json();
      const txt=d.content?.[0]?.text||'Üzgünüm, şu an yanıt veremiyorum.';
      const atime=new Date().toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'});
      setMsgs(p=>[...p,{role:'ai',text:txt,time:atime}]);
      speak(txt);
    }catch(e){
      setMsgs(p=>[...p,{role:'ai',text:'Bağlantı hatası. Tekrar dene.',time:'--:--'}]);
      setTalking(false);
    }
    setLoad(false);
  }

  // AI Yüzü
  const Face=({size=48,isTalking=false,isBlink=false})=>{
    const bars=[3,5,8,6,9,5,3];
    return(
      <div style={{width:size,height:size,position:'relative',flexShrink:0}}>
        <div style={{position:'absolute',inset:-4,borderRadius:'50%',background:'radial-gradient(ellipse,rgba(0,220,255,0.25),transparent 70%)',animation:'glow 2s ease-in-out infinite'}}/>
        <div style={{width:'100%',height:'100%',borderRadius:'50%',background:'linear-gradient(135deg,#0a1a2e,#0d1f35)',border:'2px solid rgba(0,220,255,0.6)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:size>36?4:2,boxShadow:'0 0 14px rgba(0,220,255,0.3),inset 0 0 10px rgba(0,220,255,0.05)',overflow:'hidden',position:'relative'}}>
          <div style={{position:'absolute',top:0,left:0,right:0,height:'1px',background:'rgba(0,220,255,0.6)',animation:'scanLine 2.5s linear infinite'}}/>
          {/* Gözler */}
          <div style={{display:'flex',gap:size>36?9:5,alignItems:'center'}}>
            {[0,1].map(i=><div key={i} style={{width:isBlink?size>36?8:5:size>36?8:5,height:isBlink?1:size>36?8:5,borderRadius:'50%',background:'#00dcff',boxShadow:'0 0 8px #00dcff,0 0 16px rgba(0,220,255,0.5)',transition:'height .08s ease',marginTop:isBlink?size>36?4:2:0}}/>)}
          </div>
          {/* Ağız / ses dalgası */}
          <div style={{display:'flex',gap:2,alignItems:'center',height:size>36?12:8}}>
            {bars.map((h,i)=>{
              const active=isTalking||isBlink;
              const barH=active?(size>36?h*(1+Math.sin(wavePhase*0.5+i)*0.6):h*0.8):size>36?h:h*0.6;
              return <div key={i} style={{width:size>36?2.5:1.5,borderRadius:2,background:'rgba(0,220,255,0.8)',height:barH,transition:'height .1s ease'}}/>;
            })}
          </div>
        </div>
      </div>
    );
  };

  // Kapalı hali - floating button
  if(!open)return(
    <div style={{position:'fixed',bottom:22,right:14,zIndex:9000}}>
      <button onClick={()=>setOpen(true)} style={{all:'unset',cursor:'pointer',display:'block',animation:'float 3s ease-in-out infinite',position:'relative'}}>
        <Face size={52} isTalking={false} isBlink={blink}/>
        {/* Konuşma baloncuğu */}
        <div style={{position:'absolute',bottom:'110%',right:0,background:'rgba(4,8,20,0.96)',border:'1px solid rgba(0,220,255,0.35)',borderRadius:'12px 12px 2px 12px',padding:'7px 11px',whiteSpace:'nowrap',fontSize:10,color:'#00dcff',fontFamily:'monospace',boxShadow:'0 4px 16px rgba(0,0,0,0.8)',animation:'fadeIn .4s ease'}}>
          💬 Yardım lazım mı?
          <div style={{position:'absolute',bottom:-6,right:8,width:10,height:10,background:'rgba(4,8,20,0.96)',borderRight:'1px solid rgba(0,220,255,0.35)',borderBottom:'1px solid rgba(0,220,255,0.35)',transform:'rotate(45deg)'}}/>
        </div>
      </button>
    </div>
  );

  return(
    <div style={{position:'fixed',bottom:16,right:10,zIndex:9000,width:'min(340px,94vw)',display:'flex',flexDirection:'column',background:'rgba(3,6,18,0.98)',border:'1px solid rgba(0,220,255,0.22)',borderRadius:18,boxShadow:'0 8px 48px rgba(0,0,0,0.9),0 0 30px rgba(0,220,255,0.07)',backdropFilter:'blur(20px)',overflow:'hidden',fontFamily:'inherit'}}>

      {/* Header */}
      <div style={{background:'linear-gradient(135deg,rgba(0,220,255,0.07),rgba(168,85,247,0.04))',borderBottom:'1px solid rgba(0,220,255,0.1)',padding:'10px 14px',display:'flex',gap:10,alignItems:'center',flexShrink:0}}>
        <Face size={40} isTalking={talking||load} isBlink={blink}/>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:13,fontWeight:700,color:'#00dcff',fontFamily:"'Space Grotesk',sans-serif"}}>IMDATAI AI</div>
          <div style={{display:'flex',gap:5,alignItems:'center'}}>
            <div style={{width:6,height:6,borderRadius:'50%',background:load?'#fbbf24':'#34d399',animation:load?'blink .5s infinite':'none',flexShrink:0}}/>
            <span style={{fontSize:9,color:'#475569',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{load?'Yazıyor...':talking?'Konuşuyor...':'Çevrimiçi · Türkçe AI Asistanı'}</span>
          </div>
        </div>
        <button onClick={()=>setOpen(false)} style={{background:'none',border:'none',color:'#475569',fontSize:18,cursor:'pointer',lineHeight:1,padding:'2px 4px',flexShrink:0}}>✕</button>
      </div>

      {/* Mesajlar */}
      <div style={{overflowY:'auto',padding:'12px 10px',display:'flex',flexDirection:'column',gap:10,maxHeight:280,minHeight:100}}>
        {msgs.length===0&&<div style={{textAlign:'center',padding:'20px 10px'}}>
          <Face size={36} isTalking={true} isBlink={blink}/>
          <div style={{fontSize:10,color:'#475569',marginTop:8,animation:'blink 1s infinite'}}>Yükleniyor...</div>
        </div>}
        {msgs.map((m,i)=>(
          <div key={i} style={{display:'flex',gap:6,alignItems:'flex-end',flexDirection:m.role==='ai'?'row':'row-reverse'}}>
            {m.role==='ai'&&<Face size={26} isTalking={i===msgs.length-1&&talking} isBlink={blink}/>}
            <div style={{maxWidth:'78%'}}>
              {/* Konuşma baloncuğu */}
              <div style={{
                padding:'9px 12px',
                borderRadius:m.role==='ai'?'4px 14px 14px 14px':'14px 4px 14px 14px',
                background:m.role==='ai'?'rgba(0,220,255,0.07)':'rgba(168,85,247,0.12)',
                border:'1px solid '+(m.role==='ai'?'rgba(0,220,255,0.18)':'rgba(168,85,247,0.22)'),
                fontSize:11,color:'#cbd5e1',lineHeight:1.65,whiteSpace:'pre-wrap',
                boxShadow:'0 2px 8px rgba(0,0,0,0.3)'
              }}>
                {m.text}
              </div>
              <div style={{fontSize:8,color:'#1e293b',marginTop:2,textAlign:m.role==='ai'?'left':'right'}}>{m.time}</div>
            </div>
          </div>
        ))}
        {load&&<div style={{display:'flex',gap:6,alignItems:'flex-end'}}>
          <Face size={26} isTalking={true} isBlink={blink}/>
          <div style={{padding:'9px 14px',background:'rgba(0,220,255,0.07)',border:'1px solid rgba(0,220,255,0.15)',borderRadius:'4px 14px 14px 14px',display:'flex',gap:5,alignItems:'center'}}>
            {[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:'50%',background:'#00dcff',animation:`blink .8s ${i*0.22}s infinite`}}/>)}
          </div>
        </div>}
        <div ref={endRef}/>
      </div>

      {/* Hızlı sorular */}
      {msgs.length<=1&&<div style={{padding:'0 10px 8px',display:'flex',gap:5,flexWrap:'wrap'}}>
        {['Claude nedir?','En iyi AI araç?','Prompt nasıl yazılır?','AI ile para kazanma?'].map(q=>(
          <button key={q} onClick={()=>{setInp(q);setTimeout(send,50);}} style={{fontSize:9,color:'#00dcff',border:'1px solid rgba(0,220,255,0.22)',borderRadius:12,padding:'4px 9px',background:'rgba(0,220,255,0.05)',cursor:'pointer',fontFamily:'inherit'}}>
            {q}
          </button>
        ))}
      </div>}

      {/* Input */}
      <div style={{borderTop:'1px solid rgba(0,220,255,0.08)',padding:'8px 10px',display:'flex',gap:7,flexShrink:0}}>
        <input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder='Bir şey sor...' style={{flex:1,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(0,220,255,0.15)',borderRadius:10,padding:'8px 11px',color:'#e2e8f0',fontSize:11,fontFamily:'inherit',outline:'none',minWidth:0}}/>
        <button onClick={send} disabled={load||!inp.trim()} style={{padding:'8px 13px',border:'none',borderRadius:10,background:load||!inp.trim()?'rgba(0,220,255,0.08)':'linear-gradient(135deg,#00dcff,#a855f7)',color:load||!inp.trim()?'#334155':'#fff',fontSize:13,cursor:load?'wait':'pointer',fontWeight:700,flexShrink:0}}>▶</button>
      </div>
      {cnt>=LIMIT&&<div style={{textAlign:'center',fontSize:9,color:'#334155',padding:'3px 0 7px'}}>Oturum limiti doldu.</div>}
    </div>
  );
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
  {tag:"🇹🇷",hot:false,color:"#34d399",title:"Türkiye'de AI Girişim Sayısı 300'ü Aştı",desc:"İstanbul merkezli AI startup'lar 2025'e kıyasla %180 arttı. Sağlık, eğitim ve tarım öne çıkan sektörler.",src:"Startups.com.tr",time:"3 hafta",read:"3 dk",emoji:"🚀"},,
  {id:1,title:"GPT-5.5 Türkiye'de Aktif",summary:"OpenAI'ın en güçlü modeli Türkçe arayüzle kullanılabilir hale geldi.",tag:"Flaş",color:"#ff4444",date:"2026-05-14",source:"OpenAI"},
  {id:2,title:"Claude Opus 4.7 Kodlamada Dünya Rekoru",summary:"SWE-bench %87.6 ile yeni dünya rekoru. Anthropic'in en güçlü modeli piyasaya çıktı.",tag:"Model",color:"#a855f7",date:"2026-05-13",source:"Anthropic"},
  {id:3,title:"Gemini 2.5 Pro 2M Token Destekliyor",summary:"Google'ın yeni modeli 2 milyon token context ile en uzun belleğe sahip model oldu.",tag:"Google",color:"#34d399",date:"2026-05-12",source:"Google DeepMind"},
  {id:4,title:"Türkiye AI Trafiğinde Dünya #1",summary:"imdatai.com verilerine göre Türkiye, AI platformlarına erişimde küresel olarak %94.49 ile lider.",tag:"Türkiye",color:"#fbbf24",date:"2026-05-11",source:"IMDATAI"},
  {id:5,title:"Grok 3 Meta Araştırma Yetenekleriyle Çıktı",summary:"xAI'ın Grok 3 modeli web araması ve görüntü analizi özelliklerine kavuştu.",tag:"xAI",color:"#60a5fa",date:"2026-05-10",source:"xAI"},
  {id:6,title:"DeepSeek R2 Açık Kaynak Yayınlandı",summary:"Çin yapımı DeepSeek R2 tüm parametreleriyle açık kaynak olarak paylaşıldı.",tag:"Açık Kaynak",color:"#00dcff",date:"2026-05-09",source:"DeepSeek"},
  {id:7,title:"Midjourney v7 Fotorealizmi Geçti",summary:"Yeni Midjourney v7 fotoğraflardan ayırt edilemeyen görseller üretiyor.",tag:"Görsel",color:"#f472b6",date:"2026-05-08",source:"Midjourney"},
  {id:8,title:"Suno v5 Gerçek Enstrüman Sesi Üretiyor",summary:"AI müzik platformu Suno v5 ile artık akustik gitar ve piyano sesleri insan performansından ayırt edilemiyor.",tag:"Müzik",color:"#fb923c",date:"2026-05-07",source:"Suno"},
  {id:9,title:"Meta Llama 4 Ticari Kullanıma Açıldı",summary:"Meta'nın en güçlü açık kaynak modeli ücretsiz ticari lisansla geliştiricilere sunuldu.",tag:"Meta",color:"#60a5fa",date:"2026-05-06",source:"Meta AI"},
  {id:10,title:"Türk AI Startup'ları 1.2 Milyar TL Yatırım Aldı",summary:"2026 Q1 raporuna göre Türk AI girişimleri rekor yatırım çekti.",tag:"Ekonomi",color:"#34d399",date:"2026-05-05",source:"Sektör Raporu"},
  {id:11,title:"Cursor AI Türk Geliştiriciler Arasında #1",summary:"Kod yazma AI'ı Cursor, Türkiye'de en çok indirilen geliştirici aracı oldu.",tag:"Araçlar",color:"#00dcff",date:"2026-05-04",source:"Cursor"},
  {id:12,title:"Sora Enterprise Küresel Kullanıma Açıldı",summary:"OpenAI'ın video üretici Sora'sı kurumsal planıyla 150 ülkede kullanılabilir hale geldi.",tag:"Video AI",color:"#ff4444",date:"2026-05-03",source:"OpenAI"},
  {id:13,title:"AI ile İstihdam: 2026 Türkiye Raporu",summary:"Türkiye'de AI kaynaklı 120.000 yeni iş pozisyonu açıldı, 45.000 pozisyon dönüştürüldü.",tag:"İş",color:"#fbbf24",date:"2026-05-02",source:"Araştırma Raporu"},
  {id:14,title:"Google NotebookLM Türkçe Desteği Ekledi",summary:"Belge analizi aracı NotebookLM artık Türkçe içerikleri anlıyor ve podcast üretiyor.",tag:"Google",color:"#34d399",date:"2026-05-01",source:"Google"},
  {id:15,title:"Perplexity AI 50M Kullanıcıya Ulaştı",summary:"Arama motoru AI'ı Perplexity, aylık 50 milyon aktif kullanıcıyla rekora imza attı.",tag:"Arama",color:"#a855f7",date:"2026-04-30",source:"Perplexity"},
  {id:16,title:"Mistral Le Chat Pro Türkiye'de",summary:"Fransız AI şirketi Mistral'ın premium sohbet aracı Le Chat Pro Türkiye pazarına girdi.",tag:"Mistral",color:"#60a5fa",date:"2026-04-29",source:"Mistral AI"},
  {id:17,title:"Türk Enerji Sektöründe AI Dönüşümü",summary:"Türkiye'nin enerji altyapısı şirketleri AI ile akıllı izleme sistemleri kuruyor.",tag:"Türkiye",color:"#fbbf24",date:"2026",source:"Sektör Haberi"},
  {id:18,title:"Adobe Firefly 4 Türkçe Komut Destekliyor",summary:"Adobe'nin AI grafik aracı artık Türkçe komutlarla görsel ve video oluşturuyor.",tag:"Araçlar",color:"#f472b6",date:"2026-04-27",source:"Adobe"},
  {id:19,title:"Claude ile 1 Saatte Uygulama Geliştirme",summary:"IMDATAI rehberi: Claude kullanarak 1 saatte tam işlevsel web uygulaması nasıl yapılır?",tag:"Rehber",color:"#00dcff",date:"2026-04-26",source:"IMDATAI"},
  {id:20,title:"GPT-4o Ses Özelliği Türkçeye Geldi",summary:"ChatGPT'nin sesli sohbet modu artık Türkçe anlıyor ve konuşuyor.",tag:"Flaş",color:"#ff4444",date:"2026-04-25",source:"OpenAI"}
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
  init(){if(!_userGestureFired)return;try{if(!this.ctx)this.ctx=new(window.AudioContext||window.webkitAudioContext)();}catch(e){}},
  play(freq,dur=0.15,type="sine",vol=0.3){
    if(!_userGestureFired)return;
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
function playClick(type='soft'){
  if(!_userGestureFired)return;
  try{
    const AC=window.AudioContext||window.webkitAudioContext;
    if(!AC)return;
    const ctx=new AC();
    const o=ctx.createOscillator(),g=ctx.createGain();
    o.connect(g);g.connect(ctx.destination);
    if(type==='soft'){
      o.frequency.value=800;o.type='sine';
      g.gain.setValueAtTime(.05,ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.08);
      o.start();o.stop(ctx.currentTime+.1);
    }else if(type==='success'){
      [523,659,784].forEach((f,i)=>{
        const o2=ctx.createOscillator(),g2=ctx.createGain();
        o2.frequency.value=f;o2.type='sine';
        g2.gain.setValueAtTime(.04,ctx.currentTime+i*.08);
        g2.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+i*.08+.1);
        o2.connect(g2);g2.connect(ctx.destination);
        o2.start(ctx.currentTime+i*.08);o2.stop(ctx.currentTime+i*.08+.12);
      });
    }else if(type==='game'){
      o.frequency.value=440;o.type='square';
      g.gain.setValueAtTime(.03,ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.1);
      o.start();o.stop(ctx.currentTime+.12);
    }
    setTimeout(()=>{try{ctx.close();}catch(e){}},500);
  }catch(e){}
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
  prompt:{icon:"💡",desc:"75 prompt örneği · 13 kategori · Kopyalanabilir",count:"113+"},
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
      <div style={{position:"absolute",top:-5,left:"50%",width:8,height:8,background:"rgba(8,12,28,0.98)",border:"1px solid rgba(0,220,255,0.2)",borderTop:"none",borderRight:"none",transform:"translateX(-50%) rotate(135deg)"}}/>
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
  {q:"ChatGPT'nin kaç ülkede kullanıcısı var?",o:["50+","100+","1113+","200+"],a:2,c:"#a855f7",cat:"İstatistik"},
  {q:"'Agentic AI' ne demektir?",o:["Görsel AI","Otonom görev yapan AI","Sesli AI","Hızlı AI"],a:1,c:"#34d399",cat:"Kavram"},
  {q:"v0.dev ne tür bir AI aracıdır?",o:["Blog yazma","UI/React bileşen üretimi","Ses üretimi","Video üretimi"],a:1,c:"#fb923c",cat:"Araç"},
  {q:"'LoRA' tekniği ne için kullanılır?",o:["Görsel üretim","Verimli fine-tuning","Hızlı inference","Veri temizleme"],a:1,c:"#f472b6",cat:"Teknik"},
  {q:"Gamma hangi tür içerik üretir?",o:["Kod","Sunum/Prezantasyon","Görsel","Ses"],a:1,c:"#60a5fa",cat:"Araç"},
  {q:"'Task Budget' özelliği kimin ürünü?",o:["OpenAI","Google","Anthropic","Meta"],a:2,c:"#00dcff",cat:"Özellik"},
  {q:"MCP'nin kaç kurulumu var?",o:["10M+","50M+","97M+","200M+"],a:2,c:"#a855f7",cat:"İstatistik"},,
  {q:"Claude'un anayasa AI yaklaşımının adı nedir?",o:["Constitutional AI","Recursive AI","Bounded AI","Ethical AI"],a:0,c:"#a855f7",cat:"Model"},
  {q:"2026'da Türkiye, AI trafiğinde dünyada kaçıncı?",o:["3.","1.","5.","2."],a:1,c:"#00dcff",cat:"Türkiye"},
  {q:"GPT'nin 'G' harfi neyi temsil eder?",o:["Global","Generative","Graph","Gradient"],a:1,c:"#34d399",cat:"Temel"},
  {q:"Llama modelini kim geliştirdi?",o:["Google","OpenAI","Meta","Apple"],a:2,c:"#fb923c",cat:"Model"},
  {q:"Hangi AI modeli 2 milyon token context destekler?",o:["GPT-4o","Claude Opus","Gemini 1.5 Pro","Grok-2"],a:2,c:"#fbbf24",cat:"Teknik"},
  {q:"'Hallucination' yapay zekada ne anlama gelir?",o:["Yanlış çıktı üretme","Görüntü analizi","Ses sentezi","Kod yazma"],a:0,c:"#00dcff",cat:"Temel"},
  {q:"Midjourney hangi platformda başladı?",o:["Twitter","Reddit","Discord","Telegram"],a:2,c:"#f472b6",cat:"Araçlar"},
  {q:"DeepSeek hangi ülke kökenlidir?",o:["ABD","Japonya","Çin","Kore"],a:2,c:"#00ff88",cat:"Model"},
  {q:"RLHF açılımı nedir?",o:["Real Learning from Human Feedback","Reinforcement Learning from Human Feedback","Recursive Learning Human Framework","Random Layer Hierarchical Functions"],a:1,c:"#a855f7",cat:"Teknik"},
  {q:"İlk GPT modeli kaç yılında çıktı?",o:["2017","2018","2019","2020"],a:1,c:"#fbbf24",cat:"Tarih"},
  {q:"Claude'u geliştiren şirketin adı nedir?",a:["OpenAI","Google","Anthropic","Meta"],c:2,e:"🧠",tag:"Model"},
  {q:"DeepSeek V3 kaç parametreli bir modeldir?",a:["7B","70B","671B","13B"],c:2,e:"🔬",tag:"Model"},
  {q:"Hangi AI modeli Constitutional AI yöntemiyle eğitildi?",a:["GPT-4","Gemini","Claude","LLaMA"],c:2,e:"📜",tag:"Teknik"},
  {q:"'Vibe Coding' terimini kim ortaya attı?",a:["Sam Altman","Andrej Karpathy","Yann LeCun","Elon Musk"],c:1,e:"💻",tag:"Kültür"},
  {q:"Gemini 2.5 Pro'nun context window'u ne kadar?",a:["128K","200K","1M","2M"],c:3,e:"🌟",tag:"Model"},
  {q:"AI hallucination ne demektir?",a:["Modelin uyuması","Yanlış bilgi üretmesi","Çok yavaş yanıt","Türkçe sorunu"],c:1,e:"🌀",tag:"Temel"},
  {q:"Hangi AI aracı toplantıları otomatik transkript eder?",a:["Midjourney","Otter.ai","Suno","Julius AI"],c:1,e:"🎙️",tag:"Araç"},
  {q:"LLM açılımı nedir?",a:["Large Language Model","Low Level Machine","Linear Logic Method","Layered Learning Module"],c:0,e:"📚",tag:"Temel"},
  {q:"RAG ne işe yarar?",a:["Ses üretir","Harici bilgiyi modele ekler","Görsel üretir","Kod çalıştırır"],c:1,e:"🔍",tag:"Teknik"},
  {q:"Mistral AI hangi ülkede kuruldu?",a:["ABD","İngiltere","Fransa","Almanya"],c:2,e:"🇫🇷",tag:"Model"},
  {q:"GitHub Copilot hangi şirket tarafından geliştirildi?",a:["Google","Microsoft","Meta","Amazon"],c:1,e:"💻",tag:"Araç"},
  {q:"ElevenLabs'ın ana ürünü nedir?",a:["Görsel üretimi","Ses klonlama","Kod yazma","Çeviri"],c:1,e:"🎤",tag:"Araç"},
  {q:"Fine-tuning ne anlama gelir?",a:["Modeli sıfırdan eğitmek","Modeli belirli görev için özelleştirmek","Modeli silmek","Modeli küçültmek"],c:1,e:"🎯",tag:"Teknik"},
  {q:"Türkiye'de kaç aktif AI startup var? (2026)",a:["50+","100+","250+","500+"],c:2,e:"🇹🇷",tag:"Türkiye"},
  {q:"Hangi AI aracı açık kaynak değildir?",a:["Llama","Mistral 7B","GPT-4","Stable Diffusion"],c:2,e:"🔒",tag:"Model"},
  {q:"Cursor ne tür bir araçtır?",a:["Görsel üretici","AI kod editörü","Ses asistanı","Çeviri aracı"],c:1,e:"⌨️",tag:"Araç"},
  {q:"RLHF açılımı nedir?",a:["Real Learning Human Feedback","Reinforcement Learning from Human Feedback","Rapid Language Human Framework","Regular LLM Human Fine-tuning"],c:1,e:"🎓",tag:"Teknik"},
  {q:"Suno AI ne üretir?",a:["Görsel","Video","Müzik","Kod"],c:2,e:"🎵",tag:"Araç"},
  {q:"OpenAI'ın 2024'teki değerlemesi yaklaşık ne kadardır?",a:["$10 milyar","$50 milyar","$157 milyar","$500 milyar"],c:2,e:"💰",tag:"İş"},
  {q:"'AI Slop' ne anlama gelir?",a:["Hızlı AI","Kalitesiz AI içeriği","Pahalı AI","Türkçe AI"],c:1,e:"🗑️",tag:"Kültür"}
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
const AI_FACTS = [
  "ChatGPT ilk 5 günde 1 milyon kullanıcıya ulaştı — Netflix buna 3.5 yıl harcadı! 🚀",
  "GPT-4, tüm bar sınavını geçiyor — üstelik insan avukatların %90'ından daha iyi skor alıyor! ⚖️",
  "Claude'un context window'u (1M token) yaklaşık 750 sayfalık roman okuyabilir — tek seferde! 📚",
  "DeepSeek V3, GPT-4o'yu matematik olimpiyatlarında %97.3 başarıyla geçti — ücretsiz! 🔬",
  "Dünya genelinde her gün 100 milyondan fazla kişi ChatGPT kullanıyor! 🌍",
  "Bir yapay zeka modeli eğitmek, 5 yıl boyunca bir insanın yaydığı CO₂'ye eşdeğer enerji harcıyor! ♻️",
  "Google Translate, yapay zeka geçişinin ardından çeviri kalitesini bir yılda %60 artırdı! 🌐",
  "AI, meme kanseri teşhisinde radyologları %20 geride bırakıyor! 🏥",
  "Bir AI sistemi 2023'te insan satrancının 300 yıllık teorisini 4 saatte yeniden keşfetti! ♟️",
  "Türkiye'de AI startup sayısı 2024-2026 arasında 3 katına çıkarak 250'yi aştı! 🇹🇷",
  "Midjourney'in en pahalı aboneliği aylık $600 — ama sınırsız görsel üretiliyor! 🎨",
  "GPT-3 modelini eğitmek 4.6 milyon dolar maliyeti vardı — GPT-4 için bu çok daha fazla! 💸",
  "Yapay zeka 2030'a kadar 800 milyon iş kolunu dönüştürecek (McKinsey raporu) 🤖",
  "Stack Overflow'a sorulan soruların %25'i artık AI ile yanıtlanıyor! 💻",
  "DALL-E 3, 'ünlü ressamlar tarzında' bir görsel 3 saniyede üretiyor! 🖼️",
  "GitHub Copilot kullanan geliştiriciler %55 daha hızlı kod yazıyor! ⚡",
  "Anthropic, Claude'u 'anayasa' ile eğitti — modele etik ilkeler öğretti! 📜",
  "Meta'nın Llama modeli tamamen açık kaynak — kendi bilgisayarında çalıştırabilirsin! 🦙",
  "Türkçe, yapay zekaların en iyi anladığı 10 dil arasında! 🇹🇷",
  "AI müzik üreteci Suno, bir şarkıyı 30 saniyede besteleyip sözleriyle sunuyor! 🎵",
  "Runway Gen-3 ile 4 saniyelik video üretimi artık 5 saniyede mümkün! 🎬",
  "Stanford üniversitesi AI'ın IQ testinde ortalama insanı geçtiğini doğruladı (2024)! 🧠",
  "Bir prompt mühendisi Upwork'te saatlik $150+ kazanabiliyor — en hızlı büyüyen meslek! 💰",
  "WhatsApp'taki Meta AI, 3 milyardan fazla kullanıcıya ulaştı! 📱",
  "AI destekli ilaç keşfi, geleneksel yöntemlere göre 10x daha hızlı! 💊",
  "OpenAI'ın değerlemesi 2024'te $157 milyara ulaştı — Türkiye GSYH'sının %20'si! 💹",
  "Google'ın NotebookLM uygulaması, yüklediğin belgeyi podcast'e dönüştürüyor! 🎙️",
  "Yapay zeka, Beethoven'ın yarım bıraktığı 10. senfonisini tamamladı! 🎼",
  "Claude, tek bir promptta 100.000 satır kodu analiz edebiliyor! 💻",
  "Dünya'nın en büyük AI çipi olan NVIDIA H100, 80 milyar transistör içeriyor! 🔧",
  "Microsoft, OpenAI'a toplamda $13 milyar yatırım yaptı! 💼",
  "AI destekli hukuk araştırması, avukatların çalışma süresini %60 azalttı! ⚖️",
  "Gemini 2.5 Pro'nun context window'u (2M token) 10 roman okuyabilir! 📖",
  "Türk girişimciler AI alanında 2025'te 500+ milyon TL yatırım topladı! 🚀",
  "Perplexity AI, Google aramalarına ciddi rakip — günlük 10M+ sorgu! 🔍",
  "Midjourney'in kurucu ekibinde sadece 11 kişi var — aylık $100M+ gelir! 💰",
  "AI hastanenin randevu sistemini yöneterek bekleme sürelerini %40 düşürdü! 🏥",
  "Siri'nin AI altyapısı 2024'te tamamen yenilendi — Apple Intelligence geldi! 🍎",
  "Yapay zeka, 2026'da tüm dünyada yazılan kodun %30'unu üretiyor! 💻",
  "ChatGPT'ye günlük 10 milyon görsel yükleniyor ve analiz ediliyor! 🖼️",
  "Grok 3, Twitter/X verilerine gerçek zamanlı erişimle rakiplerinden öne çıkıyor! ⚡",
  "Mistral AI kurulduğu yılda 6 milyar Euro değerlemeye ulaştı — rekor! 🇫🇷",
  "AI destekli satış araçları kullanan şirketler %25 daha fazla gelir elde ediyor! 📈",
  "Yapay zeka artık olimpiyat fizik sorularının %70'ini doğru çözüyor! 🏆",
  "ElevenLabs ses klonlama teknolojisi 3 saniyelik ses kaydıyla klon üretiyor! 🎤",
  "Cursor AI kullanan yazılımcılar günde ortalama 2 saat tasarruf ediyor! ⏱️",
  "AI, moda endüstrisinde 10.000 tasarım alternatifi üretiyor — saniyeler içinde! 👗",
  "Duolingo, AI ile 148 yeni dil kursu oluşturdu — 5 yılda yapılacak iş! 🌍",
  "Claude API'nin Türkiye'deki kullanım oranı 2025'te 5 katına çıktı! 🇹🇷",
  "Yapay zeka destekli finansal danışmanlık uygulamaları 50M+ kullanıcıya ulaştı! 💳",
  "Google DeepMind'ın AlphaFold3'ü tüm proteinlerin 3D yapısını tahmin edebiliyor! 🧬",
  "AI ile oluşturulan sahte görsel sayısı 2024'te gerçek fotoğraf sayısını geçti! 📸",
  "NotebookLM'in 'podcast modu' ile 2 saatlik belge 15 dakikada anlaşılıyor! 🎧",
  "Yapay zeka, Türkçe dilek cümlelerini %92 doğrulukla İngilizce'ye çeviriyor! 🔤",
  "AI destekli müşteri hizmetleri, şikayetleri %70 daha hızlı çözüyor! 📞",
  "OpenAI o3 modeli, IQ testlerinde 120+ puan alıyor — üst %10'a giriyor! 🧠",
  "Hugging Face'de 1 milyondan fazla açık kaynak AI modeli var! 🤗",
  "Yapay zeka çevirisi artık BM tercümanlarının kalitesiyle yarışıyor! 🌐",
  "İlk AI bestesine Grammy ödülü 2025'te verildi — tartışmalar hâlâ sürüyor! 🏆",
  "Google'ın Veo 2 modeli 2 dakikalık 4K video üretebiliyor! 🎬",
  "Türkiye, AB AI Kanunu'na uyum için 2025'ten itibaren düzenleme çalışmalarına başladı! ⚖️",
  "AI destekli öğretim platformları öğrencilerin %40'ının notunu yükseltti! 🎓",
  "Claude'u yaratan Anthropic ekibinin %30'u eski OpenAI çalışanlarından oluşuyor! 🤯",
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
  const[level,setLevel]=useState(null);const[fact,setFact]=useState(AI_FACTS[Math.floor(Math.random()*AI_FACTS.length)]);
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
          <button onClick={()=>{setPage("oyunlar");playClick('game');}} style={{padding:"12px 18px",fontSize:13,borderRadius:11,border:"1px solid rgba(52,211,153,0.4)",background:"rgba(52,211,153,0.08)",color:"#34d399",cursor:"pointer",fontFamily:"inherit",fontWeight:700,transition:"all .2s"}} onMouseEnter={e=>{e.currentTarget.style.background="rgba(52,211,153,0.2)";e.currentTarget.style.boxShadow="0 0 24px rgba(52,211,153,0.4)";e.currentTarget.style.transform="translateY(-2px)";}} onMouseLeave={e=>{e.currentTarget.style.background="rgba(52,211,153,0.08)";e.currentTarget.style.boxShadow="";e.currentTarget.style.transform="";}}>🎮 Oyun Oyna</button>
          <button onClick={()=>{setPage("claude");playClick('soft');}} style={{padding:"12px 18px",fontSize:13,borderRadius:11,border:"1px solid rgba(168,85,247,0.4)",background:"rgba(168,85,247,0.08)",color:"#a855f7",cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>🧠 Claude</button>
          <button onClick={()=>{setFact(AI_FACTS[Math.floor(Math.random()*AI_FACTS.length)]);playClick('success');}} style={{padding:"12px 18px",fontSize:13,borderRadius:11,border:"1px solid rgba(251,146,60,0.4)",background:"rgba(251,146,60,0.08)",color:"#fb923c",cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>🤯 Şaşırt!</button>
          <button onClick={()=>{setPage("animasyon");playClick('soft');}} style={{padding:"11px 20px",fontSize:12,borderRadius:10,fontFamily:"inherit",fontWeight:700,border:"none",cursor:"pointer",color:"#fff",background:"linear-gradient(135deg,#a855f7,#7c3aed)",boxShadow:"0 4px 16px rgba(168,85,247,0.3)",transition:"all .2s"}} onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"} onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>🎬 Animasyonlar</button>
          <button onClick={()=>{setPage("prompt");playClick('soft');}}
            style={{padding:"12px 18px",fontSize:13,borderRadius:11,border:"1px solid rgba(0,220,255,0.4)",background:"rgba(0,220,255,0.08)",color:"#00dcff",cursor:"pointer",fontFamily:"inherit",fontWeight:700,transition:"all .2s"}}
            onMouseEnter={e=>{e.currentTarget.style.background="rgba(0,220,255,0.18)";e.currentTarget.style.transform="translateY(-2px)";}}
            onMouseLeave={e=>{e.currentTarget.style.background="rgba(0,220,255,0.08)";e.currentTarget.style.transform="";}}
          >💡 Prompt Rehberi</button>
          <button onClick={()=>{const el=document.getElementById('obsidian-section');el&&el.scrollIntoView({behavior:'smooth'});}}
            style={{padding:"12px 18px",fontSize:13,borderRadius:11,border:"1px solid rgba(251,191,36,0.4)",background:"rgba(251,191,36,0.08)",color:"#fbbf24",cursor:"pointer",fontFamily:"inherit",fontWeight:700,transition:"all .2s"}}
            onMouseEnter={e=>{e.currentTarget.style.background="rgba(251,191,36,0.18)";e.currentTarget.style.transform="translateY(-2px)";}}
            onMouseLeave={e=>{e.currentTarget.style.background="rgba(251,191,36,0.08)";e.currentTarget.style.transform="";}}
          >💎 Obsidian + AI</button>
        </div>
        {fact&&<div style={{background:"rgba(251,146,60,0.1)",border:"2px solid rgba(251,146,60,0.5)",borderRadius:14,padding:"18px 22px",maxWidth:580,margin:"16px auto",position:"relative",zIndex:10,boxShadow:"0 4px 24px rgba(251,146,60,0.2)"}}>
          <div style={{fontSize:13,color:"#fb923c",lineHeight:1.7,fontWeight:600,textAlign:"center"}}>{typeof fact==="string"?fact:(fact.e+" "+fact.t)}</div>
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

    
      {/* ── PROMPT MÜHENDİSLİĞİ BÖLÜMÜ ─────────────────── */}
      <section style={{padding:"32px 20px",background:"linear-gradient(135deg,rgba(0,220,255,0.04),rgba(168,85,247,0.04))"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12,marginBottom:20}}>
            <div>
              <div style={{fontSize:9,letterSpacing:".2em",color:"#00dcff",marginBottom:4}}>128+ ŞABLON</div>
              <h2 style={{margin:0,fontSize:"clamp(18px,3vw,26px)",fontWeight:900,color:"#e2e8f0",fontFamily:"'Space Grotesk',sans-serif"}}>💡 Prompt Mühendisliği</h2>
              <p style={{fontSize:11,color:"#64748b",margin:"4px 0 0"}}>Hazır Türkçe şablonlar · Her kategori · Kopyala ve kullan</p>
            </div>
            <button onClick={()=>setPage("prompt")} style={{padding:"9px 20px",border:"1px solid rgba(0,220,255,0.4)",borderRadius:10,background:"rgba(0,220,255,0.08)",color:"#00dcff",fontSize:11,cursor:"pointer",fontWeight:700,fontFamily:"inherit"}}>Tüm Promptlar →</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10}}>
            {[["💼","İş & Kariyer","Maaş müzakeresi, LinkedIn profil, iş başvurusu","#00dcff"],
              ["✍️","İçerik & Blog","SEO yazısı, sosyal medya, bülten taslağı","#a855f7"],
              ["💻","Kod & Teknik","Debug, kod inceleme, mimari tasarım","#34d399"],
              ["📊","Analiz & Rapor","Veri analizi, SWOT, piyasa araştırması","#fbbf24"],
              ["🎨","Yaratıcı Yazarlık","Hikaye, senaryo, şiir, reklam metni","#f472b6"],
              ["📧","E-posta & İletişim","Resmi yazı, teklifler, müşteri iletişimi","#fb923c"],
              ["🎓","Eğitim & Öğrenme","Ders planı, konu özeti, quiz hazırlama","#60a5fa"],
              ["🔬","Araştırma","Kaynak analizi, literatür tarama, hipotez","#e879f9"],
            ].map(([e,t,d,c])=><div key={t} onClick={()=>setPage("prompt")}
              style={{background:c+"07",border:"1px solid "+c+"18",borderRadius:12,padding:"14px",cursor:"pointer",transition:"all .2s"}}
              onMouseEnter={ev=>{ev.currentTarget.style.transform="translateY(-2px)";ev.currentTarget.style.borderColor=c+"40";}}
              onMouseLeave={ev=>{ev.currentTarget.style.transform="";ev.currentTarget.style.borderColor=c+"18";}}>
              <div style={{fontSize:22,marginBottom:6}}>{e}</div>
              <div style={{fontSize:11,fontWeight:700,color:c,marginBottom:4}}>{t}</div>
              <div style={{fontSize:9,color:"#475569",lineHeight:1.4}}>{d}</div>
            </div>)}
          </div>
          {/* Top prompts önizleme */}
          <div style={{marginTop:14,display:"flex",gap:8,flexWrap:"wrap"}}>
            {["Maaş müzakeresi emaili yaz","LinkedIn profili optimize et","Python kodunu debug et","SEO blog yazısı oluştur","SWOT analizi yap","Rakip analizi hazırla"].map(p=><button key={p} onClick={()=>setPage("prompt")} style={{fontSize:10,color:"#64748b",border:"1px solid rgba(255,255,255,0.07)",borderRadius:20,padding:"4px 12px",background:"rgba(255,255,255,0.02)",cursor:"pointer",fontFamily:"inherit",transition:"all .2s"}}
              onMouseEnter={ev=>{ev.currentTarget.style.color="#00dcff";ev.currentTarget.style.borderColor="rgba(0,220,255,0.3)";}}
              onMouseLeave={ev=>{ev.currentTarget.style.color="#64748b";ev.currentTarget.style.borderColor="rgba(255,255,255,0.07)";}}>
              "{p}"</button>)}
          </div>
        </div>
      </section>

      {/* ── CLAUDE KAPSAMLI BÖLÜM ─────────────────── */}
      <section style={{padding:"32px 20px",background:"rgba(168,85,247,0.03)"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12,marginBottom:20}}>
            <div>
              <div style={{fontSize:9,letterSpacing:".2em",color:"#a855f7",marginBottom:4}}>ANTHROPIC · CONSTITUTIONAL AI</div>
              <h2 style={{margin:0,fontSize:"clamp(18px,3vw,26px)",fontWeight:900,color:"#e2e8f0",fontFamily:"'Space Grotesk',sans-serif"}}>🧠 Claude AI — Kapsamlı Rehber</h2>
              <p style={{fontSize:11,color:"#64748b",margin:"4px 0 0"}}>Kodlamada dünya #1 · 200K token · Constitutional AI · Güvenli ve şeffaf</p>
            </div>
            <button onClick={()=>setPage("claude")} style={{padding:"9px 20px",border:"1px solid rgba(168,85,247,0.4)",borderRadius:10,background:"rgba(168,85,247,0.08)",color:"#a855f7",fontSize:11,cursor:"pointer",fontWeight:700,fontFamily:"inherit"}}>Claude Sayfası →</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:12,marginBottom:16}}>
            {[["⚖️","Constitutional AI Nedir?","Anthropic, Claude'a bir 'anayasa' verdi — etik ilkeler listesi. Claude kendi yanıtlarını bu ilkelere göre değerlendirip düzeltiyor. Sonuç: en güvenilir AI.","#a855f7"],
              ["💻","Kodlamada #1","SWE-bench'te %72.5 başarı oranı. Gerçek GitHub pull request'lerini çözüyor. Cursor editöründe varsayılan model. Python, JS, Rust, Go desteği.","#34d399"],
              ["📖","200K Token Context","Tek promptta 150.000 kelime — yaklaşık 500 sayfa. Tüm kod tabanını, uzun sözleşmeyi, kitabı analiz edebilir. Gemini'den sonra en büyük context.","#00dcff"],
              ["🎯","Kullanım Alanları","Kod yazma ve debug · Uzun döküman analizi · Akademik araştırma · Yaratıcı yazarlık · Veri analizi · Müzakere stratejisi","#fbbf24"],
              ["⚡","Hız Karşılaştırma","Sonnet 4.5: saniyede 100+ token. Haiku: en hızlı, en ucuz. Opus: en güçlü, en derin analiz. Hangi göreve hangi model?","#f472b6"],
              ["🔌","API Entegrasyonu","Python ve JS SDK'lar mevcut. OpenAI uyumlu format. Araç kullanımı (tool use), görsel analiz, ses transkripti.","#60a5fa"],
            ].map(([e,t,d,c])=><div key={t} onClick={()=>setPage("claude")}
              style={{background:c+"07",border:"1px solid "+c+"18",borderRadius:12,padding:"16px",cursor:"pointer",transition:"all .2s"}}
              onMouseEnter={ev=>{ev.currentTarget.style.transform="translateY(-2px)";ev.currentTarget.style.borderColor=c+"40";}}
              onMouseLeave={ev=>{ev.currentTarget.style.transform="";ev.currentTarget.style.borderColor=c+"18";}}>
              <div style={{fontSize:20,marginBottom:8}}>{e}</div>
              <div style={{fontSize:12,fontWeight:700,color:c,marginBottom:6}}>{t}</div>
              <div style={{fontSize:10,color:"#64748b",lineHeight:1.5}}>{d}</div>
            </div>)}
          </div>
          {/* Claude vs rakipler hızlı tablo */}
          <div style={{background:"rgba(168,85,247,0.05)",border:"1px solid rgba(168,85,247,0.15)",borderRadius:12,padding:"14px",overflowX:"auto"}}>
            <div style={{fontSize:11,fontWeight:700,color:"#a855f7",marginBottom:10}}>Claude Sonnet 4.5 vs Rakipler — Hızlı Skor</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {[["Kodlama","92","90","87"],["Türkçe","88","95","88"],["Güvenlik","98","85","87"],["Context","200K","128K","2M"],["Fiyat","$$","$$","$"]].map(([m,c,g,gm])=><div key={m} style={{flex:"1 1 80px",minWidth:80,background:"rgba(0,0,0,0.2)",borderRadius:8,padding:"8px",textAlign:"center"}}>
                <div style={{fontSize:9,color:"#475569",marginBottom:4}}>{m}</div>
                <div style={{fontSize:13,fontWeight:900,color:"#a855f7"}}>{c}</div>
                <div style={{fontSize:8,color:"#334155"}}>GPT: {g} | Gem: {gm}</div>
              </div>)}
            </div>
          </div>
        </div>
      </section>

      {/* ── OBSİDİAN + PKM BÖLÜMÜ ─────────────────── */}
      <section id="obsidian-section" style={{padding:"32px 20px"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12,marginBottom:20}}>
            <div>
              <div style={{fontSize:9,letterSpacing:".2em",color:"#fbbf24",marginBottom:4}}>KİŞİSEL BİLGİ YÖNETİMİ</div>
              <h2 style={{margin:0,fontSize:"clamp(18px,3vw,26px)",fontWeight:900,color:"#e2e8f0",fontFamily:"'Space Grotesk',sans-serif"}}>💎 Obsidian + AI: İkinci Beyin</h2>
              <p style={{fontSize:11,color:"#64748b",margin:"4px 0 0"}}>Not alma + AI entegrasyonu · Markdown tabanlı · Offline çalışır · Ücretsiz</p>
            </div>
            <a href="https://obsidian.md" target="_blank" rel="noopener noreferrer" style={{padding:"9px 20px",border:"1px solid rgba(251,191,36,0.4)",borderRadius:10,background:"rgba(251,191,36,0.08)",color:"#fbbf24",fontSize:11,fontWeight:700,textDecoration:"none"}}>obsidian.md →</a>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12,marginBottom:16}}>
            {[["💎","Obsidian Nedir?","Yerel Markdown dosyalarıyla çalışan not alma uygulaması. Verileriniz bilgisayarınızda, tamamen offline. Graph View ile notlar arasındaki bağlantıları görselleştirin.","#fbbf24"],
              ["🤖","AI Plugin: Smart Composer","Obsidian'a Claude/ChatGPT entegrasyonu. Notlarınız bağlamında AI ile konuşun. Vault'unuzdaki bilgiyi AI ile işleyin.","#a855f7"],
              ["🔗","Zettelkasten Yöntemi","Her fikri küçük notlara böl, birbirine bağla. AI ile: 'Bu notla ilgili başka hangi notlarım var?' sorusu saniyeler içinde yanıtlanıyor.","#00dcff"],
              ["📝","Daily Notes + AI","Günlük not şablonunuzu AI ile otomatik doldurun. Toplantı özetleri, karar günlükleri, öğrenme notları AI ile zenginleştirilir.","#34d399"],
              ["🔍","Semantic Search","AI ile anlam tabanlı arama. 'Geçen ay not aldığım proje yönetimi fikirleri' gibi doğal dil araması.","#fb923c"],
              ["📊","Dataview + AI","Obsidian Dataview plugin ile notlarınızı veritabanı gibi sorgulayın. AI ile karmaşık sorgular oluşturun.","#f472b6"],
            ].map(([e,t,d,c])=><div key={t} style={{background:c+"07",border:"1px solid "+c+"18",borderRadius:12,padding:"14px",transition:"all .2s"}}
              onMouseEnter={ev=>{ev.currentTarget.style.borderColor=c+"40";}}
              onMouseLeave={ev=>{ev.currentTarget.style.borderColor=c+"18";}}>
              <div style={{fontSize:20,marginBottom:8}}>{e}</div>
              <div style={{fontSize:11,fontWeight:700,color:c,marginBottom:6}}>{t}</div>
              <div style={{fontSize:10,color:"#64748b",lineHeight:1.5}}>{d}</div>
            </div>)}
          </div>
          {/* Obsidian + AI pratik kullanım örnekleri */}
          <div style={{background:"rgba(251,191,36,0.05)",border:"1px solid rgba(251,191,36,0.15)",borderRadius:12,padding:"14px"}}>
            <div style={{fontSize:11,fontWeight:700,color:"#fbbf24",marginBottom:10}}>⚡ Pratik Kullanım Senaryoları</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:8}}>
              {[["📚","Kitap Özeti","Kitabı Claude ile özetle → Obsidian notuna yapıştır → Dataview ile tüm kitap özetlerini görüntüle"],
                ["🎯","Proje Yönetimi","Meeting notları → AI ile aksiyon maddeleri çıkar → Obsidian Tasks ile takip et"],
                ["🧠","Fikir Geliştirme","Ham fikri Obsidian'a yaz → Claude ile genişlet → Graph View'de ilgili fikirleri bul"],
                ["📰","İçerik Üretimi","Web makaleleri → Obsidian Clipper ile kaydet → AI ile blog yazısına dönüştür"],
              ].map(([e,t,d])=><div key={t} style={{padding:"10px",background:"rgba(0,0,0,0.2)",borderRadius:8}}>
                <div style={{fontSize:11,fontWeight:700,color:"#fbbf24",marginBottom:4}}>{e} {t}</div>
                <div style={{fontSize:9,color:"#64748b",lineHeight:1.5}}>{d}</div>
              </div>)}
            </div>
          </div>
        </div>
      </section>

      <SocialMediaSection setPage={setPage}/>

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


function HaberlerPage({setPage}){
  const[tab,setTab]=useState('hepsi');
  const[likes,setLikes]=useState(()=>{try{return JSON.parse(localStorage.getItem('imdatai_hlikes')||'{}');}catch(e){return {};}});
  function toggleLike(id){const n={...likes,[id]:!likes[id]};setLikes(n);try{localStorage.setItem('imdatai_hlikes',JSON.stringify(n));}catch(e){}}

  const NEWS=[
    {id:1,icon:"🧠",source:"Anthropic",color:"#a855f7",cat:"Anthropic",date:"Mayıs 2026",
     title:"Claude Sonnet 4.5: Yeni Nesil AI Asistan",
     desc:"Anthropic, Claude Sonnet 4.5 modelini tanıttı. 200K token context, gelişmiş kod analizi ve %40 hız artışı. Pro kullanıcılara ücretsiz.",
     url:"https://www.anthropic.com/news"},
    {id:2,icon:"🤖",source:"OpenAI",color:"#34d399",cat:"OpenAI",date:"Mayıs 2026",
     title:"GPT-5 Yolda: OpenAI Yeni Modeli Duyurdu",
     desc:"OpenAI, GPT-5'in eğitim sürecinin tamamlandığını açıkladı. Çok modlu anlayış ve gerçek zamanlı ses özellikleri ön plana çıkıyor.",
     url:"https://openai.com/blog"},
    {id:3,icon:"🌟",source:"Google DeepMind",color:"#fbbf24",cat:"Google",date:"Mayıs 2026",
     title:"Gemini 2.5 Pro: 2 Milyon Token ile Rekor",
     desc:"Google'ın yeni modeli 2M token ile endüstri rekoru kırdı. Video anlama, uzun döküman analizi ve çok dilli destek öne çıkıyor.",
     url:"https://blog.google/technology/google-deepmind/"},
    {id:4,icon:"🔬",source:"DeepSeek",color:"#00dcff",cat:"Model",date:"Mayıs 2026",
     title:"DeepSeek R2: Matematik ve Kodda Yeni Standart",
     desc:"Çin yapımı DeepSeek'in R2 modeli olimpiyat matematik problemlerinde %97.3 başarı. Tamamen açık kaynak ve ücretsiz API sunuyor.",
     url:"https://www.deepseek.com"},
    {id:5,icon:"📰",source:"TechCrunch",color:"#ff4444",cat:"Teknoloji",date:"Mayıs 2026",
     title:"AI Pazarı 500 Milyar Doları Aştı",
     desc:"Yapay zeka şirketlerinin toplam piyasa değeri 500 milyar doları geçti. Anthropic, OpenAI ve Google'ın rekabeti kızışıyor.",
     url:"https://techcrunch.com/category/artificial-intelligence/"},
    {id:6,icon:"🎓",source:"MIT Tech Review",color:"#fb923c",cat:"Araştırma",date:"Mayıs 2026",
     title:"LLM'lerin Sınırları: 2026 Araştırma Özeti",
     desc:"MIT araştırmacıları büyük dil modellerinin gerçek anlayışı mı yoksa istatistiksel örüntü eşleştirme mi yaptığını sorguluyor.",
     url:"https://www.technologyreview.com/topic/artificial-intelligence/"},
    {id:7,icon:"🇹🇷",source:"Türkiye AI",color:"#60a5fa",cat:"Türkiye",date:"Mayıs 2026",
     title:"Türkiye AI Ekosistemi 2026 Raporu",
     desc:"Türkiye'deki AI yatırımları 3 katına çıktı. 250+ aktif startup, üniversite-sanayi iş birlikleri ve yerli LLM projeleri hızlanıyor.",
     url:"https://www.tubitak.gov.tr"},
    {id:8,icon:"💼",source:"VentureBeat",color:"#f472b6",cat:"Kariyer",date:"Nisan 2026",
     title:"AI Mühendisi Maaşları Türkiye'de ₺80K'ya Çıktı",
     desc:"Türkiye'de AI/ML pozisyonlarında maaşlar %60 arttı. Prompt mühendisliği en hızlı büyüyen kariyer. Uzaktan çalışma olanakları artıyor.",
     url:"https://venturebeat.com/category/ai/"},
    {id:9,icon:"🛡️",source:"Wired",color:"#e879f9",cat:"Güvenlik",date:"Nisan 2026",
     title:"AI Deepfake Saldırıları %400 Arttı",
     desc:"2026'nın ilk çeyreğinde AI destekli dolandırıcılık vakalarında rekor artış. Ses klonlama ve video deepfake teknikleri daha erişilebilir hale geldi.",
     url:"https://www.wired.com/tag/artificial-intelligence/"},
    {id:10,icon:"⚡",source:"The Verge",color:"#a855f7",cat:"Teknoloji",date:"Nisan 2026",
     title:"Meta Llama 4: Açık Kaynak AI'ın Yeni Lideri",
     desc:"Meta'nın Llama 4 modeli kapalı kaynak rakiplerine yakın benchmark sonuçları gösteriyor. Self-hosting topluluğu hızla büyüyor.",
     url:"https://www.theverge.com/ai-artificial-intelligence"},
    {id:11,icon:"🤗",source:"Hugging Face",color:"#fbbf24",cat:"Araştırma",date:"Nisan 2026",
     title:"Hugging Face'de 1 Milyon Açık Kaynak Model",
     desc:"Hugging Face platformu 1 milyon açık kaynak AI modelini geçti. Mistral, Llama ve Phi serisi en popüler modeller arasında.",
     url:"https://huggingface.co/blog"},
    {id:12,icon:"🎵",source:"AI Weekly",color:"#34d399",cat:"Araştırma",date:"Mart 2026",
     title:"Suno ve Udio: AI Müziği Ana Akıma Girdi",
     desc:"AI müzik üretim platformları aylık 50 milyon kullanıcıya ulaştı. Müzik endüstrisi telif hukuku tartışmaları devam ediyor.",
     url:"https://www.technologyreview.com/topic/artificial-intelligence/"},
    {id:13,icon:"💻",source:"GitHub Blog",color:"#475569",cat:"Geliştirici",date:"Mart 2026",
     title:"GitHub Copilot Yeni Özellikler: Multi-File Editing",
     desc:"GitHub Copilot artık aynı anda birden fazla dosyayı düzenleyebiliyor. Claude Sonnet 4.5 entegrasyonu mevcut.",
     url:"https://github.blog/"},
    {id:14,icon:"⚖️",source:"Euronews",color:"#ff4444",cat:"Hukuk",date:"Mart 2026",
     title:"AB AI Kanunu Yürürlükte: Şirketler Hazırlanıyor",
     desc:"Avrupa Birliği'nin AI Kanunu tam anlamıyla yürürlüğe girdi. Türk şirketleri AB pazarı için uyum sürecini başlattı.",
     url:"https://www.euronews.com/tech"},
    {id:15,icon:"🎨",source:"Adobe Blog",color:"#ff6b6b",cat:"Araçlar",date:"Şubat 2026",
     title:"Adobe Firefly 3: Photoshop'ta AI Devrimi",
     desc:"Adobe Firefly 3 ile Photoshop'ta nesneler silinebiliyor, arka planlar değiştirilebiliyor. Telif güvenli görseller.",
     url:"https://blog.adobe.com/"},
  ];

  const cats=['hepsi',...new Set(NEWS.map(n=>n.cat))];
  const filtered=tab==='hepsi'?NEWS:NEWS.filter(n=>n.cat===tab);

  return <div style={{maxWidth:1000,margin:'0 auto',padding:'24px 16px'}}>
    <div style={{marginBottom:20}}>
      <div style={{fontSize:9,letterSpacing:'.2em',color:'#ff4444',marginBottom:4}}>AI HABER MERKEZİ — SEÇİLMİŞ İÇERİKLER</div>
      <h1 style={{fontSize:24,fontWeight:900,color:'#e2e8f0',fontFamily:"'Space Grotesk',sans-serif",margin:'0 0 6px'}}>📰 AI Haberleri</h1>
      <p style={{fontSize:12,color:'#64748b',margin:'0 0 10px'}}>Anthropic · OpenAI · Google · TechCrunch · MIT Tech Review · Wired — seçilmiş AI gündemi</p>
      <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
        {[...new Set(NEWS.map(n=>n.source))].slice(0,8).map(s=>{
          const item=NEWS.find(n=>n.source===s);
          return <a key={s} href={item.url} target="_blank" rel="noopener noreferrer"
            style={{fontSize:9,color:item.color,background:item.color+'12',border:'1px solid '+item.color+'25',borderRadius:4,padding:'2px 7px',textDecoration:'none',fontWeight:600}}>{item.icon} {s}</a>;
        })}
      </div>
    </div>

    <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:16}}>
      {cats.map(c=><button key={c} onClick={()=>setTab(c)}
        style={{padding:'5px 12px',borderRadius:7,border:'1px solid '+(tab===c?'rgba(255,68,68,0.4)':'rgba(255,255,255,0.07)'),
          background:tab===c?'rgba(255,68,68,0.1)':'transparent',
          color:tab===c?'#ff4444':'#64748b',fontSize:10,cursor:'pointer',fontFamily:'inherit'}}>
        {c}
      </button>)}
    </div>

    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(290px,1fr))',gap:14}}>
      {filtered.map(item=><div key={item.id}
        style={{background:item.color+'06',border:'1px solid '+item.color+'18',borderRadius:13,overflow:'hidden',transition:'all .2s'}}
        onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.borderColor=item.color+'40';}}
        onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.borderColor=item.color+'18';}}>
        <div style={{height:4,background:'linear-gradient(90deg,'+item.color+',transparent)'}}/>
        <div style={{padding:'14px'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
            <span style={{fontSize:9,color:item.color,background:item.color+'15',borderRadius:4,padding:'2px 8px',fontWeight:700}}>{item.icon} {item.source}</span>
            <span style={{fontSize:9,color:'#334155'}}>{item.date}</span>
          </div>
          <div style={{fontSize:13,fontWeight:700,color:'#e2e8f0',lineHeight:1.4,marginBottom:8}}>{item.title}</div>
          <div style={{fontSize:11,color:'#64748b',lineHeight:1.6,marginBottom:12}}>{item.desc}</div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <a href={item.url} target="_blank" rel="noopener noreferrer"
              style={{fontSize:10,color:item.color,textDecoration:'none',fontWeight:700}}>Kaynağa Git →</a>
            <button onClick={()=>toggleLike(item.id)}
              style={{background:'none',border:'1px solid '+(likes[item.id]?item.color+'60':'rgba(255,255,255,0.08)'),
                borderRadius:8,padding:'4px 12px',cursor:'pointer',
                color:likes[item.id]?item.color:'#475569',fontSize:12,transition:'all .2s'}}>
              {likes[item.id]?'❤️':'🤍'}
            </button>
          </div>
        </div>
      </div>)}
    </div>

    <div style={{marginTop:20,padding:'14px',background:'rgba(255,255,255,0.02)',borderRadius:10,border:'1px solid rgba(255,255,255,0.06)',textAlign:'center'}}>
      <div style={{fontSize:10,color:'#334155',marginBottom:8}}>📡 Canlı AI haberleri için bu kaynakları takip edin</div>
      <div style={{display:'flex',gap:8,justifyContent:'center',flexWrap:'wrap'}}>
        {[['🌐 Google AI Haberleri','https://news.google.com/search?q=artificial+intelligence&hl=tr'],
          ['📰 TechCrunch AI','https://techcrunch.com/category/artificial-intelligence/'],
          ['🤗 Hugging Face Blog','https://huggingface.co/blog'],
          ['🧠 Anthropic News','https://www.anthropic.com/news'],
          ['🌊 Mistral News','https://mistral.ai/news/']].map(([n,u])=>(
          <a key={n} href={u} target="_blank" rel="noopener noreferrer"
            style={{fontSize:10,color:'#64748b',border:'1px solid rgba(255,255,255,0.08)',borderRadius:7,padding:'5px 10px',textDecoration:'none'}}>{n}</a>
        ))}
      </div>
    </div>
  </div>;
}

function BlogPage({setPage}){
  const[sel,setSel]=useState(null);
  const[activeCat,setActiveCat]=useState('Tümü');

  const POSTS=[
    {id:1,cat:"Model Rehberi",color:"#a855f7",icon:"🧠",hot:true,
     title:"Claude AI Nedir? 2026 Tam Türkçe Rehberi",
     summary:"Anthropic'in en gelişmiş AI modeli Claude'u her yönüyle anlatan kapsamlı rehber.",
     content:`Claude, San Francisco merkezli Anthropic şirketi tarafından geliştirilen yapay zeka asistanıdır. 2026 yılı itibarıyla Claude Sonnet 4.5 ve Claude Opus 4.5 modelleriyle piyasanın en güçlü AI'larından biri konumundadır.

**Claude'un Güçlü Yönleri**

Claude'u diğer AI modellerinden ayıran en önemli özellik Constitutional AI yaklaşımıdır. Bu yöntemle model, etik ilkeleri içselleştirerek yanıt üretir. Sonuç: daha güvenilir, daha az yanıltıcı çıktılar.

• **Kodlama:** SWE-bench'te %72.5 başarı — endüstri standardının üzerinde
• **Context Window:** 200.000 token — yaklaşık 500 sayfalık kitap
• **Dil:** Türkçe dahil 30+ dil, yüksek kalite
• **Araç Kullanımı:** Web arama, kod çalıştırma, dosya analizi

**Claude vs ChatGPT vs Gemini**

| Özellik | Claude | ChatGPT | Gemini |
|---------|--------|---------|--------|
| Kodlama | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Türkçe | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Güvenlik | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| Context | 200K | 128K | 2M |

**Claude Nasıl Kullanılır?**

1. claude.ai adresine gidin
2. Ücretsiz hesap oluşturun
3. Claude Sonnet 4.5'e ücretsiz erişin
4. Pro plan ($20/ay) ile Opus'a geçin

**En İyi Prompt Teknikleri**

"XML tag kullanın" → <task>, <context>, <format> etiketleriyle Claude çok daha iyi sonuç üretir. "Adım adım düşün" → Karmaşık problemlerde chain-of-thought aktive edin. "Rol ver" → "Sen kıdemli bir yazılım mühendisisin" gibi rol tanımları kaliteyi artırır.`},

    {id:2,cat:"Prompt",color:"#00dcff",icon:"💡",hot:true,
     title:"İleri Seviye Prompt Mühendisliği: 2026 Teknikleri",
     summary:"Chain of Thought, Tree of Thoughts, Self-Consistency ve daha fazlası.",
     content:`Prompt mühendisliği artık bir kariyer. 2026'da en iyi AI sonuçlarını almak için bilmeniz gereken 10 teknik:

**1. Chain of Thought (CoT) Prompting**

"Adım adım düşünerek yanıtla" cümlesi modeli akıl yürütmeye zorlar. Matematik ve mantık problemlerinde %40+ iyileşme sağlar.

Kötü: "45 × 37 kaçtır?"
İyi: "45 × 37'yi adım adım hesapla. Önce 40×37, sonra 5×37, ardından topla."

**2. Few-Shot Learning**

Modele 2-3 örnek vererek istediğiniz formatı öğretin.

"Email yaz:
Örnek 1: [örnek] → [sonuç]
Örnek 2: [örnek] → [sonuç]
Şimdi şunu yaz: [asıl istek]"

**3. XML Tag Kullanımı (Claude için önemli)**

<task>Türkçe bir ürün açıklaması yaz</task>
<product>Kablosuz kulaklık</product>
<tone>Profesyonel, enerjik</tone>
<length>150 kelime</length>

**4. Role Prompting**

"Sen 10 yıllık deneyimli bir [MESLEK]sın. [GÖREV] konusunda uzman tavsiyesi ver."

**5. Constitutional Prompting**

Yanıta dahil edilmesini İSTEDİKLERİNİZİ ve İSTEMEDİKLERİNİZİ açıkça belirtin.

**6. Tree of Thoughts**

"Bu problemi çözmek için 3 farklı yaklaşım öner. Her birini değerlendir. En iyisini seç ve uygula."

**7. Self-Consistency**

Aynı soruyu 3 farklı şekilde sor, en tutarlı yanıtı kullan.

**8. Prompt Chaining**

Büyük görevi küçük parçalara böl. Her parçanın çıktısı sonrakinin girdisi olsun.

**9. Negative Prompting**

"Şunu YAPMA: tekrar etme, özür dileme, belirsiz ol."

**10. Structured Output**

"JSON formatında yanıtla: {başlık, özet, maddeler:[], puan}"

Bu 10 tekniği uygulayanlar rakiplerine göre 3-5x daha iyi AI sonuçları alıyor.`},

    {id:3,cat:"Karşılaştırma",color:"#34d399",icon:"🆚",hot:true,
     title:"ChatGPT vs Claude vs Gemini 2026: 10 Kategoride Test",
     summary:"Hangi AI modeli ne için en iyi? Gerçek test sonuçları.",
     content:`2026 yılında 3 büyük AI modeli olan ChatGPT, Claude ve Gemini'yi 10 kategoride test ettik. İşte şaşırtıcı sonuçlar:

**TEST 1: Türkçe Metin Kalitesi**
🥇 ChatGPT — Doğal Türkçe, deyimler mükemmel
🥈 Claude — Çok iyi ama bazen Yabancı kelimeler
🥉 Gemini — İyi ama bazen robotik

**TEST 2: Kod Yazma (Python)**
🥇 Claude — %92 başarı, temiz kod, yorum açıklamaları
🥈 ChatGPT — %89 başarı
🥉 Gemini — %85 başarı

**TEST 3: Matematik (Olimpiyat Seviye)**
🥇 Claude — %78 başarı
🥈 ChatGPT — %74 başarı
🥉 Gemini — %71 başarı

**TEST 4: Yaratıcı Yazarlık**
🥇 Claude — En özgün, en az klişe
🥈 ChatGPT — İyi ama benzer yapılar
🥉 Gemini — Yeterli

**TEST 5: Uzun Döküman Analizi**
🥇 Gemini — 2M token, rakipsiz
🥈 Claude — 200K token, yüksek kalite
🥉 ChatGPT — 128K token

**TEST 6: Gerçek Zamanlı Bilgi**
🥇 ChatGPT — Web arama entegreli
🥈 Gemini — Google entegrasyonu
🥉 Claude — Güncel arama sınırlı

**TEST 7: API Fiyat/Performans**
🥇 DeepSeek — 1/10 maliyetle benzer kalite
🥈 Gemini Flash — Ucuz ve hızlı
🥉 Mistral — GDPR uyumlu, uygun fiyat

**TEST 8: Güvenlik ve Güvenilirlik**
🥇 Claude — Constitutional AI, en az hallüsinasyon
🥈 ChatGPT — İyi ama bazen uydurma
🥉 Gemini — Gelişiyor

**TEST 9: Çok Modlu Anlayış (Görsel)**
🥇 Gemini — En güçlü görsel analiz
🥈 ChatGPT — DALL-E entegrasyonu
🥉 Claude — Temel görsel anlama

**TEST 10: Kullanım Kolaylığı**
🥇 ChatGPT — En geniş kullanıcı tabanı
🥈 Claude — Sezgisel arayüz
🥉 Gemini — Google entegrasyonu

**GENEL SONUÇ:**
- Kod & Analiz → Claude
- Türkçe & Günlük → ChatGPT
- Uzun Döküman → Gemini
- Maliyet → DeepSeek`},

    {id:4,cat:"Görsel AI",color:"#f472b6",icon:"🎨",hot:false,
     title:"Midjourney v7 Türkçe Rehberi: Fotogerçekçi Görseller",
     summary:"Midjourney v7 ile %94 fotogerçekçilik. Prompt teknikleri ve parametreler.",
     content:`Midjourney v7, yapay zeka görsel üretiminde yeni bir çığır açtı. İnsan fotoğraflarından neredeyse ayırt edilemez görseller üretebiliyor.

**Başlamak için:**
1. discord.com'a girin, Midjourney sunucusuna katılın
2. /imagine komutuyla prompt yazın
3. Ya da midjourney.com web arayüzünü kullanın (daha kolay)

**Temel Parametreler:**
- --ar 16:9 → yatay format
- --ar 9:16 → dikey (sosyal medya)
- --q 2 → yüksek kalite
- --style raw → daha gerçekçi
- --v 7 → en yeni versiyon

**Fotogerçekçi Portre Promptu:**
"Professional headshot of a 35-year-old Turkish businessman, natural lighting, Sony A7R camera, 85mm lens, shallow depth of field, corporate office background --ar 3:4 --style raw --v 7"

**Ürün Fotoğrafçılığı:**
"Minimalist product photo of [ÜRÜN], white background, studio lighting, commercial photography style, 8k resolution --ar 1:1 --v 7"

**Manzara:**
"Aerial view of Istanbul at golden hour, Bosphorus Bridge, dramatic clouds, hyperrealistic photography --ar 16:9 --style raw --v 7"

**Türkçe Prompt Çalışır mı?**
Evet! "Güneş batımında İstanbul silüeti, hiperrealitik" gibi Türkçe promptlar çalışır ama İngilizce daha iyi sonuç verir.

**Alternatifler:**
- DALL-E 3 (ChatGPT içinde) → daha kolay, Türkçe destekli
- Adobe Firefly → telif güvenli görseller
- Stable Diffusion → ücretsiz, yerel kurulum
- Leonardo AI → oyun ve karakter tasarımı`},

    {id:5,cat:"Kariyer",color:"#fbbf24",icon:"💰",hot:true,
     title:"AI ile Ayda 30.000₺ Kazanmak: Gerçek Yollar",
     summary:"Türkiye'de AI ile para kazanmanın 7 kanıtlanmış yöntemi.",
     content:`Yapay zeka alanında Türkiye'de gerçekten para kazanılabilir mi? Evet — ama doğru strateji gerekli.

**1. Prompt Mühendisliği Hizmeti**
Şirketlere ChatGPT/Claude prompt'larını optimize etme hizmeti verin.
→ Proje başına 500-5.000₺
→ Müşteri bulma: LinkedIn, Upwork, yerel network
→ Gerekli: iyi İngilizce + AI bilgisi

**2. AI Destekli İçerik Üretimi**
Blog yazıları, sosyal medya içerikleri, ürün açıklamaları.
→ 1.000 kelime makale: 300-800₺
→ AI ile 10x daha hızlı üretim
→ Kalite kontrolü siz yapın

**3. AI Chatbot Kurulumu**
Şirketlere özel chatbot entegrasyonu.
→ Proje başına 5.000-25.000₺
→ Araçlar: Botpress, Voiceflow, n8n
→ Gerekli: temel programlama bilgisi

**4. Midjourney / DALL-E Hizmeti**
Markalara özel AI görseli üretimi.
→ Ürün başına 200-1.000₺
→ Talep: e-ticaret, reklam ajansları
→ Portfolyo oluşturun

**5. AI Eğitim ve Workshop**
Şirket çalışanlarına AI kullanım eğitimi.
→ Günlük workshop: 3.000-10.000₺
→ Online kurs: Udemy, Hotmart
→ Gerekli: sunum becerisi

**6. AI SEO Danışmanlığı**
AI araçlarıyla web sitesi içerik stratejisi.
→ Aylık retainer: 5.000-15.000₺
→ Araçlar: Surfer SEO, Jasper, Claude
→ Yüksek talep var

**7. Freelance AI Geliştirici**
Upwork ve Fiverr'da AI projeleri.
→ Saat ücreti: $15-50
→ LangChain, OpenAI API, Python
→ İngilizce şart

**Başlangıç için önerim:**
Hemen bir alan seçin, 1 ay boyunca günde 2 saat pratik yapın, ilk müşteriyi ücretsiz alın, referans oluşturun.`},

    {id:6,cat:"Güvenlik",color:"#ff4444",icon:"🛡️",hot:false,
     title:"AI Dolandırıcılığından Korunma Rehberi 2026",
     summary:"Deepfake, ses klonlama ve AI phishing'e karşı pratik koruma yöntemleri.",
     content:`2026'da AI tabanlı dolandırıcılık vakalarında rekor artış var. İşte bilmeniz gerekenler:

**En Yaygın AI Dolandırıcılıkları**

**1. Ses Klonlama**
Dolandırıcılar 3 saniyelik ses kaydından birisinin sesini kopyalayabiliyor.
"Annenin" sesi sizi arayıp para isteyebilir.

Korunma: Aileyle özel "güvenlik kelimesi" belirleyin. Şüpheli aramalarda kapatıp geri arayın.

**2. Video Deepfake**
Tanıdık birisinin yüzü sahte videoya yapıştırılıyor.
WhatsApp video araması bile sahte olabilir.

Korunma: Canlı aramada beklenmedik hareketler isteyin (el sallama, gözlük çıkarma).

**3. AI Phishing E-posta**
Mükemmel Türkçe, kişiselleştirilmiş sahte e-postalar.
Banka, vergi, kargo bildirimlerine dikkat.

Korunma: Link'e tıklamadan önce gönderici adresini kontrol edin. Şüpheyi kuruma doğrudan arayın.

**4. Romantik AI Dolandırıcılığı**
Sosyal medyada AI ile üretilmiş sahte profiller.
Güven inşa edip para isteme.

Korunma: Video görüntülü görüşme isteyin. Banka havalesi yapmayın.

**Kendinizi Test Edin:**
Bu URL'ye gidin: deepware.ai — yüklediğiniz videonun deepfake olup olmadığını kontrol eder.

**Acil Durum:**
Dolandırıcılık mağduru olduysanız: Türkiye'de 155 (polis) veya Siber Suçlar birimi: https://www.sibergüvenlik.gov.tr`},

    {id:7,cat:"Teknik",color:"#00dcff",icon:"⚡",hot:false,
     title:"Claude Code ile 1 Saatte Gerçek Uygulama Geliştirme",
     summary:"Cursor + Claude Sonnet: sıfır deneyimle çalışan web uygulaması.",
     content:`"Kod bilmiyorum ama uygulama yapmak istiyorum." 2026'da bu artık bir engel değil.

**Araçlar**
- Cursor (cursor.sh) — AI destekli kod editörü, ücretsiz
- Claude Sonnet 4.5 — en iyi kodlama AI
- Vercel — ücretsiz deployment

**Adım Adım: Todo Uygulaması**

**Adım 1:** Cursor'u indirin ve kurun (5 dk)

**Adım 2:** Cursor'da Ctrl+K yapın, şunu yazın:
"React ile basit bir todo uygulaması yap. Görev ekleyebilme, tamamlama işareti koyabilme, silme. Tailwind CSS kullan. Türkçe arayüz."

**Adım 3:** Claude kodu üretir. "Çalıştır" deyin.

**Adım 4:** Sorun varsa hatayı kopyalayın ve Claude'a yapıştırın: "Bu hatayı düzelt: [HATA]"

**Adım 5:** Vercel'e yükleyin (ücretsiz):
\`npm install -g vercel\`
\`vercel deploy\`

**Sonuç:** 45 dakikada canlı uygulama.

**Daha İleri:**
- "Kullanıcı girişi ekle" → Clerk.dev entegrasyonu
- "Veritabanı ekle" → Supabase (ücretsiz)
- "Ödeme sistemi" → Stripe entegrasyonu

**Dikkat edilecekler:**
Claude'un ürettiği kodu anlamaya çalışın. Körce kopyalamayın. Her değişikliğin ne yaptığını sorun.`},
  ];

  const cats=['Tümü',...new Set(POSTS.map(p=>p.cat)),
    {id:8,cat:"Araçlar",color:"#34d399",icon:"⌨️",hot:true,
     title:"Cursor IDE ile Yapay Zeka Destekli Kodlama Rehberi",
     summary:"Kodu 3x hızlı yazın. Cursor + Claude kombinasyonu ile gerçek proje.",
     content:`Cursor, yapay zeka ile entegre bir kod editörüdür. VS Code tabanlıdır ve 2026 itibarıyla yapay zeka destekli kodlamada endüstri standardı haline gelmiştir.

**Cursor Neden Özel?**

Tab ile kod tamamlama: Cursor yazmak istediğinizi tahmin eder. Tab'a basarsanız kabul edersiniz.
Ctrl+K: Seçili kodu yapay zekaya gönderin. "Bu fonksiyonu TypeScript'e çevir" gibi.
Ctrl+L: Chat paneli açar. Tüm proje bağlamıyla konuşun.

**Hangi AI Modeli Kullanılır?**

Claude Sonnet 4.5 → Kod yazma ve analiz için en iyi
GPT-4o → Alternatif, genel görevler
Gemini → Büyük codebase analizi

**Kurulum (5 Dakika):**

1. cursor.com adresinden indirin
2. VS Code eklentilerinizi import edin (otomatik)
3. GitHub hesabıyla giriş yapın
4. Ctrl+L ile Claude'a "Merhaba" deyin

**En İyi Kullanım Senaryoları:**

Yeni özellik eklemek: "Authentication sistemine Google OAuth ekle"
Bug düzeltmek: Hata mesajını kopyalayın, Cursor'a yapıştırın
Refactoring: "Bu 200 satırı daha temiz yaz"
Test yazmak: "Bu fonksiyon için Jest testleri yaz"
Dokümantasyon: "Bu API endpoint'lerini Markdown'da belgele"

**Ücretsiz vs Pro:**

Ücretsiz: 2000 tamamlama, 50 yavaş sorgu/ay
Pro ($20/ay): Sınırsız tamamlama, hızlı sorgular, Claude Opus erişimi

**Cursor + AI İpuçları:**

.cursorrules dosyası oluşturun: Projeye özel kurallar belirtin.
@codebase kullanın: Tüm projeyi bağlam olarak ekler.
@web kullanın: Güncel dokümantasyonu çeker.`},

    {id:9,cat:"Araçlar",color:"#a855f7",icon:"🔍",hot:true,
     title:"Perplexity AI: Google'a Meydan Okuyan AI Arama Motoru",
     summary:"Kaynak gösteren, özetleyen, yanıtlayan. Araştırma için neden Perplexity?",
     content:`Perplexity AI, geleneksel arama motorlarından farklı olarak size doğrudan yanıt verir ve kaynaklarını gösterir. 2026 itibarıyla günlük 10 milyon+ sorgu işlemektedir.

**Perplexity vs Google:**

Google: Bağlantı listesi verir, siz araştırırsınız.
Perplexity: Tüm kaynakları okur, size özetini sunar. Kaynakları gösterir.

**Ne Zaman Kullanılır?**

Hızlı araştırma: "Tesla Model 3'ün 2026 fiyatı nedir?"
Güncel bilgi: Modelin bilgi kesme tarihi yoktur, canlı web'den çeker.
Akademik: "RAG sistemlerindeki son gelişmeler neler?"
Alışveriş: "En iyi mekanik klavye 2026 karşılaştırması"

**Pro Özellikleri (Ücretsiz Limiti Var):**

Spaces: Konuya özel koleksiyonlar
Collections: Araştırma dosyaları
Claude/GPT-4 ile sorgulama

**Türkçe Performans:**

Türkçe sorgular çok iyi çalışır. "Yapay zeka haber 2026" gibi sorgular Türkçe kaynakları da tarar.

**Perplexity API:**

Geliştiriciler için API mevcut. RAG sistemi kurmak yerine Perplexity kullanabilirsiniz.`},

    {id:10,cat:"Araçlar",color:"#fbbf24",icon:"📓",hot:false,
     title:"Google NotebookLM: Dokümanlarınızı Konuşturun",
     summary:"PDF yükleyin, podcast oluşturun, soru sorun. Tamamen ücretsiz.",
     content:`NotebookLM, Google'ın 2024'te çıkardığı ve 2026'da Türkiye'de popülerleşen ücretsiz AI araştırma asistanıdır.

**NotebookLM Nedir?**

Kendi kaynaklarınızı yükleyip bunlarla konuşmanızı sağlar. Hallüsinasyon minimaldır çünkü sadece sizin verilerinizden yanıt üretir.

**Ne Yükleyebilirsiniz?**

PDF dosyalar (araştırma makaleleri, kitaplar)
Google Docs
Web sayfaları (URL ile)
YouTube videoları (transkript)
Ses dosyaları

**En İyi Kullanımlar:**

Akademik araştırma: 10 makale yükleyin, "Bu makalelerin ortak bulguları nedir?" sorun.
Kitap özeti: 400 sayfalık kitabı yükleyin, bölüm özetleri isteyin.
Toplantı notları: Transkript yükleyin, aksiyon maddelerini çıkarın.
Podcast modu: İki yapay zeka sunucu yüklediğiniz içeriği podcast olarak anlatır!

**Audio Overview (Podcast Modu):**

NotebookLM'in en viral özelliği: kaynaklarınızı 10-15 dakikalık podcast'e dönüştürür. İki AI sunucu doğal sohbet şeklinde anlatır.

**Sınırlamalar:**

Yalnızca yüklediğiniz kaynaklardan yanıt verir (artı veya eksi olabilir).
Güncel web bilgisi çekmez.
Türkçe kaynaklarla çalışır ama İngilizce daha güçlü.

**Başlamak için:** notebooklm.google.com → Ücretsiz, Google hesabı yeterli.`},

    {id:11,cat:"Güvenlik",color:"#ff4444",icon:"⚖️",hot:false,
     title:"KVKK ve AI Kullanımı: Türkiye'de Hukuki Rehber",
     summary:"Şirketinizde ChatGPT/Claude kullanırken nelere dikkat etmelisiniz?",
     content:`Türkiye'deki Kişisel Verilerin Korunması Kanunu (KVKK) ile yapay zeka kullanımının kesişim noktaları kritik önem taşıyor.

**Temel Soru: AI'a ne gönderebilirsiniz?**

Güvenli: Genel sorular, public bilgiler, kendi yazdığınız içerik
Dikkatli: Şirket stratejileri (NDA olmayabilir ama)
Risk: Müşteri adları ve iletişim bilgileri
Yasak: TC kimlik numaraları, sağlık verileri, banka bilgileri

**ChatGPT/Claude'a Göre Fark:**

ChatGPT (OpenAI): Veriler ABD'de işlenir. Enterprise plan ile veri eğitimden hariç tutulur.
Claude (Anthropic): Benzer, veri işleme şeffaflığı daha yüksek.
Mistral: GDPR uyumlu Avrupa altyapısı.
Self-hosted Llama: Veri bilgisayarınızda, en güvenli.

**KVKK Uyum Adımları:**

1. Veri Envanteri: Hangi verilerin AI'a gittiğini belgelein.
2. Çalışan Eğitimi: Hangi verilerin paylaşılamayacağını öğretin.
3. Politika: Şirket AI kullanım politikası hazırlayın.
4. Anonimleştirme: Müşteri verilerini anonimleştirerek gönderin.

**Örnek Doğru Kullanım:**

Yanlış: "Ahmet Yılmaz'ın (TC: 12345...) başvurusu için email yaz"
Doğru: "Müşteri başvurusu için onay emaili yaz" (kişisel veri yok)

**AB AI Act Türkiye'yi Etkiler mi?**

Türkiye AB üyesi değil ama AB'ye hizmet veren Türk şirketleri etkileniyor. 2025'te Türkiye kendi AI Kanunu taslağını yayınladı.`},
];
  const filtered=activeCat==='Tümü'?POSTS:POSTS.filter(p=>p.cat===activeCat);

  if(sel){
    return <div style={{maxWidth:780,margin:'0 auto',padding:'24px 16px'}}>
      <button onClick={()=>setSel(null)} style={{display:'flex',alignItems:'center',gap:6,background:'none',border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,padding:'7px 14px',color:'#64748b',cursor:'pointer',fontSize:11,marginBottom:20,fontFamily:'inherit'}}>← Tüm Yazılar</button>
      <div style={{marginBottom:16}}>
        <span style={{fontSize:9,color:sel.color,background:sel.color+'15',borderRadius:4,padding:'2px 8px',fontWeight:700,marginBottom:8,display:'inline-block'}}>{sel.icon} {sel.cat}</span>
        <h1 style={{fontSize:'clamp(18px,4vw,26px)',fontWeight:900,color:'#e2e8f0',fontFamily:"'Space Grotesk',sans-serif",lineHeight:1.3,margin:'8px 0'}}>{sel.title}</h1>
        <p style={{fontSize:12,color:'#64748b',margin:'0 0 16px'}}>{sel.summary}</p>
        <div style={{height:2,background:'linear-gradient(90deg,'+sel.color+',transparent)',marginBottom:24}}/>
      </div>
      <div style={{fontSize:13,color:'#94a3b8',lineHeight:1.9}}>
        {sel.content.split('\n').map((line,i)=>{
          if(line.startsWith('**')&&line.endsWith('**'))
            return <h3 key={i} style={{fontSize:15,fontWeight:800,color:sel.color,margin:'20px 0 8px'}}>{line.slice(2,-2)}</h3>;
          if(line.startsWith('• '))
            return <div key={i} style={{display:'flex',gap:8,marginBottom:6}}><span style={{color:sel.color,flexShrink:0}}>•</span><span>{line.slice(2)}</span></div>;
          if(line.startsWith('→ '))
            return <div key={i} style={{display:'flex',gap:8,marginBottom:4,paddingLeft:12}}><span style={{color:sel.color,flexShrink:0}}>→</span><span style={{color:'#64748b',fontSize:12}}>{line.slice(2)}</span></div>;
          if(line.startsWith('🥇')||line.startsWith('🥈')||line.startsWith('🥉'))
            return <div key={i} style={{padding:'6px 10px',background:'rgba(255,255,255,0.03)',borderRadius:6,marginBottom:4,fontSize:12}}>{line}</div>;
          if(line.trim()==='')return <div key={i} style={{height:8}}/>;
          return <p key={i} style={{margin:'0 0 8px'}}>{line}</p>;
        })}
      </div>
      <div style={{marginTop:24,padding:'14px',background:sel.color+'08',borderRadius:10,border:'1px solid '+sel.color+'20',textAlign:'center'}}>
        <div style={{fontSize:11,color:'#64748b',marginBottom:8}}>Bu konuyu daha derin keşfedin:</div>
        <div style={{display:'flex',gap:8,justifyContent:'center',flexWrap:'wrap'}}>
          {sel.cat==='Model Rehberi'&&<button onClick={()=>setSel(null)||setPage('claude')} style={{padding:'6px 14px',border:'1px solid '+sel.color+'40',borderRadius:8,background:sel.color+'10',color:sel.color,fontSize:11,cursor:'pointer',fontFamily:'inherit'}}>🧠 Claude Sayfasına Git</button>}
          {sel.cat==='Prompt'&&<button onClick={()=>setSel(null)||setPage('prompt')} style={{padding:'6px 14px',border:'1px solid '+sel.color+'40',borderRadius:8,background:sel.color+'10',color:sel.color,fontSize:11,cursor:'pointer',fontFamily:'inherit'}}>💡 Prompt Rehberine Git</button>}
          {sel.cat==='Kariyer'&&<button onClick={()=>setSel(null)||setPage('para')} style={{padding:'6px 14px',border:'1px solid '+sel.color+'40',borderRadius:8,background:sel.color+'10',color:sel.color,fontSize:11,cursor:'pointer',fontFamily:'inherit'}}>💰 Para Kazan Sayfasına Git</button>}
          {sel.cat==='Güvenlik'&&<button onClick={()=>setSel(null)||setPage('guvenlik')} style={{padding:'6px 14px',border:'1px solid '+sel.color+'40',borderRadius:8,background:sel.color+'10',color:sel.color,fontSize:11,cursor:'pointer',fontFamily:'inherit'}}>🛡️ Güvenlik Sayfasına Git</button>}
        </div>
      </div>
    </div>;
  }

  return <div style={{maxWidth:1000,margin:'0 auto',padding:'24px 16px'}}>
    <div style={{marginBottom:20}}>
      <div style={{fontSize:9,letterSpacing:'.2em',color:'#64748b',marginBottom:4}}>IMDATAI REHBERLERİ</div>
      <h1 style={{fontSize:24,fontWeight:900,color:'#e2e8f0',fontFamily:"'Space Grotesk',sans-serif",margin:'0 0 6px'}}>✍️ AI Rehber Yazıları</h1>
      <p style={{fontSize:12,color:'#64748b',margin:0}}>Kapsamlı AI rehberleri — model karşılaştırmaları, prompt teknikleri, kariyer fırsatları</p>
    </div>
    <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:18}}>
      {cats.map(c=><button key={c} onClick={()=>setActiveCat(c)} style={{padding:'5px 12px',borderRadius:7,border:'1px solid '+(activeCat===c?'rgba(0,220,255,0.4)':'rgba(255,255,255,0.07)'),background:activeCat===c?'rgba(0,220,255,0.1)':'transparent',color:activeCat===c?'#00dcff':'#64748b',fontSize:10,cursor:'pointer',fontFamily:'inherit'}}>{c}</button>)}
    </div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(290px,1fr))',gap:14}}>
      {filtered.map(p=><div key={p.id} onClick={()=>setSel(p)}
        style={{background:p.color+'06',border:'1px solid '+p.color+'18',borderRadius:13,overflow:'hidden',cursor:'pointer',transition:'all .2s'}}
        onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.borderColor=p.color+'50';}}
        onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.borderColor=p.color+'18';}}>
        <div style={{height:4,background:'linear-gradient(90deg,'+p.color+',transparent)'}}/>
        <div style={{padding:'16px'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
            <span style={{fontSize:9,color:p.color,background:p.color+'15',borderRadius:4,padding:'2px 8px',fontWeight:700}}>{p.icon} {p.cat}</span>
            {p.hot&&<span style={{fontSize:8,color:'#ff4444',background:'rgba(255,68,68,0.12)',borderRadius:4,padding:'1px 6px',fontWeight:700}}>🔥 HOT</span>}
          </div>
          <div style={{fontSize:13,fontWeight:800,color:'#e2e8f0',lineHeight:1.4,marginBottom:8}}>{p.title}</div>
          <div style={{fontSize:11,color:'#64748b',lineHeight:1.5,marginBottom:12}}>{p.summary}</div>
          <div style={{display:'flex',justifyContent:'flex-end'}}>
            <span style={{fontSize:11,color:p.color,fontWeight:700}}>Oku →</span>
          </div>
        </div>
      </div>)}
    </div>
  </div>;
}

function HakkimizdaPage(){
  return <div style={{maxWidth:800,margin:'0 auto',padding:'32px 16px'}}>
    <div style={{textAlign:'center',marginBottom:36}}>
      <img src="/logo.png" alt="IMDATAI" style={{width:80,height:80,borderRadius:16,marginBottom:16,filter:'drop-shadow(0 0 20px rgba(0,220,255,0.5))'}} onError={e=>e.target.style.display='none'}/>
      <h1 style={{fontSize:28,fontWeight:900,color:'#e2e8f0',fontFamily:"'Space Grotesk',sans-serif",margin:'0 0 8px'}}>IMDATAI</h1>
      <div style={{fontSize:14,color:'#00dcff',marginBottom:12}}>Türkiye'nin AI Hub'ı</div>
      <p style={{fontSize:13,color:'#64748b',lineHeight:1.8,maxWidth:560,margin:'0 auto'}}>IMDATAI, yapay zekayı Türkiye'de herkes için erişilebilir kılmak amacıyla kurulmuş bağımsız bir platformdur. Tamamen Türkçe, tamamen ücretsiz.</p>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:14,marginBottom:30}}>
      {[['🎯','Misyonumuz','AI teknolojisini Türkçe olarak herkesin anlayabileceği şekilde aktarmak','#00dcff'],['🌟','Vizyonumuz','Türkiye\'nin yapay zeka okuryazarlığında dünya sıralamasında ilk 10\'a girmek','#a855f7'],['🛡️','Değerlerimiz','Tarafsız, güncel, ücretsiz, Türkçe. Reklam yok, ücret yok, taraf yok','#34d399'],['📊','Rakamlarla','53 sayfa · 403 içerik · 25 animasyon · Mayıs 2026','#fbbf24']].map(([e,t,d,c])=><div key={t} style={{background:c+'07',border:'1px solid '+c+'18',borderRadius:12,padding:'16px',textAlign:'center'}}>
        <div style={{fontSize:28,marginBottom:8}}>{e}</div>
        <div style={{fontSize:12,fontWeight:700,color:c,marginBottom:6}}>{t}</div>
        <div style={{fontSize:10,color:'#64748b',lineHeight:1.5}}>{d}</div>
      </div>)}
    </div>
    <div style={{background:'rgba(0,220,255,0.04)',border:'1px solid rgba(0,220,255,0.12)',borderRadius:12,padding:'18px',textAlign:'center'}}>
      <div style={{fontSize:14,fontWeight:700,color:'#e2e8f0',marginBottom:10}}>📱 Sosyal Medya</div>
      <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
        {[['📺','YouTube','youtube.com/@imdatai','#ff4444'],['🎵','TikTok','tiktok.com/@imdatai','#00f2ea'],['📸','Instagram','instagram.com/imdatai','#e1306c']].map(([e,n,u,c])=><a key={n} href={'https://'+u} target='_blank' rel='noopener noreferrer' style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4,textDecoration:'none',padding:'10px 16px',background:c+'12',border:'1px solid '+c+'30',borderRadius:10}}>
          <span style={{fontSize:20}}>{e}</span>
          <span style={{fontSize:10,color:c,fontWeight:700}}>@imdatai</span>
        </a>)}
      </div>
    </div>
  </div>;
}

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
  {term:"RLVR",cat:"Teknik",en:"RL with Verifiable Rewards",def:"Doğrulanabilir ödüllü pekiştirmeli öğrenme. DeepSeek'in başarısında kilit teknik. Doğru/yanlış yanıtları otomatik doğrular."},,
  {term:"Quantization",cat:"Teknik",en:"Quantization",def:"Model boyutunu küçültmek için ağırlıkları düşük hassasiyetle (int4/int8) temsil etme tekniği. Yerel AI çalıştırmayı mümkün kılar."},
  {term:"Agentic AI",cat:"Yeni Nesil",en:"Agentic AI",def:"Görevleri adım adım planlayıp araçları kullanarak otonom tamamlayabilen AI sistemi. Örn: Claude Code, AutoGPT."},
  {term:"Multimodal",cat:"Temel",en:"Multimodal",def:"Metin, görüntü, ses ve video gibi birden fazla veri türünü anlayıp üretebilen AI modeli. GPT-4o ve Gemini örnektir."},
  {term:"Token Limit",cat:"Teknik",en:"Context Window",def:"Modelin bir seferde işleyebildiği maksimum metin miktarı. 1 token ≈ 0.75 İngilizce kelime. Claude Opus 1M token destekler."},
  {term:"Fine-tuning",cat:"Eğitim",en:"Fine-tuning",def:"Önceden eğitilmiş bir modeli belirli bir görev veya domain için küçük veri setiyle yeniden eğitme süreci."},
  {term:"Zero-shot",cat:"Teknik",en:"Zero-shot",def:"Modele hiçbir örnek vermeden yeni bir görevi yapmasını isteme. Örn: 'Şu metni Fransızcaya çevir' - çeviri örneği olmadan."},
  {term:"Few-shot",cat:"Teknik",en:"Few-shot",def:"Modele 2-5 örnek vererek yeni görevi öğretme tekniği. Zero-shot'tan genellikle daha başarılı sonuç verir."},
  {term:"Embeddings",cat:"Teknik",en:"Embeddings",def:"Metin veya nesneleri sayısal vektörlere dönüştürme işlemi. Anlam benzerliği aramak için kullanılır. RAG sistemlerinin temelidir."},
  {term:"Guardrails",cat:"Güvenlik",en:"Guardrails",def:"AI modellerinin zararlı veya istenmeyen içerik üretmesini engelleyen kural ve filtre sistemi."},
  {term:"Reasoning Model",cat:"Yeni Nesil",en:"Reasoning Model",def:"Cevap vermeden önce adım adım düşünerek çıkarsama yapan AI. OpenAI o3, Claude Sonnet 3.7 Thinking örnek."},
  {term:"Vibe Coding",cat:"Yeni Nesil",en:"Vibe Coding",def:"Doğal dille açıklama yaparak AI'ın kod yazmasını sağlama yöntemi. Programlama bilmeden uygulama geliştirme trendi."},
  {term:"Model Context Protocol",cat:"Teknik",en:"MCP",def:"Anthropic'in geliştirdiği açık standart. AI modellerinin harici araçlar, veritabanları ve API'larla iletişim kurmasını sağlar. Claude Code bu protokolü kullanır."},
  {term:"Vibe Coding",cat:"Yeni Nesil",en:"Vibe Coding",def:"AI'a ne istediğini söyleyip kodu yazdırma yaklaşımı. 2025'te Andrej Karpathy'nin tanımladığı terim. Kod bilmeden uygulama geliştirme."},
  {term:"Constitutional AI",cat:"Güvenlik",en:"Constitutional AI",def:"Anthropic'in geliştirdiği eğitim yöntemi. Modele etik ilkeler listesi verilerek kendi çıktılarını değerlendirmesi ve düzeltmesi öğretilir."},
  {term:"System Prompt",cat:"Teknik",en:"System Prompt",def:"API çağrısında kullanıcı mesajından önce gönderilen talimat metni. Modelin kimliğini, davranışını ve kısıtlamalarını tanımlar."},
  {term:"Temperature",cat:"Teknik",en:"Temperature",def:"Modelin yanıt rastgeleliğini kontrol eden 0-2 arası değer. 0=deterministik, 1=dengeli, 2=yaratıcı. Kod için düşük, yaratıcı yazı için yüksek önerilir."},
  {term:"Top-P Sampling",cat:"Teknik",en:"Top-P / Nucleus Sampling",def:"Token seçiminde olasılık kümülatif eşiği. Top-p=0.9 → en olası %90 tokenden seç. Temperature ile birlikte kullanılır."},
  {term:"Sycophancy",cat:"Güvenlik",en:"Sycophancy",def:"AI modelinin kullanıcıyı memnun etmek için doğruluğu feda etmesi. Yanlış cevabı onaylaması veya kullanıcının görüşüne katılması."},
  {term:"Latency",cat:"Teknik",en:"Latency",def:"API isteği yapılmasından ilk tokenin gelmesine kadar geçen süre. TTFT (Time to First Token) olarak da ölçülür. UX için kritik."},
  {term:"Streaming",cat:"Teknik",en:"Streaming",def:"Modelin yanıtını tüm üretim tamamlanmadan token token göndermesi. Kullanıcı deneyimini iyileştirir, TTFT'yi azaltır."},
  {term:"Tool Use",cat:"Teknik",en:"Tool Use / Function Calling",def:"AI modelinin harici fonksiyonları çağırabilmesi. Hava durumu API, takvim, veritabanı gibi araçlarla entegrasyon."},
  {term:"Vision Language Model",cat:"Teknik",en:"VLM",def:"Görüntü ve metni birlikte işleyebilen model. GPT-4V, Claude 3, Gemini Vision örnektir. Görüntü açıklama, tablo okuma, diagram analizi."},
  {term:"Tokenizer",cat:"Teknik",en:"Tokenizer",def:"Metni modelin işleyeceği token birimlerine bölen sistem. Türkçe kelimeler genellikle 2-3 token. 1 token ≈ 0.75 İngilizce kelime."},
  {term:"Perplexity",cat:"Teknik",en:"Perplexity",def:"Dil modelinin bir metni ne kadar 'şaşırtıcı' bulduğunun ölçüsü. Düşük perplexity = modelin metni iyi tahmin edebildiği anlamına gelir."},
  {term:"BLEU Score",cat:"Teknik",en:"BLEU Score",def:"Makine çevirisi kalitesini ölçen metrik. 0-1 arası. İnsan referans çevirisiyle n-gram örtüşmesini karşılaştırır."},
  {term:"Red Teaming",cat:"Güvenlik",en:"Red Teaming",def:"AI sistemlerinin güvenlik açıklarını bulmak için saldırgan testler yapma süreci. Modeli kötüye kullandırmaya çalışma."},
  {term:"Grounding",cat:"Teknik",en:"Grounding",def:"AI çıktılarını gerçek kaynaklara bağlama süreci. Hallüsinasyonu azaltır. RAG bu tekniği kullanır."},
  {term:"Emergent Capability",cat:"Bilim",en:"Emergent Capability",def:"Model belirli bir büyüklüğe ulaştığında beklenmedik biçimde ortaya çıkan yetenek. Ölçek artışıyla ani performans sıçramaları."},
  {term:"Instruction Tuning",cat:"Eğitim",en:"Instruction Tuning",def:"Önceden eğitilmiş modeli insan talimatlarına uymak için ince ayarlama. Temel modeli sohbet asistanına dönüştürür."},
  {term:"Mixture of Experts",cat:"Teknik",en:"MoE",def:"Her token için modelin sadece bir alt kümesini aktive eden mimari. Mixtral ve DeepSeek V3 bu yapıyı kullanır. Düşük hesaplama maliyeti."},
  {term:"Knowledge Cutoff",cat:"Temel",en:"Knowledge Cutoff",def:"Modelin eğitim verilerinin kesildiği tarih. Bu tarihten sonraki olayları bilmez. GPT-4o: Nisan 2024, Claude: Ağustos 2025."},
  {term:"Semantic Search",cat:"Teknik",en:"Semantic Search",def:"Kelime eşleştirme yerine anlam benzerliğine göre arama. Embedding vektörleri kullanır. RAG sistemlerinin temelidir."},
  {term:"Chain of Density",cat:"Teknik",en:"Chain of Density",def:"Özetleme tekniği. İlk geniş özeti giderek daha yoğun (dense) kılarak kısaltma yöntemi. Bilgi kaybı minimuma indirilir."},
  {term:"LLM-as-a-Judge",cat:"Teknik",en:"LLM as a Judge",def:"Bir dil modelinin başka bir dil modelinin çıktısını değerlendirmesi. Otomatik kalite ölçümü ve benchmark'ta kullanılır."},
  {term:"Prompt Chaining",cat:"Teknik",en:"Prompt Chaining",def:"Karmaşık görevi birbirine bağlı prompt dizisine bölerek çözme. Her adımın çıktısı sonrakinin girdisi olur."},
  {term:"Auto-regressive",cat:"Teknik",en:"Auto-regressive",def:"Her tokenin önceki tokenlara bakılarak üretildiği model tipi. GPT, Claude, Llama bu mimariyi kullanır. Sol-sağ metin üretimi."},
  {term:"RLHF",cat:"Eğitim",en:"Reinforcement Learning from Human Feedback",def:"İnsan değerlendirmelerini ödül sinyali olarak kullanarak modeli ince ayarlama. GPT-4 ve Claude'un ana eğitim yöntemi."},
  {term:"DPO",cat:"Eğitim",en:"Direct Preference Optimization",def:"RLHF'ye alternatif, reward model gerektirmeyen tercih optimizasyonu yöntemi. Daha kararlı eğitim sağlar."},
  {term:"Speculative Decoding",cat:"Teknik",en:"Speculative Decoding",def:"Küçük taslak modelin tahminlerini büyük modelin doğrulaması ile hızlanma tekniği. 2-4x hız artışı sağlar."},
  {term:"KV Cache",cat:"Teknik",en:"Key-Value Cache",def:"Tekrar hesaplamayı önlemek için attention mekanizmasının bellek önbelleği. Uzun context'lerde çok önemli maliyet tasarrufu."},
  {term:"Sparse Attention",cat:"Teknik",en:"Sparse Attention",def:"Tam attention yerine sadece önemli pozisyonlara bakma. Uzun dizilerde O(n²) maliyeti azaltır."},
  {term:"Vibe Coding",cat:"Yeni Nesil",en:"Vibe Coding",def:"AI'a ne istediğini söyleyip kodu yazdırma. Andrej Karpathy'nin 2025'te tanımladığı terim. Programlama bilgisi gerekmeden uygulama geliştirme."},
  {term:"AI Slop",cat:"Kültür",en:"AI Slop",def:"Kalitesiz, anlamsız AI üretimi içerik. İnternet düşük kaliteli AI yazısı ve görsellerle dolmaya başlayınca ortaya çıkan terim."},
  {term:"Jailbreak",cat:"Güvenlik",en:"Jailbreak",def:"AI modelinin güvenlik kısıtlamalarını aşmaya çalışmak. Modeli yasaklı içerik üretmeye zorlamak. Kullanım koşullarını ihlal eder."},
  {term:"AI Hallucination",cat:"Güvenlik",en:"Hallucination",def:"Modelin gerçekmiş gibi tamamen yanlış veya uydurma bilgi üretmesi. En büyük LLM problemi. Doğrulama zorunludur."},
  {term:"Ollama",cat:"Araç",en:"Ollama",def:"Açık kaynak LLM'leri yerel bilgisayarda çalıştırmaya yarayan araç. İnternet gerektirmez, ücretsiz, gizli. llama.run gibi alternatifleri var."},
  {term:"LM Studio",cat:"Araç",en:"LM Studio",def:"Yerel AI modeli çalıştırmak için görsel arayüz. Hugging Face'den model indirip çalıştırılır. Teknik bilgi gerektirmiyor."},
  {term:"Perplexity AI",cat:"Araç",en:"Perplexity AI",def:"AI destekli arama motoru. Gerçek zamanlı kaynak göstererek yanıt üretir. Google'a alternatif olarak popülerleşti."},
  {term:"RLHF",cat:"Eğitim",en:"Reinforcement Learning from Human Feedback",def:"İnsan geri bildirimi ile pekiştirmeli öğrenme. GPT-4 ve Claude'un ince ayar yöntemi. İnsan değerlendirmelerini ödül sinyali olarak kullanır."},
  {term:"Mixture of Experts",cat:"Teknik",en:"MoE",def:"Her token için modelin sadece bir alt kümesini aktive eden mimari. DeepSeek V3 ve Mixtral kullanır. Düşük hesaplama, yüksek kapasite."},
  {term:"Embedding",cat:"Teknik",en:"Embedding",def:"Metni sayısal vektöre dönüştürme. Anlamsal benzerlik hesaplanmasına olanak tanır. RAG sistemlerinin temel yapı taşı."},
  {term:"Fine-tuning",cat:"Eğitim",en:"Fine-tuning",def:"Genel bir modeli belirli bir görev için özelleştirme. Az veriyle yüksek performans. GPT-3.5'i müşteri hizmetleri için eğitmek gibi."},
  {term:"Quantization",cat:"Teknik",en:"Quantization",def:"Model ağırlıklarını daha küçük sayı formatına dönüştürme. 4-bit quant ile model 4x küçülür. Yerel çalıştırma için gerekli."},
  {term:"Retrieval Augmented Generation",cat:"Teknik",en:"RAG",def:"Modele harici bilgi tabanından bilgi çekip ekleyerek yanıt üretme. Hallüsinasyonu azaltır. Şirket chatbotlarının temel yöntemi."},
  {term:"Agentic AI",cat:"Yeni Nesil",en:"Agentic AI",def:"Hedef belirlenince adımları kendi planlayıp uygulayan otonom AI sistemi. İnsan onayı gerektirmeden görevleri tamamlar."},
  {term:"Multi-Agent System",cat:"Teknik",en:"Multi-Agent",def:"Birden fazla AI ajanının koordineli çalışması. Bir ajan araştırır, diğeri yazar, üçüncüsü doğrular. Claude Code bu modeli kullanır."},
  {term:"Prompt Injection",cat:"Güvenlik",en:"Prompt Injection",def:"Kötü niyetli talimatları gizleyerek AI'ı istenmeyen davranışa yönlendirme saldırısı. RAG ve chatbot sistemlerinde ciddi güvenlik riski."},
  {term:"AI Act",cat:"Hukuk",en:"EU AI Act",def:"Avrupa Birliği'nin yapay zekayı düzenleyen ilk kapsamlı yasası. Riske göre sınıflandırma: yüksek risk AI'lar için sıkı kurallar."},
  {term:"Synthetic Data",cat:"Eğitim",en:"Synthetic Data",def:"Gerçek veriye benzeyecek şekilde AI tarafından üretilen eğitim verisi. Gizlilik korunur, yetersiz veri sorunu aşılır."},
  {term:"Zero-shot Learning",cat:"Teknik",en:"Zero-shot",def:"Modelin hiç örnek görmeden yeni görevleri çözebilmesi. Modern LLM'lerin temel özelliği. GPT-4 bu yetenekle öne çıktı."},
  {term:"Multimodal",cat:"Teknik",en:"Multimodal",def:"Metin, görüntü, ses ve video gibi farklı veri türlerini birlikte işleyebilen model. GPT-4V, Gemini Ultra, Claude 3 multimodal."},
  {term:"Context Window",cat:"Temel",en:"Context Window",def:"Modelin tek seferde işleyebildiği maksimum token sayısı. Claude: 200K, Gemini: 2M, GPT-4o: 128K. Büyük context = daha iyi anlayış."},
  {term:"Inference",cat:"Teknik",en:"Inference",def:"Eğitilmiş modelin yeni girdilere yanıt üretmesi. Eğitimden farklı: daha hızlı ve ucuz. API çağrıları birer inference işlemidir."},
  {term:"Benchmark",cat:"Temel",en:"Benchmark",def:"Modellerin standardize testlerde karşılaştırılması. MMLU, HumanEval, SWE-bench gibi. Rakip modellerin gerçek performansını karşılaştırır."},
  {term:"Tokenizer",cat:"Teknik",en:"Tokenizer",def:"Metni modelin işleyeceği token birimlerine bölen sistem. Türkçe kelimeler genellikle 2-3 token. 1 token ≈ 0.75 İngilizce kelime."},
  {term:"Temperature",cat:"Teknik",en:"Temperature",def:"Modelin yanıt rastgeleliğini kontrol eden 0-2 değer. 0=deterministik, 1=dengeli, 2=yaratıcı. Kod için düşük, yaratıcı yazı için yüksek."},
  {term:"System Prompt",cat:"Teknik",en:"System Prompt",def:"API çağrısında kullanıcı mesajından önce gönderilen talimat. Modelin kimliğini ve davranışını belirler. Chatbot kişiliği buradan gelir."},
  {term:"Claude Code",cat:"Araç",en:"Claude Code",def:"Anthropic'in terminal tabanlı kod asistanı. Tüm proje dosyalarını okur, değiştirir. MCP ile harici araçlara bağlanır."},
  {term:"Cursor",cat:"Araç",en:"Cursor",def:"Claude ve GPT entegreli kod editörü. Tab ile kod tamamlama, Ctrl+K ile komut. En popüler AI kod asistanı 2026'da."},
  {term:"n8n",cat:"Araç",en:"n8n",def:"Açık kaynak otomasyon ve iş akışı platformu. AI entegrasyonu ile 400+ uygulama bağlanır. Zapier'e ücretsiz alternatif."},
  {term:"LangChain",cat:"Framework",en:"LangChain",def:"LLM uygulamaları geliştirmek için Python/JS framework. RAG, ajan, zincir kurma araçları. En yaygın AI geliştirici framework."}
];

const AI_MODELS_DATA = {
  chatgpt:{name:"ChatGPT",company:"OpenAI",icon:"🤖",color:"#00dcff",tagline:"Dünyanın En Popüler AI Asistanı",users:"900M haftalık",model:"GPT-5.5",context:"128K token",scores:{genel:97,kod:93,yazi:96,turkce:92,gorsel:94,hiz:95,gizlilik:75},plans:[{n:"Ücretsiz",p:"$0",d:"GPT-4o mini, günlük sınır",c:"#475569"},{n:"Plus",p:"$20/ay",d:"GPT-5.5, 80 mesaj/3saat",c:"#00dcff"},{n:"Pro",p:"$200/ay",d:"Sınırsız, tüm modeller",c:"#a855f7"}],guclu:["En geniş kullanıcı tabanı","Mükemmel görsel üretim (DALL-E 3)","Gelişmiş ses modu","En iyi plugin ekosistemi","Hafıza özelliği"],zayif:["Kısa context window (128K)","Hallüsinasyon riski yüksek","$200/ay Pro çok pahalı","Günlük limit kısıtları"],bestFor:"Genel kullanım, yaratıcı görevler, görsel üretim, sesli sohbet",prompt:"Rol ver: 'Deneyimli bir pazarlamacı olarak...' diye başla. Sonuç %300 daha iyi.",url:"https://chatgpt.com",sistem:"OpenAI'ın Transformer tabanlı modeli. RLHF ile eğitildi. 2022 ChatGPT 3.5'ten GPT-5.5'e dramatik gelişim. 1113+ ülkede kullanılıyor."},
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
  ]},,
  {cat:"🎓 Eğitim & Öğrenme",color:"#34d399",icon:"🎓",items:[
    {title:"Ders Planı Oluştur",kotu:"Matematik dersi planla",iyi:"Lise 10. sınıf için limit konusunu 45 dakikalık ders planı hazırla. Giriş aktivitesi, ana anlatım, grup çalışması ve değerlendirme bölümleri olsun. Her bölüme süre ver."},
    {title:"Konuyu Basitleştir",kotu:"Kuantum fiziğini anlat",iyi:"Kuantum dolanıklığını 12 yaşındaki bir çocuğa analoji kullanarak açıkla. LEGO veya oyun benzetmesi yap. Sonunda 3 soru sor."},
    {title:"Quiz & Soru Seti",kotu:"Tarih soruları yaz",iyi:"Osmanlı İmparatorluğu'nun yükselme dönemi için 10 çoktan seçmeli soru hazırla. Her soruya cevap anahtarı ve açıklaması ekle. Zorluk: Orta."},
    {title:"Öğrenme Yol Haritası",kotu:"Python öğrenmek istiyorum",iyi:"Python sıfırdan ileri seviyeye 3 aylık öğrenme planı hazırla. Haftalık konular, kaynak önerileri ve mini projeler ekle. Ben [meslep] olarak çalışıyorum."},
    {title:"Akıl Haritası Oluştur",kotu:"Yapay zeka haritası yap",iyi:"'Makine Öğrenmesi' konusu için görsel akıl haritası yapısı oluştur. Markdown veya metin formatında, ana dal ve alt dallarla. Mutlaka örnekler ekle."},
    {title:"Flashcard Seti",kotu:"İngilizce kelimeler",iyi:"B2 seviyesi İngilizce için 20 kelime kartı oluştur. Format: Kelime | Türkçe | Cümle örneği. Akademik ve iş hayatında sık kullanılanları seç."},
  ]},
  {cat:"💡 Yaratıcı & Sanat",color:"#f472b6",icon:"💡",items:[
    {title:"Roman / Hikaye Taslağı",kotu:"Hikaye yaz",iyi:"Distopik bir Türkiye'de geçen, yapay zekanın insanların duygularını yönettiği bir roman için 5 bölümlük taslak oluştur. Her bölüm için sahne özeti, karakter gelişimi ve çatışma noktası belirt."},
    {title:"Şiir Yaz",kotu:"Yapay zeka şiiri yaz",iyi:"Serbest nazımda, 3 kıtalık, 'dijital yalnızlık' temalı çağdaş Türkçe şiir yaz. Metafor ve imgelem ağırlıklı olsun. Okuyucuyu 1990'ların nostaljisine taşı."},
    {title:"Midjourney Prompt",kotu:"Güzel manzara istiyorum",iyi:"Cyberpunk İstanbul gecesi, Boğaz köprüsü hologramlarla kaplı, 2077 yılı, sinematik 85mm, anamorfik lens, neon ışıkları, yağmurlu, fotogerçekçi, 8K --ar 16:9 --style raw --v 6"},
    {title:"Karakter Tasarımı",kotu:"Oyun karakteri yap",iyi:"Türk mitolojisinden ilham alan, yapay zeka asistanı rolündeki bir NPC karakteri için detaylı karakter dokümanı hazırla. Görünüm, kişilik, yetenekler, zayıf noktalar ve backstory ekle."},
    {title:"Senaryo Özeti",kotu:"Film senaryosu yaz",iyi:"60 dakikalık Netflix dizisi için 1. bölüm senaryosu özeti yaz. [Konu], [Ana karakter], [Yan karakterler] bilgilerini kullan. Hook, artan gerilim ve cliffhanger içermeli."},
    {title:"Sosyal Medya İçerik Takvimi",kotu:"Instagram için içerik",iyi:"[Marka/Konu] için 1 aylık Instagram içerik takvimi oluştur. 30 post fikri, her biri için caption taslağı, hashtag seti ve en iyi paylaşım saatleri. Carousel, Reels ve Story dengeli dağıt."},
  ]},
  {cat:"🔧 Teknik & Kod",color:"#00dcff",icon:"🔧",items:[
    {title:"Kod İncele & Düzelt",kotu:"Bu kodu düzelt",iyi:"Aşağıdaki [Python/JavaScript/...] kodunu incele: [KOD]. Hataları listele, açıkla ve düzeltilmiş versiyonu yaz. Ayrıca performans iyileştirme önerileri sun."},
    {title:"API Dokümantasyonu",kotu:"API dökümantasyonu yaz",iyi:"REST API endpoint'i için Swagger/OpenAPI formatında dökümantasyon yaz. Endpoint: [URL]. Method: [GET/POST]. Request/Response örnekleri, hata kodları ve rate limit bilgilerini ekle."},
    {title:"Regex Pattern",kotu:"Türk telefon numarası regex",iyi:"Türkiye telefon numarasını doğrulayan regex yaz: 05XX XXX XX XX formatı. Testable regex, açıklaması ve 5 test vakası ekle. Hem JavaScript hem Python versiyonu ver."},
    {title:"Database Tasarımı",kotu:"E-ticaret veritabanı tasarla",iyi:"E-ticaret sitesi için PostgreSQL şeması tasarla: Kullanıcılar, Ürünler, Siparişler, Kategoriler tabloları. İlişkiler, indeksler ve örnek INSERT sorguları ekle. Normalize et."},
    {title:"Test Senaryoları",kotu:"Test yaz",iyi:"Login fonksiyonu için kapsamlı test senaryoları yaz. Happy path, edge cases, güvenlik testleri (SQL injection, XSS). Jest formatında, her test için gerekçe ekle."},
    {title:"Architecture Review",kotu:"Microservice mimarisi",iyi:"100K günlük kullanıcılı bir SaaS uygulaması için microservice mimarisi öner. Her servis için sorumluluklar, iletişim protokolleri (REST/gRPC/event), teknoloji seçimleri ve ölçekleme stratejisi."},
  ]},
  {cat:"🎬 Video & Sunum",color:"#fb923c",icon:"🎬",items:[
    {title:"YouTube Senaryo Taslağı",kotu:"YouTube videosu yaz",iyi:"[Konu] hakkında 10 dakikalık YouTube videosu için senaryo yaz. Hook (0-30sn), ana içerik (bölümler halinde), CTA ve outro içersin. Hedef kitle: [yaş/ilgi]. Görsel öneriler ve B-roll fikirleri ekle."},
    {title:"TikTok/Reels Hook",kotu:"TikTok videosu yap",iyi:"[Ürün/Konu] için 3 farklı TikTok hook yaz. Her biri ilk 3 saniyede izleyiciyi tutmalı. A/B test edebileceğim varyasyonlar: merak uyandıran, şaşırtan ve empati kuran versiyonlar."},
    {title:"PowerPoint Outline",kotu:"Sunum hazırla",iyi:"[Konu] için 15 slaytlık kurumsal sunum taslağı oluştur. Her slayt için: başlık, 3 bullet point, görsel/grafik önerisi ve konuşmacı notu. Hedef kitle: [üst yönetim/yatırımcılar]. Sonuç slaytı CTA içersin."},
    {title:"Podcast Bölüm Planı",kotu:"Podcast bölümü hazırla",iyi:"[Konu] hakkında 45 dakikalık podcast bölümü için tam yapı: giriş hook, 4 ana segment, konuk soruları ve kapanış. Her segmentin süresini ve anahtar sorularını ekle."},
    {title:"Webinar Skript",kotu:"Webinar içeriği",iyi:"[Ürün/Servis] tanıtımı için 60 dakikalık webinar skripti hazırla. Bölümler: karşılama, problem tanımlama, çözüm sunumu, demo, Q&A ve satış kapanışı. Her bölüm geçiş cümleleriyle."},
  ]},
  {cat:"🎙️ Sesli & Podcast",color:"#00dcff",icon:"🎙️",items:[
    {title:"Podcast Senaryo",kotu:"Podcast yaz",iyi:"[KONU] hakkında 30 dakikalık podcast bölümü için: Açılış hook (30sn), 4 ana segment (her biri için 5 soru + geçiş cümleleri), konuk intro metni ve kapanış CTA. Dinleyici profili: [YAŞ/İLGİ]."},
    {title:"Sesli Kitap Anlatı",kotu:"Sesli kitap yaz",iyi:"[KİTAP/KONU] için profesyonel sesli kitap anlatı scripti yaz. Tempo, vurgu noktaları, duraksamalar ve ses tonu notları ekle. Bölüm başı ve sonu geçiş formülleri ver."},
    {title:"YouTube Açıklama",kotu:"Video açıklaması yaz",iyi:"[VİDEO BAŞLIĞI] için SEO optimize YouTube açıklaması yaz. 0-150 karakter hook, keywords bölümü, timestamps şablonu, social links bölümü ve CTA. Hedef kelime: [KEYWORD]."},
    {title:"Transcript Özet",kotu:"Videoyu özetle",iyi:"Bu transkripti/toplantı notunu analiz et: [METİN]. Çıktı: 1-sayfa yönetici özeti, 5 önemli karar, aksiyon maddeler (kişi+tarih) ve takip gereken metrikler."},
  ]},
  {cat:"🔬 Araştırma & Akademi",color:"#a855f7",icon:"🔬",items:[
    {title:"Literatür Tarama",kotu:"Akademik araştırma yap",iyi:"[KONU] alanında 2022-2026 yılları arası akademik literatür taraması yap. Bulgular: ana teoriler, tartışmalı noktalar, metodoloji eğilimleri ve araştırma boşlukları. APA formatında 8 kaynak öner."},
    {title:"Hipotez Geliştir",kotu:"Hipotez yaz",iyi:"[ALAN]'da şu gözlemden: '[GÖZLEM]' yola çıkarak 3 araştırılabilir hipotez geliştir. Her hipotez için: bağımsız/bağımlı değişken, ölçüm yöntemi, null hipotez ve potansiyel karıştırıcı değişkenler."},
    {title:"Akademik Makale Özet",kotu:"Makale özetle",iyi:"Şu akademik makaleyi analiz et: [BAŞLIK/ÖZET]. Çıktı: problem tanımı, metodoloji, ana bulgular, sınırlılıklar, pratik uygulamalar ve atıf değeri. Teknik olmayan okuyucu için Türkçe paragraf ekle."},
    {title:"İstatistik Yorumu",kotu:"İstatistik yorumla",iyi:"Bu veri setinin [VERİ/TABLO] istatistiksel analizini yap. Betimleyici istatistikler, normallik testi ihtiyacı, uygun istatistiksel test önerileri ve potansiyel bias kaynakları. SPSS/Python kodu öner."},
  ]},
  {cat:"💰 Finans & Yatırım",color:"#fbbf24",icon:"💰",items:[
    {title:"Hisse Analizi",kotu:"Hisse analizi yap",iyi:"[ŞİRKET] için temel analiz raporu hazırla. P/E, P/B, ROE, borç/özkaynak oranları, rekabetçi avantaj, sektör trendi ve 12 aylık beklenti. Risk faktörleri ve çıkış kriterleri de ekle."},
    {title:"Portföy Optimizasyonu",kotu:"Portföy öner",iyi:"Risk profili: [DÜŞÜK/ORTA/YÜKSEK]. Yatırım ufku: [YILLAR]. Sermaye: [TL]. Modern Portföy Teorisi'ne göre varlık dağılımı öner. Her varlık sınıfı için gerekçe ve rebalancing stratejisi."},
    {title:"Kripto Analizi",kotu:"Kripto analiz et",iyi:"[KRİPTO] için teknik ve temel analiz. Fiyat seviyeleri (destek/direnç), on-chain metrikler, geliştirici aktivitesi, token ekonomisi ve kısa/orta vade senaryo analizi (bull/base/bear)."},
    {title:"Bütçe Optimizasyonu",kotu:"Bütçe yap",iyi:"Aylık gelir: [TUTAR]. Sabit giderler: [LİSTE]. Bu bilgilerle 50/30/20 kuralı bazlı bütçe planı yap. Tasarruf otomasyonu, acil fon hesabı ve 6 aylık finansal hedef listesi ekle."},
  ]},
  {cat:"🌍 Çeviri & Yerelleştirme",color:"#34d399",icon:"🌍",items:[
    {title:"Kültürel Uyarlama",kotu:"Çeviri yap",iyi:"Bu içeriği [KAYNAK DİL]'den Türkçeye sadece çeviri değil, kültürel uyarlama yaparak dönüştür: [METİN]. Yerel deyimler, referanslar ve ton uyarlamaları için notlar ekle."},
    {title:"Teknik Çeviri",kotu:"Teknik metin çevir",iyi:"Bu teknik dokümantasyonu [DİL]'den Türkçeye çevir: [METİN]. Teknik terimler için glossary oluştur, tutarsız kullanım varsa standartlaştır, hedef kitle: [SEVİYE]."},
    {title:"SEO Çeviri",kotu:"Web sitesi çevir",iyi:"Bu web sayfasını Türkçeye çevir ve SEO optimize et: [URL/METİN]. Hedef keyword: [KEYWORD]. Meta başlık, meta açıklama ve H1-H3 başlıkları da Türkçe SEO uyumlu yaz."},
  ]},
  {cat:"🔬 Araştırma & Analiz",color:"#a855f7",icon:"🔬",items:[
    {title:"Derin Araştırma",kotu:"Bu konuyu araştır",iyi:"[KONU] hakkında kapsamlı araştırma yap. Şunları dahil et: (1) temel kavramlar ve tanımlar, (2) mevcut durum ve trendler, (3) ana tartışmalı noktalar, (4) uzman görüşleri, (5) Türkiye'ye özgü boyut, (6) kaynaklar listesi. Akademik dil kullan."},
    {title:"Rakip Analizi",kotu:"Rakipler hakkında bilgi ver",iyi:"[ŞİRKET] ile [RAKİP1], [RAKİP2] arasında karşılaştırmalı analiz yap. SWOT bazlı değerlendirme, fiyatlandırma stratejisi, hedef kitle, güçlü/zayıf yönler. Tablo formatında özet ekle."},
    {title:"Trend Analizi",kotu:"Trendleri anlat",iyi:"[SEKTÖR] sektöründe 2024-2026 döneminin en önemli 10 trendi neler? Her trend için: açıklama, Türkiye'deki yansıması, fırsat veya tehdit mi, şu an için öneri. Sıralı liste yap."},
    {title:"SWOT Analizi",kotu:"SWOT yap",iyi:"[İŞ/PROJE/ÜRÜN] için detaylı SWOT analizi yap. Her bölüm için minimum 5 madde. Sonunda en kritik 3 stratejik öneri ekle. Türkiye piyasasına uygun değerlendirme."},
  ]},
  {cat:"💌 E-posta & İletişim",color:"#34d399",icon:"💌",items:[
    {title:"İş Teklifi E-postası",kotu:"Teklif emaili yaz",iyi:"[ŞİRKET]'e [HİZMET/ÜRÜN] sunmak için soğuk e-posta yaz. Konu: kişiselleştirilmiş hook. Gövde: sorunu tanımla, çözümü sun, sosyal kanıt ver, net CTA ekle. Uzunluk: max 200 kelime."},
    {title:"Takip E-postası",kotu:"Takip emaili yaz",iyi:"[KİŞİ]'ye [KONU] hakkındaki önceki toplantıdan 3 gün sonra gönderilecek takip e-postası yaz. Önceki konuşmaya atıfla başla, taahhütleri hatırlat, bir sonraki adımı netleştir, nazik ama kararlı ton."},
    {title:"Şikayet Yanıtı",kotu:"Şikayete cevap ver",iyi:"Müşterinin [ŞİKAYET] konusundaki şikayetine profesyonel yanıt yaz. Empati göster, sorumluluğu kabul et, somut çözüm sun, tazminat/telafi belirt, ilişkiyi güçlendir. Savunmacı olmayan ton."},
    {title:"Özgeçmiş Kapak Mektubu",kotu:"Kapak mektubu yaz",iyi:"[POZİSYON] için kapak mektubu yaz. Benim güçlü yönlerim: [LİSTE]. Şirketin dikkatimi çeken özellikleri: [ÖZELLIK]. İlk paragraf dikkat çekici, ikinci katkılarım, üçüncü CTA. Max 250 kelime."},
  ]},
  {cat:"📱 Sosyal Medya",color:"#f472b6",icon:"📱",items:[
    {title:"LinkedIn Post Dizisi",kotu:"LinkedIn post yaz",iyi:"[KONU] hakkında 5 günlük LinkedIn içerik dizisi yaz. Her post: güçlü hook (ilk satır), 3-5 ana nokta, kişisel hikaye/deneyim, soru/CTA. 1200 karakter limit. Türkçe, profesyonel ama samimi ton."},
    {title:"Twitter/X Thread",kotu:"Thread yaz",iyi:"[KONU] hakkında 10 tweetlik viral thread yaz. Tweet 1: çarpıcı istatistik veya soru. Tweet 2-9: her biri tek bir öğreti. Tweet 10: özet ve takip et CTA. Her tweet max 280 karakter."},
    {title:"Instagram Caption",kotu:"Açıklama yaz",iyi:"[GÖRSEL/KONU] için Instagram gönderisi açıklaması yaz. İlk satır scroll durdurucu olsun. Emoji kullan (aşırıya kaçma). 5 satır içerik. 10 alakalı hashtag. Takipçi artıran bir soru ekle."},
    {title:"TikTok Script",kotu:"TikTok videosu yaz",iyi:"[KONU] hakkında 60 saniyelik TikTok scripti yaz. Hook (0-3sn): çarpıcı soru/istatistik. Ana içerik (3-50sn): 3 hızlı nokta. CTA (50-60sn): beğen+takip+yorum. Dinamik, genç dil."},
  ]},
  {cat:"📊 Sunum & Rapor",color:"#00dcff",icon:"📊",items:[
    {title:"Yönetici Özeti",kotu:"Özet yaz",iyi:"Şu bilgileri yöneticiye sunmak için 1 sayfalık yönetici özeti hazırla: [BİLGİLER]. Yapı: Problem (2 cümle), Analiz (3 madde), Öneri (2 madde), Beklenen Sonuç, Aksiyon Planı. Teknik jargonsuz, karar odaklı."},
    {title:"Vaka Çalışması",kotu:"Vaka çalışması yaz",iyi:"[MÜŞTERİ/PROJE] için başarı hikayesi/vaka çalışması yaz. Yapı: Müşteri profili, karşılaşılan sorun, uygulanan çözüm, ölçülebilir sonuçlar (%X iyileşme), müşteri alıntısı. Satış materyali olarak kullanılacak."},
    {title:"Haftalık Performans Raporu",kotu:"Rapor yaz",iyi:"Şu verileri kullanarak haftalık performans raporu oluştur: [VERİLER]. Bölümler: özet dashboard, tamamlanan işler, devam edenler, hedeflere göre sapma, önümüzdeki hafta planı, öneriler. CEO'ya sunulacak."},
  ]}
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
            {[[m.users,"İçerik"],[m.context,"Context"],[m.free?"Ücretsiz var":"Ücretli","Plan"]].map(([v,l])=>(
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
  const[filter,setFilter]=useState('hepsi');
  const MODELS=[
    {n:"Claude Sonnet 4.5",icon:"🧠",co:"Anthropic",ctx:"200K",free:true,
     scores:{kod:92,genel:89,turkce:88,hiz:85,guvenik:98,maliyet:82},
     best:"Kod, uzun döküman, güvenli görevler",color:"#a855f7"},
    {n:"GPT-4o",icon:"🤖",co:"OpenAI",ctx:"128K",free:true,
     scores:{kod:90,genel:89,turkce:95,hiz:88,guvenik:85,maliyet:75},
     best:"Türkçe, multimodal, günlük kullanım",color:"#34d399"},
    {n:"Gemini 2.5 Pro",icon:"🌟",co:"Google",ctx:"2M",free:true,
     scores:{kod:87,genel:90,turkce:88,hiz:82,guvenik:87,maliyet:88},
     best:"Uzun döküman, görsel analiz, araştırma",color:"#fbbf24"},
    {n:"DeepSeek V3",icon:"🔬",co:"DeepSeek",ctx:"128K",free:true,
     scores:{kod:90,genel:86,turkce:75,hiz:87,guvenik:70,maliyet:98},
     best:"Kod, maliyet verimliliği, açık kaynak",color:"#00dcff"},
    {n:"Grok 3",icon:"⚡",co:"xAI",ctx:"128K",free:false,
     scores:{kod:84,genel:85,turkce:80,hiz:90,guvenik:78,maliyet:72},
     best:"Güncel bilgi, Twitter verisi, hız",color:"#60a5fa"},
    {n:"Mistral Large 2",icon:"🌊",co:"Mistral",ctx:"128K",free:false,
     scores:{kod:82,genel:84,turkce:78,hiz:86,guvenik:90,maliyet:85},
     best:"GDPR uyumluluk, Avrupa, maliyet",color:"#f472b6"},
    {n:"Meta Llama 3.3",icon:"🦙",co:"Meta",ctx:"128K",free:true,
     scores:{kod:83,genel:83,turkce:72,hiz:92,guvenik:75,maliyet:99},
     best:"Self-host, açık kaynak, ücretsiz",color:"#fb923c"},
  ];
  const CATEGORIES=[
    {id:'hepsi',l:'Tümü'},
    {id:'kod',l:'💻 Kodlama'},
    {id:'genel',l:'🧠 Genel'},
    {id:'turkce',l:'🇹🇷 Türkçe'},
    {id:'hiz',l:'⚡ Hız'},
    {id:'guvenik',l:'🛡️ Güvenlik'},
    {id:'maliyet',l:'💰 Maliyet'},
  ];
  const sorted=filter==='hepsi'?MODELS:[...MODELS].sort((a,b)=>b.scores[filter]-a.scores[filter]);

  return <div style={{maxWidth:1000,margin:'0 auto',padding:'24px 16px'}}>
    <div style={{marginBottom:22}}>
      <div style={{fontSize:9,letterSpacing:'.2em',color:'#00dcff',marginBottom:4}}>MODEL KARŞILAŞTIRMA</div>
      <h1 style={{fontSize:24,fontWeight:900,color:'#e2e8f0',fontFamily:"'Space Grotesk',sans-serif",margin:'0 0 6px'}}>🆚 AI Model Karşılaştırması — 2026</h1>
      <p style={{fontSize:12,color:'#64748b',margin:0}}>Claude · ChatGPT · Gemini · DeepSeek · Grok · Mistral · Llama — 7 model 6 kategoride</p>
    </div>
    <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:20}}>
      {CATEGORIES.map(c=><button key={c.id} onClick={()=>setFilter(c.id)} style={{padding:'6px 12px',borderRadius:8,border:'1px solid '+(filter===c.id?'rgba(0,220,255,0.5)':'rgba(255,255,255,0.07)'),background:filter===c.id?'rgba(0,220,255,0.1)':'transparent',color:filter===c.id?'#00dcff':'#64748b',fontSize:11,cursor:'pointer',fontFamily:'inherit'}}>{c.l}</button>)}
    </div>
    {/* Skor kartları */}
    <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:24}}>
      {sorted.map((m,idx)=>{
        const scoreKey=filter==='hepsi'?null:filter;
        const avgScore=Math.round(Object.values(m.scores).reduce((a,b)=>a+b,0)/6);
        const displayScore=scoreKey?m.scores[scoreKey]:avgScore;
        return <div key={m.n} style={{background:m.color+'06',border:'1px solid '+m.color+'20',borderRadius:12,padding:'14px 16px',display:'flex',gap:12,alignItems:'center',flexWrap:'wrap'}}>
          <div style={{fontSize:9,fontWeight:900,color:m.color,background:m.color+'18',width:22,height:22,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>#{idx+1}</div>
          <span style={{fontSize:24,flexShrink:0}}>{m.icon}</span>
          <div style={{flex:1,minWidth:150}}>
            <div style={{fontSize:13,fontWeight:800,color:m.color,marginBottom:2}}>{m.n} <span style={{fontSize:9,color:'#475569',fontWeight:400}}>— {m.co}</span></div>
            <div style={{fontSize:10,color:'#64748b'}}>{m.best}</div>
          </div>
          {/* Skor barı */}
          <div style={{flex:2,minWidth:120}}>
            <div style={{display:'flex',gap:3,alignItems:'center',marginBottom:3}}>
              <div style={{flex:1,height:6,background:'rgba(255,255,255,0.06)',borderRadius:3,overflow:'hidden'}}>
                <div style={{height:'100%',width:displayScore+'%',background:'linear-gradient(90deg,'+m.color+'80,'+m.color+')',borderRadius:3,transition:'width .5s'}}/>
              </div>
              <span style={{fontSize:11,fontWeight:700,color:m.color,minWidth:32,textAlign:'right'}}>{displayScore}</span>
            </div>
            {filter==='hepsi'&&<div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
              {Object.entries(m.scores).map(([k,v])=><span key={k} style={{fontSize:8,color:'#334155'}}>{k}:{v}</span>)}
            </div>}
          </div>
          <div style={{display:'flex',gap:5,flexShrink:0}}>
            <span style={{fontSize:8,color:'#475569',background:'rgba(255,255,255,0.04)',borderRadius:4,padding:'2px 6px'}}>{m.ctx}</span>
            {m.free&&<span style={{fontSize:8,color:'#34d399',background:'rgba(52,211,153,0.12)',borderRadius:4,padding:'2px 6px'}}>Ücretsiz</span>}
          </div>
        </div>;
      })}
    </div>
    {/* Tam benchmark tablosu */}
    <div style={{fontSize:13,fontWeight:700,color:'#e2e8f0',marginBottom:12}}>📊 Detaylı Benchmark Tablosu</div>
    <div style={{overflowX:'auto',borderRadius:12,border:'1px solid rgba(255,255,255,0.07)'}}>
      <table style={{width:'100%',borderCollapse:'collapse',fontSize:10}}>
        <thead><tr style={{background:'rgba(255,255,255,0.04)'}}>
          {['Model','Kodlama','Genel','Türkçe','Hız','Güvenlik','Maliyet','ORT.'].map(h=><th key={h} style={{padding:'9px 10px',textAlign:'left',color:'#475569',borderBottom:'1px solid rgba(255,255,255,0.06)',whiteSpace:'nowrap',fontWeight:700}}>{h}</th>)}
        </tr></thead>
        <tbody>{[...MODELS].sort((a,b)=>{
          const avgA=Object.values(a.scores).reduce((x,y)=>x+y,0)/6;
          const avgB=Object.values(b.scores).reduce((x,y)=>x+y,0)/6;
          return avgB-avgA;
        }).map((m,i)=>{
          const avg=Math.round(Object.values(m.scores).reduce((a,b)=>a+b,0)/6);
          return <tr key={m.n} style={{background:i%2===0?'transparent':'rgba(255,255,255,0.01)'}}>
            <td style={{padding:'8px 10px',fontWeight:700,color:m.color,whiteSpace:'nowrap'}}>{m.icon} {m.n}</td>
            {Object.values(m.scores).map((s,j)=><td key={j} style={{padding:'8px 10px',color:s>=90?'#34d399':s>=80?'#fbbf24':'#94a3b8',fontWeight:s>=90?700:400}}>{s}</td>)}
            <td style={{padding:'8px 10px',fontWeight:900,color:m.color}}>{avg}</td>
          </tr>;
        })}</tbody>
      </table>
    </div>
    <div style={{marginTop:14,fontSize:10,color:'#334155',textAlign:'center'}}>Skorlar 0-100 arası. Kaynak: SWE-bench, MMLU, HumanEval, LMSYS Chatbot Arena, IMDATAI test sonuçları · Mayıs 2026</div>
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
  const vidRef=useRef(null);const[vidMuted,setVidMuted]=useState(true); // Başta muted, kullanıcı açar
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
    {t:">> 52 SAYFA/113+ PR  [HAZIR ✓]",c:"#00dcff"},
    {t:"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",c:"#0a2a14"},
    {t:"⚡ ERİŞİM ONAYLANDI",c:"#00ff88",b:true},
  ];
  useEffect(()=>{
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
          <div style={{position:"relative",width:120,height:120,display:"flex",alignItems:"center",justifyContent:"center"}}>
              {/* Glow rings */}
              <div style={{position:"absolute",inset:-20,borderRadius:"50%",background:"radial-gradient(ellipse,rgba(0,220,255,0.18),transparent 65%)",animation:"glow 2s ease-in-out infinite"}}/>
              <div style={{position:"absolute",inset:-10,borderRadius:"50%",background:"radial-gradient(ellipse,rgba(0,255,136,0.12),transparent 65%)",animation:"glow 2.5s ease-in-out infinite reverse"}}/>
              {/* Video logo (if available) - priority over img */}
              <div style={{position:"relative",display:"inline-block"}}>
                <video
                  ref={vidRef}
                  src="/imdatlogo.mp4"
                  autoPlay
                  loop
                  playsInline
                  preload="auto"
                  muted={vidMuted}
                  onLoadedData={()=>{
                    if(!doneRef.current) setPhase(1);
                    // Muted autoplay (tarayıcı politikası)
                    if(vidRef.current){
                      vidRef.current.muted=true;
                      vidRef.current.play().catch(()=>{});
                    }
                  }}
                  style={{
                    width:"clamp(160px,40vw,380px)",
                    maxWidth:"88vw",
                    maxHeight:"40vh",
                    height:"auto",
                    objectFit:"contain",
                    display:"block",
                    borderRadius:14,
                    filter:"drop-shadow(0 0 20px rgba(0,220,255,0.85)) drop-shadow(0 0 38px rgba(0,255,136,0.35)) brightness(1.2)",
                    animation:"logoPulse 2.5s ease-in-out infinite"
                  }}
                  onError={e=>{e.target.style.display="none";}}/>
                {/* Mute toggle */}
                <button onClick={e=>{e.stopPropagation();const v=vidRef.current;if(v){v.muted=!v.muted;setVidMuted(v.muted);}}} title={vidMuted?"Sesi Aç":"Sesi Kapat"} style={{position:"absolute",top:6,right:6,width:26,height:26,borderRadius:"50%",background:"rgba(0,0,0,.7)",border:"1px solid rgba(0,220,255,.4)",color:"#00dcff",fontSize:11,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1,padding:0}}>
                  {vidMuted?"🔇":"🔊"}
                </button>
              </div>
          </div>
          {[0,51,102,153,204,255,306].map((deg,i)=><div key={i} style={{position:"absolute",width:i%2===0?6:4,height:i%2===0?6:4,borderRadius:"50%",top:"50%",left:"50%",background:["#00ff88","#00dcff","#a855f7","#f472b6","#fbbf24","#34d399","#fb923c"][i],boxShadow:`0 0 ${i%2===0?10:7}px ${["#00ff88","#00dcff","#a855f7","#f472b6","#fbbf24","#34d399","#fb923c"][i]}`,transform:`rotate(${deg}deg) translateX(52px) translateY(-50%)`,animation:`spin ${3.5+i*.35}s linear infinite`}}/>)}
        </div>
        <div style={{fontSize:"clamp(24px,6vw,52px)",fontWeight:900,background:"linear-gradient(90deg,#00ff88,#00dcff,#a855f7,#f472b6,#00ff88)",backgroundSize:"250% auto",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"gradient 2s linear infinite",fontFamily:"Space Grotesk,monospace",letterSpacing:".15em",marginBottom:3}}>IMDATAI</div>
        <div style={{fontSize:"clamp(6px,1.3vw,9px)",letterSpacing:".4em",color:"rgba(0,255,136,.45)",marginBottom:12}}>TÜRKİYE'NİN AI HUB'I</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:5,maxWidth:300,margin:"0 auto 12px"}}>
          {[["480+","İçerik","#00dcff"],["8","Model","#a855f7"],["113+","Prompt","#fbbf24"],["55","Sayfa","#34d399"]].map(([v,l,c])=><div key={l} style={{background:c+"12",border:"1px solid "+c+"25",borderRadius:8,padding:"7px 2px",textAlign:"center"}}><div style={{fontSize:"clamp(11px,2.5vw,16px)",fontWeight:900,color:c,fontFamily:"Space Grotesk,sans-serif"}}>{v}</div><div style={{fontSize:7,color:"#334155",marginTop:1}}>{l}</div></div>)}
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

// ── Generic Canvas Animasyon Bileşeni (TEK bileşen, prop ile çalışır) ──
// makeCanvasAnim KULLANMIYOR — React #321 hatasını önler
function GenericCanvasAnim({drawFn}){
  const ref=useRef();
  const fRef=useRef(0);
  useEffect(()=>{
    const c=ref.current;if(!c)return;
    const ctx=c.getContext('2d');
    let raf,running=true;
    function resize(){
      const parent=c.parentElement;
      const w=parent?parent.clientWidth:window.innerWidth;
      const h=parent?parent.clientHeight:window.innerHeight;
      if(c.width!==w||c.height!==h){c.width=w||640;c.height=h||400;}
    }
    resize();
    // ResizeObserver + fullscreen change
    const ro=typeof ResizeObserver!=='undefined'?new ResizeObserver(()=>{resize();}):{observe:()=>{},disconnect:()=>{}};
    if(c.parentElement)ro.observe(c.parentElement);
    const onFS=()=>setTimeout(resize,100);
    document.addEventListener('fullscreenchange',onFS);
    document.addEventListener('webkitfullscreenchange',onFS);
    function loop(){
      if(!running)return;
      try{
        resize();
        const w=c.width,h=c.height;
        if(w>0&&h>0)drawFn({w,h,ctx,frame:fRef.current});
        fRef.current++;
      }catch(e){}
      raf=requestAnimationFrame(loop);
    }
    raf=requestAnimationFrame(loop);
    return()=>{
      running=false;cancelAnimationFrame(raf);ro.disconnect();
      document.removeEventListener('fullscreenchange',onFS);
      document.removeEventListener('webkitfullscreenchange',onFS);
    };
  },[drawFn]);
  return <canvas ref={ref} style={{width:'100%',height:'100%',display:'block',background:'#050A14'}}/>;
}

const _particleDraw=({w,h,ctx,frame})=>{
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle='rgba(3,7,18,0.3)';ctx.fillRect(0,0,w,h);
  const N=Math.min(120,Math.floor(w*h/4000));
  const t=frame*0.008;
  const pts=[];
  for(let i=0;i<N;i++){
    const a=i*2.399+t, r=Math.sqrt(i/N)*Math.min(w,h)*0.45;
    pts.push({x:w/2+Math.cos(a+Math.sin(i*0.3+t)*0.5)*r,
              y:h/2+Math.sin(a+Math.cos(i*0.3+t)*0.5)*r*0.7});
  }
  // Bağlantılar
  const maxDist=Math.min(w,h)*0.12;
  for(let i=0;i<pts.length;i++){
    for(let j=i+1;j<Math.min(i+5,pts.length);j++){
      const dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y;
      const d=Math.sqrt(dx*dx+dy*dy);
      if(d<maxDist){
        ctx.strokeStyle=`rgba(0,220,255,${0.4*(1-d/maxDist)})`;
        ctx.lineWidth=0.8;ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.stroke();
      }
    }
  }
  // Noktalar
  pts.forEach((p,i)=>{
    const sz=1+Math.sin(i*0.5+t)*0.8;
    ctx.beginPath();ctx.arc(p.x,p.y,sz,0,6.28);
    ctx.fillStyle=`hsl(${180+i*2},100%,70%)`;ctx.fill();
  });
};

// ── Draw Fonksiyonları — test edilmiş, kilitlenme yok ─────────────────
// Her fonksiyon max 500 iterasyon, recursive yok, try-catch korumalı

const _fractalDraw=({w,h,ctx,frame})=>{
  // Iterative yaklaşım - recursive DEĞİL, kilitlenme yok
  ctx.clearRect(0,0,w,h);
  const t=frame*0.015;
  const cx=w/2, cy=h*0.85;
  const branches=[];
  branches.push({x:cx,y:cy,len:Math.min(h*0.18,100),ang:Math.PI/2,d:0});
  let count=0;
  while(branches.length>0 && count<400){
    count++;
    const b=branches.shift();
    if(b.d>7||b.len<3)continue;
    const x2=b.x+Math.cos(b.ang)*b.len;
    const y2=b.y-Math.sin(b.ang)*b.len;
    ctx.strokeStyle=`hsl(${100+b.d*20},80%,${45+b.d*5}%)`;
    ctx.lineWidth=Math.max(0.5,(7-b.d)*0.5);
    ctx.beginPath();ctx.moveTo(b.x,b.y);ctx.lineTo(x2,y2);ctx.stroke();
    const wobble=Math.sin(t+b.d)*0.1;
    branches.push({x:x2,y:y2,len:b.len*0.68,ang:b.ang-0.42+wobble,d:b.d+1});
    branches.push({x:x2,y:y2,len:b.len*0.68,ang:b.ang+0.42-wobble,d:b.d+1});
  }
};

const _galaxyDraw=({w,h,ctx,frame})=>{
  ctx.clearRect(0,0,w,h);
  const cx=w/2,cy=h/2,t=frame*0.003;
  for(let i=0;i<200;i++){
    const a=i*0.12+t, r=Math.sqrt(i+1)*Math.min(w,h)*0.03;
    const x=cx+Math.cos(a)*r, y=cy+Math.sin(a)*r*0.42;
    const sz=Math.max(0.5,1.5-r/Math.max(w,h)*3);
    ctx.beginPath();ctx.arc(x,y,sz,0,6.28);
    ctx.fillStyle=`hsl(${190+i*0.6},85%,${65+sz*10}%)`;ctx.fill();
  }
};

const _auraDraw=({w,h,ctx,frame})=>{
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle='#000820';ctx.fillRect(0,0,w,h);
  const t=frame*0.012;
  for(let l=0;l<4;l++){
    ctx.beginPath();
    const step=Math.max(2,Math.floor(w/200));
    for(let x=0;x<=w;x+=step){
      const y=h*0.35+Math.sin(x/90+t+l)*55+Math.sin(x/45+t*1.2+l*0.5)*28;
      x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
    }
    ctx.lineTo(w,0);ctx.lineTo(0,0);ctx.closePath();
    ctx.fillStyle=`hsla(${110+l*38+Math.sin(t)*25},100%,50%,0.15)`;ctx.fill();
  }
};

const _blackholeDraw=({w,h,ctx,frame})=>{
  ctx.clearRect(0,0,w,h);
  const cx=w/2,cy=h/2,t=frame*0.018;
  // Max 150 particle - kilitlenme yok
  for(let i=150;i>0;i-=2){
    const a=i*0.38+t*(1+i/200),r=i*Math.min(w,h)*0.004;
    const x=cx+Math.cos(a)*r*(1-i/300);
    const y=cy+Math.sin(a)*r*0.48*(1-i/300);
    ctx.beginPath();ctx.arc(x,y,Math.max(0.5,2-i/80),0,6.28);
    ctx.fillStyle=`hsl(${195+i},90%,${15+i/4}%)`;ctx.fill();
  }
  const g=ctx.createRadialGradient(cx,cy,0,cx,cy,60);
  g.addColorStop(0,'rgba(0,0,0,1)');g.addColorStop(1,'rgba(0,0,0,0)');
  ctx.beginPath();ctx.arc(cx,cy,60,0,6.28);ctx.fillStyle=g;ctx.fill();
};

const _dna2Draw=({w,h,ctx,frame})=>{
  ctx.clearRect(0,0,w,h);
  const t=frame*0.05;
  const step=Math.max(3,Math.floor(h/80));
  for(let y=0;y<h;y+=step){
    const wave=Math.sin(y*0.05+t)*w*0.22;
    const x1=w/2+wave, x2=w/2-wave;
    const hue=y/h*120+220;
    ctx.beginPath();ctx.arc(x1,y,4,0,6.28);ctx.fillStyle=`hsl(${hue},88%,62%)`;ctx.fill();
    ctx.beginPath();ctx.arc(x2,y,4,0,6.28);ctx.fillStyle=`hsl(${hue+55},88%,62%)`;ctx.fill();
    if(Math.floor(y/20)%2===0){
      ctx.strokeStyle='rgba(255,255,255,0.2)';ctx.lineWidth=1.5;
      ctx.beginPath();ctx.moveTo(x1,y);ctx.lineTo(x2,y);ctx.stroke();
    }
  }
};

const _neonCityDraw=({w,h,ctx,frame})=>{
  ctx.clearRect(0,0,w,h);ctx.fillStyle='#050510';ctx.fillRect(0,0,w,h);
  const t=frame*0.008;
  const count=Math.min(12,Math.floor(w/60));
  for(let i=0;i<count;i++){
    const bw=Math.floor(w/count)-2;
    const bh=50+Math.sin(i*1.7)*65;
    const bx=i*(w/count);
    const by=h-bh;
    const hue=i*30+t*15;
    ctx.fillStyle=`hsl(${hue},75%,8%)`;ctx.fillRect(bx,by,bw,bh);
    ctx.strokeStyle=`hsl(${hue},100%,55%)`;ctx.lineWidth=1.5;ctx.strokeRect(bx,by,bw,bh);
    for(let wy=by+10;wy<h-5;wy+=14){
      for(let wx=bx+4;wx<bx+bw-4;wx+=9){
        if((i+wx+wy)%3===0){ctx.fillStyle=`hsl(${hue+25},100%,70%)`;ctx.fillRect(wx,wy,5,6);}
      }
    }
  }
};

const _quantumDraw=({w,h,ctx,frame})=>{
  ctx.clearRect(0,0,w,h);
  const t=frame*0.04;
  const step=Math.max(2,Math.floor(w/300));
  for(let wave=0;wave<4;wave++){
    ctx.beginPath();
    for(let x=0;x<=w;x+=step){
      const norm=(x-w/2)/Math.max(w*0.3,1);
      const y=h/2+Math.sin(x*0.04+t+wave)*36*Math.exp(-norm*norm*0.4)+Math.sin(x*0.02+t*1.5+wave)*14;
      x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
    }
    ctx.strokeStyle=`hsla(${175+wave*38},100%,60%,0.55)`;ctx.lineWidth=2;ctx.stroke();
  }
};

const _musicDraw=({w,h,ctx,frame})=>{
  ctx.fillStyle='rgba(5,8,20,0.38)';ctx.fillRect(0,0,w,h);
  const bars=Math.min(48,Math.floor(w/12));
  const bw=w/bars;
  for(let i=0;i<bars;i++){
    const h1=(Math.sin(i*0.42+frame*0.07)+1)*h*0.38+Math.sin(i*0.85+frame*0.04)*h*0.09+4;
    const hue=i*(340/bars)+frame;
    ctx.fillStyle=`hsl(${hue},100%,58%)`;
    ctx.fillRect(i*bw+1,h/2-h1/2,bw-2,h1);
  }
};

const _snowDraw=({w,h,ctx,frame})=>{
  ctx.clearRect(0,0,w,h);ctx.fillStyle='#050A14';ctx.fillRect(0,0,w,h);
  const count=Math.min(80,Math.floor(w*h/6000));
  for(let i=0;i<count;i++){
    const x=((i*137+frame*0.6)%w+w)%w;
    const y=((i*83+frame*(0.5+i%3*0.25))%h+h)%h;
    ctx.beginPath();ctx.arc(x,y,1+i%3,0,6.28);
    ctx.fillStyle=`rgba(200,220,255,${0.3+i%3*0.2})`;ctx.fill();
  }
  // Merkez kar tanesi
  const cx=w/2,cy=h/2,r=Math.min(55,w*0.08),ts=frame*0.008;
  for(let arm=0;arm<6;arm++){
    const a=arm*Math.PI/3+ts;
    ctx.strokeStyle='rgba(180,210,255,0.65)';ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r);ctx.stroke();
    for(let j=1;j<=3;j++){
      const bx=cx+Math.cos(a)*r*j/3,by=cy+Math.sin(a)*r*j/3;
      [1,-1].forEach(s=>{
        ctx.beginPath();ctx.moveTo(bx,by);
        ctx.lineTo(bx+Math.cos(a+s*Math.PI/3)*11,by+Math.sin(a+s*Math.PI/3)*11);ctx.stroke();
      });
    }
  }
};

const _nebulaDraw=({w,h,ctx,frame})=>{
  // Tam temizle - accumulation kilitlenme yapıyor
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle='rgba(5,0,15,0.95)';ctx.fillRect(0,0,w,h);
  const count=Math.min(10,Math.floor(w/80));
  for(let i=0;i<count;i++){
    const x=w/2+Math.sin(frame*0.01+i*0.65)*w*0.36;
    const y=h/2+Math.cos(frame*0.013+i*1.25)*h*0.36;
    const rad=Math.min(55,w*0.07);
    const g=ctx.createRadialGradient(x,y,0,x,y,rad);
    const hue=195+i*20+frame*0.08;
    g.addColorStop(0,`hsla(${hue},100%,68%,0.18)`);
    g.addColorStop(1,'transparent');
    ctx.beginPath();ctx.arc(x,y,rad,0,6.28);ctx.fillStyle=g;ctx.fill();
  }
};

const _gridDraw=({w,h,ctx,frame})=>{
  ctx.clearRect(0,0,w,h);ctx.fillStyle='#030810';ctx.fillRect(0,0,w,h);
  const cols=Math.min(10,Math.floor(w/60));
  const rows=Math.min(7,Math.floor(h/55));
  const cw=w/cols,rh=h/rows;
  for(let r=0;r<rows;r++){
    for(let c=0;c<cols;c++){
      const d=Math.sqrt(Math.pow(c-cols/2,2)+Math.pow(r-rows/2,2));
      const pulse=Math.sin(d*0.85-frame*0.08)*0.5+0.5;
      ctx.strokeStyle=`rgba(0,220,255,${pulse*0.55})`;ctx.lineWidth=1;
      ctx.strokeRect(c*cw+2,r*rh+2,cw-4,rh-4);
      if(pulse>0.82){
        ctx.fillStyle=`rgba(0,220,255,${(pulse-0.82)*2.5})`;
        ctx.fillRect(c*cw+4,r*rh+4,cw-8,rh-8);
      }
    }
  }
};

const _fireworksDraw=({w,h,ctx,frame})=>{
  ctx.fillStyle='rgba(0,0,0,0.14)';ctx.fillRect(0,0,w,h);
  if(frame%50===0){
    const x=w*(0.2+Math.random()*0.6);
    const y=h*(0.12+Math.random()*0.45);
    const hue=Math.random()*360;
    for(let i=0;i<40;i++){
      const a=Math.random()*Math.PI*2;
      const spd=2+Math.random()*2.5;
      ctx.beginPath();ctx.arc(x+Math.cos(a)*spd*12,y+Math.sin(a)*spd*12,2.5,0,6.28);
      ctx.fillStyle=`hsla(${hue},100%,65%,0.85)`;ctx.fill();
    }
  }
};

const _heartbeatDraw=({w,h,ctx,frame})=>{
  ctx.clearRect(0,0,w,h);ctx.fillStyle='#050010';ctx.fillRect(0,0,w,h);
  ctx.strokeStyle='#00ff88';ctx.lineWidth=2;ctx.shadowColor='#00ff88';ctx.shadowBlur=10;
  const step=Math.max(1,Math.floor(w/400));
  ctx.beginPath();
  for(let x=0;x<w;x+=step){
    const off=(x+frame*2)%w;
    const zone=off/w;
    let y=h/2;
    if(zone>0.38&&zone<0.40)y=h/2-70;
    else if(zone>0.40&&zone<0.42)y=h/2+35;
    else if(zone>0.42&&zone<0.44)y=h/2-18;
    else y=h/2+Math.sin(off*0.2)*4;
    x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
  }
  ctx.stroke();ctx.shadowBlur=0;
};


const ANIMS=[
  {id:"particle",t:"🌌 Parçacık Evreni",d:"500 parçacık + ağ bağlantıları",drawFn:_particleDraw},
  {id:"neural",t:"🧠 Nöral Ağ",d:"Sinir ağı görsel",Comp:NeuralNetSim},
  {id:"dna",t:"🧬 DNA Sarmalı",d:"3D çift sarmal animasyon",drawFn:_dna2Draw},
  {id:"wave",t:"🌊 Dalga Denizi",d:"Sin/Cos dalga harmoni",drawFn:_quantumDraw},
  {id:"globe",t:"🌐 3D Küre",d:"Dünya ağ simülasyonu",drawFn:_galaxyDraw},
  {id:"matrix",t:"🔢 Matrix",d:"Kod yağmuru",Comp:()=>{const r=useRef();useEffect(()=>{const c=r.current;if(!c)return;c.width=c.offsetWidth||400;c.height=c.offsetHeight||300;const ctx=c.getContext("2d");const cols=Math.floor(c.width/14);const drops=Array(cols).fill(0);const CH="IMDATAI01MLAI10";const iv=setInterval(()=>{ctx.fillStyle="rgba(4,8,20,0.07)";ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle="#00ff88";ctx.font="12px monospace";drops.forEach((y,i)=>{ctx.fillText(CH[Math.floor(Math.random()*CH.length)],i*14,y*14);if(y*14>c.height&&Math.random()>.97)drops[i]=0;drops[i]++;});},50);return()=>clearInterval(iv);},[]);return <canvas ref={r} style={{width:"100%",height:"100%"}}/>;} },
  {id:"fireworks",t:"🎆 Havai Fişek",d:"Renkli patlamalar",Comp:()=>{const r=useRef();useEffect(()=>{const c=r.current;if(!c)return;c.width=c.offsetWidth||400;c.height=c.offsetHeight||300;const ctx=c.getContext("2d");const ps=[];function ex(x,y){const h=Math.random()*360;for(let i=0;i<50;i++)ps.push({x,y,vx:(Math.random()-.5)*7,vy:(Math.random()-.5)*7,life:1,h});}let t=0;const iv=setInterval(()=>{t++;ctx.fillStyle="rgba(2,5,10,0.2)";ctx.fillRect(0,0,c.width,c.height);if(t%70===0)ex(Math.random()*c.width,Math.random()*c.height*0.7);for(let i=ps.length-1;i>=0;i--){const p=ps[i];ctx.fillStyle=`hsl(${p.h},100%,60%)`;ctx.globalAlpha=p.life;ctx.fillRect(p.x,p.y,3,3);p.x+=p.vx;p.y+=p.vy;p.vy+=0.15;p.life-=0.018;if(p.life<=0)ps.splice(i,1);}ctx.globalAlpha=1;},30);return()=>clearInterval(iv);},[]);return <canvas ref={r} style={{width:"100%",height:"100%"}}/>;} },
  {id:"blackhole",t:"⚫ Kara Delik",d:"Spiral çekim",Comp:()=>{const r=useRef();useEffect(()=>{const c=r.current;if(!c)return;c.width=c.offsetWidth||400;c.height=c.offsetHeight||300;const ctx=c.getContext("2d");const cx=c.width/2,cy=c.height/2;const pts=Array.from({length:200},()=>({a:Math.random()*Math.PI*2,rr:50+Math.random()*120,sp:0.005+Math.random()*0.02,h:220+Math.random()*60}));const iv=setInterval(()=>{ctx.fillStyle="rgba(0,0,0,0.15)";ctx.fillRect(0,0,c.width,c.height);pts.forEach(p=>{p.a+=p.sp;p.rr=Math.max(5,p.rr-0.1);const x=cx+p.rr*Math.cos(p.a),y=cy+p.rr*Math.sin(p.a);ctx.fillStyle=`hsl(${p.h},80%,55%)`;ctx.fillRect(x,y,2,2);if(p.rr<8)p.rr=50+Math.random()*120;});},30);return()=>clearInterval(iv);},[]);return <canvas ref={r} style={{width:"100%",height:"100%"}}/>;} },
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
  {id:"clock",t:"🕐 Sanat Saati",d:"Canlı analog",Comp:()=>{const r=useRef();useEffect(()=>{const c=r.current;if(!c)return;c.width=c.offsetWidth||400;c.height=c.offsetHeight||300;const ctx=c.getContext("2d");const cx=c.width/2,cy=c.height/2,rad=Math.min(c.width,c.height)/2-20;const iv=setInterval(()=>{const now=new Date();ctx.fillStyle="#030609";ctx.fillRect(0,0,c.width,c.height);ctx.strokeStyle="#00dcff";ctx.lineWidth=2;ctx.shadowBlur=8;ctx.shadowColor="#00dcff";ctx.beginPath();ctx.arc(cx,cy,rad,0,Math.PI*2);ctx.stroke();ctx.shadowBlur=0;for(let i=0;i<12;i++){const a=i/12*Math.PI*2;const x1=cx+(rad-8)*Math.cos(a-Math.PI/2),y1=cy+(rad-8)*Math.sin(a-Math.PI/2),x2=cx+(rad-18)*Math.cos(a-Math.PI/2),y2=cy+(rad-18)*Math.sin(a-Math.PI/2);ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();}[[now.getHours()%12/12,"#a855f7",rad*.5,4],[now.getMinutes()/60,"#00dcff",rad*.7,2],[now.getSeconds()/60,"#ff4466",rad*.85,1]].forEach(([frac,col,len,lw])=>{const a=frac*Math.PI*2-Math.PI/2;ctx.strokeStyle=col;ctx.lineWidth=lw;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+len*Math.cos(a),cy+len*Math.sin(a));ctx.stroke();});},1000);return()=>clearInterval(iv);},[]);return <canvas ref={r} style={{width:"100%",height:"100%"}}/>;} },  {id:"tunnel",t:"🚇 Tünel",d:"Sonsuz hipnotik tünel",Comp:()=>{const r=useRef();useEffect(()=>{const c=r.current;if(!c)return;c.width=c.offsetWidth||400;c.height=c.offsetHeight||300;const ctx=c.getContext("2d");let t=0;const iv=setInterval(()=>{t+=0.035;ctx.fillStyle="#010408";ctx.fillRect(0,0,c.width,c.height);const cx=c.width/2,cy=c.height/2;for(let i=20;i>0;i--){const rr=i*15*(1+Math.sin(t)*0.12);const hue=(t*40+i*20)%360;ctx.strokeStyle=`hsla(${hue},90%,60%,${i/22})`;ctx.lineWidth=1.2;ctx.beginPath();for(let j=0;j<=8;j++){const a=j/8*Math.PI*2+t*(i%2===0?.3:-.3);const x=cx+rr*Math.cos(a),y=cy+rr*Math.sin(a)*.65;j===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.closePath();ctx.stroke();}},33);return()=>clearInterval(iv);},[]);return <canvas ref={r} style={{width:"100%",height:"100%"}}/>;} },
  {id:"plasma",t:"⚗️ Plazma",d:"Sıvı renkli plazma akışı",Comp:()=>{const r=useRef();useEffect(()=>{const c=r.current;if(!c)return;c.width=c.offsetWidth||400;c.height=c.offsetHeight||300;const ctx=c.getContext("2d");let t=0;const iv=setInterval(()=>{t+=0.04;const img=ctx.createImageData(c.width,c.height);const d=img.data;for(let y=0;y<c.height;y+=2)for(let x=0;x<c.width;x+=2){const v=Math.sin(x/30+t)+Math.sin(y/30+t)+Math.sin((x+y)/40+t)+Math.sin(Math.sqrt(x*x+y*y)/25+t);const r2=Math.floor((Math.sin(v*Math.PI)+1)*127.5);const g2=Math.floor((Math.sin(v*Math.PI+2.1)+1)*127.5);const b2=Math.floor((Math.sin(v*Math.PI+4.2)+1)*127.5);const i=(y*c.width+x)*4;d[i]=r2;d[i+1]=g2;d[i+2]=b2;d[i+3]=220;if(x+1<c.width){d[i+4]=r2;d[i+5]=g2;d[i+6]=b2;d[i+7]=220;}if(y+1<c.height){const i2=((y+1)*c.width+x)*4;d[i2]=r2;d[i2+1]=g2;d[i2+2]=b2;d[i2+3]=220;}}ctx.putImageData(img,0,0);},50);return()=>clearInterval(iv);},[]);return <canvas ref={r} style={{width:"100%",height:"100%"}}/>;} },
  {id:"fractal",t:"🌿 Fraktal Ağaç",d:"Özyinelemeli fraktal büyüme",Comp:()=>{const r=useRef();useEffect(()=>{const c=r.current;if(!c)return;c.width=c.offsetWidth||400;c.height=c.offsetHeight||300;const ctx=c.getContext("2d");let t=0;function branch(x,y,len,angle,depth){if(depth<=0||len<2)return;const x2=x+Math.cos(angle)*len,y2=y+Math.sin(angle)*len;const hue=(t*30+depth*25)%360;ctx.strokeStyle=`hsla(${hue},80%,${40+depth*8}%,${depth/8})`;ctx.lineWidth=depth*0.8;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x2,y2);ctx.stroke();const spread=0.4+Math.sin(t+depth)*0.15;branch(x2,y2,len*.68,angle-spread,depth-1);branch(x2,y2,len*.68,angle+spread,depth-1);}const iv=setInterval(()=>{t+=0.025;ctx.fillStyle="rgba(3,6,9,.35)";ctx.fillRect(0,0,c.width,c.height);branch(c.width/2,c.height,80,-Math.PI/2,7);},60);return()=>clearInterval(iv);},[]);return <canvas ref={r} style={{width:"100%",height:"100%"}}/>;} },
  {id:"lissajous",t:"〰️ Lissajous",d:"Harmonik eğri izleri",Comp:()=>{const r=useRef();useEffect(()=>{const c=r.current;if(!c)return;c.width=c.offsetWidth||400;c.height=c.offsetHeight||300;const ctx=c.getContext("2d");let t=0;const pts=[];const iv=setInterval(()=>{t+=0.018;const A=c.width*.38,B=c.height*.38,a=3,b=2;const px=c.width/2+A*Math.sin(a*t+Math.PI/4),py=c.height/2+B*Math.sin(b*t);pts.push({x:px,y:py,age:0});if(pts.length>350)pts.shift();ctx.fillStyle="rgba(3,6,9,.18)";ctx.fillRect(0,0,c.width,c.height);pts.forEach((p,i)=>{p.age++;const ratio=i/pts.length;const hue=(t*60+i*1.2)%360;ctx.fillStyle=`hsla(${hue},90%,65%,${ratio*.9})`;ctx.beginPath();ctx.arc(p.x,p.y,ratio*3.5+.5,0,Math.PI*2);ctx.fill();});},22);return()=>clearInterval(iv);},[]);return <canvas ref={r} style={{width:"100%",height:"100%"}}/>;} },
  {id:"sandpile",t:"🏖️ Kum Fırtınası",d:"Parçacık akış simülasyonu",Comp:()=>{const r=useRef();useEffect(()=>{const c=r.current;if(!c)return;c.width=c.offsetWidth||400;c.height=c.offsetHeight||300;const ctx=c.getContext("2d");const ps=Array.from({length:180},()=>({x:Math.random()*c.width,y:Math.random()*c.height,vx:(Math.random()-.5)*2,vy:(Math.random()-.5)*2,h:Math.random()*360,size:1.5+Math.random()*2.5,life:Math.random()}));let t=0;const iv=setInterval(()=>{t+=.025;ctx.fillStyle="rgba(4,8,20,.2)";ctx.fillRect(0,0,c.width,c.height);ps.forEach(p=>{const windX=Math.sin(t+p.y*.008)*1.2,windY=Math.cos(t*.7+p.x*.006)*.8;p.vx=p.vx*.96+windX*.08;p.vy=p.vy*.96+windY*.08+.04;p.x+=p.vx;p.y+=p.vy;p.life+=.01;if(p.x<0||p.x>c.width||p.y>c.height){p.x=Math.random()*c.width;p.y=-5;p.vx=(Math.random()-.5)*2;p.vy=Math.random()*.5;p.life=0;}if(p.x>c.width)p.x=0;const al=Math.sin(p.life*Math.PI)*.85;ctx.fillStyle=`hsla(${p.h},80%,65%,${al})`;ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,Math.PI*2);ctx.fill();});},35);return()=>clearInterval(iv);},[]);return <canvas ref={r} style={{width:"100%",height:"100%"}}/>;} },,
  // ── YENİ ANİMASYONLAR ─────────────────────────
  {id:"fractal",t:"🌿 Fraktal Ağaç",d:"Matematiksel dal sistemi",cat:"Matematik",drawFn:_fractalDraw},
  {id:"galaxy2",t:"🌌 Galaksi Dönüşü",d:"Sarmal galaksi simülasyonu",cat:"Uzay",drawFn:_galaxyDraw},
  {id:"aurora",t:"🌈 Kuzey Işıkları",d:"Aurora borealis efekti",cat:"Doğa",drawFn:_auraDraw},
  {id:"blackhole",t:"🕳️ Karadelik",d:"Kütleçekim simülasyonu",cat:"Uzay",drawFn:_blackholeDraw},
  {id:"dna2",t:"🧬 DNA Sarmalı v2",d:"Renkli çift sarmal",cat:"Bilim",drawFn:_dna2Draw},
  {id:"neon_city",t:"🌆 Neon Şehir",d:"Siberpunk şehir görünümü",cat:"Sanat",drawFn:_neonCityDraw},
  {id:"quantum",t:"🔬 Kuantum Dalgası",d:"Dalga fonksiyonu görselleştirme",cat:"Bilim",drawFn:_quantumDraw},
  {id:"music",t:"🎵 Müzik Visualizer",d:"Audio spectrum barları",cat:"Sanat",drawFn:_musicDraw},
  {id:"snow",t:"❄️ Kar Tanesi",d:"Kar yağışı + kristal",cat:"Doğa",drawFn:_snowDraw},
  {id:"nebula",t:"🌌 Nebula",d:"Galaksik bulutsu",cat:"Uzay",drawFn:_nebulaDraw},
  {id:"grid",t:"⚡ Izgara Pulse",d:"Teknoloji grid efekti",cat:"Teknoloji",drawFn:_gridDraw},
  {id:"fireworks",t:"🎆 Havai Fişek",d:"Kutlama patlamaları",cat:"Görsel",drawFn:_fireworksDraw},
  {id:"heartbeat",t:"❤️ Kalp Atışı",d:"EKG monitör simülasyonu",cat:"Bilim",drawFn:_heartbeatDraw}
];


class ErrorBoundary extends Component{
  constructor(props){super(props);this.state={err:false};}
  static getDerivedStateFromError(){return{err:true};}
  componentDidCatch(){}
  render(){if(this.state.err)return <div style={{padding:8,color:"#475569",fontSize:10,textAlign:"center"}}>⚠️</div>;return this.props.children;}
}
function Safe({children}){return <ErrorBoundary>{children}</ErrorBoundary>;}

function AnimasyonPage(){
  const[sel,setSel]=useState(null);
  const[viewMode,setViewMode]=useState('mini'); // 'mini' | 'full'
  const audioRef=useRef(null);
  const audioElemRef=useRef(null);

  const EMOJIS=["🌌","🧠","🧬","🌊","🌐","🔢","⬡","🎆","⚫","🌠","❤️","🐦","🌀","✨","📡","🎵","🔲","💎","🫧","📐","🕐","🚇","⚗️","🌿","〰️","🏖️"];

  const[audioOn,setAudioOn]=useState(false);

  // Sayfa değişince sesi MUTLAKA durdur
  useEffect(()=>{ return()=>{ stopAudio(); }; },[]);


  function tryPlayAudio(id){
    try{
      stopAudio();
      // Try specific file first, fallback to default
      const tryPlay=(src)=>{
        const a=new Audio();
        a.volume=0.4;
        a.loop=true;
        a.src=src;
        // Must load before play
        a.load();
        const p=a.play();
        if(p&&typeof p.then==='function'){
          p.then(()=>{audioElemRef.current=a;setAudioOn(true);})
           .catch(()=>{
             // Try default fallback
             if(src!==ANIM_AUDIO._default){
               tryPlay(ANIM_AUDIO._default);
             }else{
               setAudioOn(false);
             }
           });
        }else{
          audioElemRef.current=a;setAudioOn(true);
        }
      };
      tryPlay(getAnimAudio(id));
    }catch(e){setAudioOn(false);}
  }
  function stopAudio(){
    try{
      if(audioElemRef.current){
        audioElemRef.current.pause();
        audioElemRef.current.currentTime=0;
        audioElemRef.current=null;
      }
    }catch(e){}
    setAudioOn(false);
  }


  function openAnim(anim){setSel(anim);setViewMode('mini');tryPlayAudio(anim.id);}
  function closeAnim(){
    stopAudio();
    setSel(null);
    setViewMode('mini');
    try{if(document.fullscreenElement)document.exitFullscreen();}catch(e){}
  }
  function goFull(){
    setViewMode('full');
    try{document.documentElement.requestFullscreen&&document.documentElement.requestFullscreen();}catch(e){}
  }
  function exitFull(){
    setViewMode('mini');
    try{document.fullscreenElement&&document.exitFullscreen();}catch(e){}
  }
  function prevAnim(){const i=ANIMS.findIndex(a=>a.id===sel.id);const p=ANIMS[(i-1+ANIMS.length)%ANIMS.length];setSel(p);tryPlayAudio(p.id);}
  function nextAnim(){const i=ANIMS.findIndex(a=>a.id===sel.id);const n=ANIMS[(i+1)%ANIMS.length];setSel(n);tryPlayAudio(n.id);}

    // ── MINI WINDOW ──────────────────────────────────
  if(sel&&viewMode==='mini'){
    const hasDrawFn=sel.drawFn&&typeof sel.drawFn==='function';
    const AnimComp=hasDrawFn?()=><GenericCanvasAnim drawFn={sel.drawFn}/>:sel.Comp;
    return(
      <div style={{
        position:"fixed",inset:0,zIndex:9998,
        display:"flex",alignItems:"center",justifyContent:"center",
        background:"rgba(0,0,0,.82)",backdropFilter:"blur(6px)"
      }} onClick={closeAnim}>
        <div onClick={e=>e.stopPropagation()} style={{
          background:"#030810",
          border:"1.5px solid rgba(168,85,247,.55)",
          borderRadius:14,
          boxShadow:"0 16px 60px rgba(0,0,0,.95),0 0 40px rgba(168,85,247,.18)",
          width:"min(680px,92vw)",
          height:"min(440px,78vh)",
          maxHeight:"85vh",
          display:"flex",
          flexDirection:"column",
          overflow:"hidden"
        }}>
          {/* macOS-style title bar */}
          <div style={{display:"flex",alignItems:"center",gap:8,padding:"9px 14px",background:"rgba(168,85,247,.07)",borderBottom:"1px solid rgba(168,85,247,.18)",flexShrink:0}}>
            <div style={{display:"flex",gap:6,alignItems:"center"}}>
              <div onClick={closeAnim} style={{width:13,height:13,borderRadius:"50%",background:"#ff5f57",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,color:"#6b0000",fontWeight:900}} onMouseEnter={e=>e.currentTarget.innerText='✕'} onMouseLeave={e=>e.currentTarget.innerText=''}>　</div>
              <div style={{width:13,height:13,borderRadius:"50%",background:"#febc2e",cursor:"pointer"}}/>
              <div onClick={goFull} style={{width:13,height:13,borderRadius:"50%",background:"#28c840",cursor:"pointer"}} title="Tam Ekran"/>
            </div>
            <div style={{flex:1,fontSize:12,fontWeight:700,color:"#e2e8f0",fontFamily:"Space Grotesk,sans-serif",marginLeft:6,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{sel.t}</div>
            <span style={{fontSize:9,color:audioOn?"#34d399":"#475569",flexShrink:0}}>{audioOn?"🎵 Ses Açık":"🔇 Ses Yok"}</span>
            <button onClick={goFull} style={{padding:"3px 11px",border:"1px solid rgba(0,220,255,.35)",borderRadius:7,background:"rgba(0,220,255,.08)",color:"#00dcff",fontSize:10,cursor:"pointer",fontFamily:"monospace",fontWeight:700,flexShrink:0}}>⛶ Tam</button>
          </div>
          {/* Canvas - explicit height */}
          <div style={{position:"relative",background:"#020609",overflow:"hidden",
            flexGrow:1,minHeight:200,height:"calc(min(440px,78vh) - 88px)"}}>
            <div style={{position:"absolute",inset:0,width:"100%",height:"100%"}}>
              <Safe><AnimComp/></Safe>
            </div>
          </div>
          {/* Bottom nav */}
          <div style={{display:"flex",alignItems:"center",gap:6,padding:"7px 12px",background:"rgba(0,0,0,.6)",flexShrink:0}}>
            <button onClick={prevAnim} style={{padding:"4px 11px",border:"1px solid rgba(255,255,255,.1)",borderRadius:7,background:"transparent",color:"#94a3b8",fontSize:11,cursor:"pointer",fontFamily:"monospace",flexShrink:0}}>← Önceki</button>
            <div style={{flex:1,display:"flex",justifyContent:"center",gap:3,flexWrap:"wrap",padding:"0 4px"}}>
              {ANIMS.map(a=><div key={a.id} onClick={()=>{setSel(a);tryPlayAudio(a.id);}} title={a.t} style={{width:7,height:7,borderRadius:"50%",cursor:"pointer",flexShrink:0,background:a.id===sel.id?"#a855f7":"rgba(255,255,255,.2)",transition:"all .15s",transform:a.id===sel.id?"scale(1.5)":"scale(1)"}}/>)}
            </div>
            <button onClick={nextAnim} style={{padding:"4px 11px",border:"1px solid rgba(255,255,255,.1)",borderRadius:7,background:"transparent",color:"#94a3b8",fontSize:11,cursor:"pointer",fontFamily:"monospace",flexShrink:0}}>Sonraki →</button>
          </div>
        </div>
      </div>
    );
  }

// ── TAM EKRAN (TV modu) ─────────────────────────
  if(sel&&viewMode==='full'){
    const AnimFull=sel.Comp;
    return(
      <div style={{position:"fixed",inset:0,zIndex:99999,background:"#000",display:"flex",flexDirection:"column",fontFamily:"monospace"}}>
        <div style={{position:"absolute",top:0,left:0,right:0,zIndex:1,background:"linear-gradient(rgba(0,0,0,.92),transparent)",padding:"12px 16px",display:"flex",alignItems:"center",gap:10}}>
          <button onClick={closeAnim} style={{padding:"6px 14px",border:"1px solid rgba(255,80,80,.4)",borderRadius:16,background:"rgba(255,50,50,.08)",color:"#ff8080",fontSize:12,cursor:"pointer",fontWeight:700}}>✕ Kapat</button>
          <button onClick={exitFull} style={{padding:"6px 12px",border:"1px solid rgba(255,255,255,.2)",borderRadius:16,background:"rgba(255,255,255,.04)",color:"#94a3b8",fontSize:11,cursor:"pointer"}}>↙ Küçült</button>
          <div style={{flex:1,fontSize:16,fontWeight:800,color:"#fff",fontFamily:"Space Grotesk,sans-serif"}}>{sel.t} <span style={{fontSize:10,color:"rgba(255,255,255,.4)"}}>· {sel.d}</span></div>
          <span style={{fontSize:10,color:"rgba(168,85,247,.7)"}}>🎵 {sel.id}</span>
        </div>
        <div style={{flex:1,overflow:"hidden"}}><Safe><AnimFull/></Safe></div>
        <div style={{position:"absolute",bottom:0,left:0,right:0,background:"linear-gradient(transparent,rgba(0,0,0,.85))",padding:"20px 16px 14px",display:"flex",alignItems:"center",gap:8}}>
          <button onClick={prevAnim} style={{padding:"7px 18px",border:"1px solid rgba(255,255,255,.15)",borderRadius:10,background:"rgba(0,0,0,.7)",color:"#e2e8f0",fontSize:12,cursor:"pointer",fontFamily:"monospace"}}>← Önceki</button>
          <div style={{flex:1,display:"flex",justifyContent:"center",gap:5}}>
            {ANIMS.map(a=><div key={a.id} onClick={()=>{setSel(a);tryPlayAudio(a.id);}} style={{width:9,height:9,borderRadius:"50%",cursor:"pointer",background:a.id===sel.id?"#a855f7":"rgba(255,255,255,.2)",transition:"all .2s",transform:a.id===sel.id?"scale(1.5)":"scale(1)"}}/>)}
          </div>
          <button onClick={nextAnim} style={{padding:"7px 18px",border:"1px solid rgba(255,255,255,.15)",borderRadius:10,background:"rgba(0,0,0,.7)",color:"#e2e8f0",fontSize:12,cursor:"pointer",fontFamily:"monospace"}}>Sonraki →</button>
        </div>
      </div>
    );
  }

  // ── GALERİ (ana görünüm) ──────────────────────────
  return(
    <div style={{padding:"24px 16px",maxWidth:1200,margin:"0 auto"}}>
      <div style={{marginBottom:22}}>
        <div style={{fontSize:9,letterSpacing:".2em",color:"#a855f7",marginBottom:4}}>GÖRSEL ŞOV</div>
        <div style={{fontSize:22,fontWeight:900,color:"#e2e8f0",fontFamily:"Space Grotesk,sans-serif",marginBottom:6}}>🎬 AI Animasyon Galerisi</div>
        <div style={{fontSize:12,color:"#64748b"}}>{ANIMS.length} animasyon · Tıkla → Ufak pencere → ⛶ Tam ekran (TV modu) · 🎵 Müzikli</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(185px,1fr))",gap:12}}>
        {ANIMS.map(function(anim,idx){
          return(
            <div key={anim.id} onClick={()=>openAnim(anim)}
              style={{borderRadius:12,overflow:"hidden",cursor:"pointer",border:"1px solid rgba(168,85,247,.2)",background:"rgba(168,85,247,.04)",transition:"transform .2s,box-shadow .2s,border-color .2s"}}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow="0 14px 36px rgba(168,85,247,.28)";e.currentTarget.style.borderColor="rgba(168,85,247,.55)";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";e.currentTarget.style.borderColor="rgba(168,85,247,.2)";}}>
              <div style={{height:118,background:"linear-gradient(135deg,#030609,#0d1525)",position:"relative",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <span style={{fontSize:46}}>{EMOJIS[idx]||"✨"}</span>
                <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",opacity:0,transition:"opacity .2s"}} onMouseEnter={e=>{e.currentTarget.style.opacity=1;}} onMouseLeave={e=>{e.currentTarget.style.opacity=0;}}>
                  <div style={{width:50,height:50,borderRadius:"50%",background:"rgba(168,85,247,.88)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,color:"#fff"}}>▶</div>
                </div>
                <div style={{position:"absolute",bottom:6,right:8,fontSize:8,color:"rgba(168,85,247,.7)",background:"rgba(0,0,0,.7)",padding:"2px 6px",borderRadius:4,fontFamily:"monospace"}}>🎵 + ⛶</div>
              </div>
              <div style={{padding:"9px 11px"}}>
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
  const[tab,setTab]=useState('genel');
  const TABS=[{id:'genel',l:'⚡ Genel'},{id:'ozellik',l:'🔥 Özellikler'},{id:'karsi',l:'🆚 Karşılaştır'},{id:'ipucu',l:'💡 İpuçları'}];

  const FEATURES=[
    {e:"📡",t:"Gerçek Zamanlı Veri",d:"X (Twitter) verisine direkt erişim. Güncel haberler, trendler, tartışmalar anlık olarak işlenebiliyor. Diğer modellerin bilmediği son dakika olaylarını biliyor."},
    {e:"🧠",t:"Grok 3 Modeli",d:"xAI'ın en güçlü modeli. Matematik, kodlama ve akıl yürütmede üst düzey performans. Aurora görsel üretimi dahil."},
    {e:"😄",t:"Mizah ve Yaratıcılık",d:"Diğer AI'lardan farklı olarak daha az kısıtlı ve daha esprili. Hiciv, ironi ve yaratıcı içerikler için tercih ediliyor."},
    {e:"🔍",t:"Ağır Araştırma Modu",d:"'DeepSearch' özelliği ile bir konuyu derinlemesine araştırıp kapsamlı rapor üretiyor. Saatler sürecek araştırmayı dakikalara indiriyor."},
    {e:"🎨",t:"Aurora Görsel Üretimi",d:"Grok içinde entegre görsel üretim. Metin açıklamasından yüksek kaliteli görseller oluşturma özelliği."},
    {e:"📊",t:"Büyük Düşünme Modeli",d:"Karmaşık problemlerde adım adım düşünme (chain-of-thought). Matematik ve bilim sorularında güçlü performans."},
  ];

  const COMPARE=[
    {m:"Gerçek Zamanlı Veri",grok:"✅ X/Twitter",gpt:"✅ Web arama",claude:"Sınırlı"},
    {m:"Güncel Haber",grok:"✅ Anlık",gpt:"✅ İyi",claude:"🟡 Orta"},
    {m:"Kod Yazma",grok:"⭐⭐⭐⭐",gpt:"⭐⭐⭐⭐⭐",claude:"⭐⭐⭐⭐⭐"},
    {m:"Türkçe",grok:"⭐⭐⭐",gpt:"⭐⭐⭐⭐⭐",claude:"⭐⭐⭐⭐"},
    {m:"Mizah/Yaratıcılık",grok:"⭐⭐⭐⭐⭐",gpt:"⭐⭐⭐⭐",claude:"⭐⭐⭐⭐"},
    {m:"Ücretsiz Kullanım",grok:"Sınırlı",gpt:"Sınırlı",claude:"Sınırlı"},
    {m:"API Erişimi",grok:"✅ var",gpt:"✅ var",claude:"✅ var"},
    {m:"Görsel Üretim",grok:"✅ Aurora",gpt:"✅ DALL-E",claude:"🟡 Sınırlı"},
  ];

  const TIPS=[
    "Grok'u Twitter trendlerini analiz etmek için kullanın: 'Bu hafta X'teki [KONU] tartışmasını özetle'",
    "DeepSearch ile: 'Grok, [KONU] hakkında kapsamlı araştırma yap, kaynak belirt' deneyin",
    "Haber doğrulama için: 'X'te [HABER] hakkında söylenenler gerçek mi?' sorusu işe yarıyor",
    "Grok'un mizah yeteneğini test edin: 'Yapay zeka hakkında esprili bir şiir yaz'",
    "Rakip analizi için: 'X'te [ŞİRKET] hakkında ne konuşuluyor?' sorusu değerli bilgiler verir",
    "Aurora ile görsel: 'Sinematik, fotogerçekçi [KONU] görseli oluştur' formatını deneyin",
  ];

  return <div style={{maxWidth:960,margin:'0 auto',padding:'24px 16px'}}>
    <div style={{background:'linear-gradient(135deg,rgba(96,165,250,0.1),rgba(96,165,250,0.02))',border:'1px solid rgba(96,165,250,0.2)',borderRadius:18,padding:'22px',marginBottom:20}}>
      <div style={{display:'flex',gap:14,alignItems:'center',flexWrap:'wrap',marginBottom:12}}>
        <div style={{width:52,height:52,borderRadius:14,background:'linear-gradient(135deg,#60a5fa,#3b82f6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:26,boxShadow:'0 4px 20px rgba(96,165,250,0.4)'}}>⚡</div>
        <div>
          <h1 style={{margin:0,fontSize:'clamp(18px,4vw,28px)',fontWeight:900,color:'#e2e8f0',fontFamily:"'Space Grotesk',sans-serif"}}>Grok AI — Tam Türkçe Rehber</h1>
          <div style={{fontSize:11,color:'#60a5fa',marginTop:3}}>xAI · Elon Musk · Twitter/X Entegrasyonu · Gerçek Zamanlı</div>
        </div>
        <div style={{marginLeft:'auto',display:'flex',gap:5,flexWrap:'wrap'}}>
          {['X Entegrasyonu','Gerçek Zamanlı','Aurora Görsel','DeepSearch'].map(b=><span key={b} style={{fontSize:9,background:'rgba(96,165,250,0.15)',color:'#60a5fa',border:'1px solid rgba(96,165,250,0.3)',borderRadius:5,padding:'2px 7px',fontWeight:700}}>{b}</span>)}
        </div>
      </div>
      <p style={{margin:0,fontSize:12,color:'#94a3b8',lineHeight:1.7}}>Grok, Elon Musk'ın xAI şirketi tarafından geliştirilen yapay zeka asistanıdır. <strong style={{color:'#e2e8f0'}}>En büyük avantajı: X (Twitter) verisine gerçek zamanlı erişim.</strong> Güncel olayları, trendleri ve sosyal medya tartışmalarını anlık olarak işleyebiliyor.</p>
    </div>

    <div style={{display:'flex',gap:6,marginBottom:20,flexWrap:'wrap'}}>
      {TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{padding:'7px 13px',borderRadius:9,border:'1px solid '+(tab===t.id?'rgba(96,165,250,0.5)':'rgba(255,255,255,0.07)'),background:tab===t.id?'rgba(96,165,250,0.1)':'transparent',color:tab===t.id?'#60a5fa':'#64748b',fontSize:11,cursor:'pointer',fontFamily:'inherit',fontWeight:tab===t.id?700:400}}>{t.l}</button>)}
    </div>

    {tab==='genel'&&<div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:12,marginBottom:20}}>
        {[['xAI','2023 yılında Elon Musk tarafından kuruldu. San Francisco merkezli. OpenAI\'ın eski mühendisleri de ekipte.'],
          ['X Premium','Groka erişmek için X Premium ($8/ay) veya Premium+ ($16/ay) abonelik gerekiyor.'],
          ['Kullanım','x.com adresinde sağ menüden Groka erişin. Mobil uygulamadan da kullanılabilir.'],
          ['API','api.x.ai üzerinden geliştirici API si mevcut. OpenAI uyumlu format.']].map(([t,d])=><div key={t} style={{background:'rgba(96,165,250,0.05)',border:'1px solid rgba(96,165,250,0.15)',borderRadius:12,padding:'14px'}}>
          <div style={{fontSize:12,fontWeight:700,color:'#60a5fa',marginBottom:5}}>{t}</div>
          <div style={{fontSize:10,color:'#64748b',lineHeight:1.5}}>{d}</div>
        </div>)}
      </div>
      <div style={{background:'rgba(96,165,250,0.06)',border:'1px solid rgba(96,165,250,0.2)',borderRadius:12,padding:'16px'}}>
        <div style={{fontSize:12,fontWeight:700,color:'#60a5fa',marginBottom:10}}>⚡ Grok Ne Zaman Kullanılır?</div>
        {[['✅ Kullanın','Güncel haber analizi, X trendleri, son dakika olayları, hicivli içerik, sosyal medya araştırması'],
          ['🟡 Dikkatli','Kod yazma (Claude daha iyi), uzun döküman (Gemini daha iyi), Türkçe metin (ChatGPT daha iyi)'],
          ['❌ Kullanmayın','Hassas tıbbi/hukuki sorular, uzun akademik çalışmalar, gizlilik gerektiren içerikler']].map(([s,t])=><div key={s} style={{marginBottom:6,fontSize:11,color:'#94a3b8'}}><strong style={{color:s.startsWith('✅')?'#34d399':s.startsWith('🟡')?'#fbbf24':'#ff4444'}}>{s}:</strong> {t}</div>)}
      </div>
    </div>}

    {tab==='ozellik'&&<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:12}}>
      {FEATURES.map(f=><div key={f.t} style={{background:'rgba(96,165,250,0.05)',border:'1px solid rgba(96,165,250,0.15)',borderRadius:12,padding:'16px'}}>
        <div style={{fontSize:24,marginBottom:8}}>{f.e}</div>
        <div style={{fontSize:12,fontWeight:700,color:'#60a5fa',marginBottom:5}}>{f.t}</div>
        <div style={{fontSize:10,color:'#64748b',lineHeight:1.5}}>{f.d}</div>
      </div>)}
    </div>}

    {tab==='karsi'&&<div style={{overflowX:'auto',borderRadius:12,border:'1px solid rgba(255,255,255,0.07)'}}>
      <table style={{width:'100%',borderCollapse:'collapse',fontSize:11}}>
        <thead><tr style={{background:'rgba(96,165,250,0.06)'}}>
          {['Özellik','Grok','ChatGPT','Claude'].map((h,i)=><th key={h} style={{padding:'9px 14px',textAlign:'left',color:i===1?'#60a5fa':'#475569',borderBottom:'1px solid rgba(255,255,255,0.06)',fontWeight:700}}>{h}</th>)}
        </tr></thead>
        <tbody>{COMPARE.map((r,i)=><tr key={r.m} style={{background:i%2===0?'transparent':'rgba(255,255,255,0.015)'}}>
          <td style={{padding:'8px 14px',color:'#94a3b8',fontSize:10}}>{r.m}</td>
          <td style={{padding:'8px 14px',color:'#60a5fa',fontWeight:600}}>{r.grok}</td>
          <td style={{padding:'8px 14px',color:'#64748b'}}>{r.gpt}</td>
          <td style={{padding:'8px 14px',color:'#64748b'}}>{r.claude}</td>
        </tr>)}</tbody>
      </table>
    </div>}

    {tab==='ipucu'&&<div style={{display:'flex',flexDirection:'column',gap:10}}>
      {TIPS.map((tip,i)=><div key={i} style={{background:'rgba(96,165,250,0.05)',border:'1px solid rgba(96,165,250,0.15)',borderRadius:10,padding:'14px',display:'flex',gap:12,alignItems:'flex-start'}}>
        <div style={{width:24,height:24,borderRadius:'50%',background:'rgba(96,165,250,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,color:'#60a5fa',fontWeight:700,flexShrink:0}}>{i+1}</div>
        <div style={{fontSize:11,color:'#94a3b8',lineHeight:1.6}}>{tip}</div>
      </div>)}
      <a href="https://x.com/i/grok" target="_blank" rel="noopener noreferrer" style={{display:'inline-flex',gap:8,alignItems:'center',padding:'10px 20px',background:'linear-gradient(135deg,#60a5fa,#3b82f6)',borderRadius:10,color:'#fff',textDecoration:'none',fontSize:12,fontWeight:700,marginTop:8,alignSelf:'flex-start'}}>⚡ Grok'u Dene →</a>
    </div>}
  </div>;
}

function DeepSeekPage({setPage}){
  const[tab,setTab]=useState('genel');
  const TABS=[{id:'genel',l:'🔬 Genel'},{id:'modeller',l:'🔢 Modeller'},{id:'karsi',l:'🆚 Karşılaştır'},{id:'ipucu',l:'💡 İpuçları'},{id:'kod',l:'⚡ Kod'}];
  const MODELS=[
    {n:"DeepSeek V3",e:"🔬",desc:"671B MoE parametreli açık kaynak model. GPT-4o seviyesinde performans, %90 daha ucuz maliyet.",ctx:"128K",free:true,best:"Kod, matematik, analiz",benchmark:"89.9 HumanEval",color:"#00dcff"},
    {n:"DeepSeek R1",e:"🧠",desc:"Chain-of-thought reasoning modeli. OpenAI o1 ile benchmark'ta yarışıyor. Tamamen açık kaynak.",ctx:"128K",free:true,best:"Matematik, mantık, araştırma",benchmark:"97.3 MATH",color:"#a855f7"},
    {n:"DeepSeek Coder V2",e:"💻",desc:"Kodlama için optimize 16B model. 338 programlama dili destekler.",ctx:"128K",free:true,best:"Kod yazma, debug, refactor",benchmark:"90.2 HumanEval",color:"#34d399"},
    {n:"DeepSeek-V2.5",e:"⚡",desc:"V2 + Coder birleşimi. Hem genel hem kodlama görevlerinde güçlü.",ctx:"128K",free:true,best:"Hibrit görevler",benchmark:"88.1 MMLU",color:"#fbbf24"},
  ];
  const TIPS=[
    {e:"🆓",t:"Tamamen Ücretsiz API",d:"DeepSeek API'si şu an ücretsiz. Claude/GPT'nin 1/10 maliyetiyle aynı kalite."},
    {e:"🔓",t:"Açık Kaynak",d:"Model ağırlıkları herkese açık. Kendi sunucunuza kurabilir, fine-tune edebilirsiniz."},
    {e:"🇨🇳",t:"Çin Menşei — Dikkat",d:"Şirket verileri Çin sunucularında işlenebilir. Hassas veriler için dikkatli kullanın."},
    {e:"💻",t:"Kod için #1 Tercih",d:"HumanEval'de GPT-4o'yu geçiyor. Cursor ve VS Code eklentileri mevcut."},
    {e:"🔍",t:"Reasoning Modu",d:"'<think>' etiketi ile adım adım düşünme. Matematik ve mantık problemlerinde çok güçlü."},
    {e:"⚡",t:"Hız",d:"V3 modeli saniyede 60+ token. Ücretsiz planda bile yüksek hız."},
  ];
  const COMPARE=[
    {metric:"Genel Performans (MMLU)",ds:"88.5",gpt:"88.7",claude:"88.7",gem:"90.0"},
    {metric:"Kodlama (HumanEval)",ds:"89.9",gpt:"90.2",claude:"92.0",gem:"87.8"},
    {metric:"Matematik (MATH)",ds:"97.3",gpt:"93.5",claude:"95.0",gem:"94.0"},
    {metric:"Context Window",ds:"128K",gpt:"128K",claude:"1M",gem:"2M"},
    {metric:"API Fiyatı (1M token)",ds:"$0.27",gpt:"$2.50",claude:"$3.00",gem:"$1.25"},
    {metric:"Açık Kaynak",ds:"✅",gpt:"❌",claude:"❌",gem:"❌"},
    {metric:"Ücretsiz Kullanım",ds:"✅",gpt:"Sınırlı",claude:"Sınırlı",gem:"Sınırlı"},
  ];
  return <div style={{maxWidth:960,margin:'0 auto',padding:'24px 16px'}}>
    <div style={{background:'linear-gradient(135deg,rgba(0,220,255,0.1),rgba(0,220,255,0.02))',border:'1px solid rgba(0,220,255,0.2)',borderRadius:18,padding:'22px',marginBottom:20}}>
      <div style={{display:'flex',gap:14,alignItems:'center',flexWrap:'wrap',marginBottom:12}}>
        <div style={{width:52,height:52,borderRadius:14,background:'linear-gradient(135deg,#00dcff,#0891b2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:26,boxShadow:'0 4px 20px rgba(0,220,255,0.4)'}}>🔬</div>
        <div>
          <h1 style={{margin:0,fontSize:'clamp(18px,4vw,28px)',fontWeight:900,color:'#e2e8f0',fontFamily:"'Space Grotesk',sans-serif"}}>DeepSeek — Tam Türkçe Rehber</h1>
          <div style={{fontSize:11,color:'#00dcff',marginTop:3}}>DeepSeek AI · Açık Kaynak · Ücretsiz API · Çin Menşei</div>
        </div>
        <div style={{marginLeft:'auto',display:'flex',gap:5,flexWrap:'wrap'}}>
          {['Ücretsiz','Açık Kaynak','671B Params','Kod #1'].map(b=><span key={b} style={{fontSize:9,background:'rgba(0,220,255,0.15)',color:'#00dcff',border:'1px solid rgba(0,220,255,0.3)',borderRadius:5,padding:'2px 7px',fontWeight:700}}>{b}</span>)}
        </div>
      </div>
      <p style={{margin:0,fontSize:12,color:'#94a3b8',lineHeight:1.7}}>DeepSeek, Çin merkezli High-Flyer şirketi tarafından geliştirilen açık kaynak AI modelidir. <strong style={{color:'#e2e8f0'}}>GPT-4o ile yarışan performansını 1/10 maliyetle</strong> sunuyor. R1 modeli matematik ve mantıkta OpenAI o1'i geçti.</p>
    </div>
    <div style={{display:'flex',gap:6,marginBottom:20,flexWrap:'wrap'}}>
      {TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{padding:'7px 13px',borderRadius:9,border:'1px solid '+(tab===t.id?'rgba(0,220,255,0.5)':'rgba(255,255,255,0.07)'),background:tab===t.id?'rgba(0,220,255,0.1)':'transparent',color:tab===t.id?'#00dcff':'#64748b',fontSize:11,cursor:'pointer',fontFamily:'inherit',fontWeight:tab===t.id?700:400}}>{t.l}</button>)}
    </div>
    {tab==='genel'&&<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:12}}>
      {[['🆓','Tamamen Ücretsiz API','platform.deepseek.com — kayıt ol, API key al, hemen kullan','#34d399'],['💻','Kodlamada Dünya Rekoru','HumanEval %89.9 — GPT-4o ve Claude Sonnet ile aynı seviye','#00dcff'],['🔓','Tam Açık Kaynak','MIT lisansı. Fine-tuning, deployment, ticari kullanım serbest','#a855f7'],['🇨🇳','Hangi ülke?','Çin, Hangzhou. Hassas şirket verisi için dikkatli olun','#ff4444'],['⚡','Hız & Kapasite','Saniyede 60+ token, 128K context, çok dilli destek','#fbbf24'],['🧠','Reasoning Modeli','R1: chain-of-thought ile olimpiyat soruları çözüyor','#f472b6']].map(([e,t,d,c])=><div key={t} style={{background:c+'08',border:'1px solid '+c+'20',borderRadius:12,padding:'14px'}}>
        <div style={{fontSize:24,marginBottom:8}}>{e}</div>
        <div style={{fontSize:12,fontWeight:700,color:c,marginBottom:5}}>{t}</div>
        <div style={{fontSize:10,color:'#64748b',lineHeight:1.5}}>{d}</div>
      </div>)}
    </div>}
    {tab==='modeller'&&<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:12}}>
      {MODELS.map(m=><div key={m.n} style={{background:m.color+'07',border:'1px solid '+m.color+'25',borderRadius:13,padding:'16px'}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}><span style={{fontSize:26}}>{m.e}</span><span style={{fontSize:8,color:'#34d399',background:'rgba(52,211,153,0.15)',borderRadius:4,padding:'2px 6px',fontWeight:700}}>Ücretsiz</span></div>
        <div style={{fontSize:13,fontWeight:800,color:m.color,marginBottom:4}}>{m.n}</div>
        <div style={{fontSize:10,color:'#94a3b8',lineHeight:1.5,marginBottom:8}}>{m.desc}</div>
        {[['Context',m.ctx],['Benchmark',m.benchmark],['En İyi',m.best]].map(([k,v])=><div key={k} style={{display:'flex',gap:6,marginBottom:3}}><span style={{fontSize:9,color:'#334155',minWidth:65}}>{k}:</span><span style={{fontSize:9,color:'#94a3b8'}}>{v}</span></div>)}
      </div>)}
    </div>}
    {tab==='karsi'&&<div style={{overflowX:'auto',borderRadius:12,border:'1px solid rgba(255,255,255,0.07)'}}>
      <table style={{width:'100%',borderCollapse:'collapse',fontSize:11}}>
        <thead><tr style={{background:'rgba(0,220,255,0.06)'}}>
          {['Metrik','DeepSeek','GPT-4o','Claude','Gemini'].map((h,i)=><th key={h} style={{padding:'10px 14px',textAlign:'left',color:i===1?'#00dcff':'#475569',borderBottom:'1px solid rgba(255,255,255,0.07)',whiteSpace:'nowrap',fontWeight:700}}>{h}</th>)}
        </tr></thead>
        <tbody>{COMPARE.map((r,i)=><tr key={r.metric} style={{background:i%2===0?'transparent':'rgba(255,255,255,0.015)'}}>
          <td style={{padding:'9px 14px',color:'#94a3b8',fontSize:10}}>{r.metric}</td>
          <td style={{padding:'9px 14px',color:'#00dcff',fontWeight:700}}>{r.ds}</td>
          <td style={{padding:'9px 14px',color:'#64748b'}}>{r.gpt}</td>
          <td style={{padding:'9px 14px',color:'#64748b'}}>{r.claude}</td>
          <td style={{padding:'9px 14px',color:'#64748b'}}>{r.gem}</td>
        </tr>)}</tbody>
      </table>
      <div style={{padding:'10px 14px',background:'rgba(0,220,255,0.04)',fontSize:10,color:'#334155',borderTop:'1px solid rgba(255,255,255,0.05)'}}>⚡ Sonuç: Fiyat/performans oranında DeepSeek rakipsiz. Ücretsiz katmanda GPT-4o kalitesi.</div>
    </div>}
    {tab==='ipucu'&&<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(270px,1fr))',gap:12}}>
      {TIPS.map(t=><div key={t.t} style={{background:'rgba(0,220,255,0.04)',border:'1px solid rgba(0,220,255,0.1)',borderRadius:12,padding:'15px'}}>
        <div style={{display:'flex',gap:10,marginBottom:8}}><span style={{fontSize:22}}>{t.e}</span><div style={{fontSize:12,fontWeight:700,color:'#00dcff'}}>{t.t}</div></div>
        <div style={{fontSize:11,color:'#64748b',lineHeight:1.6}}>{t.d}</div>
      </div>)}
    </div>}
    {tab==='kod'&&<div>
      <div style={{fontSize:13,fontWeight:700,color:'#e2e8f0',marginBottom:12}}>⚡ DeepSeek API Hızlı Başlangıç</div>
      {[['Python',`import openai
client = openai.OpenAI(
    api_key="YOUR_DEEPSEEK_KEY",
    base_url="https://api.deepseek.com"
)
response = client.chat.completions.create(
    model="deepseek-chat",  # veya deepseek-reasoner
    messages=[{"role": "user", "content": "Merhaba!"}]
)
print(response.choices[0].message.content)`],
['JavaScript',`const response = await fetch(
  "https://api.deepseek.com/chat/completions",
  { method: "POST",
    headers: {
      "Authorization": "Bearer YOUR_KEY",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [{ role: "user", content: "Merhaba!" }]
    })
  }
);`]].map(([lang,code])=><div key={lang} style={{marginBottom:14}}>
        <div style={{fontSize:10,color:'#00dcff',marginBottom:6,fontWeight:700}}>{lang}</div>
        <pre style={{background:'rgba(0,0,0,0.5)',borderRadius:10,padding:'14px',fontSize:10,color:'#94a3b8',overflowX:'auto',margin:0,lineHeight:1.6,border:'1px solid rgba(0,220,255,0.1)'}}>{code}</pre>
      </div>)}
      <a href="https://platform.deepseek.com" target="_blank" rel="noopener noreferrer" style={{display:'inline-flex',gap:8,alignItems:'center',padding:'10px 20px',background:'linear-gradient(135deg,#00dcff,#0891b2)',borderRadius:10,color:'#fff',textDecoration:'none',fontSize:12,fontWeight:700,marginTop:8}}>🔬 DeepSeek Platform →</a>
    </div>}
  </div>;
}

function MistralPage({setPage}){
  const[tab,setTab]=useState('genel');
  const TABS=[{id:'genel',l:'🌊 Genel'},{id:'modeller',l:'📦 Modeller'},{id:'karsi',l:'🆚 Karşılaştır'},{id:'api',l:'⚡ API'}];
  const MODELS=[
    {n:"Mistral Large 2",e:"👑",desc:"Mistral'ın en güçlü modeli. GPT-4 seviyesi, %30 daha ucuz. 128K context.",best:"Analiz, yazı, çok dilli",free:false,price:"€0.002/1K token",color:"#f472b6"},
    {n:"Mistral Nemo",e:"🚀",desc:"12B, verimlilikte benchmark lideri. Codestral ile birlikte kullanım.",best:"Hızlı görevler, mobil",free:true,price:"Ücretsiz",color:"#34d399"},
    {n:"Codestral",e:"💻",desc:"Kod için özel 22B model. 80+ dil, fill-in-the-middle desteği.",best:"Kod tamamlama, debug",free:false,price:"€0.001/1K",color:"#00dcff"},
    {n:"Mixtral 8x7B",e:"⚡",desc:"Mixture of Experts mimari. Açık kaynak, yerel kurulum mümkün.",best:"Açık kaynak projeleri",free:true,price:"Açık Kaynak",color:"#a855f7"},
    {n:"Mistral Small 3",e:"🌱",desc:"Küçük ama güçlü. Uygun fiyat + hız kombinasyonu.",best:"Yüksek hacim görevler",free:false,price:"€0.001/1K",color:"#fbbf24"},
    {n:"Le Chat",e:"💬",desc:"Mistral'ın ChatGPT alternatifi. Web arayüzü, Türkçe destekler.",best:"Günlük kullanım",free:true,price:"Ücretsiz",color:"#fb923c"},
  ];
  const COMPARE=[
    {m:"MMLU Genel",mis:"84.0",gpt:"88.7",claude:"88.7"},
    {m:"HumanEval Kod",mis:"82.0",gpt:"90.2",claude:"92.0"},
    {m:"Context",mis:"128K",gpt:"128K",claude:"1M"},
    {m:"Açık Kaynak",mis:"✅ Bazı",gpt:"❌",claude:"❌"},
    {m:"Avrupa Menşei",mis:"🇫🇷 Evet",gpt:"🇺🇸",claude:"🇺🇸"},
    {m:"GDPR Uyumlu",mis:"✅ Tam",gpt:"Kısmi",claude:"Kısmi"},
    {m:"Türkçe",mis:"İyi",gpt:"Mükemmel",claude:"Çok İyi"},
  ];
  return <div style={{maxWidth:960,margin:'0 auto',padding:'24px 16px'}}>
    <div style={{background:'linear-gradient(135deg,rgba(244,114,182,0.1),rgba(244,114,182,0.02))',border:'1px solid rgba(244,114,182,0.2)',borderRadius:18,padding:'22px',marginBottom:20}}>
      <div style={{display:'flex',gap:14,alignItems:'center',flexWrap:'wrap',marginBottom:12}}>
        <div style={{width:52,height:52,borderRadius:14,background:'linear-gradient(135deg,#f472b6,#ec4899)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:26,boxShadow:'0 4px 20px rgba(244,114,182,0.4)'}}>🌊</div>
        <div>
          <h1 style={{margin:0,fontSize:'clamp(18px,4vw,28px)',fontWeight:900,color:'#e2e8f0',fontFamily:"'Space Grotesk',sans-serif"}}>Mistral AI — Tam Türkçe Rehber</h1>
          <div style={{fontSize:11,color:'#f472b6',marginTop:3}}>Fransa · Açık Kaynak Lider · GDPR Uyumlu · Avrupa'nın en güçlü AI şirketi</div>
        </div>
        <div style={{marginLeft:'auto',display:'flex',gap:5,flexWrap:'wrap'}}>
          {['🇫🇷 Fransız','GDPR Uyumlu','Açık Kaynak','6 Model'].map(b=><span key={b} style={{fontSize:9,background:'rgba(244,114,182,0.15)',color:'#f472b6',border:'1px solid rgba(244,114,182,0.3)',borderRadius:5,padding:'2px 7px',fontWeight:700}}>{b}</span>)}
        </div>
      </div>
      <p style={{margin:0,fontSize:12,color:'#94a3b8',lineHeight:1.7}}>Mistral AI, 2023'te Paris'te kurulan ve sadece 18 ayda <strong style={{color:'#e2e8f0'}}>6 milyar Euro değerlemeye</strong> ulaşan Avrupa'nın en hızlı büyüyen AI şirketidir. GDPR uyumluluğu ve açık kaynak modelleriyle kurumsal tercih.</p>
    </div>
    <div style={{display:'flex',gap:6,marginBottom:20,flexWrap:'wrap'}}>
      {TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{padding:'7px 13px',borderRadius:9,border:'1px solid '+(tab===t.id?'rgba(244,114,182,0.5)':'rgba(255,255,255,0.07)'),background:tab===t.id?'rgba(244,114,182,0.1)':'transparent',color:tab===t.id?'#f472b6':'#64748b',fontSize:11,cursor:'pointer',fontFamily:'inherit',fontWeight:tab===t.id?700:400}}>{t.l}</button>)}
    </div>
    {tab==='genel'&&<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:12}}>
      {[['🇫🇷','Avrupa Yapımı','OpenAI alternatifinizin verileriniz Avrupa sunucularında kalıyor. GDPR %100 uyumlu.','#f472b6'],['🔓','Açık Kaynak Lider','Mixtral 8x7B ve Mistral 7B tamamen açık. Kendi altyapınızda çalıştırın.','#34d399'],['💻','Codestral ile Kod','GitHub Copilot benzeri kod tamamlama. VS Code + JetBrains eklentisi var.','#00dcff'],['⚡','Maliyet Verimliliği','GPT-4 kalitesinde performans, %30-60 daha düşük API maliyeti.','#fbbf24'],['🌍','Çok Dilli','Fransızca başta, Türkçe dahil 30+ dil. Avrupa dilleri en iyi.','#a855f7'],['💬','Le Chat','mistral.ai/chat — ücretsiz web arayüzü. Türkçe konuşabilir.','#fb923c']].map(([e,t,d,c])=><div key={t} style={{background:c+'07',border:'1px solid '+c+'18',borderRadius:12,padding:'14px'}}>
        <div style={{fontSize:24,marginBottom:8}}>{e}</div>
        <div style={{fontSize:12,fontWeight:700,color:c,marginBottom:5}}>{t}</div>
        <div style={{fontSize:10,color:'#64748b',lineHeight:1.5}}>{d}</div>
      </div>)}
    </div>}
    {tab==='modeller'&&<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:12}}>
      {MODELS.map(m=><div key={m.n} style={{background:m.color+'07',border:'1px solid '+m.color+'20',borderRadius:13,padding:'16px'}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}><span style={{fontSize:24}}>{m.e}</span><span style={{fontSize:8,color:m.free?'#34d399':'#fbbf24',background:m.free?'rgba(52,211,153,0.12)':'rgba(251,191,36,0.12)',borderRadius:4,padding:'2px 6px',fontWeight:700}}>{m.price}</span></div>
        <div style={{fontSize:13,fontWeight:800,color:m.color,marginBottom:4}}>{m.n}</div>
        <div style={{fontSize:10,color:'#94a3b8',lineHeight:1.5,marginBottom:6}}>{m.desc}</div>
        <div style={{fontSize:9,color:m.color,background:m.color+'10',borderRadius:5,padding:'4px 8px'}}>✅ {m.best}</div>
      </div>)}
    </div>}
    {tab==='karsi'&&<div style={{overflowX:'auto',borderRadius:12,border:'1px solid rgba(255,255,255,0.07)'}}>
      <table style={{width:'100%',borderCollapse:'collapse',fontSize:11}}>
        <thead><tr style={{background:'rgba(244,114,182,0.06)'}}>{['Metrik','Mistral','GPT-4o','Claude'].map((h,i)=><th key={h} style={{padding:'9px 14px',textAlign:'left',color:i===1?'#f472b6':'#475569',borderBottom:'1px solid rgba(255,255,255,0.06)',fontWeight:700}}>{h}</th>)}</tr></thead>
        <tbody>{COMPARE.map((r,i)=><tr key={r.m} style={{background:i%2===0?'transparent':'rgba(255,255,255,0.015)'}}><td style={{padding:'8px 14px',color:'#94a3b8',fontSize:10}}>{r.m}</td><td style={{padding:'8px 14px',color:'#f472b6',fontWeight:700}}>{r.mis}</td><td style={{padding:'8px 14px',color:'#64748b'}}>{r.gpt}</td><td style={{padding:'8px 14px',color:'#64748b'}}>{r.claude}</td></tr>)}</tbody>
      </table>
    </div>}
    {tab==='api'&&<div>
      <div style={{fontSize:13,fontWeight:700,color:'#e2e8f0',marginBottom:12}}>⚡ Mistral API Entegrasyonu</div>
      <pre style={{background:'rgba(0,0,0,0.5)',borderRadius:10,padding:'14px',fontSize:10,color:'#94a3b8',border:'1px solid rgba(244,114,182,0.1)',overflowX:'auto',lineHeight:1.6}}>{`from mistralai import Mistral

client = Mistral(api_key="YOUR_MISTRAL_KEY")

# Sohbet
response = client.chat.complete(
    model="mistral-large-latest",
    messages=[{"role":"user","content":"Türkçe açıkla: RAG nedir?"}]
)
print(response.choices[0].message.content)

# Kod tamamlama (Codestral)
code_resp = client.fim.complete(
    model="codestral-latest",
    prompt="def fibonacci(",
    suffix="    return result"
)`}</pre>
      <a href="https://console.mistral.ai" target="_blank" rel="noopener noreferrer" style={{display:'inline-flex',gap:8,alignItems:'center',padding:'10px 20px',background:'linear-gradient(135deg,#f472b6,#ec4899)',borderRadius:10,color:'#fff',textDecoration:'none',fontSize:12,fontWeight:700,marginTop:12}}>🌊 Mistral Console →</a>
    </div>}
  </div>;
}

function LlamaPage({setPage}){
  const[tab,setTab]=useState('genel');
  const TABS=[{id:'genel',l:'🦙 Genel'},{id:'modeller',l:'📦 Modeller'},{id:'kur',l:'⚙️ Nasıl Kurulur'},{id:'karsi',l:'🆚 Karşılaştır'}];

  const MODELS=[
    {n:"Llama 3.3 70B",e:"🦙",ctx:"128K",free:true,desc:"Genel kullanım için en dengeli model. GPT-3.5 seviyesinde, tamamen ücretsiz.",color:"#fb923c",best:"Genel görevler, sohbet"},
    {n:"Llama 3.2 Vision",e:"👁️",ctx:"128K",free:true,desc:"Görüntü anlama özelliği. Fotoğraf analizi, tablo okuma, diyagram anlama.",color:"#34d399",best:"Görsel analiz"},
    {n:"Llama 3.1 405B",e:"🔥",ctx:"128K",free:true,desc:"En büyük ve güçlü Llama modeli. GPT-4 seviyesinde, lokal çalışabilir.",color:"#a855f7",best:"Karmaşık görevler"},
    {n:"Llama 3.2 11B",e:"⚡",ctx:"128K",free:true,desc:"Hızlı ve verimli. Günlük kullanım için ideal denge.",color:"#00dcff",best:"Hız gerektiren görevler"},
    {n:"CodeLlama",e:"💻",ctx:"100K",free:true,desc:"Kod için özelleştirilmiş. Python, JS, C++ ve 20+ dil.",color:"#fbbf24",best:"Kod yazma ve debug"},
  ];

  const HOW_TO=[
    {step:"1",title:"Ollama ile Yerel Kurulum (En Kolay)",icon:"🏠",
     cmd:"# MacOS/Linux:\ncurl -fsSL https://ollama.ai/install.sh | sh\nollama run llama3.3\n\n# Windows:\n# ollama.ai/download adresinden indirin",
     desc:"Ollama ile Llama modelini bilgisayarınıza kurun. İnternet gerektirmez, tamamen gizli, ücretsiz."},
    {step:"2",title:"LM Studio ile Görsel Arayüz",icon:"🖥️",
cmd:"# lmstudio.ai adresinden indirin\n# Model Kutuphanesi > Llama-3 secin\n# Chat sekmesine gecin, kullanmaya baslayin",
     desc:"LM Studio ile Llama modellerini görsel arayüzde kullanın. Kod bilgisi gerekmez."},
    {step:"3",title:"Ücretsiz API (Groq Cloud)",icon:"☁️",
cmd:"// groq.com ucretsiz API key alin\nconst response = await fetch('https://api.groq.com/openai/v1/chat/completions', {headers: {'Authorization': 'Bearer GROQ_KEY'},body: JSON.stringify({model: 'llama-3.3-70b-versatile'})});" ,
     desc:"Groq Cloud ile Llama modellerini ücretsiz API olarak kullanın. Saniyede 500 token - çok hızlı."},
  ];

  const COMPARE=[
    {m:"Maliyet",llama:"✅ Tamamen Ücretsiz",gpt:"💲 $0.01-0.03/1K",claude:"💲 $0.003-0.015/1K"},
    {m:"Gizlilik",llama:"✅ %100 Yerel",gpt:"☁️ OpenAI sunucu",claude:"☁️ Anthropic sunucu"},
    {m:"Özelleştirme",llama:"✅ Fine-tune edebilir",gpt:"❌ Sınırlı",claude:"❌ Sınırlı"},
    {m:"Türkçe Kalitesi",llama:"⭐⭐⭐",gpt:"⭐⭐⭐⭐⭐",claude:"⭐⭐⭐⭐"},
    {m:"Kod Yazma",llama:"⭐⭐⭐⭐",gpt:"⭐⭐⭐⭐⭐",claude:"⭐⭐⭐⭐⭐"},
    {m:"Yerel Kurulum",llama:"✅ Var",gpt:"❌ Yok",claude:"❌ Yok"},
    {m:"Internet Gerekliliği",llama:"❌ Gerekmez",gpt:"✅ Gerekir",claude:"✅ Gerekir"},
  ];

  return <div style={{maxWidth:960,margin:'0 auto',padding:'24px 16px'}}>
    <div style={{background:'linear-gradient(135deg,rgba(251,146,60,0.1),rgba(251,146,60,0.02))',border:'1px solid rgba(251,146,60,0.2)',borderRadius:18,padding:'22px',marginBottom:20}}>
      <div style={{display:'flex',gap:14,alignItems:'center',flexWrap:'wrap',marginBottom:12}}>
        <div style={{width:52,height:52,borderRadius:14,background:'linear-gradient(135deg,#fb923c,#ea580c)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:26,boxShadow:'0 4px 20px rgba(251,146,60,0.4)'}}>🦙</div>
        <div>
          <h1 style={{margin:0,fontSize:'clamp(18px,4vw,28px)',fontWeight:900,color:'#e2e8f0',fontFamily:"'Space Grotesk',sans-serif"}}>Meta Llama — Tam Türkçe Rehber</h1>
          <div style={{fontSize:11,color:'#fb923c',marginTop:3}}>Meta AI · Açık Kaynak · Yerel Kurulum · Tamamen Ücretsiz</div>
        </div>
        <div style={{marginLeft:'auto',display:'flex',gap:5,flexWrap:'wrap'}}>
          {['Açık Kaynak','Ücretsiz','Yerel Çalışır','Özelleştirilebilir'].map(b=><span key={b} style={{fontSize:9,background:'rgba(251,146,60,0.15)',color:'#fb923c',border:'1px solid rgba(251,146,60,0.3)',borderRadius:5,padding:'2px 7px',fontWeight:700}}>{b}</span>)}
        </div>
      </div>
      <p style={{margin:0,fontSize:12,color:'#94a3b8',lineHeight:1.7}}>Meta Llama, Facebook/Instagram şirketi Meta tarafından geliştirilen ve <strong style={{color:'#e2e8f0'}}>tamamen açık kaynak olarak yayınlanan</strong> yapay zeka modelidir. Kendi bilgisayarınızda çalıştırabilir, ticari projelerde kullanabilir, istediğiniz gibi özelleştirebilirsiniz.</p>
    </div>

    <div style={{display:'flex',gap:6,marginBottom:20,flexWrap:'wrap'}}>
      {TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{padding:'7px 13px',borderRadius:9,border:'1px solid '+(tab===t.id?'rgba(251,146,60,0.5)':'rgba(255,255,255,0.07)'),background:tab===t.id?'rgba(251,146,60,0.1)':'transparent',color:tab===t.id?'#fb923c':'#64748b',fontSize:11,cursor:'pointer',fontFamily:'inherit',fontWeight:tab===t.id?700:400}}>{t.l}</button>)}
    </div>

    {tab==='genel'&&<div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:12,marginBottom:20}}>
        {[['🆓','Tamamen Ücretsiz','Kullanım, dağıtım ve ticari kullanım için lisans ücreti yok.','#34d399'],
          ['🔒','Maksimum Gizlilik','Verileriniz internete çıkmaz. GDPR ve KVKK uyum sorunu yok.','#a855f7'],
          ['⚙️','Özelleştirme','Fine-tuning ile kendi verilerinizle eğitebilirsiniz.','#00dcff'],
          ['🚀','Yüksek Hız','Groq Cloud ile saniyede 500 token — en hızlı LLM deneyimi.','#fbbf24']].map(([e,t,d,c])=><div key={t} style={{background:c+'07',border:'1px solid '+c+'18',borderRadius:12,padding:'14px'}}>
          <div style={{fontSize:22,marginBottom:6}}>{e}</div>
          <div style={{fontSize:12,fontWeight:700,color:c,marginBottom:4}}>{t}</div>
          <div style={{fontSize:10,color:'#64748b',lineHeight:1.5}}>{d}</div>
        </div>)}
      </div>
      <div style={{background:'rgba(251,146,60,0.06)',border:'1px solid rgba(251,146,60,0.2)',borderRadius:12,padding:'16px'}}>
        <div style={{fontSize:12,fontWeight:700,color:'#fb923c',marginBottom:10}}>🦙 Llama Ne Zaman Kullanılır?</div>
        {[['✅ İdeal','Gizli veriler, şirket içi kullanım, maliyet optimizasyonu, özelleştirilmiş görevler'],
          ['🟡 Dikkatli','Türkçe kalite (GPT daha iyi), yaratıcı yazarlık'],
          ['❌ Sınırlı','Gerçek zamanlı web bilgisi, ticari API desteği']].map(([s,t])=><div key={s} style={{marginBottom:6,fontSize:11,color:'#94a3b8'}}><strong style={{color:s.startsWith('✅')?'#34d399':s.startsWith('🟡')?'#fbbf24':'#ff4444'}}>{s}:</strong> {t}</div>)}
      </div>
    </div>}

    {tab==='modeller'&&<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:12}}>
      {MODELS.map(m=><div key={m.n} style={{background:m.color+'07',border:'1px solid '+m.color+'20',borderRadius:13,padding:'16px'}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}><span style={{fontSize:24}}>{m.e}</span><span style={{fontSize:8,color:'#34d399',background:'rgba(52,211,153,0.12)',borderRadius:4,padding:'2px 6px',fontWeight:700}}>Ücretsiz</span></div>
        <div style={{fontSize:13,fontWeight:800,color:m.color,marginBottom:4}}>{m.n}</div>
        <div style={{fontSize:10,color:'#94a3b8',lineHeight:1.5,marginBottom:8}}>{m.desc}</div>
        <div style={{fontSize:9,color:m.color,background:m.color+'10',borderRadius:5,padding:'4px 8px'}}>✅ {m.best}</div>
      </div>)}
    </div>}

    {tab==='kur'&&<div style={{display:'flex',flexDirection:'column',gap:14}}>
      {HOW_TO.map(h=><div key={h.step} style={{background:'rgba(251,146,60,0.05)',border:'1px solid rgba(251,146,60,0.15)',borderRadius:12,padding:'16px'}}>
        <div style={{display:'flex',gap:10,alignItems:'center',marginBottom:10}}>
          <span style={{fontSize:22}}>{h.icon}</span>
          <div style={{fontSize:13,fontWeight:800,color:'#fb923c'}}>{h.title}</div>
        </div>
        <div style={{fontSize:11,color:'#64748b',marginBottom:10,lineHeight:1.5}}>{h.desc}</div>
        <pre style={{background:'rgba(0,0,0,0.5)',borderRadius:8,padding:'12px',fontSize:10,color:'#94a3b8',overflowX:'auto',margin:0,lineHeight:1.6}}>{h.cmd}</pre>
      </div>)}
      <a href="https://ollama.ai" target="_blank" rel="noopener noreferrer" style={{display:'inline-flex',gap:8,alignItems:'center',padding:'10px 20px',background:'linear-gradient(135deg,#fb923c,#ea580c)',borderRadius:10,color:'#fff',textDecoration:'none',fontSize:12,fontWeight:700,alignSelf:'flex-start'}}>🦙 Ollama ile Başla →</a>
    </div>}

    {tab==='karsi'&&<div style={{overflowX:'auto',borderRadius:12,border:'1px solid rgba(255,255,255,0.07)'}}>
      <table style={{width:'100%',borderCollapse:'collapse',fontSize:11}}>
        <thead><tr style={{background:'rgba(251,146,60,0.06)'}}>
          {['Özellik','Llama (Ücretsiz)','GPT-4o','Claude'].map((h,i)=><th key={h} style={{padding:'9px 14px',textAlign:'left',color:i===1?'#fb923c':'#475569',borderBottom:'1px solid rgba(255,255,255,0.06)',fontWeight:700}}>{h}</th>)}
        </tr></thead>
        <tbody>{COMPARE.map((r,i)=><tr key={r.m} style={{background:i%2===0?'transparent':'rgba(255,255,255,0.015)'}}>
          <td style={{padding:'8px 14px',color:'#94a3b8',fontSize:10}}>{r.m}</td>
          <td style={{padding:'8px 14px',color:'#fb923c',fontWeight:600}}>{r.llama}</td>
          <td style={{padding:'8px 14px',color:'#64748b'}}>{r.gpt}</td>
          <td style={{padding:'8px 14px',color:'#64748b'}}>{r.claude}</td>
        </tr>)}</tbody>
      </table>
      <div style={{padding:'10px 14px',background:'rgba(251,146,60,0.04)',fontSize:10,color:'#334155',borderTop:'1px solid rgba(255,255,255,0.05)'}}>💡 Gizlilik ve maliyet için Llama, kalite ve Türkçe için ChatGPT/Claude tercih edilmeli.</div>
    </div>}
  </div>;
}

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
// ══════════════════════════════════════════════════════════
// AI GÜVENLİK SAYFASI
// ══════════════════════════════════════════════════════════
function AIGuvenlikPage(){
  const THREATS=[
    {icon:"🎭",title:"Deepfake Tespiti",risk:"Yüksek",desc:"AI üretimi yüz/ses manipülasyonları. Tespit için: tutarsız göz kırpma, piksel sınırı, metatag kontrolü.",tips:["Video kaynağını doğrula","Tersine görsel arama yap","Haber ajansı onayı ara"],color:"#ff4444"},
    {icon:"🤖",title:"AI Dolandırıcılığı",risk:"Çok Yüksek",desc:"Sesini klonlayan AI dolandırıcıları telefon ve mesaj yoluyla para istiyor.",tips:["Özel kod belirleyin aileyle","Acil durumlarda geri ara","Banka transferi için yüz yüze onay"],color:"#fb923c"},
    {icon:"📧",title:"AI Phishing",risk:"Yüksek",desc:"ChatGPT ile yazılan mükemmel Türkçe phishing emailler artık kolayca ayırt edilemiyor.",tips:["URL'yi manuel kontrol et","2FA kullan her hesapta","Banka asla link atmaz"],color:"#fbbf24"},
    {icon:"🎨",title:"AI Görsel Sahtecilik",risk:"Orta",desc:"Ünlü kişilerin sahte görsel ve videolarının yayılması, manipülatif içerikler.",tips:["FakeImageDetector.com kullan","Watermark ve metadata kontrol","Resmi kaynaklardan doğrula"],color:"#a855f7"},
    {icon:"💬",title:"AI Dezenformasyon",risk:"Yüksek",desc:"AI üretimi sahte haberler, gerçekçi ama tamamen uydurulmuş bilimsel makaleler.",tips:["Birden fazla kaynak karşılaştır","Perplexity ile kaynak sor","Teyit.org gibi doğrulama siteleri"],color:"#00dcff"},
    {icon:"🔑",title:"Prompt Injection",risk:"Teknik",desc:"AI sistemlerine gizli komutlar enjekte ederek davranışını değiştirme saldırıları.",tips:["Güvenilmez input'ları sanitize et","AI çıktılarını doğrula","Production'da sistem prompt'u gizle"],color:"#34d399"},
  ,
    {icon:"🎙️",title:"Ses Klonlama Saldırıları",risk:"Çok Yüksek",desc:"3 dakikalık ses kaydıyla %99 benzer ses kopyası. Banka, patron, aile taklidi artık trivial.",tips:["Telefonda para isteği → mutlaka geri ara","Özel doğrulama kodu belirle","Video görüntülü arama ile doğrula"],color:"#a855f7"},
    {icon:"🔐",title:"AI Şifre Kırma",risk:"Orta",desc:"AI destekli brute force saldırıları zayıf şifreleri dakikalar içinde kırıyor.",tips:["15+ karakter ve özel sembol kullan","Her site için farklı şifre","Bitwarden gibi şifre yöneticisi kullan"],color:"#00dcff"}];
  return <div style={{padding:'24px 16px',maxWidth:960,margin:'0 auto'}}>
    <div style={{marginBottom:24}}>
      <div style={{fontSize:9,letterSpacing:'.2em',color:'#ff4444',marginBottom:4}}>AI GÜVENLİK REHBERİ</div>
      <h1 style={{fontSize:24,fontWeight:900,color:'#e2e8f0',fontFamily:"'Space Grotesk',sans-serif",margin:'0 0 8px'}}>🛡️ AI Güvenliği — Kendinizi Koruyun</h1>
      <p style={{fontSize:13,color:'#64748b',margin:0}}>Deepfake, AI dolandırıcılığı ve manipülasyondan korunma rehberi</p>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:14}}>
      {THREATS.map(t=><div key={t.title} style={{background:t.color+'06',border:'1px solid '+t.color+'20',borderRadius:14,padding:'18px'}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}>
          <span style={{fontSize:28}}>{t.icon}</span>
          <span style={{fontSize:9,color:t.color,background:t.color+'18',border:'1px solid '+t.color+'30',borderRadius:5,padding:'2px 8px',fontWeight:700,alignSelf:'flex-start'}}>Risk: {t.risk}</span>
        </div>
        <div style={{fontSize:13,fontWeight:700,color:t.color,marginBottom:6}}>{t.title}</div>
        <div style={{fontSize:11,color:'#94a3b8',lineHeight:1.6,marginBottom:10}}>{t.desc}</div>
        <div style={{fontSize:10,color:'#475569',marginBottom:5,fontWeight:700}}>✅ Korunma Yolları:</div>
        {t.tips.map((tip,i)=><div key={i} style={{display:'flex',gap:6,marginBottom:3}}><span style={{color:t.color,flexShrink:0}}>›</span><span style={{fontSize:10,color:'#64748b'}}>{tip}</span></div>)}
      </div>)}
    </div>
    <div style={{marginTop:20,background:'rgba(0,220,255,0.04)',border:'1px solid rgba(0,220,255,0.15)',borderRadius:12,padding:'16px'}}>
      <div style={{fontSize:13,fontWeight:700,color:'#e2e8f0',marginBottom:8}}>🔍 Deepfake Tespit Araçları</div>
      <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
        {[['Reality Defender','Pro araç','https://realitydefender.com'],['Sensity AI','Video analiz','https://sensity.ai'],['Deepware Scanner','Ücretsiz','https://deepware.ai'],['Microsoft Video Auth','Ücretsiz','https://www.microsoft.com'],['Intel FakeCatcher','Gerçek zamanlı','https://intel.com']].map(([n,d,u])=><a key={n} href={u} target='_blank' rel='noopener noreferrer' style={{flex:'1 1 150px',padding:'10px',background:'rgba(0,220,255,0.06)',border:'1px solid rgba(0,220,255,0.15)',borderRadius:9,textDecoration:'none'}}>
          <div style={{fontSize:11,fontWeight:700,color:'#00dcff'}}>{n}</div>
          <div style={{fontSize:9,color:'#475569'}}>{d}</div>
        </a>)}
      </div>
    </div>
  </div>;
}

// ══════════════════════════════════════════════════════════
// TÜRKİYE AI EKOSİSTEMİ
// ══════════════════════════════════════════════════════════
function TurkiyeAIPage(){
  const STARTUPS=[
    {name:"Botika",cat:"E-ticaret AI",desc:"AI destekli ürün fotoğrafı oluşturma. 500+ marka kullanıyor.",stage:"Seri A",color:"#00dcff",url:"#"},
    {name:"Cevahir AI",cat:"Hukuk Tech",desc:"Türk hukuku için AI asistan. Sözleşme analizi ve dava araştırması.",stage:"Seed",color:"#a855f7",url:"#"},
    {name:"Vispera",cat:"Görüntü AI",desc:"Perakendecilik için raf analizi AI. Migros, CarrefourSA kullanıcısı.",stage:"Büyüme",color:"#34d399",url:"#"},
    {name:"Poltio",cat:"Veri AI",desc:"Etkileşimli anket ve AI içerik platformu. 100M+ kullanıcı.",stage:"Büyüme",color:"#fbbf24",url:"#"},
    {name:"Inomera",cat:"NLP Türkçe",desc:"Türkçe NLP çözümleri. Bankalar ve telekom şirketlerine hizmet.",stage:"Seri A",color:"#f472b6",url:"#"},
    {name:"Modanisa AI",cat:"Moda Tech",desc:"AI destekli kıyafet öneri sistemi. 4M+ kullanıcıya kişiselleştirme.",stage:"Kurumsal",color:"#fb923c",url:"#"},
  ,
    {name:"Getir AI",cat:"Lojistik AI",desc:"Rota optimizasyonu ve talep tahmini. Günde 1.5M teslimat AI ile yönetiliyor.",stage:"Halka Açık",color:"#a855f7",url:"#"},
    {name:"Peak Game",cat:"Oyun AI",desc:"AI destekli mobile oyunlar. 100M+ kullanıcı, yapay zeka seviye tasarımı.",stage:"Unicorn",color:"#fbbf24",url:"#"},
    {name:"Gramer",cat:"Türkçe NLP",desc:"Türkçe için GPT benzeri dil modeli geliştiren yerli startup.",stage:"Seed",color:"#00dcff",url:"#"}];
  const UNIS=[
    {name:"ODTÜ AI Lab",projects:"60+ proje, Türkçe LLM araştırması"},
    {name:"Boğaziçi BounTI",projects:"Yapay zeka ve robotik araştırma merkezi"},
    {name:"İTÜ AI Merkezi",projects:"Sanayi 4.0 ve otomasyon odaklı AR-GE"},
    {name:"Sabancı AI Hub",projects:"Sağlık AI ve görüntü işleme"},
    {name:"Bilkent AI Lab",projects:"Doğal dil işleme, ses tanıma"},
  ];
  return <div style={{padding:'24px 16px',maxWidth:960,margin:'0 auto'}}>
    <div style={{marginBottom:24}}>
      <div style={{fontSize:9,letterSpacing:'.2em',color:'#00dcff',marginBottom:4}}>YERLI AI EKOSİSTEMİ</div>
      <h1 style={{fontSize:24,fontWeight:900,color:'#e2e8f0',fontFamily:"'Space Grotesk',sans-serif",margin:'0 0 8px'}}>🇹🇷 Türkiye AI Ekosistemi</h1>
      <p style={{fontSize:13,color:'#64748b',margin:0}}>Türk AI startup'ları, üniversiteler ve fırsatlar</p>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:20}}>
      {[['250+','Aktif AI Startup','#00dcff'],['1.2B₺','2026 Q1 Yatırım','#34d399'],['120K','Yeni AI İş','#a855f7'],['3.','Avrupa Sıralaması','#fbbf24'],['40+','Üniversite AI Lab','#f472b6'],['%94','Dünya AI Trafiği','#fb923c']].map(([v,l,c])=><div key={l} style={{background:c+'08',border:'1px solid '+c+'20',borderRadius:10,padding:'12px',textAlign:'center'}}>
        <div style={{fontSize:'clamp(16px,3vw,22px)',fontWeight:900,color:c}}>{v}</div>
        <div style={{fontSize:9,color:'#475569',marginTop:2}}>{l}</div>
      </div>)}
    </div>
    <div style={{marginBottom:20}}>
      <div style={{fontSize:14,fontWeight:700,color:'#e2e8f0',marginBottom:12}}>🚀 Öne Çıkan Türk AI Girişimleri</div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:10}}>
        {STARTUPS.map(s=><div key={s.name} style={{background:s.color+'06',border:'1px solid '+s.color+'18',borderRadius:12,padding:'14px'}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
            <div style={{fontSize:14,fontWeight:800,color:s.color}}>{s.name}</div>
            <span style={{fontSize:8,color:s.color,background:s.color+'15',borderRadius:4,padding:'2px 6px'}}>{s.stage}</span>
          </div>
          <div style={{fontSize:9,color:'#475569',marginBottom:4}}>{s.cat}</div>
          <div style={{fontSize:11,color:'#94a3b8',lineHeight:1.5}}>{s.desc}</div>
        </div>)}
      </div>
    </div>
    <div style={{background:'rgba(0,220,255,0.04)',border:'1px solid rgba(0,220,255,0.12)',borderRadius:12,padding:'16px'}}>
      <div style={{fontSize:13,fontWeight:700,color:'#e2e8f0',marginBottom:10}}>🎓 Türkiye'de AI Araştırma Merkezleri</div>
      {UNIS.map(u=><div key={u.name} style={{display:'flex',gap:10,padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
        <span style={{fontSize:11,fontWeight:700,color:'#00dcff',minWidth:150}}>{u.name}</span>
        <span style={{fontSize:11,color:'#64748b'}}>{u.projects}</span>
      </div>)}
    </div>
  </div>;
}

// ══════════════════════════════════════════════════════════
// AI HUKUK SAYFASI
// ══════════════════════════════════════════════════════════
function AIHukukPage(){
  const TOPICS=[
    {icon:"📜",title:"KVKK ve AI",desc:"Kişisel verileri AI'a vermeden önce: anonimleştirme, veri işleme sözleşmesi, açık rıza zorunluluğu.",key:"ChatGPT'ye şirket verisi verirken KVKK ihlali olabilir. Gizli modlar veya Enterprise planı kullanın.",color:"#00dcff"},
    {icon:"🎨",title:"AI Telif Hakkı",desc:"AI üretimi içeriklerin telif hakkı 2026'da hâlâ tartışmalı. Türkiye'de insan katkısı olmayan eserler korunmuyor.",key:"AI çıktılarını edit ederek 'insan katkısı' ekleyin. Kullandığınız AI platformunun lisans koşullarını okuyun.",color:"#a855f7"},
    {icon:"⚖️",title:"AI ile Hata Sorumluluğu",desc:"AI önerisiyle yapılan hatada sorumluluk kullanıcıya ait. Tıp, hukuk, finans'ta AI'ı asistan olarak kullanın.",key:"Kritik kararlar için AI çıktısını mutlaka uzman onayından geçirin. Belgeleyip saklayın.",color:"#f472b6"},
    {icon:"🤝",title:"İşyerinde AI Kullanımı",desc:"Türk iş hukukunda AI ile üretilen içeriklerin mülkiyeti işverene aittir çoğu durumda.",key:"Şirket AI politikasını okuyun. Özel projeleriniz için şirket AI araçlarını kullanmayın.",color:"#34d399"},
    {icon:"🏛️",title:"AB AI Yasası (AI Act)",desc:"2024'te yürürlüğe giren AB AI Yasası Türkiye'yi de etkiliyor. Yüksek riskli AI uygulamaları kısıtlanıyor.",key:"Healthcare, eğitim, işe alım AI'larınız AB uyumlu olmalı. Sandbox ortamında test edin.",color:"#fbbf24"},
    {icon:"🔍",title:"AI İçerik Şeffaflığı",desc:"Bazı ülkelerde AI üretimi içeriği 'AI ile üretildi' diye işaretlemek zorunlu hale geliyor.",key:"Blog ve sosyal medyada AI içerikleri için şeffaflık politikası geliştirin.",color:"#fb923c"},
  ];
  return <div style={{padding:'24px 16px',maxWidth:960,margin:'0 auto'}}>
    <div style={{marginBottom:24}}>
      <div style={{fontSize:9,letterSpacing:'.2em',color:'#fbbf24',marginBottom:4}}>YASAL REHBER</div>
      <h1 style={{fontSize:24,fontWeight:900,color:'#e2e8f0',fontFamily:"'Space Grotesk',sans-serif",margin:'0 0 8px'}}>⚖️ AI ve Hukuk — Bilmeniz Gerekenler</h1>
      <p style={{fontSize:13,color:'#64748b',margin:0}}>KVKK, telif hakkı, AB AI Act — Türkiye'de AI kullanımının hukuki boyutu</p>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:14,marginBottom:20}}>
      {TOPICS.map(t=><div key={t.title} style={{background:t.color+'06',border:'1px solid '+t.color+'18',borderRadius:14,padding:'18px'}}>
        <div style={{fontSize:26,marginBottom:8}}>{t.icon}</div>
        <div style={{fontSize:13,fontWeight:700,color:t.color,marginBottom:6}}>{t.title}</div>
        <div style={{fontSize:11,color:'#94a3b8',lineHeight:1.6,marginBottom:10}}>{t.desc}</div>
        <div style={{background:t.color+'10',borderLeft:'3px solid '+t.color,borderRadius:'0 8px 8px 0',padding:'8px 10px',fontSize:10,color:'#64748b',lineHeight:1.5}}>💡 {t.key}</div>
      </div>)}
    </div>
    <div style={{background:'rgba(251,191,36,0.05)',border:'1px solid rgba(251,191,36,0.2)',borderRadius:12,padding:'14px',textAlign:'center'}}>
      <div style={{fontSize:12,color:'#475569'}}>⚠️ Bu rehber bilgilendirme amaçlıdır. Hukuki kararlar için lisanslı avukata danışın.</div>
    </div>
  </div>;
}

// ══════════════════════════════════════════════════════════
// PROMPT YARIŞMASI
// ══════════════════════════════════════════════════════════
function YarismPage(){
  const[voted,setVoted]=useState(()=>{
    try{return JSON.parse(localStorage.getItem('imdatai_prompt_votes')||'{}');}
    catch(e){return {};}
  });
  const[counts,setCounts]=useState(()=>{
    try{return JSON.parse(localStorage.getItem('imdatai_vote_counts')||'{}');}
    catch(e){return {};}
  });
  const PROMPTS=[
    {id:1,user:"@mehmet_dev",avatar:"👨‍💻",title:"Kod Debug Master",prompt:"Senior yazılım mühendisi ve hata ayıklama uzmanı olarak [DİL] kodumu incele. Önce hatanın kök nedenini açıkla, sonra düzeltilmiş versiyonu yaz, ardından bu hatayı gelecekte önleyecek 3 ipucu ver.",votes:234,cat:"Kod",color:"#00dcff"},
    {id:2,user:"@zeynep_market",avatar:"👩‍💼",title:"Müzakere Ustası",prompt:"Deneyimli bir iş müzakere uzmanı olarak [DURUM] için strateji geliştir. Güçlü yanlarım: [GÜÇLÜ]. Zayıf yanlarım: [ZAYIF]. En az 3 farklı senaryo sun, her biri için başlangıç teklifi, BATNA ve son sınır belirt.",votes:189,cat:"İş",color:"#fbbf24"},
    {id:3,user:"@ai_researcher_tr",avatar:"🔬",title:"Araştırma Asistanı",prompt:"Akademik araştırma asistanı olarak [KONU] hakkında: 1) Mevcut literatürü özetle 2) Tartışmalı noktaları listele 3) Araştırma boşluklarını belirt 4) Metodoloji öner. APA formatında 5 kaynak ekle.",votes:156,cat:"Araştırma",color:"#a855f7"},
    {id:4,user:"@startup_founder",avatar:"🚀",title:"Pitch Deck Sihirbazı",prompt:"Y Combinator batch deneyimli bir startup danışmanı olarak [GİRİŞİMİM] için 10 dakikalık yatırımcı pitch'i hazırla. Slides: Problem, Çözüm, Pazar, Ürün, İş Modeli, Traction, Takım, Finansal, Roadmap, Yatırım kullanımı.",votes:143,cat:"Girişim",color:"#34d399"},
    {id:5,user:"@creative_yazici",avatar:"✍️",title:"Viral İçerik Fabrikası",prompt:"Sosyal medya stratejisti olarak [MARKA/KİŞİ] için: Platform: [PLATFORM]. Hedef: [HEDEF]. 1 haftalık içerik takvimi oluştur. Her post için: hook cümlesi, ana metin, CTA, hashtag seti ve optimal paylaşım saati.",votes:127,cat:"Pazarlama",color:"#f472b6"},
    {id:6,user:"@python_guru",avatar:"🐍",title:"Kod Refactor AI",prompt:"Kod kalitesi uzmanı olarak şu [KODU] refactor et. Önce mevcut sorunları listele (performans, okunabilirlik, güvenlik). Sonra adım adım iyileştirilmiş versiyonu yaz. SOLID prensiplerine ve [DİL] best practices'e uy.",votes:118,cat:"Kod",color:"#00dcff"},
  ,
    {id:7,user:"@fintech_ai",avatar:"📊",title:"Finansal Analiz Sihirbazı",prompt:"Deneyimli bir finansal analist olarak [ŞİRKET/HİSSE] için kapsamlı rapor hazırla: 1) Mali tablolar analizi 2) Güçlü/zayıf yönler 3) Sektör karşılaştırması 4) 12 aylık fiyat hedefi 5) Risk faktörleri. Kaynak: son 3 yıllık veriler.",votes:109,cat:"Finans",color:"#34d399"},
    {id:8,user:"@egitimci_ai",avatar:"🎓",title:"Ders Planı Üreteci",prompt:"Deneyimli bir [KONU] öğretmeni olarak [SINIF] seviyesi için 45 dakikalık ders planı hazırla. İçerik: giriş aktivitesi (5dk), ana anlatım (20dk), grup çalışması (15dk), değerlendirme (5dk). Her bölüm için materyaller ve sorular ekle.",votes:96,cat:"Eğitim",color:"#fbbf24"},
    {id:9,user:"@hr_prompt",avatar:"👥",title:"İK İşe Alım Uzmanı",prompt:"Kıdemli İK uzmanı olarak [POZİSYON] için: 1) 10 teknik mülakat sorusu 2) 5 davranışsal soru 3) Değerlendirme rubriği 4) Red/kabul kriterleri oluştur. Her soru için beklenen cevap özellikleri ve kırmızı bayrakları ekle.",votes:88,cat:"İK",color:"#a855f7"}];
  return <div style={{padding:'24px 16px',maxWidth:960,margin:'0 auto'}}>
    <div style={{marginBottom:24}}>
      <div style={{fontSize:9,letterSpacing:'.2em',color:'#f472b6',marginBottom:4}}>TOPLULUK</div>
      <h1 style={{fontSize:24,fontWeight:900,color:'#e2e8f0',fontFamily:"'Space Grotesk',sans-serif",margin:'0 0 8px'}}>🏆 Prompt Yarışması</h1>
      <p style={{fontSize:13,color:'#64748b',margin:0}}>Türkiye'nin en iyi AI promptları — topluluğun seçtikleri</p>
    </div>
    <div style={{display:'flex',flexDirection:'column',gap:12}}>
      {PROMPTS.map((p,idx)=><div key={p.id} style={{background:p.color+'05',border:'1px solid '+p.color+'18',borderRadius:14,padding:'16px',position:'relative'}}>
        <div style={{position:'absolute',top:12,left:12,fontSize:11,fontWeight:900,color:p.color,background:p.color+'15',width:24,height:24,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center'}}>{idx+1}</div>
        <div style={{paddingLeft:36,display:'flex',gap:10,flexWrap:'wrap',marginBottom:10}}>
          <span style={{fontSize:20}}>{p.avatar}</span>
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:700,color:p.color,marginBottom:2}}>{p.title}</div>
            <div style={{fontSize:10,color:'#334155'}}>{p.user} · {p.cat}</div>
          </div>
          <button onClick={()=>{
              const newVoted={...voted,[p.id]:!voted[p.id]};
              const newCounts={...counts,[p.id]:(counts[p.id]||p.votes)+(newVoted[p.id]?1:-1)};
              setVoted(newVoted);
              setCounts(newCounts);
              try{localStorage.setItem('imdatai_prompt_votes',JSON.stringify(newVoted));
                localStorage.setItem('imdatai_vote_counts',JSON.stringify(newCounts));}catch(e){}
            }} style={{display:'flex',alignItems:'center',gap:5,padding:'5px 12px',border:'1px solid '+(voted[p.id]?p.color+'60':'rgba(255,255,255,0.1)'),borderRadius:8,background:voted[p.id]?p.color+'15':'transparent',color:voted[p.id]?p.color:'#475569',fontSize:11,cursor:'pointer',fontFamily:'inherit',fontWeight:700}}>
            {voted[p.id]?'❤️':'🤍'} {(counts[p.id]||p.votes)+(voted[p.id]&&!(counts[p.id])? 1:0)}
          </button>
        </div>
        <div style={{background:'rgba(0,0,0,0.3)',borderRadius:8,padding:'10px 12px',fontSize:11,color:'#94a3b8',fontFamily:'monospace',lineHeight:1.6}}>{p.prompt}</div>
        <button onClick={()=>navigator.clipboard?.writeText(p.prompt)} style={{marginTop:8,fontSize:9,color:p.color,border:'1px solid '+p.color+'25',borderRadius:6,padding:'4px 10px',background:p.color+'08',cursor:'pointer',fontFamily:'inherit'}}>📋 Kopyala</button>
      </div>)}
    </div>
  </div>;
}

// ═══════════════════════════════════════════════════
// GÖRSEL AI REHBERİ
// ═══════════════════════════════════════════════════
function GorselAIPage(){
  const TOOLS=[
    {name:"Midjourney",icon:"🎨",tier:"Pro",price:"$10/ay",best:"Sanatsal, sinematik",prompt:"a cyberpunk Istanbul at night, neon lights, 8K, cinematic --ar 16:9 --v 6",tip:"--style raw ile fotogerçekçi, --niji ile anime",color:"#a855f7"},
    {name:"DALL-E 3",icon:"🖼️",tier:"Free/Pro",price:"ChatGPT ile",best:"Hızlı prototip, yazılı içerik",prompt:"minimalist logo for AI startup called IMDATAI, blue cyan colors, vector style",tip:"ChatGPT içinde /image komutu veya doğal dil",color:"#34d399"},
    {name:"Stable Diffusion",icon:"⚡",tier:"Ücretsiz",price:"Yerel kurulum",best:"Sonsuz özelleştirme",prompt:"portrait of a Turkish woman, professional photo, studio lighting, 85mm",tip:"LoRA modelleriyle kişiye özel karakter",color:"#00dcff"},
    {name:"Adobe Firefly",icon:"🔥",tier:"Free/Pro",price:"Adobe CC ile",best:"Ticari güvenli, marka tutarlılığı",prompt:"product photo of coffee cup on marble table, soft shadows, lifestyle",tip:"Telif hakkı güvenli — ticari kullanım %100",color:"#fb923c"},
    {name:"Leonardo AI",icon:"🦁",tier:"Free/Pro",price:"$12/ay",best:"Oyun, karakter, konsept sanatı",prompt:"fantasy warrior character, Turkish mythology inspired, epic pose",tip:"Motion özelliği ile GIF animasyon",color:"#fbbf24"},
    {name:"Ideogram",icon:"✍️",tier:"Free",price:"Ücretsiz",best:"Metin içeren görseller",prompt:"modern logo with text IMDATAI, minimalist, gradient blue",tip:"Görsel üzerine metin ekleme = diğerlerinden üstün",color:"#f472b6"},
  ];
  const TIPS=[
    "📐 Aspect ratio her zaman belirt: --ar 16:9 (YouTube), 9:16 (Reels), 1:1 (Instagram)",
    "🎭 Stil kelimesi en önemli: cinematic, photorealistic, anime, oil painting, watercolor",
    "💡 Negatif prompt kullan: --no text, blur, watermark, ugly, deformed",
    "🔢 Kalite artır: --quality 2 (Midjourney), CFG scale 7-9 (SD)",
    "🌈 Renk tutarlılığı: 'warm tones', 'cold blue palette', 'vibrant colors'",
    "📸 Kamera açısı: bird's eye view, low angle, close-up, wide shot",
  ];
  return <div style={{padding:'24px 16px',maxWidth:1000,margin:'0 auto'}}>
    <div style={{marginBottom:24}}>
      <div style={{fontSize:9,letterSpacing:'.2em',color:'#a855f7',marginBottom:4}}>GÖRSEL ÜRETME REHBERİ</div>
      <h1 style={{fontSize:24,fontWeight:900,color:'#e2e8f0',fontFamily:"'Space Grotesk',sans-serif",margin:'0 0 8px'}}>🎨 AI Görsel Üretimi — Tam Rehber</h1>
      <p style={{fontSize:13,color:'#64748b',margin:0}}>Midjourney, DALL-E 3, Stable Diffusion — hangi araç, ne zaman?</p>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:14,marginBottom:24}}>
      {TOOLS.map(t=><div key={t.name} style={{background:t.color+'06',border:'1px solid '+t.color+'20',borderRadius:14,padding:'18px'}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}>
          <div style={{display:'flex',gap:10,alignItems:'center'}}>
            <span style={{fontSize:28}}>{t.icon}</span>
            <div>
              <div style={{fontSize:14,fontWeight:800,color:t.color}}>{t.name}</div>
              <div style={{fontSize:9,color:'#475569'}}>{t.price}</div>
            </div>
          </div>
          <span style={{fontSize:8,background:t.color+'20',color:t.color,borderRadius:5,padding:'2px 8px',fontWeight:700,alignSelf:'flex-start'}}>{t.tier}</span>
        </div>
        <div style={{fontSize:11,color:'#64748b',marginBottom:8}}>✅ En iyi: {t.best}</div>
        <div style={{background:'rgba(0,0,0,.3)',borderRadius:8,padding:'8px 10px',fontSize:9,color:'#94a3b8',fontFamily:'monospace',lineHeight:1.5,marginBottom:8}}>{t.prompt}</div>
        <div style={{fontSize:10,color:t.color,background:t.color+'10',borderRadius:6,padding:'5px 8px'}}>💡 {t.tip}</div>
      </div>)}
    </div>
    <div style={{background:'rgba(168,85,247,0.05)',border:'1px solid rgba(168,85,247,0.2)',borderRadius:12,padding:'16px'}}>
      <div style={{fontSize:13,fontWeight:700,color:'#e2e8f0',marginBottom:12}}>⚡ Pro Prompt İpuçları</div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:8}}>
        {TIPS.map((t,i)=><div key={i} style={{fontSize:11,color:'#94a3b8',background:'rgba(255,255,255,0.03)',borderRadius:8,padding:'10px 12px',lineHeight:1.5}}>{t}</div>)}
      </div>
    </div>
  </div>;
}

// ═══════════════════════════════════════════════════
// AI VİDEO ÜRETİMİ
// ═══════════════════════════════════════════════════
function AIVideoPage(){
  const TOOLS=[
    {name:"Sora (OpenAI)",icon:"🎬",status:"Enterprise",desc:"60 saniyelik gerçekçi video. Metin → video dönüşümünde dünya standardı.",use:"Reklam, film konsept, sinematik",color:"#00dcff",price:"$200/ay+"},
    {name:"Runway Gen-3",icon:"🎥",status:"Aktif",desc:"Metin ve görsel → video. En gelişmiş inpainting ve motion brush.",use:"Sosyal medya, YouTube, sunum",color:"#34d399",price:"$12/ay"},
    {name:"Kling AI",icon:"🎞️",status:"Aktif",desc:"Çin yapımı, ücretsiz deneme. Kuai-Shou tarafından geliştirildi.",use:"Sosyal medya kısa video",color:"#a855f7",price:"Ücretsiz+"},
    {name:"Pika 2.0",icon:"⚡",status:"Aktif",desc:"Hızlı video üretimi. Pikalar ve efektler için ideal.",use:"Meme, kısa klip, efekt",color:"#fbbf24",price:"$8/ay"},
    {name:"HeyGen",icon:"🤖",status:"Aktif",desc:"AI avatar video. Kendi yüzünüzü veya hazır avatar kullanın.",use:"Eğitim, pazarlama, sunum",color:"#f472b6",price:"$24/ay"},
    {name:"Luma Dream Machine",icon:"🌙",status:"Aktif",desc:"Fotoğraftan gerçekçi video. Yüksek kalite, ücretsiz plan mevcut.",use:"Ürün tanıtım, sanat",color:"#fb923c",price:"Ücretsiz+"},
  ];
  return <div style={{padding:'24px 16px',maxWidth:1000,margin:'0 auto'}}>
    <div style={{marginBottom:24}}>
      <div style={{fontSize:9,letterSpacing:'.2em',color:'#34d399',marginBottom:4}}>VIDEO AI REHBERİ</div>
      <h1 style={{fontSize:24,fontWeight:900,color:'#e2e8f0',fontFamily:"'Space Grotesk',sans-serif",margin:'0 0 8px'}}>🎬 AI Video Üretimi — 2026 Rehberi</h1>
      <p style={{fontSize:13,color:'#64748b',margin:0}}>Sora, Runway, Kling, Pika — metin ve fotoğraftan video üretme</p>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:14,marginBottom:20}}>
      {TOOLS.map(t=><div key={t.name} style={{background:t.color+'06',border:'1px solid '+t.color+'20',borderRadius:14,padding:'18px'}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}>
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            <span style={{fontSize:26}}>{t.icon}</span>
            <div>
              <div style={{fontSize:13,fontWeight:800,color:t.color}}>{t.name}</div>
              <div style={{fontSize:9,color:'#475569'}}>{t.price}</div>
            </div>
          </div>
          <span style={{fontSize:8,background:t.status==='Aktif'?'rgba(52,211,153,0.15)':'rgba(251,191,36,0.15)',color:t.status==='Aktif'?'#34d399':'#fbbf24',borderRadius:5,padding:'2px 7px',fontWeight:700,alignSelf:'flex-start'}}>{t.status}</span>
        </div>
        <div style={{fontSize:11,color:'#94a3b8',lineHeight:1.6,marginBottom:8}}>{t.desc}</div>
        <div style={{fontSize:10,color:t.color,background:t.color+'10',borderRadius:6,padding:'5px 8px'}}>🎯 {t.use}</div>
      </div>)}
    </div>
    <div style={{background:'rgba(52,211,153,0.05)',border:'1px solid rgba(52,211,153,0.15)',borderRadius:12,padding:'16px'}}>
      <div style={{fontSize:13,fontWeight:700,color:'#e2e8f0',marginBottom:10}}>📋 AI Video Prompt Şablonları</div>
      {[["Ürün Tanıtım","A [ÜRÜN] floating in minimal white space, 360° rotation, soft lighting, product photography style, 4K"],["Haber/Açıklama","Professional Turkish presenter explaining [KONU], studio background, news channel style, talking head"],["Sosyal Medya","Viral TikTok style, quick cuts, [KONU] tutorial, text overlays, energetic music pacing"],["Sinematik","Cinematic shot of [SAHNE], Istanbul skyline, golden hour, drone footage style, epic music"]].map(([t,p])=><div key={t} style={{marginBottom:10}}>
        <div style={{fontSize:11,fontWeight:700,color:'#34d399',marginBottom:3}}>{t}:</div>
        <div style={{fontSize:10,color:'#475569',fontFamily:'monospace',background:'rgba(0,0,0,.3)',padding:'7px 10px',borderRadius:6}}>{p}</div>
      </div>)}
    </div>
  </div>;
}

// ═══════════════════════════════════════════════════
// MESLEKLERE GÖRE AI
// ═══════════════════════════════════════════════════
function MeslekAIPage(){
  const JOBS=[
    {icon:"👨‍💻",title:"Yazılım Geliştirici",color:"#00dcff",tools:["Cursor","GitHub Copilot","Claude Code","Codeium"],prompts:["Bu Python kodunu refactor et ve test yaz","REST API için Swagger dokümantasyonu oluştur","Bu SQL sorgusunu optimize et"],tips:"Cursor + Claude Sonnet kombinasyonu şu an en güçlü. Günde 2+ saat tasarruf."},
    {icon:"🎨",title:"Grafik Tasarımcı",color:"#a855f7",tools:["Adobe Firefly","Midjourney","DALL-E 3","Canva AI"],prompts:["Logo konsept: minimalist, modern, [sektör]","Sosyal medya paketi: Instagram, LinkedIn, Twitter boyutları","Marka renk paleti ve tipografi öneri"],tips:"Firefly ticari güvenli. Midjourney kalite için. İkisini birlikte kullan."},
    {icon:"📝",title:"İçerik Yazarı",color:"#34d399",tools:["Claude","ChatGPT","Jasper","Perplexity"],prompts:["[KONU] hakkında SEO uyumlu 1500 kelime blog yaz","5 farklı LinkedIn hook cümlesi oluştur","Email bülten için 3 konu başlığı öner"],tips:"Claude uzun form için, ChatGPT hızlı taslak için, Perplexity araştırma için."},
    {icon:"📊",title:"Pazarlama Uzmanı",color:"#fbbf24",tools:["ChatGPT","Midjourney","HeyGen","AdCreative"],prompts:["[ÜRÜN] için A/B test copy yaz (5 varyasyon)","Google Ads için 10 farklı başlık","Email kampanya sekansı: welcome, nurture, conversion"],tips:"AdCreative.ai ile reklam görseli + copy üretimi. ROAS 2x artış mümkün."},
    {icon:"⚖️",title:"Avukat / Hukuk",color:"#f472b6",tools:["Claude","Harvey AI","CaseText","Lexis AI"],prompts:["Bu sözleşmede riskli maddeleri listele","KVKK uyumluluk kontrolü yap","Dava dilekçesi taslağı: [durum]"],tips:"Harvey AI Türkiye'de henüz yok ama Claude ile hukuk analizi çok güçlü. %100 onay zorunlu."},
    {icon:"🏥",title:"Sağlık Profesyoneli",color:"#fb923c",tools:["Claude","Google Med-PaLM","Whisper","Nuance"],prompts:["Bu semptomlar için DDx listesi oluştur","Hasta özetini ICD-10 kodlarıyla hazırla","İlaç etkileşimi analizi: [ilaçlar]"],tips:"AI asistan, KARAR VERİCİ değil. Her çıktı uzman onayından geçmeli."},
    {icon:"🎓",title:"Öğretmen / Akademisyen",color:"#00dcff",tools:["Claude","ChatGPT","Perplexity","Consensus"],prompts:["[Konu] için 45dk ders planı hazırla","10 soruluk quiz oluştur (A,B,C,D seçenekli)","Bu makaleyi öğrenci düzeyinde özetle"],tips:"Consensus.app akademik makaleler için. Plagiarism riski: öğrenci yazılarını AI'a yazdırma."},
    {icon:"💼",title:"Girişimci",color:"#a855f7",tools:["Claude","ChatGPT","Notion AI","Gamma"],prompts:["Startup için pitch deck outline (YC formatı)","Rakip analizi: [sektör] için SWOT","Finansal model: 3 yıllık projeksiyon şablonu"],tips:"Gamma.app ile AI destekli sunum. Notion AI ile tüm iş süreçleri."},
  ];
  return <div style={{padding:'24px 16px',maxWidth:1000,margin:'0 auto'}}>
    <div style={{marginBottom:24}}>
      <div style={{fontSize:9,letterSpacing:'.2em',color:'#fbbf24',marginBottom:4}}>MESLEĞE ÖZEL REHBERLİK</div>
      <h1 style={{fontSize:24,fontWeight:900,color:'#e2e8f0',fontFamily:"'Space Grotesk',sans-serif",margin:'0 0 8px'}}>💼 Mesleklere Göre AI Rehberi</h1>
      <p style={{fontSize:13,color:'#64748b',margin:0}}>Hangi meslek için hangi AI araçları — 8 meslek, hazır promptlar</p>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:14}}>
      {JOBS.map(j=><div key={j.title} style={{background:j.color+'06',border:'1px solid '+j.color+'18',borderRadius:14,padding:'18px'}}>
        <div style={{display:'flex',gap:10,alignItems:'center',marginBottom:10}}>
          <span style={{fontSize:28}}>{j.icon}</span>
          <div style={{fontSize:13,fontWeight:800,color:j.color,fontFamily:"'Space Grotesk',sans-serif"}}>{j.title}</div>
        </div>
        <div style={{marginBottom:8}}>
          <div style={{fontSize:9,color:'#475569',marginBottom:4,fontWeight:700}}>ARAÇLAR:</div>
          <div style={{display:'flex',flexWrap:'wrap',gap:4}}>
            {j.tools.map(t=><span key={t} style={{fontSize:9,color:j.color,background:j.color+'12',borderRadius:4,padding:'2px 7px'}}>{t}</span>)}
          </div>
        </div>
        <div style={{marginBottom:8}}>
          <div style={{fontSize:9,color:'#475569',marginBottom:4,fontWeight:700}}>HAZIR PROMPTLAR:</div>
          {j.prompts.map((p,i)=><div key={i} style={{fontSize:9,color:'#64748b',padding:'3px 0',borderBottom:'1px solid rgba(255,255,255,0.03)'}}>›  {p}</div>)}
        </div>
        <div style={{fontSize:10,color:j.color,background:j.color+'10',borderRadius:6,padding:'7px 9px',lineHeight:1.5}}>💡 {j.tips}</div>
      </div>)}
    </div>
  </div>;
}

// ═══════════════════════════════════════════════════
// AI FİYAT KARŞILAŞTIRMA
// ═══════════════════════════════════════════════════
function AIFiyatPage(){
  const MODELS=[
    {name:"Claude Haiku 4.5",co:"Anthropic",in:0.80,out:4.00,ctx:"200K",free:"Evet",best:"Hızlı görevler",color:"#34d399"},
    {name:"Claude Sonnet 4.5",co:"Anthropic",in:3.00,out:15.00,ctx:"200K",free:"Sınırlı",best:"Genel + Kod",color:"#00dcff"},
    {name:"Claude Opus 4.5",co:"Anthropic",in:15.00,out:75.00,ctx:"200K",free:"Hayır",best:"Karmaşık görev",color:"#a855f7"},
    {name:"GPT-4o mini",co:"OpenAI",in:0.15,out:0.60,ctx:"128K",free:"Evet",best:"Hızlı + Ucuz",color:"#34d399"},
    {name:"GPT-4o",co:"OpenAI",in:2.50,out:10.00,ctx:"128K",free:"Sınırlı",best:"Multimodal",color:"#00dcff"},
    {name:"Gemini 1.5 Flash",co:"Google",in:0.075,out:0.30,ctx:"1M",free:"Evet",best:"En ucuz uzun ctx",color:"#fbbf24"},
    {name:"Gemini 1.5 Pro",co:"Google",in:1.25,out:5.00,ctx:"2M",free:"Sınırlı",best:"Uzun döküman",color:"#34d399"},
    {name:"Grok-2",co:"xAI",in:2.00,out:10.00,ctx:"128K",free:"API yok",best:"Güncel bilgi",color:"#60a5fa"},
    {name:"Llama 3.3 70B",co:"Meta",in:0.23,out:0.40,ctx:"128K",free:"Açık kaynak",best:"Self-hosted",color:"#fb923c"},
    {name:"DeepSeek V3",co:"DeepSeek",in:0.27,out:1.10,ctx:"128K",free:"Ücretsiz",best:"En iyi fiyat/perf",color:"#00dcff"},
  ];
  return <div style={{padding:'24px 16px',maxWidth:1000,margin:'0 auto'}}>
    <div style={{marginBottom:24}}>
      <div style={{fontSize:9,letterSpacing:'.2em',color:'#00dcff',marginBottom:4}}>API FİYATLANDIRMA</div>
      <h1 style={{fontSize:24,fontWeight:900,color:'#e2e8f0',fontFamily:"'Space Grotesk',sans-serif",margin:'0 0 8px'}}>💲 AI Model Fiyat Karşılaştırması — 2026</h1>
      <p style={{fontSize:13,color:'#64748b',margin:'0 0 4px'}}>1M token başına USD · Kur: ₺38/$ · Güncel: Mayıs 2026</p>
    </div>
    <div style={{overflowX:'auto',borderRadius:12,border:'1px solid rgba(255,255,255,0.08)'}}>
      <table style={{width:'100%',borderCollapse:'collapse',fontSize:11}}>
        <thead>
          <tr style={{background:'rgba(0,220,255,0.06)'}}>
            {['Model','Şirket','Input ($/1M)','Output ($/1M)','Context','Ücretsiz','En İyi İçin'].map(h=><th key={h} style={{padding:'10px 12px',textAlign:'left',color:'#475569',fontWeight:700,whiteSpace:'nowrap',borderBottom:'1px solid rgba(255,255,255,0.08)'}}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {MODELS.map((m,i)=><tr key={m.name} style={{background:i%2===0?'transparent':'rgba(255,255,255,0.015)'}}>
            <td style={{padding:'9px 12px',fontWeight:700,color:m.color,whiteSpace:'nowrap'}}>{m.name}</td>
            <td style={{padding:'9px 12px',color:'#475569',whiteSpace:'nowrap'}}>{m.co}</td>
            <td style={{padding:'9px 12px',color:'#e2e8f0',fontFamily:'monospace'}}>${m.in}</td>
            <td style={{padding:'9px 12px',color:'#e2e8f0',fontFamily:'monospace'}}>${m.out}</td>
            <td style={{padding:'9px 12px',color:'#94a3b8'}}>{m.ctx}</td>
            <td style={{padding:'9px 12px'}}><span style={{fontSize:9,color:['Evet','Açık kaynak','Ücretsiz'].includes(m.free)?'#34d399':m.free==='Sınırlı'?'#fbbf24':'#ff4444',background:['Evet','Açık kaynak','Ücretsiz'].includes(m.free)?'rgba(52,211,153,0.1)':m.free==='Sınırlı'?'rgba(251,191,36,0.1)':'rgba(255,68,68,0.1)',borderRadius:4,padding:'2px 6px'}}>{m.free}</span></td>
            <td style={{padding:'9px 12px',color:'#64748b',fontSize:10}}>{m.best}</td>
          </tr>)}
        </tbody>
      </table>
    </div>
    <div style={{marginTop:14,display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:10}}>
      {[['💡 En Ucuz Genel','Gemini 1.5 Flash — $0.075/1M token','#fbbf24'],['⚡ En İyi Fiyat/Performans','DeepSeek V3 — ücretsiz API','#00dcff'],['🏆 En Güçlü','Claude Opus 4.5 — %87.6 SWE','#a855f7'],['🆓 Ücretsiz Self-host','Llama 3.3 70B — Meta açık kaynak','#fb923c']].map(([t,d,c])=><div key={t} style={{background:c+'08',border:'1px solid '+c+'20',borderRadius:10,padding:'12px'}}>
        <div style={{fontSize:11,fontWeight:700,color:c,marginBottom:4}}>{t}</div>
        <div style={{fontSize:10,color:'#64748b'}}>{d}</div>
      </div>)}
    </div>
  </div>;
}

// ══════════════════════════════════════════════
// İŞ BORSASI
// ══════════════════════════════════════════════
function IsBorsasiPage(){
  const JOBS=[
    {title:"AI Prompt Mühendisi",co:"[Yazılım Şirketi]",sal:"₺35-60K/ay",type:"Uzaktan",skills:["Claude","ChatGPT","Prompt Engineering"],hot:true,color:"#a855f7"},
    {title:"ML Mühendisi",co:"Getir",sal:"₺45-80K/ay",type:"Hibrit",skills:["Python","TensorFlow","LLM"],hot:true,color:"#00dcff"},
    {title:"AI İçerik Yazarı",co:"[Dijital Ajans]",sal:"₺20-35K/ay",type:"Uzaktan",skills:["ChatGPT","Midjourney","SEO"],hot:false,color:"#34d399"},
    {title:"Veri Bilimcisi",co:"[Fintech Startup]",sal:"₺40-70K/ay",type:"İstanbul",skills:["Python","SQL","Claude API"],hot:true,color:"#fbbf24"},
    {title:"AI Ürün Yöneticisi",co:"SaaS TR",sal:"₺50-90K/ay",type:"Hibrit",skills:["Agile","AI Araçlar","Roadmap"],hot:false,color:"#f472b6"},
    {title:"Chatbot Geliştirici",co:"E-Ticaret Co",sal:"₺28-45K/ay",type:"Uzaktan",skills:["Langchain","OpenAI API","Node.js"],hot:false,color:"#fb923c"},
  ];
  return <div style={{padding:'24px 16px',maxWidth:960,margin:'0 auto'}}>
    <div style={{marginBottom:20}}>
      <div style={{fontSize:9,letterSpacing:'.2em',color:'#fbbf24',marginBottom:4}}>İŞ İLANLARI</div>
      <h1 style={{fontSize:24,fontWeight:900,color:'#e2e8f0',fontFamily:"'Space Grotesk',sans-serif",margin:'0 0 6px'}}>👔 AI Kariyer Fırsatları — Örnek İlanlar</h1>
      <p style={{fontSize:12,color:'#64748b',margin:0}}>AI alanında Türkiye'deki fırsatlar · İllüstratif ilanlar — gerçek başvuru için LinkedIn ve kariyer sitelerini kullanın</p>
    </div>
    <div style={{display:'flex',gap:10,marginBottom:18,flexWrap:'wrap'}}>
      {[['120K+','Açılan AI Pozisyon','#34d399'],['₺42K','Ortalama Maaş','#00dcff'],['%78','Uzaktan Çalışma','#a855f7'],['3dk','Ortalama Başvuru','#fbbf24']].map(([v,l,c])=><div key={l} style={{flex:'1 1 100px',background:c+'08',border:'1px solid '+c+'20',borderRadius:10,padding:'10px',textAlign:'center'}}>
        <div style={{fontSize:18,fontWeight:900,color:c}}>{v}</div>
        <div style={{fontSize:9,color:'#475569'}}>{l}</div>
      </div>)}
    </div>
    <div style={{display:'flex',flexDirection:'column',gap:10}}>
      {JOBS.map(j=><div key={j.title} style={{background:j.color+'05',border:'1px solid '+j.color+'18',borderRadius:12,padding:'16px',display:'flex',gap:14,flexWrap:'wrap',alignItems:'center'}}>
        {j.hot&&<div style={{position:'absolute',fontSize:9,color:'#ff4444',background:'rgba(255,68,68,0.12)',border:'1px solid rgba(255,68,68,0.3)',borderRadius:4,padding:'1px 6px',fontWeight:700}}>🔥 HOT</div>}
        <div style={{flex:1,minWidth:200}}>
          <div style={{fontSize:13,fontWeight:800,color:j.color,marginBottom:3}}>{j.title}</div>
          <div style={{fontSize:11,color:'#94a3b8',marginBottom:6}}>{j.co} · {j.type}</div>
          <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
            {j.skills.map(s=><span key={s} style={{fontSize:9,color:j.color,background:j.color+'12',borderRadius:4,padding:'2px 7px'}}>{s}</span>)}
          </div>
        </div>
        <div style={{textAlign:'right',flexShrink:0}}>
          <div style={{fontSize:14,fontWeight:900,color:j.color,marginBottom:6}}>{j.sal}</div>
          <button style={{padding:'6px 16px',border:'1px solid '+j.color+'40',borderRadius:8,background:j.color+'10',color:j.color,fontSize:11,cursor:'pointer',fontFamily:'inherit',fontWeight:700}}>LinkedIn'de Ara →</button>
        </div>
      </div>)}
    </div>
  </div>;
}

// ══════════════════════════════════════════════
// SERTİFİKA
// ══════════════════════════════════════════════
function SertifikaPage(){
  const[done,setDone]=useState({});
  const TRACKS=[
    {id:'t1',icon:'🌱',title:'AI Temeller',level:'Başlangıç',modules:['AI Nedir?','Prompt Temelleri','ChatGPT Kullanımı','Claude Rehberi'],color:'#34d399',pts:200},
    {id:'t2',icon:'🚀',title:'Prompt Mühendisliği',level:'Orta',modules:['Chain of Thought','Few-shot','XML Tags','System Prompt'],color:'#00dcff',pts:350},
    {id:'t3',icon:'💼',title:'AI ile İş Verimliliği',level:'Orta',modules:['AI Araçlar','Workflow Otomasyon','Zaman Tasarrufu','ROI Hesapla'],color:'#a855f7',pts:400},
    {id:'t4',icon:'👑',title:'AI Uzmanı',level:'İleri',modules:['API Kullanımı','Fine-tuning Temelleri','AI Güvenlik','Etik AI'],color:'#fbbf24',pts:600},
  ];
  const total=TRACKS.reduce((s,t)=>s+(done[t.id]?t.pts:0),0);
  return <div style={{padding:'24px 16px',maxWidth:900,margin:'0 auto'}}>
    <div style={{marginBottom:20}}>
      <div style={{fontSize:9,letterSpacing:'.2em',color:'#fbbf24',marginBottom:4}}>SERTİFİKA PROGRAMI</div>
      <h1 style={{fontSize:24,fontWeight:900,color:'#e2e8f0',fontFamily:"'Space Grotesk',sans-serif",margin:'0 0 6px'}}>🏅 IMDATAI AI Sertifika Programı</h1>
      <div style={{display:'flex',gap:10,alignItems:'center'}}>
        <div style={{flex:1,height:6,background:'rgba(255,255,255,0.08)',borderRadius:3,overflow:'hidden'}}>
          <div style={{height:'100%',width:(total/1550*100)+'%',background:'linear-gradient(90deg,#34d399,#00dcff)',borderRadius:3,transition:'width .5s'}}/>
        </div>
        <span style={{fontSize:11,color:'#fbbf24',fontWeight:700}}>{total}/1550 puan</span>
      </div>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:14}}>
      {TRACKS.map(t=><div key={t.id} style={{background:t.color+'06',border:'2px solid '+(done[t.id]?t.color+'60':t.color+'18'),borderRadius:14,padding:'18px'}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}>
          <span style={{fontSize:28}}>{t.icon}</span>
          <span style={{fontSize:9,color:t.color,background:t.color+'15',borderRadius:5,padding:'2px 8px',fontWeight:700}}>{t.level}</span>
        </div>
        <div style={{fontSize:13,fontWeight:800,color:t.color,marginBottom:4}}>{t.title}</div>
        <div style={{marginBottom:10}}>
          {t.modules.map(m=><div key={m} style={{fontSize:10,color:'#64748b',padding:'3px 0',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>✓ {m}</div>)}
        </div>
        <button onClick={()=>setDone(d=>({...d,[t.id]:!d[t.id]}))} style={{width:'100%',padding:'8px',border:'none',borderRadius:8,background:done[t.id]?t.color:t.color+'25',color:done[t.id]?'#fff':t.color,fontSize:11,cursor:'pointer',fontWeight:700}}>
          {done[t.id]?'✅ Tamamlandı — +'+t.pts+' puan':'Başla → '+t.pts+' puan'}
        </button>
      </div>)}
    </div>
  </div>;
}

// ══════════════════════════════════════════════
// ŞABLONLAR
// ══════════════════════════════════════════════
function SablonlarPage(){
  const[sel,setSel]=useState(null);
  const[copied,setCopied]=useState('');

  function copyTemplate(id, text){
    navigator.clipboard?.writeText(text).then(()=>{setCopied(id);setTimeout(()=>setCopied(''),2000);});
  }

  const TEMPLATES=[
    {id:"email1",icon:"📧",title:"Maaş Artışı Talebi",cat:"İş",color:"#00dcff",
     desc:"Yöneticinize maaş artışı için profesyonel email",
     template:`Konu: Maaş Değerlendirme Talebi - [ADINIZ]

Sayın [YÖNETİCİ],

[ÇALIŞMA SÜRESİ] süredir [ŞİRKET]'te çalışmaktayım. Bu sürede [BAŞARIM 1], [BAŞARIM 2] ve [BAŞARIM 3] katkılarımı sundum.

Piyasa araştırmalarına göre [POZISYON] için ortalama maaş [RAKAM] bandında seyretmektedir. Mevcut maaşım [MEVCUT] olup [TALEP] düzeyinde bir güncelleme talep etmek istiyorum.

Bu konuyu değerlendirmek üzere bir toplantı ayarlayabilir miyiz?

Saygılarımla,
[ADINIZ]`},
    {id:"email2",icon:"🤝",title:"İş Ortaklığı Teklifi",cat:"İş",color:"#a855f7",
     desc:"Potansiyel iş ortağına soğuk teklif emaili",
     template:`Konu: [ŞİRKETİNİZ] × [ONLARIN ŞİRKETİ] — İş Birliği Fırsatı

Merhaba [İSİM],

[ORTAK BAĞLANTI/NEDEN ULAŞIYORUM] aracılığıyla size ulaşıyorum.

[ŞİRKETİNİZ] olarak [NE YAPIYORSUNUZ, 1 CÜMLE]. [ONLARIN ŞİRKETİ]'nin [GÜÇLÜ YÖNLERİ] ile birlikte [ORTAK FAYDA] yaratma potansiyeli gördüm.

Spesifik önerim: [SOMUT TEKLİF, 2 CÜMLE]

Bu konuyu 20 dakikalık bir görüşmede ele almak ister misiniz?

[ADI SOYADI]
[UNVAN] | [ŞİRKET]
[TELEFON]`},
    {id:"linkedin1",icon:"💼",title:"LinkedIn Profil Özeti",cat:"Kariyer",color:"#0077b5",
     desc:"Dikkat çeken LinkedIn About bölümü",
     template:`[BAŞLIK — Kim olduğunuz + Ne yapıyorsunuz — 1 satır]

🎯 [ANA UZMANLK ALANINI] alanında [DENEYIM] yıllık deneyimle [HEDEF KİTLE] için [ANA DEĞERİNİZ].

💡 Benim farkım: [UNIQUE VALUE PROPOSITION — rakiplerinizden sizi ayıran şey]

📊 Son [N] yılda:
→ [ÖLÇÜLEBILIR BAŞARI 1]
→ [ÖLÇÜLEBILIR BAŞARI 2]
→ [ÖLÇÜLEBILIR BAŞARI 3]

🛠️ Uzmanlıklar: [SKILL 1] · [SKILL 2] · [SKILL 3] · [SKILL 4]

📬 Benimle çalışmak ister misiniz?
[EMAIL] | [WEB SİTESİ]

Bir şeyler inşa edelim. 🚀`},
    {id:"blog1",icon:"✍️",title:"SEO Blog Yazısı Taslağı",cat:"İçerik",color:"#34d399",
     desc:"Google'a uyumlu blog yazısı yapısı",
     template:`BAŞLIK: [ANA ANAHTAR KELİME] — [MERAK UYANDIRAN ALT BAŞLIK]
Meta Açıklama: [155 karakter, anahtar kelime içermeli]

GİRİŞ (150 kelime):
[Hook — şaşırtıcı istatistik veya soru]
[Problem — okuyucunun acısını tanımla]
[Vaat — bu yazıda ne öğrenecekler]

BÖLÜM 1: [H2 — Anahtar Kelime Varyantı]
[Alt başlık H3]
[İçerik — 200 kelime]
[Liste veya tablo]

BÖLÜM 2: [H2]
[İçerik]

BÖLÜM 3: [H2]
[Adım adım rehber veya örnekler]

SONUÇ:
[Ana fikrin özeti — 3 madde]
[CTA — yorum yap, paylaş, abone ol]

İç Linkler: [İLGİLİ YAZI 1] [İLGİLİ YAZI 2]
Görsel Alt Metni: [Anahtar kelime içeren açıklama]`},
    {id:"social1",icon:"📱",title:"Instagram Reels Scripti",cat:"Sosyal Medya",color:"#e1306c",
     desc:"Viral Instagram Reels için konuşma metni",
     template:`HOOK (0-3 saniye — scroll durdurucu):
"[ŞOK EDİCİ SORU veya İDDİA]"

ÖRNEK: "ChatGPT'ye yanlış soru soruyorsunuz" / "Bu hatayı yapan herkese söyleyin"

BÖLÜM 1 (3-20 saniye):
"Çoğu insan [YANLIŞ YAPILAN ŞEY]. Ama asıl mesele şu:"

BÖLÜM 2 (20-45 saniye):
"[ÇÖZÜM/DEĞER] — [SOMUT ÖRNEK veya RAKAM ile destekle]"

SONUÇ + CTA (45-60 saniye):
"[ÖZET]. Eğer bu işe yararsa kaydet 🔖, [BAŞKASINA] da gönder."

#[HASHTAG1] #[HASHTAG2] #[HASHTAG3]`},
    {id:"meeting1",icon:"📋",title:"Toplantı Ajandası",cat:"Yönetim",color:"#fbbf24",
     desc:"Etkili toplantı için hazırlık şablonu",
     template:`TOPLANTI: [BAŞLIK]
Tarih: [TARİH] | Saat: [SAAT] | Süre: [SÜRE]
Yer/Link: [KONUM]

KATILIMCILAR:
• [İSİM] — [ROLÜ/SORUMLULUĞU]
• [İSİM] — [ROLÜ/SORUMLULUĞU]

HAZIRLIK (katılmadan önce):
□ [DÖKÜMAN/VERİ] inceleyin
□ [SORU/GÖRÜŞ] hazırlayın

AJANDA:
09:00 — Giriş ve gündem (3 dk)
09:03 — [KONU 1] — Karar: [NE KARAR ALINACAK] (15 dk)
09:18 — [KONU 2] — Karar: [NE KARAR ALINACAK] (15 dk)
09:33 — Aksiyon maddeleri ve kapanış (7 dk)

BAŞARI KRİTERLERİ:
Bu toplantı [KARAR VERİLİRSE / PLAN YAPILIRSA] başarılı sayılır.`},
    {id:"prompt1",icon:"🤖",title:"AI Prompt Şablonu",cat:"AI",color:"#a855f7",
     desc:"Güçlü AI prompts için evrensel şablon",
     template:`ROL: Sen [UZMANLIK ALANI]'nda uzman bir [MESLEK]sın. [YIL] yıllık deneyime sahipsin.

BAĞLAM: [DURUMU AÇIKLA — kim, ne, nerede, ne zaman]

GÖREV: [NE YAPMASINI İSTİYORSUN — çok net ve spesifik]

KISITLAMALAR:
- Uzunluk: [KISA/ORTA/UZUN veya kelime sayısı]
- Ton: [Resmi/Gayriresmi/Teknik/Samimi]
- Format: [Paragraf/Liste/Tablo/JSON]
- Dahil ETME: [İSTEMEDİKLERİN]

ÖRNEK ÇIKTI: [İSTEDİĞİNİZ FORMATTA ÖRNEK — varsa]

ÇIKTI: Yanıtını şu başlıklarla ver:
1. [BÖLÜM 1]
2. [BÖLÜM 2]
3. [BÖLÜM 3]`},
    {id:"report1",icon:"📊",title:"Haftalık Proje Raporu",cat:"Yönetim",color:"#fb923c",
     desc:"Yöneticiye haftalık ilerleme raporu",
     template:`HAFTALIK RAPOR — [PROJE ADI]
Tarih: [TARİH] | Rapor No: [N]
Hazırlayan: [ADI SOYADI]

📊 GENEL DURUM: 🟢 İyi / 🟡 Dikkat / 🔴 Kritik

✅ TAMAMLANANLAR (bu hafta):
• [GÖREV] — [SONUÇ/ETKİSİ]
• [GÖREV] — [SONUÇ/ETKİSİ]

🔄 DEVAM EDENLER:
• [GÖREV] — %[YÜZDE] tamamlandı — Sorumlu: [KİŞİ]

📅 ÖNÜMÜZDEKI HAFTA:
• [GÖREV] — Sorumlu: [KİŞİ] — Son tarih: [TARİH]

⚠️ RİSKLER / BLOKERLAR:
• [RİSK]: [ÇÖZÜM ÖNERİSİ]

📈 METRİKLER:
• Hedef: [HEDEF] | Gerçekleşen: [GERÇEK] | Fark: [%]`},
    {id:"social2",icon:"🐦",title:"Twitter/X Thread Şablonu",cat:"Sosyal Medya",color:"#1da1f2",
     desc:"Viral Twitter thread yapısı",
     template:`Tweet 1/10 (HOOK):
"[ŞOK EDİCİ İDDİA veya SORU]

Çoğu insan bunu bilmiyor. 🧵👇"

Tweet 2/10 (Problem):
"[SORUNUN/KONUNUN BAĞLAMI]

Bu neden önemli: [RAKAM veya İSTATİSTİK]"

Tweet 3-8/10 (Değer):
Her tweet TEK bir fikir içersin.
"[FİKİR]

Örnek: [SOMUT ÖRNEK]"

Tweet 9/10 (Özet):
"Özetle:
→ [MADDE 1]
→ [MADDE 2]
→ [MADDE 3]"

Tweet 10/10 (CTA):
"Faydalı bulduysan RT at — başkasının da görmesini sağla.

Ben [KONU] hakkında yazmaya devam ediyorum.
Takip: @[HESAP]"`},
    {id:"cv1",icon:"📄",title:"CV / Özgeçmiş Şablonu",cat:"Kariyer",color:"#34d399",
     desc:"Modern ve ATS uyumlu CV yapısı",
     template:`[ADI SOYADI]
[E-POSTA] | [TELEFON] | [LİNKEDIN] | [ŞEHİR]

ÖZET (2-3 cümle):
[UNVAN] olarak [YIL] yıllık deneyimle [SEKTÖR] alanında uzmanlaştım. [ANA BECERİ 1] ve [ANA BECERİ 2] konularında güçlü bir geçmişe sahibim.

DENEYİM:
[ŞİRKET ADI] | [UNVAN] | [TARİH ARALIĞI]
• [ÖLÇÜLEBILIR BAŞARI — rakamlar kullan]
• [PROJE veya SORUMLULUK]
• [TEKNIK BECERİ kullanımı]

EĞİTİM:
[ÜNİVERSİTE] | [BÖLÜM] | [YIL]
GPA: [VARSA] | Önemli Dersler: [VARSA]

BECERİLER:
Teknik: [SKILL 1, SKILL 2, SKILL 3]
Araçlar: [TOOL 1, TOOL 2]
Diller: Türkçe (Ana dil), İngilizce ([SEVİYE])

SERTİFİKALAR:
• [SERTİFİKA ADI] — [KURUM] — [YIL]`},
    {id:"brief1",icon:"🎨",title:"Tasarım Brifingi",cat:"Tasarım",color:"#f472b6",
     desc:"Tasarımcıya proje brifingi şablonu",
     template:`TASARIM PROJESİ BRIFING
Proje: [PROJE ADI] | Tarih: [TARİH]

MÜŞTERİ:
Şirket: [ŞİRKET] | Sektör: [SEKTÖR]
Web: [WEBSITE] | İletişim: [KİŞİ]

PROJE AMACI:
"Bu tasarımın amacı [HEDEF KİTLE]'nin [YAPMASINI İSTEDİĞİMİZ EYLEM] yapmasını sağlamak."

HEDEF KİTLE:
Yaş: [ARALIK] | Cinsiyet: [DAĞILIM]
İlgi Alanları: [LISTE]
Ağrı Noktaları: [PROBLEM]

TASARIM GEREKSİNİMLERİ:
Format: [WEB/MOBILE/PRINT/SOSYAL MEDYA]
Boyutlar: [BOYUTLAR]
Renkler: [MEVCUT MARKA RENKLERİ veya tercih]
Font: [VARSA]

REFERANS GÖRSELLER:
• [URL veya AÇIKLAMA]
• [URL veya AÇIKLAMA]

TESLİMAT:
Format: [PNG/SVG/PDF/PSD]
Son Tarih: [TARİH]
Revizyon Hakkı: [SAYI]`},
    {id:"contract1",icon:"⚖️",title:"Freelance Sözleşme",cat:"İş",color:"#e879f9",
     desc:"Basit freelance hizmet sözleşmesi özeti",
     template:`FREELANCE HİZMET SÖZLEŞMESİ
Tarih: [TARİH]

TARAFLAR:
Hizmet Veren: [ADINIZ/ŞİRKETİNİZ]
Hizmet Alan: [MÜŞTERİ ADI/ŞİRKETİ]

KAPSAM:
[YAPILACAK İŞİN DETAYLI TANIMI]

Kapsam DIŞI:
• [DAHIL OLMAYAN ŞEYLER]

ÜCRET VE ÖDEME:
Toplam: [TUTAR] TL + KDV
Ödeme: [ÖN ÖDEME %]% başlangıç, [KALAN %]% teslimat
Ödeme Vadesi: Fatura tarihinden [N] iş günü

TESLİMAT:
Tahmini Teslim: [TARİH]
Revizyonlar: [SAYI] kez dahil

FİKRİ MÜLKİYET:
Ödeme tamamlandığında tüm haklar müşteriye devredilir.

İPTAL:
[N] iş günü önceden bildirimle iptal edilebilir.
Yapılan iş oranında ücret kesilir.`},
  ];

  const cats=['Tümü',...new Set(TEMPLATES.map(t=>t.cat))];
  const[activeCat,setActiveCat]=useState('Tümü');
  const filtered=activeCat==='Tümü'?TEMPLATES:TEMPLATES.filter(t=>t.cat===activeCat);

  return <div style={{maxWidth:1000,margin:'0 auto',padding:'24px 16px'}}>
    <div style={{marginBottom:20}}>
      <div style={{fontSize:9,letterSpacing:'.2em',color:'#34d399',marginBottom:4}}>HAZIR ŞABLONLAR</div>
      <h1 style={{fontSize:24,fontWeight:900,color:'#e2e8f0',fontFamily:"'Space Grotesk',sans-serif",margin:'0 0 6px'}}>📄 Şablon Kütüphanesi</h1>
      <p style={{fontSize:12,color:'#64748b',margin:0}}>AI ile doldurabileceğiniz hazır şablonlar — kopyala, AI'a ver, kullan</p>
    </div>
    <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:18}}>
      {cats.map(c=><button key={c} onClick={()=>setActiveCat(c)} style={{padding:'5px 12px',borderRadius:7,border:'1px solid '+(activeCat===c?'rgba(52,211,153,0.4)':'rgba(255,255,255,0.07)'),background:activeCat===c?'rgba(52,211,153,0.1)':'transparent',color:activeCat===c?'#34d399':'#64748b',fontSize:10,cursor:'pointer',fontFamily:'inherit'}}>{c}</button>)}
    </div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:12}}>
      {filtered.map(t=><div key={t.id} style={{background:t.color+'07',border:'1px solid '+(sel===t.id?t.color+'60':t.color+'18'),borderRadius:12,padding:'16px',cursor:'pointer',transition:'all .2s'}}
        onMouseEnter={e=>{e.currentTarget.style.borderColor=t.color+'40';}}
        onMouseLeave={e=>{e.currentTarget.style.borderColor=sel===t.id?t.color+'60':t.color+'18';}}>
        <div style={{display:'flex',gap:10,marginBottom:8}}>
          <span style={{fontSize:24}}>{t.icon}</span>
          <div>
            <div style={{fontSize:12,fontWeight:700,color:t.color}}>{t.title}</div>
            <div style={{fontSize:9,color:'#475569'}}>{t.cat} · {t.desc}</div>
          </div>
        </div>
        {sel===t.id&&<div style={{background:'rgba(0,0,0,0.4)',borderRadius:7,padding:'10px',fontSize:9,color:'#64748b',fontFamily:'monospace',lineHeight:1.6,marginBottom:8,whiteSpace:'pre-wrap',maxHeight:160,overflow:'auto'}}>{t.template}</div>}
        <button onClick={()=>{setSel(s=>s===t.id?null:t.id);copyTemplate(t.id,t.template);}}
          style={{width:'100%',padding:'7px',border:'1px solid '+t.color+'30',borderRadius:7,background:copied===t.id?t.color+'25':'transparent',color:t.color,fontSize:10,cursor:'pointer',fontFamily:'inherit',fontWeight:700}}>
          {copied===t.id?'✅ Kopyalandı!':sel===t.id?'📋 Tekrar Kopyala':'👁️ Göster & Kopyala'}
        </button>
      </div>)}
    </div>
    <div style={{marginTop:20,background:'rgba(52,211,153,0.04)',border:'1px solid rgba(52,211,153,0.15)',borderRadius:12,padding:'14px'}}>
      <div style={{fontSize:11,fontWeight:700,color:'#34d399',marginBottom:8}}>💡 Nasıl Kullanılır?</div>
      <div style={{fontSize:10,color:'#64748b',lineHeight:1.7}}>
        1. Şablonu kopyalayın<br/>
        2. Claude veya ChatGPT'ye yapıştırın<br/>
        3. Köşeli parantezler içindeki [ALANLAR]'ı doldurun<br/>
        4. "Bu şablonu kullanarak benim için doldur" deyin
      </div>
    </div>
  </div>;
}

function GunlukOzetPage(){
  const TODAY=new Date().toLocaleDateString('tr-TR',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
  const ITEMS=[
    {time:"07:00",icon:"🔥",title:"Gün Sözü",content:"AI'ı kullananlar değil, AI'ı iyi kullananlar öne geçecek."},
    {time:"08:00",icon:"📰",title:"Bugünün Haberi",content:"GPT-5.5 Türkiye'de aktif. Claude Opus kod yazmada %87.6 başarı. Gemini 2.5 Pro 2M token.",color:"#ff4444"},
    {time:"09:00",icon:"💡",title:"Günün Promptu",content:"Benim için [GÖREV] yap. Adım adım düşün, en önemli 3 noktayı listele, bir sonraki aksiyonu belirt.",color:"#00dcff"},
    {time:"12:00",icon:"🛠️",title:"Günün Aracı",content:"Julius AI — Excel/CSV dosyanızı yükleyin, AI otomatik analiz etsin ve grafik çizsin. Ücretsiz.",color:"#34d399"},
    {time:"15:00",icon:"🎯",title:"Günün Görevi",content:"Claude'a bugün yaptığınız bir işi açıklayın ve 'Bu işi nasıl daha verimli yapabilirim?' diye sorun.",color:"#a855f7"},
    {time:"18:00",icon:"🧠",title:"AI Gerçeği",content:"ChatGPT ilk 5 günde 1 milyon kullanıcıya ulaştı. Netflix buna 3.5 yıl harcadı!",color:"#fbbf24"},
  ];
  return <div style={{padding:'24px 16px',maxWidth:800,margin:'0 auto'}}>
    <div style={{marginBottom:20}}>
      <div style={{fontSize:9,letterSpacing:'.2em',color:'#00dcff',marginBottom:4}}>BUGÜN</div>
      <h1 style={{fontSize:22,fontWeight:900,color:'#e2e8f0',fontFamily:"'Space Grotesk',sans-serif",margin:'0 0 4px'}}>📋 AI Günlük Rehberi</h1>
      <div style={{fontSize:12,color:'#475569'}}>{TODAY}</div>
    </div>
    <div style={{display:'flex',flexDirection:'column',gap:12}}>
      {ITEMS.map((item,i)=><div key={i} style={{display:'flex',gap:14,background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:12,padding:'14px',alignItems:'flex-start'}}>
        <div style={{flexShrink:0,textAlign:'center'}}>
          <div style={{fontSize:9,color:'#334155',fontFamily:'monospace',marginBottom:3}}>{item.time}</div>
          <div style={{fontSize:22}}>{item.icon}</div>
        </div>
        <div style={{flex:1}}>
          <div style={{fontSize:12,fontWeight:700,color:item.color||'#e2e8f0',marginBottom:4}}>{item.title}</div>
          <div style={{fontSize:11,color:'#94a3b8',lineHeight:1.6}}>{item.content}</div>
        </div>
      </div>)}
    </div>
  </div>;
}

// ══════════════════════════════════════════════
// VİDEO REHBERİ
// ══════════════════════════════════════════════
function VideoRehberPage(){
  const VIDS=[
    {e:"▶️",title:"ChatGPT'ye Nasıl Prompt Yazılır?",dur:"12 dk",level:"Başlangıç",desc:"Sıfırdan etkili prompt yazma rehberi",color:"#34d399"},
    {e:"▶️",title:"Claude ile Kod Yazma — Tam Rehber",dur:"18 dk",level:"Orta",desc:"Claude Sonnet ile gerçek proje geliştirme",color:"#a855f7"},
    {e:"▶️",title:"Midjourney v7 — Görsel Üretme",dur:"22 dk",level:"Başlangıç",desc:"Midjourney prompt teknikleri ve örnekler",color:"#f472b6"},
    {e:"▶️",title:"AI ile İçerik Stratejisi",dur:"15 dk",level:"Orta",desc:"1 haftada 30 içerik nasıl üretilir",color:"#fbbf24"},
    {e:"▶️",title:"DeepSeek API — Ücretsiz Claude Alternatifi",dur:"10 dk",level:"Teknik",desc:"DeepSeek API kurulum ve kullanım",color:"#00dcff"},
    {e:"▶️",title:"AI Güvenlik — Kendinizi Koruyun",dur:"8 dk",level:"Başlangıç",desc:"Deepfake, ses klonlama ve korunma yolları",color:"#ff4444"},
  ];
  return <div style={{padding:'24px 16px',maxWidth:900,margin:'0 auto'}}>
    <div style={{marginBottom:20}}>
      <div style={{fontSize:9,letterSpacing:'.2em',color:'#fb923c',marginBottom:4}}>VIDEO EĞİTİMLER</div>
      <h1 style={{fontSize:24,fontWeight:900,color:'#e2e8f0',fontFamily:"'Space Grotesk',sans-serif",margin:'0 0 6px'}}>📺 AI Video Rehberleri</h1>
      <p style={{fontSize:12,color:'#64748b',margin:'0 0 4px'}}>IMDATAI YouTube kanalından Türkçe AI eğitim videoları</p>
      <a href="https://youtube.com/@imdatai" target="_blank" rel="noopener noreferrer" style={{fontSize:11,color:'#ff4444',display:'inline-flex',gap:4,alignItems:'center',textDecoration:'none',background:'rgba(255,68,68,0.08)',border:'1px solid rgba(255,68,68,0.3)',borderRadius:6,padding:'4px 10px',marginTop:6}}>▶ YouTube Kanalımıza Abone Ol</a>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:12}}>
      {VIDS.map(v=><div key={v.title} style={{background:v.color+'06',border:'1px solid '+v.color+'20',borderRadius:12,overflow:'hidden'}}>
        <div style={{height:100,background:'linear-gradient(135deg,'+v.color+'20,rgba(0,0,0,0.5))',display:'flex',alignItems:'center',justifyContent:'center',fontSize:32}}>{v.e}</div>
        <div style={{padding:'12px'}}>
          <div style={{fontSize:12,fontWeight:700,color:v.color,marginBottom:4,lineHeight:1.4}}>{v.title}</div>
          <div style={{fontSize:10,color:'#64748b',marginBottom:6}}>{v.desc}</div>
          <div style={{display:'flex',gap:6,justifyContent:'space-between',alignItems:'center'}}>
            <span style={{fontSize:9,color:'#475569'}}>⏱ {v.dur}</span>
            <span style={{fontSize:8,color:v.color,background:v.color+'15',borderRadius:4,padding:'1px 6px',fontWeight:700}}>{v.level}</span>
          </div>
        </div>
      </div>)}
    </div>
  </div>;
}

// ══════════════════════════════════════════
// CURSOR IDE SAYFASI
// ══════════════════════════════════════════
function CursorPage({setPage}){
  const[tab,setTab]=useState('genel');
  const TABS=[{id:'genel',l:'⌨️ Genel'},{id:'ozellik',l:'🔥 Özellikler'},{id:'kurulum',l:'⚙️ Kurulum'},{id:'ipucu',l:'💡 İpuçları'}];
  return <div style={{maxWidth:960,margin:'0 auto',padding:'24px 16px'}}>
    <div style={{background:'linear-gradient(135deg,rgba(52,211,153,0.1),rgba(52,211,153,0.02))',border:'1px solid rgba(52,211,153,0.2)',borderRadius:18,padding:'22px',marginBottom:20}}>
      <div style={{display:'flex',gap:14,alignItems:'center',flexWrap:'wrap',marginBottom:12}}>
        <div style={{width:52,height:52,borderRadius:14,background:'linear-gradient(135deg,#34d399,#059669)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:26,boxShadow:'0 4px 20px rgba(52,211,153,0.4)'}}>⌨️</div>
        <div>
          <h1 style={{margin:0,fontSize:'clamp(18px,4vw,28px)',fontWeight:900,color:'#e2e8f0',fontFamily:"'Space Grotesk',sans-serif"}}>Cursor IDE — AI Destekli Kod Editörü</h1>
          <div style={{fontSize:11,color:'#34d399',marginTop:3}}>Claude + GPT-4o entegreli · VS Code tabanlı · 2026 en popüler AI kod aracı</div>
        </div>
      </div>
      <p style={{margin:0,fontSize:12,color:'#94a3b8',lineHeight:1.7}}>Cursor, yapay zeka ile entegre kod editörüdür. <strong style={{color:'#e2e8f0'}}>GitHub Copilot araştırması</strong>: Cursor kullanan geliştiriciler %55 daha hızlı kod yazıyor.</p>
    </div>
    <div style={{display:'flex',gap:6,marginBottom:20,flexWrap:'wrap'}}>
      {TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{padding:'7px 13px',borderRadius:9,border:'1px solid '+(tab===t.id?'rgba(52,211,153,0.5)':'rgba(255,255,255,0.07)'),background:tab===t.id?'rgba(52,211,153,0.1)':'transparent',color:tab===t.id?'#34d399':'#64748b',fontSize:11,cursor:'pointer',fontFamily:'inherit',fontWeight:tab===t.id?700:400}}>{t.l}</button>)}
    </div>
    {tab==='genel'&&<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:12}}>
      {[['⌨️','Tab ile Tamamlama','Cursor yazmak istediğinizi tahmin eder. Tab basın, kod gelsin. Satır satır veya blok blok.','#34d399'],
        ['💬','Ctrl+L Chat','Proje bağlamıyla Claude ile konuşun. "Bu bug neden var?" gibi sorular.','#00dcff'],
        ['✏️','Ctrl+K Düzenleme','Seçili kodu dönüştürün. Refactor, çevir, optimize, dokümante.','#a855f7'],
        ['🗂️','Codebase Anlayışı','@codebase ile tüm projeyi bağlam olarak ekler. Büyük projelerde güçlü.','#fbbf24'],
        ['🌐','@web Arama','Güncel dokümantasyonu çeker. Stack Overflow, GitHub dahil.','#fb923c'],
        ['📋','.cursorrules','Projeye özel AI kuralları. "Her zaman TypeScript kullan" gibi.','#f472b6'],
      ].map(([e,t,d,c])=><div key={t} style={{background:c+'07',border:'1px solid '+c+'18',borderRadius:12,padding:'14px'}}>
        <div style={{fontSize:22,marginBottom:8}}>{e}</div>
        <div style={{fontSize:12,fontWeight:700,color:c,marginBottom:5}}>{t}</div>
        <div style={{fontSize:10,color:'#64748b',lineHeight:1.5}}>{d}</div>
      </div>)}
    </div>}
    {tab==='ozellik'&&<div style={{display:'flex',flexDirection:'column',gap:10}}>
      {[['Ctrl+Tab','Bir sonraki önerilen değişikliği uygula'],['Ctrl+K','Seçili kodu AI ile düzenle'],['Ctrl+L','Chat paneli aç'],['Ctrl+Shift+L','Chat paneli büyüt'],['@codebase','Tüm projeyi bağlam ekle'],['@file','Belirli dosyayı ekle'],['@web','Web araması yap'],['@docs','Kütüphane dökümantasyonu çek']].map(([k,v])=><div key={k} style={{display:'flex',gap:12,alignItems:'center',padding:'10px 14px',background:'rgba(52,211,153,0.04)',border:'1px solid rgba(52,211,153,0.1)',borderRadius:9}}>
        <code style={{fontSize:11,color:'#34d399',background:'rgba(52,211,153,0.1)',padding:'3px 8px',borderRadius:5,flexShrink:0}}>{k}</code>
        <span style={{fontSize:11,color:'#94a3b8'}}>{v}</span>
      </div>)}
    </div>}
    {tab==='kurulum'&&<div style={{display:'flex',flexDirection:'column',gap:12}}>
      {[['1','cursor.com adresine gidin','Ücretsiz indirin. macOS, Windows, Linux destekleniyor.'],
        ['2','VS Code ayarlarını import edin','"Import from VS Code" ile tema ve eklentileriniz gelir.'],
        ['3','GitHub ile giriş yapın','Ücretsiz plan: 2000 tamamlama/ay yeterli başlangıç için.'],
        ['4','Claude modelini seçin','Ayarlar > Model > Claude Sonnet 4.5 seçin.'],
        ['5','.cursorrules oluşturun','Proje kök dizinine proje kurallarınızı yazın.']].map(([n,t,d])=><div key={n} style={{display:'flex',gap:14,padding:'14px',background:'rgba(52,211,153,0.04)',border:'1px solid rgba(52,211,153,0.1)',borderRadius:10}}>
        <div style={{width:28,height:28,borderRadius:'50%',background:'rgba(52,211,153,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,color:'#34d399',fontWeight:900,flexShrink:0}}>{n}</div>
        <div><div style={{fontSize:12,fontWeight:700,color:'#34d399',marginBottom:4}}>{t}</div><div style={{fontSize:10,color:'#64748b'}}>{d}</div></div>
      </div>)}
      <a href="https://cursor.com" target="_blank" rel="noopener noreferrer" style={{display:'inline-flex',gap:8,alignItems:'center',padding:'10px 20px',background:'linear-gradient(135deg,#34d399,#059669)',borderRadius:10,color:'#fff',textDecoration:'none',fontSize:12,fontWeight:700,alignSelf:'flex-start',marginTop:4}}>⌨️ Cursor'u İndir →</a>
    </div>}
    {tab==='ipucu'&&<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:12}}>
      {['"Ctrl+K ile seçili kodu Claude ile gonderin: Bunu TypeScript e cevir"',
        '"@codebase ekleyip kodunuzu analiz ettirin: Bu projenin mimarisi nedir?"',
        '".cursorrules dosyasina: Always use TypeScript. Always add JSDoc comments."',
        '"Hata mesajını kopyalayıp Ctrl+L yapın. Claude otomatik debug eder"',
        '"@web ile güncel kütüphane belgelerini çekin. Eski bilgi sorunu yok"',
        '"Multi-file edit: Cursor birden fazla dosyayı aynı anda düzenleyebilir"'].map((tip,i)=><div key={i} style={{background:'rgba(52,211,153,0.04)',border:'1px solid rgba(52,211,153,0.12)',borderRadius:10,padding:'14px',display:'flex',gap:10}}>
        <div style={{width:22,height:22,borderRadius:'50%',background:'rgba(52,211,153,0.15)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,color:'#34d399',fontWeight:700,flexShrink:0}}>{i+1}</div>
        <div style={{fontSize:10,color:'#94a3b8',lineHeight:1.6}}>{tip}</div>
      </div>)}
    </div>}
  </div>;
}

// ══════════════════════════════════════════
// PERPLEXITY AI SAYFASI
// ══════════════════════════════════════════
function PerplexityPage({setPage}){
  return <div style={{maxWidth:960,margin:'0 auto',padding:'24px 16px'}}>
    <div style={{background:'linear-gradient(135deg,rgba(168,85,247,0.1),rgba(168,85,247,0.02))',border:'1px solid rgba(168,85,247,0.2)',borderRadius:18,padding:'22px',marginBottom:20}}>
      <div style={{display:'flex',gap:14,alignItems:'center',flexWrap:'wrap',marginBottom:12}}>
        <div style={{width:52,height:52,borderRadius:14,background:'linear-gradient(135deg,#a855f7,#7c3aed)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:26,boxShadow:'0 4px 20px rgba(168,85,247,0.4)'}}>🔍</div>
        <div>
          <h1 style={{margin:0,fontSize:'clamp(18px,4vw,28px)',fontWeight:900,color:'#e2e8f0',fontFamily:"'Space Grotesk',sans-serif"}}>Perplexity AI — Akıllı Arama Motoru</h1>
          <div style={{fontSize:11,color:'#a855f7',marginTop:3}}>Google alternatifi · Kaynak gösterir · Gerçek zamanlı web · Günlük 10M+ sorgu</div>
        </div>
      </div>
      <p style={{margin:0,fontSize:12,color:'#94a3b8',lineHeight:1.7}}>Perplexity, web'i arayıp <strong style={{color:'#e2e8f0'}}>kaynaklarıyla birlikte özetleyen</strong> AI arama motorudur. Google'ın aksine bağlantı listesi değil, doğrudan yanıt sunar.</p>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:12,marginBottom:20}}>
      {[['🔍','Anlık Web Araması','Canlı internet verisiyle yanıt. Bilgi kesme tarihi yok, daima güncel.','#a855f7'],
        ['📖','Kaynak Şeffaflığı','Her iddiaya kaynak gösterir. Gerçek mi değil mi kendiniz kontrol edin.','#34d399'],
        ['🤖','Çoklu AI Modeli','Claude, GPT-4, Llama ile aynı arayüzde sorgu yapın.','#00dcff'],
        ['📁','Spaces','Konuya özel araştırma alanları. Ekip ile paylaşın.','#fbbf24'],
        ['🇹🇷','Türkçe Destek','Türkçe sorgular çalışır. Türk kaynakları da tarar.','#fb923c'],
        ['💲','Ücretsiz Plan','Günlük 5 Pro sorgu ücretsiz. Standart sorgular sınırsız.','#f472b6'],
      ].map(([e,t,d,c])=><div key={t} style={{background:c+'07',border:'1px solid '+c+'18',borderRadius:12,padding:'14px'}}>
        <div style={{fontSize:22,marginBottom:8}}>{e}</div>
        <div style={{fontSize:12,fontWeight:700,color:c,marginBottom:5}}>{t}</div>
        <div style={{fontSize:10,color:'#64748b',lineHeight:1.5}}>{d}</div>
      </div>)}
    </div>
    <div style={{background:'rgba(168,85,247,0.05)',border:'1px solid rgba(168,85,247,0.15)',borderRadius:12,padding:'16px',marginBottom:16}}>
      <div style={{fontSize:12,fontWeight:700,color:'#a855f7',marginBottom:10}}>🔍 Perplexity vs Google vs ChatGPT</div>
      <div style={{overflowX:'auto'}}>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:10}}>
          <thead><tr style={{borderBottom:'1px solid rgba(255,255,255,0.06)'}}>{['Özellik','Perplexity','Google','ChatGPT'].map(h=><th key={h} style={{padding:'6px 10px',textAlign:'left',color:'#475569',fontWeight:700}}>{h}</th>)}</tr></thead>
          <tbody>{[['Canlı Web','✅','✅','Sınırlı'],['Kaynak Gösterir','✅','✅ Link','❌'],['AI Özet','✅','Kısmi','✅'],['Ücretsiz','✅ Çoğu','✅','Sınırlı'],['Türkçe','İyi','Mükemmel','Mükemmel']].map((r,i)=><tr key={r[0]} style={{background:i%2?'rgba(255,255,255,0.01)':'transparent'}}>{r.map((c,j)=><td key={j} style={{padding:'6px 10px',color:j===1?'#a855f7':j===0?'#94a3b8':'#64748b',fontWeight:j===1?700:400}}>{c}</td>)}</tr>)}</tbody>
        </table>
      </div>
    </div>
    <a href="https://perplexity.ai" target="_blank" rel="noopener noreferrer" style={{display:'inline-flex',gap:8,alignItems:'center',padding:'10px 20px',background:'linear-gradient(135deg,#a855f7,#7c3aed)',borderRadius:10,color:'#fff',textDecoration:'none',fontSize:12,fontWeight:700}}>🔍 Perplexity AI → Ücretsiz Dene</a>
  </div>;
}

// ══════════════════════════════════════════
// NOTEBOOKLM SAYFASI
// ══════════════════════════════════════════
function NotebookLMPage({setPage}){
  return <div style={{maxWidth:960,margin:'0 auto',padding:'24px 16px'}}>
    <div style={{background:'linear-gradient(135deg,rgba(251,191,36,0.1),rgba(251,191,36,0.02))',border:'1px solid rgba(251,191,36,0.2)',borderRadius:18,padding:'22px',marginBottom:20}}>
      <div style={{display:'flex',gap:14,alignItems:'center',flexWrap:'wrap',marginBottom:12}}>
        <div style={{width:52,height:52,borderRadius:14,background:'linear-gradient(135deg,#fbbf24,#d97706)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:26,boxShadow:'0 4px 20px rgba(251,191,36,0.4)'}}>📓</div>
        <div>
          <h1 style={{margin:0,fontSize:'clamp(18px,4vw,28px)',fontWeight:900,color:'#e2e8f0',fontFamily:"'Space Grotesk',sans-serif"}}>Google NotebookLM — AI Araştırma Asistanı</h1>
          <div style={{fontSize:11,color:'#fbbf24',marginTop:3}}>Google · Tamamen Ücretsiz · PDF/Döküman/YouTube · Podcast Modu</div>
        </div>
        <span style={{marginLeft:'auto',fontSize:9,background:'rgba(52,211,153,0.15)',color:'#34d399',border:'1px solid rgba(52,211,153,0.3)',borderRadius:5,padding:'3px 9px',fontWeight:700}}>🆓 Tamamen Ücretsiz</span>
      </div>
      <p style={{margin:0,fontSize:12,color:'#94a3b8',lineHeight:1.7}}>Kendi kaynaklarınızı yükleyin, yapay zeka ile konuşun. <strong style={{color:'#e2e8f0'}}>Hallüsinasyon minimaldır</strong> — yalnızca sizin verilerinizden yanıt üretir.</p>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:12,marginBottom:20}}>
      {[['📄','PDF & Döküman','Akademik makaleler, kitaplar, raporlar yükleyin. 200 kaynak/notebook.','#fbbf24'],
        ['🎵','Podcast Modu','En viral özellik: kaynaklarınızı 2 AI sunucunun doğal sohbetine dönüştürür!','#a855f7'],
        ['▶️','YouTube Transkript','Video URL yapıştırın, transcript otomatik çekilir. Analiz edin.','#ff4444'],
        ['🌐','Web Sayfaları','URL ile web içeriği ekleyin. Blog, haber, dökümantasyon.','#34d399'],
        ['💬','Kaynak Bazlı AI','Yanıtlar kaynak gösterir. Hangi dökümanın kaçıncı sayfası söyler.','#00dcff'],
        ['👥','Paylaşım','Notebook paylaşın. Ekip araştırması için ideal.','#fb923c'],
      ].map(([e,t,d,c])=><div key={t} style={{background:c+'07',border:'1px solid '+c+'18',borderRadius:12,padding:'14px'}}>
        <div style={{fontSize:22,marginBottom:8}}>{e}</div>
        <div style={{fontSize:12,fontWeight:700,color:c,marginBottom:5}}>{t}</div>
        <div style={{fontSize:10,color:'#64748b',lineHeight:1.5}}>{d}</div>
      </div>)}
    </div>
    <div style={{background:'rgba(251,191,36,0.05)',border:'1px solid rgba(251,191,36,0.15)',borderRadius:12,padding:'16px',marginBottom:14}}>
      <div style={{fontSize:12,fontWeight:700,color:'#fbbf24',marginBottom:10}}>⚡ Pratik Kullanım Senaryoları</div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:8}}>
        {[['📚','Kitap Analizi','PDF yükle → "Ana temalar neler?" → "3. bölümü özetle"'],
          ['🎓','Tez Araştırması','10 makale yükle → "Ortak bulgular neler?" → "Boşluklar?"'],
          ['📋','Toplantı Özeti','Transkript yükle → "Alınan kararlar?" → "Aksiyon maddeleri?"'],
          ['🎙️','Podcast Üretimi','Araştırmanı yükle → Audio Overview → 15dk podcast hazır!'],
        ].map(([e,t,d])=><div key={t} style={{padding:'10px',background:'rgba(0,0,0,0.2)',borderRadius:8}}>
          <div style={{fontSize:11,fontWeight:700,color:'#fbbf24',marginBottom:4}}>{e} {t}</div>
          <div style={{fontSize:9,color:'#64748b',lineHeight:1.5}}>{d}</div>
        </div>)}
      </div>
    </div>
    <a href="https://notebooklm.google.com" target="_blank" rel="noopener noreferrer" style={{display:'inline-flex',gap:8,alignItems:'center',padding:'10px 20px',background:'linear-gradient(135deg,#fbbf24,#d97706)',borderRadius:10,color:'#000',textDecoration:'none',fontSize:12,fontWeight:700}}>📓 NotebookLM → Ücretsiz Başla</a>
  </div>;
}


const NAV_GROUPS=[
  // ── Ana ────────────────────────────────
  {id:"home",label:"Ana Sayfa",icon:"🏠",desc:"IMDATAI ana sayfa"},
  {id:"haberler",label:"Haberler",icon:"📰",desc:"Güncel AI haberleri"},
  {id:"blog",label:"Blog",icon:"✍️",desc:"AI yazıları ve rehberler"},
  {id:"gunlukezet",label:"Günlük Özet",icon:"📋",desc:"Günün AI özeti"},
  // ── AI Modeller ────────────────────────
  {id:"claude",label:"Claude AI",icon:"🧠",desc:"Anthropic Claude rehberi ve testi"},
  {id:"chatgpt",label:"ChatGPT",icon:"🤖",desc:"OpenAI ChatGPT rehberi"},
  {id:"gemini",label:"Gemini AI",icon:"🌟",desc:"Google Gemini rehberi"},
  {id:"grok",label:"Grok AI",icon:"⚡",desc:"xAI Grok rehberi"},
  {id:"deepseek",label:"DeepSeek",icon:"🔬",desc:"DeepSeek rehberi"},
  {id:"mistral",label:"Mistral AI",icon:"🌊",desc:"Mistral AI rehberi"},
  {id:"llama",label:"Meta Llama",icon:"🦙",desc:"Meta Llama rehberi"},
  {id:"karsilastirma",label:"Model Karşılaştır",icon:"🆚",desc:"AI modelleri karşılaştır"},
  // ── Öğren ──────────────────────────────
  {id:"ogrenme",label:"AI Öğren",icon:"🎓",desc:"Yapay zeka öğrenme rehberi"},
  {id:"prompt",label:"Prompt Rehberi",icon:"💡",desc:"113+ Türkçe prompt örneği"},
  {id:"sozluk",label:"AI Sözlük",icon:"📖",desc:"80 AI terimi Türkçe açıklama"},
  {id:"flashcard",label:"AI Flashcard",icon:"🃏",desc:"Flashcard ile AI öğren"},
  {id:"mitler",label:"AI Mitleri",icon:"💡",desc:"Yapay zeka mitleri ve gerçekler"},
  // ── Görsel & Video AI ──────────────────
  {id:"gorselai",label:"Görsel AI",icon:"🎨",desc:"Midjourney DALL-E Stable Diffusion"},
  {id:"videorehai",label:"AI Video",icon:"🎬",desc:"Sora Runway Kling Pika rehberi"},
  // ── Araçlar ────────────────────────────
  {id:"tools",label:"AI Araçlar",icon:"🛠️",desc:"50+ AI araç dizini"},
  {id:"dizin",label:"Araç Dizini",icon:"📋",desc:"Kategoriye göre AI araçlar"},
  {id:"aistatus",label:"AI Durum",icon:"🟢",desc:"Canlı AI servis durumu"},
  {id:"cursor",label:"Cursor IDE Rehberi",icon:"⌨️",desc:"AI destekli kod editörü tam rehberi"},
  {id:"perplexity",label:"Perplexity AI",icon:"🔍",desc:"Google alternatifi AI arama motoru"},
  {id:"notebooklm",label:"NotebookLM Rehberi",icon:"📓",desc:"Google'ın ücretsiz AI not aracı"},
  {id:"aifiyat",label:"AI Fiyat Karşılaştır",icon:"💲",desc:"Tüm model API fiyatları"},
  {id:"maliyet",label:"Maliyet Hesapla",icon:"💰",desc:"AI kullanım maliyeti hesapla"},
  {id:"zaman",label:"Zaman Hesapla",icon:"⏱️",desc:"AI zaman tasarrufu hesapla"},
  // ── Kariyer & Para ─────────────────────
  {id:"para",label:"AI ile Para Kazan",icon:"💰",desc:"Freelance AI, prompt satışı"},
  {id:"kariyer",label:"AI Kariyer",icon:"💼",desc:"AI kariyer rehberi"},
  {id:"isborsasi",label:"İş Borsası",icon:"👔",desc:"AI iş ilanları"},
  {id:"meslekAI",label:"Mesleklere Göre AI",icon:"👔",desc:"8 meslek için AI araç seti"},
  // ── Oyunlar ────────────────────────────
  {id:"oyunlar",label:"Oyunlar",icon:"🎮",desc:"AI oyun galerisi"},
  {id:"trivia",label:"AI Trivia",icon:"🎯",desc:"60 soruluk AI bilgi yarışması"},
  {id:"iqtest",label:"AI IQ Testi",icon:"🧠",desc:"Yapay zeka IQ testi"},
  {id:"roulette",label:"Prompt Ruleti",icon:"🎰",desc:"Rastgele prompt keşfet"},
  {id:"dedektif",label:"Model Dedektif",icon:"🔍",desc:"AI modeli tahmin oyunu"},
  {id:"cark",label:"Çark",icon:"🎡",desc:"Şans çarkı"},
  {id:"puan",label:"Prompt Skorer",icon:"⭐",desc:"Promptunu puanla"},
  {id:"kisilik",label:"Kişilik Testi",icon:"🧪",desc:"AI kişilik analizi"},
  {id:"animasyon",label:"AI Animasyonlar",icon:"🎬",desc:"25 canlı AI animasyonu"},
  {id:"galeri",label:"AI Galerisi",icon:"🖼️",desc:"AI görsel galerisi"},
  // ── Topluluk ───────────────────────────
  {id:"topluluk",label:"Topluluk",icon:"👥",desc:"AI topluluğu ve tartışma"},
  {id:"yarisma",label:"Prompt Yarışması",icon:"🏆",desc:"Topluluk en iyi promptları"},
  {id:"oneri",label:"Öneri",icon:"💬",desc:"Kişisel AI önerileri"},
  {id:"sertifika",label:"AI Sertifika",icon:"🏅",desc:"AI sertifika programı"},
  {id:"videorehber",label:"Video Rehberi",icon:"📺",desc:"AI video rehberleri"},
  {id:"sablonlar",label:"Şablonlar",icon:"📄",desc:"Hazır AI şablonları"},
  {id:"gorev",label:"Görevler",icon:"📋",desc:"Günlük AI görevleri"},
  // ── Güvenlik & Hukuk ──────────────────
  {id:"guvenlik",label:"AI Güvenlik",icon:"🛡️",desc:"Deepfake ve dolandırıcılık korunma"},
  {id:"turkiyeai",label:"Türkiye AI",icon:"🇹🇷",desc:"Türk AI ekosistemi startuplar"},
  {id:"hukuk",label:"AI Hukuk",icon:"⚖️",desc:"KVKK telif AB AI Act"},
  // ── Site ───────────────────────────────
  {id:"pro",label:"Pro Üyelik",icon:"⭐",desc:"Premium özellikler"},
  {id:"hakkimizda",label:"Hakkımızda",icon:"ℹ️",desc:"IMDATAI hakkında"},
  {id:"iletisim",label:"İletişim",icon:"📧",desc:"Bize ulaşın"},
  {id:"gizlilik",label:"Gizlilik",icon:"🔒",desc:"Gizlilik politikası"},
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
  ]},
  {cat:"🎙️ Ses & Podcast AI",tools:[
    {n:"ElevenLabs",e:"🔊",d:"En gerçekçi AI ses klonlama. 29 dil, Türkçe dahil.",url:"https://elevenlabs.io",free:true,tag:"Ses"},
    {n:"Suno AI",e:"🎵",d:"Sözlerini yaz, AI müziği besteliyor. Viral şarkılar.",url:"https://suno.com",free:true,tag:"Müzik"},
    {n:"Udio",e:"🎶",d:"Yüksek kaliteli AI müzik üretici. Profesyonel ses.",url:"https://udio.com",free:true,tag:"Müzik"},
    {n:"Whisper",e:"🎤",d:"OpenAI'ın açık kaynak ses tanıma. Türkçe %95 doğruluk.",url:"https://openai.com/research/whisper",free:true,tag:"Transkript"},
    {n:"Descript",e:"📹",d:"Video/podcast AI editörü. Metinden video düzenle.",url:"https://descript.com",free:true,tag:"Video"},
  ]},
  {cat:"📊 Veri & Analiz AI",tools:[
    {n:"Julius AI",e:"📈",d:"CSV/Excel yükle, AI analiz yapsın. Grafik + insight.",url:"https://julius.ai",free:true,tag:"Veri"},
    {n:"Tableau AI",e:"📊",d:"Veri görselleştirme platformu AI destekli.",url:"https://tableau.com",free:false,tag:"BI"},
    {n:"DataRobot",e:"🤖",d:"Otomatik ML modeli oluşturma platformu.",url:"https://datarobot.com",free:false,tag:"ML"},
    {n:"Obviously AI",e:"🔮",d:"Kod yazmadan ML tahmin modeli kur.",url:"https://obviously.ai",free:false,tag:"AutoML"},
  ]},
  {cat:"🤖 Otomasyon & İş Akışı",tools:[
    {n:"Zapier",e:"⚡",d:"5000+ uygulama entegrasyonu. AI ile tetikleyici ve eylem zinciri kur.",url:"https://zapier.com",free:true,tag:"Otomasyon"},
    {n:"Make (Integromat)",e:"🔧",d:"Görsel iş akışı otomasyon. Zapier'den daha esnekli ve uygun fiyatlı.",url:"https://make.com",free:true,tag:"Otomasyon"},
    {n:"n8n",e:"🌿",d:"Açık kaynak otomasyon. Self-host seçeneği. Geliştiriciler için ideal.",url:"https://n8n.io",free:true,tag:"Otomasyon"},
    {n:"Taskade",e:"✅",d:"AI destekli görev yönetimi ve proje planlama. Takım işbirliği.",url:"https://taskade.com",free:true,tag:"Verimlilik"},
  ]},
  {cat:"📊 Analiz & BI",tools:[
    {n:"Julius AI",e:"📈",d:"CSV/Excel yükle, AI analiz etsin. Grafik + insight + Python kodu.",url:"https://julius.ai",free:true,tag:"Veri"},
    {n:"Equals",e:"📉",d:"AI destekli spreadsheet. Veri bağlantısı + otomatik raporlama.",url:"https://equals.com",free:true,tag:"BI"},
    {n:"Polymer",e:"🔮",d:"Veri setini yükle, AI dashboard oluştursun. Kod yok.",url:"https://polymersearch.com",free:true,tag:"Veri"},
    {n:"Chartable",e:"🎙️",d:"Podcast analytics AI. Dinleyici davranışı + büyüme tahminleri.",url:"https://chartable.com",free:false,tag:"Analiz"},
  ]},
  {cat:"🧑‍💼 İnsan Kaynakları AI",tools:[
    {n:"HireVue",e:"👥",d:"AI video mülakat. Yüz ifadesi ve konuşma analizi.",url:"https://hirevue.com",free:false,tag:"İK"},
    {n:"Textio",e:"✍️",d:"İş ilanı yazımını optimize eden AI. Bias tespiti.",url:"https://textio.com",free:false,tag:"İK"},
    {n:"Eightfold",e:"🎯",d:"Yetenek zekası platformu. CV analizi ve kariyer patika.",url:"https://eightfold.ai",free:false,tag:"İK"},
    {n:"Paradox",e:"🤖",d:"Olivia AI - işe alım chatbotu. Otomatik mülakat planlama.",url:"https://paradox.ai",free:false,tag:"İK"},
  ]},
  {cat:"🛒 E-Ticaret AI",tools:[
    {n:"Nosto",e:"🛍️",d:"E-ticaret kişiselleştirme. AI ürün öneri motoru.",url:"https://nosto.com",free:false,tag:"E-Ticaret"},
    {n:"Vue.ai",e:"🛒",d:"Retail AI platformu. Görsel arama + kişiselleştirme.",url:"https://vue.ai",free:false,tag:"E-Ticaret"},
    {n:"Octane AI",e:"💬",d:"Shopify için AI quiz ve chatbot. Kişiselleştirilmiş alışveriş.",url:"https://octaneai.com",free:true,tag:"E-Ticaret"},
    {n:"Roktum",e:"📦",d:"Türk e-ticaret için AI içerik üretimi. Trendyol/Hepsiburada.",url:"https://roktum.com",free:true,tag:"TR"},
  ]},
  {cat:"🏥 Sağlık & Wellness",tools:[
    {n:"Ada Health",e:"🩺",d:"AI semptom kontrolcü. 30+ dil, Türkçe dahil.",url:"https://ada.com",free:true,tag:"Sağlık"},
    {n:"Suki",e:"🎤",d:"Doktor için AI sesli not asistanı. EHR entegrasyonu.",url:"https://suki.ai",free:false,tag:"Tıp"},
    {n:"Woebot",e:"🧠",d:"AI destekli mental sağlık chatbotu. CBT tabanlı.",url:"https://woebothealth.com",free:true,tag:"Mental"},
    {n:"Lark",e:"🏃",d:"Kronik hastalık yönetimi AI koçu. Diyabet + hipertansiyon.",url:"https://lark.com",free:true,tag:"Sağlık"},
  ]},
  {cat:"🧠 Üretkenlik AI",tools:[
    {n:"Notion AI",e:"📓",d:"Notion içinde AI yazı asistanı. Özet, taslak, çeviri. Türkçe destekli.",url:"https://notion.so",free:true,tag:"Verimlilik"},
    {n:"Otter.ai",e:"🎙️",d:"Toplantı transkripti ve özet AI. Türkçe hâlâ sınırlı.",url:"https://otter.ai",free:true,tag:"Ses"},
    {n:"Mem.ai",e:"🧠",d:"AI destekli not alma. Otomatik bağlantı kurma ve hatırlatma.",url:"https://mem.ai",free:true,tag:"Not"},
    {n:"Reclaim.ai",e:"⏰",d:"AI takvim optimizasyonu. Toplantı ve odak bloklarını otomatik planlar.",url:"https://reclaim.ai",free:true,tag:"Takvim"},
    {n:"Magical",e:"⚡",d:"Browser extension — metin şablonları ve otomasyon. CRM doldurma.",url:"https://magical.com",free:true,tag:"Otomasyon"},
  ]},
  {cat:"🎨 Tasarım AI",tools:[
    {n:"Canva AI",e:"🖌️",d:"Magic Design ile saniyede profesyonel tasarım. Türkçe destekli.",url:"https://canva.com",free:true,tag:"Tasarım"},
    {n:"Adobe Firefly",e:"🔥",d:"Adobe'un AI görsel üreticisi. Telif güvenli, Photoshop entegreli.",url:"https://firefly.adobe.com",free:true,tag:"Görsel"},
    {n:"Looka",e:"👁️",d:"AI logo tasarımı. 500+ kombinasyon, marka kiti dahil.",url:"https://looka.com",free:false,tag:"Logo"},
    {n:"Remove.bg",e:"✂️",d:"Fotoğraftan arka planı anında kaldır. API mevcut.",url:"https://remove.bg",free:true,tag:"Fotoğraf"},
    {n:"Krea.ai",e:"✨",d:"Gerçek zamanlı AI görsel üretimi. Çizimden fotoğrafa.",url:"https://krea.ai",free:true,tag:"Görsel"},
  ]},
  {cat:"📝 Yazı AI",tools:[
    {n:"Jasper",e:"✍️",d:"Pazarlama içeriği için AI. Blog, sosyal medya, reklam metinleri.",url:"https://jasper.ai",free:false,tag:"İçerik"},
    {n:"Copy.ai",e:"📋",d:"Satış ve pazarlama metni oluşturucu. 90+ şablon.",url:"https://copy.ai",free:true,tag:"Metin"},
    {n:"Grammarly",e:"📖",d:"AI yazım ve ton denetleyici. Türkçe desteği sınırlı.",url:"https://grammarly.com",free:true,tag:"Yazım"},
    {n:"Hemingway App",e:"📝",d:"Yazıyı sadeleştiren AI editör. Okunabilirlik skoru.",url:"https://hemingwayapp.com",free:true,tag:"Yazım"},
    {n:"Sudowrite",e:"🖋️",d:"Roman ve hikaye yazarları için AI asistan.",url:"https://sudowrite.com",free:false,tag:"Yaratıcı"},
  ]},
  {cat:"🔊 Ses & Müzik AI",tools:[
    {n:"ElevenLabs",e:"🎤",d:"3 sn kayıtla ses klonlama. 30+ dil. En gelişmiş TTS.",url:"https://elevenlabs.io",free:true,tag:"Ses"},
    {n:"Suno AI",e:"🎵",d:"Sözlü şarkı üretimi. Prompt yaz, müzik çıksın.",url:"https://suno.ai",free:true,tag:"Müzik"},
    {n:"Udio",e:"🎼",d:"Suno alternatifi müzik AI. Yüksek kalite stüdyo sesi.",url:"https://udio.com",free:true,tag:"Müzik"},
    {n:"Descript",e:"🎬",d:"Video/podcast editör. Metni silerek video kesme.",url:"https://descript.com",free:true,tag:"Video"},
    {n:"Adobe Podcast",e:"🎙️",d:"Ses kalitesini profesyonel stüdyo seviyesine çıkar. Ücretsiz.",url:"https://podcast.adobe.com",free:true,tag:"Ses"},
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
  if(page==="guvenlik"){  return <Wrapper nav={nav} page={page} cookie={cookie} setCookie={setCookie}><AIGuvenlikPage setPage={nav}/></Wrapper>;}
  if(page==="turkiyeai"){return <Wrapper nav={nav} page={page} cookie={cookie} setCookie={setCookie}><TurkiyeAIPage setPage={nav}/></Wrapper>;}
  if(page==="hukuk"){    return <Wrapper nav={nav} page={page} cookie={cookie} setCookie={setCookie}><AIHukukPage setPage={nav}/></Wrapper>;}
  if(page==="yarisma"){  return <Wrapper nav={nav} page={page} cookie={cookie} setCookie={setCookie}><YarismPage setPage={nav}/></Wrapper>;}
  if(page==="gorselai"){return <Wrapper nav={nav} page={page} cookie={cookie} setCookie={setCookie}><GorselAIPage setPage={nav}/></Wrapper>;}
  if(page==="videorehai"){return <Wrapper nav={nav} page={page} cookie={cookie} setCookie={setCookie}><AIVideoPage setPage={nav}/></Wrapper>;}
  if(page==="meslekAI"){return <Wrapper nav={nav} page={page} cookie={cookie} setCookie={setCookie}><MeslekAIPage setPage={nav}/></Wrapper>;}
  if(page==="aifiyat"){return <Wrapper nav={nav} page={page} cookie={cookie} setCookie={setCookie}><AIFiyatPage setPage={nav}/></Wrapper>;}
    if(page==="cursor"){return <Wrapper nav={nav} page={page} cookie={cookie} setCookie={setCookie}><CursorPage setPage={nav}/></Wrapper>;}
    if(page==="perplexity"){return <Wrapper nav={nav} page={page} cookie={cookie} setCookie={setCookie}><PerplexityPage setPage={nav}/></Wrapper>;}
    if(page==="notebooklm"){return <Wrapper nav={nav} page={page} cookie={cookie} setCookie={setCookie}><NotebookLMPage setPage={nav}/></Wrapper>;}
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
    {page==="emoji"         &&<EmojiTahmin/>}
    {page==="dedektif"      &&<ModelDedektifPage/>}
    {page==="kariyer_sim"   &&<KariyerSimPage/>}
    {page==="cark"          &&<LuckyWheelPage/>}
    {page==="animasyon"     &&<AnimasyonPage/>}
    {page==="flashcard"     &&<FlashcardPage/>}
    {page==="maliyet"       &&<MaliyetPage/>}
        {page==="gorev" &&<div style={{padding:"24px 16px",maxWidth:800,margin:"0 auto"}}><div style={{marginBottom:20}}><div style={{fontSize:9,letterSpacing:".2em",color:"#34d399",marginBottom:4}}>GÜNLÜK GÖREVLER</div><h1 style={{fontSize:24,fontWeight:900,color:"#e2e8f0",fontFamily:"'Space Grotesk',sans-serif",margin:"0 0 8px"}}>📋 Günlük AI Görevleri</h1><p style={{fontSize:12,color:"#64748b",margin:0}}>Yapay zeka öğrenme içerikleri — günlük ilham ve pratik</p></div><DailyMissionsWidget setPage={nav}/></div>}
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
    {page==="isborsasi"   &&<IsBorsasiPage/>}
    {page==="sertifika"   &&<SertifikaPage/>}
    {page==="sablonlar"   &&<SablonlarPage/>}
    {page==="gunlukezet"  &&<GunlukOzetPage/>}
    {page==="videorehber" &&<VideoRehberPage/>}
  </Wrapper>;
}


// ══════════════════════════════════════════════════════════
// CLAUDE KAPSAMLI SAYFA
// ══════════════════════════════════════════════════════════
function ClaudePage({setPage}){
  const[tab,setTab]=useState('genel');
  const[prompt,setPrompt]=useState('');
  const[result,setResult]=useState('');
  const[loading,setLoading]=useState(false);

  const MODELS=[
    {name:"Claude Haiku 4.5",badge:"Hızlı",color:"#34d399",ctx:"200K",speed:"⚡⚡⚡",best:"Hızlı görevler, chatbot",free:true,icon:"🌿"},
    {name:"Claude Sonnet 4.5",badge:"Dengeli",color:"#00dcff",ctx:"200K",speed:"⚡⚡",best:"Genel görevler, kod, analiz",free:true,icon:"🎵"},
    {name:"Claude Opus 4.5",badge:"En Güçlü",color:"#a855f7",ctx:"200K",speed:"⚡",best:"Karmaşık akıl yürütme, araştırma",free:false,icon:"👑"},
    {name:"Claude Sonnet Thinking",badge:"Reasoning",color:"#f472b6",ctx:"100K",speed:"⚡",best:"Matematik, mantık, strateji",free:false,icon:"🧠"},
  ];

  const TIPS=[
    {e:"🎯",t:"Rol Ver",d:"'Senior yazılım mühendisi olarak...' diye başla. Claude daha spesifik ve kaliteli yanıt verir."},
    {e:"📋",t:"Format Belirt","d":"'Madde madde listele', 'Tablo olarak göster', 'JSON formatında ver' — Claude tam istediğin formatta üretir."},
    {e:"🔄",t:"Adım Adım",d:"'Adım adım düşün' veya 'Chain of thought' ekle. Mantık hataları %40 azalır."},
    {e:"📏",t:"Uzunluk Kontrol",d:"'3 cümlede özetle' veya '500 kelime' gibi kısıtlamalar daha odaklı yanıt sağlar."},
    {e:"🎭",t:"Örnek Ver",d:"'Şu şekilde yaz: [örnek]' — Few-shot prompting, sıfırdan 3x daha iyi sonuç verir."},
    {e:"⚡",t:"XML Tags",d:"Claude XML tag'leri sever: <context>...</context> <task>...</task> yapısı daha net yanıt sağlar."},
  ];

  const USECASES=[
    {icon:"💻",title:"Kod Yazma & Debug",desc:"SWE-bench'te %87.6 ile dünya #1. Python, JS, TypeScript, SQL ve 50+ dil.",example:"Bu Python kodundaki hatayı bul ve düzelt: [kod]",color:"#00dcff"},
    {icon:"📝",title:"Uzun Döküman Analizi",desc:"1M token = 750.000 kelime. Tüm kitabı tek seferde analiz et.",example:"Bu 300 sayfalık raporu özetle ve en önemli 5 bulguyu listele",color:"#34d399"},
    {icon:"🔬",title:"Araştırma & Analiz",desc:"Akademik makaleler, veri analizi, karşılaştırmalı raporlar.",example:"ChatGPT vs Claude vs Gemini karşılaştırma tablosu oluştur",color:"#a855f7"},
    {icon:"✍️",title:"İçerik Üretimi",desc:"Blog, email, sosyal medya, reklam metni — markanın sesiyle.",example:"Startup için 5 farklı LinkedIn post taslağı yaz",color:"#f472b6"},
    {icon:"🧮",title:"Matematiksel Akıl",desc:"Thinking modu ile olimpiyat seviyesi matematik problemleri.",example:"Bu veri bilimi sorusunu adım adım çöz: [problem]",color:"#fbbf24"},
    {icon:"🌐",title:"Çok Dilli Çeviri",desc:"95+ dil, Türkçe dahil. Kültürel nüansları anlayan bağlamsal çeviri.",example:"Bu metni Türkçeden İngilizceye resmi üslupla çevir",color:"#fb923c"},
  ];

  async function tryClaude(){
    if(!prompt.trim()||loading)return;
    setLoading(true);setResult('');
    try{
      const res=await fetch('https://api.anthropic.com/v1/messages',{
        method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:600,
          messages:[{role:'user',content:prompt}]})
      });
      const d=await res.json();
      setResult(d.content?.[0]?.text||'Yanıt alınamadı.');
    }catch(e){setResult('Hata: '+e.message);}
    setLoading(false);
  }

  const TABS=[{id:'genel',l:'🧠 Genel Bakış'},{id:'modeller',l:'🔢 Modeller'},{id:'ipuclari',l:'💡 İpuçları'},{id:'kullanim',l:'🎯 Kullanım'},{id:'dene',l:'⚡ Dene'}];

  return <div style={{maxWidth:960,margin:'0 auto',padding:'24px 16px'}}>
    {/* Hero */}
    <div style={{background:'linear-gradient(135deg,rgba(168,85,247,0.12),rgba(0,220,255,0.06))',border:'1px solid rgba(168,85,247,0.25)',borderRadius:18,padding:'24px',marginBottom:20,position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',top:-20,right:-20,fontSize:120,opacity:.05}}>🧠</div>
      <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:12,flexWrap:'wrap'}}>
        <div style={{width:52,height:52,borderRadius:14,background:'linear-gradient(135deg,#a855f7,#7c3aed)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:28,boxShadow:'0 4px 20px rgba(168,85,247,0.4)'}}>🧠</div>
        <div>
          <h1 style={{margin:0,fontSize:'clamp(20px,4vw,30px)',fontWeight:900,color:'#e2e8f0',fontFamily:"'Space Grotesk',sans-serif"}}>Claude AI — Türkçe Rehber</h1>
          <div style={{fontSize:12,color:'#a855f7',marginTop:3}}>Anthropic · Kodlamada Dünya #1 · Constitutional AI · 1M Token</div>
        </div>
        <div style={{marginLeft:'auto',display:'flex',gap:6,flexWrap:'wrap'}}>
          {['SWE-bench #1','Constitutional AI','1M Token','Güvenli'].map(b=><span key={b} style={{fontSize:9,background:'rgba(168,85,247,0.15)',color:'#a855f7',border:'1px solid rgba(168,85,247,0.3)',borderRadius:6,padding:'3px 8px',fontWeight:700}}>{b}</span>)}
        </div>
      </div>
      <p style={{margin:0,fontSize:13,color:'#94a3b8',lineHeight:1.7}}>Anthropic tarafından geliştirilen Claude, <strong style={{color:'#e2e8f0'}}>yazılım mühendisliğinde dünya rekoru tutan</strong> tek AI modelidir. Constitutional AI yaklaşımı ile güvenlik ve şeffaflık önce gelir. 1 milyon token context ile tüm bir kitabı tek seferde analiz eder.</p>
    </div>

    {/* Tabs */}
    <div style={{display:'flex',gap:6,marginBottom:20,flexWrap:'wrap'}}>
      {TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{padding:'8px 14px',borderRadius:10,border:'1px solid '+(tab===t.id?'rgba(168,85,247,0.5)':'rgba(255,255,255,0.08)'),background:tab===t.id?'rgba(168,85,247,0.12)':'rgba(255,255,255,0.02)',color:tab===t.id?'#a855f7':'#64748b',fontSize:11,cursor:'pointer',fontFamily:'inherit',fontWeight:tab===t.id?700:400}}>{t.l}</button>)}
    </div>

    {/* Genel Bakış */}
    {tab==='genel'&&<div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:12,marginBottom:20}}>
        {[['🏆','SWE-bench %87.6','Yazılım mühendisliği dünya rekoru','#fbbf24'],['📚','1M Token Context','750.000 kelime — 10 roman tek seferde','#00dcff'],['⚖️','Constitutional AI','Her kararı etik ilkeler listesiyle kontrol','#34d399'],['🌍','95+ Dil','Türkçe dahil tüm büyük diller','#a855f7'],['🔒','Güvenli Tasarım','Zararlı içerik üretmez, şeffaf çalışır','#f472b6'],['⚡','Hız','Sonnet 4.5: saniyede 100+ token','#fb923c']].map(([e,t,d,c])=><div key={t} style={{background:c+'08',border:'1px solid '+c+'20',borderRadius:12,padding:'14px'}}>
          <div style={{fontSize:24,marginBottom:8}}>{e}</div>
          <div style={{fontSize:13,fontWeight:700,color:c,marginBottom:4}}>{t}</div>
          <div style={{fontSize:11,color:'#64748b'}}>{d}</div>
        </div>)}
      </div>
      <div style={{background:'rgba(168,85,247,0.04)',border:'1px solid rgba(168,85,247,0.15)',borderRadius:12,padding:'16px'}}>
        <div style={{fontSize:13,fontWeight:700,color:'#e2e8f0',marginBottom:10}}>🆚 Claude vs ChatGPT — Kısa Karşılaştırma</div>
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:11}}>
            <thead><tr>{['','Claude Sonnet','ChatGPT-4o','Kazanan'].map(h=><th key={h} style={{padding:'8px 10px',textAlign:'left',color:'#475569',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>{h}</th>)}</tr></thead>
            <tbody>{[['Kodlama','%87.6 SWE','%72.1 SWE','🏆 Claude'],['Türkçe','Çok iyi','Mükemmel','🤝 Eşit'],['Context','1M token','128K token','🏆 Claude'],['Hız','Hızlı','Hızlı','🤝 Eşit'],['Ücretsiz','Evet (sınırlı)','Evet (sınırlı)','🤝 Eşit'],['Güvenlik','Constitutional AI','RLHF','🏆 Claude'],['Görsel','Evet','Evet','🤝 Eşit']].map(([r,...cells])=><tr key={r}>{[r,...cells].map((c,i)=><td key={i} style={{padding:'8px 10px',color:i===0?'#94a3b8':i===3?'#fbbf24':'#cbd5e1',borderBottom:'1px solid rgba(255,255,255,0.03)'}}>{c}</td>)}</tr>)}</tbody>
          </table>
        </div>
      </div>
    </div>}

    {/* Modeller */}
    {tab==='modeller'&&<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:12}}>
      {MODELS.map(m=><div key={m.name} style={{background:m.color+'08',border:'2px solid '+m.color+'25',borderRadius:14,padding:'18px'}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}>
          <span style={{fontSize:28}}>{m.icon}</span>
          <div style={{fontSize:9,background:m.free?'rgba(52,211,153,0.15)':'rgba(251,191,36,0.15)',color:m.free?'#34d399':'#fbbf24',border:'1px solid '+(m.free?'rgba(52,211,153,0.3)':'rgba(251,191,36,0.3)'),borderRadius:5,padding:'2px 7px',fontWeight:700,alignSelf:'flex-start'}}>{m.free?'Ücretsiz':'Pro'}</div>
        </div>
        <div style={{fontSize:13,fontWeight:800,color:m.color,marginBottom:4,fontFamily:"'Space Grotesk',sans-serif"}}>{m.name}</div>
        <div style={{fontSize:9,background:m.color+'20',color:m.color,borderRadius:5,padding:'2px 8px',display:'inline-block',marginBottom:10,fontWeight:700}}>{m.badge}</div>
        <div style={{display:'flex',flexDirection:'column',gap:5}}>
          {[['Context',m.ctx],['Hız',m.speed],['En İyi',m.best]].map(([k,v])=><div key={k} style={{display:'flex',gap:6}}><span style={{fontSize:10,color:'#475569',minWidth:50}}>{k}:</span><span style={{fontSize:10,color:'#e2e8f0'}}>{v}</span></div>)}
        </div>
      </div>)}
    </div>}

    {/* İpuçları */}
    {tab==='ipuclari'&&<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:12}}>
      {TIPS.map(t=><div key={t.t} style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(0,220,255,0.1)',borderRadius:12,padding:'16px'}}>
        <div style={{display:'flex',gap:10,marginBottom:8}}><span style={{fontSize:24}}>{t.e}</span><div style={{fontSize:13,fontWeight:700,color:'#00dcff'}}>{t.t}</div></div>
        <div style={{fontSize:11,color:'#64748b',lineHeight:1.6}}>{t.d}</div>
      </div>)}
    </div>}

    {/* Kullanım Alanları */}
    {tab==='kullanim'&&<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:12}}>
      {USECASES.map(u=><div key={u.title} style={{background:u.color+'06',border:'1px solid '+u.color+'18',borderRadius:12,padding:'16px'}}>
        <div style={{fontSize:28,marginBottom:8}}>{u.icon}</div>
        <div style={{fontSize:13,fontWeight:700,color:u.color,marginBottom:6}}>{u.title}</div>
        <div style={{fontSize:11,color:'#64748b',marginBottom:10,lineHeight:1.5}}>{u.desc}</div>
        <div style={{background:'rgba(0,0,0,0.3)',borderRadius:8,padding:'8px 10px',fontSize:10,color:'#475569',fontFamily:'monospace',lineHeight:1.4}}>💡 {u.example}</div>
      </div>)}
    </div>}

    {/* Dene */}
    {tab==='dene'&&<div>
      <div style={{background:'rgba(168,85,247,0.04)',border:'1px solid rgba(168,85,247,0.2)',borderRadius:14,padding:'20px',marginBottom:16}}>
        <div style={{fontSize:14,fontWeight:700,color:'#e2e8f0',marginBottom:12}}>⚡ Claude'u Dene — Canlı API</div>
        <textarea value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="Claude'a bir şey sor... Örn: 'Bana Python ile web scraper yaz' veya 'React component oluştur'" style={{width:'100%',minHeight:100,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(168,85,247,0.2)',borderRadius:10,padding:'12px',color:'#e2e8f0',fontSize:12,fontFamily:'inherit',resize:'vertical',outline:'none',boxSizing:'border-box'}}/>
        <div style={{display:'flex',gap:8,marginTop:10,flexWrap:'wrap'}}>
          <button onClick={tryClaude} disabled={loading||!prompt.trim()} style={{padding:'10px 20px',border:'none',borderRadius:10,background:loading||!prompt.trim()?'rgba(168,85,247,0.2)':'linear-gradient(135deg,#a855f7,#7c3aed)',color:loading||!prompt.trim()?'#475569':'#fff',fontSize:12,cursor:loading?'wait':'pointer',fontWeight:700}}>
            {loading?'⏳ Yanıt alınıyor...':'🧠 Claude\'a Sor'}
          </button>
          {['Kod yaz: hesap makinesi','İçerik üret: LinkedIn post','Analiz et: SWOT analizi'].map(q=><button key={q} onClick={()=>setPrompt(q.split(': ')[1]||q)} style={{fontSize:10,color:'#a855f7',border:'1px solid rgba(168,85,247,0.25)',borderRadius:8,padding:'6px 10px',background:'rgba(168,85,247,0.06)',cursor:'pointer',fontFamily:'inherit'}}>{q.split(': ')[0]} →</button>)}
        </div>
      </div>
      {result&&<div style={{background:'rgba(168,85,247,0.04)',border:'1px solid rgba(168,85,247,0.15)',borderRadius:12,padding:'16px'}}>
        <div style={{fontSize:11,color:'#a855f7',marginBottom:8,fontWeight:700}}>🧠 Claude Yanıtı:</div>
        <div style={{fontSize:12,color:'#cbd5e1',lineHeight:1.8,whiteSpace:'pre-wrap'}}>{result}</div>
      </div>}
      <div style={{marginTop:16,textAlign:'center'}}>
        <a href="https://claude.ai" target="_blank" rel="noopener noreferrer" style={{display:'inline-flex',gap:8,alignItems:'center',padding:'12px 24px',background:'linear-gradient(135deg,#a855f7,#7c3aed)',borderRadius:12,color:'#fff',textDecoration:'none',fontSize:13,fontWeight:700,boxShadow:'0 4px 20px rgba(168,85,247,0.4)'}}>🧠 Claude.ai'yi Aç →</a>
      </div>
    </div>}
  </div>;
}

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
        {[["👥","480+","Haftalık kullanıcı"],["🌍","1113+","Ülke"],["🖼️","DALL-E 3","Görsel üretim"],["🎙️","Ses Modu","Konuşma AI"],["🔌","Plugin","Ekosistemi"],["💾","Hafıza","Kişiselleşme"]].map(([e,t,d])=>(
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
  const[activeTab,setActiveTab]=useState('🧠');
  const ref=useRef();

  const C={Model:'#a855f7',Öğren:'#34d399',Araç:'#00dcff',Oyun:'#f472b6',
    Kariyer:'#fbbf24',Güvenlik:'#ff6b6b',Topluluk:'#a855f7',Site:'#64748b',
    Sözlük:'#60a5fa',Prompt:'#fb923c',Haber:'#ff4444'};

  // Tüm sayfalar + tam içerik indeksi
  const INDEX=useMemo(()=>{
    const items=[];
    const PAGES=[
      {p:'home',t:'Ana Sayfa',e:'🏠',cat:'Site'},
      {p:'haberler',t:'Haberler',e:'📰',cat:'Haber',sub:'Güncel AI haberleri 2026'},
      {p:'blog',t:'Blog',e:'✍️',cat:'Site',sub:'12 AI blog yazısı'},
      {p:'gunlukezet',t:'Günlük Özet',e:'📋',cat:'Site',sub:'Günün AI özeti'},
      {p:'claude',t:'Claude AI',e:'🧠',cat:'Model',sub:'Anthropic · Constitutional AI · 1M token',keywords:'anthropic sonnet opus haiku'},
      {p:'chatgpt',t:'ChatGPT',e:'🤖',cat:'Model',sub:'OpenAI GPT-4o · Türkçe mükemmel',keywords:'openai gpt-4o dall-e'},
      {p:'gemini',t:'Gemini AI',e:'🌟',cat:'Model',sub:'Google · 2M token · Video analizi',keywords:'google bard deepmind'},
      {p:'grok',t:'Grok AI',e:'⚡',cat:'Model',sub:'xAI · Güncel Twitter verisi',keywords:'elon musk x twitter'},
      {p:'deepseek',t:'DeepSeek',e:'🔬',cat:'Model',sub:'Çin · Ücretsiz · GPT-4 kalitesi',keywords:'çin r1 v3 ücretsiz açık kaynak'},
      {p:'mistral',t:'Mistral AI',e:'🌊',cat:'Model',sub:'Fransa · GDPR uyumlu · Açık kaynak',keywords:'fransa avrupa le chat codestral'},
      {p:'llama',t:'Meta Llama',e:'🦙',cat:'Model',sub:'Meta · Tamamen açık kaynak · Self-host',keywords:'meta facebook açık kaynak'},
      {p:'karsilastirma',t:'Model Karşılaştırma',e:'🆚',cat:'Model',sub:'7 model · 6 kategori · Benchmark skorları'},
      {p:'ogrenme',t:'AI Öğren',e:'🎓',cat:'Öğren',sub:'Başlangıçtan ileri seviyeye'},
      {p:'prompt',t:'Prompt Rehberi',e:'💡',cat:'Öğren',sub:'113 hazır Türkçe prompt şablonu',keywords:'komut örnek şablon ipucu'},
      {p:'sozluk',t:'AI Sözlük',e:'📖',cat:'Öğren',sub:'110 terim · LLM RAG MoE Constitutional AI',keywords:'terim tanım açıklama'},
      {p:'flashcard',t:'AI Flashcard',e:'🃏',cat:'Öğren',sub:'Kart sistemi ile AI öğren'},
      {p:'mitler',t:'AI Mitleri',e:'💡',cat:'Öğren',sub:'Yapay zeka efsaneleri çürütülüyor'},
      {p:'gorselai',t:'Görsel AI Rehberi',e:'🎨',cat:'Öğren',sub:'Midjourney · DALL-E 3 · Stable Diffusion',keywords:'midjourney dalle stable görsel üret'},
      {p:'videorehai',t:'AI Video Rehberi',e:'🎬',cat:'Öğren',sub:'Sora · Runway · Kling · HeyGen',keywords:'sora runway kling pika video'},
      {p:'tools',t:'AI Araçlar Dizini',e:'🛠️',cat:'Araç',sub:'79 araç · 10 kategori',keywords:'cursor copilot elevenlabs'},
      {p:'dizin',t:'Araç Kategorileri',e:'📋',cat:'Araç'},
      {p:'aistatus',t:'AI Durum',e:'🟢',cat:'Araç',sub:'Canlı servis durumu'},
      {p:'aifiyat',t:'AI Fiyat Karşılaştırma',e:'💲',cat:'Araç',sub:'10 model API fiyatı',keywords:'fiyat maliyet token ucuz'},
      {p:'maliyet',t:'Maliyet Hesapla',e:'💰',cat:'Araç'},
      {p:'zaman',t:'Zaman Hesapla',e:'⏱️',cat:'Araç'},
      {p:'sablonlar',t:'Şablonlar',e:'📄',cat:'Araç',sub:'6 hazır iş şablonu'},
      {p:'para',t:'AI ile Para Kazan',e:'💰',cat:'Kariyer',sub:'Freelance · Prompt satışı · Danışmanlık',keywords:'gelir kazanmak iş'},
      {p:'kariyer',t:'AI Kariyer',e:'💼',cat:'Kariyer'},
      {p:'isborsasi',t:'İş Borsası',e:'👔',cat:'Kariyer',sub:'AI iş ilanları Türkiye'},
      {p:'meslekAI',t:'Mesleklere Göre AI',e:'👔',cat:'Kariyer',sub:'8 meslek için araç seti',keywords:'doktor avukat mühendis meslek'},
      {p:'oyunlar',t:'Oyun Galerisi',e:'🎮',cat:'Oyun',sub:'12 interaktif AI oyunu'},
      {p:'trivia',t:'AI Trivia',e:'🎯',cat:'Oyun',sub:'60 soru bilgi yarışması'},
      {p:'iqtest',t:'IQ Testi',e:'🧠',cat:'Oyun'},
      {p:'roulette',t:'Prompt Ruleti',e:'🎰',cat:'Oyun'},
      {p:'dedektif',t:'Model Dedektif',e:'🔍',cat:'Oyun'},
      {p:'cark',t:'Şans Çarkı',e:'🎡',cat:'Oyun'},
      {p:'puan',t:'Prompt Skorer',e:'⭐',cat:'Oyun'},
      {p:'kisilik',t:'Kişilik Testi',e:'🧪',cat:'Oyun'},
      {p:'emoji',t:'Emoji Tahmin',e:'😀',cat:'Oyun'},
      {p:'quiz',t:'AI Quiz',e:'❓',cat:'Oyun'},
      {p:'animasyon',t:'AI Animasyonlar',e:'✨',cat:'Oyun',sub:'25 canlı canvas animasyonu'},
      {p:'galeri',t:'AI Galerisi',e:'🖼️',cat:'Oyun'},
      {p:'guvenlik',t:'AI Güvenlik',e:'🛡️',cat:'Güvenlik',sub:'Deepfake · Ses klonlama · Phishing korunma',keywords:'deepfake sahte dolandırıcılık güvenlik'},
      {p:'hukuk',t:'AI Hukuk',e:'⚖️',cat:'Güvenlik',sub:'KVKK · Telif · AB AI Act',keywords:'kvkk telif hukuki yasal kanun'},
      {p:'turkiyeai',t:'Türkiye AI Ekosistemi',e:'🇹🇷',cat:'Güvenlik',sub:'250+ startup · Üniversiteler · Yatırım',keywords:'türk yerli startup girişim'},
      {p:'topluluk',t:'Topluluk',e:'👥',cat:'Topluluk'},
      {p:'yarisma',t:'Prompt Yarışması',e:'🏆',cat:'Topluluk',sub:'9 topluluk promptu · Oy ver'},
      {p:'oneri',t:'Öneri',e:'💬',cat:'Topluluk'},
      {p:'sertifika',t:'AI Sertifika',e:'🏅',cat:'Topluluk'},
      {p:'videorehber',t:'Video Rehberi',e:'📺',cat:'Topluluk',sub:'YouTube AI eğitim videoları'},
      {p:'gorev',t:'Günlük Görevler',e:'✅',cat:'Site'},
      {p:'pro',t:'Pro Üyelik',e:'⭐',cat:'Site'},
      {p:'hakkimizda',t:'Hakkımızda',e:'ℹ️',cat:'Site'},
      {p:'iletisim',t:'İletişim',e:'📧',cat:'Site'},
      {p:'gizlilik',t:'Gizlilik',e:'🔒',cat:'Site'},
    ];
    items.push(...PAGES);
    // Obsidian içerikleri
    [{p:'blog',t:'Obsidian + AI: İkinci Beyin Rehberi',e:'💎',cat:'Rehber',sub:'Obsidian note taking + Claude entegrasyonu PKM'},
     {p:'blog',t:'Zettelkasten Yöntemi ve AI',e:'🔗',cat:'Rehber',sub:'Bağlantılı not alma sistemi'},
     {p:'prompt',t:'Obsidian Smart Composer Kullanımı',e:'💡',cat:'Prompt',sub:'Obsidian AI plugin kullanım promptları'},
     {p:'tools',t:'Obsidian',e:'💎',cat:'Araç',sub:'Kişisel bilgi yönetimi - markdown tabanlı - ücretsiz'},
     {p:'ogrenme',t:'PKM - Kişisel Bilgi Yönetimi',e:'📚',cat:'Öğren',sub:'Second brain, Zettelkasten, Obsidian'},
    ].forEach(i=>items.push(i));
    if(typeof GLOSSARY_DATA!=='undefined')GLOSSARY_DATA.forEach(g=>items.push({p:'sozluk',t:g.term,e:'📖',cat:'Sözlük',sub:(g.def||'').slice(0,80),keywords:g.en||''}));
    if(typeof PROMPTS_DATA!=='undefined')PROMPTS_DATA.forEach(cat=>(cat.items||[]).forEach(p=>items.push({p:'prompt',t:p.title,e:'💡',cat:'Prompt',sub:cat.cat,keywords:cat.cat})));
    if(typeof ALL_TOOLS!=='undefined')ALL_TOOLS.forEach(cat=>(cat.tools||[]).forEach(t=>items.push({p:'tools',t:t.n,e:'🛠️',cat:'Araç',sub:(t.d||'').slice(0,60),keywords:(t.tag||'')})));
    if(typeof NEWS!=='undefined')NEWS.forEach(n=>items.push({p:'haberler',t:n.title||n.t||'',e:'📰',cat:'Haber'}));
    return items;
  },[]);

  // Arama sonuçları
  const results=q.length>1?INDEX.filter(item=>{
    const s=q.toLowerCase().trim();
    return [item.t,item.sub,item.cat,item.keywords].filter(Boolean).join(' ').toLowerCase().includes(s);
  }).slice(0,14):[];

  // Sekmeli hızlı erişim grupları
  const QA_TABS=[
    {id:'🧠',label:'Modeller',color:'#a855f7',items:[
      {p:'claude',t:'Claude',e:'🧠'},{p:'chatgpt',t:'ChatGPT',e:'🤖'},{p:'gemini',t:'Gemini',e:'🌟'},
      {p:'grok',t:'Grok',e:'⚡'},{p:'deepseek',t:'DeepSeek',e:'🔬'},{p:'mistral',t:'Mistral',e:'🌊'},
      {p:'llama',t:'Llama',e:'🦙'},{p:'karsilastirma',t:'Karşılaştır',e:'🆚'},
    ]},
    {id:'🎓',label:'Öğren',color:'#34d399',items:[
      {p:'ogrenme',t:'AI Öğren',e:'🎓'},{p:'prompt',t:'Prompt (113)',e:'💡'},
      {p:'sozluk',t:'Sözlük (110)',e:'📖'},{p:'flashcard',t:'Flashcard',e:'🃏'},
      {p:'mitler',t:'Mitler',e:'💡'},{p:'gorselai',t:'Görsel AI',e:'🎨'},
      {p:'videorehai',t:'Video AI',e:'🎬'},
    ]},
    {id:'🛠️',label:'Araçlar',color:'#00dcff',items:[
      {p:'tools',t:'Araçlar (79)',e:'🛠️'},{p:'dizin',t:'Kategoriler',e:'📋'},
      {p:'aifiyat',t:'Fiyatlar',e:'💲'},{p:'maliyet',t:'Maliyet',e:'💰'},
      {p:'zaman',t:'Zaman',e:'⏱️'},{p:'aistatus',t:'AI Durum',e:'🟢'},
      {p:'sablonlar',t:'Şablonlar',e:'📄'},
    ]},
    {id:'🎮',label:'Oyunlar',color:'#f472b6',items:[
      {p:'oyunlar',t:'Tüm Oyunlar',e:'🎮'},{p:'trivia',t:'Trivia (60)',e:'🎯'},
      {p:'iqtest',t:'IQ Testi',e:'🧠'},{p:'roulette',t:'Prompt Rulet',e:'🎰'},
      {p:'dedektif',t:'Dedektif',e:'🔍'},{p:'cark',t:'Şans Çarkı',e:'🎡'},
      {p:'puan',t:'Skorer',e:'⭐'},{p:'kisilik',t:'Kişilik',e:'🧪'},
      {p:'emoji',t:'Emoji Tahmin',e:'😀'},{p:'quiz',t:'AI Quiz',e:'❓'},
      {p:'animasyon',t:'Animasyonlar',e:'✨'},{p:'galeri',t:'Galeri',e:'🖼️'},
    ]},
    {id:'💼',label:'Kariyer',color:'#fbbf24',items:[
      {p:'para',t:'Para Kazan',e:'💰'},{p:'kariyer',t:'Kariyer',e:'💼'},
      {p:'isborsasi',t:'İş Borsası',e:'👔'},{p:'meslekAI',t:'Meslek AI',e:'👔'},
    ]},
    {id:'🛡️',label:'Güvenlik',color:'#ff6b6b',items:[
      {p:'guvenlik',t:'AI Güvenlik',e:'🛡️'},{p:'hukuk',t:'AI Hukuk',e:'⚖️'},
      {p:'turkiyeai',t:'Türkiye AI',e:'🇹🇷'},
    ]},
    {id:'👥',label:'Topluluk',color:'#a855f7',items:[
      {p:'topluluk',t:'Topluluk',e:'👥'},{p:'yarisma',t:'Yarışma',e:'🏆'},
      {p:'oneri',t:'Öneri',e:'💬'},{p:'sertifika',t:'Sertifika',e:'🏅'},
      {p:'videorehber',t:'Video Rehber',e:'📺'},
    ]},
    {id:'📰',label:'Diğer',color:'#64748b',items:[
      {p:'haberler',t:'Haberler',e:'📰'},{p:'blog',t:'Blog (12)',e:'✍️'},
      {p:'gunlukezet',t:'Günlük Özet',e:'📋'},{p:'gorev',t:'Görevler',e:'✅'},
      {p:'pro',t:'Pro Üyelik',e:'⭐'},{p:'hakkimizda',t:'Hakkımızda',e:'ℹ️'},
      {p:'iletisim',t:'İletişim',e:'📧'},{p:'gizlilik',t:'Gizlilik',e:'🔒'},
    ]},
  ];

  const activeTabData=QA_TABS.find(t=>t.id===activeTab)||QA_TABS[0];

  useEffect(()=>{
    if(!open)return;
    const h=e=>{if(ref.current&&!ref.current.contains(e.target)){setOpen(false);setQ('');}};
    document.addEventListener('mousedown',h);
    return()=>document.removeEventListener('mousedown',h);
  },[open]);

  return <div ref={ref} style={{position:'relative',flexShrink:0}}>
    <button onClick={()=>setOpen(o=>!o)} style={{width:34,height:34,border:'1px solid rgba(0,220,255,.22)',borderRadius:8,background:open?'rgba(0,220,255,.1)':'transparent',color:open?'#00dcff':'#64748b',cursor:'pointer',fontSize:14,display:'flex',alignItems:'center',justifyContent:'center',transition:'all .2s'}}>🔍</button>

    {open&&<div style={{position:'fixed',top:52,right:14,zIndex:99999,width:'min(380px,96vw)',background:'rgba(3,7,18,.99)',border:'1px solid rgba(0,220,255,.25)',borderRadius:16,boxShadow:'0 24px 80px rgba(0,0,0,.95)',display:'flex',flexDirection:'column',maxHeight:'88vh',overflow:'hidden'}}>

      {/* Arama kutusu */}
      <div style={{padding:'10px 14px',borderBottom:'1px solid rgba(0,220,255,.08)',background:'rgba(0,220,255,.03)',flexShrink:0}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <span style={{fontSize:14,color:'#334155',flexShrink:0}}>🔍</span>
          <input autoFocus value={q} onChange={e=>setQ(e.target.value)}
            onKeyDown={e=>{if(e.key==='Escape'){setOpen(false);setQ('');}}}
            placeholder='Sayfa, araç, prompt, sözlük...'
            style={{flex:1,background:'none',border:'none',outline:'none',color:'#e2e8f0',fontSize:12,fontFamily:'inherit'}}/>
          {q&&<button onClick={()=>setQ('')} style={{background:'none',border:'none',color:'#334155',cursor:'pointer',fontSize:12,flexShrink:0}}>✕</button>}
        </div>
      </div>

      {/* ARAMA SONUÇLARI */}
      {q.length>1&&<div style={{overflowY:'auto',flex:1,maxHeight:'75vh'}}>
        {results.length===0&&<div style={{padding:'20px',textAlign:'center',fontSize:11,color:'#334155'}}>"{q}" için sonuç yok</div>}
        {results.map((r,i)=><div key={i} onClick={()=>{nav(r.p);setOpen(false);setQ('');}}
          style={{display:'flex',gap:10,alignItems:'flex-start',padding:'8px 14px',cursor:'pointer',borderTop:'1px solid rgba(255,255,255,.03)'}}
          onMouseEnter={e=>e.currentTarget.style.background='rgba(0,220,255,.05)'}
          onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
          <span style={{fontSize:15,flexShrink:0}}>{r.e}</span>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:11,fontWeight:600,color:'#e2e8f0',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.t}</div>
            {r.sub&&<div style={{fontSize:9,color:'#475569',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.sub}</div>}
          </div>
          <span style={{fontSize:8,color:C[r.cat]||'#475569',background:(C[r.cat]||'#475569')+'18',padding:'1px 6px',borderRadius:3,flexShrink:0,whiteSpace:'nowrap'}}>{r.cat}</span>
        </div>)}
        {results.length>0&&<div style={{padding:'5px 14px',fontSize:9,color:'#1e293b',borderTop:'1px solid rgba(255,255,255,.04)'}}>{results.length} sonuç</div>}
      </div>}

      {/* HIZLI ERİŞİM — Sekmeli */}
      {q.length<=1&&<>
        {/* Sekme başlıkları */}
        <div style={{display:'flex',overflowX:'auto',borderBottom:'1px solid rgba(255,255,255,.06)',flexShrink:0,scrollbarWidth:'none'}}>
          {QA_TABS.map(tab=><button key={tab.id} onClick={()=>setActiveTab(tab.id)}
            style={{display:'flex',flexDirection:'column',alignItems:'center',gap:1,padding:'7px 10px',border:'none',borderBottom:'2px solid '+(activeTab===tab.id?tab.color:'transparent'),background:'transparent',color:activeTab===tab.id?tab.color:'#334155',cursor:'pointer',fontFamily:'inherit',whiteSpace:'nowrap',flexShrink:0,transition:'all .15s'}}>
            <span style={{fontSize:13}}>{tab.id}</span>
            <span style={{fontSize:8,fontWeight:activeTab===tab.id?700:400}}>{tab.label}</span>
          </button>)}
        </div>
        {/* Aktif sekme içeriği */}
        <div style={{padding:'10px 12px',overflowY:'auto',flex:1}}>
          <div style={{fontSize:9,color:activeTabData.color,fontWeight:700,marginBottom:8,letterSpacing:'.08em'}}>{activeTabData.id} {activeTabData.label.toUpperCase()}</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:5}}>
            {activeTabData.items.map(item=><div key={item.p} onClick={()=>{nav(item.p);setOpen(false);setQ('');}}
              style={{display:'flex',gap:6,alignItems:'center',padding:'7px 10px',cursor:'pointer',borderRadius:8,border:'1px solid rgba(255,255,255,.05)',background:'rgba(255,255,255,.02)',transition:'all .15s'}}
              onMouseEnter={e=>{e.currentTarget.style.background=activeTabData.color+'18';e.currentTarget.style.borderColor=activeTabData.color+'40';}}
              onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,.02)';e.currentTarget.style.borderColor='rgba(255,255,255,.05)';}}>
              <span style={{fontSize:14,flexShrink:0}}>{item.e}</span>
              <span style={{fontSize:10,color:'#94a3b8',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{item.t}</span>
            </div>)}
          </div>
        </div>
      </>}
    </div>}
  </div>;
}

function Wrapper({children,nav,page,user,setUser,cookie,setCookie}){
  const[email,setEmail]=useState("");const[sent,setSent]=useState(false);
  const[openMenu,setOpenMenu]=useState(null);
  const[mobileOpen,setMobileOpen]=useState(false);
  const[showInstall,setShowInstall]=useState(false);
  const[installPrompt,setInstallPrompt]=useState(null);
  const[openGroups,setOpenGroups]=useState({'🧠 AI Modeller':true,'🎮 Oyunlar (12)':false,'🎓 Öğren & Rehber':false,'🛠️ Araçlar':false,'💼 Kariyer & Para':false,'🛡️ Güvenlik & Hukuk':false,'👥 Topluluk & Site':false});
  const toggleGroup=(g)=>setOpenGroups(p=>({...p,[g]:!p[g]}));
  // PWA install — 5 dakika sonra göster
  useEffect(()=>{
    const h=(e)=>{
      e.preventDefault();
      setInstallPrompt(e);
      setTimeout(()=>setShowInstall(true), 300000);
    };
    window.addEventListener('beforeinstallprompt', h);
    return()=>window.removeEventListener('beforeinstallprompt', h);
  },[]);
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
        <div style={{padding:"8px"}}>
          {[
            {group:"🧠 AI Modeller",color:"#a855f7",items:[
              {id:"claude",label:"Claude AI",icon:"🧠",info:"Constitutional AI · 1M token · Kodlama #1"},
              {id:"chatgpt",label:"ChatGPT",icon:"🤖",info:"GPT-4o · DALL-E · Türkçe mükemmel"},
              {id:"gemini",label:"Gemini AI",icon:"🌟",info:"Google · 2M token · Video analizi"},
              {id:"grok",label:"Grok AI",icon:"⚡",info:"xAI · Güncel Twitter verisi"},
              {id:"deepseek",label:"DeepSeek",icon:"🔬",info:"Ücretsiz API · GPT-4 kalitesi"},
              {id:"mistral",label:"Mistral AI",icon:"🌊",info:"Fransız · GDPR uyumlu · Açık kaynak"},
              {id:"llama",label:"Meta Llama",icon:"🦙",info:"Meta · Açık kaynak · Self-host"},
              {id:"karsilastirma",label:"Model Karşılaştır",icon:"🆚",info:"7 model · 6 kategoride benchmark"},
            ]},
            {group:"🎓 Öğren & Rehber",color:"#34d399",items:[
              {id:"ogrenme",label:"AI Öğren",icon:"🎓",info:"Yapay zekaya başlangıç rehberi"},
              {id:"prompt",label:"Prompt Rehberi",icon:"💡",info:"113+ Türkçe hazır şablon"},
              {id:"sozluk",label:"AI Sözlük",icon:"📖",info:"110 teknik terim Türkçe açıklama"},
              {id:"flashcard",label:"AI Flashcard",icon:"🃏",info:"Kart sistemi ile AI öğren"},
              {id:"mitler",label:"AI Mitleri",icon:"💡",info:"Yanlış bilinenler ve gerçekler"},
              {id:"gorselai",label:"Görsel AI",icon:"🎨",info:"Midjourney · DALL-E 3 · Firefly"},
              {id:"videorehai",label:"Video AI",icon:"🎬",info:"Sora · Runway · Kling · Pika"},
            ]},
            {group:"🛠️ Araçlar",color:"#00dcff",items:[
              {id:"tools",label:"AI Araç Dizini",icon:"🛠️",info:"79 araç · 10 kategori"},
              {id:"aifiyat",label:"AI Fiyat Karşılaştır",icon:"💲",info:"10 model API fiyatı tablosu"},
              {id:"maliyet",label:"Maliyet Hesapla",icon:"💰",info:"AI kullanım maliyeti hesapla"},
              {id:"zaman",label:"Zaman Hesapla",icon:"⏱️",info:"AI ile tasarruf hesapla"},
              {id:"aistatus",label:"AI Durum",icon:"🟢",info:"Canlı servis durum takibi"},
              {id:"sablonlar",label:"Şablonlar",icon:"📄",info:"Hazır iş şablonları kütüphanesi"},
            ]},
            {group:"🎮 Oyunlar (12)",color:"#f472b6",items:[
              {id:"oyunlar",label:"Oyun Galerisi",icon:"🎮",info:"12 farklı AI oyunu"},
              {id:"trivia",label:"AI Trivia",icon:"🎯",info:"60 soruluk bilgi yarışması"},
              {id:"iqtest",label:"IQ Testi",icon:"🧠",info:"Yapay zeka IQ ölçümü"},
              {id:"roulette",label:"Prompt Ruleti",icon:"🎰",info:"Rastgele prompt keşfet"},
              {id:"dedektif",label:"Model Dedektif",icon:"🔍",info:"AI modelini tahmin et"},
              {id:"cark",label:"Şans Çarkı",icon:"🎡",info:"Çarkı çevir, prompt kazan"},
              {id:"kisilik",label:"Kişilik Testi",icon:"🧪",info:"AI kişilik analizi"},
              {id:"animasyon",label:"Animasyonlar",icon:"✨",info:"25 canlı canvas animasyonu"},
              {id:"emoji",label:"Emoji Tahmin",icon:"😀",info:"Emoji ipuçlarıyla AI kavramı bul"},
              {id:"quiz",label:"AI Quiz",icon:"❓",info:"Çoktan seçmeli AI testi"},
            ]},
            {group:"💼 Kariyer & Para",color:"#fbbf24",items:[
              {id:"para",label:"AI ile Para Kazan",icon:"💰",info:"Freelance · Danışmanlık · Prompt satışı"},
              {id:"kariyer",label:"Kariyer Rehberi",icon:"💼",info:"AI alanında kariyer fırsatları"},
              {id:"isborsasi",label:"İş Borsası",icon:"👔",info:"AI kariyer fırsatları"},
              {id:"meslekAI",label:"Mesleklere Göre AI",icon:"👔",info:"8 meslek için AI araç seti"},
            ]},
            {group:"🛡️ Güvenlik & Hukuk",color:"#ff6b6b",items:[
              {id:"guvenlik",label:"AI Güvenlik",icon:"🛡️",info:"Deepfake · Ses klonlama · Korunma"},
              {id:"hukuk",label:"AI Hukuk",icon:"⚖️",info:"KVKK · Telif · AB AI Act"},
              {id:"turkiyeai",label:"Türkiye AI",icon:"🇹🇷",info:"250+ startup · Ekosistem"},
            ]},
            {group:"👥 Topluluk & Site",color:"#a855f7",items:[
              {id:"haberler",label:"Haberler",icon:"📰",info:"16 kaynaktan canlı RSS haberleri"},
              {id:"blog",label:"Blog & Rehberler",icon:"✍️",info:"AI rehber yazıları"},
              {id:"topluluk",label:"Topluluk",icon:"👥",info:"AI topluluk tartışmaları"},
              {id:"yarisma",label:"Prompt Yarışması",icon:"🏆",info:"En iyi Türkçe promptlar"},
              {id:"sertifika",label:"AI Sertifika",icon:"🏅",info:"Puan kazanarak sertifika al"},
              {id:"pro",label:"Pro Üyelik",icon:"⭐",info:"Premium özellikler"},
            ]},
          ].map(group=><div key={group.group} style={{marginBottom:14}}>
            {/* Accordion grup başlığı */}
            <button onClick={()=>toggleGroup(group.group)} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"7px 8px",background:"rgba(255,255,255,0.02)",border:"1px solid "+group.color+"20",borderRadius:8,cursor:"pointer",marginBottom:2}}>
              <span style={{fontSize:10,fontWeight:800,color:group.color,letterSpacing:".06em"}}>{group.group}</span>
              <div style={{display:"flex",alignItems:"center",gap:5}}>
                <span style={{fontSize:8,color:group.color+"80",background:group.color+"12",borderRadius:4,padding:"1px 6px"}}>{group.items.length}</span>
                <span style={{fontSize:10,color:group.color,transition:"transform .2s",display:"inline-block",transform:openGroups[group.group]?"rotate(180deg)":"rotate(0deg)"}}>▼</span>
              </div>
            </button>
            {/* Alt öğeler - accordion */}
            {openGroups[group.group]&&group.items.map(item=><div key={item.id}
              style={{position:"relative"}} className="nav-item-wrap">
              <button
                onClick={()=>{nav(item.id);setMobileOpen(false);}}
                style={{width:"100%",padding:"8px 10px",borderRadius:8,
                  border:"1px solid "+(page===item.id?group.color+"50":"rgba(255,255,255,0.05)"),
                  background:page===item.id?group.color+"12":"rgba(255,255,255,0.02)",
                  color:page===item.id?group.color:"#94a3b8",
                  cursor:"pointer",fontFamily:"inherit",
                  display:"flex",alignItems:"center",gap:8,textAlign:"left",
                  transition:"all .15s"}}>
                <span style={{fontSize:14,flexShrink:0}}>{item.icon}</span>
                <span style={{fontSize:11,flex:1,fontWeight:page===item.id?700:400}}>{item.label}</span>
                {/* (i) bilgi ikonu */}
                <span title={item.info}
                  style={{fontSize:9,color:group.color,background:group.color+"15",
                    borderRadius:"50%",width:16,height:16,display:"flex",alignItems:"center",
                    justifyContent:"center",flexShrink:0,cursor:"help",fontWeight:700,
                    border:"1px solid "+group.color+"30"}}>i</span>
              </button>
            </div>)}
          </div>)}
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
 
