import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceList } from './service-list';

describe('ServiceList', () => {
  let component: ServiceList;
  let fixture: ComponentFixture<ServiceList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
