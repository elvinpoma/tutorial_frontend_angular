import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Pageable } from '../core/model/page/Pageable';
import { HttpClient } from '@angular/common/http';
import { Loan } from './model/Loan';
import { PaginatedData } from '../core/model/page/PaginatedData';

/**
 * Servicio encargado de gestionar todas las operaciones relacionadas
 * con los préstamos mediante peticiones HTTP al backend.
 */

@Injectable({
  providedIn: 'root',
})

export class LoanService {
  /**
   * Cliente HTTP utilizado para realizar las llamadas al servidor.
   */
  protected readonly http = inject(HttpClient);
  
  /**
   * URL base del endpoint de préstamos.
   */

  private baseUrl = 'http://localhost:8080/loan';

  /**
   * Obtiene una lista paginada de préstamos.
   *
   * @param Pageable Información de paginación.
   * @returns Datos paginados de préstamos.
   */

  getLoans(Pageable: Pageable): Observable<PaginatedData<Loan>> {
    return this.http.post<PaginatedData<Loan>>(this.baseUrl, { pageable: Pageable });
  }

  /**
   * Obtiene préstamos aplicando filtros de búsqueda opcionales
   * por título de juego, cliente y fecha.
   *
   * @param gameTitle Título del juego.
   * @param clientId Identificador del cliente.
   * @param date Fecha del préstamo.
   * @returns Lista de préstamos filtrados.
   */

  getLoansFilt(gameTitle?: string, clientId?: number, date?: string): Observable<Loan[]> {
    console.log(this.composeFindUrl(gameTitle, clientId, date));
    return this.http.get<Loan[]>(this.composeFindUrl(gameTitle, clientId, date));
  }

  /**
   * Guarda un préstamo. Si el préstamo ya tiene identificador,
   * se actualiza; en caso contrario, se crea uno nuevo.
   *
   * @param loan Préstamo a guardar.
   * @returns Préstamo guardado.
   */

  saveLoan(loan: Loan): Observable<Loan> {
    const { id } = loan;
    const url = id ? `${this.baseUrl}/${id}` : this.baseUrl;
    return this.http.put<Loan>(url, loan);
  }

  /**
   * Elimina un préstamo a partir de su identificador.
   *
   * @param idLoan Identificador del préstamo.
   * @returns Resultado de la operación.
   */
  
  deleteLoan(idLoan: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${idLoan}`);
  }

  /**
   * Obtiene todos los préstamos registrados.
   *
   * @returns Lista completa de préstamos.
   */

  getAllLoans(): Observable<Loan[]> {
    return this.http.get<Loan[]>(this.baseUrl);
  }

  /**
   * Construye la URL de búsqueda añadiendo únicamente
   * los filtros que hayan sido informados.
   *
   * @param gameTitle Título del juego.
   * @param clientId Identificador del cliente.
   * @param date Fecha del préstamo.
   * @returns URL con los parámetros de búsqueda.
   */
  
  private composeFindUrl(gameTitle?: string, clientId?: number, date?: string): string {
    const params = new URLSearchParams();
    if (gameTitle) {
      params.set('gameTitle', gameTitle);
    }
    if (clientId) {
      params.set('idClient', clientId.toString());
    }
    if (date) {
      params.set('date', date);
    }
    const queryString = params.toString();
    return queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;
  }
}
