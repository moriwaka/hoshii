import assert from 'node:assert/strict';
import { displayText, fitFontSize } from '../app.js';

assert.equal(displayText(''), '5000兆円欲しい!');
assert.equal(displayText('3億円'), '3億円欲しい!');
assert.equal(displayText('  12,345 万円  '), '12,345 万円欲しい!');
assert.ok(fitFontSize('5000兆円欲しい!', 1280, 168) <= 168);
assert.ok(fitFontSize('これはとても長い自由入力テキストです', 1280, 168) < 168);
assert.equal(fitFontSize('5000兆円', 1200, 300, 1500), 240);
assert.equal(fitFontSize('1円', 1200, 300, 450), 300);
assert.ok(fitFontSize('あ'.repeat(40), 1200, 300) < 48);

console.log('maker logic tests passed');
