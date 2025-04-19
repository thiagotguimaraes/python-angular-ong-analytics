import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DashboardDataService, Well } from '../../services/dashboard-data.service';

@Component({
  standalone: false,
  selector: 'app-filter-drawer',
  templateUrl: './filter-drawer.component.html',
  styleUrls: ['./filter-drawer.component.scss']
})
export class FilterDrawerComponent implements OnInit {
  filterForm!: FormGroup;
  wells: Well[] = [];

  constructor(
    private fb: FormBuilder,
    private dataService: DashboardDataService
  ) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      wellName: [null],
      startDate: [null],
      endDate: [null]
    });

    this.dataService.getWells().subscribe((wells) => {
      console.log('wells:', wells);
      
      this.wells = wells;
    });
  }

  onSubmit() {
    console.log('Form Values:', this.filterForm.value);
  }
}
