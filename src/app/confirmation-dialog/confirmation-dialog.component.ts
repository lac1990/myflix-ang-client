import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * Represents the Confirmation Dialog Component.
 * This component is responsible for displaying a confirmation dialog box.
 * @constructor
 * @param {MatDialog} dialog - Angular Material's MatDialog service for opening dialogs.
 * @param {string} data - The data to be displayed in the dialog.
 */
@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss',
})
/**
 * Creates an instance of ConfirmationDialogComponent.
 * @param {MatDialog} dialog - Angular Material's MatDialog service for opening dialogs.
 * @param {string} data - The data to be displayed in the dialog.
 */
export class ConfirmationDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: string) {}
}
