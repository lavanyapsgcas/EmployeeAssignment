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
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';
import { EmployeeServiceService } from '../employee-service.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist';
import { Observable, from } from 'rxjs';
import { Employee } from '../model/employee-model';


export interface PeriodicElement {
  name: string;
  id: number;
  designation: string;
  location: string;
  status: string;
}

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
  displayedColumns: string[] = ['id', 'name', 'designation', 'location', 'status','actions'];
  dataSource = new MatTableDataSource<Employee>([]);
  @ViewChild('dataTable') table!: MatTable<Employee>;
  EmployeeForm!: FormGroup;
  showForm: boolean = false;
  submitted: boolean = false;
  editingEmployeeId: number | null = null;


  idList: any[] = [];
  designationList: any[] = [];
  locationList: any[] = [];
  filteredData: any[] = [];
  employeeList: Employee[] = [];


  constructor(private employeeService: EmployeeServiceService, private fb: FormBuilder) { }

  ngOnInit(): void {

    this.EmployeeForm = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      location: ['', Validators.required],
      designation: ['', Validators.required],
      status: ['',Validators.required]
    });
    this.getEmployee();
    this.getFilterData();

  }

  get f() {
    return this.EmployeeForm.controls;
  }

  getEmployee() {
    this.employeeService.getEmployees().subscribe(data => {
      this.employeeList = data;
      this.dataSource.data = this.employeeList;
     
      console.log("employee data", this.employeeList);
    })
  }

  addEmployee() {
    this.showForm = true
  }

  onSubmit() {
    this.submitted = true;
    if (this.EmployeeForm.valid) {
      const newEmployee = this.EmployeeForm.value;
      this.employeeService.addEmployee(newEmployee).subscribe((newEmployee) => {
        this.employeeList = newEmployee;
        this.dataSource.data = this.employeeList;
        console.log("newEmployee data", newEmployee);
      });
      this.EmployeeForm.reset();
      this.EmployeeForm.clearValidators();
      this.submitted = false;
    }
    
  }

  getFilterData() {
    this.employeeService.getEmployees().subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.data.forEach(element => {
        this.idList.push(element.id)
      });

      this.dataSource.data.forEach(element => {
        this.designationList.push(element.designation)
      });

      this.dataSource.data.forEach(element => {
        this.locationList.push(element.location)
      });

    })
  }

  filterId(input: string | any) {
    this.dataSource.filterPredicate = (data: Employee, f: string) =>
      !f ||
      data.id == input.target.value;
    this.dataSource.filter = input.target.value;
  }
  filterDesignation(input: string | any) {
    this.dataSource.filterPredicate = (data: Employee, f: string) =>
      !f ||
      data.designation == input.target.value;
    this.dataSource.filter = input.target.value;
  }
  filterLocation(input: string | any) {
    this.dataSource.filterPredicate = (data: Employee, f: string) =>
      !f ||
      data.location == input.target.value;
    this.dataSource.filter = input.target.value;
  }
  editEmployee(employee: Employee) {
    this.showForm = true;
    this.editingEmployeeId = employee.id;
    if(this.editingEmployeeId===employee.id){
      this.EmployeeForm.patchValue(employee);
    }    
  }

  deleteEmployee(employee: Employee) {
    this.employeeList = this.employeeList.filter(emp => emp.id !== employee.id);
    this.dataSource.data = this.employeeList;

  }

}
