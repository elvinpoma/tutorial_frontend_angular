import { Component, inject, OnInit, signal } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GameService } from '../game';
import { Game } from '../model/Game';
import { AuthorService } from '../../author/author';
import { Author } from '../../author/model/Author';
import { CategoryService } from '../../category/category';
import { Category } from '../../category/model/category';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule],
  selector: 'app-game-edit',
  styleUrl: './game-edit.scss',
  templateUrl: './game-edit.html',
})
export class GameEdit implements OnInit {
    protected readonly id = signal<number | null>(null);
    protected readonly title = signal<string | null>(null);
    protected readonly age = signal<number | null>(null);
    protected readonly categoryId = signal<number | null>(null);
    protected readonly authorId = signal<number | null>(null);
    protected readonly categories = signal<Category[]>([]);
    protected readonly authors = signal<Author[]>([]);

    protected readonly dialogRef = inject(MatDialogRef<GameEdit>);
    protected readonly data = inject(MAT_DIALOG_DATA);
    protected readonly gameService = inject(GameService);
    protected readonly categoryService = inject(CategoryService);
    protected readonly authorService = inject(AuthorService);

    ngOnInit(): void {
        this.loadFormData(this.data.game ?? null);
    }

    loadFormData(initialData: Game | null): void {
        this.id.set(initialData?.id ?? null);
        this.title.set(initialData?.title ?? null);
        this.age.set(initialData?.age ?? null);

        this.categoryService.getCategories().subscribe((cats) => {
            this.categories.set(cats);
            this.categoryId.set(initialData?.category?.id ?? null);
        });

        this.authorService.getAllAuthors().subscribe((auts) => {
            this.authors.set(auts);
            this.authorId.set(initialData?.author?.id ?? null);
        });
    }

    onSave() {
        const id = this.id();
        const title = this.title(); 
        const age = this.age(); 
        const categoryId = this.categoryId(); 
        const authorId = this.authorId(); 



        if (!title || !age || !categoryId || !authorId) {
            return;
        }

        const game = {
            id,
            title,
            age,
            category: this.categories().find(c => c.id === categoryId) ?? null,
            author: this.authors().find(a => a.id === authorId) ?? null,
        } as Game;
        this.gameService.saveGame(game).subscribe(() => {
            this.dialogRef.close(true);
        });
    }

    onClose() {
        this.dialogRef.close();
    }
}