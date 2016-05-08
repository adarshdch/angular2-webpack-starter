import {Component} from '@angular/core';
import { NgForm }    from '@angular/common';
import { Donor }    from '../donor';
import {Http, HTTP_PROVIDERS} from '@angular/http';
import {RequestOptions, Headers, Request, RequestMethod} from '@angular/http';
import {AppState} from '../app.service';

/*
 * We're loading this component asynchronously
 * We are using some magic with es6-promise-loader that will wrap the module with a Promise
 * see https://github.com/gdi2290/es6-promise-loader for more info
 */

console.log('`Modal` component loaded asynchronously');

@Component({
  selector: 'donor-registration',
  viewProviders: [
    HTTP_PROVIDERS
  ],
  template: require('./donor-registration.html'),
  directives: [],
  styles: [`
    h1 {
      font-family: Arial, Helvetica, sans-serif
    }
    md-card{
      margin: 25px;
    }
  `]
})
export class DonorRegistration {
  constructor(private http: Http, public appState: AppState) {
  }

  model = new Donor();
  submitted = false;

  onSubmit(form) {

    let userCoordinate = this.appState.get('userCoordinate');
    this.model.long = userCoordinate.lng;
    this.model.lat = userCoordinate.lat;

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    this.http.post('http://localhost:3010/api/donors'
      , JSON.stringify(this.model)
      ,options)
      .map((res: Donor) => res.json())
      .subscribe((res: Donor) => {
        console.log(res)
        $('.modal').modal('toggle');
      });

    this.submitted = true;
  }
  // Reset the form with a new hero AND restore 'pristine' class state
  // by toggling 'active' flag which causes the form
  // to be removed/re-added in a tick via NgIf
  // TODO: Workaround until NgForm has a reset method (#6822)
  active = true;

  ngOnInit() {
    console.log('hello `Modal` component');
  }

  asyncDataWithWebpack() {
    // you can also async load mock data with 'es6-promise-loader'
    // you would do this if you don't want the mock-data bundled
    // remember that 'es6-promise-loader' is a promise
    // var asyncMockDataPromiseFactory = require('es6-promise!assets/mock-data/mock-data.json');
    // setTimeout(() => {
    //
    //   let asyncDataPromise = asyncMockDataPromiseFactory();
    //   asyncDataPromise.then(json => {
    //     console.log('async mockData', json);
    //   });
    //
    // });
  }

}
