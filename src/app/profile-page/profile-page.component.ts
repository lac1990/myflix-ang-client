import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DirectorInfoComponent } from '../director-info/director-info.component';
import { SynopsisComponent } from '../synopsis/synopsis.component';
// import { Router } from '@angular/router';

import {
  AllMoviesService,
  UserListService,
  AddFavoriteMovieService,
  RemoveFavoriteMovieService,
} from '../fetch-api-data.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
})
export class ProfilePageComponent implements OnInit {
  movies: any[] = [];
  favorites: any[] = [];
  username: string = '';

  /**
   * Lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   */
  ngOnInit(): void {
    this.getFavMovies();
  }

  constructor(
    public snackBar: MatSnackBar,
    private dialog: MatDialog,
    public fetchMovies: AllMoviesService,
    public fetchUsers: UserListService,
    public addFavorite: AddFavoriteMovieService,
    public removeFavorite: RemoveFavoriteMovieService // private router: Router
  ) {}

  /**
   * Fetches all movies.
   */
  openSynopsisDialog(movie: any): void {
    this.dialog.open(SynopsisComponent, {
      data: { movie }, // Pass the movie object to the dialog
      width: '600px',
    });
  }

  /**
   * Opens a dialog to display director information.
   * @param movie - The movie object.
   */
  openDirectorDialog(movie: any): void {
    this.dialog.open(DirectorInfoComponent, {
      data: { directorName: movie.Director },
      width: '600px',
    });
  }

  /**
   * Fetches all movies and filters the favorites
   */
  getFavMovies(): void {
    this.fetchMovies.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      const { UserName, FavoriteMovies } = JSON.parse(
        localStorage.getItem('currentUser') || '{}'
      );
      this.username = UserName;
      this.favorites = this.movies.filter((movie) =>
        FavoriteMovies.includes(movie.Title)
      );
      return this.movies;
    });
  }
  /**
   * Function to determine if a movie is in the favorite list
   * @param movie The movie object to check
   * @returns A boolean indicating whether the movie is a favorite or a message if the favorite list is empty
   */
  isFavorite(movie: any): boolean | string {
    // Filter through the favorite movies array to check if the given movie is present
    const favorite = this.favorites.filter((title) => title === movie.Title);
    // Check if the filtered array has any elements
    if (favorite.length) {
      // If the filtered array is not empty, the movie is a favorite, so return true
      return true;
    } else {
      // If the filtered array is empty, there are no favorite movies, so return a message
      return "Ups, you don't have any favorite movies. Go ahead and add some!";
    }
  }

  /**
   * Removes a movie title from the user's favorite list.
   * Updates the local storage and favorites array accordingly.
   * @param movie The movie object to be removed from favorites.
   */
  removeTitleFromFavorites(movie: any): void {
    this.removeFavorite
      .removeMovieFromFavorites(movie.Title)
      .subscribe((resp: any) => {
        // Update FavoriteMovies in the local storage
        const user = JSON.parse(localStorage.getItem('currentUser') || '');
        user.FavoriteMovies = user.FavoriteMovies.filter(
          (title: string) => title !== movie.Title
        );
        localStorage.setItem('currentUser', JSON.stringify(user));
        // Update the favorites array to reflect the favorite state without reloading the page
        this.favorites = this.favorites.filter(
          (favorite) => favorite.Title !== movie.Title
        );
        this.snackBar.open('Movie removed', 'Success', {
          duration: 2000,
        });
      });
  }
}
