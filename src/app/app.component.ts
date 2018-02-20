

import {Component, OnInit} from '@angular/core';

// Should be this import:
//import {Observable} from 'rxjs/Observable';
// Instead of this one:
import {Observable} from 'rxjs';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/mergeAll';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  ngOnInit() {
    let source = new Subject<string[]>();

    // when the source emits a vector of strings, output
    // each string with a 1s delay
    source.switchMap(v => Observable.from(v)
      .map(s => Observable.of(s).delay(1000).do(s => console.log('do: ' + s)))
      // only one active observable at time
      .mergeAll(1)
    ).subscribe(val => console.log('result: ' + val));

    // emit two vectors, 1.5s apart
    Observable.interval(1500).take(2).map(i => ['a' + i, 'b' + i, 'c' + i])
      .subscribe(v => source.next(v));
  }
}
