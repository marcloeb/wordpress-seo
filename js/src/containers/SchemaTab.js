import { __ } from "@wordpress/i18n";
import { LocationConsumer } from "../components/contexts/location";
import SchemaTab from "../components/SchemaTab";
import { compose } from "@wordpress/compose";
import { withSelect, withDispatch } from "@wordpress/data";
import SchemaFields from "../helpers/fields/SchemaFields";
import { useEffect } from "@wordpress/element";
import PropTypes from "prop-types";

/**
 * Function to get props based on the location.
 *
 * @param {string} location The location in which the component is rendered.
 *
 * @returns {object} Props for this location.
 */
const getLocationBasedProps = ( location ) => {
	if ( location === "metabox" ) {
		return {
			helpTextLink: "https://yoa.st/400",
			additionalHelpTextLink: "https://yoa.st/402",
			isMetabox: true,
		};
	}

	return {
		helpTextLink: "https://yoa.st/401",
		additionalHelpTextLink: "https://yoa.st/403",
		isMetabox: false,
	};
};

/**
 * Renders the SchemaComponent.
 *
 * @param {Object} props The props.
 *
 * @returns {React.Component} The SchemaTab.
 */
const SchemaTabContainer = ( props ) => {
	const showArticleTypeInput = SchemaFields.articleTypeInput !== null;

	useEffect( () => {
		props.loadSchemaPageData();
		if ( showArticleTypeInput ) {
			props.loadSchemaArticleData();
		}
	}, [] );

	const { pageTypeOptions, articleTypeOptions } = window.wpseoScriptData.metabox.schema;

	const baseProps = {
		articleTypeLabel: __( "Article type", "wordpress-seo" ),
		pageTypeLabel: __( "Page type", "wordpress-seo" ),
		postTypeName: window.wpseoAdminL10n.postTypeNamePlural,
		helpTextTitle: __( "Yoast SEO automatically describes your pages using schema.org", "wordpress-seo" ),
		helpTextDescription: __(
			"This helps search engines understand your website and your content. You can change some of your settings for this page below.",
			"wordpress-seo"
		),
		showArticleTypeInput,
		pageTypeOptions,
		articleTypeOptions,
	};

	return (
		<LocationConsumer>
			{ location => {
				const schemaTabProps = {
					...props,
					...baseProps,
					...getLocationBasedProps( location ),
				};

				return <SchemaTab { ...schemaTabProps } />;
			} }
		</LocationConsumer>
	);
};

SchemaTabContainer.propTypes = {
	loadSchemaPageData: PropTypes.func.isRequired,
	loadSchemaArticleData: PropTypes.func.isRequired,
};

export default compose( [
	withSelect( select => {
		const {
			getPreferences,
			getPageType,
			getDefaultPageType,
			getArticleType,
			getDefaultArticleType,
		} = select( "yoast-seo/editor" );

		return {
			displayFooter: getPreferences().displaySchemaSettingsFooter,
			schemaPageTypeSelected: getPageType(),
			schemaArticleTypeSelected: getArticleType(),
			defaultArticleType: getDefaultArticleType(),
			defaultPageType: getDefaultPageType(),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const {
			setPageType,
			setArticleType,
			getSchemaPageData,
			getSchemaArticleData,
		} = dispatch( "yoast-seo/editor" );

		return {
			loadSchemaPageData: getSchemaPageData,
			loadSchemaArticleData: getSchemaArticleData,
			schemaPageTypeChange: setPageType,
			schemaArticleTypeChange: setArticleType,
		};
	} ),
] )( SchemaTabContainer );