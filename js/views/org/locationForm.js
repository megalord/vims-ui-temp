views.org.locationForm = (setContent) => {
  let renderForm = (data, org) => {
    setContent(
      el('div', { 'class': 'level' }, [
        el('div', { 'class': 'level-item' }, [
          el('form', [
            el('h1', { 'class': 'title' }, `${Object.keys(data).length ? 'Edit' : 'Add'} Location`),
            el('div', { 'class': 'field'}, [
              el('label', { 'class': 'label', for: 'name' }, 'Name'),
              el('div', { 'class': 'control' }, [
                el('input', {
                  'class': 'input',
                  id: 'name',
                  name: 'name',
                  type: 'text',
                  value: data.name || ''
                })
              ])
            ]),
            el('div', { 'class': 'field'}, [
              el('label', { 'class': 'label', for: 'address1' }, 'Address line 1'),
              el('div', { 'class': 'control' }, [
                el('input', {
                  'class': 'input',
                  id: 'address1',
                  name: 'address1',
                  type: 'text',
                  value: data.address1 || ''
                })
              ])
            ]),
            el('div', { 'class': 'field'}, [
              el('label', { 'class': 'label', for: 'address2' }, 'Address line 2'),
              el('div', { 'class': 'control' }, [
                el('input', {
                  'class': 'input',
                  id: 'address2',
                  name: 'address2',
                  type: 'text',
                  value: data.address2 || ''
                })
              ])
            ]),
            el('div', { 'class': 'level' }, [
              el('div', { 'class': 'level-item' }, [
                el('div', { 'class': 'field'}, [
                  el('label', { 'class': 'label', for: 'city' }, 'City'),
                  el('div', { 'class': 'control' }, [
                    el('input', {
                      'class': 'input',
                      id: 'city',
                      name: 'city',
                      type: 'text',
                      value: data.city || ''
                    })
                  ])
                ])
              ]),
              el('div', { 'class': 'level-item' }, [
                el('div', { 'class': 'field'}, [
                  el('label', { 'class': 'label', for: 'state' }, 'State'),
                  el('div', { 'class': 'control' }, [
                    el('div', { 'class': 'select' }, [
                      el('select', {
                        'class': 'input',
                        id: 'state',
                        name: 'state',
                        value: data.state || ''
                      }, [
                        el('option', { value: '' }, ''),
                        el('option', { value: 'TX' }, 'TX')
                      ])
                    ])
                  ])
                ])
              ]),
              el('div', { 'class': 'level-item' }, [
                el('div', { 'class': 'field'}, [
                  el('label', { 'class': 'label', for: 'zip' }, 'Zip'),
                  el('div', { 'class': 'control' }, [
                    el('input', {
                      'class': 'input',
                      id: 'zip',
                      name: 'zip',
                      type: 'text',
                      value: data.zip || ''
                    })
                  ])
                ])
              ])
            ]),
            el('div', { 'class': 'field'}, [
              el('label', { 'class': 'label', for: 'notes' }, 'Notes'),
              el('div', { 'class': 'control' }, [
                el('textarea', {
                  'class': 'textarea',
                  id: 'notes',
                  value: data.notes || ''
                })
              ])
            ]),
            el('div', { 'class': 'field is-grouped is-grouped-right' }, [
              el('div', { 'class': 'control' }, [
                el('button', { 'class': 'button is-primary', disabled: '' }, 'Save'),
              ]),
              el('div', { 'class': 'control', }, [
                el('a', { 'class': 'button is-outlined', href: `/orgs/${org}/locations` }, 'Cancel'),
              ])
            ])
          ])
        ])
      ])
    );
  };

  return ({ org }) => {
    let params = location.search.slice(1).split('&').reduce((acc, str) => {
      let [key, value] = str.split('=');
      acc[key] = value;
      return acc;
    }, {});

    if (params.location) {
      setContent(
        el('i', { 'class': 'fas fa-spinner fa-pulse fa-5x' })
      );
      fetch(`/api/orgs/${org}/locations/${params.location}.json`)
        .then((response) => response.ok ? response.json() : Promise.reject(response))
        .then((loc) => renderForm(loc, org))
        .catch((err) => {
          console.error(err)
        });
    } else {
      renderForm({}, org);
    }
  }
};
