import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { formatDate } from '@angular/common';
import { ResearchPaymentDto } from '../model/research-payment-dto';
import { ResearchPaymentService } from '../service/research-payment.service';
import { RearchPaymentRequest } from '../model/rearch-payment-request';
import { ResearchPaymentResposne } from '../model/research-payment-resposne';
import { GetResearchPaymentResponse } from '../model/get-research-payment-response';
import { GetResearchPaymentDto } from '../model/get-research-payment-dto';
import { GetNamesService } from '../service/get-names.service';
import { GetNamesResponse } from '../model/get-names-response';
import { PhonepayPaymentsService } from '../service/phonepay-payments.service';
import { BankingInfo } from '../model/banking-info';
import { SortingList } from '../model/sorting-list';
import { Sort } from '@angular/material';


@Component({
  selector: 'app-research-payments',
  templateUrl: './research-payments.component.html',
  styleUrls: ['./research-payments.component.css']
})
export class ResearchPaymentsComponent implements OnInit {
  isLoading = false;
  userDetails: any;
  searchCriteriaForm: FormGroup;
  researchPaymentDto: ResearchPaymentDto[];
  getResearchPaymentDto = new GetResearchPaymentDto();
  researchPaymentResponse = new ResearchPaymentResposne();
  getResearchPaymentResponse = new GetResearchPaymentResponse()
  researchPaymentReq = new RearchPaymentRequest();
  getNamesResponse = new GetNamesResponse();
  lastNames: string[] = [];
  firstNames: string[] = [];
  expandedIndex: number;
  bankingInfo = new BankingInfo();
  adviceType : string;
  adviceNote : string;
  sortlevel1 ="";
  sortingOrder1 ="";
  sortlevel2 ="";
  sortingOrder2 ="";
  sortlevel3 ="";
  sortingOrder3 ="";
  sortedData: ResearchPaymentDto[];
   addImageDate = false;
   addImageAmunt = false;
   addImageLoan = false;

  constructor(private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private router: Router,
    private appComp: AppComponent, private researchPaymentService: ResearchPaymentService,
    private getNames: GetNamesService, private phonepayPaymentsService: PhonepayPaymentsService) {
      this.expandedIndex=-1;
     }

  ngOnInit() {
    this.searchCriteriaForm = this.formBuilder.group({
      dateRangeFrom: new FormControl(new Date(null)),
      dateRangeTo: new FormControl(),
      amountFrom: new FormControl(),
      amountTo: new FormControl(),
      loanFrom: new FormControl(),
      loanTo: new FormControl(),
      agent1: new FormControl(),
      agent2: new FormControl(),
      // lastName: new FormControl(),
      // firstName: new FormControl(),
      // sortlevel1: new FormControl('Date'),
      // sortingOrder1: new FormControl('Ascending'),
      // sortlevel2: new FormControl('Amount'),
      // sortingOrder2: new FormControl('Ascending'),
      // sortlevel3: new FormControl('Loan Number'),
      // sortingOrder3: new FormControl('Ascending'),
      sortlevel1: new FormControl(''),
      sortingOrder1: new FormControl(''),
      sortlevel2: new FormControl(''),
      sortingOrder2: new FormControl(''),
      sortlevel3: new FormControl(''),
      sortingOrder3: new FormControl(''),
    });
    this.userDetails = JSON.parse(sessionStorage.getItem('userDetails'));
  }

  onClear(){
    this.searchCriteriaForm.reset();
    this.researchPaymentDto = []; 
    this.searchCriteriaForm.patchValue({
     
      sortlevel1: this.sortlevel1,
      sortingOrder1 : this.sortingOrder1,
      sortlevel2 : this.sortlevel2,
      sortingOrder2:this.sortingOrder2,
      sortlevel3:this.sortlevel3 ,
      sortingOrder3:this.sortingOrder3,
      // other controller names goes here
    });
  }
 
  onSearch() {
    this.addImageDate = false;
   this.addImageAmunt = false;
   this.addImageLoan = false;
    let date = new Date(null);
    console.log('#########', date);
    const format = 'MM/dd/yyyy';
    const fromDate = (this.searchCriteriaForm.get('dateRangeFrom').value);
    const locale = 'en-US';
    const formattedFromDate = formatDate(fromDate, format, locale);
    console.log('formattedFromDate', formattedFromDate)

    const toDate = this.searchCriteriaForm.get('dateRangeTo').value;
    const formattedToDate = formatDate(toDate, format, locale);
    this.researchPaymentReq.fromDate = formattedFromDate;
    this.researchPaymentReq.toDate = formattedToDate; 
    this.researchPaymentReq.fromAmount = this.searchCriteriaForm.get('amountFrom').value;
    this.researchPaymentReq.toAmount = this.searchCriteriaForm.get('amountTo').value;

    this.researchPaymentReq.servicingAgents = [];

    console.log('this.searchCriteriaForm.get value()', this.searchCriteriaForm.get('agent1').value)

    if(this.searchCriteriaForm.get('agent1').value!==null && this.searchCriteriaForm.get('agent1').value!==undefined && this.searchCriteriaForm.get('agent1').value !== ''){
      console.log('this.searchCriteriaForm.get value()', this.searchCriteriaForm.get('agent1').value)
      this.researchPaymentReq.servicingAgents.push(this.searchCriteriaForm.get('agent1').value);
    }
    
    if(this.searchCriteriaForm.get('agent2').value!==null && this.searchCriteriaForm.get('agent2').value!==undefined && this.searchCriteriaForm.get('agent2').value !== ''){
      this.researchPaymentReq.servicingAgents.push(this.searchCriteriaForm.get('agent2').value);
    }
    
    if(this.searchCriteriaForm.get('loanFrom').value!==null && this.searchCriteriaForm.get('loanFrom').value!==undefined && this.searchCriteriaForm.get('loanFrom').value !== ''){
      this.researchPaymentReq.loanNumbers.push(this.searchCriteriaForm.get('loanFrom').value);
    }
    
    if(this.searchCriteriaForm.get('loanTo').value!==null && this.searchCriteriaForm.get('loanTo').value!==undefined && this.searchCriteriaForm.get('loanTo').value !== ''){
      this.researchPaymentReq.loanNumbers.push(this.searchCriteriaForm.get('loanTo').value);
    }

   this.researchPaymentReq.sortingList = [];
    if(this.searchCriteriaForm.get('sortlevel1').value==='Date' && this.searchCriteriaForm.get('sortingOrder1').value === 'Ascending'){
      var sortingDetail = new SortingList();
      sortingDetail.sortingType = 'Date';
      sortingDetail.sortingOrder = 'ASC';
      this.researchPaymentReq.sortingList.push(sortingDetail);
    }else if(this.searchCriteriaForm.get('sortlevel1').value==='Date' && this.searchCriteriaForm.get('sortingOrder1').value === 'Descending'){
      var sortingDetail = new SortingList();
      sortingDetail.sortingType = 'Date';
      sortingDetail.sortingOrder = 'DESC';
      this.researchPaymentReq.sortingList.push(sortingDetail);
    }

    if(this.searchCriteriaForm.get('sortlevel2').value==='Amount' && this.searchCriteriaForm.get('sortingOrder2').value === 'Ascending'){
      var sortingDetail = new SortingList();
      sortingDetail.sortingType = 'Amount';
      sortingDetail.sortingOrder = 'ASC';
      this.researchPaymentReq.sortingList.push(sortingDetail);
    }else if(this.searchCriteriaForm.get('sortlevel2').value==='Amount' && this.searchCriteriaForm.get('sortingOrder2').value === 'Descending'){
      var sortingDetail = new SortingList();
      sortingDetail.sortingType = 'Amount';
      sortingDetail.sortingOrder = 'DESC';
      this.researchPaymentReq.sortingList.push(sortingDetail);
    }

    if(this.searchCriteriaForm.get('sortlevel3').value==='Loan Number' && this.searchCriteriaForm.get('sortingOrder3').value === 'Ascending'){
      var sortingDetail = new SortingList();
      sortingDetail.sortingType = 'Loan';
      sortingDetail.sortingOrder = 'ASC';
      this.researchPaymentReq.sortingList.push(sortingDetail);
    }else if(this.searchCriteriaForm.get('sortlevel3').value==='Loan Number' && this.searchCriteriaForm.get('sortingOrder3').value === 'Descending'){
      var sortingDetail = new SortingList();
      sortingDetail.sortingType = 'Loan';
      sortingDetail.sortingOrder = 'DESC';
      this.researchPaymentReq.sortingList.push(sortingDetail);
    }

    
    console.log('this.researchPaymentReq.loanNumbers', this.researchPaymentReq.sortingList);

    // this.researchPaymentReq.lastName =  this.searchCriteriaForm.get('lastName').value;
    // this.researchPaymentReq.firstName =  this.searchCriteriaForm.get('firstName').value;

    console.log('researchPaymentReq body : ', this.researchPaymentReq);
    this.appComp.showProgressBar(true);
    this.researchPaymentService.getResearchPaymentInfo(this.researchPaymentReq).subscribe(
      researchPaymentResponse => {
        this.researchPaymentResponse = researchPaymentResponse;
        if (this.researchPaymentResponse.isSuccessful) {
          this.appComp.showProgressBar(false);
          this.researchPaymentDto = this.researchPaymentResponse.researchPaymentDto;
          console.log('this.researchPaymentDto1111111  ', this.researchPaymentDto);
        } else {
          this.appComp.showErrorMessage(this.researchPaymentResponse.message, null, false);
        }
      })
     
  }
  public loanNumberSort = false;
  public sortNumberColumn() {
      this.addImageLoan = true;
      this.addImageDate = false;
      this.addImageAmunt = false;
      this.loanNumberSort = !this.loanNumberSort;
      if(this.loanNumberSort) {
          this.researchPaymentDto.sort((a, b) => a.loanNumber - b.loanNumber); // For ascending sort
      } else {
          this.researchPaymentDto.sort((a, b) => b.loanNumber - a.loanNumber); // For descending sort
      }
  }

  public dateSort = false;
  public sortNumberColumn1() {
    this.addImageLoan = false;
    this.addImageDate = true;
    this.addImageAmunt = false;
      this.dateSort = !this.dateSort;
      if(this.dateSort) {
        this.researchPaymentDto.sort((a, b) => new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime());// For ascending sort
      } else {
        this.researchPaymentDto.sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());// For descending sort
      }
  }

  public amountSort = false;
  public sortNumberColumn2() {
    this.addImageLoan = false;
    this.addImageDate = false;
    this.addImageAmunt = true;
      this.amountSort = !this.amountSort;
      if(this.amountSort) {
        this.researchPaymentDto.sort((a, b) =>  parseFloat(a.totalAmount)- parseFloat(b.totalAmount));// For ascending sort
      } else {
        this.researchPaymentDto.sort((a, b) => parseFloat(b.totalAmount)- parseFloat(a.totalAmount));// For descending sort
      }
  }

//sorted(Input, key = lambda x:float(x))
  // selectedSortOrder(strsort1: string){
  //   alert("test"+strsort1);
  //   if(strsort1==='Date'){
  //       alert("test");
  //   }
 //}
  getResearchDetails(i: number, paymentId: number) {

    console.log('entered in getResearchDetails(), index :', i, 'paymentId:', paymentId)
    //this.appComp.showProgressBar(true);
    this.researchPaymentService.getResearchPaymentDetailsById(paymentId).subscribe(
      getResearchPaymentResponse => {
        this.getResearchPaymentResponse = getResearchPaymentResponse;
        if (this.researchPaymentResponse.isSuccessful) {
          this.getResearchPaymentDto = this.getResearchPaymentResponse.researchPaymentDto;
          console.log('this.getResearchPaymentDto  ', this.getResearchPaymentDto);

          if(this.getResearchPaymentDto.paymentList[0].paymentAdvice){
            switch (this.getResearchPaymentDto.paymentList[0].paymentAdvice.adviceId) {
              case 1: {
                this.adviceType = 'Cashiering';
                this.adviceNote = this.getResearchPaymentDto.paymentList[0].paymentAdvice.adviceNotes;
                break;
              }
              case 2: {
                this.adviceType = 'Bankruptcy';
                this.adviceNote = this.getResearchPaymentDto.paymentList[0].paymentAdvice.adviceNotes;
                break;
              }
              case 3: {
                this.adviceType = 'Collections';
                this.adviceNote = this.getResearchPaymentDto.paymentList[0].paymentAdvice.adviceNotes;
                break;
              }
              case 4: {
                this.adviceType = 'Loss Mit';
                this.adviceNote = this.getResearchPaymentDto.paymentList[0].paymentAdvice.adviceNotes;
                break;
              }
              default: {
                //statements; 
                break;
              }
            }
          }
         

          this.phonepayPaymentsService.bankingInfo(this.getResearchPaymentDto.paymentList[0].routingNumber).subscribe(
            bankingInfo => {
              this.bankingInfo = bankingInfo
            }
          );

        } else {
         // this.appComp.showErrorMessage(this.getResearchPaymentResponse.message, null, false);
        }
      })

      this.expandRow(i);
  }

  expandRow(index: number): void {
    this.expandedIndex = index === this.expandedIndex ? -1 : index;
  }


  getFirstNameAuto(firstName: string) {
  this.firstNames = [];
  if (firstName !== '') {
    console.log('Name is :', firstName);
    this.isLoading = true;
    this.getNames.getFirstAndLastNamesListForAutocomplete(firstName).subscribe(
      getNamesResponse => {
        this.getNamesResponse = getNamesResponse;
        console.log('this.getNamesResponse', this.getNamesResponse);
        this.isLoading = false;
        if (this.getNamesResponse.isSuccessful) {
          this.firstNames = this.getNamesResponse.names;
          console.log('this.firstNames', this.firstNames);
        }
      }
    )
  }
}
getLastNameAuto(lastName: string) { 
  this.lastNames = [];
  if(lastName !== ''){ 
    console.log('lastName : ', lastName);
    this.isLoading = true;
    this.getNames.getFirstAndLastNamesListForAutocomplete(lastName).subscribe(
      getNamesResponse => {
        this.getNamesResponse = getNamesResponse;
        this.isLoading = false;
        console.log('this.getNamesResponse', this.getNamesResponse);
        if (this.getNamesResponse.isSuccessful) {
          this.lastNames = this.getNamesResponse.names;
          console.log('this.lastNames', this.lastNames);
        }
      }
    )
    }
  }

  // getLastName(firstName: string, lastName: string) { alert("test111111111111"+firstName+" : "+lastName);
  //   this.lastNames = [];
  //   if (lastName != '' && firstName === '') {
  //     console.log('Name is :', lastName);
  //     this.isLoading = true;
  //     this.getNames.getLastNamesList(lastName).subscribe(
  //       getNamesResponse => {
  //         this.getNamesResponse = getNamesResponse;
  //         console.log('this.getNamesResponse', this.getNamesResponse);
  //         this.isLoading = false;
  //         if (this.getNamesResponse.isSuccessful) {
  //           this.lastNames = this.getNamesResponse.names;
  //           console.log('this.lastNames', this.lastNames);
  //         }
  //       }
  //     )
  //   }else if (firstName != '' && lastName !== ''){alert("test2222222222222"+firstName+" : "+lastName);
  //     console.log('firstName :', firstName , 'lastName : ', lastName);
  //     this.getNames.getLastNamesListByFirstAndLastName(firstName, lastName).subscribe(
  //       getNamesResponse => {
  //         this.getNamesResponse = getNamesResponse;
  //         console.log('this.getNamesResponse', this.getNamesResponse);
  //         if (this.getNamesResponse.isSuccessful) {
  //           this.lastNames = this.getNamesResponse.names;
  //           console.log('this.lastNames', this.lastNames);
  //         }
  //       }
  //     )

  //   }
  // }

  getFirstName(firstName: string, lastName: string) {
    this.firstNames = [];
    if (firstName != '' && lastName === '') {
      console.log('Name is :', firstName);
      this.getNames.getFirstNamesList(firstName).subscribe(
        getNamesResponse => {
          this.getNamesResponse = getNamesResponse;
          console.log('this.getNamesResponse', this.getNamesResponse);
          if (this.getNamesResponse.isSuccessful) {
            this.firstNames = this.getNamesResponse.names;
            console.log('this.firstNames', this.firstNames);
          }
        }
      )
    }else if (firstName != '' && lastName !== ''){
      console.log('firstName :', firstName , 'lastName : ', lastName);
      this.getNames.getFirstNamesListByFirstAndLastName(firstName, lastName).subscribe(
        getNamesResponse => {
          this.getNamesResponse = getNamesResponse;
          console.log('this.getNamesResponse', this.getNamesResponse);
          if (this.getNamesResponse.isSuccessful) {
            this.firstNames = this.getNamesResponse.names;
            console.log('this.firstNames', this.firstNames);
          }
        }
      )

    }
  }

  legendPopup() {
    this.appComp.dialogObj.msgHeader = 'Legend';
  this.appComp.populateLegendMessage('<div class="table-responsive"> <table class="table table-bordered"> <thead> <tr> <th scope="col font-weight-bold text-left">Appearance</th> <th scope="col font-weight-bold text-left">Meaning</th> </tr> </thead> <tbody> <tr> <th scope="row" class="text-left"></span>Regular font</th> <td class="text-left">Full payment with or without Service Fee.</td> </tr> <tr> <th scope="row" class="text-left font-bold"></span>Bold font</th> <td class="text-left">Payment is greater than the full payment amount.</td> </tr> <tr> <th scope="row" class="text-left font-colour">Red font</th> <td class="text-left">Payment is less than the full payment amount.</td> </tr> <tr> <th scope="row" class="text-left">mm/dd/yyyy*</th> <td class="text-left">Payment processed on a date different than the create date.</td> </tr> </tbody> </table> </div>', null, true);
  }

  
}
// function compare(a: number | string, b: number | string, isAsc: boolean) {
//   return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
// }
