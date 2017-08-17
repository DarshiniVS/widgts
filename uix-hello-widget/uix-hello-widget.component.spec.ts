import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UixHelloWidgetComponent } from './uix-hello-widget.component';

describe('UixHelloWidgetComponent', () => {
  let component: UixHelloWidgetComponent;
  let fixture: ComponentFixture<UixHelloWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UixHelloWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UixHelloWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
