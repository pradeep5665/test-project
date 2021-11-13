import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-admin-check-request-disabled',
  templateUrl: './admin-check-request-disabled.component.html',
  styleUrls: ['./admin-check-request-disabled.component.css']
})
export class AdminCheckRequestDisabledComponent implements OnInit {

  checkPaymentReqForm: FormGroup;
  loanNumber: number;
  failuremessage: string;

  constructor(private formBuilder: FormBuilder,private activatedRoute: ActivatedRoute, private router: Router,
     private appComp: AppComponent) { }

  ngOnInit() {
    this.checkPaymentReqForm = this.formBuilder.group({
      loanNumber: ['', Validators.required]
    });
  }

}
