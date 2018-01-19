import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { run } from '@ember/runloop';

moduleForComponent('quartz-cron-day-of-week-editor', 'Integration | Component | quartz cron day of week editor', {
  integration: true,
  beforeEach: function() {
    this.set('value', '*');
    this.render(hbs`{{quartz-cron-day-of-week-editor value=value partType="dayOfWeek"}}`);
  },
});

test('it renders', function(assert) {
  assert.equal(this.$('input[type=radio]').length, 7);
  assert.ok(this.$('input[type=radio][value=all]').prop('checked'));

  // no specific
  assert.notOk(this.$('input[type=radio][value=no_specific]').prop('checked'));
  this.set('value', '?');
  assert.ok(this.$('input[type=radio][value=no_specific]').prop('checked'));

  // last 5L
  assert.notOk(this.$('input[type=radio][value=last]').prop('checked'));
  this.set('value', '5L');
  assert.ok(this.$('input[type=radio][value=last]').prop('checked'));
  assert.equal(this.$('select.last-day').val(), '5');

  // TODO last L-5
  // TODO last L

  // nth
  assert.notOk(this.$('input[type=radio][value=nth]').prop('checked'));
  assert.ok(this.$('input.nth-n').prop('disabled'));
  assert.ok(this.$('select.nth-day').prop('disabled'));
  this.set('value', '5#2');
  assert.ok(this.$('input[type=radio][value=nth]').prop('checked'));
  assert.notOk(this.$('input.nth-n').prop('disabled'));
  assert.notOk(this.$('select.nth-day').prop('disabled'));
  assert.equal(this.$('input.nth-n').val(), '2');
  assert.equal(this.$('select.nth-day').val(), '5');
});

test('it changes value when no specific checked', function(assert) {
  run(() => this.$('input[type=radio][value=no_specific]').click());

  assert.notOk(this.$('input[type=radio][value=all]').prop('checked'));
  assert.equal(this.get('value'), '?');
});

test('it changes value when last value changed', function(assert) {
  run(() => this.$('input[type=radio][value=last]').click());

  assert.notOk(this.$('input[type=radio][value=all]').prop('checked'));
  assert.notOk(this.$('select.last-day').prop('disabled'));
  run(() => this.$('select.last-day').val('5').change());
  assert.equal(this.get('value'), '5L');
});

test('it changes value when nth value changed', function(assert) {
  run(() => this.$('input[type=radio][value=nth]').click());

  assert.notOk(this.$('input[type=radio][value=all]').prop('checked'));
  assert.notOk(this.$('input.nth-n').prop('disabled'));
  assert.notOk(this.$('select.nth-day').prop('disabled'));
  run(() => this.$('input.nth-n').val('2').change());
  run(() => this.$('select.nth-day').val('5').change());
  assert.equal(this.get('value'), '5#2');
});