import { PassThrough } from 'stream';

import { renderApp } from './renderApp.js';

describe('renderApp', () => {
  let contentBuffer;

  beforeEach(() => {
    contentBuffer = new Buffer('');
  });

  it('should work for simple string', done => {
    const ApplicationContentStream = renderApp`
      <html>
        content
      </html>
    `;
    const expectedContent = `
      <html>
        content
      </html>
    `;

    ApplicationContentStream.on('data', chunk => {
      contentBuffer = Buffer.concat([contentBuffer, chunk]);
    });

    ApplicationContentStream.on('end', () => {
      expect(contentBuffer.toString('utf-8')).toBe(
        expectedContent.toString('utf-8'),
      );
      done();
    });
  });

  it('should work with simple value', done => {
    const someVar = 'content from var';
    const ApplicationContentStream = renderApp`
      <html>
        ${someVar}
      </html>
    `;

    const expectedContent = `
      <html>
        content from var
      </html>
    `;

    ApplicationContentStream.on('data', chunk => {
      contentBuffer = Buffer.concat([contentBuffer, chunk]);
    });

    ApplicationContentStream.on('end', () => {
      expect(contentBuffer.toString('utf-8').trim()).toBe(
        expectedContent.trim(),
      );
      done();
    });
  });

  it('should work with a Promise', done => {
    const stream = renderApp`
      <html>
        ${new Promise(r => r('content from Promise'))}
      </html>
    `;

    const expectedBuffer = Buffer.from(`
      <html>
        content from Promise
      </html>
    `);

    stream.on('data', chunk => {
      contentBuffer = Buffer.concat([contentBuffer, chunk]);
    });

    stream.on('end', () => {
      expect(contentBuffer.toString('utf-8').trim()).toBe(
        expectedBuffer.toString('utf-8').trim(),
      );
      done();
    });
  });

  it('should work with a stream', done => {
    const contentStream = new PassThrough();

    const stream = renderApp`
      <html>
        ${contentStream}
      </html>  
    `;

    const expectedBuffer = Buffer.from(`
      <html>
        content from stream
      </html>
    `);

    contentStream.push('content from stream');
    contentStream.push(null);

    stream.on('data', chunk => {
      contentBuffer = Buffer.concat([contentBuffer, chunk]);
    });

    stream.on('end', () => {
      expect(contentBuffer.toString('utf-8').trim()).toBe(
        expectedBuffer.toString('utf-8').trim(),
      );
      done();
    });
  });

  it('should work with mixed data', done => {
    const metaTags = '<title>Page Title</title>';
    const styledComponentTagStream = new PassThrough();
    const contentStream = new PassThrough();
    const scriptTags = '<script src="/someSacript.js"></script>';

    const applicationContentStream = renderApp`
      <html>
        <head>
          ${metaTags}
          ${styledComponentTagStream}
        </head>    
        <body>
          ${contentStream}
          ${scriptTags}
        </body>
      </html>  
    `;

    const expectedContent = `
      <html>
        <head>
          <title>Page Title</title>
          <styles>.class1 {}.class2 {}</styles>
        </head>    
        <body>
          <div class="class1"></div><div class="class2"></div>
          <script src="/someSacript.js"></script>
        </body>
      </html> 
    `;

    contentStream.push('<div class="class1"></div>');
    styledComponentTagStream.push('<styles>');
    styledComponentTagStream.push('.class1 {}');
    contentStream.push('<div class="class2"></div>');
    styledComponentTagStream.push('.class2 {}');
    styledComponentTagStream.push('</styles>');
    contentStream.push(null);
    styledComponentTagStream.push(null);

    applicationContentStream.on('data', chunk => {
      contentBuffer = Buffer.concat([contentBuffer, chunk]);
    });

    applicationContentStream.on('end', () => {
      expect(contentBuffer.toString('utf-8').trim()).toBe(
        expectedContent.trim(),
      );
      done();
    });
  });
});
