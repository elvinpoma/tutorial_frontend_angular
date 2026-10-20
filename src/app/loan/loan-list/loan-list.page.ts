import { Component, OnInit, inject, signal } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Loan } from '../model/Loan';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LoanService } from '../loan';
import { FormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Client } from '../../client/model/Client';
import { ClientService } from '../../client/client';
import { Game } from '../../game/model/Game';
import { GameService } from '../../game/game';
import { MatDialog } from '@angular/material/dialog';
import { LoanEdit } from '../loan-edit/loan-edit';
import { DialogConfirmation } from '../../core/dialog-confirmation/dialog-confirmation';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Pageable } from '../../core/model/page/Pageable';

@Component({
  imports: [
    CommonModule,
    FormsModule,

    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,

    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,

    MatDatepickerModule,
    MatNativeDateModule,
  ],
  selector: 'app-loan-list',
  styleUrl: './loan-list.page.scss',
  templateUrl: './loan-list.page.html',
})
export class LoanList implements OnInit {
  /**
   * Señales que se usaran en la aplicación 
   * Tanto filtros, paginados, dialogos y los datos a manipular
   */
  protected readonly loans = signal<Loan[]>([]);
  protected readonly games = signal<Game[]>([]);
  protected readonly clients = signal<Client[]>([]);
  protected readonly clientService = inject(ClientService);
  protected readonly gameService = inject(GameService);

  protected readonly filterClient = signal<Client | null>(null);
  protected readonly filterGame = signal<Game| null>(null);
  protected readonly filterDate = signal<Date | null>(null);

  protected readonly loanService = inject(LoanService);
  protected readonly dialog = inject(MatDialog);

  pageNumber: number = 0;
  pageSize: number = 5;
  totalElements: number = 0;

  dataSource = new MatTableDataSource<Loan>();
  displayedColumns: string[] = ['id', 'game', 'client', 'startDate', 'endDate', 'action'];

  /**
   * Inicializa el componente cargando la primera página
   * de préstamos y los datos necesarios para los filtros.
   */

  ngOnInit(): void {
    this.loadPage();
    this.gameService.getGames().subscribe((games) => this.games.set(games));
    this.clientService.getClients().subscribe((clients) => this.clients.set(clients));
  }

  /**
   * Limpia todos los filtros aplicados y recarga la búsqueda.
   */

  onCleanFilter(): void {
    this.filterGame.set(null);
    this.filterClient.set(null);
    this.filterDate.set(null);
    this.onSearch();
  }

  /**
   * Realiza una búsqueda de préstamos utilizando
   * los filtros seleccionados por el usuario.
   */

  onSearch(): void {
    const title = this.filterGame() != null ? this.filterGame()!.title: null;
    const clientId = this.filterClient() != null ? this.filterClient()?.id : null;
    const date = this.filterDate() ? this.filterDate().toISOString().split('T')[0] : null;
    //console.log('title:', title);
    //console.log('clientId:', clientId);
    //console.log('date:', date);

    // Comprobacion para ver si es formato Date o string console.log("Fecha:", date); luego lo pararemos a string yyy-mm-dd

    this.loanService.getLoansFilt(title, clientId, date).subscribe((loans) => {
      this.dataSource.data = loans;
    });
  }

  /**
   * Carga una página de préstamos utilizando la paginación
   * configurada actualmente o la recibida desde el paginador.
   *
   * @param event Evento de cambio de página.
   */

  loadPage(event?: PageEvent) {
    const pageable: Pageable = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      sort: [
        {
          property: 'id',
          direction: 'ASC',
        },
      ],
    };

    if (event != null) {
      pageable.pageSize = event.pageSize;
      pageable.pageNumber = event.pageIndex;
    }

    this.loanService.getLoans(pageable).subscribe((data) => {
      this.dataSource.data = data.content;
      this.pageNumber = data.pageable.pageNumber;
      this.pageSize = data.pageable.pageSize;
      this.totalElements = data.totalElements;
    });
  }

  /**
   * Abre el diálogo para crear un nuevo préstamo.
   * Tras cerrarse el diálogo se recargan los datos.
   */
  createLoan() {
    const dialogRef = this.dialog.open(LoanEdit, {
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.ngOnInit();
    });
  }

  /**
   * Abre el diálogo de edición del préstamo seleccionado.
   *
   * @param loan Préstamo que se desea editar.
   */

  editLoan(loan: Loan) {
    const dialogRef = this.dialog.open(LoanEdit, {
      data: { loan: loan },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.ngOnInit();
    });
  }

  /**
   * Muestra un diálogo de confirmación y elimina
   * el préstamo seleccionado si el usuario confirma
   * la operación.
   *
   * @param loan Préstamo que se desea eliminar.
   */

  deleteLoan(loan: Loan) {
    const dialogRef = this.dialog.open(DialogConfirmation, {
      data: {
        title: 'Eliminar préstamo',
        description: `Atención: Se eliminará el préstamo del juego ${loan.game.title} al cliente ${loan.client.name}.<br> ¿Desea continuar?`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loanService.deleteLoan(loan.id).subscribe(() => {
          this.ngOnInit();
        });
      }
    });
  }
}
