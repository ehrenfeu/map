function sidePanelShowOnly(panel_id) {
    var children = document.getElementById('sidebar').children;
    for(i=0; i<children.length; i++) {
        if (children[i].id == panel_id)
            children[i].removeAttribute("hidden");
        else
            children[i].setAttribute("hidden", "hidden");
    }
}

