import { Component, OnDestroy } from '@angular/core';
import { TransactionService } from '../../services/transaction/transaction.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MATERIAL_MODULES } from '../../material.imports'
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-upload',
  imports: [CommonModule, ...MATERIAL_MODULES , FormsModule],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss'
})
export class UploadComponent implements OnDestroy {
    currentStep:1 |2 = 1;
    isLoading = false;
    errorMessage = '';
    isUploading:boolean = false;
    selectedFile:File | null = null;
    pdfPassword = '';
    transactions:any[] = [];
     
    
    availableCategories = [
      'Food', 'Groceries', 'Transfer', 'Travel', 
    'Utilities', 'Entertainment', 'Medical', 'Shopping', 'Others'
    ];
    
    aiLoadingMessages: string[] = [
    'Scanning document structure...',
    'Extracting raw transactions...',
    'AI is analyzing merchant names...',
    'Applying smart categorization...',
    'Calculating confidence scores...',
    'Double-checking the math...',
    'Almost there, finalizing your ledger...'
  ];  

    currentLoadingMessage:string = this.aiLoadingMessages[0];
     private messageInterval:any;

    constructor(private transactionService:TransactionService , private router:Router){}

    onFileSelected(event:any){
        const file:File = event.target.files[0];
        if(file && file.type == 'application/pdf'){
           this.selectedFile = file;
        }else{
           this.errorMessage = 'Please select a valid PDF file.';
           this.selectedFile = null;
        }
    }

    processAI(){
         if(!this.selectedFile) return;
         this.isLoading = true;
         this.errorMessage = '';
         this.startUploadLoading();
         this.transactionService.uploadStatement(this.selectedFile,this.pdfPassword).subscribe({
          next:(data)=>{
             this.stopUploadLoading();
            this.transactions = data.map(tx => ({
               ...tx,
               originalCategory:tx.category
            })) 
            this.isLoading = false;
            this.currentStep = 2;
          },
          error: (err)=>{
            this.stopUploadLoading();
               this.isLoading = false;
               this.errorMessage = 'Failed to process statement.';
               console.error(err);
          }
          
         });
    }

    confirmAndSave(){
         this.isLoading = true;
  
        const payload = this.transactions.map(tx =>({
           date: tx.date,
          description: tx.description,
          amount: tx.amount,
          confidence: tx.confidence,
          category: tx.category,              
          originalCategory: tx.originalCategory,
          transactionType: tx.transactionType
        }))
        
        this.transactionService.confirmTransactions(payload).subscribe({
             next:() =>{
                 this.isLoading = false;
                 this.router.navigate(['/dashboard']);
             },
             error:(err)=>{
                 this.isLoading = false;
                 this.errorMessage = 'Failed to save transactions.';
                 console.error(err);
             }
        })
    }

    onCateogryChange(newCategory:string , changedTx:any){
         changedTx.category = newCategory;
         
         this.transactions.forEach(tx =>{
              if(tx.description == changedTx.description){
                  tx.category = newCategory;
                  tx.confidence = "HiGH";
              }
         })
    }

    startUploadLoading(){
         this.isUploading = true;
         this.currentLoadingMessage = this.aiLoadingMessages[0];
         let messageIndex = 0;
         
         this.messageInterval = setInterval(()=>{
              messageIndex++;
            if(messageIndex < this.aiLoadingMessages.length){
                   this.currentLoadingMessage = this.aiLoadingMessages[messageIndex];
            }
        
         }, 3500); 
    }

    stopUploadLoading(){
        this.isUploading = false;
        if (this.messageInterval) {
      clearInterval(this.messageInterval);
    }
    }

    ngOnDestroy() {
    this.stopUploadLoading();
  }
}
