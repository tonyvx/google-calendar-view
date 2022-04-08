const { google } = require('googleapis');
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const dayOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


const formatHHMM = (startDateObj) => {
    return startDateObj.toLocaleTimeString([], { timeZone: 'EST', timeZoneOffset: 1, hour: '2-digit', minute: '2-digit' });
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

    let timeMin = from ? new Date(from) : undefined;
    let timeMax = to ? new Date(to) : undefined;
    timeMin = timeMin == 'Invalid Date' ? undefined : timeMin;
    timeMax = timeMax == 'Invalid Date' ? undefined : timeMax;
    console.log("timeMin", timeMin, "timeMax", timeMax);

    const params = {
        calendarId: id,
        maxResults: 300,
        singleEvents: true,
        orderBy: 'startTime',
        timeMax, timeMin
    };

    let data = { items: [] };
    try {
        data = (await calendar.events.list(params)).data;
    } catch (e) {
        data.error = e && e.code;
        console.log(data);
    }
    const eventMap = data.items.map(({ summary, description, start, end }) => {
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

