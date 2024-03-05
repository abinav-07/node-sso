window.SearcherDisplay = (function ($) {
  /**
   * This class provides support for displaying quick search text results to users.
   */
  function SearcherDisplay() {}

  SearcherDisplay.prototype.init = function () {
    this._displayQuickSearch();
  };

  /**
   * This method creates the quick text search entry in navigation menu and wires all required events.
   */
  SearcherDisplay.prototype._displayQuickSearch = function () {
    const quickSearch = $(document.createElement('iframe'));
    const body = $('body');
    const self = this;

    quickSearch.attr('src', 'quicksearch.html');
    quickSearch.css('width', '0px');
    quickSearch.css('height', '0px');

    body.append(quickSearch);

    $(window).on('message', function (msg) {
      const msgData = msg.originalEvent.data;

      if (msgData.msgid != 'docstrap.quicksearch.done') {
        return;
      }

      const results = msgData.results || [];

      self._displaySearchResults(results);
    });

    function startSearch() {
      const searchTerms = $('#search-input').prop('value');
      if (searchTerms) {
        quickSearch[0].contentWindow.postMessage(
          {
            searchTerms: searchTerms,
            msgid: 'docstrap.quicksearch.start',
          },
          '*'
        );
      }
    }

    $('#search-input').on('keyup', function (evt) {
      if (evt.keyCode != 13) {
        return;
      }
      startSearch();
      return false;
    });
    $('#search-submit').on('click', function () {
      startSearch();
      return false;
    });
  };

  /**
   * This method displays the quick text search results in a modal dialog.
   */
  SearcherDisplay.prototype._displaySearchResults = function (results) {
    const resultsHolder = $($('#searchResults').find('.modal-body'));
    const fragment = document.createDocumentFragment();
    const resultsList = document.createElement('ul');

    resultsHolder.empty();

    for (let idx = 0; idx < results.length; idx++) {
      const result = results[idx];
      const item = document.createElement('li');
      const link = document.createElement('a');

      link.href = result.id;
      link.innerHTML = result.title;

      item.appendChild(link);
      resultsList.appendChild(item);
    }

    fragment.appendChild(resultsList);
    resultsHolder.append(fragment);

    $('#searchResults').modal({ show: true });
  };

  return new SearcherDisplay();
})($);
