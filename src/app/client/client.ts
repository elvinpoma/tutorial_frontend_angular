import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Client } from './model/Client';

@Injectable({
  providedIn: 'root',
})

/**
 * Servicio encargado de gestionar las operaciones relacionadas
 * con los clientes mediante peticiones HTTP al backend.
 */

export class ClientService {
  constructor() {}

  /**
   * Cliente HTTP utilizado para realizar llamadas al servidor.
   */
  
  protected readonly http = inject(HttpClient);

  /**
   * URL base del endpoint de clientes.
   */

  private baseUrl = 'http://localhost:8080/client';

  /**
   * Obtiene la lista completa de clientes registrados.
   *
   * @returns Lista de clientes.
   */

  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.baseUrl);
  }

  /**
   * Guarda un cliente. Si el cliente ya tiene identificador,
   * se actualiza; en caso contrario, se crea uno nuevo.
   *
   * @param client Cliente a guardar.
   * @returns Cliente guardado.
   */

  saveClient(client: Client): Observable<Client> {
    const { id } = client;
    const url = id ? `${this.baseUrl}/${id}` : this.baseUrl;
    return this.http.put<Client>(url, client);
  }

  /**
   * Elimina un cliente a partir de su identificador.
   *
   * @param idClient Identificador del cliente.
   * @returns Resultado de la operación.
   */
  
  deleteClient(idClient: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${idClient}`);
  }
}
