import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Customer } from '../models/customer';
import { UixCustomerProfileService } from './uix-customer-profile-service';
import { appConfig } from '../app.config';
import { FormsModule, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { SearchInput } from '../models/searchInput';
import { AuthTokenService } from '../services/authToken.service';
import {
  Http,
  Response,
  Headers,
  URLSearchParams,
  RequestOptions
} from '@angular/http';
@Component({
  selector: appConfig.componentPefix + '-customer-profile-demo',
  templateUrl: './uix-customer-profile.component-demo.html',
  styleUrls: ['./uix-customer-profile.component.css']
})
export class UixCustomerProfileDemoComponent implements OnInit {
  customer: Customer = new Customer();
  searchInput: SearchInput = new SearchInput();
  token: String = '';
  @Output() customerChange = new EventEmitter<Customer>();
  constructor(private customerService: UixCustomerProfileService, private http: Http, private authTokenService: AuthTokenService) { }

  fetchDetails(custNbr: string, authToken: string, feId: string) {
    this.customer = new Customer();
    this.customerService.getCustomer(custNbr, authToken, feId).subscribe(
      customer => {
        this.customer = customer;
        this.notifyCustomerChangeEvent();
      },
      error => {
        this.customer = new Customer();
        this.customer.error = error;
        this.notifyCustomerChangeEvent();
      },
      () => {
        this.notifyCustomerChangeEvent();
      }
    );
  }

  notifyCustomerChangeEvent() {
    console.log(' >>>> notifyCustomerChangeEvent');
    this.customerChange.emit(this.customer);
  }

  clearDetails() {
    this.customer = new Customer();
    this.searchInput = new SearchInput();
    this.refreshToken();
  }
  ngOnInit() {
    console.log('customer profile demo ngOnInit >>> ');
    this.refreshToken();
  }

  onSubmit() {
    this.customer = new Customer();
    this.fetchDetails(this.searchInput.custId, this.searchInput.token, this.searchInput.feId);
  }

  refreshToken() {
    this.token = '';
    this.authTokenService.getToken().subscribe(
      token => {
        this.searchInput.token = token;
      },
      error => {
        console.log(error);
      }
    );
  }
}
