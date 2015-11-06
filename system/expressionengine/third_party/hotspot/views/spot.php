<?php
$class[] = $position;
$class[] = $background;
?>
<li class="hotspot-item" style="position:absolute;top:<?php echo $y; ?>%;left:<?php echo $x; ?>%">
  <span class="hotspot-item-symbol"><?php echo $symbol; ?></span>
  <div class="hotspot-item-box <?php echo implode(' ', $class); ?>">
    <h2><?php echo $title; ?></h2>
    <p><?php echo $text; ?></p>
  </div>
</li>