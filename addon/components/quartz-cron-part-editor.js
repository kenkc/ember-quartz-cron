import EmberObject, { computed, observer } from '@ember/object';
import { alias, equal, or, not } from '@ember/object/computed';
import { once } from "@ember/runloop"
import { isNone } from '@ember/utils';
import { A } from '@ember/array';
import Component from '@ember/component';
import layout from '../templates/components/quartz-cron-part-editor';

const TYPE_ALL = 'all'; // *
const TYPE_NO_SPECIFIC = 'no_specific'; // ?
const TYPE_RANGE = 'range'; // 0-4
const TYPE_LIST = 'list'; // 0,4,8
const TYPE_LIST_AND_RANGE = 'list_and_range'; // 0-4,8-12
const TYPE_STEP = 'step'; // */2 or 2/3(from 2, every 3)
const TYPE_RANGE_AND_STEP = 'range_and_step'; // Step values can be used in conjunction with ranges. 0-23/2
const TYPE_LAST = 'last'; // If used in the day-of-week field by itself, it simply means “7” or “SAT”. But if used in the day-of-week field after another value, it means “the last xxx day of the month” - for example “6L” means “the last friday of the month”. You can also specify an offset from the last day of the month, such as “L-3” which would mean the third-to-last day of the calendar month.
const TYPE_WEEKDAY = 'weekday'; // “the nearest weekday to the 15th of the month”
const TYPE_NTH = 'nth';

const DAYS_OF_A_WEEK = [{
  value: '1', text: '周日'
}, {
  value: '2', text: '周一'
}, {
  value: '3', text: '周二'
}, {
  value: '4', text: '周三'
}, {
  value: '5', text: '周四'
}, {
  value: '6', text: '周五'
}, {
  value: '7', text: '周六'
}];

export default Component.extend({
  layout,

  minimum: 0,
  maximun: 0,

  cronType: computed('value', {
    get() {
      let value = this.get('value');

      if ('*' === value) {
        return TYPE_ALL;
      }
      if ('?' === value) {
        return TYPE_NO_SPECIFIC;
      }
      if (value.match('W')) {
        return TYPE_WEEKDAY;
      }
      if (value.match('L')) {
        return TYPE_LAST;
      }
      if (value.match('#')) {
        return TYPE_NTH;
      }
      if (value.match('/')) {
        return value.match('-') ? TYPE_RANGE_AND_STEP : TYPE_STEP;
      }
      if (value.match(',') && value.match('-')) {
        return TYPE_LIST_AND_RANGE;
      }
      if (value.match('-')) {
        return TYPE_RANGE;
      }
      
      return TYPE_LIST;
    },
    set(_, value) {
      return value;
    }
  }),

  isAll: equal('cronType', TYPE_ALL),
  isNoSpecific: equal('cronType', TYPE_NO_SPECIFIC),
  isList: equal('cronType', TYPE_LIST),
  isRange: equal('cronType', TYPE_RANGE),
  isListAndRange: equal('cronType', TYPE_LIST_AND_RANGE),
  isStep: equal('cronType', TYPE_STEP),
  isRangeAndStep: equal('cronType', TYPE_RANGE_AND_STEP),
  isWeekday: equal('cronType', TYPE_WEEKDAY),
  isLast: equal('cronType', TYPE_LAST),
  isNth: equal('cronType', TYPE_NTH),

  notRange: not('isRange'),
  notStep: not('isStep'),
  notList: not('isList'),
  notWeekday: not('isWeekday'),
  notLast: not('isLast'),
  notNth: not('isNth'),

  isDayOfMonth: equal('partType', 'dayOfMonth'),
  isDayOfWeek: equal('partType', 'dayOfWeek'),
  isDayOfMonthOrDayOfWeek: or('isDayOfMonth', 'isDayOfWeek'),

  startFrom: computed('value', {
    get() {
      let value = this.get('value');
      if (isNone(value)) {
        return '0';
      }

      if (this.get('isRange')) {
        return value.split('-')[0];
      }
      if (this.get('isStep')) {
        return value.split('/')[0];
      }

      return '0';
    },
    set(key, value) {
      return value;
    }
  }),
  
  endTo: computed('value', {
    get() {
      let value = this.get('value');
      if (isNone(value)) {
        return '0';
      }

      if (this.get('isRange')) {
        return value.split('-')[1];
      }

      return '0';
    },
    set(key, value) {
      return value;
    }
  }),

  step: computed('value', {
    get() {
      let value = this.get('value');
      if (isNone(value)) {
        return null;
      }

      if (this.get('isStep')) {
        return value.split('/')[1];
      }

      return null;
    },
    set(key, value) {
      return value;
    }
  }),

  list: computed('value', {
    get() {
      let value = this.get('value');
      let selected = [];

      if (this.get('isList')) {
        selected = value.split(',');
      }

      return this.get('selectOptions').map(function(o) {
        return EmberObject.create({
          value: o,
          checked: selected.includes(o)
        });
      });
    },
    set(_, value) {
      return value;
    }
  }),

  weekday: computed('value', {
    get() {
      let w = parseInt(this.get('value').replace('W', ''), 10);
      return isNaN(w) ? '' : '' + w;
    },
    set(_, value) {
      return value;
    }
  }),

  lastDay: computed('value', 'isDayOfMonth', 'isDayOfWeek', {
    get() {
      if (this.get('isDayOfMonth')) {
        return '';
      }

      let l = parseInt(this.get('value').replace('L', ''), 10);
      return isNaN(l) ? '' : '' + l;
    },
    set(_, value) {
      return value;
    }
  }),

  nthDay: computed('value', {
    get() {
      let value = this.get('value');
      if (isNone(value)) {
        return null;
      }

      if (this.get('isNth')) {
        return value.split('#')[0];
      }

      return null;
    },
    set(key, value) {
      return value;
    }
  }),

  nthN: computed('value', {
    get() {
      let value = this.get('value');
      if (isNone(value)) {
        return null;
      }

      if (this.get('isNth')) {
        return value.split('#')[1];
      }

      return null;
    },
    set(key, value) {
      return value;
    }
  }),

  daysOfAWeek: computed(function() {
    return DAYS_OF_A_WEEK;
  }),

  selectOptions: computed('minimum', 'maximum', function () {
    let options = [];
    for (let i = this.get('minimum'); i <= this.get('maximum'); i++) {
      options.push('' + i);
    }

    return options;
  }),

  startFromOptions: alias('selectOptions'),
  endToOptions: alias('selectOptions'),
  // endToOptions: computed('startFrom', 'minimum', 'maximum', function () {
  //   let options = [];
  //   for (let i = Math.max(this.get('startFrom'), this.get('minimum')); i <= this.get('maximum'); i++) {
  //     options.push(i);
  //   }
  //   return options;
  // }),

  valueChanged: observer('cronType', 'startFrom', 'endTo', 'step', 'weekday', 'lastDay', 'nthN', 'nthDay', /*'list.@each.checked', */ function() {
    once(this, 'refreshValue');
  }),

  refreshValue() {
    if (this.get('isAll')) {
      return this.set('value', '*');
    }
    if (this.get('isRange')) {
      return this.set('value', `${this.get('startFrom')}-${this.get('endTo')}`);
    }
    if (this.get('isStep')) {
      return this.set('value', `${this.get('startFrom')}/${this.get('step')}`);
    }
    if (this.get('isList')) {
      // FIXME Error: filterBy() is not a function...
      // return this.set('value', this.get('list').filterBy('checked', true).mapBy('value').join(','));
      let array = A();
      this.get('list').forEach(function(l) {
        if (!l.get('checked')) {
          return;
        }
        array.push(l.get('value'));
      });
      return this.set('value', array.join(','));
    }
    if (this.get('isNoSpecific')) {
      return this.set('value', '?');
    }
    if (this.get('isWeekday')) {
      return this.set('value', `${this.get('weekday')}W`);
    }
    if (this.get('isLast')) {
      return this.set('value', `${this.get('lastDay')}L`);
    }
    if (this.get('isNth')) {
      return this.set('value', `${this.get('nthDay')}#${this.get('nthN')}`);
    }
    // TODO
  },

  actions: {
    toggleListItem: function(listItem) {
      listItem.toggleProperty('checked');
      this.refreshValue(); // FIXME not fired in observer valueChanged
    }
  }
});
