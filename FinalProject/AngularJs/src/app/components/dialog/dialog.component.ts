import { Component, OnInit, Inject, Injectable } from '@angular/core';
import { MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})

export class DialogComponent implements OnInit {

  elemento:string;
  constructor(private snack: MatSnackBar, 
    private dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public message: string) { }

  ngOnInit() {
  }

  onNoClick(){
    this.snack.open('Operación cancelada', '',{
      duration: 3000
    });
    this.dialogRef.close();
  }

}
