const search = instantsearch({
  appId: "{{ site.algolia.application_id }}",
  apiKey: "{{ site.algolia.search_only_api_key }}",
  indexName: "{{ site.algolia.index_name }}"
});

const hitTemplate = function(hit) {
  let date = "";
  if (hit.date) {
    date = moment.unix(hit.date).format("MMM D, YYYY");
  }

  let url = `{{ site.baseurl }}${hit.url}#${hit.anchor}`;

  const title = hit._highlightResult.title.value;

  let breadcrumbs = "";
  if (hit._highlightResult.headings) {
    breadcrumbs = hit._highlightResult.headings
      .map(match => {
        return `<span class="post-breadcrumb">${match.value}</span>`;
      })
      .join(" > ");
  }

  const content = hit._highlightResult.html.value;

  return `
                <div class="post-item">
                  <strong class="post-meta">${date}</strong>
                  <h3><a class="post-link" href="${url}">${title}</a></h3>
                  {{#breadcrumbs}}<a href="${url}" class="post-breadcrumbs">${breadcrumbs}</a>{{/breadcrumbs}}
                  <div class="post-snippet">${content}</div>
                </div>
                <hr />
              `;
};

search.addWidget(
  instantsearch.widgets.searchBox({
    container: "#search-searchbar",
    placeholder: "Hledat...",
    poweredBy: true
  })
);

search.addWidget(
  instantsearch.widgets.hits({
    container: "#search-hits",
    templates: {
      item: hitTemplate
    }
  })
);

search.start();
