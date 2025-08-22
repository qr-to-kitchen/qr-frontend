import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-home-principal',
  standalone: false,
  templateUrl: './home-principal.html',
  styleUrl: './home-principal.css'
})
export class HomePrincipal implements OnInit {
  role: string = '';

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.role = this.route.snapshot.params['role'];
  }
}
