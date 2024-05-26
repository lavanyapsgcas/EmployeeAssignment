import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { elementAt } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';
import { EmployeeServiceService } from '../employee-service.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';


export interface PeriodicElement {
  name: string;
  id: number;
  designation: string;
  location: string;
  status: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { id: 1, name: 'Jim', designation: 'Manager', location: 'New york', status: 'Active' },
  { id: 2, name: 'Corbett', designation: 'HR', location: 'Canada', status: 'Temporarily suspended' },
  { id: 3, name: 'Harry', designation: 'Designer', location: 'Paris', status: 'Inactive' },
  { id: 4, name: 'Potter', designation: 'Developer', location: 'Riyadh', status: 'Terminated' },
];
@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule,
    MatSortModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    HttpClientModule,
  ],
})
export class EmployeeComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'designation', 'location', 'status'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  @ViewChild('dataTable') table!: MatTable<PeriodicElement>;

  employeeIdControl = new FormControl();
  designationControl = new FormControl();
  locationControl = new FormControl();

  idList: any[] = [];
  designationList: any[] = [];
  locationList: any[] = [];
  filteredData: any[] = [];

  newEmployee = { "id": 7, "name": "Alice Johnson", "designation": "Project Manager", "location": "Chicago" };

  constructor(private employeeService: EmployeeServiceService) { }
  ngOnInit(): void {
    this.getIdData();
    this.getDesignationData();
    this.getLocationData();
  }

  addEmployee() {
    this.employeeService.addEmployee(this.newEmployee).subscribe(
      () => console.log('Employee added successfully'),
      (error) => console.error('Error adding employee:', error)
    );
  }

  getIdData() {
    this.dataSource.data.forEach(element => {
      this.idList.push(element.id)
    });
  }
  getDesignationData() {
    this.dataSource.data.forEach(element => {
      this.designationList.push(element.designation)
    });
  }
  getLocationData() {
    this.dataSource.data.forEach(element => {
      this.locationList.push(element.location)
    });
  }

  filterId(input: string | any) {
    this.dataSource.filterPredicate = (data: PeriodicElement, f: string) =>
      !f ||
      data.id == input.target.value;
    this.dataSource.filter = input.target.value;
  }
  filterDesignation(input: string | any) {
    this.dataSource.filterPredicate = (data: PeriodicElement, f: string) =>
      !f ||
      data.designation == input.target.value;
    this.dataSource.filter = input.target.value;
  }
  filterLocation(input: string | any) {
    this.dataSource.filterPredicate = (data: PeriodicElement, f: string) =>
      !f ||
      data.location == input.target.value;
    this.dataSource.filter = input.target.value;
  }


}
