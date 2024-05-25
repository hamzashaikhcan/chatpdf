const { REPEAT_TYPE, RECUR_PREFERENCES } = require('./Constants');
const moment = require('moment');
const Task = require('./../database/models/Task');

const increment = {
	[REPEAT_TYPE.DAILY]: 'days',
	[REPEAT_TYPE.WEEKLY]: 'weeks',
	[REPEAT_TYPE.MONTHLY]: 'months',
	[REPEAT_TYPE.ANNUALLY]: 'years',
};

const nthWeekdayOfMonth = (year, month, nth, dow) => {
	const d = new Date(year, month - 1, 7 * (nth - 1) + 1);
	const w = d.getDay();
	d.setDate(d.getDate() + ((7 + dow - w) % 7));
	return d;
};

const weekOfMonth = (date) => {
	let weekInYearIndex = date.week();
	if (date.year() !== date.weekYear()) {
		weekInYearIndex = date.clone().subtract(1, 'week').week() + 1;
	}
	let weekIndex = weekInYearIndex - moment(date).startOf('month').week() + 1;
	if (weekIndex > 5) {
		weekIndex = 5;
	}
	return weekIndex;
};
// this function return the isoweekday count of month like this monday in month 4th or 5th
const nthDayInMonth = (year, month, dayOfWeek) => {
	let date = moment().year(year).month(month - 1).endOf('month');
	while (date.day() !== dayOfWeek) {
		date.subtract(1, 'days');
	}
	return Math.ceil(date.date() / 7);
};
// this function return the weekcount of the date like return selected date date have 2 or 3 weekth.
const nthWeekCountOfMonth = (baseDate) => {
	return Math.ceil(baseDate.date() / 7);
};

const incDate = (date, type, repeat_interval, is_monthly_on_day = false, recur_preferences = null) => {
	const newDate = new Date(moment(date).add(repeat_interval, increment[type]));
	const year = newDate.getFullYear();
	const month = newDate.getMonth() + 1;
	// const weekNo = weekOfMonth(moment(date));
	const weekNo = nthWeekCountOfMonth(moment(date));
	const dayOfWeek = moment(date).isoWeekday();

	const format = 'YYYY-MM-DD 00:00:00+00';

	if (increment[type] === 'weeks') {
		return moment(newDate).format(format);
	} else if (increment[type] === 'days') {
		return moment(newDate).format(format);
	} else if (increment[type] === 'months') {
		if (is_monthly_on_day) {
			return moment(newDate).format(format);
		} else {
			if (RECUR_PREFERENCES.START_THE_RECURRENCE_ON_WEEK_EVERY_FOURTH_WEEK_OF_THE_MONTH == recur_preferences) {
				let nextDate = moment(nthWeekdayOfMonth(year, month, 4, dayOfWeek)).format(
					format,
				);
				return nextDate;
			} else if (RECUR_PREFERENCES.START_THE_RECURRENCE_ON_LAST_WEEK_OF_THE_MONTH == recur_preferences) {
				let nextDate = moment(nthWeekdayOfMonth(year, month, nthDayInMonth(year, month, dayOfWeek), dayOfWeek)).format(
					format,
				);
				return nextDate;
			}
			else {
				let nextDate = moment(nthWeekdayOfMonth(year, month, weekNo, dayOfWeek)).format(
					format,
				);
				// let nextDateWeekNo = weekOfMonth(moment(nextDate));
				// if (nextDateWeekNo > weekNo) {
				// 	return moment(nextDate).subtract(nextDateWeekNo - weekNo, 'weeks').format(format);
				// }
				// if (weekNo > nextDateWeekNo) {
				// 	return moment(nextDate).subtract(1, 'weeks').format(format);
				// }
				return nextDate;
			}
		}
	} else {
		return moment(date).add(1, 'years');
	}
};

const createTenativeTasks = async (body, repeat_time) => {
	const st_date = body.start_date;
	let body_copy = {
		...body,
		start_date: body.start_date,
		is_tentative: true,
	};
	let obj = {};
	let future_tasks = [];
	for (let i = 0; i < repeat_time; i++) {
		let nextDate = incDate(
			body_copy.start_date,
			body_copy.repeat_type,
			body_copy.repeat_interval,
		);
		body_copy.start_date = nextDate;
		obj = {
			...body,
			is_tentative: true,
			start_date: nextDate,
		};

		future_tasks.push(obj);
	}

	await Task.query().insert(future_tasks);
	body.start_date = st_date;
};

const isStartDate = (date) => {
	return moment(moment(date).format('YYYY-MM-DD')).isSameOrBefore(
		moment(moment().format('YYYY-MM-DD')),
		'day',
	);
};

// decrement function
const decDate = (date, type, repeat_interval) => {
	const newDate = new Date(moment(date).subtract(repeat_interval, increment[type]));
	const year = newDate.getFullYear();
	const month = newDate.getMonth() + 1;
	const weekNo = weekOfMonth(moment(date));
	const dayOfWeek = moment(date).isoWeekday();
	const format = 'YYYY-MM-DD 00:00:00+00';

	if (increment[type] === 'weeks') {
		return moment(newDate).format(format);
	} else if (increment[type] === 'days') {
		return moment(newDate).format(format);
	} else if (increment[type] === 'months') {
		let nextDate = moment(nthWeekdayOfMonth(year, month, weekNo, dayOfWeek)).format(
			format,
		);
		let nextDateWeekNo = weekOfMonth(moment(nextDate));
		if (nextDateWeekNo > weekNo) {
			return moment(nextDate).subtract(nextDateWeekNo - weekNo, 'weeks').format(format);
		}
		if (weekNo > nextDateWeekNo) {
			return moment(nextDate).subtract(1, 'weeks').format(format);
		}
		return nextDate;

	} else {
		return moment(date).add(1, 'years');
	}
};
module.exports = { incDate, createTenativeTasks, isStartDate, decDate };
