import { Request, Response, NextFunction } from 'express';

// type LogEventTypes = {
//   click: number,
//   login: number,
//   logout: number,
//   comment: number,
//   like: number,
// }

// type LogState<T> = {
//   [key: number]: { [Property in keyof T]: number }
// }

// type LogEventOptions = LogState<LogEventTypes>

const LogEvents = {
  click: 0,
  login: 1,
  logout: 2,
  comment: 3,
  like: 4,
} as const


type LogEvent = keyof typeof LogEvents;



// const eventLogs = {};
const seedWithOldTS = Date.now() - (10 * 60 * 1000)
const eventLogs = {
    [seedWithOldTS]: {
        "comment": 3,
        "click": 3,
        "login": 2,
        "logout": 1,
        "like": 9,
    }
}

runCleanupOnInterval(1);

function logEvent(req: Request, res: Response, next: NextFunction) : Response {
  const eventToLog = req.params.event
  if (!isValidLogEvent(eventToLog)) return res.status(500).send(`${eventToLog} is not a valid event`)
  const now = Date.now();
  // const now = 1673766504965
  if (eventLogs && eventLogs[now] && eventLogs[now][eventToLog]) eventLogs[now][eventToLog] += 1;
  else if (eventLogs[now]) eventLogs[now][eventToLog] = 1
  else eventLogs[now] = { [eventToLog]: 1 } as typeof LogEvents

  return res.json(eventLogs)

}

function getCount(req: Request, res: Response): Response {
  const { event, minutes = 10 } = req.params
  if (!isValidLogEvent(event)) return res.status(500).send(`${event} is not a valid event`)
  const eventCount = countEvents(event, Number(minutes))
  const toReturn = { eventRequested: { [event]: eventCount }} 
  return res.json(toReturn)
}

module.exports = {
  logEvent,
  getCount,
}

function isValidLogEvent(event: string): event is LogEvent {
  return Object.keys(LogEvents).includes(event);
} 

function countEvents(logEvent: LogEvent, mins: number): number {
  const now = Date.now();
  const minutesToMS = mins * 60 * 1000;
  const xMinutesAgo = now - minutesToMS;
  return Object.keys(eventLogs || {}).filter(k => Number(k) >= xMinutesAgo).reduce((acc, ts) => {
    const eventCountMap = eventLogs[ts];
    if (eventCountMap[logEvent]) acc += eventCountMap[logEvent];
    return acc;
  }, 0)

}

function runCleanupOnInterval(mins = 1, thresholdToCleanup = 10): void {
  console.log('interval is set...')
  setInterval(() => {
  const now = Date.now();
  const minutesToMS = thresholdToCleanup * 60 * 1000;
  const xMinutesAgo = now - minutesToMS;
    Object.keys(eventLogs).forEach(ts => {
      if(Number(ts) < xMinutesAgo) delete eventLogs[ts]
    })
    console.log('eventLogs', eventLogs);
  }, mins * 60 * 1000)
}