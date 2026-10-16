import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Game } from './model/Game';
import { HttpClient } from '@angular/common/http';

@Injectable({
providedIn: 'root',
})
export class GameService {
    protected readonly http = inject(HttpClient);

    private baseUrl = 'http://localhost:8080/game';

    getGames(gameTitle?: string, categoryId?: number): Observable<Game[]> {
        return this.http.get<Game[]>(this.composeFindUrl(gameTitle, categoryId));
    }

    saveGame(game: Game): Observable<void> {
        const { id } = game;
        const url = id ? `${this.baseUrl}/${id}` : this.baseUrl;

        return this.http.put<void>(url, game);
    }

    private composeFindUrl(gameTitle?: string, categoryId?: number): string {
        const params = new URLSearchParams();
        if (gameTitle) {
          params.set('title', gameTitle);
        }  
        if (categoryId) {
            params.set('idCategory', categoryId.toString());
        }
        const queryString = params.toString();
        return queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;
    }
}
