<?php
/**
 * Plugin Name: Plugin_Name
 * Plugin URI:
 * Description:
 * Version: 1.0
 * Author: Plugin_Author
 *  License: GPLv3
 * License URI: https://www.gnu.org/licenses/gpl-3.0.html
 * Requires PHP: 7.4
 **/

use PluginSlug\AdminAssets;

if(!defined("PLUGIN_SLUG_VER")){
	define("PLUGIN_SLUG_VER","1.0");
}
if(!defined("PLUGIN_SLUG_PATH")){
	define("PLUGIN_SLUG_PATH",__FILE__);
}
if(!defined("PLUGIN_SLUG_DIR")){
	define("PLUGIN_SLUG_DIR",__DIR__);
}
require_once PLUGIN_SLUG_DIR."/vendor/autoload.php";
class PluginSlugMain{
	function __construct(){
		new AdminAssets();
	}
}
new PluginSlugMain();
