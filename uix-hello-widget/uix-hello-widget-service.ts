import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/throw';
import {
  Http,
  Response,
  Headers,
  URLSearchParams,
  RequestOptions
} from '@angular/http';
import { appConfig } from '../app.config';
import { Customer, Address } from '../models/customer';
import 'rxjs/add/operator/catch';

@Injectable()
export class UixHelloWidgetService {
  constructor(private http: Http) { }

  getCustomer(custNbr: string, bearerToken: string,
    feId: string): Observable<Customer> {
    const targetUrl = this.getCustProfileAPI(custNbr);
    const headers = this.getHeaderParameters(bearerToken, feId);

    return this.http
      .get(targetUrl, {
        headers: headers
      })
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  private extractData(res: Response) {
    const customer = new Customer();
    const resJSON = res.json();
    // this.extractAddressInfo(resJSON);
    if (resJSON.Entity != null) {
      customer.customerType = resJSON.Entity.IpTyp;
      customer.name = resJSON.Entity.NmeTtl + ' ' + resJSON.Entity.FrstNme + ' ' + resJSON.Entity.MidNme + ' ' + resJSON.Entity.LstNme;
      customer.customerStrtDt = resJSON.Entity.IpStrtDte;

      const ipPoc = resJSON.Entity.IpPoc;
      const emailJson = {
        'Primary': '',
        'Secondary': ''
      };
      const phoneJson = {
        'Mobile': ''
      };
      const addrJson = {
        'Home': new Address()
      }
      if (ipPoc != null && ipPoc.IpEmailAddrSumm != null) {
        for (const emailObj of ipPoc.IpEmailAddrSumm) {
          console.log(emailObj);
          if (emailObj.IpEmail.EntprsEmailCde != null && emailObj.IpEmail.EntprsEmailCde.EmailTyp != null) {
            console.log(emailObj.IpEmail.EntprsEmailCde.EmailTyp);
            emailJson[emailObj.IpEmail.EntprsEmailCde.EmailTyp] = emailObj.IpEmail.Addr;
          }
        }
      }
      customer.email = emailJson.Primary;

      if (ipPoc != null && ipPoc.IpPstlAddrCmDtl != null) {

        for (const addrObj of ipPoc.IpPstlAddrCmDtl) {
          const addressInfo: String[] = ['', '', '', ''];
          console.log(addrObj);
          if (addrObj.IpPostalAddress.EntprsAddrCde != null && addrObj.IpPostalAddress.EntprsAddrCde.PstlAddrTyp != null) {
            console.log(addrObj.IpPostalAddress.EntprsAddrCde.PstlAddrTyp);
            for (let addrLine of addrObj.IpPostalAddress.FrmtAddrLne) {
              addressInfo[addrLine.SeqNbr - 1] = addrLine.LneTxt;
            }
            const zip: String = addrObj.IpPostalAddress.PstlCde;
            let address = new Address(addressInfo[0], addressInfo[1], addressInfo[2], addressInfo[3], zip);
            console.log('my address >>>', address.getAddressToString());
            addrJson[addrObj.IpPostalAddress.EntprsAddrCde.PstlAddrTyp] = address;
          }
        }
      }
      customer.address = addrJson.Home;


      if (ipPoc != null && ipPoc.IpPhSumm != null) {
        for (const phoneObj of ipPoc.IpPhSumm) {
          console.log(phoneObj);
          if (phoneObj.IpPhone.EntprsPhCde != null && phoneObj.IpPhone.EntprsPhCde.PhTyp != null) {
            console.log(phoneObj.IpPhone.EntprsPhCde.PhTyp);
            phoneJson[phoneObj.IpPhone.EntprsPhCde.PhTyp] = phoneObj.IpPhone.TeleNbr;
          }
        }
      }
      customer.phoneNbr = phoneJson.Mobile;
    } else {
      customer.error = resJSON;
    }
    return customer;
  }

  extractEmailInfo(resJSON: any): any {
    const emailJson = {
      'Primary': '',
      'Secondary': ''
    };
    if (resJSON.Entity.IpPoc != null && resJSON.Entity.IpPoc.IpEmailAddrSumm != null) {
      for (let emailObj of resJSON.Entity.IpPoc.IpEmailAddrSumm) {
        if (emailObj.EntprsEmailCde != null && emailObj.EntprsEmailCde.EmailTyp != null) {
          emailJson[emailObj.EntprsEmailCde.EmailTyp] = emailObj.Addr;
        }
      }
    }
    return emailJson;
  }

  extractAddressInfo(resJSON: any): Address {
    const address = new Address();
    if (resJSON.Entity.IpPoc.IpPstlAddrCmDtl != null) {
      const addr = resJSON.Entity.IpPoc.IpPstlAddrCmDtl[0];
      address.zipCode = addr.IpPostalAddress.PstlCde;
      for (let addrLine of addr.IpPostalAddress.FrmtAddrLne) {
        address.addrLine1 += addrLine.LneTxt + ' ';
      }
    }
    return address;
  }

  private handleErrorObservable(error: Response | any) {
    console.error(error.message || error);
    return Observable.throw(error.json() || error);
  }

  private getCustProfileAPI(custNbr: String) {
    return appConfig.apiServer + appConfig.customerProfileAPI + custNbr;
    // return appConfig.apiServer + appConfig.customerProfileMockAPI + custNbr;
  }

  private getHeaderParameters(bearerToken: string, feId: string) {
    const headers = new Headers();
    headers.append('Authorization', 'Bearer ' + bearerToken);
    headers.append('feId', feId);
    return headers;
  }
}
