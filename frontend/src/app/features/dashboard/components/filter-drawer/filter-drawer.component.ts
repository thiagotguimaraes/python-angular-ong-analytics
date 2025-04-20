import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DashboardDataService } from '../../services/dashboard-data.service';
import { Well, ProductionPoint } from '../../../../models';

@Component({
  standalone: false,
  selector: 'app-filter-drawer',
  templateUrl: './filter-drawer.component.html',
  styleUrls: ['./filter-drawer.component.scss']
})
export class FilterDrawerComponent implements OnInit {
  filterForm!: FormGroup;
  wells: Well[] = [];
  @Output() dataFetched = new EventEmitter<ProductionPoint[]>();

  constructor(
    private fb: FormBuilder,
    private dataService: DashboardDataService
  ) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      collection: [null],
      startDate: [null],
      endDate: [null]
    });

    this.dataService.getWells().subscribe((wells) => {
      this.wells = wells;
    });
  }

  onSubmit() {
    const { collection, startDate, endDate } = this.filterForm.value;
    
    this.dataService
      .getProductionData(
        collection,
        new Date(startDate).getTime(),
        new Date(endDate).getTime()
      )
      .subscribe((data) => {
        this.dataFetched.emit(data); // 🎯 send data to parent component
      });
  }
}
