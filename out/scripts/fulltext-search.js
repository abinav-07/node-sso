window.Searcher = (function() {
    function Searcher() {
        this._index = lunr(function () {
            this.field('title', {boost: 10})
            this.field('body')
            this.ref('id')
          }) ;

        this._indexContent = undefined;
    }

    Searcher.prototype.init = function() {
        const self = this;

        $("script[type='text/x-docstrap-searchdb']").each(function(idx, item)  {
            self._indexContent = JSON.parse(item.innerHTML);

            for (const entryId in self._indexContent) {
                self._index.add(self._indexContent[entryId]);
            }
        });
    };

    Searcher.prototype.search = function(searchTerm) {
        const results = [];
                const searchResults = this._index.search(searchTerm);

        for (let idx = 0; idx < searchResults.length; idx++) {
            results.push(this._indexContent[searchResults[idx].ref])
        }

        return results;
    };

    return new Searcher();
})();