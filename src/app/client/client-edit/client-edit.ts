import { Component, OnInit, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClientService } from '../client';
import { Client } from '../model/Client';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { validateFields } from '../../core/helpers/validation';

@Component({
  selector: 'app-client-edit',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
  ],
  templateUrl: './client-edit.html',
  styleUrl: './client-edit.scss',
})

/**
 * Componente encargado de crear y editar clientes
 * mediante un diálogo modal.
 */

export class ClientEdit implements OnInit {

  /**
   * Servicios, referencias, datos recibidos y señales para la pagina
   */
  protected readonly dialogRef = inject(MatDialogRef<ClientEdit>);
  protected readonly data = inject(MAT_DIALOG_DATA) as { client: Client };
  protected readonly clientService = inject(ClientService);

  protected readonly id = signal<number | null>(null);
  protected readonly name = signal<string | null>(null);

  /**
   * Inicializa el formulario cargando los datos del cliente
   * cuando se realiza una edición.
   */

  ngOnInit(): void {
    this.loadFormData(this.data.client ?? null);
  }

  /**
   * Carga los datos del cliente recibido en el formulario.
   *
   * @param initialData Cliente a editar o null para crear uno nuevo.
   */

  loadFormData(initialData: Client | null): void {
    this.id.set(initialData?.id ?? null);
    this.name.set(initialData?.name ?? null);
  }

  /**
   * Valida los datos introducidos y guarda el cliente
   * en el sistema.
   */

  onSave() {
    const id = this.id();
    const name = this.name();

    const requiredFields = ['id', 'name'] as const;
    const data = { id, name };

    if (!validateFields(data, requiredFields)) {
      return;
    }

    const client = { id, name } as Client;
    this.clientService.saveClient(client).subscribe(() => {
      this.dialogRef.close(true);
    });
  }

  /**
   * Cierra el diálogo sin guardar cambios.
   */
  
  onClose() {
    this.dialogRef.close();
  }
}
