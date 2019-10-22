export default (moment) => {
  moment.updateLocale('en', {
    relativeTime : {
        future: "%s",
        past:   "%s",
        s  : 'sekundu',
        ss : '%d sekund',
        m:  "minutu",
        mm: "%d minut",
        h:  "hodinu",
        hh: "%d hodin",
        d:  "den",
        dd: "%d dnů",
        M:  "měsíc",
        MM: "%d měsíce",
        y:  "rok",
        yy: "%d let"
    }
  });
}