import { AppState, ImpulseItem, ItemStatus } from './types';

const STORAGE_KEY = 'impulse-buy-blocker-data';

export const getAppState = (): AppState => {
  if (typeof window === 'undefined') {
    return { items: [], totalSaved: 0 };
  }

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return { items: [], totalSaved: 0 };
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to load app state:', error);
    return { items: [], totalSaved: 0 };
  }
};

export const saveAppState = (state: AppState): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save app state:', error);
  }
};

export const addItem = (item: Omit<ImpulseItem, 'id' | 'addedAt' | 'status'>): AppState => {
  const state = getAppState();
  const newItem: ImpulseItem = {
    ...item,
    id: crypto.randomUUID(),
    addedAt: Date.now(),
    status: 'waiting',
  };
  
  const newState = {
    ...state,
    items: [...state.items, newItem],
  };
  
  saveAppState(newState);
  return newState;
};

export const updateItemStatus = (itemId: string, status: ItemStatus): AppState => {
  const state = getAppState();
  const newState = {
    ...state,
    items: state.items.map(item => 
      item.id === itemId ? { ...item, status } : item
    ),
  };
  
  saveAppState(newState);
  return newState;
};

export const markAsSaved = (itemId: string): AppState => {
  const state = getAppState();
  const item = state.items.find(i => i.id === itemId);
  
  if (!item) return state;
  
  const newState = {
    ...state,
    items: state.items.map(i => 
      i.id === itemId ? { ...i, status: 'saved' as ItemStatus } : i
    ),
    totalSaved: state.totalSaved + item.price,
  };
  
  saveAppState(newState);
  return newState;
};

export const deleteItem = (itemId: string): AppState => {
  const state = getAppState();
  const newState = {
    ...state,
    items: state.items.filter(item => item.id !== itemId),
  };
  
  saveAppState(newState);
  return newState;
};

export const getTimeRemaining = (addedAt: number): number => {
  const elapsed = Date.now() - addedAt;
  const fortyEightHours = 48 * 60 * 60 * 1000;
  return Math.max(0, fortyEightHours - elapsed);
};

export const isWaitingPeriodOver = (addedAt: number): boolean => {
  return getTimeRemaining(addedAt) === 0;
};
