import { Component, inject, OnInit, signal } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthorService } from '../author';
import { Author } from '../model/Author';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'app-author-edit',
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule ],
    templateUrl: './author-edit.html',
    styleUrl: './author-edit.scss',
})
export class AuthorEdit implements OnInit {
    protected readonly authorService = inject(AuthorService);
    protected readonly dialogRef = inject(MatDialogRef<AuthorEdit>);
    protected readonly data = inject(MAT_DIALOG_DATA)

    protected readonly id = signal<number | null>(null);
    protected readonly name = signal<string | null>(null);
    protected readonly nationality = signal<string | null>(null);

    loadFormData(initialData: Author | null): void {
        this.id.set(initialData?.id ?? null);
        this.name.set(initialData?.name ?? null);
        this.nationality.set(initialData?.nationality ?? null);
    }

    ngOnInit(): void {
        this.loadFormData(this.data.author ?? null);
    }

    onSave() {
        const id = this.id();
        const name = this.name()?.trim();
        const nationality = this.nationality()?.trim();
        /**
         * Aqui improvise porque el ValidateFields, pues como que en el tutoria no existe, o por los momentos no lo he visto, entonces para no complicarme la vida, hice una validacion simple, que si el nombre o la nacionalidad estan vacios, no hace nada y no guarda el autor.
         */
        if (!name || !nationality) {
            return;
        }

        const author = {
            id,
            name,
            nationality,
        } as Author;

        this.authorService.saveAuthor(author).subscribe(() => {
            this.dialogRef.close(true);
        });
    }

    onClose() {
        this.dialogRef.close(false);
    }
}
