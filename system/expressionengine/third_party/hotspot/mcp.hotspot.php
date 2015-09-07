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
 * Hotspot Module Control Panel File
 *
 * @package		ExpressionEngine
 * @subpackage	Addons
 * @category	Module
 * @author		anti
 * @link
 */

class Hotspot_mcp {

  public $return_data;

  private $_base_url;

  private $data = array();

  /**
   * Constructor
   */
  public function __construct()
  {
    $this->EE =& get_instance();

    $this->_base_url = BASE.AMP.'C=addons_modules'.AMP.'M=show_module_cp'.AMP.'module=hotspot';

    $this->EE->cp->set_right_nav(array(
      'module_settings' => $this->_base_url.AMP.'method=settings',
      'module_home'	=> $this->_base_url,
      // Add more right nav items here.
    ));
  }

  // ----------------------------------------------------------------

  /**
   * Index Function
   *
   * @return 	void
   */
  public function index()
  {
    $this->EE->view->cp_page_title = lang('dealernet_module_name');

    /**
     * This is the addons home page, add more code here!
     */
  }

  public function settings()
  {
    $this->EE->load->library('table');

    // Set page title
    $this->EE->view->cp_page_title = lang('module_page_title_settings');

    $this->EE->db->get_where('modules', array(
      'module_name'	=> 'Hotspot'
    ));

    $this->EE->db->select('settings');
    $query = $this->EE->db->get('modules')->result();

    $this->EE->db->select('settings');
    $this->EE->db->from('modules');
    $this->EE->db->where('module_name', 'Hotspot');
    $query = $this->EE->db->get();
    $settings = $query->row()->settings;
    $this->data['settings'] = unserialize($settings);

    return $this->EE->load->view('settings', $this->data, TRUE);
  }

  public function get() {
    $entry_id = $this->EE->input->post('entry_id');
    $asset_id = $this->EE->input->post('asset_id');
    $field_id = $this->EE->input->post('field_id');

//    var_dump($entry_id);
//    var_dump($asset_id);

    $this->EE->db->where(array('entry_id' => $entry_id, 'asset_id' => $asset_id, 'field_id' => $field_id));
    $query = $this->EE->db->get('hotspots');
    $data = json_decode($query->row('data'), true);

//    $data_arr = array();
//    foreach($data as $spot) {
//      $spot['x'] = $spot['x'] . 'px';
//      $spot['y'] = $spot['y'] . 'px';
//      $data_arr[] = $spot;
//    }

    $return = array(
      'success' => true,
      'items' => $data,
      'count' => count($data),
    );

    $this->EE->output->send_ajax_response($return);
    return;
  }

  public function store()
  {
    $entry_id = $this->EE->input->post('entry_id');
    $asset_id = $this->EE->input->post('asset_id');
    $field_id = $this->EE->input->post('field_id');

    $data = array(
      'entry_id' => $entry_id,
      'asset_id' => $asset_id,
      'field_id' => $field_id,
      'data' => json_encode($this->EE->input->post('hotspot')),
    );

    $this->EE->db->where(array(
      'entry_id' => $entry_id,
      'asset_id' => $asset_id,
      'field_id' => $field_id,
    ));
    $query = $this->EE->db->get('hotspots');
    if ($query->num_rows() > 0){
      $success = $this->EE->db->update('hotspots', $data, array('entry_id' => $entry_id, 'asset_id' => $asset_id, 'field_id' => $field_id));
    } else {
      $success = $this->EE->db->insert('hotspots', $data);
    }

    $return = array(
      'success' => $success,
      'items' => $data,
      'count' => count($data),
    );

    $this->EE->output->send_ajax_response($return);
    return;
  }

}
/* End of file mcp.dealernet.php */
/* Location: /system/expressionengine/third_party/dealernet/mcp.dealernet.php */