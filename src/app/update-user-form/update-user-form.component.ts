import { Component, Input, OnInit } from '@angular/core';
import { UpdateInfoUserService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-update-user-form',
  templateUrl: './update-user-form.component.html',
  styleUrl: './update-user-form.component.scss',
})
export class UpdateUserFormComponent implements OnInit {
  UserName = '';
  @Input() userData = {
    UserName: '',
    Password: '',
    Email: '',
    Birthdate: Date,
  };
  constructor(
    public fetchApiData: UpdateInfoUserService,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  updateUser(): void {
    this.fetchApiData.updateInfoUser(this.userData).subscribe(
      (resp: any) => {
        this.userData = resp;
        console.log(resp);
        this.snackBar.open('Update', 'Success', {
          duration: 2000,
        });
      },
      () => {
        this.snackBar.open('Please try again', 'No success', {
          duration: 2000,
        });
      }
    );
  }
}
