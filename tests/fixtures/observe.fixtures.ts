/**
 * Test fixtures for the TObserver and TObservable interfaces.
 *
 * @copyright 2022 integereleven. All rights reserved. MIT license.
 */

import type { IDisposable } from '../../deps.ts';
import type { TObservable, TObserver } from '../../mod.ts';

class Location {
  constructor(
    public readonly latitude: number,
    public readonly longitude: number,
  ) {}
}

class LocationReporter implements TObserver<Location> {
  public unsubscriber?: IDisposable;

  constructor(public readonly name: string) {}

  next(value: Location): void {
    console.log(`${this.name} reported: ${value.latitude}, ${value.longitude}`);
  }

  error(error: Error): void {
    console.error(error);
  }

  complete(): void {
    console.log(`${this.name} reported: completed`);
    this.unsubscribe();
  }

  subscribe(observer: TObservable<Location>): void {
    this.unsubscriber = observer.subscribe(this);
  }

  unsubscribe(): void {
    this.unsubscriber?.dispose();
  }
}

class LocationUnsubscriber implements IDisposable {
  #observers: TObserver<Location>[];
  #observer: TObserver<Location>;

  constructor(observers: TObserver<Location>[], observer: TObserver<Location>) {
    this.#observers = observers;
    this.#observer = observer;
  }

  get isDisposed(): boolean {
    return !this.#observers.length;
  }

  dispose(): void {
    const index = this.#observers.indexOf(this.#observer);

    if (index !== -1) {
      this.#observers.splice(index, 1);
    }
  }
}

class LocationTracker implements TObservable<Location> {
  #observers: TObserver<Location>[] = [];

  subscribe(observer: TObserver<Location>): IDisposable {
    this.#observers.push(observer);
    return new LocationUnsubscriber(this.#observers, observer);
  }

  report(location: Location): void {
    for (const observer of this.#observers) {
      observer.next(location);
    }
  }

  complete(): void {
    for (const observer of this.#observers) {
      observer.complete();
    }

    this.#observers = [];
  }
}

export const fixture = () => {
  const provider = new LocationTracker();
  const staticReporter = new LocationReporter('Static');
  const remoteReporter = new LocationReporter('Remote');

  staticReporter.subscribe(provider);
  remoteReporter.subscribe(provider);

  provider.report(new Location(1, 2));
  provider.report(new Location(3, 4));
  provider.report(new Location(5, 6));

  staticReporter.unsubscribe();

  provider.report(new Location(7, 8));
  provider.report(new Location(9, 10));

  provider.complete();
};
