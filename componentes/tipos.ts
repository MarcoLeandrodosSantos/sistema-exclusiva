export const services = [
  'Rede de Proteção',
  'Tela Mosquiteira',
  'Varal',
  'Persianas',
  'Cerca de Piscina',
] as const;

export const paymentMethods = [
  'Dinheiro',
  'Pix',
  'Cartão de Crédito',
  'Boleto Bancario',
] as const;

export const colors = [
  'Branco',
  'Bronze',
  'Cinza',
  'Cristal',
  'Fosco',
  'Preto',
  'Marrom',
] as const;

export const initialAttendants = [
  'Thamires',
  'Marco',
  'Yasmin',
  'Sarah',
] as const;

export type Service = typeof services[number];
export type PaymentMethod = typeof paymentMethods[number] | null;
export type Color = typeof colors[number];

export interface Measurement {
  id: string;
  service: Service | '';
  color: Color | '';
  width: string;
  height: string;
  notes: string;
}

export interface Customer {
  id: string;
  nome: string;
  cpf: string;
  atendente?: string;
  endereco: string;
  numero: string;
  complemento: string;
  cep: string;
  cidade: string;
  estado: string;
  condominio: string;
  servicos: Service[];
  medidas: Measurement[];
  paymentMethod: PaymentMethod;
  creditCardInstallments?: number | null;
  totalValue?: string;
  budgetDate?: string;
  serviceDate?: string;
}

export type FilterType = 'endereco' | 'condominio' | 'budgetDate' | 'serviceDate';