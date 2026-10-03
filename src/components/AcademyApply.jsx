import React from 'react';
import { Button } from 'react-bootstrap';
import EnrollDrawer from './EnrollDrawer';

// /academy's apply buttons: the page's one island. Each button opens the enroll
// drawer for its program; the drawer reads the program from the title it gets.
// `programs` is [{ title, apply }] (academy.js), `enroll`/`heardAbout` come from
// home.js, the same strings the drawer had on the homepage.
export default function AcademyApply({ programs, enroll, heardAbout, common, lang }) {
  const [course, setCourse] = React.useState(null);
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
