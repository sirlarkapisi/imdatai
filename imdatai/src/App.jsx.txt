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
const TICKER = ["🔥 GPT-5.5 yayınlandı","⚡ Claude Opus 4.7 — %87.6 SWE-bench","🌐 Gemini 3.1 Ultra — 2M token","🇹🇷 Türkiye AI trafiğinde #1 — %94.49","💰 $267M Q1 AI yatırımı","🎨 Midjourney v7 fotorealizm çıtasını aştı","🎵 Suno v5 gerçek enstrüman sesi","✨ Sora Enterprise global açıldı"];

const NEWS = [
  {tag:"🔥",hot:true,color:"#00dcff",title:"GPT-5.5: Süper Uygulama Çağı",desc:"ChatGPT, Codex ve tarayıcıyı tek platformda topladı. Enterprise ve bilimsel görevlerde devrim.",src:"OpenAI",time:"1 gün",read:"3 dk",emoji:"🤖"},
  {tag:"🆕",hot:true,color:"#a855f7",title:"Claude Opus 4.7 ile Kodlama Devrimi",desc:"SWE-bench %87.6, 1M token context, task budget ile ajan kontrolü.",src:"Anthropic",time:"2 gün",read:"4 dk",emoji:"🧠"},
  {tag:"🌐",hot:false,color:"#34d399",title:"Gemini 3.1 Ultra: 2M Token",desc:"Google'ın en büyük güncelleme. Gerçek zamanlı multimodal, sandbox kod.",src:"Google",time:"3 gün",read:"3 dk",emoji:"🌟"},
  {tag:"🇹🇷",hot:true,color:"#fb923c",title:"Türkiye AI Trafiğinde Dünya 1.",desc:"Digital 2026: Türkiye'de AI trafiğinin %94.49'u ChatGPT kaynaklı.",src:"We Are Social",time:"4 gün",read:"2 dk",emoji:"🏆"},
  {tag:"💰",hot:false,color:"#60a5fa",title:"AI'ya Q1'de $267 Milyar",desc:"OpenAI $25B, Anthropic $19B yıllık gelir. Halka arz sinyalleri güçleniyor.",src:"Bloomberg",time:"5 gün",read:"3 dk",emoji:"💹"},
  {tag:"🎨",hot:false,color:"#f472b6",title:"Midjourney v7: Yeni Çıta",desc:"Fotorealizm ve insan anatomisinde çarpıcı iyileşme. Archival quality.",src:"Midjourney",time:"6 gün",read:"3 dk",emoji:"🎨"},
];

const TRENDING = [
  {rank:1,icon:"🤖",topic:"Agentic AI",heat:98,desc:"Otonom çalışan AI ajanları her sektörü değiştiriyor.",tag:"🔥 Sıcak"},
  {rank:2,icon:"💻",topic:"Vibe Coding",heat:95,desc:"Cursor ve Claude Code ile kod yazmak yerine söylüyorsun.",tag:"⚡ Trend"},
  {rank:3,icon:"🎬",topic:"AI Video",heat:92,desc:"Sora, HeyGen ile profesyonel video dakikalar içinde.",tag:"📈 Yükseliyor"},
  {rank:4,icon:"🇹🇷",topic:"Türkçe AI",heat:89,desc:"Türkiye pazarına özel AI çözümleri artıyor.",tag:"🎯 Fırsat"},
  {rank:5,icon:"💰",topic:"AI ile Gelir",heat:86,desc:"AI bilen kişilere talep patladı.",tag:"💡 Popüler"},
  {rank:6,icon:"🔊",topic:"AI Ses & Müzik",heat:83,desc:"ElevenLabs ve Suno v5 profesyonel seviyeye taşıdı.",tag:"🎵 Büyüyor"},
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
];

// AI Görsel Galerisi (açıklamalı örnekler)
const GALLERY = [
  {cat:"📸 Fotorealizm",tool:"Midjourney v7",color:"#f472b6",emoji:"🌅",title:"İstanbul Gün Batımı",prompt:"/imagine Istanbul Bosphorus at golden hour, drone photography, photorealistic, stunning colors --ar 16:9 --v 7",desc:"Midjourney v7 ile gerçek fotoğraftan ayırt etmek neredeyse imkânsız hale geldi."},
  {cat:"🎨 Dijital Sanat",tool:"DALL-E 3",color:"#00dcff",emoji:"🦅",title:"Türk Mitolojisi",prompt:"Turkish mythology eagle spirit, ethereal, watercolor style, ancient symbols, dramatic lighting",desc:"DALL-E 3 kültürel ve mitolojik temalarda güçlü sonuçlar üretiyor."},
  {cat:"🏢 Mimari",tool:"Midjourney v7",color:"#a855f7",emoji:"🏛️",title:"Gelecek İstanbul",prompt:"futuristic Istanbul 2050, sustainable architecture, floating gardens, solar panels, Bosphorus view --ar 21:9 --v 7",desc:"AI ile mimari konsept tasarımı artık dakikalar sürüyor."},
  {cat:"🎭 Karakter",tool:"Midjourney v7",color:"#34d399",emoji:"👩",title:"AI Portre",prompt:"professional headshot of a Turkish businesswoman, studio lighting, confident expression, modern office --ar 2:3 --v 7",desc:"Karakter tutarlılığı (--cref) ile aynı kişiyi farklı sahnelerde kullanabilirsin."},
  {cat:"🍽️ Ürün",tool:"DALL-E 3",color:"#fb923c",emoji:"☕",title:"Ürün Fotoğrafı",prompt:"Turkish coffee in elegant ceramic cup, marble surface, steam rising, professional product photography, white background",desc:"E-ticaret için profesyonel ürün fotoğrafı — fotoğrafçı tutmana gerek yok."},
  {cat:"📱 UI/UX",tool:"Midjourney v7",color:"#60a5fa",emoji:"📱",title:"App Arayüzü",prompt:"minimal mobile app UI, dark mode, AI assistant interface, neon accents, glassmorphism --ar 9:16 --v 7",desc:"UI tasarım konseptleri için Midjourney'i kullanmak giderek yaygınlaşıyor."},
];

// Before/After örnekleri
const BEFORE_AFTER = [
  {icon:"📝",title:"Blog Yazısı",time:"3 saat → 20 dk",tools:["ChatGPT","Claude"],before:"Araştırma, yazma, düzenleme, görsel bulma ile 3 saat emek gerektiren 1500 kelimelik blog yazısı.",after:"Claude'a konuyu ver, outline oluştur, her bölümü genişlet, Hemingway ile düzenle. 20 dk, daha iyi içerik."},
  {icon:"💻",title:"Kod Debug",time:"4 saat → 15 dk",tools:["Cursor","Claude"],before:"Stack Overflow'u didik didik aramak, 3-4 saat hata avcılığı, bazen sonuç bile yok.",after:"Hatalı kodu Cursor'a yapıştır. 'Hata nerede, neden oluşuyor, düzelt ve açıkla' de. 15 dakika."},
  {icon:"🎨",title:"Logo Tasarım",time:"1 hafta → 1 gün",tools:["Midjourney","Canva"],before:"Grafik tasarımcıya brief ver, bekleme süreci, revizyonlar, fatura — 1 hafta ve 2000-5000 TL.",after:"Midjourney ile 50+ konsept üret, Canva'da düzenle, vektöre dönüştür. 1 gün, 200 TL."},
  {icon:"📊",title:"Pazar Araştırması",time:"2 gün → 3 saat",tools:["Perplexity","ChatGPT"],before:"Kaynak okuma, not alma, sentezleme, sunum hazırlama — 2 tam iş günü.",after:"Perplexity'de sorular sor, kaynakları kaydet. ChatGPT'de sentezle. Gamma'da sunum yap. 3 saat."},
  {icon:"🎬",title:"Tanıtım Videosu",time:"1 ay → 1 gün",tools:["HeyGen","ElevenLabs"],before:"Senaryo yazımı, çekim organizasyonu, kameraman, ses, kurgu — 1 ay ve büyük bütçe.",after:"ChatGPT ile senaryo yaz, ElevenLabs ile seslendir, HeyGen avatar videosu oluştur. 1 gün, $30."},
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
  { q: "ChatGPT'nin güncel model versiyonu nedir?", opts: ["GPT-4","GPT-4o","GPT-5.5","GPT-3.5"], ans: 2, exp: "GPT-5.5, Nisan 2026'da yayınlanan en güncel OpenAI modelidir." },
  { q: "Claude Opus 4.7'nin SWE-bench skoru nedir?", opts: ["%72.3","%80.8","%87.6","%91.2"], ans: 2, exp: "Claude Opus 4.7, Nisan 2026'da SWE-bench Verified'da %87.6 skor elde etti." },
  { q: "Türkiye AI trafiğinde kaçıncı sırada?", opts: ["3.","5.","1.","2."], ans: 2, exp: "Digital 2026 raporu: Türkiye %94.49 ChatGPT trafiğiyle dünya birincisi." },
  { q: "Gemini 3.1 Ultra'nın context window'u nedir?", opts: ["128K","500K","1M","2M"], ans: 3, exp: "Gemini 3.1 Ultra, 2 milyon token context window ile şu an rekor tutucusu." },
  { q: "Cursor hangi editörü temel alıyor?", opts: ["Vim","Emacs","VS Code","JetBrains"], ans: 2, exp: "Cursor, VS Code üzerine inşa edilmiştir ve tüm VS Code eklentilerini destekler." },
  { q: "Prompt mühendisliğinde 'CoT' ne anlama gelir?", opts: ["Code of Testing","Chain of Thought","Context of Task","Core of Text"], ans: 1, exp: "Chain of Thought — AI'dan adım adım düşünmesini istemek. Özellikle matematiksel problemlerde çok etkili." },
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
    {text:"Güneş batarken denizin mavisi gökyüzünün turuncusuyla dans ederken sahilde yürüyen iki sevgili ellerini tutmuş uzaklara bakıyordu.",isAI:true,reveal:"ChatGPT yazdı",hint:"Mükemmel akış ve klişe metafor"},
    {text:"Bugün patronumla kötü bir gün geçirdim toplantıda fikirlerim alınmadı eve gelince çantamı köşeye fırlattım.",isAI:false,reveal:"Gerçek Twitter kullanıcısı",hint:"Düzensiz anlatım, duygusal patlama"},
    {text:"Kuantum mekaniği parçacıkların aynı anda birden fazla durumda bulunabildiği fikrini içerir.",isAI:true,reveal:"Claude yazdı",hint:"Ansiklopedik netlik"},
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
    {text:"Bugün patronumla kötü bir gün geçirdim. Toplantıda fikirlerim alınmadı, eve gelince çantamı köşeye fırlattım. Zaten her şey böyle gidiyor.",isAI:false,reveal:"Gerçek Twitter kullanıcısı",hint:"Düzensiz anlatım ve duygusal patlama insan izlenimi"},
    {text:"Kuantum mekaniği, parçacıkların aynı anda birden fazla durumda bulunabildiği fikrini içerir. Schrödinger'in kedisi bu ilkeyi simgeler.",isAI:true,reveal:"Claude Opus 4.7 yazdı",hint:"Ansiklopedik netlik ve doğru referans"},
    {text:"Arkadaşım 3 yıldır borçlu. 500 lira için bozuşmak olmaz ama bu ilk kez değil. Ne yapayım bilmiyorum.",isAI:false,reveal:"Gerçek Ekşi Sözlük entry'si",hint:"Spesifik rakam ve sosyal dilema tipik insan yazısı"},
    {text:"Bu pasta tarifini deneyin. Malzemeler: 200g un, 3 yumurta, 150g şeker. Önce kuru malzemeleri karıştırın.",isAI:true,reveal:"Gemini 2.5 yazdı",hint:"Kusursuz ölçüler ve format AI izlenimi"},
    {text:"Bunu yazan sen misin? Yok artık emin misin? Bir daha bak bence. Ben sana söyledim hep ama dinlemedin işte.",isAI:false,reveal:"Gerçek WhatsApp mesajı",hint:"Kesik cümleler ve tekrar eden 'bak' insan yazısı"},
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
function ParaPage(){return <div style={{padding:"28px 20px",maxWidth:900,margin:"0 auto"}}><div style={{marginBottom:20}}><div style={{fontSize:9,letterSpacing:".2em",color:"#34d399",marginBottom:5}}>REHBER</div><div style={{fontSize:22,fontWeight:800,color:"#e2e8f0"}}>💰 AI ile Para Kazan</div></div><div style={{background:"rgba(52,211,153,0.07)",border:"1px solid rgba(52,211,153,0.2)",borderRadius:12,padding:"14px 18px",marginBottom:20,fontSize:12,color:"#34d399"}}>🇹🇷 Türkiye'de AI bilen kişi az, talep çok. Bu pencere kapanmadan başla.</div>{[{icon:"✍️",t:"AI İçerik Üreticisi",e:"₺5K-30K/ay",d:"Kolay",desc:"Blog, YouTube, sosyal medya. AI ile 10x içerik üret."},{icon:"💻",t:"AI Freelancer",e:"₺8K-50K/ay",d:"Orta",desc:"Cursor ile 3x hızlı kod yaz, 3x fazla müşteri al."},{icon:"🎨",t:"AI Tasarımcı",e:"₺3K-20K/ay",d:"Kolay",desc:"Midjourney ile logo, görsel, sunum sat."},{icon:"📚",t:"AI Eğitimci",e:"₺5K-40K/ay",d:"Orta",desc:"Kurs, workshop, kurumsal eğitim. TR'de boş alan."}].map(m=><div key={m.t} style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(52,211,153,0.15)",borderRadius:14,padding:"18px",marginBottom:12}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:8,flexWrap:"wrap",gap:6}}><div style={{display:"flex",gap:10,alignItems:"center"}}><span style={{fontSize:28}}>{m.icon}</span><div><div style={{fontSize:14,fontWeight:700,color:"#e2e8f0"}}>{m.t}</div></div></div><div style={{textAlign:"right"}}><div style={{fontSize:14,fontWeight:800,color:"#34d399"}}>{m.e}</div><Tag text={m.d} color={m.d==="Kolay"?"#34d399":"#fb923c"}/></div></div><div style={{fontSize:12,color:"#64748b",lineHeight:1.7}}>{m.desc}</div></div>)}</div>;}

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
    {title:"Mükemmel CV",kotu:"CV yaz",iyi:"10 yıl deneyimli İK danışmanı olarak [pozisyon] için CV yaz. Başarıları sayısal verilerle destekle. ATS sistemlerini geçecek anahtar kelimeler ekle. Türkçe, 1 sayfa.",note:"Rol + sayısal başarı + ATS = işe alım şansı 3x"},
    {title:"Mülakat Hazırlığı",kotu:"Mülakat soruları ver",iyi:"[Şirket] için [pozisyon] mülakatı. STAR metoduyla yanıtlayabileceğim 10 soru ve her biri için cevap çerçevesi. Şirket değerleri: [değerler]. Zor sorular dahil et.",note:"Şirketi araştır, değerleri ver, STAR formülü şart"},
    {title:"Müzakere E-postası",kotu:"Maaş isteği yaz",iyi:"[X TL] teklif aldım, [Y TL] istiyorum. Sektör ort. [Z TL]. İlişkiyi bozmayan değer önerisine dayanan Türkçe müzakere e-postası. 3 farklı ton ver.",note:"3 versiyon iste, duruma göre seç"},
    {title:"İş Planı",kotu:"İş planı yaz",iyi:"Startup danışmanı olarak [ürün] için 12 aylık iş planı. Pazar analizi, rekabet, gelir modeli, finansal projeksiyon. Somut rakamlar, yatırımcı sunum formatı.",note:"Bölümleri önceden belirt"},
  ]},
  {cat:"📱 İçerik & Sosyal",color:"#f472b6",icon:"📱",items:[
    {title:"Viral LinkedIn Postu",kotu:"LinkedIn yazısı yaz",iyi:"İçerik stratejisti olarak [konu] hakkında viral LinkedIn postu yaz. İlk cümle şok edici. Kişisel deneyim ekle. 3 çıkarım listele. Soru ile bitir. 200-250 kelime.",note:"Hook + hikaye + çıkarım + soru = viral formül"},
    {title:"İçerik Takvimi",kotu:"İçerik planı yap",iyi:"[Marka] için 4 haftalık sosyal medya takvimi. Instagram + LinkedIn. Kategoriler: Eğitici %40, Eğlenceli %30, Satış %20, Topluluk %10. Tablo formatında.",note:"Yüzdeleri ver, dengeli içerik"},
    {title:"YouTube Senaryo",kotu:"YouTube videosu yaz",iyi:"[Konu] için YouTube senaryosu. İlk 30sn dikkat çekici hook. 3 ana bölüm (2-3dk her biri). Sonunda CTA. Ton: [samimi/eğitici]. Toplam 10 dakika.",note:"Hook + bölümler + CTA = izlenme süresi maksimum"},
    {title:"Instagram Caption",kotu:"Caption yaz",iyi:"[Ürün/hizmet] için Instagram caption. Ton: [samimi/profesyonel]. CTA ekle. 3 farklı versiyon: Kısa (50k), orta (100k), hikaye formatı. Her birinde 5 hashtag.",note:"3 versiyon iste, en iyisini seç"},
  ]},
  {cat:"⚙️ Kod & Teknik",color:"#00dcff",icon:"⚙️",items:[
    {title:"Kod Review",kotu:"Bu kodu düzelt",iyi:"Senior mühendis olarak bu [dil] kodu incele:\n```[kod]```\n1)Hatalar 2)Güvenlik açıkları 3)Performans iyileştirme 4)Düzeltilmiş versiyon 5)Unit test.",note:"Her adımı ayrı madde yap"},
    {title:"API Tasarımı",kotu:"API yaz",iyi:"RESTful API tasarımcısı olarak [uygulama] için API tasarla. Endpoint'ler, HTTP metodları, request/response, hata kodları, authentication. OpenAPI 3.0 formatı.",note:"Standart formatı belirt"},
    {title:"Hata Debug",kotu:"Bu hata neden oluyor",iyi:"[Hata mesajı] aldım. Ortam: [OS, dil, kütüphane]. 1)Hatanın tam sebebi 2)Root cause 3)3 farklı çözüm 4)Tekrarlanmaması için önlem.",note:"Hata mesajı + ortam + bağlam = ilk seferde çözüm"},
    {title:"SQL Sorgusu",kotu:"SQL yaz",iyi:"DBA uzmanı olarak [veritabanı] için bu sorguyu yaz: [istek]. Tablo yapısı: [tablo]. Performans için index öner, EXPLAIN PLAN çıktısını yorumla.",note:"Tablo yapısını ver, optimize sorgu al"},
  ]},
  {cat:"🎓 Eğitim & Araştırma",color:"#34d399",icon:"🎓",items:[
    {title:"Feynman Tekniği",kotu:"[konu] anlat",iyi:"[Konu]'u Feynman tekniğiyle anlat: 1)8 yaşındaki çocuğa açıkla 2)Temel kavramlar 3)Gerçek hayat örnekleri 4)Sık yanlış anlamalar 5)İleri öğrenim yolu.",note:"Feynman = gerçek anlama, ezbersiz"},
    {title:"Quiz Üretici",kotu:"Test sorusu yaz",iyi:"[Konu] için Bloom taksonomisine göre 15 soru: 5 bilgi, 5 anlama, 3 uygulama, 2 analiz. Her soru için 4 şık, doğru cevap ve açıklama. Zorluk artan sırayla.",note:"Bloom taksonomisi = dengeli değerlendirme"},
    {title:"Öğrenme Planı",kotu:"[konu] nasıl öğrenirim",iyi:"Eğitim koçu olarak [konu]'u [seviye] birisi için 90 günlük yol haritası. Her hafta: hedef + kaynak + pratik görev + ölçüm. Ücretsiz kaynakları önce say.",note:"Seviyeni ve süreyi belirt"},
    {title:"Araştırma Analizi",kotu:"Bu makaleyi özetle",iyi:"Akademik editör olarak analiz et: 1)Ana hipotez 2)Metodoloji güçlü/zayıf 3)Temel bulgular (sayısal) 4)Sınırlılıklar 5)Güvenilirlik 1-10.",note:"Sınırlılıkları iste, eleştirel analiz"},
  ]},
  {cat:"✍️ Yaratıcı Yazarlık",color:"#a855f7",icon:"✍️",items:[
    {title:"Güçlü Hikaye",kotu:"Hikaye yaz",iyi:"[Tür]'de [ayar]'da geçen [karakter] ile hikaye yaz. Kesinlikle içersin: [3 unsur]. Hook ile başlasın, iç çatışma olsun, açık uçlu bitsin. Ton: [ton]. 800 kelime.",note:"Kısıtlamalar ver, daha yaratıcı çıktı"},
    {title:"Marka Sesi",kotu:"Marka için yaz",iyi:"[Marka] sesi: [3 sıfat]. Hedef: [kitle]. Bu sesle yaz: 1)Slogan 3 alternatif 2)Bio Twitter/LinkedIn/Instagram 3)E-posta açılış 4)Kriz durumu yanıtı.",note:"Ses kılavuzunu tanımla, tutarlı marka al"},
    {title:"İsim & Tagline",kotu:"İsim bul",iyi:"[Sektör]'deki [hedef kitle]'ye yönelik [değer önerisi] için 10 marka ismi. Her biri: anlam, neden işe yarar, potansiyel sorun. Sonra her birine 2 tagline.",note:"Kriterleri ver, seçenek zenginliği"},
    {title:"Karakter Geliştir",kotu:"Karakter yarat",iyi:"[Hikaye] için [isim] karakteri: fiziksel özellikler, kişilik (MBTI + 5 sıfat), motivasyon, korkusu, sırrı, konuşma tarzı, 3 alışkanlık.",note:"MBTI iste, tutarlı karakter al"},
  ]},
  {cat:"⚡ Verimlilik",color:"#60a5fa",icon:"⚡",items:[
    {title:"Karar Analizi",kotu:"Ne yapayım",iyi:"Stratejik danışman olarak [durum]. Seçenekler: [A] ve [B]. 1)5'er artı/eksi 2)Risk matrisi 3)Değerlerime uygunluk (değerlerim: [liste]) 4)Nihai öneri.",note:"Değerlerini ver, kişisel karar al"},
    {title:"Haftalık Plan",kotu:"Haftalık plan yap",iyi:"Verimlilik koçu olarak [hedeflerim] için haftalık plan. Kısıtlarım: [zaman]. Her gün: 2 derin çalışma (90dk), 1 idari blok (45dk). Pazartesi-Cuma tablosu.",note:"Kısıtlarını belirt, gerçekçi plan"},
    {title:"E-posta Yönetimi",kotu:"E-postalarımı düzenle",iyi:"150 okunmamış e-postam var. 3 kategori sistemi kur: 1)Acil-Önemli 2)Önemli ama acil değil 3)Sil/Arşivle. Her kategori için karar kriterleri yaz.",note:"Sistem kur, bir daha birikmez"},
    {title:"Hızlı Öğrenme",kotu:"Bunu öğrenmek istiyorum",iyi:"Pareto prensibini uygula: [konu]'nun %20'si %80 değer verir. Hangi kısım? O kısım için: 5 temel kavram + pratik egzersizler + nasıl ölçerim.",note:"Pareto + spesifik = hızlı öğrenme"},
  ]},
];

const MYTHS_DATA = [
  {myth:"AI işleri elimizden alacak",reality:"AI bazı görevleri değiştiriyor ama yeni işler yaratıyor. 'AI kullanan biri, kullanmayan birinin işini alacak.' Her teknoloji devrimi böyle işledi.",verdict:"Kısmen",color:"#fb923c"},
  {myth:"AI her şeyi biliyor",reality:"AI'lar eğitim verilerine bağlı. Güncel bilgi bilmeyebilir, hallüsinasyon yapabilir. Kritik bilgileri başka kaynakla doğrula.",verdict:"Yanlış",color:"#34d399"},
  {myth:"AI insan gibi düşünüyor",reality:"AI istatistiksel örüntü tanıma yapıyor. Anlama, bilinç, duygu yok. 'Sanki düşünüyor gibi' görünüyor — gerçek düşünme değil.",verdict:"Yanlış",color:"#34d399"},
  {myth:"AI tamamen güvenilir",reality:"Hallüsinasyon, bias ve hatalar hâlâ var. Tıp, hukuk, finans gibi kritik alanlarda mutlaka uzman doğrulaması şart.",verdict:"Yanlış",color:"#34d399"},
  {myth:"AI özel bilgilerimi saklar",reality:"API üzerinden kullanılan AI'lar (doğru ayarlarla) konuşmayı eğitime katmaz. Yine de hassas veri paylaşma.",verdict:"Kısmen",color:"#60a5fa"},
  {myth:"En pahalı AI en iyisidir",reality:"Görev bağımlı. Kod için Claude, araştırma için Gemini, genel kullanım için ChatGPT. Doğru araç > Pahalı araç.",verdict:"Yanlış",color:"#34d399"},
  {myth:"Türkiye'de AI için çok geç",reality:"Türkiye AI trafiğinde dünya #1. Türkçe içerik ve yerel ihtiyaçlar için erken girişimci avantajı hâlâ büyük.",verdict:"Yanlış",color:"#34d399"},
  {myth:"AI yakında her şeyi yapacak",reality:"Agentic AI güçleniyor ama bağlam, etik ve güven sorunları gerçek. 2026'da AI çok güçlü ama insan denetimi hâlâ şart.",verdict:"Kısmen",color:"#fb923c"},
];

const KARIYER_DATA = [
  {icon:"💡",title:"Prompt Mühendisi",salary:"₺20K-60K/ay",level:"Başlangıç",time:"1-2 ay",desc:"Şirketlere özel prompt sistemleri kur, optimize et. En hızlı öğrenilebilen AI mesleklerinden biri.",skills:["Prompt teknikleri","Model farkları","Test metodolojisi"],url:"https://promptingguide.ai"},
  {icon:"🤖",title:"AI Danışmanı",salary:"₺30K-80K/ay",level:"Orta",time:"3-6 ay",desc:"KOBİ ve kurumsal şirketlere AI entegrasyonu danışmanlığı. Türkiye'de talep patlamış, arz çok az.",skills:["İş analizi","AI araçları","Proje yönetimi"],url:"https://coursera.org"},
  {icon:"💻",title:"ML Mühendisi",salary:"₺40K-120K/ay",level:"İleri",time:"1-2 yıl",desc:"Makine öğrenmesi modelleri geliştir, üretim ortamına al. Python, PyTorch/TensorFlow bilgisi şart.",skills:["Python","PyTorch","MLOps","Matematik"],url:"https://fast.ai"},
  {icon:"📊",title:"AI Ürün Yöneticisi",salary:"₺35K-100K/ay",level:"Orta",time:"6-12 ay",desc:"AI ürünlerini planla, geliştir, piyasaya sun. Teknik ve iş dünyası arasında köprü kur.",skills:["Ürün yönetimi","AI temelleri","Veri analizi"],url:"https://producthunt.com"},
  {icon:"✍️",title:"AI İçerik Stratejisti",salary:"₺15K-40K/ay",level:"Başlangıç",time:"2-4 hafta",desc:"AI araçlarıyla içerik üret, marka sesi oluştur, içerik stratejisi kur.",skills:["ChatGPT","Claude","İçerik pazarlama"],url:"https://hubspot.com"},
  {icon:"🎨",title:"AI Tasarımcı",salary:"₺10K-35K/ay",level:"Başlangıç",time:"2-4 hafta",desc:"Midjourney, DALL-E, Firefly ile görsel üret. UI/UX tasarımında AI'ı entegre et.",skills:["Midjourney","Canva AI","Prompt yazımı"],url:"https://midjourney.com"},
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
  const tabs=[["nedir","🤔 AI Nedir?"],["turleri","🗂️ Türleri"],["tarihce","📅 Tarihçe"],["turkiye","🇹🇷 TR'de AI"],["gelecek","🚀 Gelecek"]];
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
  return <div style={{padding:"28px 20px",maxWidth:900,margin:"0 auto"}}>
    <div style={{marginBottom:20}}><div style={{fontSize:9,letterSpacing:".2em",color:"#475569",marginBottom:5}}>KARİYER</div><div style={{fontSize:22,fontWeight:800,color:"#e2e8f0"}}>🚀 AI Kariyer Rehberi 2026</div><div style={{fontSize:12,color:"#64748b",marginTop:3}}>Türkiye'de AI meslekleri, maaşlar ve nasıl başlanır</div></div>
    <div style={{background:"rgba(0,220,255,0.06)",border:"1px solid rgba(0,220,255,0.2)",borderRadius:12,padding:"14px 18px",marginBottom:20,fontSize:12,color:"#00dcff",lineHeight:1.7}}>
      🇹🇷 <strong>Türkiye fırsatı:</strong> AI bilen uzman sayısı çok az, talep patlıyor. 2024'e kıyasla AI meslek ilanları %340 arttı. Şimdi başla.
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14,marginBottom:24}}>
      {KARIYER_DATA.map(k=>(
        <div key={k.title} style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:14,padding:"18px"}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
            <div style={{display:"flex",gap:10,alignItems:"center"}}><span style={{fontSize:26}}>{k.icon}</span><div><div style={{fontSize:14,fontWeight:700,color:"#e2e8f0"}}>{k.title}</div><div style={{fontSize:10,color:"#475569"}}>{k.level} · {k.time}</div></div></div>
            <div style={{textAlign:"right"}}><div style={{fontSize:13,fontWeight:800,color:"#34d399"}}>{k.salary}</div></div>
          </div>
          <div style={{fontSize:12,color:"#64748b",lineHeight:1.6,marginBottom:10}}>{k.desc}</div>
          <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:10}}>{k.skills.map(s=><Tag key={s} text={s} color="#00dcff" size={9}/>)}</div>
          <a href={k.url} target="_blank" rel="noopener noreferrer" style={{display:"block",padding:"8px",borderRadius:8,border:"none",background:"rgba(0,220,255,0.1)",color:"#00dcff",fontSize:11,cursor:"pointer",textDecoration:"none",textAlign:"center",fontWeight:600}}>Başlangıç Kaynağı →</a>
        </div>
      ))}
    </div>
    <div style={{background:"rgba(168,85,247,0.06)",border:"1px solid rgba(168,85,247,0.2)",borderRadius:14,padding:"20px"}}>
      <div style={{fontSize:14,fontWeight:700,color:"#e2e8f0",marginBottom:12}}>📚 Ücretsiz Başlangıç Yolu (0 TL)</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:8}}>
        {[["Hafta 1","ChatGPT'ye kayıt ol, her gün 30dk kullan"],["Hafta 2","Claude ve Gemini dene, farkları gözlemle"],["Hafta 3","Prompt rehberimizden 10 teknik öğren"],["Hafta 4","AI ile gerçek bir iş yap: CV, içerik veya kod"],["Ay 2","Mesleğine en uygun AI aracını derinlemesine öğren"],["Ay 3","Öğrendiklerini LinkedIn/YouTube'da paylaş, müşteri bul"]].map(([h,d])=>(
          <div key={h} style={{display:"flex",gap:8,alignItems:"flex-start"}}>
            <div style={{width:18,height:18,borderRadius:"50%",background:"rgba(168,85,247,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,color:"#a855f7",flexShrink:0,fontWeight:700,marginTop:1}}>→</div>
            <div><div style={{fontSize:10,color:"#a855f7",fontWeight:700,marginBottom:2}}>{h}</div><div style={{fontSize:10,color:"#64748b",lineHeight:1.4}}>{d}</div></div>
          </div>
        ))}
      </div>
    </div>
  </div>;
}

// ── NAVIGATION ─────────────────────────────────────────────
const NAV = [
  {id:"home",label:"Ana Sayfa"},
  {id:"haberler",label:"Haberler"},
  {id:"blog",label:"Blog"},
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
  {id:"zaman",label:"📅 Tarihçe"},
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
  if(page==="chatgpt"||page==="claude"||page==="gemini"){return <Wrapper nav={nav} page={page} cookie={cookie} setCookie={setCookie}><ModelPage modelKey={page}/></Wrapper>;}

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
    {page==="quiz"          &&<QuizPage/>}
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
