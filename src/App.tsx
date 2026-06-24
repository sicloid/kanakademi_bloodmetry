import { useState, useEffect } from 'react';
import { Heart, Activity, AlertTriangle, CheckCircle, RefreshCw, X, MapPin, Plus } from 'lucide-react';
import { usePulseData } from './hooks/usePulseData';

// --- Components ---

function HeaderPulseWave() {
  return (
    <svg width="36" height="24" viewBox="0 0 36 24" className="text-crimson" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M0,12 L10,12 L14,4 L18,20 L22,12 L36,12" className="animate-pulse" />
    </svg>
  );
}

function StatusTicker() {
  const messages = [
    "KRİTİK: Büyükşehirlerde 0- kan stokları %15'in altında. Acil bağışçılar aranıyor.",
    "CANLI BİLDİRİM: Kızılay Ankara Merkez'e 2 ünite B+ kan bağışı yapıldı.",
    "BİLGİ: Tek bir kan bağışı ile 3 kişinin hayatını kurtarabilirsiniz.",
    "CANLI BİLDİRİM: İstanbul Şişli merkezinde 0+ stokları güvenli seviyeye ulaştı.",
    "ACİL: AB- plazma talebi son 4 saatte %40 arttı.",
    "BİLGİ: Dünyada her 2 saniyede 1 kişinin kana ihtiyacı var."
  ];
  
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="panel" style={{ padding: '10px 12px', background: 'rgba(18, 18, 18, 0.5)' }}>
      <div className="flex-row items-center gap-3">
        <div style={{ background: 'var(--translucent-crimson)', padding: '2px 6px', borderRadius: '4px' }}>
          <span className="text-crimson text-xs font-bold">UYARI</span>
        </div>
        <div className="text-sm line-clamp-1" style={{ opacity: 0.85, flex: 1, transition: 'opacity 0.3s' }} key={index}>
          {messages[index]}
        </div>
      </div>
    </div>
  );
}

function HeroLiveCounter({ globalDonations, globalLivesSaved, turkeyDonations, turkeyLivesSaved }: any) {
  const format = (num: number) => new Intl.NumberFormat('en-US').format(num);

  return (
    <div className="panel" style={{ background: 'linear-gradient(to bottom, var(--translucent-crimson) 0%, var(--card-charcoal) 100%)', textAlign: 'center', padding: '24px 16px' }}>
      <div className="flex-col items-center">
        <div className="panel-header">BUGÜN KÜRESEL BAĞIŞLAR</div>
        <div className="text-5xl font-black font-mono text-white mb-2">{format(globalDonations)}</div>
        <div className="flex-row items-center gap-2" style={{ background: '#221111', padding: '6px 14px', borderRadius: '16px' }}>
          <Heart size={14} className="text-crimson" />
          <span className="text-crimson text-sm font-bold">≈ +{format(globalLivesSaved)} Hayat Kurtarıldı</span>
        </div>

        <div style={{ width: '80%', height: '1px', background: 'var(--translucent-slate)', margin: '24px 0' }} />

        <div className="panel-header">BUGÜN TÜRKİYE BAĞIŞLARI</div>
        <div className="text-4xl font-black font-mono text-white mb-2">{format(turkeyDonations)}</div>
        <div className="flex-row items-center gap-2" style={{ background: '#221111', padding: '6px 14px', borderRadius: '16px' }}>
          <Heart size={12} className="text-crimson" />
          <span className="text-crimson text-xs font-bold">≈ +{format(turkeyLivesSaved)} Hayat Kurtarıldı</span>
        </div>
      </div>
    </div>
  );
}

function CampaignBanner() {
  return (
    <div className="panel" style={{ height: '140px', padding: 0, position: 'relative' }}>
      {/* Background simulating image with gradient overlay */}
      <div style={{ 
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(to right, rgba(0,0,0,0.95), rgba(0,0,0,0.4)), url("https://images.unsplash.com/photo-1536856136534-bb679c52a9aa?q=80&w=2070&auto=format&fit=crop")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        zIndex: 0
      }} />
      <div style={{ position: 'relative', zIndex: 1, padding: '16px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ background: 'var(--neon-crimson)', padding: '2px 8px', borderRadius: '4px', alignSelf: 'flex-start' }}>
          <span className="text-white text-xs font-bold">DSÖ KÜRESEL TEMA 2025</span>
        </div>
        <div>
          <div className="text-lg font-black text-white">"Kan verin, umut verin:</div>
          <div className="text-lg font-black text-crimson">Birlikte hayat kurtarıyoruz."</div>
        </div>
      </div>
    </div>
  );
}

function Demographics() {
  return (
    <div className="panel flex-col justify-between" style={{ height: '150px' }}>
      <div className="panel-header text-center w-full">KÜRESEL BAĞIŞÇI ORANI</div>
      <div className="flex-row items-center justify-center gap-4">
        {/* Simple CSS Pie Chart representation */}
        <div style={{ position: 'relative', width: '54px', height: '54px', borderRadius: '50%', background: `conic-gradient(var(--electric-white) 0% 33%, var(--neon-crimson) 33% 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--card-charcoal)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span className="text-white text-xs font-bold">67%</span>
            <span className="text-muted" style={{ fontSize: '8px' }}>Erkek</span>
          </div>
        </div>
        <div className="flex-col gap-1">
          <div className="flex-row items-center gap-1"><div className="circle" style={{ width: 6, height: 6, background: 'var(--neon-crimson)' }}></div><span className="text-xs font-bold text-white">%67 Erkek</span></div>
          <div className="flex-row items-center gap-1"><div className="circle" style={{ width: 6, height: 6, background: 'var(--electric-white)' }}></div><span className="text-xs font-bold text-white">%33 Kadın</span></div>
        </div>
      </div>
      <div className="text-muted text-center" style={{ fontSize: '10px' }}>Hedef: 2030'a kadar %50/%50 denge</div>
    </div>
  );
}

function GlobalImpact() {
  return (
    <div className="panel flex-col justify-between" style={{ height: '150px' }}>
      <div className="panel-header" style={{ color: 'var(--neon-crimson)' }}>KRİTİK FAKTÖR</div>
      <div className="flex-col">
        <div className="text-3xl font-black font-mono">2sn</div>
        <div className="text-xs text-muted mt-1">dünya genelinde her 2 saniyede 1 kişinin acil kan bağışına ihtiyacı vardır.</div>
      </div>
      <div className="text-muted" style={{ fontSize: '10px' }}>Kaynak: WHO & Kızılay</div>
    </div>
  );
}

function BloodUrgency() {
  const renderRow = (type: string, label: string, progress: number, color: string) => (
    <div className="flex-col gap-1">
      <div className="flex-row justify-between items-center">
        <div className="flex-row items-center gap-1">
          <div className="circle" style={{ width: 4, height: 4, background: color }}></div>
          <span className="text-xs font-bold">{type}</span>
        </div>
        <span style={{ color, fontSize: '10px', fontWeight: 'bold' }}>{label}</span>
      </div>
      <div style={{ width: '100%', height: '3px', background: '#222', borderRadius: '2px' }}>
        <div style={{ width: `${progress * 100}%`, height: '100%', background: color, borderRadius: '2px' }} />
      </div>
    </div>
  );

  return (
    <div className="panel flex-col justify-between" style={{ height: '150px' }}>
      <div className="panel-header">TALEP MATRİSİ</div>
      <div className="flex-col gap-2">
        {renderRow('O-', 'KRİTİK SEVİYE', 0.12, 'var(--neon-crimson)')}
        {renderRow('A-', 'DÜŞÜK SEVİYE', 0.38, 'var(--orange-risk)')}
        {renderRow('O+', 'GÜVENLİ ARALIK', 0.74, 'var(--blue-safe)')}
      </div>
      <div className="text-muted" style={{ fontSize: '10px' }}>O- evrensel kırmızı kan hücresi tipidir</div>
    </div>
  );
}

function LivePulseActivity() {
  return (
    <div className="panel flex-col justify-between" style={{ height: '150px' }}>
      <div className="panel-header">CANLI KLİNİK KAYITLARI</div>
      <div className="flex-row justify-center items-center" style={{ flex: 1 }}>
        <HeaderPulseWave />
      </div>
      <div className="flex-row justify-between items-center">
        <span className="text-muted" style={{ fontSize: '10px' }}>VİTAL HIZI</span>
        <span className="text-green font-bold font-mono" style={{ fontSize: '10px' }}>88 BPM / SYNC</span>
      </div>
    </div>
  );
}

// --- Modals ---

function EligibilityQuizModal({ isOpen, onClose, onPledge }: { isOpen: boolean, onClose: () => void, onPledge: () => void }) {
  const [step, setStep] = useState(0);
  const [age, setAge] = useState(25);
  const [weight, setWeight] = useState(65);
  const [feelingWell, setFeelingWell] = useState<boolean | null>(null);
  const [recentDonation, setRecentDonation] = useState<boolean | null>(null);

  const isEligible = age >= 17 && age <= 65 && weight >= 50 && feelingWell === true && recentDonation === false;

  useEffect(() => {
    if (isOpen) {
      setStep(0); setAge(25); setWeight(65); setFeelingWell(null); setRecentDonation(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`}>
      <div className="modal-content">
        <div className="flex-row justify-between items-center mb-6">
          <div className="flex-col">
            <span className="text-crimson text-xs font-bold tracking-widest">UYGUNLUK KONTROLÜ</span>
            <span className="text-lg font-black text-white">Vital Değerlendirme</span>
          </div>
          <button onClick={onClose} className="circle p-2" style={{ background: 'var(--card-charcoal)' }}>
            <X className="text-white" size={20} />
          </button>
        </div>

        {step < 4 && (
          <div className="flex-row gap-1 mb-6">
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} style={{ flex: 1, height: '3px', background: i <= step ? 'var(--neon-crimson)' : '#222', borderRadius: '2px', opacity: i === step ? 0.5 : 1 }} />
            ))}
          </div>
        )}

        <div className="mb-8" style={{ minHeight: '300px' }}>
          {step === 0 && (
            <div className="flex-col">
              <span className="text-muted text-xs font-bold">Adım 01 / 04</span>
              <span className="text-xl font-bold text-white mt-1 mb-2">Biyolojik yaşınızı belirtin</span>
              <span className="text-sm text-muted">Bağışçılar standart güvenlik sınırları için 17 ile 65 yaşları arasında olmalıdır.</span>
              
              <div className="flex-col items-center justify-center my-8 p-6" style={{ background: 'var(--card-charcoal)', borderRadius: '12px' }}>
                <span className="text-5xl font-black font-mono text-crimson">{age}</span>
                <span className="text-sm text-muted">Yaşında</span>
              </div>
              
              <input type="range" min="14" max="80" value={age} onChange={(e) => setAge(parseInt(e.target.value))} style={{ width: '100%', accentColor: 'var(--neon-crimson)' }} />
              <div className="flex-row justify-between mt-2 text-xs">
                <span className="text-muted">14 yaş</span>
                <span className="text-crimson font-bold">65 Yaş Sınırı</span>
                <span className="text-muted">80 yaş</span>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="flex-col">
              <span className="text-muted text-xs font-bold">Adım 02 / 04</span>
              <span className="text-xl font-bold text-white mt-1 mb-2">Toplam vücut ağırlığınızı belirtin</span>
              <span className="text-sm text-muted">Güvenlik kuralları, kan hacmi oranının korunması için en az 50 kg ağırlık gerektirir.</span>
              
              <div className="flex-col items-center justify-center my-8 p-6" style={{ background: 'var(--card-charcoal)', borderRadius: '12px' }}>
                <span className="text-5xl font-black font-mono text-crimson">{weight}</span>
                <span className="text-sm text-muted">Kilogram (kg)</span>
              </div>
              
              <input type="range" min="35" max="120" value={weight} onChange={(e) => setWeight(parseInt(e.target.value))} style={{ width: '100%', accentColor: 'var(--neon-crimson)' }} />
              <div className="flex-row justify-between mt-2 text-xs">
                <span className="text-muted">35 kg</span>
                <span className="text-crimson font-bold">50 kg Sınırı</span>
                <span className="text-muted">120 kg</span>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex-col">
              <span className="text-muted text-xs font-bold">Adım 03 / 04</span>
              <span className="text-xl font-bold text-white mt-1 mb-2">Bugün kendinizi sağlıklı hissediyor musunuz?</span>
              <span className="text-sm text-muted">Ateşiniz, boğaz ağrınız, soğuk algınlığınız veya hastalığınız var mı? Bağışçılar sağlıklı olmalıdır.</span>
              
              <div className="flex-row gap-4 mt-8">
                <button onClick={() => setFeelingWell(true)} className="flex-1 flex-col items-center justify-center p-6 gap-2" style={{ background: feelingWell === true ? '#1B2A1E' : 'var(--card-charcoal)', border: feelingWell === true ? '1px solid var(--live-green)' : '1px solid transparent', borderRadius: '12px' }}>
                  <CheckCircle size={28} color={feelingWell === true ? 'var(--live-green)' : 'var(--muted-slate-gray)'} />
                  <span className={feelingWell === true ? 'text-white font-bold' : 'text-muted font-bold'}>İyi Hissediyorum</span>
                </button>
                <button onClick={() => setFeelingWell(false)} className="flex-1 flex-col items-center justify-center p-6 gap-2" style={{ background: feelingWell === false ? '#2E1114' : 'var(--card-charcoal)', border: feelingWell === false ? '1px solid var(--neon-crimson)' : '1px solid transparent', borderRadius: '12px' }}>
                  <X size={28} color={feelingWell === false ? 'var(--neon-crimson)' : 'var(--muted-slate-gray)'} />
                  <span className={feelingWell === false ? 'text-white font-bold' : 'text-muted font-bold'}>İyi Hissetmiyorum</span>
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex-col">
              <span className="text-muted text-xs font-bold">Adım 04 / 04</span>
              <span className="text-xl font-bold text-white mt-1 mb-2">Yakın zamanda bağış yaptınız mı?</span>
              <span className="text-sm text-muted">Kırmızı kan hücresi rezervinin yenilenmesi için bağışlar arasında en az 56 gün olmalıdır.</span>
              
              <div className="flex-row gap-4 mt-8">
                <button onClick={() => setRecentDonation(true)} className="flex-1 flex-col items-center justify-center p-6 gap-2" style={{ background: recentDonation === true ? '#2E1114' : 'var(--card-charcoal)', border: recentDonation === true ? '1px solid var(--neon-crimson)' : '1px solid transparent', borderRadius: '12px' }}>
                  <RefreshCw size={28} color={recentDonation === true ? 'var(--neon-crimson)' : 'var(--muted-slate-gray)'} />
                  <span className={recentDonation === true ? 'text-white font-bold text-center' : 'text-muted font-bold text-center'} style={{fontSize: '13px'}}>Evet, 56g içinde</span>
                </button>
                <button onClick={() => setRecentDonation(false)} className="flex-1 flex-col items-center justify-center p-6 gap-2" style={{ background: recentDonation === false ? '#1B2A1E' : 'var(--card-charcoal)', border: recentDonation === false ? '1px solid var(--live-green)' : '1px solid transparent', borderRadius: '12px' }}>
                  <CheckCircle size={28} color={recentDonation === false ? 'var(--live-green)' : 'var(--muted-slate-gray)'} />
                  <span className={recentDonation === false ? 'text-white font-bold text-center' : 'text-muted font-bold text-center'} style={{fontSize: '13px'}}>Yakın zamanda bağış yok</span>
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="flex-col items-center">
              <div className="circle mb-4" style={{ background: isEligible ? '#1B2A1E' : '#2E1114', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isEligible ? <CheckCircle size={48} color="var(--live-green)" /> : <AlertTriangle size={48} color="var(--neon-crimson)" />}
              </div>
              <span className="text-xl font-black mb-2" style={{ color: isEligible ? 'var(--live-green)' : 'var(--neon-crimson)', letterSpacing: '1px' }}>
                DURUM: {isEligible ? 'ONAYLANDI' : 'ERTELENDİ'}
              </span>
              <span className="text-center font-bold text-sm mb-6">
                {isEligible ? "Kan bağışı için tüm standart tıbbi kriterleri karşılıyorsunuz!" : "Şu an için standart gereksinimleri karşılamıyorsunuz."}
              </span>
              
              <div className="panel flex-col gap-2 w-full mb-6">
                <span className="text-muted text-xs font-bold tracking-widest mb-2">VİTAL ÖZETİ</span>
                <div className="flex-row justify-between"><span className="text-xs text-muted">Yaş Şartı (17-65)</span><span className={`text-xs font-bold ${age >= 17 && age <= 65 ? 'text-white' : 'text-crimson'}`}>{age} yaş</span></div>
                <div className="flex-row justify-between"><span className="text-xs text-muted">Ağırlık Şartı (>=50 kg)</span><span className={`text-xs font-bold ${weight >= 50 ? 'text-white' : 'text-crimson'}`}>{weight} kg</span></div>
                <div className="flex-row justify-between"><span className="text-xs text-muted">Genel Sağlık Durumu</span><span className={`text-xs font-bold ${feelingWell ? 'text-white' : 'text-crimson'}`}>{feelingWell ? 'İyi' : 'Akut Rahatsızlık'}</span></div>
                <div className="flex-row justify-between"><span className="text-xs text-muted">56-Gün Bekleme Süresi</span><span className={`text-xs font-bold ${recentDonation === false ? 'text-white' : 'text-crimson'}`}>{recentDonation === false ? 'Uygun' : 'Yakın Bağış'}</span></div>
              </div>
            </div>
          )}
        </div>

        {step < 4 ? (
          <div className="flex-row justify-between items-center">
            <button onClick={() => setStep(prev => prev - 1)} disabled={step === 0} className="text-sm font-bold text-muted disabled:opacity-50">GERİ</button>
            <button onClick={() => setStep(prev => prev + 1)} disabled={(step === 2 && feelingWell === null) || (step === 3 && recentDonation === null)} className="btn btn-primary px-6 text-sm">
              {step === 3 ? 'GÖNDER' : 'İLERİ'}
            </button>
          </div>
        ) : (
          <div className="flex-row justify-center">
            {isEligible ? (
               <button onClick={() => { onClose(); onPledge(); }} className="btn w-full" style={{ background: 'var(--live-green)', color: 'var(--bg-pure-black)' }}>Ünite Taahhüt Et</button>
            ) : (
               <button onClick={onClose} className="btn w-full" style={{ background: 'var(--card-charcoal)' }}>Anladım</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function PledgeSubmissionModal({ isOpen, onClose, onSubmit }: { isOpen: boolean, onClose: () => void, onSubmit: (data: any) => void }) {
  const [name, setName] = useState('');
  const [bloodType, setBloodType] = useState('O+');
  const [location, setLocation] = useState('');
  const bloodTypes = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

  if (!isOpen) return null;

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`}>
      <div className="modal-content">
        <div className="flex-row justify-between items-center mb-6">
          <div className="flex-col">
            <span className="text-crimson text-xs font-bold tracking-widest">BUGÜN HAYAT KURTAR</span>
            <span className="text-lg font-black text-white">Kan Bağışı Taahhüdü Gönder</span>
          </div>
          <button onClick={onClose} className="circle p-2" style={{ background: 'var(--card-charcoal)' }}>
            <X className="text-white" size={20} />
          </button>
        </div>

        <div className="flex-col gap-6 mb-6">
          <div className="flex-col">
            <label className="text-muted text-xs font-bold mb-2">BAĞIŞÇI KİMLİĞİ / RUMUZ</label>
            <input 
              type="text" 
              placeholder="Örn., Dr. Ken Sato" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              className="p-3 text-sm text-white" 
              style={{ background: 'var(--card-charcoal)', border: '1px solid var(--translucent-slate)', borderRadius: '8px', outline: 'none' }} 
            />
          </div>

          <div className="flex-col">
            <label className="text-muted text-xs font-bold mb-2">KAN GRUBU</label>
            <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', padding: 0, gap: '8px' }}>
              {bloodTypes.map(bType => (
                <button 
                  key={bType} 
                  onClick={() => setBloodType(bType)} 
                  className="font-bold text-sm" 
                  style={{ 
                    height: '44px', borderRadius: '8px', 
                    background: bType === bloodType ? 'var(--neon-crimson)' : 'var(--card-charcoal)', 
                    color: bType === bloodType ? 'var(--electric-white)' : 'var(--muted-slate-gray)',
                    border: bType === bloodType ? '1px solid var(--neon-crimson)' : '1px solid var(--translucent-slate)'
                  }}
                >
                  {bType}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-col">
            <label className="text-muted text-xs font-bold mb-2">TERCİH EDİLEN MERKEZ</label>
            <input 
              type="text" 
              placeholder="Örn., Şehir Tıp Merkezi" 
              value={location} 
              onChange={e => setLocation(e.target.value)} 
              className="p-3 text-sm text-white" 
              style={{ background: 'var(--card-charcoal)', border: '1px solid var(--translucent-slate)', borderRadius: '8px', outline: 'none' }} 
            />
          </div>

          <div className="p-3 flex-row items-center gap-2" style={{ background: '#1B2A1E', border: '1px solid rgba(0,255,85,0.3)', borderRadius: '10px' }}>
            <Activity className="text-green" size={18} />
            <span className="text-white text-xs leading-tight opacity-90">Taahhüdünüz sisteme canlı olarak işlenecektir. Umut verdiğiniz için teşekkürler.</span>
          </div>
        </div>

        <button onClick={() => {
          onSubmit({ donorName: name || "Gizli Bağışçı", bloodType, location: location || "Genel Merkez" });
          onClose();
        }} className="btn btn-primary w-full text-sm font-black tracking-wide uppercase">
          TAAHHÜDÜ ONAYLA VE GÖNDER
        </button>
      </div>
    </div>
  );
}

// --- Main Application ---

export default function App() {
  const data = usePulseData();
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isPledgeOpen, setIsPledgeOpen] = useState(false);

  return (
    <div style={{ paddingBottom: '120px' }}>
      {/* Header */}
      <header className="flex-row justify-between items-center p-4 border-b" style={{ borderColor: 'var(--translucent-slate)' }}>
        <div className="flex-row items-center gap-2">
          <HeaderPulseWave />
          <span className="text-xl font-bold tracking-tight">Kan<span className="text-crimson font-normal">Akademi</span></span>
        </div>
        <div className="flex-row items-center gap-2 px-3 py-1" style={{ background: '#1F1F1F', borderRadius: '6px' }}>
          <div className="circle animate-pulse" style={{ width: 6, height: 6, background: 'var(--live-green)' }}></div>
          <span className="text-green font-bold tracking-widest" style={{ fontSize: '9px' }}>CANLI SUNUCU</span>
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="dashboard-grid">
        <div className="col-span-full">
          <StatusTicker />
        </div>

        <div className="col-span-full mt-4">
          <HeroLiveCounter 
            globalDonations={data.globalDonations} 
            globalLivesSaved={data.globalLivesSaved} 
            turkeyDonations={data.turkeyDonations} 
            turkeyLivesSaved={data.turkeyLivesSaved} 
          />
        </div>

        <div className="col-span-full mt-4">
          <CampaignBanner />
        </div>

        <div className="col-span-full mt-4 mb-2">
          <span className="text-muted text-xs font-bold tracking-widest">KLİNİK VERİLER & İSTATİSTİKLER</span>
        </div>

        <div className="col-span-1">
          <Demographics />
        </div>
        <div className="col-span-1">
          <GlobalImpact />
        </div>
        <div className="col-span-1">
          <BloodUrgency />
        </div>
        <div className="col-span-1">
          <LivePulseActivity />
        </div>

        <div className="col-span-full mt-4 mb-2 flex-row justify-between items-center">
          <span className="text-muted text-xs font-bold tracking-widest">CANLI BAĞIŞÇI TAAHHÜTLERİ</span>
          <button onClick={() => setIsPledgeOpen(true)} className="flex-row items-center gap-1 text-crimson">
            <Plus size={16} />
            <span className="text-xs font-bold">Hemen Taahhüt Et</span>
          </button>
        </div>

        {data.pledges.slice(0, 5).map(pledge => (
          <div key={pledge.id} className="col-span-full panel flex-row items-center gap-3" style={{ padding: '12px 14px' }}>
            <div className="flex-col items-center justify-center" style={{ width: '42px', height: '42px', background: '#2E1114', border: '1px solid var(--neon-crimson)', borderRadius: '8px' }}>
              <span className="text-crimson font-black text-sm">{pledge.bloodType}</span>
            </div>
            <div className="flex-col flex-1">
              <span className="text-white font-bold text-sm line-clamp-1">{pledge.donorName}</span>
              <div className="flex-row items-center gap-1 mt-1">
                <MapPin size={10} className="text-muted" />
                <span className="text-muted text-xs line-clamp-1">{pledge.location}</span>
              </div>
            </div>
            <div className="flex-col items-end gap-1">
              <div style={{ background: '#1B2A1E', padding: '2px 6px', borderRadius: '4px' }}>
                <span className="text-green text-xs font-bold">+{pledge.units} Ünite</span>
              </div>
              <span className="text-muted" style={{ fontSize: '9px' }}>
                {Math.floor((Date.now() - pledge.timestamp) / 60000) < 1 ? 'Az önce' : `${Math.floor((Date.now() - pledge.timestamp) / 60000)} dk önce`}
              </span>
            </div>
          </div>
        ))}

        {data.pledges.length > 0 && (
          <div className="col-span-full flex-row justify-center mt-2">
            <button onClick={data.clearPledges} className="text-muted text-xs">Yerel Taahhüt Akışını Sıfırla</button>
          </div>
        )}
      </main>

      {/* Sticky Bottom CTA */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '20px', background: 'linear-gradient(to top, rgba(0,0,0,0.95), transparent)', zIndex: 40, display: 'flex', justifyContent: 'center' }}>
        <div className="flex-col gap-3 w-full" style={{ maxWidth: '500px' }}>
          <button onClick={() => window.open('https://kanver.org/', '_blank')} className="btn btn-primary w-full flex-row items-center gap-2" style={{ height: '54px' }}>
            <Heart size={20} className="text-white" />
            <span>Kızılay ile Kan Bağışı Yap</span>
          </button>
          <button onClick={() => window.open('https://kanakademi.com.tr/kan-ilani-olusturma-asistani/', '_blank')} className="btn btn-outline w-full flex-row items-center gap-2" style={{ height: '54px' }}>
            <Plus size={20} />
            <span>Kan İlanı Oluştur</span>
          </button>
        </div>
      </div>

      <EligibilityQuizModal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} onPledge={() => setIsPledgeOpen(true)} />
      <PledgeSubmissionModal isOpen={isPledgeOpen} onClose={() => setIsPledgeOpen(false)} onSubmit={data.addPledge} />
    </div>
  );
}
