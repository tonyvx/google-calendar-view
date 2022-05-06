import * as React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";

import Calendar from './Calendar';


export const App = () => {
    var script_tag = document.getElementById('config');
    return <Router>
        <Routes>
            <Route path="/calendar/events" element={<Calendar {...{ calendarId: script_tag?.getAttribute("data-calendar-id"), from: script_tag?.getAttribute("data-from"), to: script_tag?.getAttribute("data-to") }} />} />
            <Route path="/calendar/:id/events" element={<Calendar />} />
            <Route path="/calendar/:id/events/:from" element={<Calendar />} />
            <Route path="/calendar/:id/events/:from/:to" element={<Calendar />} />
        </Routes>
    </Router>
};