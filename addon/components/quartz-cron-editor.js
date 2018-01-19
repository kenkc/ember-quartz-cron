import { computed, observer } from '@ember/object';
import { alias } from '@ember/object/computed';
import Component from '@ember/component';
import layout from '../templates/components/quartz-cron-editor';

// FIXME
const YEAR_INDEX = 6;
const DAY_OF_WEEK_INDEX = 5;
const MONTH_INDEX = 4;
const DAY_OF_MONTH_INDEX = 3;
const HOUR_INDEX = 2;
const MINUTE_INDEX = 1;
const SECOND_INDEX = 0;

// Field Name    Allowed Values     Allowed Special Characters
// Seconds        0-59               , - * /
// Minutes        0-59               , - * /
// Hours          0-23               , - * /
// Day-of-month   1-31               , - * ? / L W
// Month          1-12 or JAN-DEC    , - * /
// Day-of-Week    1-7 or SUN-SAT     , - * ? / L #

export default Component.extend({
  layout,
  classNames: ['quartz-cron'],

  // cron: '* * * * * ? *',

  parts: computed('cron', function () {
    let partArray = this.get('cron').split(' ');
    if (partArray.length < 6) {
      return {};
    }

    return {
      year: partArray.length === 7 ? partArray[YEAR_INDEX] : '*',
      dayOfWeek: partArray[DAY_OF_WEEK_INDEX],
      month: partArray[MONTH_INDEX],
      dayOfMonth: partArray[DAY_OF_MONTH_INDEX],
      hour: partArray[HOUR_INDEX],
      minute: partArray[MINUTE_INDEX],
      second: partArray[SECOND_INDEX]
    }
  }),

  year: alias('parts.year'),
  dayOfWeek: alias('parts.dayOfWeek'),
  month: alias('parts.month'),
  dayOfMonth: alias('parts.dayOfMonth'),
  hour: alias('parts.hour'),
  minute: alias('parts.minute'),
  second: alias('parts.second'),

  valueChanged: observer('year', 'dayOfWeek', 'month', 'dayOfMonth', 'hour', 'minute', 'second', function() {
    return this.set('cron', `${this.get('second')} ${this.get('minute')} ${this.get('hour')} ${this.get('dayOfMonth')} ${this.get('month')} ${this.get('dayOfWeek')} ${this.get('year')}`);
  })
});
