
import React, { useState, useEffect, useCallback } from 'react';
import BottomNav from './components/BottomNav';
import SOSButton from './components/SOSButton';
import VoiceMonitor from './components/VoiceMonitor';
import SafetyMap from './components/SafetyMap';
import { Shield, Bell, User, Phone, MapPin, CheckCircle2, AlertTriangle, ShieldCheck, Plus, Trash2, Globe } from 'lucide-react';

const TRANSLATIONS: Record<string, any> = {
  en: {
    home: "Home",
    map: "Safety Map",
    contacts: "Contacts",
    settings: "Settings",
    emergency_active: "Emergency Active",
    help_on_way: "Help is on the way. Your live location is shared.",
    cancel_alert: "I am Safe - Cancel Alert",
    system_protected: "System Protected",
    voice_guardian: "Voice Guardian",
    hold_sos: "Hold SOS",
    hold_2s: "Hold 2s to Alert",
    trusted_contacts: "Trusted Contacts",
    add_new: "Add New",
    hi: "Hi"
  },
  hi: {
    home: "होम",
    map: "सुरक्षा मानचित्र",
    contacts: "संपर्क",
    settings: "सेटिंग्स",
    emergency_active: "आपातकाल सक्रिय",
    help_on_way: "मदद रास्ते में है। आपकी लोकेशन साझा की गई है।",
    cancel_alert: "मैं सुरक्षित हूँ - अलर्ट रद्द करें",
    system_protected: "सिस्टम सुरक्षित है",
    voice_guardian: "वॉयस गार्जियन",
    hold_sos: "SOS दबाएं",
    hold_2s: "अलर्ट के लिए 2s दबाएं",
    trusted_contacts: "विश्वस्त संपर्क",
    add_new: "नया जोड़ें",
    hi: "नमस्ते"
  },
  es: {
    home: "Inicio",
    map: "Mapa de Seguridad",
    contacts: "Contactos",
    settings: "Ajustes",
    emergency_active: "Emergencia Activa",
    help_on_way: "La ayuda está en camino. Tu ubicación se está compartiendo.",
    cancel_alert: "Estoy a Salvo - Cancelar Alerta",
    system_protected: "Sistema Protegido",
    voice_guardian: "Guardián de Voz",
    hold_sos: "Mantener SOS",
    hold_2s: "Mantén 2s para Alertar",
    trusted_contacts: "Contactos de Confianza",
    add_new: "Añadir Nuevo",
    hi: "Hola"
  }
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isAlertActive, setIsAlertActive] = useState(false);
  const [alertLog, setAlertLog] = useState<string[]>([]);
  const [location, setLocation] = useState<any>(null);
  const [lang, setLang] = useState('en');
  const [contacts, setContacts] = useState<any[]>(() => {
    const saved = localStorage.getItem('guardia_contacts');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Emergency Services', relation: 'Police', phone: '911' }
    ];
  });

  const t = (key: string) => TRANSLATIONS[lang][key] || key;

  useEffect(() => {
    localStorage.setItem('guardia_contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition((pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  const triggerSOS = useCallback((reason: string = 'Manual SOS') => {
    setIsAlertActive(true);
    setAlertLog([
      `[${new Date().toLocaleTimeString()}] ALERT INITIATED: ${reason}`,
      `[${new Date().toLocaleTimeString()}] Fetching high-precision GPS...`,
      `[${new Date().toLocaleTimeString()}] Sending SMS to ${contacts.length} contacts...`,
      `[${new Date().toLocaleTimeString()}] Notifying nearest police station...`,
    ]);

    // Simulate real-time updates during emergency
    const interval = setInterval(() => {
      setAlertLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] Location pinged: ${location?.lat?.toFixed(4)}, ${location?.lng?.toFixed(4)}`].slice(-6));
    }, 5000);

    return () => clearInterval(interval);
  }, [contacts, location]);

  const addContact = () => {
    const name = prompt("Contact Name:");
    const phone = prompt("Phone Number:");
    if (name && phone) {
      setContacts([...contacts, { id: Date.now().toString(), name, phone, relation: 'Friend' }]);
    }
  };

  const removeContact = (id: string) => {
    setContacts(contacts.filter(c => c.id !== id));
  };

  if (isAlertActive) {
    return (
      <div className="fixed inset-0 bg-rose-600 z-[100] flex flex-col p-6 text-white overflow-hidden">
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <Bell size={40} />
          </div>
          <h1 className="text-3xl font-black mb-2 uppercase">{t('emergency_active')}</h1>
          <p className="text-rose-100 mb-8 text-sm">{t('help_on_way')}</p>
          
          <div className="w-full bg-black/20 rounded-2xl p-4 font-mono text-[10px] text-rose-200 text-left space-y-1 mb-8">
            {alertLog.map((log, i) => (
              <div key={i} className="flex gap-2">
                <span className="text-emerald-400">✓</span>
                <span>{log}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pb-safe">
          <button
            onClick={() => setIsAlertActive(false)}
            className="w-full bg-white text-rose-600 py-4 rounded-2xl font-bold shadow-xl active:scale-95 transition-transform"
          >
            {t('cancel_alert')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-md mx-auto relative overflow-hidden shadow-2xl border-x border-slate-200">
      <header className="p-4 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg">
            <Shield className="text-white" size={18} />
          </div>
          <h1 className="font-bold text-base text-slate-800 tracking-tight">GuardiaAI</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setLang(l => l === 'en' ? 'hi' : l === 'hi' ? 'es' : 'en')} className="p-2 bg-slate-50 border border-slate-200 rounded-full text-indigo-600">
            <Globe size={18} />
          </button>
          <button className="p-2 bg-slate-100 rounded-full text-slate-600"><User size={18} /></button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        {activeTab === 'home' && (
          <div className="p-5 space-y-6 pb-24">
            <div className="bg-indigo-600 p-5 rounded-[1.5rem] text-white shadow-lg relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck size={16} className="text-emerald-400" />
                <span className="text-[10px] font-bold uppercase tracking-wider">{t('system_protected')}</span>
              </div>
              <h2 className="text-xl font-bold">{t('hi')}, Sarah</h2>
              <p className="text-indigo-100 text-xs mt-1">Safety monitoring is currently active.</p>
            </div>

            <VoiceMonitor onDistressDetected={(reason) => triggerSOS(`Voice detected: ${reason}`)} />

            <div className="py-4 flex flex-col items-center">
              <SOSButton onTrigger={() => triggerSOS('Manual SOS')} />
              <p className="text-[10px] text-slate-400 mt-6 text-center px-8 uppercase font-medium tracking-wide">
                Tap and hold for 2 seconds to alert contacts
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="p-4 bg-white rounded-xl border border-slate-200 flex flex-col items-center gap-2 shadow-sm">
                <div className="p-2.5 bg-amber-50 text-amber-600 rounded-full"><AlertTriangle size={18} /></div>
                <span className="text-[10px] font-bold text-slate-700">Fake Call</span>
              </button>
              <button className="p-4 bg-white rounded-xl border border-slate-200 flex flex-col items-center gap-2 shadow-sm" onClick={() => triggerSOS('Quick Police Call')}>
                <div className="p-2.5 bg-rose-50 text-rose-600 rounded-full"><Phone size={18} /></div>
                <span className="text-[10px] font-bold text-slate-700">Call Police</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'map' && <SafetyMap lang={lang} />}

        {activeTab === 'contacts' && (
          <div className="p-5 pb-24 space-y-5">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-slate-800">{t('trusted_contacts')}</h2>
                <p className="text-[10px] text-slate-500">Alerted immediately during emergency</p>
              </div>
              <button onClick={addContact} className="bg-indigo-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
                <Plus size={14} /> {t('add_new')}
              </button>
            </div>

            <div className="space-y-2">
              {contacts.map((c) => (
                <div key={c.id} className="p-4 bg-white rounded-xl border border-slate-200 flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 text-sm font-bold">
                      {c.name[0]}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{c.name}</h4>
                      <p className="text-[9px] text-slate-500">{c.relation} • {c.phone}</p>
                    </div>
                  </div>
                  <button onClick={() => removeContact(c.id)} className="text-slate-300 hover:text-rose-500 p-1">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="p-5 pb-24 space-y-6">
            <h2 className="text-lg font-bold text-slate-800">{t('settings')}</h2>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-50">
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold">Low Signal Optimization</h4>
                  <p className="text-[9px] text-slate-500">Prioritize SMS over Data</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-indigo-600" />
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold">AI Sensitivity</h4>
                  <p className="text-[9px] text-slate-500">Voice trigger threshold</p>
                </div>
                <select className="text-[10px] bg-slate-50 border border-slate-200 px-2 py-1 rounded">
                  <option>High</option>
                  <option selected>Medium</option>
                  <option>Low</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default App;
