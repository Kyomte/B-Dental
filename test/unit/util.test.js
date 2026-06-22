import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  uid,
  isValidEmail,
  isValidPhone,
  isValidName,
  isValidDate,
  isValidOptionalText,
} from '../../lib/util.js';

test('uid() produces prefixed, unique-ish ids matching the id shape', () => {
  const a = uid('p');
  const b = uid('p');
  assert.match(a, /^p_[a-z0-9]+$/);
  assert.notEqual(a, b);
  assert.equal(uid().slice(0, 2), 'x_');
});

test('isValidEmail accepts ordinary addresses', () => {
  for (const e of ['a@b.co', 'maria.s@example.com', 'first+tag@sub.domain.io']) {
    assert.equal(isValidEmail(e), true, e);
  }
});

test('isValidEmail rejects malformed addresses', () => {
  for (const e of ['', 'plainstring', 'no@domain', '@example.com', 'a b@example.com', 'two@@example.com', 'spaces @example.com', null, undefined, 42]) {
    assert.equal(isValidEmail(e), false, String(e));
  }
});

test('isValidEmail rejects absurdly long addresses', () => {
  assert.equal(isValidEmail('a'.repeat(250) + '@example.com'), false);
});

test('isValidPhone allows blank and common formats, rejects junk', () => {
  for (const p of ['', null, undefined, '+63 917 222 1010', '(02) 8123-4567', '09171234567']) {
    assert.equal(isValidPhone(p), true, String(p));
  }
  for (const p of ['abc', '12', 'call me', '1'.repeat(40)]) {
    assert.equal(isValidPhone(p), false, String(p));
  }
});

test('isValidName requires non-blank within length', () => {
  assert.equal(isValidName('Maria'), true);
  assert.equal(isValidName('   '), false);
  assert.equal(isValidName(''), false);
  assert.equal(isValidName('x'.repeat(81)), false);
  assert.equal(isValidName(123), false);
});

test('isValidDate accepts ISO dates and blanks only', () => {
  assert.equal(isValidDate('1991-04-12'), true);
  assert.equal(isValidDate(''), true);
  assert.equal(isValidDate(undefined), true);
  assert.equal(isValidDate('04/12/1991'), false);
  assert.equal(isValidDate('1991-4-12'), false);
});

test('isValidOptionalText enforces max length, allows blank', () => {
  assert.equal(isValidOptionalText('', 10), true);
  assert.equal(isValidOptionalText(undefined, 10), true);
  assert.equal(isValidOptionalText('short', 10), true);
  assert.equal(isValidOptionalText('x'.repeat(11), 10), false);
  assert.equal(isValidOptionalText(123, 10), false);
});
