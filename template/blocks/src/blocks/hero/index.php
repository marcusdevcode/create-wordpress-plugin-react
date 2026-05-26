<?php

use PluginSlug\BlockColors;

return new class {
    public function render_callback($attributes){
        extract($attributes);
        // $bg = BlockColors::get_color($attributes['background'] ?? 'transparent');
        ob_start();
        include __DIR__.'/template.php';
        return ob_get_clean();
    }
};
