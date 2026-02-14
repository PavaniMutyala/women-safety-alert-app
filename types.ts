
export interface Contact {
  id: string;
  name: string;
  phone: string;
  relation: string;
}

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  language: 'en' | 'hi' | 'es' | 'fr';
}

export interface Location {
  lat: number;
  lng: number;
  accuracy?: number;
}

export interface SafetyAlert {
  id: string;
  timestamp: number;
  location: Location;
  type: 'SOS' | 'VOICE_DISTRESS' | 'LOW_BATTERY';
  status: 'active' | 'resolved';
}

export interface RouteRisk {
  routeId: string;
  riskScore: number; // 0-100
  reasoning: string;
  safeAlternatives: string[];
}
