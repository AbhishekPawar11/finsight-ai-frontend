import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetBudgetDialogComponent } from './set-budget-dialog.component';

describe('SetBudgetDialogComponent', () => {
  let component: SetBudgetDialogComponent;
  let fixture: ComponentFixture<SetBudgetDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetBudgetDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetBudgetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
