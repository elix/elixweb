import { Component, h } from 'preact'; // jshint ignore:line
import DocumentationPage from './DocumentationPage';
import DocumentationSection from './DocumentationSection';
import expandDemos from './expandDemos';
import Markdown from './Markdown';
import marked from 'marked';


marked.setOptions({
  gfm: true   // Use GitHub-flavored markdown.
});

/**
 * Documentation for an element or mixin.
 */
export default class ComponentPage extends Component {

  get asyncProperties() {
    const componentName = this.props.request.params.name;

    // Get the JSON for the API documentation.
    const apiPath = `/build/docs/${componentName}.json`;
    const apiPromise = this.props.readSiteFile(apiPath)
    .then(response => {
      return JSON.parse(response);
    });

    // Get the Markdown for the component overview (if it exists).
    const overviewPath = `/content/${componentName}.md`;
    const overviewPromise = this.props.readSiteFile(overviewPath)
    .then(response => {
      // Convert to HTML.
      const html = marked(response);
      return expandDemos(html, this.props.readSiteFile);
    })
    .catch(exception => {
      return null;
    });

    return Promise.all([apiPromise, overviewPromise])
    .then(results => {
      return {
        api: results[0],
        overview: results[1]
      };
    });
  }

  render(props) {

    const api = props.api;
    const apiHeader = api[0];

    const overview = props.overview ?
      // Found an overview for the component.
      (<section dangerouslySetInnerHTML={{ __html: props.overview }} />) :

      // No overview for this component, use the jsDoc header docs instead.
      (
        <section>
          <h1>{apiHeader.name}</h1>
          <Markdown markdown={apiHeader.description}/>
        </section>
      );

    return (
      <DocumentationPage request={props.request}>
        {overview}
        <DocumentationSection documentation={props.api}/>
      </DocumentationPage>
    );
  }

  get title() {
    return this.props.request.params.name;
  }

}
