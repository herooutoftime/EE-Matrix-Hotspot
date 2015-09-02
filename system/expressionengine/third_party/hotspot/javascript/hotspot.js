console.log('Hotspot called');
$(document).ready(function() {

    // define the Assets global
    if (typeof window.Hotspot == 'undefined')
    {
        window.Hotspot = {};
    }

    Hotspot.config = {
        count: 0
    };

    Hotspot.generateButton = function(imageData) {
        var $button;

        function prepareAttributes(object) {
            var key, prepared = {};
            for(key in object) {
                if(object.hasOwnProperty(key)) {
                    prepared["data-" + key] = $.trim(object[key]);
                }
            }
            return prepared;
        }

        var attributes = {
            class: 'assets-btn',
            text: 'Add Hotspots'
        };
        $.extend( attributes, prepareAttributes(imageData) );

        $button = $('<a/>', attributes);
        $button.bind('click', function() {
            var self = this;
            Hotspot.triggerDialog(self);
        });
        return $button;
    };

    Hotspot.triggerDialog  = function(button) {
        var data, $dialogContent, template, hotspot;

        data = $(button).data();

        template = '<div class="hotspot-container">'
        +   '<div class="image-container" style="position: relative;">'
        +   '<img src="' + Assets.siteUrl + '?ACT=41&file_id=' + data.id + '&size=800x600' + '" />'
        +   '<form>'
        +   '<input type="hidden" name="XID" value="'+ EE.XID +'" />'
        +   '<input type="hidden" name="matrix_id" value="' + Hotspot.getRowId() + '" />'
        +   '</form>'
        +   '</div>'
        +   '<div class="action-container"><a class="assets-btn" onclick="Hotspot.createHotspot();">Create Hotspot</a></div>'
        + '</div>';



        $dialogContent = $('<div/>').append(template);

        Hotspot.$dialog = $dialogContent
            //.load($link.attr('href'))
            .dialog({
                autoOpen: false,
                title: "Set Hotspots",
                width: 950,
                open: function() {
                    console.log('Dialog open!')
                    Hotspot.getHotspots();
                },
                close: function() {
                    $(this).dialog('destroy').remove()
                }
            });
        Hotspot.$dialog.dialog('open');

    };

    Hotspot.getHotspots = function() {
        var data = {
            url: EE.BASE + "&C=addons_modules&M=show_module_cp&module=Hotspot&method=get",
            data: {
                XID: EE.XID,
                matrix_id: Hotspot.getRowId()
            }
        }
        var $response = Hotspot.send(data);
        $response.done(function(response) {

            Hotspot.config.count = Object.keys(response).length;;
            if(Hotspot.config.count < 1) {
                console.log('No Hotspots yet added!');
                return;
            }

            $.each(response, function(i, item) {
                Hotspot.createHotspot(item);
            });
        });
        return;
    }

    Hotspot.createHotspot = function(item) {
        var hotspot, symbols = [], symbols_options = '', background = [], background_options = '', current, defaults;

        defaults = {
            title: 'Title #' + Hotspot.config.count,
            text: 'Text #' + Hotspot.config.count,
            x: '20',
            y: '20',
            symbol: 'plus'
        };

        current = $.extend(defaults, item);

        symbols = ['plus', 'minus', 'check', 'remove'];
        for(var i=0;i<=symbols.length-1;i++) {
            symbols_options += '<option value="' + symbols[i] + '">' + symbols[i] + '</option>';
        }

        background = ['black', 'white'];
        for(var i=0;i<=background.length-1;i++) {
            background_options += '<option value="' + background[i] + '">' + background[i] + '</option>';
        }

        switch (current.symbol) {
            case 'plus':
                current.symbol_ent =  '&#10133;';
                break;
            case 'minus':
                current.symbol_ent = '&#10134;';
            default:
                current.symbol_ent =  '&#10133;';
        }

        hotspot = '<div class="hotspot-spot" data-original-x="' + current.x + '" data-original-y="' + current.y + '" style="position: absolute;top: ' + current.y + 'px;left: ' + current.x + 'px;background:#fff;padding:5px;">'
        + '<div class="hotspot-spot-symbol" onclick="Hotspot.toggleSpotbox()">' + current.symbol_ent + '</div>'
        + '<div class="hotspot-spot-box" style="display:none">'
            + '<div><label for="title">Title</label>'
            + '<input name="hotspot['+ Hotspot.config.count +'][title]" placeholder="Title" value="'+ current.title +'"/></div>'
            + '<div><label for="text">Text</label>'
            + '<input name="hotspot['+ Hotspot.config.count +'][text]" placeholder="Text" value="'+ current.text +'"/></div>'
            + '<div><label for="symbol">Symbol</label>'
            + '<select name="hotspot['+ Hotspot.config.count +'][symbol]" onchange="Hotspot.changeSymbol(this)">' + symbols_options + '</select></div>'
            + '<div><label for="background">Background</label>'
            + '<select name="hotspot['+ Hotspot.config.count +'][background]">' + background_options + '</select></div>'
            + '<div><input size="5" class="coord-x" name="hotspot['+ Hotspot.config.count +'][x]" value="' + current.x + '" /> x <input size="5" class="coord-y" name="hotspot['+ Hotspot.config.count +'][y]" value="' + current.y + '" /></div>'
            + '<a class="assets-btn" onclick="Hotspot.save()">&#128190;</a>'
            + '<a class="assets-btn" onclick="Hotspot.removeHotspot()">&#9003;</a>'
            + '<a class="assets-btn" onclick="Hotspot.undoMove()">&#9100;</a>'
        + '</div>'
        + '</div>';

        $('.image-container form').append(hotspot);

        $( ".hotspot-spot" ).draggable({
            containment: ".image-container",
            cursor: "move",
            // Find original position of dragged image.
            start: function(event, ui) {

                // Show start dragged position of image.
                var Startpos = $(this).position();
                $(this).find('.coord-x').val(Startpos.left);
                $(this).find('.coord-y').val(Startpos.top);
                //$("div#start").text("START: \nLeft: "+ Startpos.left + "\nTop: " + Startpos.top);
            },

            // Find position where image is dropped.
            stop: function(event, ui) {

                // Show dropped position.
                var Stoppos = $(this).position();
                $(this).find('.coord-x').val(Stoppos.left);
                $(this).find('.coord-y').val(Stoppos.top);
                //$("div#stop").text("STOP: \nLeft: "+ Stoppos.left + "\nTop: " + Stoppos.top);
            }
        });

        Hotspot.config.count++;
    };

    Hotspot.toggleSpotbox = function() {
        $(event.target).parent('.hotspot-spot').find('.hotspot-spot-box').toggle();
    }

    Hotspot.changeSymbol = function(sel) {
        var value = sel.value, symbol_ent;
        var current = {
            symbol: value
        };

        symbol_ent = Hotspot.getSymbol(current);
        console.log(symbol_ent);
        console.log($(sel).closest('.hotspot-spot-box'));
        console.log($(sel).closest('.hotspot-spot-box').parent('.hotspot-spot'));
        console.log($(sel).closest('.hotspot-spot-box').parent('.hotspot-spot').find('.hotspot-spot-symbol'));

        $(sel).closest('.hotspot-spot-box').parent('.hotspot-spot').find('.hotspot-spot-symbol').html(symbol_ent);
    }

    Hotspot.getSymbol = function(current) {
        var symbol_ent;
        console.log(current);
        switch (current.symbol) {
            case 'plus':
                symbol_ent =  '&#10133;';
                break;
            case 'minus':
                symbol_ent = '&#10134;';
                break;
            default:
                symbol_ent =  '&#10133;';
        }

        return symbol_ent;
    }

    Hotspot.undoMove = function() {
        var $hotspot, data;
        $hotspot = $(event.target).closest('.hotspot-spot');
        data = $hotspot.data();

        $hotspot.css({
            top: data.originalY,
            left: data.originalX
        });
        $hotspot.find('.coord-x').val(data.originalX);
        $hotspot.find('.coord-y').val(data.originalY);

    }

    Hotspot.removeHotspot = function() {
        $(event.target).closest('.hotspot-spot').remove();
        //Hotspot.save();
    };

    Hotspot.save = function() {
        var data, $form;
        $form = $('.image-container').find('form');

        data = {
            url: EE.BASE + "&C=addons_modules&M=show_module_cp&module=Hotspot&method=store",
            data: $form.serialize()
        };
        console.log(Hotspot.send(data));
        return false;
    }

    Hotspot.send = function(data) {
        $.extend(data, {
            type: 'POST',
            dataType: 'json'
        });
        return $.ajax(data);
    }

    //Hotspot.generateDialog = function() {
    //
    //};
    //Hotspot.generateDialog();

    Hotspot.getRowId = function() {
        var str_id, raw_id;
        str_id = Hotspot.row.row.id;
        raw_id = str_id.replace('row_id_', '');
        return raw_id;
    };

    Hotspot.getImageInfoFromRow = function($field) {
        var $tr;

        $tr = $field.find('table tbody tr').first();
        return $tr.data();
    };

    if(typeof Matrix !== 'undefined') {
        Matrix.bind('assets', 'display', function (cell) {
            var self = this, $field, imageData;
            Hotspot.row = cell;

            $field = $('.assets-field', self);
            imageData = Hotspot.getImageInfoFromRow($field);

            var $buttons = cell.dom.$td.find('.assets-buttons ');
            var $button = Hotspot.generateButton(imageData);
            $buttons.append($button);
            return true;
        });
    }
})
console.log('Hotspot finished');