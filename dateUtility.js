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
    
    return yearsArr;
};

exports.getCalendarMonths = function() {
   return moment.monthsShort();
};

exports.getShortCalendarMonths = function() {
  let monthsShortArr =  this.getCalendarMonths(),
      monthsArr = [], month_index = 1, id = "";
  for (let i = 0; i < monthsShortArr.length; i++) {
    if (month_index < 10) {
      id = `0${month_index.toString()}`;
    }
    else {
      id = month_index.toString();
    }
    monthsArr.push({id: id, value: monthsShortArr[i]});
    month_index++;
  }
  return monthsArr;
};

exports.getCalendarDays = function() {
  let daysInMonth = moment().daysInMonth();

  let daysArr = [], current = moment().day();

  while(daysInMonth) {
    daysArr.push(current);
    current++;
    daysInMonth--; 
  }
  return daysArr;
};
