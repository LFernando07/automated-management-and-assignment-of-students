import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Student } from './student';
import { Observable } from 'rxjs';
import { Project } from './project';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  link = environment.BASE_HOST + "/students/";
  constructor(private httpClient: HttpClient) { }

  // Get all students from the backend
  // This method returns an Observable of Student array
  // The observable will emit the array of students when the HTTP GET request is successful
  getAllStudents(): Observable<Student[]> {
    return this.httpClient.get<Student[]>(this.link);
  }

  getStudentById(id: number): Observable<Student> {
    return this.httpClient.get<Student>(this.link + id);
  }

  createStudent(student: Student): Observable<Student> {
    return this.httpClient.post<Student>(this.link, student);
  }

  updateStudent(id: number, student: Student): Observable<Student> {
    return this.httpClient.put<Student>(this.link + id, student);
  }

  deleteStudent(id: number): Observable<String> {
    return this.httpClient.delete(this.link + id, { responseType: "text" });
  }

  // Special Methods
  getAvailableStudentProjects(studentId: any): Observable<Project[]> {
    return this.httpClient.get<Project[]>(this.link + studentId + "/available-projects")
  }

  addProjectToStudent(studentId: any, projectId: any): Observable<Student> {
    return this.httpClient.post<Student>(this.link + studentId + "/projects/" + projectId, "")
  }

  deleteProjectFromStudent(studentId: any, projectId: any): Observable<Student> {
    return this.httpClient.delete<Student>(this.link + studentId + "/projects/" + projectId)
  }

  getMaxProjectsPerStudents(): Observable<Number> {
    return this.httpClient.get<Number>(this.link + "max-projects")
  }

  updateMaxProjectsPerStudents(val: any): Observable<String> {
    return this.httpClient.put<String>(this.link + "max-projects", val)
  }

  getStudentAssignment(): Observable<Map<String, String>> {
    return this.httpClient.get<Map<String, String>>(this.link + "assignment")
  }

}
