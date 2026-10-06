import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Pageable } from '../core/model/page/Pageable';
import { HttpClient } from '@angular/common/http';
import { Loan } from './model/Loan';
import { PaginatedData } from '../core/model/page/PaginatedData';


@Injectable({
providedIn: 'root',
})
export class LoanService {
    protected readonly http = inject(HttpClient);

    private baseUrl = 'http://localhost:8080/loan';

    getLoans(Pageable: Pageable): Observable<PaginatedData<Loan>> {
        return this.http.post<PaginatedData<Loan>>(this.baseUrl, { pageable: Pageable });
    }

    saveLoan(loan: Loan): Observable<Loan> {
        const { id } = loan;
        const url = id ? `${this.baseUrl}/${id}` : this.baseUrl;
        return this.http.put<Loan>(url, loan);
    }

    deleteLoan(idLoan: number): Observable<any> {
        return this.http.delete(`${this.baseUrl}/${idLoan}`);
    }

    getAllLoans(): Observable<Loan[]> {
        return this.http.get<Loan[]>(this.baseUrl);
    }
}
