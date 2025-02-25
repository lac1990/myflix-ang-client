import { Component, OnInit } from '@angular/core';
import {
  AllMoviesService,
  AddFavoriteMovieService,
  UserListService,
  RemoveFavoriteMovieService,
} from '../fetch-api-data.service';

import { MatDialog } from '@angular/material/dialog';
import { DirectorInfoComponent } from '../director-info/director-info.component';
import { SynopsisComponent } from '../synopsis/synopsis.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss',
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  users: any[] = [];
  favorites: any[] = [];

  showLeftArrow: boolean = false;
  showRightArrow: boolean = true;

  scroll(direction: number): void {
    const container = document.querySelector('.movie-grid');
    if (container) {
      const scrollAmount = direction * 300;
      container.scrollLeft += scrollAmount;

      this.updateArrowVisibility(container);
    }
  }
  updateArrowVisibility(container: any): void {
    // Show/hide left arrow
    this.showLeftArrow = container.scrollLeft > 0;

    // Show/hide right arrow
    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    this.showRightArrow = container.scrollLeft < maxScrollLeft;
  }

  constructor(
    public fetchMovies: AllMoviesService,
    public addFavorite: AddFavoriteMovieService,
    public removeFavorite: RemoveFavoriteMovieService,
    public fetchUsers: UserListService,
    public snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  /**
   * Lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   */
  ngOnInit(): void {
    this.getMovies();
    this.getUsers();
  }

  /**
   * Fetches all movies.
   */
  getMovies(): void {
    this.fetchMovies.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      return this.movies;
    });
  }

  /**
   * Opens a dialog to display movie synopsis.
   * @param movie - The movie object.
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
   * Fetches all users.
   */
  getUsers(): void {
    const { UserName } = JSON.parse(
      localStorage.getItem('currentUser') || '{}'
    );
    this.fetchUsers.getUserList().subscribe((resp: any) => {
      this.users = resp;
      const currentUser = this.users.filter(
        (user) => user.UserName === UserName
      );

      this.favorites = currentUser[0].FavoriteMovies;
    });
  }

  /**
   * Checks if a movie is marked as favorite.
   * @param movie - The movie object.
   * @returns True if the movie is favorite, otherwise false.
   */
  isFavorite(movie: any): boolean {
    const favorite = this.favorites.filter((title) => title === movie.Title);
    return favorite.length ? true : false;
  }
  /**
   * Adds a movie title to favorites.
   * @param movie - The movie object.
   */
  addTitleToFavorites(movie: any): void {
    this.addFavorite.addFavoriteMovie(movie.Title).subscribe((resp: any) => {
      console.log(resp);
      // update FavoriteMovies in the local storage
      const user = JSON.parse(localStorage.getItem('currentUser') || '');
      user.FavoriteMovies.push(movie.Title);
      localStorage.setItem('currentUser', JSON.stringify(user));

      // update the favorites array to reflect the favorite state without reloading the page
      this.favorites.push(movie.Title);
      this.snackBar.open('Movie added', 'Success', {
        duration: 2000,
      });
    });
  }

  /**
   * Removes a movie title from favorites.
   * @param movie - The movie object.
   */
  removeTitleFromFavorites(movie: any): void {
    this.removeFavorite
      .removeMovieFromFavorites(movie.Title)
      .subscribe((resp: any) => {
        console.log(resp);

        // update FavoriteMovies in the local storage
        const user = JSON.parse(localStorage.getItem('currentUser') || '');
        user.FavoriteMovies = user.FavoriteMovies.filter(
          (title: string) => title !== movie.Title
        );
        localStorage.setItem('currentUser', JSON.stringify(user));
        // Update the favorites array to reflect the favorite state without reloading the page
        this.favorites = this.favorites.filter(
          (title: string) => title !== movie.Title
        );
        this.snackBar.open('Movie removed', 'Success', {
          duration: 2000,
        });
      });
  }
}
