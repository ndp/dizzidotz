export const installSOErrorHandler = (window) =>
  window.onerror = m =>
      window.location.href = `http://stackoverflow.com/search?q=[js] + ${m}`
