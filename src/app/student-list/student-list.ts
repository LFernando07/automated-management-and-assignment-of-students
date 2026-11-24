import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Student } from '../student';
import { StudentService } from '../student-service';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-student-list',
  standalone: false,
  templateUrl: './student-list.html',
  styleUrl: './student-list.css',
})
export class StudentList implements OnInit, OnDestroy {
  students: Student[] = [];
  private routerSubscription: Subscription;
  maxProjectsPerStudent: any
  maxProjectsPerStudentS: String = ""
  tempNumber: any

  constructor(private studentService: StudentService, private router: Router, private cdr: ChangeDetectorRef) {
    // Re-fetch students every time navigation ends on this route
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.getAllStudents();
      });
  }

  ngOnInit(): void {
    this.getAllStudents();
    this.getMaxProjectsPerStudent();
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }
  getAllStudents(): void {
    this.studentService.getAllStudents().subscribe({
      next: (data: Student[]) => {
        this.students = data;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching students:', error);
      }
    });
  }

  deleteStudent(id: any): void {
    this.studentService.deleteStudent(id).subscribe({
      next: () => {
        console.log(`Student with ID ${id} deleted successfully.`);
        this.getAllStudents(); // Refresh the list after deletion
      },
      error: (error) => {
        console.error(`Error deleting student with ID ${id}:`, error);
      }
    });
  }

  getMaxProjectsPerStudent() {
    this.studentService.getMaxProjectsPerStudents().subscribe(
      data => {
        this.maxProjectsPerStudent = data;
        this.cdr.detectChanges();
      }
    );
  }

  updateMaxProjectsPerStudent() {
    this.studentService.updateMaxProjectsPerStudents(this.tempNumber).subscribe(
      data => {
        this.maxProjectsPerStudentS = data;
        this.cdr.detectChanges();
      }
    );
  }
}
