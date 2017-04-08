import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ActivatedRoute } from '@angular/router';

import { ConfirmEmailComponent } from './confirm-email.component';
import { RouterLinkStubDirective, ActivatedRouteStub } from '../../testing/router-stubs';
import { AlertsService } from '../../shared/alerts/alerts.service';
import { AccountService } from '../../shared/account.service';

class AccountServiceStub {
  verifyMail = jasmine.createSpy('verifyEmail').and.callFake(
    (email, token) => {
      return new BehaviorSubject(null);
    }
  );
}

class AlertsServiceStub {
  addAlert(alert) {}
}

describe('ConfirmEmailComponent', () => {
  let component: ConfirmEmailComponent;
  let fixture: ComponentFixture<ConfirmEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ConfirmEmailComponent,
        RouterLinkStubDirective
      ],
      providers: [
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        { provide: AlertsService, useClass: AlertsServiceStub },
        { provide: AccountService, useClass: AccountServiceStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmEmailComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  describe('without any router params', () => {

    beforeEach(inject([ActivatedRoute],
        (activatedRoute: ActivatedRouteStub) => {
      activatedRoute.testParams = {};
      fixture.detectChanges();
    }));

    it('should have wasError as true', () => {
      expect(component.wasError).toBeTruthy();
    });

  });

  describe('with correct router params', () => {

    beforeEach(inject([ActivatedRoute],
        (activatedRoute: ActivatedRouteStub) => {
      activatedRoute.testParams = {
        userId: 'testUser',
        token: 'testToken'
      };
      fixture.detectChanges();
    }));

    it('should have wasError as false', () => {
      expect(component.wasError).toBeFalsy();
    });

  });


});
