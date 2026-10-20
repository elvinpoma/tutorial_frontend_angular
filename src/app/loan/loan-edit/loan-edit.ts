import { Component, inject, OnInit, signal } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoanService } from '../loan';
import { Loan } from '../model/Loan';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Game } from '../../game/model/Game';
import { Client } from '../../client/model/Client';
import { GameService } from '../../game/game';
import { ClientService } from '../../client/client';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  selector: 'app-loan-edit',
  styleUrl: './loan-edit.scss',
  templateUrl: './loan-edit.html',
})

/**
 * Componente encargado de crear y editar préstamos
 * mediante un diálogo modal.
 */

export class LoanEdit implements OnInit {

/**
 * Servicios y señales para los dialogos y la logica de la pagina  
 */

  protected readonly loanService = inject(LoanService);
  protected readonly dialogRef = inject(MatDialogRef<LoanEdit>);
  protected readonly data = inject(MAT_DIALOG_DATA);
  protected readonly gameService = inject(GameService);
  protected readonly clientService = inject(ClientService);

  protected readonly id = signal<number | null>(null);
  protected readonly gameId = signal<number | null>(null);
  protected readonly clientId = signal<number | null>(null);
  protected readonly startDate = signal<Date | null>(null);
  protected readonly endDate = signal<Date | null>(null);
  protected readonly games = signal<Game[]>([]);
  protected readonly clients = signal<Client[]>([]);

  /**
   * Inicializa el formulario con los datos recibidos,
   * en caso de edición.
   */

  ngOnInit(): void {
    this.loadFormData(this.data.loan ?? null);
  }

  /**
   * Carga los datos del préstamo en el formulario y
   * recupera la información necesaria para los desplegables.
   *
   * @param initialData Préstamo a editar o null para crear uno nuevo.
   */

  loadFormData(initialData: Loan | null): void {
    this.id.set(initialData?.id ?? null);
    this.gameId.set(initialData?.game.id ?? null);
    this.clientId.set(initialData?.client.id ?? null);
    this.startDate.set(initialData?.startDate ? new Date(initialData.startDate) : null);
    this.endDate.set(initialData?.endDate ? new Date(initialData.endDate) : null);

    this.gameService.getGames().subscribe((games) => {
      this.games.set(games);
    });

    this.clientService.getClients().subscribe((clients) => {
      this.clients.set(clients);
    });
  }

  /**
   * Convierte una fecha al formato yyyy-MM-dd,
   * requerido por el backend.
   *
   * @param date Fecha a formatear.
   * @returns Fecha en formato yyyy-MM-dd.
   */

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  } 

  /**
   * Recoge los datos introducidos en el formulario y
   * guarda el préstamo en el sistema.
   */

  onSave() {
    const id = this.id();
    const gameId = this.gameId();
    const clientId = this.clientId();
    const startDate = this.startDate();
    const endDate = this.endDate();

    if (!gameId || !clientId || !startDate || !endDate) {
      return;
    }

    const loan = {
      id,
      game: this.games().find((g) => g.id === gameId) ?? null,
      client: this.clients().find((c) => c.id === clientId) ?? null,
      startDate: this.formatDate(startDate),
      endDate: this.formatDate(endDate),
    } as Loan;

    this.loanService.saveLoan(loan).subscribe(() => {
      this.dialogRef.close(true);
    });
    console.log(JSON.stringify(loan));
  }

  /**
   * Cierra el diálogo sin guardar cambios.
   */

  onClose() {
    this.dialogRef.close(false);
  }
}
