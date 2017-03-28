import { Component, h } from 'preact'; // jshint ignore:line


export default class AppShell extends Component {

  render(props) {

    const titleBar =
      props.titleBar ||
      (props.title && `${props.title} - Elix`) ||
      'Elix';

    return (
      <html lang="en">
        <head>
          <meta charset="utf-8"/>
          <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
          <title>{titleBar}</title>
        </head>
        <body>
          <div id="root">
            Hello, world.
          </div>
        </body>
      </html>
    );
  }

}
