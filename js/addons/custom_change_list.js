function view_custom_page(b) {
    if (b == "add") {
        var a = window.open("/admin/rackraj/customlist/add/?_popup=1", gettext("Add Column List"), "height=500,width=800,resizable=yes,scrollbars=yes");
        a.focus()
    } else {
        jQuery.cookie(model_name + "___custom_view_id", b);
        window.location.reload(false)
    }
}

function dismissAddAnotherPopup(b, a, c) {
    view_custom_page(html_unescape(a));
    b.close()
}

function loadCustomViews() {
    $.ajax({
        type: "GET",
        async: true,
        url: "/internal/ajax/custom_views/?model=" + model_name,
        data: "",
        success: function (d) {
            if (d && d.length > 0) {
                var b = jQuery.cookie(model_name + "___custom_view_id");
                var a = "";
                $.each(d, function (e, g) {
                    var f = "";
                    if ((!b && g.is_default) || b == g.id) {
                        f = 'selected="selected"';
                        was_selected = true
                    }
                    a += "<option " + f + ' value="' + g.id + '">' + g.name + "</option>"
                });
                a = '<select id="custom_view_id" onchange="view_custom_page(this.value);">' + a + "</select>";
                var c = jQuery(".actions");
                if (c.length == 0) {
                    c = jQuery("#changelist-search").children(":first-child")
                }
                c.append("<div style='float:right;'>" + gettext("Column List:   ") + a + "</div><div style='clear:both;'></div>")
            }
        }
    })
}

(function (a) {
    a(document).ready(function (e) {
        function c(f) {
            var j = window.location.search.substring(1);
            var h = j.split("&");
            for (var g = 0; g < h.length; g++) {
                var k = h[g].split("=");
                if (k[0] == f) {
                    return k[1]
                }
            }
        }

        function d(f) {
            return decodeURIComponent((f + "").replace(/\+/g, "%20"))
        }

        var b = location.href;
        if (b.indexOf("device_mobile_view") == -1 && b.indexOf("asset_mobile_view") == -1 && b.indexOf("rack_mobile_view") == -1) {
            if (has_custom_fields) {
                e.ajax({
                    type: "GET",
                    async: true,
                    url: "/internal/ajax/customfilters/?" + modulename,
                    data: "",
                    success: function (j) {
                        if (jQuery("#filter-cust_override").length > 0) {
                            jQuery("#filter-cust_override").parent().hide().prev().hide()
                        }
                        if (j && Object.keys(j).length > 0) {
                            var f = (location.href.indexOf("?") == -1 ? [] : location.href.substring(location.href.indexOf("?") + 1).split("&"));
                            var i = "";
                            var h = decodeURI(window.location.search);
                            var g = h.substring(h.indexOf("?") + 1).split("&");
                            e.each(j, function (l, n) {
                                var k = "?";
                                var m = "";
                                e.each(n.cc_values, function (q, t) {
                                    var u = t[1];
                                    var t = t[0].replace(new RegExp("\\+", "g"), "%2B");
                                    var v = t.substring(t.indexOf("?") + 1);
                                    for (var s = 0; s < f.length; s++) {
                                        var p = f[s].split("=");
                                        var o = (v.indexOf(p[0]) == 0);
                                        if (!o) {
                                            var r = p[0] + "=" + p[1];
                                            t = t + "&" + r;
                                            if (k.indexOf(r) == -1) {
                                                k = k + "&" + r
                                            }
                                        }
                                    }
                                    if (g.indexOf(v) != -1) {
                                        m += '<option selected="selected" value="' + t + '">' + u + "</option>"
                                    } else {
                                        m += '<option value="' + t + '">' + u + "</option>"
                                    }
                                });
                                i += "<h3>" + gettext("By ") + n.cc_name + '</h3><form><select style="width:100%" id="filter-custom-fields" onchange="window.location=this.value">';
                                i += '<option value="' + k + '">' + gettext("All") + "</option>";
                                i += m + "</select></form>"
                            });
                            if (document.getElementById("changelist-filter") != undefined) {
                                e("#side-filters").append(i)
                            } else {
                                e("#changelist-form").before('<div id="changelist-filter"><div id="side-filters"></div><h2>Filter</h2></div></div>');
                                e("#side-filters").append(i);
                                e("#changelist").addClass("filtered")
                            }
                        }
                    }
                })
            }
            loadCustomViews()
        }
    })
})(jQuery);