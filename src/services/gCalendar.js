const { google } = require('googleapis');
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const dayOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


const formatHHMM = (startDateObj) => {
    const AMPM = (startDateObj.getHours() > 12 ? "PM" : "AM");
    return String(AMPM == "PM" ? startDateObj.getHours() - 12 : startDateObj.getHours()).padStart(2, "0") + ":" + String(startDateObj.getMinutes()).padStart(2, "0") + " " + AMPM;
}

const getDateObject = (start, defaulTime) =>
    new Date(start.dateTime || start.date + "T" + defaulTime);

const getEvents = async (id, from, to) => {
    const calendar = google.calendar({
        version: 'v3',
        auth: process.env.KEY
    });

    const last1year = new Date();
    last1year.setFullYear(new Date().getFullYear() - 1);

    const timeMin = from ? new Date(from) : undefined;
    const timeMax = to ? new Date(to) : undefined;

    const params = {
        calendarId: id,
        maxResults: 300,
        singleEvents: true,
        orderBy: 'startTime',
        timeMax, timeMin
    };

    const events = (await calendar.events.list(params)).data.items;
    const eventMap = events.map(({ summary, description, start, end }) => {
        const startDateObj = getDateObject(start, "00:00:00");
        const endDateObj = getDateObject(end, "00:00:00");
        return { summary, description, start: start.dateTime || start.date, startTime: formatHHMM(startDateObj), end: end.dateTime || end.date, endTime: formatHHMM(endDateObj), timeZone: start.timeZone };
    }).reduce((a, c) => {
        const dateStr = c.start.split("T")[0];
        if (a[dateStr]) {
            a[dateStr] = [...a[dateStr], c];
        } else {
            a[dateStr] = [c];
        }
        return a;
    }, {});

    return Object.keys(eventMap).reduce((list, key) => {
        const dateObj = new Date(eventMap[key][0].start);
        list.push({ date: key, dateFormatted: month[dateObj.getMonth()] + " " + dateObj.getDate(), day: dayOfWeek[dateObj.getDay()], events: eventMap[key] });
        return list;
    }, []);

}
exports.getEvents = getEvents;

