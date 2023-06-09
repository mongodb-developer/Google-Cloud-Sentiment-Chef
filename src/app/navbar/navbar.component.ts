import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, filter, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { Restaurant } from '../restaurant';
import { RestaurantService } from '../restaurant.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  username = '';
  @ViewChild('searchbar') searchBar: ElementRef;

  toggleSearch: boolean = false;
  itemOptions: Observable<Restaurant[]>;

  searchForm = this.fb.group({
    query: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private restaurantService: RestaurantService,
    private router: Router
  ) {

    this.itemOptions = this.search(this.searchForm.controls.query);
  }

  ngOnInit(): void {
  }

  openSearch() {
    this.toggleSearch = true;
    this.searchBar.nativeElement.focus();
  }

  searchClose() {
    this.searchForm.patchValue({
      query: ''
    }, { emitEvent: false });
    this.toggleSearch = false;
  }

  itemSelected(event: any) {
    const item = event.option.value;
    if (!item || !item._id) {
      return;
    }

    // Workaround for https://github.com/angular/angular/issues/47813
    this.router.navigate(['/']).then(_ => {
      this.router.navigate([`/restaurants/${item._id}`]);
    })

    this.searchClose();
  }

  displayName(item: any) {
    return item.name;
  }

  private search(formControl: FormControl<any>) {
    return formControl.valueChanges.pipe(
      filter(text => text!.length > 1),
      debounceTime(250),
      distinctUntilChanged(),
      switchMap(searchTerm => this.restaurantService.search(searchTerm!)),
    );
  }
}