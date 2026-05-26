<?php

namespace PluginSlug;

class BlockColors
{
    public static $colors = [
        'cream' => '#f7f5ef',
        'white' => '#ffffff',
        'dark' => '#0d1e14',
        'green' => '#2f5d3a',
    ];
    public static function get_color($key){
        return static::$colors[$key]??'';
    }
}
