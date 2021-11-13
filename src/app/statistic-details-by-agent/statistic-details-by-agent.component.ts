import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { AppComponent } from '../app.component';
import { GetStatisticAgentDetailsDto } from '../model/get-statistic-agent-details-dto';
import { GetStatisticDetailsDto } from '../model/get-statistic-details-dto';
import { GetStatisticDetailsResponse } from '../model/get-statistic-details-response';
import { StatisticPaymentDto } from '../model/statistic-payment-dto';
import { StatisticDetailsService } from '../service/statistic-details.service';
interface Post {
  dateFrom: Date;
  dateTo: Date;
}
@Component({
  selector: 'app-statistic-details-by-agent',
  templateUrl: './statistic-details-by-agent.component.html',
  styleUrls: ['./statistic-details-by-agent.component.css']
})
export class StatisticDetailsByAgentComponent implements OnInit {
  userDetails: any;
  statisticDetailAgentForm: FormGroup;
  monthNames = [];
  startDate: string;
  endDate: string;
  statisticResponse = new GetStatisticDetailsResponse();
  agentDetails : GetStatisticAgentDetailsDto;
  agentDetails1 : GetStatisticAgentDetailsDto;
  statisticAgentDetailList: GetStatisticAgentDetailsDto[]=[];
  statisticForAgentDetailList: GetStatisticAgentDetailsDto[] = [];
  
  agentNameArrays : GetStatisticAgentDetailsDto[] = [];
  statisticPaymentList: GetStatisticDetailsDto[] = [];
  statisticPaymentListByAgent: GetStatisticDetailsDto[] = [];
  statisticsListByMonth: GetStatisticDetailsDto[] = [];
  paymentDto: StatisticPaymentDto[] = [];
  regularPaymentList: StatisticPaymentDto[] = [];
  cashieringPaymentList: StatisticPaymentDto[] = [];
  lossMitPaymentList: StatisticPaymentDto[] = [];
  bankRuptcyPaymentList: StatisticPaymentDto[] = [];
  collectionPaymentList: StatisticPaymentDto[] = [];
  agentNames = [];
  monthTotalAmount = [];
  monthTotalCount = [];
  grandTotalAmount: number;
  grandTotalNumber: number;
  grandTotalNum : number;
  grandTotalYear: any;
  selectedMonth: string;
  selectedDate: string;
  selectedAgent: string;
  post: Post = {
    dateFrom: new Date(Date.now()),
    dateTo: new Date(Date.now())
  }
  expandedIndex: number;
  agentexpandedIndex: number;
  expandedIndexForAgent: number;
  //agentexpandedIndex: number;
  isExpanded = false;
  isExpandedAgent = false;
  monthForSelectedRow: string;
  agentForSelectedRow: string;
  dateForSelectedRow: string;
  isAllSelectedWithGrandTotal = false;
  isAllSelectedWithMonth = false;
  isRegSelectedWithMonth = false;
  isLmSelectedWithMonth = false;
  isBkSelectedWithMonth = false;
  isCshSelectedWithMonth = false;
  isColSelectedWithMonth = false;
  isAgentSelectedWithMonth = false;

  isAllSelectedWithDate = false;
  isRegSelectedWithDate = false;
  isLmSelectedWithDate = false;
  isBkSelectedWithDate = false;
  isCshSelectedWithDate = false;
  isColSelectedWithDate = false;
  isAgentSelectedWithDate = false;

 
  regularPaymentCount: number;
  regularPaymentAmount: number;
  cashieringPaymentCount: number;
  cashieringPaymentAmount: number;
  lossMitPaymentCount: number;
  lossMitPaymentAmount: number;
  bankRuptcyPaymentCount: number;
  bankRuptcyPaymentAmount: number;
  collectionPaymentCount: number;
  collectionPaymentAmount: number;

  waiveFeesCashieringCount : number;
  waiveFeesCollectionsCount: number;
  waiveFeesRegularPaymentCount: number;
  waiveFeesBankruptcyCount: number;
  waiveFeesLossMitCount: number;

  PmtTypetotalPaymentCount: number;
  AdviceTypetotalPaymentCount: number;
  totalWaiveFeesAmount : number;
  agentDateArr = [];
  agentMonthName = '';

  adviceCash : boolean;
  adviceBank : boolean;
  adviceColl : boolean;
  adviceLossMit : boolean;
 
  paymentCash : boolean;
  paymentBank : boolean;
  paymentColl : boolean;
  paymentLossMit : boolean;
  paymentReg : boolean;

  cashieringAdviceCount: number;
  lossMitAdviceCount: number;
  bankRuptcyAdviceCount: number;
  collectionAdviceCount: number;
  
  constructor(private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private router: Router,private appComp: AppComponent, private statisticDetailsService: StatisticDetailsService) { }

  ngOnInit() {

    this.statisticDetailAgentForm = this.formBuilder.group({
      dateFrom: [formatDate(this.post.dateFrom, 'yyyy-MM-dd', 'en'), [Validators.required]],
      dateTo: [formatDate(this.post.dateTo, 'yyyy-MM-dd', 'en'), [Validators.required]]
    });
    
    this.userDetails = JSON.parse(sessionStorage.getItem('userDetails'));

    this.adviceCash =true;
    this.adviceBank =true;
    this.adviceColl = true;
    this.adviceLossMit =true;
    
    
    this.paymentCash =true;
    this.paymentBank =true;
    this.paymentColl = true;
    this.paymentLossMit =true;
    this.paymentReg =true;
  }
  

  getPaymentAdviceType(paymentType: string, event): void {
    if(paymentType==='paymentCash'){
      this.paymentCash = event.target.checked;
    }
    if(paymentType==='paymentBank'){
      this.paymentBank = event.target.checked;
    }
    if(paymentType==='paymentColl'){
      this.paymentColl = event.target.checked;
    }
    if(paymentType==='paymentLossMit'){
      this.paymentLossMit = event.target.checked;
    }
    if(paymentType==='paymentReg'){
      this.paymentReg = event.target.checked;
    }
  }

  getAdviceType(adviceType: string, event): void {
    if(adviceType==='adviceCash'){
      this.adviceCash = event.target.checked;
    }
    if(adviceType==='adviceBank'){
      this.adviceBank = event.target.checked;
    }
    if(adviceType==='adviceColl'){
      this.adviceColl = event.target.checked;
    }
    if(adviceType==='adviceLossMit'){
      this.adviceLossMit = event.target.checked;
    }
  }


  getOrderType(orderType: string): void {
   }

   onSubmit() {
    // this.expandRow(0,"");
    this.agentexpandedIndex = -1;
    this.cashieringPaymentCount = 0;
    this.regularPaymentCount = 0;
    this.lossMitPaymentCount = 0;
    this.bankRuptcyPaymentCount = 0;
    this.collectionPaymentCount = 0;

    this.cashieringAdviceCount = 0;
    this.lossMitAdviceCount=0;
    this.bankRuptcyAdviceCount=0;
    this.collectionAdviceCount=0;
    this.PmtTypetotalPaymentCount = 0;

    this.waiveFeesCashieringCount = 0;
    this.waiveFeesCollectionsCount = 0;
    this.waiveFeesRegularPaymentCount = 0; 
    this.waiveFeesBankruptcyCount = 0;
    this.waiveFeesLossMitCount = 0;


    this.AdviceTypetotalPaymentCount =0;
    this.totalWaiveFeesAmount = 0;
     let fromDate = new Date(this.statisticDetailAgentForm.get('dateFrom').value);
     let toDate = new Date(this.statisticDetailAgentForm.get('dateTo').value);
     
     this.monthNames = [];
     this.agentNames = [];
     const format = 'MM/dd/yyyy';
     const locale = 'en-US';
     //fromDate = (this.statisticDetailForm.get('dateFrom').value);
     console.log('#########', fromDate);
 
     var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
     //var d = new Date();
     var fromMonthName = months[fromDate.getMonth()]; // "July" (or current month)
     var fromYear = fromDate.getUTCFullYear();
 
     var toMonthName = months[toDate.getMonth()]; // "July" (or current month)
     var toYear = toDate.getUTCFullYear();
 
     console.log('monthName  ', fromMonthName, 'year ', fromYear);
     console.log('toMonthName  ', toMonthName, 'toYear ', toYear);

     this.startDate = formatDate(fromDate, format, locale);
    console.log('formattedFromDate', this.startDate)

    this.endDate = formatDate(toDate, format, locale);
    console.log('formattedToDate', this.endDate);


    var startDate = moment(fromDate, 'DD-MMMM-YYYY');
    var endDate = moment(toDate, 'DD-MMMM-YYYY');
    var iterationDate = startDate.clone().add(-1, 'month');
    console.log('monthNames ', this.monthNames);
    console.log("start**************"+this.startDate, 'endDate***********:', this.endDate);
    this.appComp.showProgressBar(true);

    // this.statisticDetailsService.getStatisticDetails(this.startDate, this.endDate).subscribe(
    //   statisticRes => {
    //     this.statisticResponse = statisticRes;
    //     if (this.statisticResponse.isSuccessful) {
    //       this.grandTotalYear = moment(this.startDate, 'MM/DD/YYYY').format("YYYY");
    //       console.log('paymnetProcessingRes  ', this.statisticResponse);
    //       this.grandTotalAmount = 0;
    //       this.grandTotalNumber = 0;
    //       this.statisticPaymentList = this.statisticResponse.statisticPaymentList
    //       this.statisticPaymentList.forEach(stPayment => {
    //         this.grandTotalAmount = this.grandTotalAmount + stPayment.totalPayment;
            
    //         stPayment.monthName = moment(stPayment.date, 'MM/DD/YYYY').format("MMMM YYYY");
    //         if(stPayment.paymentDto!==null){
    //           this.grandTotalNum=0;
    //         stPayment.paymentDto.forEach(stPaymentDto => {
    //           this.grandTotalNum+= 1;
    //         });
    //         this.grandTotalNumber+= this.grandTotalNum;
    //       }
    //       if(this.agentDateArr.indexOf(stPayment.dateAgent) == -1) {
    //         this.agentDateArr.push(stPayment.dateAgent);
    //      }
    //       })
    //       this.statisticPaymentListByAgent.push();
    //       console.log('this.agentDateArr11111111111', this.agentDateArr);
    //       console.log('statisticPaymentList', this.statisticPaymentList);
    //       console.log("this.grandTotalNumber***** : "+this.grandTotalNumber);
    //       this.appComp.showSuccessMessage(this.statisticResponse.message, null, false);
    //     } else {
    //       this.appComp.showErrorMessage(this.statisticResponse.message, null, false);
    //     }

    //     while (+(iterationDate.add(1, 'month')) < +endDate.endOf('month')) this.monthNames.push(iterationDate.format('MMMM YYYY'));
    //     this.monthTotalAmount = [];
    //     this.monthTotalCount = [];
    //     this.agentNames =[];
    //     this.monthNames.forEach(element => {
    //       var monthTotalamt = 0
    //       var monthTotalCount = 0;
    //       this.statisticPaymentList.filter(sts => sts.monthName === element).forEach(st => {
    //         monthTotalamt = +monthTotalamt + st.totalPayment;
    //         monthTotalCount = +monthTotalCount + st.paymentCount;
           
    //       }
    //       )
         
    //       this.monthTotalAmount.push(monthTotalamt);
    //       this.monthTotalCount.push(monthTotalCount);
    //     });

    //   }
    // )

    this.statisticDetailsService.getStatisticDetails(this.startDate, this.endDate).subscribe(
      statisticRes => {
       
        this.statisticResponse = statisticRes;
        if (this.statisticResponse.isSuccessful) {
          this.grandTotalYear = moment(this.startDate, 'MM/DD/YYYY').format("YYYY");
          console.log('paymnetProcessingRes  ', this.statisticResponse);
          this.grandTotalAmount = 0;
          this.grandTotalNumber = 0;
          this.statisticPaymentList = this.statisticResponse.statisticPaymentList
          this.statisticPaymentList.forEach(stPayment => {
            this.grandTotalAmount = this.grandTotalAmount + stPayment.totalPayment;
            
            stPayment.monthName = moment(stPayment.date, 'MM/DD/YYYY').format("MMMM YYYY");
            if(stPayment.paymentDto!==null){
              this.grandTotalNum=0;
            stPayment.paymentDto.forEach(stPaymentDto => {
              this.grandTotalNum+= 1;
              this.agentDetails = new GetStatisticAgentDetailsDto();
              this.agentDetails.agentName = stPaymentDto.agentName;
              this.agentDetails.date = stPayment.date;
               this.agentDetails.dateAgent = moment(stPayment.date, 'MM/DD/YYYY').format('MM/DD/YYYY');
              this.agentDetails.monthName = stPayment.monthName;
              this.agentDetails.paymentCount = stPayment.paymentCount;
              this.agentDetails.adviceName = stPaymentDto.adviceName;
              this.agentDetails.waiveFee = stPaymentDto.waiveFee;
             
            });
            this.grandTotalNumber+= this.grandTotalNum;

          }
      
          });
            
          console.log('statisticPaymentList', this.statisticPaymentList);
          console.log("this.grandTotalNumber***** : "+this.grandTotalNumber);
          this.appComp.showSuccessMessage(this.statisticResponse.message, null, false);
        } else {
          this.appComp.showErrorMessage(this.statisticResponse.message, null, false);
        }
        while (+(iterationDate.add(1, 'month')) < +endDate.endOf('month')) this.monthNames.push(iterationDate.format('MMMM YYYY'));
        this.monthTotalAmount = [];
        this.monthTotalCount = [];
        this.agentNames =[];
        this.monthNames.forEach(element => {
          var monthTotalamt = 0
          var monthTotalCount = 0;
          this.statisticPaymentList.filter(sts => sts.monthName === element).forEach(st => {
            monthTotalamt = +monthTotalamt + st.totalPayment;
            monthTotalCount = +monthTotalCount + st.paymentCount;
            this.statisticPaymentListByAgent.push(st);
            st.paymentDto.forEach(stPayment=>{
              if (stPayment.adviceName === 'Regular Payment') {
                this.regularPaymentCount = this.regularPaymentCount+1;
                if(stPayment.waiveFee !==0){
                  this.waiveFeesCashieringCount =+this.waiveFeesCashieringCount+1; 
                }
                this.regularPaymentList.push(stPayment);
              } else if (stPayment.adviceName === 'Cashiering') {
                this.cashieringPaymentCount = this.cashieringPaymentCount+1;
                this.cashieringPaymentList.push(stPayment);
              } else if (stPayment.adviceName === 'Loss Mit') {
                this.lossMitPaymentCount = this.lossMitPaymentCount+1;
                this.lossMitPaymentList.push(stPayment);
              } else if (stPayment.adviceName === 'Bankruptcy') {
                this.bankRuptcyPaymentCount = this.bankRuptcyPaymentCount+1;
                this.bankRuptcyPaymentList.push(stPayment);
              } else if (stPayment.adviceName === 'Collections') {
                this.collectionPaymentCount = this.collectionPaymentCount+1;
                this.collectionPaymentList.push(stPayment);
              }
            });
           
          }
          )
          this.PmtTypetotalPaymentCount = this.regularPaymentCount+this.cashieringPaymentCount+this.lossMitPaymentCount+this.bankRuptcyPaymentCount+this.collectionPaymentCount;
          this.monthTotalAmount.push(monthTotalamt);
          this.monthTotalCount.push(monthTotalCount);
        });

      }
    )
   
        

    this.statisticPaymentList.forEach(stsDet => {
      console.log("stsDet.paymentDto 555555555 :"+stsDet.paymentDto)
      if(stsDet.paymentDto!==null && stsDet.paymentDto.length){
      stsDet.paymentDto.forEach(pdto => {
        if (pdto.adviceName === 'Regular Payment') {
          this.regularPaymentAmount = this.regularPaymentAmount + pdto.totalPayment;
          this.regularPaymentList.push(pdto);
        } else if (pdto.adviceName === 'Cashiering') {
          this.cashieringPaymentAmount = this.cashieringPaymentAmount + pdto.totalPayment;
          this.cashieringPaymentList.push(pdto);
        } else if (pdto.adviceName === 'Loss Mit') {
          this.lossMitPaymentAmount = this.lossMitPaymentAmount + pdto.totalPayment;
          this.lossMitPaymentList.push(pdto);
        } else if (pdto.adviceName === 'Bankruptcy') {
          this.bankRuptcyPaymentAmount = this.bankRuptcyPaymentAmount + pdto.totalPayment;
          this.bankRuptcyPaymentList.push(pdto);
        } else if (pdto.adviceName === 'Collections') {
          this.collectionPaymentAmount = this.collectionPaymentAmount + pdto.totalPayment;
          this.collectionPaymentList.push(pdto);
        }
      }
   
      )
    }
    });

   }

  
   highlightRowforMonth(month) {
 
    this.selectedMonth = month;
    this.selectedDate = '';
    this.selectedAgent = '';
   // this.activeButton = 'All'
   // this.isAllSelectedWithMonth = true;
   // this.isAllClickedWithMonthTotal(month);
  }
 

  expandRow(index: number, month: string): void {

    console.log("check index : "+index+"    "+month);
    this.isExpanded = !this.isExpanded;
    if (this.isExpanded) {console.log("Inn");
      this.monthForSelectedRow = month;
    } else {console.log("Out");;
      this.monthForSelectedRow = '';
    }
    this.expandedIndex = index === this.expandedIndex ? -1 : index;
    
  //  this.getAgentNameForSpecificMonth(month);
  }
  expandRowAgent(index: number, agent: string, agentMonthName: string, date: string): void {
   //alert(index+" : "+agent+" : "+agentMonthName+" : "+date);
    this.isExpandedAgent = !this.isExpandedAgent;
    if (this.isExpandedAgent) {
      this.agentForSelectedRow = agent;
    } else {
      this.agentForSelectedRow = '';
    }
    
    this.agentexpandedIndex = index === this.agentexpandedIndex ? -1 : index;
    this.selectedMonth = '';
    this.selectedDate = '';
    this.monthForSelectedRow=''
    
   
   // this.getDateForAgent(agent,agentMonthName,date);
  }
  highlightRowforDate(date: string, month) {
  
    this.isExpanded=true;
    this.monthForSelectedRow=month;
    this.selectedMonth = '';
    this.selectedDate = date;
   // this.activeButton = 'All'
    // this.isAllSelectedWithDate = true;
    // this.isAllClickedWithDate(date);
  }

  highlightRowforAgent(index: number,agent: string, month, date) {
    this.isExpanded=true;
    this.monthForSelectedRow='';
    this.selectedMonth = '';
    this.selectedAgent = date;
   this.selectedDate = '';
   // this.activeButton = 'All'
    //this.isAllSelectedWithDate = true;
    //this.isAllClickedWithDate(date);
    
  }
  highlightRowforAgentDate(index: number, date, agent: string, month) {
    this.isExpanded=true;
    this.monthForSelectedRow=month;
    this.agentForSelectedRow =agent;
    this.selectedMonth = '';
    this.selectedAgent =''; //'';
    this.selectedDate = date;
   // this.getDataOnDateHoverForAgent(agent,month,date);
   // this.activeButton = 'All'
    //this.isAllSelectedWithDate = true;
    //this.isAllClickedWithDate(date);
  }

  getAgentNameForSpecificMonth(month){
    this.agentMonthName =  moment(month, "MMMM YYYY").format('MM/DD/YYYY');
    alert("agentMonthName : "+this.agentMonthName);
  }

  columnDefs = [
    {headerName: 'Make', field: 'make'},
    {headerName: 'Model', field: 'model'},
    {headerName: 'Price', field: 'price'}
];

rowData = [
    {make: 'Toyota', model: 'Celica', price: 35000},
    {make: 'Ford', model: 'Mondeo', price: 32000},
    {make: 'Porsche', model: 'Boxter', price: 72000}
];
}
