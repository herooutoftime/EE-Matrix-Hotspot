<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
 * ExpressionEngine Developer Accessory
 *
 * @package     Default Value
 * @category    Accessory
 * @description Sets Calendar Events Display Order field value to 100 automatically (if empty)
 * @author      Shoe Shine Design & Development
 * @link        http://www.shoeshinedesign.com
 */


class Hotspot_acc
{
  var $name           = 'Hotspot';
  var $id             = 'hotspot';
  var $version        = '1.0';
  var $description    = '';
  var $sections       = array();

  // --------------------------------------------------------------------

  /**
   * Constructor
   */
  function __construct()
  {
    $this->EE =& get_instance();
  }

  // --------------------------------------------------------------------

  /**
   * Set Sections
   */
  function set_sections()
  {
    // hide accessory from footer tabs
//    $this->sections[] = '<script type="text/javascript" charset="utf-8">$("#accessoryTabs a.default_value").parent().remove();</script>';

    $this->EE->cp->load_package_js('hotspot');
//
//    // add css, js and html
//    ee()->cp->add_to_foot('
//        <script type="text/javascript">
//            $(document).ready(function() {
//                var value=$.trim($("#field_id_42").val());
//                if(value.length<1) {
//                    $("#field_id_42").val("100");
//                }
//            });
//        </script>
//        ');
  }

}
// END CLASS

/* End of file acc.default_value.php */
/* Location: ./system/expressionengine/third_party/default_value/acc.default_value.php */