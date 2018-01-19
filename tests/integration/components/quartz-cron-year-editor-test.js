import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { run } from '@ember/runloop';

moduleForComponent('quartz-cron-year-editor', 'Integration | Component | quartz cron year editor', {
  integration: true,
  beforeEach: function() {
    this.set('value', '*');
    this.render(hbs`{{quartz-cron-year-editor value=value}}`);
  },
});

test('it renders different for different values', function(assert) {
  assert.equal(this.$('input[type=radio]').length, 4);
  assert.ok(this.$('input[type=radio][value=all]').prop('checked'));

  assert.ok(this.$('select.range-startfrom').prop('disabled'));
  assert.ok(this.$('select.range-endto').prop('disabled'));
  this.set('value', '2011-2013');
  assert.ok(this.$('input[type=radio][value=range]').prop('checked'));
  assert.equal(this.$('select.range-startfrom').val(), '2011');
  assert.equal(this.$('select.range-endto').val(), '2013');

  assert.ok(this.$('select.step-startfrom').prop('disabled'));
  assert.ok(this.$('input.step-stepvalue').prop('disabled'));
  this.set('value', '2011/2');
  assert.ok(this.$('input[type=radio][value=step]').prop('checked'));
  assert.equal(this.$('select.step-startfrom').val(), '2011');
  assert.equal(this.$('input.step-stepvalue').val(), '2');

  this.$('input[type=checkbox].list-item').each((index, item) => {
    assert.ok(this.$(item).prop('disabled'));
  });
  this.set('value', '2011,2012,2013');
  assert.ok(this.$('input[type=radio][value=list]').prop('checked'));
  assert.equal(this.$('input[type=checkbox].list-item:checked').length, 3);
  assert.equal(this.$('input[type=checkbox].list-item:checked').map((index, item) => {
    return this.$(item).next().text();
  }).get().join(','), '2011,2012,2013');
  this.set('value', '2011');
  assert.ok(this.$('input[type=radio][value=list]').prop('checked'));
  assert.equal(this.$('input[type=checkbox].list-item:checked').length, 1);
  assert.equal(this.$('input[type=checkbox].list-item:checked').map((index, item) => {
    return this.$(item).next().text();
  }).get().join(','), '2011');
});

test('it changes value when range value changed', function(assert) {
  run(() => this.$('input[type=radio][value=range]').click());

  assert.notOk(this.$('input[type=radio][value=all]').prop('checked'));
  assert.notOk(this.$('select.range-startfrom').prop('disabled'));
  assert.notOk(this.$('select.range-endto').prop('disabled'));
  run(() => this.$('.range-startfrom').val('2011').change());
  run(() => this.$('.range-endto').val('2013').change());
  assert.equal(this.get('value'), '2011-2013');
});

test('it changes value when step value changed', function(assert) {
  run(() => this.$('input[type=radio][value=step]').click());

  assert.notOk(this.$('input[type=radio][value=all]').prop('checked'));
  assert.notOk(this.$('select.step-startfrom').prop('disabled'));
  assert.notOk(this.$('select.step-stepvalue').prop('disabled'));
  run(() => this.$('.step-startfrom').val('2011').change());
  run(() => this.$('.step-stepvalue').val('3').change());
  assert.equal(this.get('value'), '2011/3');
});

test('it changes value when list value changed and only 1 list item', function(assert) {
  run(() => this.$('input[type=radio][value=list]').click());

  assert.notOk(this.$('input[type=radio][value=all]').prop('checked'));
  this.$('input[type=checkbox].list-item').each((index, item) => {
    assert.notOk(this.$(item).prop('disabled'));
  });
  let firstItem = this.$('input[type=checkbox].list-item:lt(1)');
  run(() => firstItem.click());
  assert.equal(this.get('value'), firstItem.next('span').text());
});

test('it changes value when list value changed and has n list items', function(assert) {
  run(() => this.$('input[type=radio][value=list]').click());

  assert.notOk(this.$('input[type=radio][value=all]').prop('checked'));
  this.$('input[type=checkbox].list-item').each((index, item) => {
    assert.notOk(this.$(item).prop('disabled'));
  });
  run(() => this.$('input[type=checkbox].list-item:eq(0)').click());
  assert.equal(this.get('value'), this.$('input[type=checkbox].list-item:checked').map((index, item) => {
    return this.$(item).next().text();
  }).get().join(','));
  run(() => this.$('input[type=checkbox].list-item:eq(1)').click());
  assert.equal(this.get('value'), this.$('input[type=checkbox].list-item:checked').map((index, item) => {
    return this.$(item).next().text();
  }).get().join(','));
  run(() => this.$('input[type=checkbox].list-item:eq(2)').click());
  assert.equal(this.get('value'), this.$('input[type=checkbox].list-item:checked').map((index, item) => {
    return this.$(item).next().text();
  }).get().join(','));
  assert.equal(this.get('value').split(',').length, 3);
});