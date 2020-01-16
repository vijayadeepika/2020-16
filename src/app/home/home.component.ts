import { Component, OnInit, Inject } from '@angular/core';
import { GetdataService } from '../getdata.service';
import { timer } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  mdata: any;
  disColumns: string[] = ['title', 'url', 'created_at', 'author'];
  tableData: MatTableDataSource<any>;
  constructor(private ser:GetdataService,private dialog: MatDialog) { }

  ngOnInit() {
    this.getservice();
  }
getservice()
{
  timer(0, 10000) //poll for new post from API in every 10 seconds
  .pipe(concatMap(() => this.ser.getdata())
  ).subscribe((resp) => {
    this.mdata = resp['hits'];
    console.log("Details", this.mdata);
    this.tableData = new MatTableDataSource(this.mdata);
  });
}
modal(row) {
  const dialogRef = this.dialog.open(OpenModal, {
    width: '600px',
    data: row
  });
 }


setupFilter(column: string) {
  this.tableData.filterPredicate = (d: User, filter: string) => {
    const textToSearch = d[column] && d[column].toLowerCase() || '';
    return textToSearch.indexOf(filter) !== -1;
  };
  
}
 searchFilter(filterValue: string) {
  this.setupFilter('title');
  this.tableData.filter = filterValue.trim().toLowerCase();
}


// setupFilter(x) {
//   this.tableData.filterPredicate = (d,filter) =>(d[x] && d[x].toUpperCase() || null).search(filter) > -1
//   }

//  searchFilter(y) {
//   this.setupFilter('title');
//   this.tableData.filter = y.trim().toUpperCase();
// }
}


export interface User {
  title: string;
  url:string;
  created_at:string;
  author:string;
}
@Component({
  selector: 'open-modal',
  templateUrl: 'modal.html',
})
export class OpenModal{

  constructor(
    private dialogRef: MatDialogRef<OpenModal>,
    @Inject(MAT_DIALOG_DATA) private data: User) {}

    onClose() {
    this.dialogRef.close();
  }
}
