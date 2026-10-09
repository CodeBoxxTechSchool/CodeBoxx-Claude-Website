import React from 'react';
import { Button } from 'react-bootstrap';
import EnrollDrawer from './EnrollDrawer';
import { ENROLL_OPEN_EVENT } from '../lib/enrollDrawer';

// /academy's apply buttons: the page's one island. Each button opens the enroll
// drawer for its program; the drawer reads the program from the title it gets.
// `programs` is [{ title, apply }] (academy.js), `enroll`/`heardAbout` come from
// home.js, the same strings the drawer had on the homepage. TopBar's mobile Enroll Now
// (Layout's `enrollDrawer`) opens it on the first program via ENROLL_OPEN_EVENT.

export default function AcademyApply({ programs, enroll, heardAbout, common, lang }) {
  const [course, setCourse] = React.useState(null);
  React.useEffect(() => {
    const open = () => setCourse(programs[0]?.title ?? null);
    window.addEventListener(ENROLL_OPEN_EVENT, open);
    return () => window.removeEventListener(ENROLL_OPEN_EVENT, open);
  }, [programs]);
  return (
    <React.Fragment>
      <div className="d-flex gap-3 flex-wrap">
        {programs.map((p, i) => (
          <Button
            key={p.title}
            size="lg"
            variant={i === 0 ? 'primary' : 'outline-primary'}
            onClick={() => setCourse(p.title)}
          >
            {p.apply}
          </Button>
        ))}
      </div>
      <EnrollDrawer
        course={course}
        onClose={() => setCourse(null)}
        home={{ enroll, heardAbout }}
        common={common}
        lang={lang}
      />
    </React.Fragment>
  );
}
