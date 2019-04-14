import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComposePageComponent } from './compose-page.component';

describe('ComposePageComponent', () => {
  let component: ComposePageComponent;
  let fixture: ComponentFixture<ComposePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComposePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComposePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
