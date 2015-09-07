<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

if (! class_exists('PT_Fieldtype'))
{
  require PATH_THIRD.'pt_field_pack/pt_fieldtype.php';
}

class Flexible_ft extends PT_Multi_Fieldtype
{

  var $info = array(
    'name' => 'Flexible fieldtype for Matrix',
    'version' => '1.0'
  );
  /**
   * @var EE
   */
  public $EE;

  var $class = 'flexible';
  var $total_option_levels = 1;

//  function display_cell_settings( $data )
//  {
//    if (! isset($data['maxl']))
//    {
//      $data['maxl'] = '';
//    }
//
//    if (! isset($data['multiline']))
//    {
//      $data['multiline'] = 'n';
//    }
//
//    return array(
//      array(lang('maxl'), form_input('maxl', $data['maxl'], 'class="matrix-textarea"')),
//      array(lang('multiline'), form_checkbox('multiline', 'y', ($data['multiline'] == 'y')))
//    );
//  }

//  function save_cell_settings( $data )
//  {
//    if (! is_numeric($data['maxl']))
//    {
//      $data['maxl'] = 0;
//    }
//
//    return $data;
//  }

//  function display_cell( $data )
//  {
//    return '<textarea class="matrix-textarea" name="'.$this->cell_name.'" rows="1">'.$data.'</textarea>';
//  }

//  function validate_cell( $data )
//  {
//    if ($this->settings['col_required'] == 'y')
//    {
//      if (! $data)
//      {
//        return lang('col_required');
//      }
//    }
//
//    return TRUE;
//  }

//  function save_cell( $data )
//  {
//    if ($data == '&nbsp;')
//    {
//      $data = '';
//    }
//
//    return $data;
//  }
}
