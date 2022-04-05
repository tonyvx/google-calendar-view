import Avatar from '@mui/material/Avatar';
import { grey } from '@mui/material/colors';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import parse from 'html-react-parser';
import * as React from 'react';
import useScreenDimensions from './useScreenDimensions';
import useScreenOrientation from './useScreenOrientation';

export interface GEvent {
  summary: string;
  description: string;
  start: string;
  startTime: string;
  end: string;
  endTime: string;
  timezone: string;
}

export interface GEventByDate {
  date: string;
  dateFormatted: string;
  day: string;
  events: GEvent[];
}
export default function App() {
  const [events, setEvents] = React.useState<GEventByDate[]>([] as GEventByDate[]);
  const [scrollToId, setScrollToId] = React.useState<string | null>(null);

  React.useEffect(() => {
    console.log("Fetching events...");

    fetch('/events@smcboston.org/events')
      .then(res => res.json())
      .then((data) => {
        setEvents(data);
      })
      .catch(console.log)
  }, []);


  React.useEffect(() => {
    const today = new Date().toJSON().split("T")[0];
    const value = (events.find(e => e.date >= today) || { date: null }).date;
    console.log("Looking up scrollToId ...", value);
    setScrollToId(value);
  }, [events]);

  React.useEffect(() => {
    console.log("Scrolling to scrollToId ...", scrollToId);

    if ((scrollToId != null) && (document.getElementById(scrollToId) != null)) {
      document.getElementById(scrollToId)?.scrollIntoView();
    }
  }, [scrollToId]);

  const  orientation  = useScreenOrientation();
  const  dimension  = useScreenDimensions();

  console.log(orientation, dimension);
  

  return (

    <List sx={{ width: '100%', maxWidth: 400, height: 800, bgcolor: 'background.paper', fontFamily: 'verdana', overflow: 'auto' }}>

      {events.map(e =>
        <div key={e.date}>
          <ListItem key={e.date} id={e.date} alignItems="flex-start">
            <ListItemAvatar
            >
              <Avatar sx={{ bgcolor: '#fdd835' }}>{e.day.substring(0, 2)}</Avatar>
            </ListItemAvatar>

            <ListItemText primary={e.day + " " + e.dateFormatted} sx={{ bgcolor: '#fdd835', color: "white", fontWeight: 'bold' }} primaryTypographyProps={{ fontFamily: 'verdana', variant: "h5", align: "center" }} />

          </ListItem>
          {e.events.map((ev, i) => <div key={i}>
            <Typography
              sx={{ display: 'flex', flexDirection: 'row', fontFamily: 'verdana', bgcolor: '#fdd835', color: grey[500] }}
              component="span"
              variant="subtitle1"
              color="text.primary"
            >
              {ev.startTime} - {ev.endTime} : {ev.summary}

            </Typography>
            <Typography variant="subtitle2" sx={{ fontFamily: 'verdana' }}>{ev.description && parse(ev.description)}</Typography>
            <br />
          </div>)
          }
          <Divider variant="inset" component="li" />
        </div>)}
    </List>
  );
}


