export const installSOErrorHandler=r=>r.onerror=o=>r.location.href=`http://stackoverflow.com/search?q=[js] + ${o}`;