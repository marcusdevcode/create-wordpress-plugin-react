<?php

namespace PluginSlug;

class BlockRegister
{
    public static $classes = [];
    public static $blocks_slug = 'blocksslug';
    public static $backend_folder = '/backend/';
    public static $frontend_folder = '/frontend/';

    public function __construct(){
        add_action('init', array($this,'register_blocks'));
    }
    function register_blocks(){
        $backend_folder_path  = PLUGIN_SLUG_DIR.self::$backend_folder;
        $frontend_folder_path = PLUGIN_SLUG_DIR.self::$frontend_folder;
        $blocks               = include $backend_folder_path.'blocks.php';
        foreach($blocks as $block){
            if(!isset(self::$classes[$block])){
                self::$classes[$block] = include $backend_folder_path. 'blocks/' . $block . '/index.php';
            }
            $params = array(
                'render_callback' => [self::$classes[$block],'render_callback']
            );
            register_block_type_from_metadata($frontend_folder_path.'blocks/'.$block, $params);
        }
    }
}
