import { ComponentFixture, TestBed } from '@angular/core/testing';
import {ResourceManageOwners} from './resource-manage-owners';

describe('ResourceManageOwnerss', () => {
  let component: ResourceManageOwners;
  let fixture: ComponentFixture<ResourceManageOwners>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourceManageOwners]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResourceManageOwners);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
