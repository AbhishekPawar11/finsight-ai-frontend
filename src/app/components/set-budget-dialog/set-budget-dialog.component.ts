import { Component, Inject } from '@angular/core';
import { MatFormField, MatLabel } from "@angular/material/input";
import { BudgetService } from '../../services/budget/budget.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MATERIAL_MODULES } from '../../material.imports';

@Component({
  selector: 'app-set-budget-dialog',
  imports: [MatFormField, MatLabel , FormsModule , ...MATERIAL_MODULES],
  template: `
    <div class="p-6">
      <h2 class="text-xl font-bold mb-4 text-gray-900">Set Budget for {{data.category}}</h2>
      <mat-form-field appearance="outline" class="w-full">
        <mat-label>Monthly Limit</mat-label>
        <span matTextPrefix>₹&nbsp;</span>
        <input matInput type="number" [(ngModel)]="limit" placeholder="0.00">
      </mat-form-field>
      
      <div class="flex justify-end gap-3 mt-4">
        <button mat-button (click)="onCancel()">Cancel</button>
        <button mat-flat-button color="primary" (click)="onSave()" [disabled]="!limit || limit <= 0">
          Save Limit
        </button>
      </div>
    </div>
  `,
  styleUrl: './set-budget-dialog.component.scss'
})
export class SetBudgetDialogComponent {
   limit!:number;
   
   constructor(private budgetService : BudgetService , private dialogRef:MatDialogRef<SetBudgetDialogComponent>,@Inject(MAT_DIALOG_DATA) public data: { category: string, currentLimit?: number }) {
     this.limit = data.currentLimit || 0;
   }

   onSave() {
    this.budgetService.setBudget(this.data.category, this.limit).subscribe(() => {
      this.dialogRef.close(true);
    });
  }

  onCancel() { this.dialogRef.close(false); }
}
