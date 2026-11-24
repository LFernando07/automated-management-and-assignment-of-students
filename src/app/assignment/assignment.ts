import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { StudentService } from '../student-service';

@Component({
  selector: 'app-assignment',
  standalone: false,
  templateUrl: './assignment.html',
  styleUrl: './assignment.css',
})
export class Assignment implements OnInit, OnDestroy {
  assgnmentResult: Map<String, String> = new Map();
  private routerSubscription: Subscription;

  constructor(
    private studentService: StudentService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    // Recargar el resultado cada vez que se navega a esta vista
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.getAssignmentResult();
      });
  }

  ngOnInit(): void {
    this.getAssignmentResult();
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }

  getAssignmentResult() {
    this.studentService.getStudentAssignment().subscribe(
      data => {
        this.assgnmentResult = data;
        // NG0100 fix: notificar a Angular explícitamente tras asignar datos async
        // en contexto SSR donde la hidratación ya verificó el estado inicial
        this.cdr.detectChanges();
      }
    );
  }
}
