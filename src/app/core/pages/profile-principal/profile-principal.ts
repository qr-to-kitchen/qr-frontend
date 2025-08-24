import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-profile-principal',
  standalone: false,
  templateUrl: './profile-principal.html',
  styleUrl: './profile-principal.css'
})
export class ProfilePrincipal implements OnInit {
  role: string = '';

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.role = this.route.snapshot.params['role'];
  }
}
