import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
/**
 * Represents a dialog component displaying movie synopsis.
 */
@Component({
  selector: 'app-synopsis',
  templateUrl: './synopsis.component.html',
  styleUrl: './synopsis.component.scss',
})
export class SynopsisComponent {
  movie: any;

  /**
   * Initializes the SynopsisComponent.
   * @param {MatDialogRef<SynopsisComponent>} dialogRef - Reference to the dialog.
   * @param {any} data - Data injected into the dialog.
   */
  constructor(
    public dialogRef: MatDialogRef<SynopsisComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.movie = data.movie;
  }
  closeDialog(): void {
    this.dialogRef.close();
  }
}
