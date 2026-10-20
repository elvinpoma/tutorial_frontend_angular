import { Component, OnInit, inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Client } from '../model/Client';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ClientService } from '../client';
import { MatDialog } from '@angular/material/dialog';
import { ClientEdit } from '../client-edit/client-edit';
import { DialogConfirmation } from '../../core/dialog-confirmation/dialog-confirmation';

@Component({
  imports: [MatButtonModule, MatIconModule, MatTableModule, CommonModule],
  standalone: true,
  selector: 'app-client-list',
  styleUrl: './client-list.page.scss',
  templateUrl: './client-list.page.html',
})

/**
 * Componente encargado de mostrar, crear, editar
 * y eliminar clientes.
 */

export class ClientList implements OnInit {
  
  /**
   * Fuente de datos utilizada por la tabla de clientes.
   */
  
  dataSource = new MatTableDataSource<Client>();
  
  /**
   * Columnas que se mostrarán en la tabla.
   */

  displayedColumns: string[] = ['id', 'name', 'action'];

  /**
   * Servicio encargado de las operaciones sobre clientes.
   */

  protected readonly clientService = inject(ClientService);
  
  /**
   * Servicio utilizado para gestionar los diálogos modales.
   */

  protected readonly dialog = inject(MatDialog);
  
  /**
   * Inicializa el componente cargando los clientes disponibles.
   */

  ngOnInit(): void {
    this.loadData();
  }

  /**
   * Obtiene la lista de clientes y actualiza la tabla.
   */

  private loadData(): void {
    this.clientService.getClients().subscribe((clients) => (this.dataSource.data = clients));
  }

  /**
   * Abre el diálogo para crear un nuevo cliente.
   * Tras guardarlo, recarga la información de la tabla.
   */
  createClient() {
    const dialogRef = this.dialog.open(ClientEdit, {
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.loadData();
    });
  }

  /**
   * Abre el diálogo para editar un cliente existente.
   *
   * @param client Cliente que se desea editar.
   */

  editClient(client: Client) {
    const dialogRef = this.dialog.open(ClientEdit, {
      data: { client },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.loadData();
    });
  }

  /**
   * Muestra un diálogo de confirmación y elimina
   * el cliente seleccionado si el usuario confirma
   * la operación.
   *
   * @param client Cliente que se desea eliminar.
   */

  deleteClient(client: Client) {
    const dialogRef = this.dialog.open(DialogConfirmation, {
      data: {
        title: 'Eliminar cliente',
        description:
          'Atención si borra el cliente se perderán sus datos.<br> ¿Desea eliminar el cliente?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.clientService.deleteClient(client.id).subscribe((result) => {
          this.loadData();
        });
      }
    });
  }
}
