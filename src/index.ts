import express, { Express, Router } from 'express';
const { logEvent, getCount } = require('./middleware/index');

const app: Express = express();
const router: Router = express.Router();
const port = 3000;

router.use(express.json());

router.route('/log/:event/:minutes?')
.get(getCount)
.post(logEvent)

app.use(router);
app.listen(port, ()=> {
  console.log(`Server spinning on port ${port}`);
})


/*
Implement void logEvent (string eventType) and int getCountLast10Min(string eventType) for an event counter service that can handle large volume of calls (think millions).
Date. now () -> number of ms since Unix Epoch. E.g. , 12378516278367
const d = new Date();
d.getTime () -> 13647816237812
const now = new Date. now();
e.g. , sample sequence of calls from a call site:
logEvent ("click"); // called this at 9:01am 
logEvent ("click"); // called this at 9:07am 
logEvent ("view"); // called this at 9:07am 
logEvent ("click"); // called this at 9:08am 
logEvent ("click"); // called this at 9:13am
getCountLast10Min("click") -> 3 // called this at 9:14am
*/

/* const events = {
  [timestamp1]: {
    click: 0,
    view: 0,
  },
  [timestamp2]: {
    click: 0,
    view: 0,
  }
}
*/