console.log('Hotspot called');
(function($){
//$(document).ready(function() {
    console.log($);

    // define the Hotspot global
    if (typeof window.Hotspot == 'undefined')
    {
        window.Hotspot = {};
    }

    Hotspot.image = {};
    Hotspot.config = {
        count: 0,
        entry_id: $('input[name=entry_id]').val()
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
            Hotspot.triggerDialog();
        });
        return $button;
    };

    Hotspot.triggerDialog  = function(event) {
        var data, $dialogContent, template, hotspot, button, $field, field_id;

        data = $(event.currentTarget).data();
        $field = $(event.currentTarget).closest('.publish_field');
        field_id = $field.attr('id').replace('hold_field_', '');

        Hotspot.config.field_id = field_id;
        Hotspot.config.current = data;

        template = '<div class="hotspot-container">'
        +   '<div class="image-container" style="position: relative;">'
        +   '<img class="hotspot-image" style="display:block" src="' + Assets.siteUrl + '?ACT=41&file_id=' + data.id + '&size=800x600' + '" />'
        +   '<form>'
        +   '<input type="hidden" name="XID" value="'+ EE.XID +'" />'
        +   '<input type="hidden" name="entry_id" value="'+ Hotspot.config.entry_id +'" />'
        +   '<input type="hidden" name="asset_id" value="'+ data.id +'" />'
        +   '<input type="hidden" name="field_id" value="'+ Hotspot.config.field_id +'" />'
        +   '</form>'
        +   '</div>'
        +   '<div style="margin-top:10px" class="ui-helper-clearfix action-container">'
        +   '<a class="assets-btn" onclick="Hotspot.createHotspot();">Create Hotspot</a>'
        +   '<span class="success">Hotspots successfully saved!</span>'
        +   '</div>'
        + '</div>';



        $dialogContent = $('<div/>').append(template);
        Hotspot.$dialog = $dialogContent
            //.load($link.attr('href'))
            .dialog({
                autoOpen: false,
                title: "Set Hotspots for " + data.file_name + " (" + data.id + ")",
                width:'auto',
                open: function() {
                    console.log('Dialog open!')
                    Hotspot.getHotspots();
                    Hotspot.getImageSize();
                },
                close: function() {
                    $(this).dialog('destroy').remove()
                }
            });
        Hotspot.$dialog.dialog('open');

    };

    Hotspot.getImageSize = function() {
        var $image;
        $image = $('.hotspot-image');
        $image.load(function() {
            Hotspot.image.width = this.width;
            Hotspot.image.height = this.height;
        });
    }

    Hotspot.getHotspots = function() {
        var data = {
            url: EE.BASE + "&C=addons_modules&M=show_module_cp&module=Hotspot&method=get",
            data: {
                XID: EE.XID,
                entry_id: Hotspot.config.entry_id,
                asset_id: Hotspot.config.current.id,
                field_id: Hotspot.config.field_id
            }
        }
        var $response = Hotspot.send(data);
        $response.done(function(response) {

            if(response.count < 1) {
                console.log('No Hotspots yet added!');
                return;
            }

            $.each(response.items, function(i, item) {
                Hotspot.createHotspot(item);
            });
        });
        return;
    }

    Hotspot.createHotspot = function(item) {
        var hotspot, symbols = [], symbols_options = '', backgrounds = [], background_options = '', statuses = [], status_options = '', positions = [], position_options = '', current, defaults, selected;

        defaults = {
            title: 'Title #' + Hotspot.config.count,
            text: 'Text #' + Hotspot.config.count,
            x: '50',
            y: '50',
            symbol: 'plus',
            status: 0,
            position: 'top'
        };

        current = $.extend(defaults, item);

        symbols = ['plus', 'minus', 'check', 'remove'];
        for(var i=0;i<=symbols.length-1;i++) {
            selected = '';
            if(current.symbol == symbols[i])
                selected = 'selected';
            symbols_options += '<option value="' + symbols[i] + '" ' + selected + '>' + symbols[i] + '</option>';
        }

        backgrounds = ['black', 'white'];
        for(var i=0;i<=backgrounds.length-1;i++) {
            selected = '';
            if(current.background == backgrounds[i])
                selected = 'selected';
            background_options += '<option value="' + backgrounds[i] + '" ' + selected + '>' + backgrounds[i] + '</option>';
        }

        positions = ['top', 'right', 'bottom', 'left'];
        for(var i=0;i<=positions.length-1;i++) {
            selected = '';
            if(current.position == positions[i])
                selected = 'selected';
            position_options += '<option value="' + positions[i] + '" ' + selected + '>' + positions[i] + '</option>';
        }

        statuses = [0, 1];
        for(var i=0;i<=statuses.length-1;i++) {
            selected = '';
            if(current.status == statuses[i])
                selected = 'selected';
            status_options += '<option value="' + statuses[i] + '" ' + selected + '>' + statuses[i] + '</option>';
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

        hotspot = '<div class="hotspot-spot" data-original-x="' + current.x + '" data-original-y="' + current.y + '" style="position: absolute;top: ' + current.y + '%;left: ' + current.x + '%;background:#fff;padding:5px;">'
        + '<div class="hotspot-spot-symbol" onclick="Hotspot.toggleSpotbox()">' + current.symbol_ent + '</div>'
        + '<div class="hotspot-spot-box" style="display:none">'
            + '<div><label for="title">Title</label>'
            + '<input name="hotspot['+ Hotspot.config.count +'][title]" placeholder="Title" value="'+ current.title +'"/></div>'

            + '<div><label for="text">Text</label>'
            + '<input name="hotspot['+ Hotspot.config.count +'][text]" placeholder="Text" value="'+ current.text +'"/></div>'

            + '<div><label for="symbol">Symbol</label>'
            + '<select name="hotspot['+ Hotspot.config.count +'][symbol]" onchange="Hotspot.changeSymbol(this)">' + symbols_options + '</select></div>'

            + '<div><label for="position">Position</label>'
            + '<select name="hotspot['+ Hotspot.config.count +'][position]" onchange="">' + position_options + '</select></div>'

            + '<div><label for="open">Open?</label>'
            + '<select name="hotspot['+ Hotspot.config.count +'][status]" onchange="">' + status_options + '</select></div>'

            + '<div><label for="background">Background</label>'
            + '<select name="hotspot['+ Hotspot.config.count +'][background]">' + background_options + '</select></div>'

            + '<div><input size="5" data-dragged="0" class="coord coord-x" name="hotspot['+ Hotspot.config.count +'][x]" value="' + current.x + '" /> x <input size="5" data-dragged="0" class="coord coord-y" name="hotspot['+ Hotspot.config.count +'][y]" value="' + current.y + '" /></div>'

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
                //Hotspot.convertToPercentage(Startpos);
                $(this).find('.coord-x').val(Startpos.left);
                $(this).find('.coord-y').val(Startpos.top);
                //$("div#start").text("START: \nLeft: "+ Startpos.left + "\nTop: " + Startpos.top);
            },

            // Find position where image is dropped.
            stop: function(event, ui) {

                // Show dropped position.
                var Stoppos = $(this).position();
                //Hotspot.convertToPercentage(Stoppos);
                $(this).find('.coord-x').val(Stoppos.left);
                $(this).find('.coord-x').data('dragged', 1);

                $(this).find('.coord-y').val(Stoppos.top);
                $(this).find('.coord-y').data('dragged', 1);

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

    Hotspot.resetDrag = function() {
        $('.coord').data('dragged', 0);
    };

    Hotspot.save = function() {
        var data, $form;

        Hotspot.convertToPercentage();

        $form = $('.image-container').find('form');

        data = {
            url: EE.BASE + "&C=addons_modules&M=show_module_cp&module=Hotspot&method=store",
            data: $form.serialize()
        };

        Hotspot.send(data);

        Hotspot.resetDrag();

        return false;
    };

    Hotspot.convertToPercentage = function(positions) {
        var $coords, img_width, img_height;

        img_width = Hotspot.image.width;
        img_height = Hotspot.image.height;

        $coords = $('.coord');
        $coords.each(function(i, item) {
            var value, perc, divider, was_dragged;
            was_dragged = $(item).data('dragged');

            console.log($(item).attr('name') + ': ' + was_dragged);
            if($(item).data('dragged') == '0')
                return;

            value = $(item).val();
            divider = img_width;
            if($(item).hasClass('coord-y'))
                divider = img_height;
            perc = (value/divider) * 100
            console.log(value + ' => ' + perc);
            $(item).val(perc);
        });
        return;
    }

    Hotspot.convertFromPercentage = function(val) {
        var $coords, img_width, img_height;

        img_width = Hotspot.image.width;
        img_height = Hotspot.image.height;
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
        if(typeof Hotspot.row === 'undefined')
            return;
        str_id = Hotspot.row.row.id;
        raw_id = str_id.replace('row_id_', '');
        return raw_id;
    };

    Hotspot.getImageInfoFromRow = function($field) {
        var $tr;

        $tr = $field.find('table tbody tr').first();
        return $tr.data();
    };

    //if(typeof Matrix !== 'undefined') {
    //    Matrix.bind('assets', 'display', function (cell) {
    //        var self = this, $field, imageData;
    //        Hotspot.row = cell;
    //
    //        $field = $('.assets-field', self);
    //        imageData = Hotspot.getImageInfoFromRow($field);
    //
    //        var $buttons = cell.dom.$td.find('.assets-buttons ');
    //        var $button = Hotspot.generateButton(imageData);
    //        $buttons.append($button);
    //        return true;
    //    });
    //}
//})
})(jQuery);
console.log('Hotspot finished');