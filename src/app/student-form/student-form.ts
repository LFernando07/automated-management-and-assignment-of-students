import { Component, OnDestroy, OnInit } from '@angular/core';
import { Student } from '../student';
import { StudentService } from '../student-service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-student-form',
  standalone: false,
  templateUrl: './student-form.html',
  styleUrl: './student-form.css',
})
export class StudentForm implements OnInit, OnDestroy {
  student: Student = { name: '', average: 0, projects: [] };
  isOutOfRange: boolean = false;
  id: any;
  private paramSubscription: Subscription = Subscription.EMPTY;

  constructor(
    private studentService: StudentService,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Suscribirse a los cambios del paramMap en lugar de usar snapshot
    // Esto asegura que el formulario se actualice aunque Angular reutilice el componente
    this.paramSubscription = this.activeRoute.paramMap.subscribe(params => {
      this.id = Number(params.get('id')) || null;
      // Resetear formulario al cambiar de ruta
      this.student = { name: '', average: 0, projects: [] };
      this.isOutOfRange = false;

      if (this.id) {
        this.studentService.getStudentById(this.id).subscribe({
          next: (data: Student) => {
            this.student = data;
          },
          error: (error) => {
            console.error('Error fetching student:', error);
          }
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.paramSubscription.unsubscribe();
  }

  upsert(): void {
    const average = Number(this.student.average);
    if (average < 0 || average > 10) {
      this.isOutOfRange = true;
      return;
    }
    this.isOutOfRange = false;

    const observer = {
      next: (data: Student) => {
        this.router.navigate(['/students']);
      },
      error: (error: any) => {
        console.error('Error creating/updating student:', error);
      },
      complete: () => {
        console.log('Create/Update complete');
      }
    };

    if (this.id) {
      this.studentService.updateStudent(this.id, this.student).subscribe(observer);
    } else {
      this.studentService.createStudent(this.student).subscribe(observer);
    }
  }
}
