import { Component, OnInit, inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Category } from '../model/category';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CategoryService } from '../category';
import { MatDialog } from '@angular/material/dialog';
import { CategoryEdit } from '../category-edit/category-edit';
import { DialogConfirmation } from '../../core/dialog-confirmation/dialog-confirmation';
@Component({
  imports: [MatButtonModule, MatIconModule, MatTableModule, CommonModule],
  selector: 'app-category-list',
  styleUrl: './category-list.page.scss',
  templateUrl: './category-list.page.html',
})
export class CategoryList implements OnInit {
  dataSource = new MatTableDataSource<Category>();
  displayedColumns: string[] = ['id', 'name', 'action'];

  protected readonly categoryService = inject(CategoryService);
  protected readonly dialog = inject(MatDialog);
  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.categoryService
      .getCategories()
      .subscribe((categories) => (this.dataSource.data = categories));
  }

  /**
   * Creates a new category.
   */
  createCategory() {
    const dialogRef = this.dialog.open(CategoryEdit, {
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.loadData();
    });
  }

  /**
   * This method is used to edit a category.
   * @param category
   *
   */


  editCategory(category: Category) {
    const dialogRef = this.dialog.open(CategoryEdit, {
      data: { category },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.loadData();
    });
  }

  /**
   * This method is used to delete a category.
   * @param category
   *
   */

  deleteCategory(category: Category) {
    const dialogRef = this.dialog.open(DialogConfirmation, {
      data: {
        title: 'Eliminar categoría',
        description:
          'Atención si borra la categoría se perderán sus datos.<br> ¿Desea eliminar la categoría?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.categoryService.deleteCategory(category.id).subscribe((result) => {
          this.loadData();
        });
      }
    });
  }
}
