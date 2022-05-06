import * as React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";

import Calendar from './Calendar';


export const App = () => {
    const script_tag = document.getElementById('config');
    const calendarId = script_tag.getAttribute("data-calendar-id");
    const from = script_tag.getAttribute("data-from");
    const to = script_tag.getAttribute("data-to");
    return script_tag ? <Calendar {...{ calendarId, from, to }} /> : <Router>
        <Routes>
            <Route path="/calendar/:id/events" element={<Calendar />} />
            <Route path="/calendar/:id/events/:from" element={<Calendar />} />
            <Route path="/calendar/:id/events/:from/:to" element={<Calendar />} />
        </Routes>
    </Router>
};