import { Component, OnInit, AfterViewInit } from '@angular/core';
import { appConfig } from '../app.config';
import * as hljs from 'highlight.js';
@Component({
    selector: appConfig.componentPefix + '-customer-profile-demo-api',
    templateUrl: './uix-customer-profile.component-api.html',
    styleUrls: ['./uix-customer-profile.component.css',
        '../uix-demo-veiwer/default.css'
    ]
})
export class UixCustomerProfileAPIDemoComponent implements OnInit, AfterViewInit {
    apiUsed = appConfig.apiServer + appConfig.customerProfileAPI + '<CustomerId>';
    apiStore = appConfig.apiStore;
    constructor() { }

    ngOnInit() {
        console.log('UixCustomerProfileAPIDemoComponent ngOnInit >>> ');
        this.initHighlighting();
    }

    ngAfterViewInit() {
        this.initHighlighting();
    }

    initHighlighting() {
        console.log('inside UixCustomerProfileAPIDemoComponent->initHighlighting >> ');
        hljs.configure({
            tabReplace: '    ', // 4 spaces
            classPrefix: '',     // don't append class prefix
            languages: ['typescript']
            // … other options aren't changed
        })
        hljs.initHighlighting();
    }
}
