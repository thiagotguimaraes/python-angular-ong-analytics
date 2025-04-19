import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  standalone: false,
  selector: 'app-filter-drawer',
  templateUrl: './filter-drawer.component.html',
  styleUrls: ['./filter-drawer.component.scss']
})
export class FilterDrawerComponent implements OnInit {
  filterForm!: FormGroup;
  wells: string[] = ['Well A', 'Well B', 'Well C']; // will come from backend later

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      wellName: [null],
      startDate: [null],
      endDate: [null]
    });
  }

  onSubmit() {
    console.log('Form Values:', this.filterForm.value);
    // TODO: Dispatch action or fetch data from backend
  }
}
