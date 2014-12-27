var Search = Search || {};

/**
 * @constructor
 * @extends {ol.control.Control}
 * @param {Object=} opt_options Control options.
 */
Search.SearchResults = function(opt_options) {
    var options = opt_options || {};
    var element = document.createElement('div');
    element.id = 'search';
    element.className = 'search';
    element.setAttribute("hidden", "hidden"); 
    var searchfield = document.createElement('INPUT');
    searchfield.setAttribute("type", "text"); 
    searchfield.className = 'inputfield';
    var results = document.createElement('div');
    results.id = 'searchresults';
    element.appendChild(results);
    element.appendChild(searchfield);
    var sidebar = document.getElementById('sidebar');
    while (sidebar.hasChildNodes())
        sidebar.removeChild(sidebar.firstChild);
    function showSearchResults(searchstring) {
        while (results.hasChildNodes())
            results.removeChild(results.firstChild);
        $.getJSON('http://nominatim.openstreetmap.org/search?format=json&limit=15&q='
        + searchstring, function(data) {
            var results = document.getElementById('searchresults');
            var foundresults = false;
            $.each(data, function(key, val) {
                var btn = document.createElement("a");
                btn.className = 'searchresult';
                var t = document.createTextNode(val.display_name);
                btn.appendChild(t);    
                btn.addEventListener('click', function(e) {
                    map.getView().setCenter(ol.proj.transform([parseFloat(val.lon),
                    parseFloat(val.lat)], 'EPSG:4326',
                    'EPSG:3857'));
                });
                results.appendChild(btn);
                foundresults = true
            });

            if (foundresults == false) 
                results.appendChild(document.createTextNode("No results found"));
            });
    }
    searchfield.addEventListener('keypress', function(e) {
        if (e.keyCode == 13) // on enter
            showSearchResults(e.target.value)});

    ol.control.Control.call(this, {
        element: element,
        target: options.target
    });
};
ol.inherits(Search.SearchResults, ol.control.Control);

Search.addSearchPanel = function(opt_options) {
    var options = opt_options || {};
    var element = document.createElement('div');
    element.id = 'search';
    element.className = 'search';
    element.setAttribute("hidden", "hidden"); 
    var sidebar = document.getElementById('sidebar');
    sidebar.appendChild(element);
    var searchfield = document.createElement('INPUT');
    searchfield.setAttribute("type", "text"); 
    searchfield.className = 'inputfield';
    var results = document.createElement('div');
    results.id = 'searchresults';
    element.appendChild(results);
    element.appendChild(searchfield);
    function showSearchResults(searchstring) {
        while (results.hasChildNodes())
            results.removeChild(results.firstChild);
        $.getJSON('http://nominatim.openstreetmap.org/search?format=json&limit=15&q='
        + searchstring, function(data) {
            var results = document.getElementById('searchresults');
            var foundresults = false;
            $.each(data, function(key, val) {
                var btn = document.createElement("a");
                btn.className = 'searchresult';
                var t = document.createTextNode(val.display_name);
                btn.appendChild(t);    
                btn.addEventListener('click', function(e) {
                    map.getView().setCenter(ol.proj.transform([parseFloat(val.lon),
                    parseFloat(val.lat)], 'EPSG:4326',
                    'EPSG:3857'));
                });
                results.appendChild(btn);
                foundresults = true
            });

            if (foundresults == false) 
                results.appendChild(document.createTextNode("No results found"));
            });
    }
    searchfield.addEventListener('keypress', function(e) {
        if (e.keyCode == 13) // on enter
            showSearchResults(e.target.value)});
};

Search.showOrHideSearch = function(opt_options) {
    var options = opt_options || {};
    var element = document.createElement('a');
    element.className = 'searchicon';
    element.innerHTML = 'S';
    element.setAttribute("title", "Search");
    Search.addSearchPanel();

    element.addEventListener('click', function(e) {
        var search = document.getElementById('search');
        if (search.getAttribute("hidden") == null)
            search.setAttribute("hidden", "hidden");
        else
            sidePanelShowOnly("search");
        }, 
       false);

    ol.control.Control.call(this, {
        element: element,
        target: options.target
    });
};
ol.inherits(Search.showOrHideSearch, ol.control.Control);

Search.registerControl = function() {
    var ctrl = new Search.showOrHideSearch({target: 'showsearch'});
    map.addControl(ctrl);
};
