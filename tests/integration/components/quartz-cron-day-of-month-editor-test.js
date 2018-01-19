import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { run } from '@ember/runloop';

moduleForComponent('quartz-cron-day-of-month-editor', 'Integration | Component | quartz cron day of month editor', {
  integration: true,
  beforeEach: function() {
    this.set('value', '*');
    this.render(hbs`{{quartz-cron-day-of-month-editor value=value partType="dayOfMonth"}}`);
  },
});

test('it renders', function(assert) {
  assert.equal(this.$('input[type=radio]').length, 7);
  assert.ok(this.$('input[type=radio][value=all]').prop('checked'));

  // no specific
  assert.notOk(this.$('input[type=radio][value=no_specific]').prop('checked'));
  this.set('value', '?');
  assert.ok(this.$('input[type=radio][value=no_specific]').prop('checked'));

  // weekday
  assert.notOk(this.$('input[type=radio][value=weekday]').prop('checked'));
  assert.ok(this.$('input.weekday').prop('disabled'));
  this.set('value', '5W');
  assert.ok(this.$('input[type=radio][value=weekday]').prop('checked'));
  assert.notOk(this.$('input.weekday').prop('disabled'));
  assert.equal(this.$('input.weekday').val(), '5');

  // last
  assert.notOk(this.$('input[type=radio][value=last]').prop('checked'));
  this.set('value', 'L');
  assert.ok(this.$('input[type=radio][value=last]').prop('checked'));
});

test('it changes value when no specific checked', function(assert) {
  run(() => this.$('input[type=radio][value=no_specific]').click());

  assert.notOk(this.$('input[type=radio][value=all]').prop('checked'));
  assert.equal(this.get('value'), '?');
});

test('it changes value when weekday changed', function(assert) {
  run(() => this.$('input[type=radio][value=weekday]').click());

  assert.notOk(this.$('input[type=radio][value=all]').prop('checked'));
  assert.notOk(this.$('input.weekday').prop('disabled'));
  run(() => this.$('input.weekday').val('5').change());
  assert.equal(this.get('value'), '5W');
});

test('it changes value when last changed', function(assert) {
  run(() => this.$('input[type=radio][value=last]').click());

  assert.notOk(this.$('input[type=radio][value=all]').prop('checked'));
  assert.equal(this.get('value'), 'L');
});
