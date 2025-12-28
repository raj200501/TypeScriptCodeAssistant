declare module 'react';
declare module 'react-dom';
declare module 'react-router-dom';

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
