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
export class ClientList implements OnInit {
  dataSource = new MatTableDataSource<Client>();
  displayedColumns: string[] = ['id', 'name', 'action'];

  protected readonly clientService = inject(ClientService);
  protected readonly dialog = inject(MatDialog);
  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.clientService
      .getClients()
      .subscribe((clients) => (this.dataSource.data = clients));
  }

  /**
   * Creates a new client.
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
   * This method is used to edit a client.
   * @param client
   *
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
   * This method is used to delete a client.
   * @param client
   *
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
