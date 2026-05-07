import { Component, OnInit } from '@angular/core';

import { BaseChartDirective  } from 'ng2-charts';
import { AnalyticsService } from '../../services/analytics/analytics.service';
import { CommonModule } from '@angular/common';
import { MATERIAL_MODULES } from '../../material.imports'
import { RouterLink } from '@angular/router';
import { 
  Chart, 
  DoughnutController, 
  ArcElement, 
  Tooltip, 
  Legend, 
  ChartConfiguration, 
  ChartData, 
  ChartType 
} from 'chart.js';
import { MatDialog } from '@angular/material/dialog';
import { AddTransactionDialogComponent } from '../add-transaction-dialog/add-transaction-dialog.component';
import { SetBudgetDialogComponent } from '../set-budget-dialog/set-budget-dialog.component';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

@Component({
  selector: 'app-dashboard',
  imports: [BaseChartDirective, CommonModule,...MATERIAL_MODULES,RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
   isLoading = true;
   isAiLoading = false;
   currentMonth = '';
   aiSummary = '';
   availableMonths: { value: string, label: string }[] = [];
   totalIncome = 0;
   totalExpense =0;
   netBalance = 0;
   recentTransactions:any[] = [];
   categoryBreakdown:any[] = [];

   public pieChartType:ChartType = 'doughnut';
   public pieChartData:ChartData<'doughnut',number[],string | string[]> = {
          labels:[],
          datasets:[{
              data:[],
              backgroundColor:[]
          }]
   }

   public pieChartOptions:ChartConfiguration['options'] = {
        responsive:true,
        maintainAspectRatio: false,
        plugins:{legend:{position:'right'}},
        
   }
   private chartColors = [
    '#4f46e5', '#ec4899', '#06b6d4', '#f59e0b', 
    '#10b981', '#8b5cf6', '#ef4444', '#3b82f6', '#64748b'
  ];

  constructor(private analyticsService: AnalyticsService , private dialog: MatDialog) {}

  ngOnInit(): void {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    this.currentMonth = `${year}-${month}`;

    this.generateMonthList();
    this.loadDashBoardData();
  }
     

  generateMonthList(){
     this.availableMonths = [];
     const today = new Date();
     const currentYear = today.getFullYear();
     const prevoiusYear = currentYear -1;

     let dateIerator = new Date(currentYear , today.getMonth() , 1);

     while(dateIerator.getFullYear() >= prevoiusYear){
         const year = dateIerator.getFullYear();
         const monthStr = String(dateIerator.getMonth()+1).padStart(2,'0');
         const monthName = dateIerator.toLocaleString('default' , {month: 'long'});

         this.availableMonths.push({
             value:`${year}-${monthStr}`,
             label: `${monthName} ${year}`
         })

         dateIerator.setMonth(dateIerator.getMonth() -1);
     }
  }
   
  openAddTransactionDialog(){
    const dialogRef = this.dialog.open(AddTransactionDialogComponent, {
    width: '500px',
    disableClose: true, // Forces user to use cancel/save buttons
    panelClass: 'rounded-xl' // Tailwind class for rounded corners on the modal
  });
   
  dialogRef.afterClosed().subscribe(result => {
    // If result is true, the user saved a transaction, so we refresh the dashboard
    if (result) {
      this.loadDashBoardData();
    }
  });
     
  }
  onMonthChange(newMonth:string){
     this.currentMonth = newMonth;
     this.aiSummary = '';
     this.loadDashBoardData();
  }

  loadDashBoardData(){
      this.isLoading = true;
      this.analyticsService.getDashboardData(this.currentMonth).subscribe({
          next:(data)=>{
              this.totalIncome = data.totalMonthlyIncome;
              this.totalExpense = data.totalMonthlySpend;
              this.netBalance = this.totalIncome - this.totalExpense;
              this.recentTransactions = data.recentTransactions;
              this.categoryBreakdown = data.categoryBreakdown;
              this.processChartData(data.categoryBreakdown);
              this.isLoading = false;
          },
          error:(err)=>{
             console.error('failed to load dashboard', err);
             this.isLoading = false;
          }
      })
  }

  processChartData(breakdown:any[]){
     const labels = breakdown.map(item => item.category);
     const dataValues = breakdown.map(item=>item.totalAmount);
     const backgroundColor = labels.map((_,index)=>this.chartColors[index % this.chartColors.length]);

     this.pieChartData = {
          labels:labels,
          datasets:[{
             data:dataValues,
             backgroundColor:backgroundColor,
             borderWidth:0,
             hoverOffset:4
          }]
     }

  }

  generateAiSummary(){
    this.isAiLoading = true;   
    this.aiSummary = '';

    this.analyticsService.getAiSummary(this.currentMonth).subscribe({
         next:(res)=>{
              this.aiSummary = res.summary;
              this.isAiLoading= false;
         },
         error:(err)=>{
           console.error('Failed to fetch AI summary', err);
        this.aiSummary = 'Unable to generate insights right now. Please try again later.';
        this.isAiLoading = false;
         }
    })
  }

  openSetBudget(item:any){
     const dialogRef = this.dialog.open(SetBudgetDialogComponent , {
          width: '400px',
          data: { category: item.category, currentLimit: item.limitAmount }
     })

     dialogRef.afterClosed().subscribe(result =>{
          if(result) this.loadDashBoardData();
     })
  }

  getBudgetPercentage(spent: number, limit: number): number {
    if (!limit) return 0;
    const percentage = (spent / limit) * 100;
    return Math.min(percentage, 100); // Cap at 100% visually
  }
}
