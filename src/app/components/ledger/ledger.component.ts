import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { TransactionService } from '../../services/transaction/transaction.service';
import { CommonModule } from '@angular/common';
import { MATERIAL_MODULES } from '../../material.imports';
import { AddTransactionDialogComponent } from '../add-transaction-dialog/add-transaction-dialog.component';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
@Component({
  selector: 'app-ledger',
  imports: [MatPaginator , CommonModule, ...MATERIAL_MODULES],
  templateUrl: './ledger.component.html',
  styleUrl: './ledger.component.scss'
})
export class LedgerComponent implements OnInit {
isLoading = true;
  
  // Table state
  displayedColumns: string[] = ['date', 'description', 'category', 'amount', 'actions'];
  transactions: any[] = [];
  
  // Pagination state (matches Spring Boot defaults)
  totalElements = 0;
  pageSize = 10;
  currentPage = 0;
  
  //searchbar
   searchQuery:string = '';
   searchSubject:Subject<string> = new Subject<string>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private transactionService: TransactionService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadTransactions();


    this.searchSubject.pipe(
       debounceTime(500),
       distinctUntilChanged()
    ).subscribe(keyword =>{
          this.searchQuery = keyword;
          this.paginator.pageIndex = 0;
          this.loadTransactions();
    })
  }

  loadTransactions() {
    this.isLoading = true;
    this.transactionService.getTransactions(this.currentPage, this.pageSize , this.searchQuery).subscribe({
      next: (response) => {
        // Spring Boot Page object returns data in 'content' and total count in 'totalElements'
        this.transactions = response.content;
        this.totalElements = response.totalElements;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load ledger', err);
        this.isLoading = false;
      }
    });
  }

  // Triggered every time the user clicks "Next Page" or changes items per page
  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadTransactions();
  }
   
  onSearch(event:any){
      this.searchSubject.next(event.target.value);    
  }

  deleteTransaction(id: number) {
    if (confirm('Are you sure you want to delete this transaction?')) {
      this.transactionService.deleteTransaction(id).subscribe({
        next: () => {
          this.loadTransactions(); // Reload the current page
        },
        error: (err) => console.error('Delete failed', err)
      });
    }
  }

  editTransaction(transaction: any) {
   const dialogRef = this.dialog.open(AddTransactionDialogComponent, {
      width: '500px',
      disableClose: true,
      panelClass: 'rounded-xl',
      data: transaction // <--- THIS IS THE MAGIC PIECE! It passes the row data to the dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      // If result is true, the user updated the transaction, so we reload the table
      if (result) {
        this.loadTransactions();
      }
    });
  }
}
