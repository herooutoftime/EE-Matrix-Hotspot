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
 * Hotspot Module Install/Update File
 *
 * @package		ExpressionEngine
 * @subpackage	Addons
 * @category	Module
 * @author		anti
 * @link
 * @todo  Delete all related resources
 */

class Hotspot_upd
{

  public $version = '0.1';

  private $EE;

  /**
   * Constructor
   */
  public function __construct()
  {
    $this->EE =& get_instance();
    $this->EE->load->library('logger');
  }

  // ----------------------------------------------------------------

  /**
   * Installation Method
   *
   * @return  boolean  TRUE
   */
  public function install()
  {

    $this->EE->logger->developer('Install Hotspot extension');

    $mod_data = array(
      'module_name' => 'Hotspot',
      'module_version' => $this->version,
      'has_cp_backend' => "y",
      'has_publish_fields' => 'n'
    );

    $this->EE->db->insert('modules', $mod_data);

    $this->EE->load->dbforge();
    /**
     * In order to setup your custom tables, uncomment the line above, and
     * start adding them below!
     */

    $fields = array(
      'id' => array(
        'type' => 'int',
        'constraint' => '11',
        'unsigned' => TRUE,
        'auto_increment'=> TRUE
      ),
      'entry_id' => array(
        'type' => 'int',
        'constraint' => '11',
        'default' => '',
        'null' => FALSE,
      ),
      'field_id' => array(
        'type' => 'int',
        'constraint' => '11',
        'default' => '',
        'null' => FALSE,
      ),
      'asset_id' => array(
        'type' => 'int',
        'constraint' => '11',
        'default' => '',
        'null' => FALSE,
      ),
      'data' => array(
        'type' => 'text',
        'null' => TRUE,
      ),
    );
    $this->EE->dbforge->add_field($fields);
    $this->EE->dbforge->add_key('id', TRUE);
    $this->EE->dbforge->create_table('hotspots');

    return true;
  }
}