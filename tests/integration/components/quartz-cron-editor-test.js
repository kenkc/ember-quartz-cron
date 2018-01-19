import { moduleForComponent, skip } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('quartz-cron-editor', 'Integration | Component | quartz cron editor', {
  integration: true
});

skip('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{quartz-cron-editor}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#quartz-cron-editor}}
      template block text
    {{/quartz-cron-editor}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
