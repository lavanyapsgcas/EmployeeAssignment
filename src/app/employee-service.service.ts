import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, switchMap, tap, throwError } from 'rxjs';
import { Employee } from './model/employee-model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeServiceService {

  private apiUrl = 'assets/employee_list.json';
  

  constructor(private http: HttpClient) { }

  
  getEmployees(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }


  addEmployee(newEmployee: any): Observable<any> {
    return this.getEmployees().pipe(
      tap(employees => {
        employees.push(newEmployee);
        const updatedData = JSON.stringify(employees);
        this.writeJsonToFile(updatedData);
      })
    );
  }

  private writeJsonToFile(data: string): Observable<any> {
    return this.http.put<any>(this.apiUrl, data);
  }
  
}
