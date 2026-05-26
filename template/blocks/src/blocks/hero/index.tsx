import { BlockConfiguration } from '@wordpress/blocks';
import { useBlockProps, InspectorControls, MediaUpload } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl, SelectControl, Button, ColorPalette } from '@wordpress/components';

// 1. Explicitly type your Block Attributes for strict verification
interface HeroBlockAttributes {
    image_url?: string;
    image_alt?: string;
    orientation?: 'photo-left' | 'photo-right';
    heading?: string;
    heading_accent?: string;
    body?: string;
    kicker_label?: string;
    kicker_href?: string;
    background?: string;
}

// 2. Map standard WordPress component properties for Edit components
interface EditProps {
    attributes: HeroBlockAttributes;
    setAttributes: (attrs: Partial<HeroBlockAttributes>) => void;
    isSelected: boolean;
}

const BT_BG_PALETTE = [
    { name: 'Cream', color: '#f7f5ef' },
    { name: 'White', color: '#ffffff' }
];

export default function (): Partial<BlockConfiguration> {
    return {
        // Added explicit typing to props here
        edit: function EditComponent({ attributes, setAttributes, isSelected }: EditProps) {
            const {
                image_url,
                image_alt,
                orientation = 'photo-left', // Safe default fallback
                heading,
                heading_accent,
                body = '',
                kicker_label,
                kicker_href,
                background,
            } = attributes;

            const resolvedBg = background === 'white' ? '#ffffff' : '#f7f5ef';

            const blockProps = useBlockProps({
                style: {
                    padding: '2rem 1.5rem',
                    borderRadius: '8px',
                    background: resolvedBg,
                    border: isSelected ? '3px solid #2f5d3a' : '2px dashed rgba(47,93,58,.45)',
                },
            });

            // Clean asset image preview inside the main editor canvas area
            const photoCard = (
                <div style={ { width: '100%', minHeight: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' } }>
                    { image_url ? (
                        <img 
                            src={ image_url } 
                            alt={ image_alt || '' } 
                            style={ { 
                                width: '100%', 
                                height: 'auto', 
                                maxHeight: '250px', 
                                objectFit: 'cover', 
                                borderRadius: '6px',
                                display: 'block'
                            } } 
                        />
                    ) : (
                        <div 
                            style={ { 
                                width: '100%', 
                                height: '180px', 
                                background: '#e5e7eb', 
                                border: '1px dashed #9ca3af',
                                borderRadius: '6px', 
                                display: 'flex', 
                                flexDirection: 'column',
                                alignItems: 'center', 
                                justifyContent: 'center',
                                color: '#6b7280',
                                fontSize: '0.85rem'
                            } }
                        >
                            <span>📷 No image selected</span>
                            <span style={ { fontSize: '0.75rem', opacity: 0.8, marginTop: '4px' } }>Configure in sidebar panel</span>
                        </div>
                    ) }
                </div>
            );

            const copyCard = (
                <div>
                    <h2 style={ { fontFamily: 'Georgia, serif', fontSize: '1.3rem', margin: '0 0 .6rem', lineHeight: 1.15, color: '#0d1e14' } }>
                        { heading || 'Heading Placeholder' }
                        { heading_accent && (
                            <>
                                { ' ' }
                                <span style={ { color: '#2f5d3a', fontStyle: 'italic' } }>{ heading_accent }</span>
                            </>
                        ) }
                    </h2>
                    <p style={ { fontSize: '.9rem', color: '#444', margin: '0 0 .6rem', lineHeight: 1.4 } }>
                        { body ? (body.length > 180 ? `${body.slice(0, 180)}…` : body) : 'Body copy placeholder text goes here...' }
                    </p>
                    { kicker_label && (
                        <span style={ { color: '#2f5d3a', fontWeight: 600, fontSize: '.85rem', textDecoration: 'underline' } }>
                            { kicker_label }
                        </span>
                    ) }
                </div>
            );

            return (
                <div { ...blockProps }>
                    <InspectorControls>
                        <PanelBody title="Layout" initialOpen={ true }>
                            <SelectControl
                                label="Orientation"
                                value={ orientation }
                                options={ [
                                    { label: 'Photo left, text right', value: 'photo-left' },
                                    { label: 'Photo right, text left', value: 'photo-right' }
                                ] }
                                onChange={ (val) => setAttributes({ orientation: val as 'photo-left' | 'photo-right' }) }
                            />
                            <div style={ { marginTop: '1rem' } }>
                                <label style={ { display: 'block', fontSize: '.8rem', fontWeight: 600, marginBottom: '.4rem', color: '#1e1e1e' } }>
                                    Background
                                </label>
                                <ColorPalette
                                    value={ background && background.startsWith('#') ? background : resolvedBg }
                                    colors={ BT_BG_PALETTE }
                                    onChange={ (val) => setAttributes({ background: val || '#f7f5ef' }) }
                                    disableCustomColors={ false }
                                    clearable={ true }
                                />
                            </div>
                        </PanelBody>

                        <PanelBody title="Copy" initialOpen={ true }>
                            <TextControl
                                label="Heading"
                                value={ heading || '' }
                                onChange={ (val) => setAttributes({ heading: val }) }
                            />
                            <TextControl
                                label="Heading accent (green)"
                                value={ heading_accent || '' }
                                onChange={ (val) => setAttributes({ heading_accent: val }) }
                            />
                            <TextareaControl
                                label="Body (paragraphs separated by blank line)"
                                value={ body || '' }
                                onChange={ (val) => setAttributes({ body: val }) }
                                rows={ 8 }
                            />
                            <TextControl
                                label="Kicker link label"
                                value={ kicker_label || '' }
                                onChange={ (val) => setAttributes({ kicker_label: val }) }
                            />
                            <TextControl
                                label="Kicker link href"
                                value={ kicker_href || '' }
                                onChange={ (val) => setAttributes({ kicker_href: val }) }
                            />
                        </PanelBody>

                        <PanelBody title="Photo" initialOpen={ false }>
                            <div style={ { marginBottom: '12px' } }>
                                <MediaUpload
                                    onSelect={ (media: any) => setAttributes({ image_url: media.url }) }
                                    allowedTypes={ [ 'image' ] }
                                    value={ image_url ? parseInt(image_url) : undefined } // MediaUpload likes IDs, but urls are safely parsed
                                    render={ ({ open }: { open: () => void }) => (
                                        <div>
                                            { image_url && (
                                                <div style={ { marginBottom: '10px', border: '1px solid #ccc', padding: '4px', borderRadius: '4px', background: '#fff' } }>
                                                    <img 
                                                        src={ image_url } 
                                                        alt="Sidebar thumbnail preview" 
                                                        style={ { width: '100%', height: 'auto', maxHeight: '120px', objectFit: 'cover', display: 'block' } } 
                                                    />
                                                </div>
                                            ) }
                                            <Button variant="secondary" onClick={ open } style={ { width: '100%', justifyContent: 'center' } }>
                                                { ! image_url ? 'Select Photo' : 'Replace Photo' }
                                            </Button>
                                        </div>
                                    ) }
                                />
                            </div>
                            { image_url && (
                                <Button 
                                    isDestructive 
                                    isLink 
                                    onClick={ () => setAttributes({ image_url: '', image_alt: '' }) }
                                    style={ { marginBottom: '12px', display: 'block' } }
                                >
                                    Remove Photo
                                </Button>
                            ) }
                            <TextControl
                                label="Alt text"
                                value={ image_alt || '' }
                                onChange={ (val) => setAttributes({ image_alt: val }) }
                            />
                        </PanelBody>
                    </InspectorControls>

                    <div style={ { fontSize: '.7rem', textTransform: 'uppercase', letterSpacing: '.1em', color: '#2f5d3a', marginBottom: '.8rem', fontWeight: 600 } }>
                        BT Feature ({ orientation })
                    </div>

                    <div style={ { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'center' } }>
                        { orientation === 'photo-right' ? (
                            <>
                                { copyCard }
                                { photoCard }
                            </>
                        ) : (
                            <>
                                { photoCard }
                                { copyCard }
                            </>
                        ) }
                    </div>
                </div>
            );
        },

        save: () => null
    };
}