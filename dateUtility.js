// TODO

'use strict';

const moment = require('moment');

exports.getCalendarYears = function(){
    let total_years = moment().diff(moment([1980]), 'years');
  
    console.log("Difference in years: ", total_years);
    
    let yearsArr = [], currentYear = moment().year();
    while (total_years!==0) {
      yearsArr.push(currentYear);
      total_years--;
      currentYear--;
    }
    
    console.log(yearsArr);
};

exports.getCalendarMonths = function() {
   console.log(moment.monthsShort());
};

exports.getCalendarDays = function() {
  let daysInMonth = moment().daysInMonth();

  let daysArr = [], current = moment().day();

  while(daysInMonth) {
    current++;
    daysArr.push(current);
    daysInMonth--;
    
  }
  console.log(daysArr);
};
