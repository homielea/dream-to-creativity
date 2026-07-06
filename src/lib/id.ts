import { ID, ISODate } from '../types';

export function newId(): ID {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function nowISO(): ISODate {
  return new Date().toISOString();
}
