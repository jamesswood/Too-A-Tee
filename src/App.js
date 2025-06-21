import React from 'react';

function App() {
  return React.createElement('div', {
    style: {
      padding: '20px',
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif'
    }
  }, [
    React.createElement('h1', { key: 'title' }, 'Hello World!'),
    React.createElement('p', { key: 'subtitle' }, 'Too-A-Tee App is working!')
  ]);
}

export default App;
