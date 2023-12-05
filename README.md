## Planity events layout

This is a proposed solution to the problem described [here](https://github.com/planity/test_recrutement/tree/master/frontend_senior).
Here are a few considerations :

- The set of events can be edited in the file input.json located in src/assets. The app can be launch using the command "yarn dev".
- The implemented algorithm might be split in two passes (group the events that mutually overlap, then distribute them by columns in each group) for a better readibility. The current implementation merges these two steps to minimize the number of loop iterations. However, in the context of a standard calendar view (10 to 20 events in a day), such a performance concern may not arise.
- The events may all be processed at first to convert their starting dates from string to numbers, so the number of call to timeToMinutes may be minimal. However, as the time format provided in  the raw input (HH:mm) is human-readable and suitable for display, converting it to number at first could lead to back-conversions later, when we need to properly display the event infos.
- We took the liberty of using Vite instead of create-react-app, which was deprecated in early 2023 ; we hope it does not bother.

Thank you for your consideration, have a very nice day 🌿
