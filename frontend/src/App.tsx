import * as React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";

import Calendar from './Calendar';


export const App = () => (
    <Router>
        <Routes>
            <Route path="/calendar/:id/events" element={<Calendar />} />
            <Route path="/calendar/:id/events/:from" element={<Calendar />} />
            <Route path="/calendar/:id/events/:from/:to" element={<Calendar />} />
        </Routes>
    </Router>);