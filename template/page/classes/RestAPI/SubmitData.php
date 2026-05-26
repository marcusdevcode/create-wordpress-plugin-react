<?php

namespace PluginSlug\RestAPI;

class SubmitData
{
    public function __construct() {
     add_action( 'rest_api_init', [ $this, 'register_routes' ],10 );
    }
    private function register_routes() {
        register_rest_route( 'plugin-slug/v1', '/submit-data', [
            'methods' => 'POST',
            'callback' => [ $this, 'submit_data' ],
            'permission_callback' => [ $this, 'permission_callback' ]
        ] );
    }
    public function submit_data( $request ) {
        $keyword = sanitize_text_field( $request->get_param( 'keyword' ) );
        return WP_REST_Response::success( [ 'message' => "Data received: $keyword" ] );
    }
    public function permission_callback() {
        return current_user_can( 'edit_posts' );
    }
}
