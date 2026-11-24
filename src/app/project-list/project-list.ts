import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { Project } from '../project';
import { ProjectService } from '../project-service';

@Component({
  selector: 'app-project-list',
  standalone: false,
  templateUrl: './project-list.html',
  styleUrl: './project-list.css',
})
export class ProjectList implements OnInit, OnDestroy {
  projects: Project[] = [];
  project: Project = new Project("");
  private routerSubscription: Subscription;

  constructor(private projectService: ProjectService, private router: Router, private cdr: ChangeDetectorRef) {
    // Re-fetch students every time navigation ends on this route
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.getAllProjects();
      });
  }

  ngOnInit(): void {
    this.getAllProjects();
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }
  getAllProjects(): void {
    this.projectService.getAllProjects().subscribe({
      next: (data: Project[]) => {
        this.projects = data;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching projects:', error);
      }
    });
  }
  addProject() {
    return this.projectService.createProject(this.project).subscribe(
      data => {
        this.getAllProjects()
        this.project.name = ""
      }
    )
  }
  deleteProject(id: any) {
    return this.projectService.deleteProject(id).subscribe(
      data => {
        this.getAllProjects()
      }
    )
  }
}