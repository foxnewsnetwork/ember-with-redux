/**
* Why is this file here? It's because there's a limitation with ember-browserify and
* ember-cli which makes it so that we can't just do `import x from 'npm:x'`
*/
export default function makeInitialState({ makeMap, makeList }) {
  return makeMap({
    activeRoutes: makeList(),
    routesParams: makeMap()
  });
}
