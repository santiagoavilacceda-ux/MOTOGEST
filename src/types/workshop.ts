export interface Client {
  id: string;
  name: string;
  documentId: string; // CC / Identificación en monospace
  phone: string;
  email: string;
  address?: string;
}

export interface Motorcycle {
  plate: string; // Monospace (ABC-12D)
  brand: string;
  model: string;
  cylinderCapacity: string; // e.g., 321cc
  year: number;
  vin: string; // Monospace
  color: string;
}

export interface Mechanic {
  id: string;
  name: string;
  role: string;
  specialty: string;
  avatarUrl: string;
  activeOrders: number;
  rating: number;
  available: boolean;
}

export interface InspectionPhoto {
  id: string;
  title: string;
  subtitle: string;
  category: 'odometer' | 'scratch' | 'fairing' | 'tire' | 'custom';
  imageUrl: string;
  timestamp: string;
  tags?: string[];
}

export interface DamageMarker {
  id: string;
  x: number; // percentage
  y: number; // percentage
  zone: 'Tanque' | 'Tubo de Escape' | 'Cúpula Frontal' | 'Tren Delantero' | 'Chasis' | 'Cola / Stop';
  type: 'rayón' | 'abolladura' | 'desgaste' | 'sin daño';
  note: string;
}

export interface WorkOrder {
  id: string; // #OS-1045
  client: Client;
  motorcycle: Motorcycle;
  odometerKm: number;
  fuelLevel: '1/4' | '1/2' | '3/4' | 'Full';
  issuesReport: string;
  symptoms: string[];
  assignedMechanicId: string;
  priority: 'Normal' | 'Urgente' | 'Express';
  serviceType: 'Mantenimiento Preventivo' | 'Correctivo / Fallas' | 'Diagnóstico' | 'Revisión Garantía';
  photos: InspectionPhoto[];
  damageMarkers: DamageMarker[];
  checklist: {
    helmet: boolean;
    keys: boolean;
    documents: boolean;
    tools: boolean;
    mirrors: boolean;
  };
  advisor: string;
  status: 'Ingresada' | 'En Diagnóstico' | 'En Reparación' | 'Esperando Repuestos' | 'En Pruebas' | 'Lista para Entrega';
  createdAt: string;
  estimatedDelivery: string;
  estimatedCost: number;
}

export interface WarrantyItem {
  id: string;
  orderNumber: string; // #OS-1020, #OS-0980
  completionDate: string; // 24/Oct/2026
  daysAgo: number;
  jobsDone: string;
  partsReplaced: string[];
  mechanicName: string;
  mechanicRole: string;
  warrantyTotalDays: number;
  remainingDays: number;
  status: 'vigente' | 'vencida';
  deliveryPhotos: {
    title: string;
    description: string;
    imageUrl: string;
  }[];
  plate: string;
  clientName: string;
  clientPhone: string;
  bikeModel: string;
}

export interface WarrantyClaim {
  id: string;
  warrantyItemId: string;
  orderNumber: string;
  plate: string;
  reason: string;
  clientSymptoms: string;
  urgency: 'Alta' | 'Media';
  assignedMechanicId: string;
  status: 'Radicada' | 'En Revisión Técnica' | 'Garantía Aprobada' | 'Rechazada';
  createdAt: string;
}
