/**
 * Tests TObserver and TObservable interfaces.
 *
 * @copyright 2022 integereleven. All rights reserved. MIT license.
 */

import { assertSpyCalls, describe, it, spy } from '../dev_deps.ts';

import { fixture } from './fixtures/observe.fixtures.ts';

describe('TFormattable', () => {
  it('should be valid', () => {
    const spyObserver = spy(console, 'log');

    fixture();

    assertSpyCalls(spyObserver, 9);
  });
});
