var Edit = Edit || {};

Edit.JOSMAvailable = false;
Edit.baseUrl = "";

Edit.addPanel = function(opt_options) {
    var options = opt_options || {};
    var element = document.createElement('div');
    element.id = 'edit';
    element.className = 'edit';
    element.setAttribute("hidden", "hidden"); 
    var sidebar = document.getElementById('sidebar');
    sidebar.appendChild(element);
    var text = document.createElement('span');
    text.innerHTML = '<p>For editing the map data you need the JOSM editor ' +
        'with remote control enabled.</p><p>Have you <a target="_blank" ' +
        'href="http://wiki.openseamap.org/wiki/JOSM_and_Plugin">' +
        'installed and configured JOSM</a>?</p>' +
        '<p>If everything is configured correctly, you can also try to load '+
        'the map manually with this <a id="josm_base_url" href="" ' +
        'target="_blank">link</a>.</p>';
    element.appendChild(text);
};

Edit.showOrHideButton = function(opt_options) {
    var options = opt_options || {};
    var element = document.createElement('a');
    element.className = 'editicon';
    element.setAttribute("title", "Edit map");
    Edit.addPanel();

    element.addEventListener('click', function(e) {
        var planner = document.getElementById('edit');
        if (planner.getAttribute("hidden") == null) {
            Edit.stop();
        } else {
            stopAllSidebarServices();
            Edit.start();
        }},
       false);

    ol.control.Control.call(this, {
        element: element,
        target: options.target
    });
};
ol.inherits(Edit.showOrHideButton, ol.control.Control);

Edit.registerControl = function() {
    sidebarservices.push(Edit);
    var ctrl = new Edit.showOrHideButton({target: 'showedit'});
    map.addControl(ctrl);
};

Edit.start = function() {
    var extent = map.getView().calculateExtent(map.getSize());
    extent = ol.proj.transformExtent(extent, map.getView().getProjection() , 'EPSG:4326');
    Edit.baseUrl = 'http://127.0.0.1:8111/load_and_zoom?left=' + extent[0] +
        '&right=' + extent[2] + '&top=' + extent[3] + '&bottom=' + extent[1];
    Edit.JOSMAvailable = false;
    Edit.startJOSM(); // can set JOSMAvailable to true
    setTimeout(function(){
        //do what you need here
        if (!Edit.JOSMAvailable) {
            var panel = document.getElementById('edit');
            document.getElementById('josm_base_url').href = Edit.baseUrl;
            panel.removeAttribute("hidden");
        }
    }, 150);
}

Edit.stop = function() {
    var panel = document.getElementById('edit');
    edit.setAttribute("hidden", "hidden");
}

// in addition to the CC-BY-SA of the wiki feel free to use the following source for any purpose without restrictions (PD)
// credits and additions appreciated: http://wiki.openstreetmap.org/wiki/User:Stephankn
// (has been adapted for openlayers 3 integration by http://wiki.openstreetmap.org/wiki/User:Dice)

Edit.runJOSM = function(version) {
//   alert(version.application + " uses protocol version " + version.protocolversion.major + "." + version.protocolversion.minor);
    Edit.JOSMAvailable = true;
    // IE 9 + localhost ajax DOES NOT WORK, therefore we use a fallback:
    //window.open (baseUrl);
    document.getElementById('josm_call_iframe').src=Edit.baseUrl;
}

Edit.startJOSM = function() {
    var url = "http://127.0.0.1:8111/version";
    var useFallback = false;
    // currently FF3.5, Safari 4 and IE8 implement CORS
    if (XMLHttpRequest) {
       var request = new XMLHttpRequest();
       if ("withCredentials" in request) {
          request.open('GET', url, true);
          request.onreadystatechange = function(){
             if (request.readyState != 4) {
                return;
             }
             if (request.status == 200) {
                Edit.runJOSM(eval('(' + request.responseText + ')'));
             }
          };
          request.send();
       } else if (XDomainRequest) {
          var xdr = new XDomainRequest();
          try {
             xdr.open("get", url);
             xdr.onload = function(){
                Edit.runJOSM(eval('(' + xdr.responseText + ')'));
             };
             xdr.send();
          } catch (e) {
             useFallback = true;
          }
       } else {
          useFallback = true;
       }
    }
    else {
       // no XMLHttpRequest available
       useFallback = true;
    }

    if (useFallback) {
       // Use legacy jsonp call
       var s = document.createElement('script');
       s.src = url + '?jsonp=runJOSM';
       s.type = 'text/javascript';

       if (document.getElementsByTagName('head').length > 0) {
          document.getElementsByTagName('head')[0].appendChild(s);
       }
    }
}
