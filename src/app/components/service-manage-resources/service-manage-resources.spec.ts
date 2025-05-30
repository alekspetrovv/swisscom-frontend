import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceManageResources } from './service-manage-resources';

describe('ServiceManageResources', () => {
  let component: ServiceManageResources;
  let fixture: ComponentFixture<ServiceManageResources>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceManageResources]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceManageResources);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
