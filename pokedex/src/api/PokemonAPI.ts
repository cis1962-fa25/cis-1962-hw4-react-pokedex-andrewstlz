import type { Pokemon, BoxEntry, InsertBoxEntry, UpdateBoxEntry } from "../types/types";

export default class PokemonAPI {
  private static baseUrl = "https://hw4.cis1962.esinx.net/api";
  private static token: string | null = null;

  static setToken(token: string) {
    this.token = token;
  }

  private static get authHeaders() {
    return this.token
      ? { Authorization: `Bearer ${this.token}` }
      : {};
  }

  private static async get<T>(url: string): Promise<T> {
    const res = await fetch(`${this.baseUrl}${url}`, {
      headers: {
        "Content-Type": "application/json",
        ...this.authHeaders
      } as HeadersInit
    });

    if (!res.ok) {
      throw new Error(`GET ${url} failed: ${res.status}`);
    }

    return res.json() as Promise<T>;
  }

  private static async post<T>(url: string, body: object): Promise<T> {
    const res = await fetch(`${this.baseUrl}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this.authHeaders
      } as HeadersInit,
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      throw new Error(`POST ${url} failed: ${res.status}`);
    }

    return res.json() as Promise<T>;
  }

  private static async put<T>(url: string, body: object): Promise<T> {
    const res = await fetch(`${this.baseUrl}${url}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...this.authHeaders
      } as HeadersInit, 
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      throw new Error(`PUT ${url} failed: ${res.status}`);
    }

    return res.json() as Promise<T>;
  }

  private static async del(url: string): Promise<void> {
    const res = await fetch(`${this.baseUrl}${url}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...this.authHeaders
      } as HeadersInit
    });

    if (!res.ok) {
      throw new Error(`DELETE ${url} failed: ${res.status}`);
    }
  }

  
  static async listPokemon(limit: number, offset: number): Promise<Pokemon[]> {
    return this.get<Pokemon[]>(`/pokemon/?limit=${limit}&offset=${offset}`);
  }

  static async getPokemon(name: string): Promise<Pokemon> {
    return this.get<Pokemon>(`/pokemon/${name}`);
  }

  
  static async listBoxEntries(): Promise<string[]> {
    return this.get<string[]>(`/box/`);
  }

  static async createBoxEntry(data: InsertBoxEntry): Promise<string> {
    return this.post<string>(`/box/`, data);
  }

  static async getBoxEntry(id: string): Promise<BoxEntry> {
    return this.get<BoxEntry>(`/box/${id}`);
  }

  static async updateBoxEntry(id: string, data: UpdateBoxEntry): Promise<void> {
    return this.put<void>(`/box/${id}`, data);
  }

  static async deleteBoxEntry(id: string): Promise<void> {
    return this.del(`/box/${id}`);
  }
}
