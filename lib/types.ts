export type ItemStatus = 'waiting' | 'ready' | 'saved';

export interface ImpulseItem {
  id: string;
  name: string;
  price: number;
  addedAt: number; // timestamp
  status: ItemStatus;
  imageUrl?: string; // base64 or URL
  notes?: string;
}

export interface AppState {
  items: ImpulseItem[];
  totalSaved: number;
}
