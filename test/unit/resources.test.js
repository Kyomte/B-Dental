import { test } from 'node:test';
import assert from 'node:assert/strict';
import { RESOURCES, firstInvalidField, rowToObj } from '../../lib/resources.js';

test('firstInvalidField passes a fully valid patient', () => {
  const body = {
    firstName: 'Maria', lastName: 'Santos', dob: '1991-04-12',
    phone: '+63 917 222 1010', email: 'maria.s@example.com', sex: 'F',
    address: 'Quezon City', allergies: 'Penicillin', medicalNotes: 'note', insurance: 'Maxicare',
  };
  assert.equal(firstInvalidField(body, RESOURCES.patients), null);
});

test('firstInvalidField flags a bad patient email', () => {
  const body = { firstName: 'A', lastName: 'B', email: 'not-an-email' };
  assert.equal(firstInvalidField(body, RESOURCES.patients), 'email');
});

test('firstInvalidField flags a bad patient phone', () => {
  const body = { firstName: 'A', lastName: 'B', phone: 'call me' };
  assert.equal(firstInvalidField(body, RESOURCES.patients), 'phone');
});

test('firstInvalidField flags a blank required name', () => {
  const body = { firstName: '   ', lastName: 'B' };
  assert.equal(firstInvalidField(body, RESOURCES.patients), 'firstName');
});

test('firstInvalidField flags an out-of-range patient sex', () => {
  const body = { firstName: 'A', lastName: 'B', sex: 'X' };
  assert.equal(firstInvalidField(body, RESOURCES.patients), 'sex');
});

test('firstInvalidField allows blank optional patient fields', () => {
  const body = { firstName: 'A', lastName: 'B', email: '', phone: '', sex: '', address: '' };
  assert.equal(firstInvalidField(body, RESOURCES.patients), null);
});

test('firstInvalidField skips absent fields so partial updates work', () => {
  // Only updating the phone; names absent (undefined) must not be required here.
  assert.equal(firstInvalidField({ phone: '+63 900 000 0000' }, RESOURCES.patients), null);
});

test('firstInvalidField still validates appointment fields (existing behaviour)', () => {
  assert.equal(firstInvalidField({ status: 'scheduled', time: '09:00', date: '2026-05-29' }, RESOURCES.appointments), null);
  assert.equal(firstInvalidField({ status: 'bogus' }, RESOURCES.appointments), 'status');
  assert.equal(firstInvalidField({ time: '9am' }, RESOURCES.appointments), 'time');
  assert.equal(firstInvalidField({ date: '2026/05/29' }, RESOURCES.appointments), 'date');
});

test('rowToObj maps snake_case columns to camelCase with numeric coercion', () => {
  const row = { id: 'i_abc1234', name: 'Floss', category: 'Consumable', sku: 'F-1', unit: 'pack', qty: '31', threshold: '10', price: '90', supplier: 'Oral-B', last_restock: '2026-05-05' };
  const obj = rowToObj(row, RESOURCES.inventory);
  assert.equal(obj.id, 'i_abc1234');
  assert.equal(obj.lastRestock, '2026-05-05');
  assert.strictEqual(obj.qty, 31);     // coerced to Number
  assert.strictEqual(obj.price, 90);
  assert.equal(typeof obj.qty, 'number');
});

test('rowToObj returns null for a null row', () => {
  assert.equal(rowToObj(null, RESOURCES.patients), null);
});
