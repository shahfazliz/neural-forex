import moment from 'moment';

export default function DateTimeAdaptor(dateString) {
    this.__moment = moment.utc(dateString);
}

DateTimeAdaptor.prototype.format = function(formatString = 'YYYY-MM-DD') {
    return this
        .__moment
        .format(formatString);
}

DateTimeAdaptor.prototype.add = function(number, timeframe) {
    this
        .__moment
        .add(number, timeframe);

    return this;
}

DateTimeAdaptor.prototype.day = function () {
    return this
        .__moment
        .day();
}

DateTimeAdaptor.prototype.month = function () {
    return this
        .__moment
        .month();
}

DateTimeAdaptor.prototype.subtract = function(number, timeframe) {
    this
        .__moment
        .subtract(number, timeframe);

    return this;
}

DateTimeAdaptor.prototype.addBusinessDay = function(numberOfDays) {
    const Sunday = 0;
    const Saturday = 6;
    let daysRemaining = numberOfDays;

    while (daysRemaining > 0) {
        this.add(1, 'day');

        daysRemaining -= this.day() !== Sunday
            && this.day() !== Saturday
            ? 1
            : 0;
    }

    return this;
}

DateTimeAdaptor.prototype.subtractBusinessDay = function(numberOfDays) {
    const Sunday = 0;
    const Saturday = 6;
    let daysRemaining = numberOfDays;

    while (daysRemaining > 0) {
        this.subtract(1, 'day');

        daysRemaining -= this.day() !== Sunday
            && this.day() !== Saturday
            ? 1
            : 0;
    }

    return this;
}

DateTimeAdaptor.prototype.valueOf = function () {
    return this
        .__moment
        .valueOf();
}

DateTimeAdaptor.prototype.isAfter = function(momentObj) {
    return this
        .__moment
        .valueOf() > momentObj.valueOf();
}
