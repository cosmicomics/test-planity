import styles from "./style.module.css";
import input from "./assets/input.json";

const DISPLAYED_TIMERANGE = {
  from: 9,
  to: 21,
};

interface Event {
  id: number;
  start: string;
  duration: number;
}

// convert a time in format 'HH:mm' to the number of minutes from 00:00
const timeToMinutes = (time: string): number => {
  const split = time.split(":");
  const hours = parseInt(split[0]);
  const minutes = parseInt(split[1]);
  return hours * 60 + minutes;
};

// check if two ordered events are overlapping
// (an event that starts when the previous one ends is not considered as overlapping)
const overlap = (previousEvent: Event, nextEvent: Event): boolean =>
  timeToMinutes(previousEvent.start) + previousEvent.duration >
  timeToMinutes(nextEvent.start);

// distribute events throught an appropriate set of groups and columns with the following rules :
// 1 - a group is an overlapping set of events ; it gathers all events that may mutualluy overlap
// 2 - in one group, two overlapping events should not be in the same column
// 3 - if two events start at same time, display first - from left to right - the longest one
const getEventGroups = (events: Event[]): Event[][][] => {
  // when some events start at same time, order them by decreasing duration from left to right
  // (this was not provided as a constraint and is optional)
  events.sort((a, b) => (a.duration > b.duration ? 1 : -1));

  // sort all events by starting time
  events.sort((a, b) =>
    timeToMinutes(a.start) > timeToMinutes(b.start) ? 1 : -1
  );

  // init overlapping groups
  const groups: Event[][][] = [];

  // init first group
  let group: Event[][] = [];

  events.forEach((event) => {
    let overlapsOneEventInGroup = false;
    let firstAvailableColumn = null;
    let columnIndex = 0;

    // in the current overlapping group, loop through the columns and :
    // - look if the event overlaps the last event of at least one column
    // - look for the first column with no overlapping
    while (
      !(overlapsOneEventInGroup && firstAvailableColumn) &&
      columnIndex < group.length
    ) {
      const column = group[columnIndex];
      const columnLastEvent = column[column.length - 1];

      // if the event overlaps the last event of the column
      if (overlap(columnLastEvent, event)) {
        // then it belongs to the group
        overlapsOneEventInGroup = true;
      } else if (!firstAvailableColumn) {
        // if it doesn't overlap, and no available column was previously found,
        // save the column so we can place the event in it, if it belongs to this group
        firstAvailableColumn = column;
      }
      columnIndex++;
    }

    // if the event belongs to the overlapping group
    if (overlapsOneEventInGroup) {
      // if a column is available
      if (firstAvailableColumn) {
        // push the event in it
        firstAvailableColumn.push(event);
      } else {
        // if no column is available, create a new one
        const newColumn = [event];
        group.push(newColumn);
      }
    } else {
      // if the events does not overlap with any column of the group,
      // create a new group with one column containing the event
      group = [[event]];
      groups.push(group);
    }
  });

  return groups;
};

function App() {
  const groups = getEventGroups(input);

  return (
    <div className={styles.container}>
      {groups.map((group) =>
        group.map((column, j) =>
          column.map((event) => (
            <div
              key={event.id}
              className={styles.eventPositioner}
              style={{
                left: `${(100 / group.length) * j}%`,
                top: `${
                  ((timeToMinutes(event.start) -
                    DISPLAYED_TIMERANGE.from * 60) /
                    ((DISPLAYED_TIMERANGE.to - DISPLAYED_TIMERANGE.from) *
                      60)) *
                  100
                }%`,
                width: `${100 / group.length}%`,
                height: `${
                  (event.duration /
                    ((DISPLAYED_TIMERANGE.to - DISPLAYED_TIMERANGE.from) *
                      60)) *
                  100
                }%`,
              }}
            >
              <div className={styles.event}>{event.id}</div>
            </div>
          ))
        )
      )}
    </div>
  );
}

export default App;
