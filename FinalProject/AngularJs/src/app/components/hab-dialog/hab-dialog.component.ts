import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-hab-dialog',
  templateUrl: './hab-dialog.component.html',
  styleUrls: ['./hab-dialog.component.css']
})
export class HabDialogComponent implements OnInit {

  constructor(private snack: MatSnackBar,
    private dialogRef: MatDialogRef<HabDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public message:string) { }

  ngOnInit() {
  }

  onNoClick(){
      this.snack.open('Operación cancelada', '',{
        duration:3000,
      });

      this.dialogRef.close();
  }

}
