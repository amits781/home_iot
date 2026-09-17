import { getHeadersFromToken, hostUrl } from './Utils';

// The gate the signed-in pages sit behind.
//
// `/checkAuth` answers 200 with `{"userStatus": "Authorized"}` (see
// MainController.sayHello). The pages used to treat the 200 alone as a pass,
// so a 200 carrying no body — anything answering on hostUrl that isn't this
// service, a proxy, a misconfigured REACT_APP_HOST_URL — let the caller
// straight through to the device page. The body is the actual proof, so it is
// parsed and checked here: a non-200, an empty or unparseable body, or a
// different userStatus all mean "not authorized".
export const AUTHORIZED_STATUS = 'Authorized';

// ErrorPage reads `cause` off the query string and renders "Permission denied
// to access this site." for this value.
export const UNAUTHORIZED_ROUTE = '/error?cause=user_unauthorized';

export async function isAuthorized(token) {
  const response = await fetch(hostUrl + '/checkAuth', {
    method: 'GET',
    headers: getHeadersFromToken(token),
  });

  if (response.status !== 200) {
    console.log(`Check Auth Fail: HTTP ${response.status}`);
    return false;
  }

  // `response.json()` rejects on an empty body, which is precisely the case
  // that used to slip through, so the parse is part of the check rather than
  // something to guard against.
  let body;
  try {
    body = await response.json();
  } catch {
    console.log('Check Auth Fail: 200 with no readable body');
    return false;
  }

  if (body?.userStatus !== AUTHORIZED_STATUS) {
    console.log(`Check Auth Fail: unexpected body ${JSON.stringify(body)}`);
    return false;
  }

  return true;
}
