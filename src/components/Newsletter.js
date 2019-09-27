import React from 'react';

export default () => (
  <form
    style={{
      border: '1px solid #ccc',
      padding: '3px',
      textAlign: 'center'
    }}
    action="https://tinyletter.com/janmonschke"
    method="post"
    target="popupwindow"
    onSubmit={openWindow}
  >
    <p>
      <label htmlFor="tlemail">Enter your email address</label>
    </p>
    <p>
      <input type="text" style={{ width: '140px' }} name="email" id="tlemail" />
    </p>
    <input type="hidden" value="1" name="embed" />
    <input type="submit" value="Subscribe" />
  </form>
);

function openWindow() {
  window.open(
    'https://tinyletter.com/janmonschke',
    'popupwindow',
    'scrollbars=yes,width=800,height=600'
  );
  return true;
}
