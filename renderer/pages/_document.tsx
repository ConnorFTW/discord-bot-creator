import NextDocument, { Head, Html, Main, NextScript } from 'next/document';
import React from 'react';
import { getCssText } from '../stitches.config';

export default class MyDocument extends NextDocument {
  render() {
    return (
      <Html>
        <Head>
          <style
            id="stitches"
            dangerouslySetInnerHTML={{ __html: getCssText() }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
