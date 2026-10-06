import { Component, OnInit, inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Loan } from '../model/Loan';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LoanService } from '../loan';
import { MatDialog } from '@angular/material/dialog';
import { LoanEdit } from '../loan-edit/loan-edit';
import { DialogConfirmation } from '../../core/dialog-confirmation/dialog-confirmation';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Pageable } from '../../core/model/page/Pageable';

@Component({
  imports: [MatButtonModule, MatIconModule, MatTableModule, MatPaginatorModule, CommonModule],
  selector: 'app-loan-list',
  styleUrl: './loan-list.page.scss',
  templateUrl: './loan-list.page.html',
})
export class LoanList implements OnInit {
  pageNumber: number = 0;
  pageSize: number = 5;
  totalElements: number = 0;

  dataSource = new MatTableDataSource<Loan>();
  displayedColumns: string[] = ['id', 'game', 'client', 'startDate', 'endDate', 'action'];


  constructor(
    private loanService: LoanService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.loadPage();
  }

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
   * Creates a new loan.
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
   * This method is used to edit a loan.
   * @param loan
   *
   */
  editLoan(loan: Loan) {
    const dialogRef = this.dialog.open(LoanEdit, {
      data: { loan: loan },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.ngOnInit();
    });
  }
  
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
