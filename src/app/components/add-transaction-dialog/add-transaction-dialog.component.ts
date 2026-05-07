import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { MATERIAL_MODULES } from '../../material.imports';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TransactionService } from '../../services/transaction/transaction.service';

@Component({
  selector: 'app-add-transaction-dialog',
  imports: [CommonModule, ...MATERIAL_MODULES, FormsModule, ReactiveFormsModule],
  templateUrl: './add-transaction-dialog.component.html',
  styleUrl: './add-transaction-dialog.component.scss'
})
export class AddTransactionDialogComponent implements OnInit {
transactionForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  isEditMode = false;

  availableCategories = [
    'Food', 'Groceries', 'Transfer', 'Travel', 
    'Utilities', 'Entertainment', 'Medical', 'Shopping', 'Others'
  ];

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private dialogRef: MatDialogRef<AddTransactionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Initialize the form, defaulting the date to today
    this.transactionForm = this.fb.group({
      date: [new Date(), Validators.required],
      description: ['', [Validators.required, Validators.minLength(3)]],
      amount: ['', [Validators.required, Validators.min(0.01)]], // Only positive numbers
      category: ['', Validators.required],
      type: ['debited', Validators.required], // 'debited' for expense, 'credited' for income
    });
  }


  ngOnInit(): void {
      if(this.data){
          this.isEditMode = true;
          
      // Parse the 'YYYY-MM-DD' string back into a JavaScript Date object for the Datepicker
      // Note: We append 'T00:00:00' to prevent timezone shifting bugs
      const parsedDate = new Date(this.data.date + 'T00:00:00');

      // Pre-fill the form
      this.transactionForm.patchValue({
        date: parsedDate,
        description: this.data.description,
        amount: Math.abs(this.data.amount), // Always show positive in the input field
        category: this.data.category,
        type: this.data.transactionType
      });
      }
  }

  onSubmit() {
    if (this.transactionForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    // Format the date to YYYY-MM-DD for the backend
    const formValue = this.transactionForm.value;
    const formattedDate = this.formatDate(formValue.date);
    const payload = {
      date: formattedDate,
      description: formValue.description,
      amount: formValue.amount,
      category: formValue.category,
      transactionType:formValue.type,
      confidence : 'HIGH'
    };
     
    if(this.isEditMode){
       this.transactionService.updateTransaction(this.data.id, payload).subscribe({
        next: () => {
          this.isLoading = false;
          this.dialogRef.close(true); 
        },
        error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to edit transaction. Please try again.';
        console.error(err);
        }
      });
    }else{
       this.transactionService.addTransaction(payload).subscribe({
      next: () => {
        this.isLoading = false;
        // Close the modal and pass 'true' to let the dashboard know data changed
        this.dialogRef.close(true); 
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to save transaction. Please try again.';
        console.error(err);
      }
    });
    }
    
  }

  onCancel(): void {
    this.dialogRef.close(false); // Close without saving
  }

  // Helper to convert JS Date to YYYY-MM-DD
  private formatDate(date: Date): string {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }
}
