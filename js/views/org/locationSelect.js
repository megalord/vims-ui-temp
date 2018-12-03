views.org.locationSelect = (setContent) => {
  return ({ org }) => {
    let loc;

    let renderSelect = (locations) => {
      let locationSelect = document.getElementById('location-select');
      locationSelect.innerHTML = '';
      if (locations.length === 0) {
        locationSelect.appendChild(el('select', { disabled: 'disabled' }));
        return;
      }

      locationSelect.appendChild(el('select', {
        onchange: (event) => {
          [...document.querySelectorAll('#location-buttons .button')].forEach((button) => {
            if (event.target.value && event.target.value !== '-') {
              button.removeAttribute('disabled');
            } else {
              button.setAttribute('disabled', '');
            }
          });
          loc = event.target.value;
        }
      }, [
        el('option', { value: '-' }, 'select a location'),
        ...locations.map((l) => el('option', { value: l.id }, l.name))
      ]));
    }

    setContent(
      el('div', { 'class': 'level' }, [
        el('div', { 'class': 'level-item' }, [
          el('div', { 'class': 'content' }, [
            el('h1', { 'class': 'is-title' }, 'Open Time Clock App'),
            el('div', { 'class': 'field'}, [
              el('div', { id: 'location-select', class: 'select is-fullwidth' }, [
                el('i', { 'class': 'fas fa-spinner fa-pulse fa-5x' })
              ])
            ]),
            el('div', { id: 'location-buttons', 'class': 'field is-grouped is-grouped-centered' }, [
              el('div', { 'class': 'control' }, [
                el('button', {
                  'class': 'button is-primary',
                  disabled: '',
                  onclick: () => {
                    //fetch(`/api/orgs/:${org}/locations/:{loc}/clock`, {
                    //  method: 'POST'
                    //})
                    let clockSession = {
                      location: { id: 1, name: 'Haltom City' },
                      organization: { id: 1, name: 'The Joseph Storehouse' }
                    }
                    localStorage.removeItem('VIMS');
                    localStorage.setItem('VIMS-clock', JSON.stringify(clockSession));
                    router.go('/clock');
                  }
                }, 'Open Clock for Location'),
              ]),
              el('div', { 'class': 'control', }, [
                el('a', {
                  'class': 'button is-info is-outlined',
                  disabled: '',
                  onclick: () => router.go(`locations/form?location=${loc}`)
                }, 'Edit'),
              ]),
              el('div', { 'class': 'control' }, [
                el('button', { 'class': 'button is-danger', disabled: '' }, 'Delete'),
              ]),
            ]),
            el('p', [
              el('a', { href: `locations/form` }, 'Add New Location')
            ])
          ])
        ])
      ])
    );

    fetch(`/api/orgs/${org}/locations.json`)
      .then((response) => response.ok ? response.json() : Promise.reject(response))
      .then(renderSelect)
      .catch((err) => {
        document.querySelector('#location-select i').classList.remove('is-loading');
        console.error(err)
      });
  }
};
