import { useState, useEffect, useRef } from "react";

// ── CHATBOT (API aktif değil — ileride eklenecek) ─────────
function Chatbot(){
  const[open,setOpen]=useState(false);
  return <>
    <button onClick={()=>setOpen(o=>!o)} style={{position:"fixed",bottom:24,right:24,zIndex:500,width:56,height:56,borderRadius:"50%",border:"none",background:"linear-gradient(135deg,#00dcff,#a855f7)",color:"#fff",fontSize:24,cursor:"pointer",boxShadow:"0 4px 24px rgba(0,220,255,0.4)",display:"flex",alignItems:"center",justifyContent:"center"}}>
      {open?"✕":"🤖"}
    </button>
    {open&&<div style={{position:"fixed",bottom:92,right:24,zIndex:500,width:300,background:"#0d1220",border:"1px solid rgba(0,220,255,0.25)",borderRadius:18,boxShadow:"0 12px 48px rgba(0,0,0,0.7)",overflow:"hidden"}}>
      <div style={{background:"linear-gradient(135deg,rgba(0,220,255,0.1),rgba(168,85,247,0.07))",padding:"13px 16px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
        <div style={{fontSize:13,fontWeight:700,color:"#e2e8f0"}}>🤖 IMDATAI Asistanı</div>
        <div style={{fontSize:10,color:"#64748b"}}>Claude ile güçlendirildi</div>
      </div>
      <div style={{padding:"24px 16px",textAlign:"center"}}>
        <div style={{fontSize:32,marginBottom:10}}>🔜</div>
        <div style={{fontSize:13,fontWeight:700,color:"#e2e8f0",marginBottom:6}}>Çok Yakında!</div>
        <div style={{fontSize:11,color:"#64748b",lineHeight:1.7}}>AI asistan özelliği hazırlanıyor. Haberdar olmak için bültene abone ol.</div>
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
// SAYFALAR
// ══════════════════════════════════════════════════════════

// 1. ANA SAYFA
function HomePage({setPage,user,setUser}){
  const[typed,setTyped]=useState("");
  const words=["İçerik Üretimi","Kod Yazımı","Görsel Tasarım","Para Kazanma","CV Analizi","Araştırma"];
  const wi=useRef(0),ci=useRef(0),del=useRef(false);
  useEffect(()=>{const t=setInterval(()=>{const w=words[wi.current];if(!del.current){if(ci.current<=w.length){setTyped(w.slice(0,ci.current));ci.current++;}else setTimeout(()=>{del.current=true;},1400);}else{if(ci.current>0){ci.current--;setTyped(w.slice(0,ci.current));}else{del.current=false;wi.current=(wi.current+1)%words.length;}}},80);return()=>clearInterval(t);},[]);
  const[vidIdx,setVidIdx]=useState(null);
  const videos=[{id:"jGKE4w_VTWY",title:"ChatGPT vs Claude vs Gemini 2026",ch:"AI Explained"},{id:"8UXPZ1ZeEZA",title:"En İyi Ücretsiz AI Araçları",ch:"Matt Wolfe"},{id:"hfIUstzHs9A",title:"Prompt Engineering Rehberi",ch:"Fireship"}];
  const tiktoks=[{emoji:"🤖",title:"Claude ile 30sn'de blog yaz",views:""},{emoji:"💰",title:"AI ile ayda 10K TL kazan",views:""},{emoji:"⚡",title:"ChatGPT hileleri",views:""}];
  const[email,setEmail]=useState("");const[sent,setSent]=useState(false);
  const[gameIdx,setGameIdx]=useState(0);const[gameAns,setGameAns]=useState(null);const[gScore,setGScore]=useState({d:0,w:0});
  const GAME=[
    {text:"Güneş batarken denizin mavisi gökyüzünün turuncusuyla dans ederken sahilde yürüyen iki sevgili ellerini tutmuş uzaklara bakıyordu.",isAI:true,reveal:"ChatGPT (GPT-5.5) yazdı",hint:"Mükemmel akış, klişe metafor ve duygusal ton AI izlenimi veriyor"},
    {text:"Bugün patronumla kötü bir gün geçirdim toplantıda fikirlerim alınmadı eve gelince çantamı köşeye fırlattım.",isAI:false,reveal:"Gerçek Twitter kullanıcısı yazdı",hint:"Düzensiz anlatım ve duygusal patlama insan yazısı"},
    {text:"Kuantum mekaniği parçacıkların aynı anda birden fazla durumda bulunabildiği fikrini içerir. Schrödinger kedisi bu ilkeyi simgeler.",isAI:true,reveal:"Claude Opus 4.7 yazdı",hint:"Ansiklopedik netlik ve doğru referans AI izlenimi"},
    {text:"Arkadaşım 3 yıldır borçlu. 500 lira için bozuşmak olmaz ama bu ilk kez değil. Ne yapayım bilmiyorum.",isAI:false,reveal:"Gerçek Ekşi Sözlük entry'si",hint:"Spesifik rakam ve sosyal dilema tipik insan yazısı"},
    {text:"Yapay zeka, insan zekasını taklit eden ve öğrenme, problem çözme gibi bilişsel işlevleri gerçekleştirebilen bilgisayar sistemleridir.",isAI:true,reveal:"Gemini 2.5 Pro yazdı",hint:"Akademik tanım formatı ve eksiksiz cümle yapısı"},
    {text:"Bu sabah kahvemi içerken düşündüm de neden hep böyle olur ki? Bir şeyler yoluna girince başka bir şey çıkar.",isAI:false,reveal:"Gerçek bir WhatsApp mesajı",hint:"Belirsiz şikayet ve kesik düşünce akışı insan yazısı"},
  ];
  const g=GAME[gameIdx%GAME.length];
  function guess(isAI){const c=isAI===g.isAI;if(c)setGScore(s=>({...s,d:s.d+1}));else setGScore(s=>({...s,w:s.w+1}));setGameAns({correct:c});}

  return <div>
    {/* HERO */}
    <section style={{position:"relative",minHeight:"84vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"50px 20px",overflow:"hidden",textAlign:"center"}}>
      <PBg/>
      <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 65% 55% at 50% 50%,rgba(0,220,255,0.05),transparent 70%)"}}/>
      <div style={{position:"relative",zIndex:1,maxWidth:680}}>
        {/* Özellikler */}
        <div style={{display:"flex",gap:10,justifyContent:"center",marginBottom:16,flexWrap:"wrap"}}>
          {[["🇹🇷","AI Trafiğinde #1","#fb923c"],["📰","Günlük Güncelleme","#34d399"],["🆓","Tamamen Ücretsiz","#00dcff"]].map(([e,t,c])=>(
            <div key={t} style={{fontSize:10,color:c,background:`${c}15`,padding:"4px 10px",borderRadius:12,border:`1px solid ${c}30`}}>{e} {t}</div>
          ))}
        </div>
        <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(0,220,255,0.08)",border:"1px solid rgba(0,220,255,0.22)",borderRadius:24,padding:"6px 18px",marginBottom:20,fontSize:10,color:"#00dcff",letterSpacing:".15em"}}>
          <span style={{width:6,height:6,background:"#00dcff",borderRadius:"50%",animation:"blink 1.5s infinite"}}/> TÜRKİYE AI TRAFİĞİNDE DÜNYA #1 — %94.49
        </div>
        <h1 style={{fontSize:"clamp(26px,6.5vw,56px)",fontWeight:900,lineHeight:1.05,margin:"0 0 14px",letterSpacing:"-.02em"}}>
          <span style={{background:"linear-gradient(135deg,#fff,#cbd5e1)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>AI ile </span>
          <span style={{background:"linear-gradient(135deg,#00dcff,#a855f7,#f472b6)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{typed}<span style={{animation:"blink 1s infinite",opacity:.8}}>|</span></span>
          <br/><span style={{background:"linear-gradient(135deg,#94a3b8,#475569)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",fontSize:"60%"}}>saniyeler içinde, tamamen Türkçe.</span>
        </h1>
        <p style={{fontSize:14,color:"#64748b",margin:"0 auto 28px",maxWidth:500,lineHeight:1.8}}>AI haberleri · Araç karşılaştırmaları · Prompt rehberleri · Blog · Galeri · Topluluk · Haftalık Challenge</p>
        <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
          {[["📰 Haberler","haberler","#00dcff"],["🎮 Oyun","oyun","#f472b6"],["💰 Para Kazan","para","#34d399"],["📖 Blog","blog","#a855f7"]].map(([l,p,c])=>(
            <button key={p} onClick={()=>setPage(p)} style={{padding:"11px 20px",borderRadius:9,border:`1px solid ${c}40`,background:`${c}0d`,color:c,fontSize:13,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>{l}</button>
          ))}
        </div>
      </div>
    </section>

    {/* GERÇEK SITE STATS */}
    <div style={{background:"rgba(255,255,255,0.02)",borderTop:"1px solid rgba(255,255,255,0.05)",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",maxWidth:800,margin:"0 auto"}}>
        {[["20+","Sayfa & Bölüm","#00dcff"],["60+","AI Terimi","#a855f7"],["30+","Prompt Örneği","#34d399"],["40+","AI Aracı","#fb923c"]].map(([n,l,c],i)=>(
          <div key={l} style={{padding:"18px 10px",textAlign:"center",borderRight:i<3?"1px solid rgba(255,255,255,0.04)":"none"}}>
            <div style={{fontSize:"clamp(16px,2.5vw,24px)",fontWeight:900,color:c}}>{n}</div>
            <div style={{fontSize:9,color:"#475569",marginTop:2}}>{l}</div>
          </div>
        ))}
      </div>
    </div>

    {/* TRENDING */}
    <section style={{padding:"32px 20px"}}>
      <div style={{maxWidth:900,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div><div style={{fontSize:9,letterSpacing:".2em",color:"#475569",marginBottom:3}}>BU HAFTA</div><div style={{fontSize:19,fontWeight:800,color:"#e2e8f0"}}>🔥 Trending AI Konuları</div></div>
          <Tag text="Canlı" color="#00dcff"/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",gap:10}}>
          {TRENDING.map(t=>(
            <Card key={t.rank} color="#00dcff" style={{padding:"13px 15px",display:"flex",gap:12,alignItems:"center"}}>
              <div style={{width:34,height:34,borderRadius:9,background:"rgba(0,220,255,0.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0}}>{t.icon}</div>
              <div style={{flex:1}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
                  <div style={{fontSize:12,fontWeight:700,color:"#e2e8f0"}}>{t.topic}</div>
                  <Tag text={t.tag} color={t.heat>94?"#f472b6":t.heat>88?"#fb923c":"#60a5fa"} size={8}/>
                </div>
                <div style={{fontSize:10,color:"#475569",marginBottom:4}}>{t.desc}</div>
                <Bar val={t.heat} color={`hsl(${t.heat*1.8},70%,60%)`}/>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>

    {/* CLAUDE ÖNE ÇIKAR — Ana Sayfa */}
    <section style={{padding:"0 20px 32px"}}>
      <div style={{maxWidth:900,margin:"0 auto"}}>
        <div style={{background:"linear-gradient(135deg,rgba(168,85,247,0.1),rgba(0,220,255,0.05))",border:"1px solid rgba(168,85,247,0.3)",borderRadius:18,padding:"24px",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:-20,right:-20,fontSize:120,opacity:.05}}>🧠</div>
          <div style={{position:"relative",zIndex:1}}>
            <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:16,flexWrap:"wrap"}}>
              <span style={{fontSize:36}}>🧠</span>
              <div>
                <div style={{fontSize:9,letterSpacing:".2em",color:"#a855f7",marginBottom:3}}>ÖZEL BÖLÜM</div>
                <div style={{fontSize:20,fontWeight:900,color:"#e2e8f0"}}>Claude — Neden Herkesin Konuştuğu AI?</div>
              </div>
            </div>
            <div style={{fontSize:13,color:"#64748b",lineHeight:1.8,marginBottom:20}}>
              Anthropic'in geliştirdiği Claude, 2026'da kodlama testlerinde dünya birincisi oldu. <strong style={{color:"#a855f7"}}>SWE-bench %87.6</strong> — bu rakam Claude'un gerçek yazılım problemlerini insanlardan daha iyi çözebileceği anlamına geliyor. <strong style={{color:"#a855f7"}}>1 milyon token</strong> ile kitap boyutu belgeleri analiz edebilir. Ve <strong style={{color:"#a855f7"}}>Constitutional AI</strong> sayesinde en az hallüsinasyon yapan model.
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10,marginBottom:20}}>
              {[["🏆","Kodlamada #1","SWE-bench %87.6 dünya rekoru","claude"],["📚","1M Token","750.000 kelime, kitap boyutu analiz","claude"],["🔒","En Güvenli","Constitutional AI, en az hallüsinasyon","claude"],["🤖","Agentic AI","Task Budget ile otonom görev kontrolü","claude"]].map(([e,t,d,p])=>(
                <div key={t} onClick={()=>setPage(p)} style={{background:"rgba(168,85,247,0.08)",border:"1px solid rgba(168,85,247,0.2)",borderRadius:10,padding:"12px",cursor:"pointer",transition:"all .15s"}} onMouseEnter={ev=>ev.currentTarget.style.background="rgba(168,85,247,0.15)"} onMouseLeave={ev=>ev.currentTarget.style.background="rgba(168,85,247,0.08)"}>
                  <div style={{fontSize:20,marginBottom:6}}>{e}</div>
                  <div style={{fontSize:12,fontWeight:700,color:"#a855f7",marginBottom:3}}>{t}</div>
                  <div style={{fontSize:10,color:"#64748b"}}>{d}</div>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              <button onClick={()=>setPage("claude")} style={{padding:"11px 24px",borderRadius:10,border:"none",background:"linear-gradient(135deg,#a855f7,#7c3aed)",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>🧠 Claude Tam Rehber →</button>
              <button onClick={()=>setPage("chatgpt")} style={{padding:"11px 20px",borderRadius:10,border:"1px solid rgba(0,220,255,0.3)",background:"rgba(0,220,255,0.06)",color:"#00dcff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>🤖 ChatGPT Rehberi</button>
              <button onClick={()=>setPage("gemini")} style={{padding:"11px 20px",borderRadius:10,border:"1px solid rgba(52,211,153,0.3)",background:"rgba(52,211,153,0.06)",color:"#34d399",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>🌟 Gemini Rehberi</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* HABERLER */}
    <section style={{padding:"0 20px 32px",background:"rgba(0,0,0,0.1)"}}>
      <div style={{maxWidth:900,margin:"0 auto",paddingTop:32}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div><div style={{fontSize:9,letterSpacing:".2em",color:"#475569",marginBottom:3}}>SON DAKİKA</div><div style={{fontSize:19,fontWeight:800,color:"#e2e8f0"}}>📰 AI Haberleri</div></div>
          <button onClick={()=>setPage("haberler")} style={{fontSize:11,color:"#00dcff",background:"none",border:"1px solid rgba(0,220,255,0.2)",borderRadius:8,padding:"5px 12px",cursor:"pointer",fontFamily:"inherit"}}>Tümü →</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:11}}>
          {NEWS.map((n,i)=>(
            <Card key={i} color={n.color} style={{padding:"16px"}} onClick={()=>setPage("haberler")}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:9}}>
                <Tag text={n.tag} color={n.color}/>
                <div style={{display:"flex",gap:6,alignItems:"center"}}>{n.hot&&<Tag text="🔥" color="#ff6b6b" size={8}/>}<span style={{fontSize:9,color:"#334155"}}>{n.time}</span></div>
              </div>
              <div style={{fontSize:20,marginBottom:7}}>{n.emoji}</div>
              <div style={{fontSize:13,fontWeight:700,color:"#e2e8f0",marginBottom:5,lineHeight:1.4}}>{n.title}</div>
              <div style={{fontSize:11,color:"#475569",lineHeight:1.6,marginBottom:8}}>{n.desc}</div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:"#334155"}}><span>📰 {n.src}</span><span>📖 {n.read}</span></div>
            </Card>
          ))}
        </div>
      </div>
    </section>

    {/* BEFORE/AFTER */}
    <section style={{padding:"0 20px 32px"}}>
      <div style={{maxWidth:900,margin:"0 auto"}}>
        <div style={{marginBottom:14}}><div style={{fontSize:9,letterSpacing:".2em",color:"#475569",marginBottom:3}}>ETKİ ANALİZİ</div><div style={{fontSize:19,fontWeight:800,color:"#e2e8f0"}}>⚡ AI Olmadan vs AI ile</div><div style={{fontSize:12,color:"#64748b",marginTop:2}}>Gerçek zaman tasarrufu karşılaştırmaları</div></div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12}}>
          {BEFORE_AFTER.map(ba=>(
            <div key={ba.title} style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:14,overflow:"hidden"}}>
              <div style={{background:"rgba(0,0,0,0.3)",padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{display:"flex",gap:8,alignItems:"center"}}><span style={{fontSize:18}}>{ba.icon}</span><span style={{fontSize:13,fontWeight:700,color:"#e2e8f0"}}>{ba.title}</span></div>
                <div style={{fontSize:11,fontWeight:800,color:"#34d399"}}>{ba.time}</div>
              </div>
              <div style={{padding:"14px 16px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <div style={{background:"rgba(244,114,182,0.06)",border:"1px solid rgba(244,114,182,0.15)",borderRadius:9,padding:"10px"}}>
                  <div style={{fontSize:9,color:"#f472b6",fontWeight:700,marginBottom:5}}>❌ Öncesi</div>
                  <div style={{fontSize:11,color:"#64748b",lineHeight:1.5}}>{ba.before}</div>
                </div>
                <div style={{background:"rgba(52,211,153,0.06)",border:"1px solid rgba(52,211,153,0.15)",borderRadius:9,padding:"10px"}}>
                  <div style={{fontSize:9,color:"#34d399",fontWeight:700,marginBottom:5}}>✅ AI ile</div>
                  <div style={{fontSize:11,color:"#64748b",lineHeight:1.5}}>{ba.after}</div>
                </div>
              </div>
              <div style={{padding:"0 16px 12px",display:"flex",gap:5,flexWrap:"wrap"}}>
                {ba.tools.map(t=><Tag key={t} text={t} color="#a855f7" size={9}/>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* HAFTALık CHALLENGE */}
    <section style={{padding:"0 20px 32px",background:"rgba(168,85,247,0.03)"}}>
      <div style={{maxWidth:900,margin:"0 auto",paddingTop:32}}>
        <div style={{background:`${WEEKLY_CHALLENGE.color}08`,border:`1px solid ${WEEKLY_CHALLENGE.color}25`,borderRadius:16,padding:"22px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10,marginBottom:16}}>
            <div>
              <div style={{fontSize:9,letterSpacing:".2em",color:WEEKLY_CHALLENGE.color,marginBottom:4}}>🏆 HAFTALIK CHALLENGE — {WEEKLY_CHALLENGE.week}</div>
              <div style={{fontSize:17,fontWeight:800,color:"#e2e8f0"}}>{WEEKLY_CHALLENGE.title}</div>
              <div style={{fontSize:11,color:"#64748b",marginTop:4}}>Son: {WEEKLY_CHALLENGE.deadline}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:11,color:"#fb923c",fontWeight:700,marginBottom:4}}>🎁 {WEEKLY_CHALLENGE.prize}</div>
              <Tag text="Aktif" color="#34d399"/>
            </div>
          </div>
          <div style={{fontSize:12,color:"#94a3b8",lineHeight:1.7,marginBottom:14}}>{WEEKLY_CHALLENGE.desc}</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:8}}>
            {WEEKLY_CHALLENGE.steps.map((s,i)=>(
              <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start"}}>
                <div style={{width:18,height:18,borderRadius:"50%",background:`${WEEKLY_CHALLENGE.color}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:WEEKLY_CHALLENGE.color,flexShrink:0,fontWeight:700}}>{i+1}</div>
                <span style={{fontSize:11,color:"#64748b",lineHeight:1.5}}>{s}</span>
              </div>
            ))}
          </div>
          <button style={{marginTop:14,padding:"10px 22px",borderRadius:9,border:"none",background:`linear-gradient(135deg,${WEEKLY_CHALLENGE.color},#7c3aed)`,color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>Katıl →</button>
        </div>
      </div>
    </section>

    {/* AI GÖRSEL GALERİ */}
    <section style={{padding:"0 20px 32px"}}>
      <div style={{maxWidth:900,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div><div style={{fontSize:9,letterSpacing:".2em",color:"#475569",marginBottom:3}}>AI GÖRSEL</div><div style={{fontSize:19,fontWeight:800,color:"#e2e8f0"}}>🎨 AI Görsel Galerisi</div><div style={{fontSize:12,color:"#64748b",marginTop:2}}>Gerçek AI çıktıları — prompt'larıyla birlikte</div></div>
          <button onClick={()=>setPage("galeri")} style={{fontSize:11,color:"#f472b6",background:"none",border:"1px solid rgba(244,114,182,0.2)",borderRadius:8,padding:"5px 12px",cursor:"pointer",fontFamily:"inherit"}}>Galeride Gör →</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10}}>
          {GALLERY.slice(0,6).map((g,i)=>(
            <Card key={i} color={g.color} style={{overflow:"hidden"}} onClick={()=>setPage("galeri")}>
              <div style={{background:`linear-gradient(135deg,${g.color}20,rgba(0,0,0,0.5))`,paddingTop:"80%",position:"relative"}}>
                <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:48}}>{g.emoji}</div>
                <div style={{position:"absolute",top:8,left:8}}><Tag text={g.cat} color={g.color} size={8}/></div>
                <div style={{position:"absolute",bottom:8,right:8}}><Tag text={g.tool} color="#475569" size={8}/></div>
              </div>
              <div style={{padding:"10px 12px"}}>
                <div style={{fontSize:12,fontWeight:700,color:"#e2e8f0",marginBottom:3}}>{g.title}</div>
                <div style={{fontSize:10,color:"#475569",lineHeight:1.4}}>{g.desc}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>

    {/* BLOG ÖNİZLEME */}
    <section style={{padding:"0 20px 32px",background:"rgba(0,0,0,0.1)"}}>
      <div style={{maxWidth:900,margin:"0 auto",paddingTop:32}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div><div style={{fontSize:9,letterSpacing:".2em",color:"#475569",marginBottom:3}}>BLOG</div><div style={{fontSize:19,fontWeight:800,color:"#e2e8f0"}}>✍️ Kapsamlı AI Rehberleri</div></div>
          <button onClick={()=>setPage("blog")} style={{fontSize:11,color:"#a855f7",background:"none",border:"1px solid rgba(168,85,247,0.2)",borderRadius:8,padding:"5px 12px",cursor:"pointer",fontFamily:"inherit"}}>Tüm Yazılar →</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))",gap:12}}>
          {BLOG_POSTS.slice(0,4).map(p=>(
            <Card key={p.id} color={p.color} style={{padding:"16px"}} onClick={()=>setPage(`blog-${p.id}`)}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                <Tag text={p.tag} color={p.color}/>
                <span style={{fontSize:9,color:"#334155"}}>{p.readTime}</span>
              </div>
              <div style={{fontSize:13,fontWeight:700,color:"#e2e8f0",marginBottom:6,lineHeight:1.4}}>{p.title}</div>
              <div style={{fontSize:11,color:"#475569",lineHeight:1.6,marginBottom:10}}>{p.summary}</div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"#334155"}}>
                <span>{p.date}</span>
                
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>

    {/* TOPLULUK PROMPTS ÖNİZLEME */}
    <section style={{padding:"0 20px 32px"}}>
      <div style={{maxWidth:900,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div><div style={{fontSize:9,letterSpacing:".2em",color:"#475569",marginBottom:3}}>TOPLULUK</div><div style={{fontSize:19,fontWeight:800,color:"#e2e8f0"}}>💬 Topluluktan Popüler Promptlar</div></div>
          <button onClick={()=>setPage("topluluk")} style={{fontSize:11,color:"#34d399",background:"none",border:"1px solid rgba(52,211,153,0.2)",borderRadius:8,padding:"5px 12px",cursor:"pointer",fontFamily:"inherit"}}>Tümü →</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:10}}>
          {COMMUNITY_PROMPTS.slice(0,4).map((p,i)=>(
            <Card key={i} color="#34d399" style={{padding:"14px"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                <div style={{display:"flex",gap:7,alignItems:"center"}}><span style={{fontSize:16}}>{p.avatar}</span><div><div style={{fontSize:11,fontWeight:700,color:"#e2e8f0"}}>{p.title}</div><div style={{fontSize:9,color:"#475569"}}>{p.user}</div></div></div>
                <Tag text={p.cat} color="#34d399" size={8}/>
              </div>
              <div style={{background:"rgba(0,0,0,0.3)",borderRadius:8,padding:"9px 10px",fontSize:11,color:"#94a3b8",lineHeight:1.5,marginBottom:9,fontStyle:"italic"}}>"{p.prompt.slice(0,100)}..."</div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"#475569"}}>
                <span>{p.date}</span><span style={{color:"#34d399"}}>Kopyala →</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>

    {/* YOUTUBE */}
    <section style={{padding:"0 20px 32px",background:"rgba(0,0,0,0.1)"}}>
      <div style={{maxWidth:900,margin:"0 auto",paddingTop:32}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:14,alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}><YT/><div style={{fontSize:19,fontWeight:800,color:"#e2e8f0"}}>YouTube Rehberleri</div></div>
          <a href="https://youtube.com/@imdatai" target="_blank" rel="noopener noreferrer" style={{fontSize:11,color:"#FF0000",textDecoration:"none",border:"1px solid rgba(255,0,0,0.2)",borderRadius:8,padding:"5px 12px",display:"flex",alignItems:"center",gap:5}}><YT/> Kanal</a>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",gap:12}}>
          {videos.map((v,i)=>(
            <div key={i} style={{borderRadius:13,overflow:"hidden",border:"1px solid rgba(255,255,255,0.08)"}}>
              {vidIdx===i?<div style={{position:"relative",paddingTop:"56.25%"}}><iframe style={{position:"absolute",inset:0,width:"100%",height:"100%"}} src={`https://www.youtube.com/embed/${v.id}?autoplay=1`} allow="autoplay;encrypted-media" allowFullScreen frameBorder="0"/></div>
              :<div onClick={()=>setVidIdx(i)} style={{position:"relative",paddingTop:"56.25%",cursor:"pointer",background:"linear-gradient(135deg,rgba(0,0,0,0.7),rgba(168,85,247,0.15))"}}>
                <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10}}>
                  <div style={{width:52,height:52,borderRadius:"50%",background:"rgba(255,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>▶</div>
                  <div style={{fontSize:11,color:"#94a3b8",textAlign:"center",padding:"0 14px",lineHeight:1.4}}>{v.title}</div>
                </div>
              </div>}
              <div style={{padding:"10px 13px",background:"rgba(0,0,0,0.4)"}}><div style={{fontSize:12,fontWeight:600,color:"#e2e8f0",marginBottom:2}}>{v.title}</div><div style={{fontSize:10,color:"#475569"}}>{v.ch}</div></div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* TIKTOK */}
    <section style={{padding:"0 20px 32px"}}>
      <div style={{maxWidth:900,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:14,alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}><TT/><div style={{fontSize:19,fontWeight:800,color:"#e2e8f0"}}>TikTok AI İpuçları</div></div>
          <a href="https://tiktok.com/@imdatai" target="_blank" rel="noopener noreferrer" style={{fontSize:11,color:"#e2e8f0",textDecoration:"none",border:"1px solid rgba(255,255,255,0.15)",borderRadius:8,padding:"5px 12px",display:"flex",alignItems:"center",gap:5}}><TT/> Takip</a>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
          {tiktoks.map((t,i)=>(
            <a key={i} href="https://tiktok.com/@imdatai" target="_blank" rel="noopener noreferrer" style={{textDecoration:"none"}}>
              <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:13,overflow:"hidden",transition:"all .15s"}} onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.25)";e.currentTarget.style.transform="translateY(-2px)";}} onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.08)";e.currentTarget.style.transform="translateY(0)";}}>
                <div style={{background:"linear-gradient(160deg,#000,rgba(168,85,247,0.3))",paddingTop:"140%",position:"relative"}}>
                  <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10}}>
                    <div style={{fontSize:36}}>{t.emoji}</div>
                    <div style={{width:40,height:40,borderRadius:"50%",background:"rgba(255,255,255,0.15)",border:"2px solid rgba(255,255,255,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>▶</div>
                    <div style={{fontSize:10,color:"rgba(255,255,255,0.7)",textAlign:"center",padding:"0 12px",lineHeight:1.4}}>{t.title}</div>
                  </div>
                  <div style={{position:"absolute",top:8,right:8}}><TT/></div>
                </div>
                <div style={{padding:"10px 12px"}}><div style={{fontSize:11,fontWeight:600,color:"#e2e8f0",marginBottom:2,lineHeight:1.4}}>{t.title}</div><div style={{fontSize:9,color:"#64748b"}}>@imdatai · TikTok</div></div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>

    {/* NEWSLETTER */}
    <section style={{padding:"0 20px 48px"}}>
      <div style={{maxWidth:560,margin:"0 auto",background:"linear-gradient(135deg,rgba(0,220,255,0.07),rgba(168,85,247,0.07))",border:"1px solid rgba(0,220,255,0.2)",borderRadius:18,padding:"30px 24px",textAlign:"center"}}>
        <div style={{fontSize:24}}>📬</div>
        <div style={{fontSize:16,fontWeight:800,color:"#e2e8f0",margin:"8px 0 5px"}}>Haftalık AI Bülteni</div>
        <div style={{fontSize:12,color:"#64748b",marginBottom:18,lineHeight:1.7}}>Her Pazartesi: Haberler, yeni araçlar, promptlar, para kazanma ipuçları. Ücretsiz.</div>
        {sent?<div style={{fontSize:13,color:"#34d399",fontWeight:600}}>✅ Kaydedildi! İlk bülten Pazartesi.</div>:(
          <><div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap"}}>
            <input style={{flex:1,minWidth:180,background:"rgba(0,0,0,0.4)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,color:"#e2e8f0",padding:"9px 13px",fontSize:12,fontFamily:"inherit",outline:"none"}} placeholder="E-posta adresin..." value={email} onChange={e=>setEmail(e.target.value)}/>
            <button onClick={()=>{if(email.includes("@"))setSent(true);}} style={{padding:"9px 18px",borderRadius:8,border:"none",background:"linear-gradient(135deg,#00dcff,#a855f7)",color:"#fff",fontSize:12,cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>Abone Ol</button>
          </div>
          <div style={{marginTop:8,fontSize:10,color:"#334155"}}>✓ Spam yok ✓ İstediğin zaman çık</div></>
        )}
      </div>
    </section>
  </div>;
}

// 2. BLOG SAYFASI
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

// ── NAVIGATION ─────────────────────────────────────────────
const NAV = [
  {id:"home",label:"Ana Sayfa"},
  {id:"haberler",label:"Haberler"},
  {id:"blog",label:"Blog"},
  {id:"claude",label:"🧠 Claude"},
  {id:"chatgpt",label:"🤖 ChatGPT"},
  {id:"gemini",label:"🌟 Gemini"},
  {id:"ogrenme",label:"🎓 Öğren"},
  {id:"prompt",label:"💡 Prompt"},
  {id:"karsilastirma",label:"🆚 Karşılaştır"},
  {id:"sozluk",label:"📖 Sözlük"},
  {id:"dizin",label:"Araç Dizini"},
  {id:"galeri",label:"🎨 Galeri"},
  {id:"quiz",label:"🧠 Quiz"},
  {id:"oyun",label:"🎮 Oyun"},
  {id:"topluluk",label:"💬 Topluluk"},
  {id:"kariyer",label:"🚀 Kariyer"},
  {id:"mitler",label:"🔍 Mitler"},
  {id:"para",label:"💰 Para"},
  {id:"pro",label:"⭐ Pro"},
];

// ── APP ────────────────────────────────────────────────────
export default function App(){
  const[page,setPage]=useState("home");
  const[user,setUser]=useState(defaultUser);
  const[cookie,setCookie]=useState(true);
  function nav(p){setPage(p);window.scrollTo(0,0);}

  if(page.startsWith("blog-")){const id=page.replace("blog-","");return <Wrapper nav={nav} page={page} cookie={cookie} setCookie={setCookie}><BlogPostPage postId={id} setPage={nav}/></Wrapper>;}
  if(page.startsWith("tool-")){const key=page.replace("tool-","");return <Wrapper nav={nav} page={page} cookie={cookie} setCookie={setCookie}><ToolDetailPage toolKey={key} setPage={nav}/></Wrapper>;}
  if(page==="claude"){return <Wrapper nav={nav} page={page} cookie={cookie} setCookie={setCookie}><ClaudePage setPage={nav}/></Wrapper>;}
  if(page==="chatgpt"){return <Wrapper nav={nav} page={page} cookie={cookie} setCookie={setCookie}><ChatGPTPage setPage={nav}/></Wrapper>;}
  if(page==="gemini"){return <Wrapper nav={nav} page={page} cookie={cookie} setCookie={setCookie}><GeminiPage setPage={nav}/></Wrapper>;}

  return <Wrapper nav={nav} page={page} user={user} setUser={setUser} cookie={cookie} setCookie={setCookie}>
    {page==="home"          &&<HomePage setPage={nav} user={user} setUser={setUser}/>}
    {page==="haberler"      &&<HaberlerPage setPage={nav}/>}
    {page==="blog"          &&<BlogPage setPage={nav}/>}
    {page==="ogrenme"       &&<OgrenmePage setPage={nav}/>}
    {page==="prompt"        &&<PromptPage/>}
    {page==="karsilastirma" &&<KarsilastirmaPage/>}
    {page==="sozluk"        &&<SozlukPage/>}
    {page==="dizin"         &&<DizinPage setPage={nav}/>}
    {page==="galeri"        &&<GaleriPage/>}
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
    {page==="oyun"          &&<OyunPage/>}
    {page==="topluluk"      &&<ToplulukPage/>}
    {page==="kariyer"       &&<KariyerPage/>}
    {page==="mitler"        &&<MitlerPage/>}
    {page==="zaman"         &&<ZamanCizgisiPage/>}
    {page==="para"          &&<ParaPage/>}
    {page==="hakkimizda"    &&<HakkimizdaPage/>}
    {page==="iletisim"      &&<IletisimPage/>}
    {page==="gizlilik"      &&<GizlilikPage/>}
    {page==="pro"           &&<ProPage/>}
  </Wrapper>;
}

function Wrapper({children,nav,page,user,setUser,cookie,setCookie}){
  const[email,setEmail]=useState("");const[sent,setSent]=useState(false);
  return <div style={{minHeight:"100vh",background:"#060a14",color:"#e2e8f0",fontFamily:"system-ui,sans-serif"}}>
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:4px}button,a{transition:all .15s}`}</style>
    {cookie&&<div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:999,background:"rgba(6,10,20,0.98)",borderTop:"1px solid rgba(0,220,255,0.2)",padding:"12px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10,backdropFilter:"blur(10px)"}}>
      <div style={{fontSize:11,color:"#94a3b8",maxWidth:580}}>🍪 Bu site zorunlu ve analitik çerezler kullanır. <span onClick={()=>nav("gizlilik")} style={{color:"#00dcff",cursor:"pointer",textDecoration:"underline"}}>Gizlilik Politikası</span>'nı okuyun.</div>
      <div style={{display:"flex",gap:8}}><button onClick={()=>setCookie(false)} style={{padding:"7px 18px",borderRadius:8,border:"none",background:"linear-gradient(135deg,#00dcff,#a855f7)",color:"#fff",fontSize:12,cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>Kabul Et</button><button onClick={()=>setCookie(false)} style={{padding:"7px 14px",borderRadius:8,border:"1px solid rgba(255,255,255,0.1)",background:"transparent",color:"#475569",fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>Reddet</button></div>
    </div>}
    <Ticker/>
    <nav style={{position:"sticky",top:0,zIndex:200,background:"rgba(6,10,20,0.97)",borderBottom:"1px solid rgba(255,255,255,0.06)",backdropFilter:"blur(20px)"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 18px"}}>
        <div onClick={()=>nav("home")} style={{cursor:"pointer",display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
          <div style={{width:26,height:26,background:"linear-gradient(135deg,#00dcff,#a855f7)",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:900,color:"#fff"}}>⬡</div>
          <span style={{fontSize:14,fontWeight:900,background:"linear-gradient(90deg,#00dcff,#a855f7)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",letterSpacing:".1em"}}>IMDATAI</span>
        </div>
        <div style={{display:"flex",gap:1,alignItems:"center",overflowX:"auto"}}>
          {NAV.map(n=><button key={n.id} onClick={()=>nav(n.id)} style={{padding:"6px 10px",border:"none",cursor:"pointer",fontSize:10,fontFamily:"inherit",borderRadius:7,background:page===n.id?"rgba(0,220,255,0.12)":"transparent",color:page===n.id?"#00dcff":"#475569",whiteSpace:"nowrap",flexShrink:0,fontWeight:page===n.id?700:400}}>{n.label}</button>)}
          <div style={{width:1,height:16,background:"rgba(255,255,255,0.1)",margin:"0 6px",flexShrink:0}}/>
          {[{id:"hakkimizda",l:"Hakkımızda"},{id:"iletisim",l:"İletişim"},{id:"gizlilik",l:"Gizlilik"}].map(n=><button key={n.id} onClick={()=>nav(n.id)} style={{padding:"6px 8px",border:"none",cursor:"pointer",fontSize:9,fontFamily:"inherit",borderRadius:7,background:"transparent",color:"#334155",whiteSpace:"nowrap",flexShrink:0}}>{n.l}</button>)}
        </div>
      </div>
    </nav>
    <div style={{animation:"fadeIn .25s ease"}} key={page}>{children}</div>
    <footer style={{borderTop:"1px solid rgba(255,255,255,0.05)",padding:"28px 20px",marginTop:24,background:"rgba(0,0,0,0.2)"}}>
      <div style={{maxWidth:900,margin:"0 auto"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:24,marginBottom:24}}>
          <div>
            <div style={{fontSize:15,fontWeight:900,background:"linear-gradient(90deg,#00dcff,#a855f7)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:6}}>⬡ IMDATAI</div>
            <div style={{fontSize:10,color:"#334155",marginBottom:10,lineHeight:1.6}}>Türkiye'nin #1 AI Hub'ı<br/>Claude (Anthropic) ile güçlendirildi</div>
            <div style={{display:"flex",gap:12,alignItems:"center"}}>
              <a href="https://youtube.com/@imdatai" target="_blank" rel="noopener noreferrer"><YT/></a>
              <a href="https://tiktok.com/@imdatai" target="_blank" rel="noopener noreferrer"><TT/></a>
              <a href="https://instagram.com/imdatai" target="_blank" rel="noopener noreferrer"><IG/></a>
            </div>
          </div>
          {[["Platform",["Ana Sayfa","Haberler","Blog","Araç Dizini","Galeri"],["home","haberler","blog","dizin","galeri"]],["Öğren",["AI Öğren","Prompt Rehberi","Karşılaştır","Sözlük","Kariyer"],["ogrenme","prompt","karsilastirma","sozluk","kariyer"]],["Keşfet",["Quiz","Oyun","Topluluk","Mitler","Tarihçe"],["quiz","oyun","topluluk","mitler","zaman"]],["Şirket",["Hakkımızda","İletişim","Gizlilik & KVKK","Pro Araçlar"],["hakkimizda","iletisim","gizlilik","pro"]]].map(([t,ls,ps])=>(
            <div key={t}><div style={{fontSize:8,letterSpacing:".15em",color:"#475569",marginBottom:7,fontWeight:700}}>{t.toUpperCase()}</div>{ls.map((l,i)=><div key={l} onClick={()=>nav(ps[i])} style={{fontSize:10,color:"#334155",marginBottom:6,cursor:"pointer"}} onMouseEnter={e=>e.target.style.color="#94a3b8"} onMouseLeave={e=>e.target.style.color="#334155"}>{l}</div>)}</div>
          ))}
          <div>
            <div style={{fontSize:8,letterSpacing:".15em",color:"#475569",marginBottom:7,fontWeight:700}}>BÜLTEN</div>
            {sent?<div style={{fontSize:11,color:"#34d399"}}>✅ Kaydedildin!</div>:<div style={{display:"flex",flexDirection:"column",gap:6}}>
              <input style={{background:"rgba(0,0,0,0.4)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:7,color:"#e2e8f0",padding:"8px 10px",fontSize:11,fontFamily:"inherit",outline:"none"}} placeholder="E-posta..." value={email} onChange={e=>setEmail(e.target.value)}/>
              <button onClick={()=>{if(email.includes("@"))setSent(true);}} style={{padding:"7px",borderRadius:7,border:"none",background:"linear-gradient(135deg,#00dcff,#a855f7)",color:"#fff",fontSize:11,cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>Abone Ol</button>
            </div>}
          </div>
        </div>
        <div style={{borderTop:"1px solid rgba(255,255,255,0.04)",paddingTop:14,display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:4}}>
          <div style={{fontSize:9,color:"#1e293b"}}>© 2026 IMDATAI · Türkiye'nin #1 AI Platformu</div>
          <div style={{fontSize:9,color:"#1e293b"}}>Claude (Anthropic) ile güçlendirilmiştir</div>
        </div>
      </div>
    </footer>
    <Chatbot/>
  </div>;
}
