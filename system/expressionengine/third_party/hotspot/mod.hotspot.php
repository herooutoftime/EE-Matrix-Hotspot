<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
 * ExpressionEngine - by EllisLab
 *
 * @package		ExpressionEngine
 * @author		ExpressionEngine Dev Team
 * @copyright	Copyright (c) 2003 - 2011, EllisLab, Inc.
 * @license		http://expressionengine.com/user_guide/license.html
 * @link		http://expressionengine.com
 * @since		Version 2.0
 * @filesource
 */

// ------------------------------------------------------------------------

/**
 * Hotspot
 *
 * @package		ExpressionEngine
 * @subpackage	Addons
 * @category	Module
 * @author		anti
 * @link
 */

class Hotspot {

  public $return_data;

  /**
   * Constructor
   */
  public function __construct()
  {
    $this->EE =& get_instance();
    $this->EE->load->add_package_path(PATH_THIRD.'hotspot/');
//    $this->EE->load->library('freeform_unique_email_lib');
  }

  // ----------------------------------------------------------------

  public function render()
  {
//    error_reporting(-1);
//    ini_set('display_errors', 1);
    $data = $this->getData();
    if(!$data)
      return;
    $o[] = '<ul class="hotspots">';
    foreach($data as $spot) {
      $o[] = $this->EE->load->view('spot', (array) $spot, true);
    }
    $o[] = '</ul>';
    return implode('', $o);
  }

  /**
   * Start on your custom code here...
   */

  public function getData() {
    if (($asset_id = $this->EE->TMPL->fetch_param('asset_id')) === FALSE) return;
    if (($entry_id = $this->EE->TMPL->fetch_param('entry_id')) === FALSE) return;
    if (($field_name = $this->EE->TMPL->fetch_param('field_name')) === FALSE) return;

    $this->EE->db->where('field_name', $field_name);
    $fields = $this->EE->db->get('channel_fields');
    $field_id = $fields->row('field_id');

    $conditions = array(
      'asset_id' => $asset_id,
      'entry_id' => $entry_id,
      'field_id' => $field_id
    );
//    $this->EE->db->save_queries = TRUE;
    $this->EE->db->where($conditions);
    $query = $this->EE->db->get('hotspots');
//    var_dump($this->EE->db->last_query());
    $data = json_decode($query->row('data'));

    if(empty($data) || count($data) < 1)
      return false;

//    $this->EE->output->send_ajax_response(json_decode($data));
    return $data;
  }

}
/* End of file mod.freeform_unique_email.php */
/* Location: /system/expressionengine/third_party/freeform_unique_email/mod.freeform_unique_email.php */