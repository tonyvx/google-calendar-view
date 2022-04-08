import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import parse from 'html-react-parser';
import * as React from 'react';
import { useParams } from 'react-router-dom';

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
export default function Calendar() {
  const [events, setEvents] = React.useState<GEventByDate[]>([] as GEventByDate[]);
  const [scrollToId, setScrollToId] = React.useState<string | null>(null);

  const [details] = React.useState(useParams());

  React.useEffect(() => {

    console.log("Fetching events...", details);

    fetch(`/${details.id}/events/${details.from}/${details.to}`)
      .then(res => res.json())
      .then((data) => {
        setEvents(data);
      })
      .catch(console.log)
  }, [details]);


  React.useEffect(() => {
    const today = new Date().toJSON().split("T")[0];
    const value = (events.find(e => e.date >= today) || { date: null }).date;
    console.log("Looking up scrollToId ...", value);
    setScrollToId(value);
  }, [events]);

  React.useEffect(() => {
    console.log("Scrolling to scrollToId ...", scrollToId);

    if ((scrollToId != null) && (document.getElementById(scrollToId) != null)) {
      document.getElementById(scrollToId)?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'start' });
    }
  }, [scrollToId]);

  // const orientation = useScreenOrientation();
  // const dimension = useScreenDimensions();


  // console.log(orientation, dimension);


  return (

    <List sx={{
      marginLeft: "auto", marginRight: "auto", width: "90vw", height: 800, bgcolor: 'background.paper', fontFamily: 'Open Sans', overflow: 'auto', ".row:nth-of-type(odd)": {
        background: "#fdd835"
      }
    }}>

      {events.map((e) =>
        <div key={e.date} style={{ fontFamily: 'Open Sans', paddingLeft: 16, paddingRight: 16 }} className="row">
          <ListItem key={e.date} id={e.date} alignItems="flex-start">
            {/* <ListItemAvatar>
              <Avatar sx={{ bgcolor: (i % 2) ? '#fdd835' : 'white', color: (i % 2) ? 'white' : '#fdd835' }}>{e.day.substring(0, 2)}</Avatar>
            </ListItemAvatar> */}

            <ListItemText primary={e.day + " " + e.dateFormatted} sx={{ fontWeight: 'bold' }} primaryTypographyProps={{ fontFamily: 'Open Sans', variant: "h5", align: "center" }} />

          </ListItem>
          {e.events.map((ev, i) => <div key={i}>
            <Typography
              sx={{ display: 'flex', flexDirection: 'row', fontFamily: 'Open Sans' }}
              component="span"
              variant="subtitle1"
              color="text.primary"
            >
              {ev.startTime} - {ev.endTime} : {ev.summary}

            </Typography>
            {ev.description && <>
              <br />
              <Divider variant="middle" />
              <br />
              <Typography variant="subtitle2" sx={{ fontFamily: 'Open Sans' }}>{parse(replaceHTMBLOB(ev))}</Typography>
              <br />
              <Divider variant="middle" />
            </>}
            <br />
          </div>)
          }
        </div>)
      }
      {events.length == 0 && <div style={{ textAlign: 'center' }}>No Events</div>}
    </List >
  );

  function replaceHTMBLOB(ev: GEvent): string {
    let str: string;
    str = ev.description;
    while (str.indexOf("html-blob")>-1) {
      str = str.replace("<html-blob>", "");
      str = str.replace("</html-blob>", "");
    }
    return str;
  }
}


