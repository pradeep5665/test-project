import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-check-request-disabled',
  templateUrl: './check-request-disabled.component.html',
  styleUrls: ['./check-request-disabled.component.css']
})
export class CheckRequestDisabledComponent implements OnInit {

  checkPaymentReqForm: FormGroup;
  constructor(private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private router: Router,
   private appComp: AppComponent) { }
  ngOnInit() {
    this.checkPaymentReqForm = this.formBuilder.group({
      loanNumber: ['', Validators.required]
    });
  }

}
