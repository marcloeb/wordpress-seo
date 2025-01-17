<?php

namespace Yoast\WP\SEO\Presenters;

use Yoast\WP\SEO\Presentations\Indexable_Presentation;

/**
 * Presenter class for the rel next meta tag.
 */
class Rel_Next_Presenter extends Abstract_Indexable_Tag_Presenter {

	/**
	 * The tag format including placeholders.
	 *
	 * @var string
	 */
	protected $tag_format = '<link rel="next" href="%s" />';

	/**
	 * The method of escaping to use.
	 *
	 * @var string
	 */
	protected $escaping = 'url';

	/**
	 * Returns the rel next meta tag.
	 *
	 * @return string The rel next tag.
	 */
	public function present() {
		$output = parent::present();

		if ( is_front_page() && empty($output) ) {
            global $paged, $wp_query;

            if($paged===0){
                $output = '<link rel="next" href="'. get_pagenum_link( ) . 'page/2" />' . PHP_EOL;
            }elseif($paged === strval((int) $wp_query->max_num_pages)) {
                return '';
            }else{
                $output = '<link rel="next" href="'. get_pagenum_link( $paged + 1 ) .'" />' . PHP_EOL;
            }
        }
		
		if ( ! empty( $output ) ) {
			/**
			 * Filter: 'wpseo_next_rel_link' - Allow changing link rel output by Yoast SEO.
			 *
			 * @api string $unsigned The full `<link` element.
			 */
			return \apply_filters( 'wpseo_next_rel_link', $output );
		}

		return '';
	}

	/**
	 * Run the canonical content through the `wpseo_adjacent_rel_url` filter.
	 *
	 * @return string The filtered adjacent link.
	 */
	public function get() {
		if ( \in_array( 'noindex', $this->presentation->robots, true ) ) {
			return '';
		}

		/**
		 * Filter: 'wpseo_adjacent_rel_url' - Allow filtering of the rel next URL put out by Yoast SEO.
		 *
		 * @api string $rel_next The rel next URL.
		 *
		 * @param string                 $rel          Link relationship, prev or next.
		 * @param Indexable_Presentation $presentation The presentation of an indexable.
		 */
		return (string) \trim( \apply_filters( 'wpseo_adjacent_rel_url', $this->presentation->rel_next, 'next', $this->presentation ) );
	}
}
