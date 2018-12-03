views.clock.index = (setContent) => {
  const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Firday', 'Saturday'];
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'];
  let _clock;

  let renderClock = () => {
    if (!_clock) {
      _clock = document.getElementById('clock');
    }
    let date = new Date();
    let hours = date.getHours();
    let meridiem;
    if (hours >= 12) {
      if (hours > 12) {
        hours -= 12;
      }
      meridiem = 'PM';
    } else {
      meridiem = 'AM';
    }
    _clock.innerHTML = '';
    _clock.appendChild(
      el('div', { 'class': 'content' }, [
        el('h1', `${hours}:${date.getMinutes()} ${meridiem}`),
        el('h3', `${DAYS[date.getDay()]}, ${MONTHS[date.getMonth()]}, ${date.getFullYear()}`) 
      ])
    );
  };

  return ({ session }) => {
    let intervalId;
    setContent(
      el('fragment', [
        el('div', { 'class': 'level' }, [
          el('div', { 'class': 'level-item' }, [
            el('h1', { 'class': 'title' }, session.organization.name),
          ])
        ]),
        el('div', { 'class': 'level' }, [
          el('div', { 'class': 'level-item' }, [
            el('h3', { 'class': 'subtitle' }, session.location.name)
          ]),
          el('div', { 'class': 'level-item' }, [
            el('div', { id: 'clock' })
          ])
        ]),
        el('div', { 'class': 'level' }, [
          el('div', { 'class': 'level-item' }, [
            el('form', [
              el('div', { 'class': 'field'}, [
                el('label', {
                  'class': 'label',
                  for: 'username'
                }, 'Username'),
                el('div', { 'class': 'control has-icons-left' }, [
                  el('input', {
                    'class': 'input',
                    id: 'username',
                    name: 'username',
                    type: 'text'
                  }),
                  el('span', { 'class': 'icon is-small is-left' }, [
                    el('i', { 'class': 'fas fa-user' })
                  ])
                ])
              ]),
              el('div', { 'class': 'field' }, [
                el('button', {
                  'class': 'button is-success',
                  disabled: true,
                }, 'Next')
              ])
            ])
          ])
        ])
      ])
    );
    renderClock();
    intervalId = setInterval(renderClock, 1000);
  }
};
