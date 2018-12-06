(function() {

  let main = document.getElementsByTagName('main')[0];
  let navbarEnd = document.getElementsByClassName('navbar-end')[0];

  let setContent = (c) => {
    main.innerHTML = '';
    main.appendChild(c);
  }

  let getSession = () => {
    let raw = localStorage.getItem('VIMS');
    return raw ? JSON.parse(raw) : null;
  };

  let getClockSession = () => {
    let raw = localStorage.getItem('VIMS-clock');
    return raw ? JSON.parse(raw) : null;
  };

  document.addEventListener('DOMContentLoaded', () => {

    router(Object.assign(groupedRoutes({
      '/orgs/:org': {
        pre: ({ org }) => {
          let session = getSession();
          if (!session) {
            router.go('/login', { replace: true });
            return false;
          } else if (`${session.organization}` !== org) {
            router.go(location.pathname.replace(org, session.organization), { replace: true });
            return false;
          } else {
            navbarEnd.innerHTML = '';
            navbarEnd.appendChild(
              el('div', { 'class': 'navbar-item has-dropdown is-hoverable' }, [
                el('a', { 'class': 'navbar-link' }, session.username),
                el('div', { 'class': 'navbar-dropdown is-right' }, [
                  el('a', {
                    'class': 'navbar-item',
                    onclick: () => {
                      localStorage.removeItem('VIMS');
                      router.go('/');
                    }
                  }, 'Logout')
                ])
              ])
            );
          }
        },
        self: ({ org }) => router.go(`/orgs/${org}/locations`, { replace: true }),
        '/locations': {
          self: views.org.locationSelect(setContent),
          '/form': views.org.locationForm(setContent),
        }
      },
      '/clock': {
        pre: (params) => {
          navbarEnd.innerHTML = '';
          let session = getClockSession();
          if (!session) {
            router.go('/login', { replace: true });
            return false;
          }
          params.session = session;
          navbarEnd.appendChild(
            el('a', {
              'class': 'navbar-item',
              onclick: () => {
                localStorage.removeItem('VIMS-clock');
                router.go('/');
              }
            }, 'Exit')
          );
        },
        self: views.clock.index(setContent),
        '/:volunteerId': {
          pre: ({ session, volunteerId }) => {
            fetch(`/api/volunteers/${volunteerId}`)
              .then((response) => response.ok ? response.json() : Promise.reject(response))
              .then((volunteer) => {
                if (session.organization !== volunteer.organization || session.location !== volunteer.location) {
                  router.go('/clock', { replace: true });
                  return false;
                }
              })
              .catch((err) => {
                document.querySelector('#location-select i').classList.remove('is-loading');
                console.error(err)
              })
          },
          self: () => {
          }
        }
      }
    }), {
      '/': () => {
        navbarEnd.innerHTML = '';
        let session = getSession();
        if (session && session.org) {
          router.go(`/orgs/${session.org}`, { replace: true });
        } else {
          router.go('/login', { replace: true });
        }
      },
      '/login': () => {
        navbarEnd.innerHTML = '';
        let session = getSession();
        if (session && session.org) {
          router.go(`/orgs/${session.org}`, { replace: true });
        } else {
          views.login(setContent)()
        }
      },
      else: () => {
        setContent(
          el('div', { 'class': 'level' }, [
            el('div', { 'class': 'level-item' }, [
              el('p', { 'class': 'content' }, [
                el('h1', 'Not Found'),
                el('a', { href: '/' }, 'Go to Home Page')
              ])
            ])
          ])
        );
      }
    }))
  });

})();
