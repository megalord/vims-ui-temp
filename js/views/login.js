views.login = (setContent) => {
  return () => {
    let _form;
    let getForm = () => {
      if (!_form) {
        _form = document.getElementById('login-form');
      }
      return _form;
    };

    let getFormData = () => {
      return [].slice.call(getForm().elements).reduce((acc, input) => {
        if (input.tagName !== 'BUTTON') {
          acc[input.name] = input.value;
        }
        return acc;
      }, {});
    };

    let validFormData = (data) => Object.values(data).every((v) => v);

    let inputChanged = () => {
      let button = document.getElementById('login-submit');
      if (validFormData(getFormData())) {
        button.removeAttribute('disabled');
      } else {
        button.setAttribute('disabled', 'disabled');
      }
    };

    let login = (event) => {
      event.preventDefault();
      event.target.classList.add('is-loading');

      let form = getForm();
      let data = [].slice.call(form.elements).reduce((acc, input) => {
        if (input.tagName !== 'BUTTON') {
          acc[input.name] = input.value;
        }
        return acc;
      }, {});

      localStorage.setItem('VIMS', JSON.stringify(data));
      router.go(`/orgs/${data.organization}`);
      /*
      fetch(form.action, {
        method: form.method,
        body: JSON.stringify(data)
      })
        .then((response) => response.ok ? response.json() : Promise.reject(response))
        .then((session) => {
          localStorage.setItem('VIMS', JSON.stringify(session));
          router.go(`/orgs/${org.id}`);
        })
        .catch((err) => {
          event.target.classList.remove('is-loading');
          document.querySelector('#login-form #error-text').textContent = 'Wrong username or password.';
          console.error(err)
        });
      */
    };

    let renderForm = (orgs) => {
      setContent(
        el('div', { 'class': 'level' }, [
          el('div', { 'class': 'level-item' }, [
            el('form', { id: 'login-form', action: '/login', method: 'post' }, [
              el('div', { 'class': 'field' }, [
                el('label', {
                  'class': 'label',
                  for: 'organization',
                }, 'Organization'),
                el('div', { 'class': 'control has-icons-left' }, [
                  el('div', { 'class': 'select is-fullwidth' }, [
                    el('select', {
                      name: 'organization',
                      oninput: inputChanged
                    }, [
                      el('option', ''),
                      ...orgs.map((org) => el('option', { value: org.id }, org.name))
                    ])
                  ]),
                  el('span', { 'class': 'icon is-small is-left' }, [
                    el('i', { 'class': 'fas fa-globe' })
                  ])
                ])
              ]),
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
                    type: 'text',
                    oninput: inputChanged
                  }),
                  el('span', { 'class': 'icon is-small is-left' }, [
                    el('i', { 'class': 'fas fa-user' })
                  ])
                ])
              ]),
              el('div', { 'class': 'field'}, [
                el('label', {
                  'class': 'label',
                  for: 'password'
                }, 'Password'),
                el('div', { 'class': 'control has-icons-left' }, [
                  el('input', {
                    'class': 'input',
                    id: 'password',
                    name: 'password',
                    type: 'password',
                    oninput: inputChanged
                  }),
                  el('span', { 'class': 'icon is-small is-left' }, [
                    el('i', { 'class': 'fas fa-lock' })
                  ])
                ])
              ]),
              el('div', { 'class': 'field' }, [
                el('button', {
                  id: 'login-submit',
                  'class': 'button is-success',
                  disabled: true,
                  onclick: login
                }, 'Login')
              ]),
              el('p', { id: 'error-text', 'class': 'has-text-danger' })
            ])
          ])
        ])
      );
    };

    setContent(
      el('div', {
        class: 'has-text-centered'
      }, [
        el('i', { 'class': 'fas fa-spinner fa-pulse fa-5x' })
      ])
    );
    fetch('/api/orgs.json')
      .then((response) => response.json())
      .then(renderForm)
      .catch((err) => console.error(err));
  }
};
