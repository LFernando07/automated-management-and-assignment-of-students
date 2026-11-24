import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from './project';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  link = environment.BASE_HOST + "/projects/";
  constructor(private httpClient: HttpClient) { }

  // Get all students from the backend
  // This method returns an Observable of Project array
  // The observable will emit the array of students when the HTTP GET request is successful
  getAllProjects(): Observable<Project[]> {
    return this.httpClient.get<Project[]>(this.link);
  }

  getProjectById(id: number): Observable<Project> {
    return this.httpClient.get<Project>(this.link + id);
  }

  createProject(student: Project): Observable<Project> {
    return this.httpClient.post<Project>(this.link, student);
  }

  updateProject(id: number, student: Project): Observable<Project> {
    return this.httpClient.put<Project>(this.link + id, student);
  }

  deleteProject(id: number): Observable<String> {
    return this.httpClient.delete(this.link + id, { responseType: "text" });
  }
}
