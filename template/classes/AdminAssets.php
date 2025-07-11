<?php

namespace PluginSlug;

class AdminAssets
{
	function __construct(){
		add_action('admin_enqueue_scripts', array($this,'add_assets'));
	}
	function add_assets(){
		wp_enqueue_style( 'plugin-slug', plugin_dir_url( PLUGIN_SLUG_PATH ) . 'assets/dist/main.css' );
		$jsinfo = require PLUGIN_SLUG_DIR."/assets/dist/bundle.asset.php";
		wp_enqueue_script( 'plugin-slug', plugin_dir_url( PLUGIN_SLUG_PATH ) . 'assets/dist/bundle.js', $jsinfo['dependencies'],
			$jsinfo['version'], true );
	}
}
