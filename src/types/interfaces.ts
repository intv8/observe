/**
 * This file exports interfaces used by the the intv8 observe package
 * and its peer and dependant packages.
 *
 * For type aliases, see ./types.ts.
 *
 * @copyright 2022 integereleven. All rights reserved. MIT license.
 */

import type { IDisposable } from '../../deps.ts';

/** Provides a mechanism to push notifications to subscribed {@link TObserver} instances. */
export interface TObservable<T> {
  /** Subscribe a {@link TObserver} to push notifications, returning an `IDisposable` to unsubscribe. */
  subscribe(observer: TObserver<T>): IDisposable;
}

/** Provides a mechanism to receive push notifications from a {@link TObservable}. */
export interface TObserver<T> {
  /** Receive a push notification with new data from a {@link TObservable}. */
  next(value: T): void;

  /** Receive a notification from a {@link TObservable} that an error has occurred. */
  error(error: Error): void;

  /** Receive a notification from a {@link TObservable} that it has finished sending notifications. */
  complete(): void;
}
