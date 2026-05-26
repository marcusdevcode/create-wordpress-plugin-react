<?php

namespace PluginSlug;

class Assets
{


	function __construct(){
		add_action('admin_enqueue_scripts', array($this,'register_assets'));
		add_action('wp_enqueue_scripts', array($this,'register_assets'));
	}
	function register_assets(){
		$base_slug = BlockRegister::$blocks_slug;
		$files = [
			"js" => [
					"design" => [
						'dependencies' => $base_slug . '.asset.json' ,
						'src' => $base_slug . '.js'
					]
			],
			"css" => [
					"editor" => [
						'dependencies' => $base_slug . '-editor.asset.json' ,
						'src' => $base_slug . '-editor.css'
					],
					"style" => [
						'dependencies' => $base_slug . '-style.asset.json' ,
						'src' => $base_slug . '-style.css'
					]
			]
		];
		if(isset($files['js'])){
			foreach($files['js'] as $js_handle => $js_file){
				$json_file_path = PLUGIN_SLUG_DIR . BlockRegister::$frontend_folder . $js_file['dependencies'];
				$js_info = json_decode(file_get_contents($json_file_path), true);
				wp_register_script(
					$base_slug .'-'. $js_handle,
					plugins_url(BlockRegister::$frontend_folder . $js_file['src'], PLUGIN_SLUG_PATH),
					$js_info['dependencies'],
					$js_info['version']
				);
			}
		}
		if(isset($files['css'])){
			foreach($files['css'] as $css_handle => $css_file){
				$json_file_path = PLUGIN_SLUG_DIR . BlockRegister::$frontend_folder . $css_file['dependencies'];
				$css_info = json_decode(file_get_contents($json_file_path), true);
				wp_register_style(
					$base_slug .'-'. $css_handle,
					plugins_url(BlockRegister::$frontend_folder . $css_file['src'], PLUGIN_SLUG_PATH),
					$css_info['dependencies'],
					$css_info['version']
				);
			}
		}
	}
}
