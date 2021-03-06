# Rxjs3306

Repo steps for RxJS issue #3306

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.7.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Problematic code (app.component.ts)

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

## Expected output

    do: a0
    result: a0
    do: a1
    result: a1
    do: b1
    result: b1
    do: c1
    result: c1

## Actual (bad) output

    do: a0
    result: a0
    do: b0
    do: a1
    result: a1
    do: c0
    do: b1
    result: b1
    do: c1
    result: c1

## Bad import

The bad output arises from mixing approaches to importing RxJS. It appears you can import the entire big RxJS package
or import piecemeal but don't mix the two.

### Good

    import {Observable} from 'rxjs/Observable';
    import {Subject} from 'rxjs/Subject';

### Bad

    import {Observable} from 'rxjs';
    import {Subject} from 'rxjs/Subject';

But note importing Observable from 'rxjs/Rx' causes the problem not to manifest. This works to output the "good" output for some reason:

    import {Observable} from 'rxjs/Rx';
    import {Subject} from 'rxjs/Subject';

Even though 'rxjs' and 'rxjs/Rx' should be equivalent due to the rxjs package.json having a "main" entry.

