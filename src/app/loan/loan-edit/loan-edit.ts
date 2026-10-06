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

@Component({
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule ],
  selector: 'app-loan-edit',
  styleUrl: './loan-edit.scss',
  templateUrl: './loan-edit.html',
})
export class LoanEdit implements OnInit {
  protected readonly loanService = inject(LoanService);
  protected readonly dialogRef = inject(MatDialogRef<LoanEdit>);
  protected readonly data = inject(MAT_DIALOG_DATA);
  protected readonly gameService = inject(GameService);
  protected readonly clientService = inject(ClientService);

  protected readonly id = signal<number | null>(null);
  protected readonly gameId = signal<number | null>(null);
  protected readonly clientId = signal<number | null>(null);
  protected readonly startDate = signal<string | null>(null);
  protected readonly endDate = signal<string | null>(null);
  protected readonly games = signal<Game[]>([]);
  protected readonly clients = signal<Client[]>([]);

    ngOnInit(): void {
    this.loadFormData(this.data.loan ?? null);
  }
  loadFormData(initialData: Loan | null): void {
    this.id.set(initialData?.id ?? null);
    this.gameId.set(initialData?.game.id ?? null);
    this.clientId.set(initialData?.client.id ?? null);
    this.startDate.set(initialData?.startDate ?? null);
    this.endDate.set(initialData?.endDate ?? null);

    this.gameService.getGames().subscribe((games) => {
      this.games.set(games);
    });

    this.clientService.getClients().subscribe((clients) => {
      this.clients.set(clients);
    });
    
  }
  
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
      game: this.games().find(g => g.id === gameId) ?? null,
      client: this.clients().find(c => c.id === clientId) ?? null,
      startDate,
      endDate,
    } as Loan;

    this.loanService.saveLoan(loan).subscribe(() => {
      this.dialogRef.close(true);
    });
  }

  onClose() {
    this.dialogRef.close(false);
  }

}
