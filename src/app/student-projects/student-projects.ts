import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Student } from '../student';
import { Project } from '../project';
import { StudentService } from '../student-service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-student-projects',
  standalone: false,
  templateUrl: './student-projects.html',
  styleUrl: './student-projects.css',
})
export class StudentProjects implements OnInit, OnDestroy {
  student: Student = new Student('', 0, []);
  availableProjects: Project[] = [];
  projectId: any;
  private paramSubscription: Subscription = Subscription.EMPTY;

  constructor(
    private studentService: StudentService,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // Suscribirse reactivamente a los cambios del parámetro :id
    // Así funciona correctamente si Angular reutiliza el componente
    this.paramSubscription = this.activatedRoute.params.subscribe(params => {
      this.student = new Student('', 0, []);
      this.availableProjects = [];
      this.student.id = params['id'];
      this.refreshPage();
    });
  }

  ngOnDestroy(): void {
    this.paramSubscription.unsubscribe();
  }

  getStudentById() {
    this.studentService.getStudentById(Number(this.student.id)).subscribe(
      data => {
        this.student = data;
        this.cdr.detectChanges();
      }
    );
  }

  GetStudentAvailableProject() {
    this.studentService.getAvailableStudentProjects(this.student.id).subscribe(
      data => {
        this.availableProjects = data;
        this.cdr.detectChanges();
      }
    );
  }

  refreshPage() {
    this.getStudentById();
    this.GetStudentAvailableProject();
  }

  addProject() {
    this.studentService.addProjectToStudent(this.student.id, this.projectId).subscribe(
      data => {
        this.refreshPage();
      }
    );
  }

  deleteProject(project_id: any) {
    this.studentService.deleteProjectFromStudent(this.student.id, project_id).subscribe(
      data => {
        this.refreshPage();
      }
    );
  }
}

