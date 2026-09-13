<?php
/**
 * Ok, glad you are here
 * first we get a config instance, and set the settings
 * $config = HTMLPurifier_Config::createDefault();
 * $config->set('Core.Encoding', $this->config->get('purifier.encoding'));
 * $config->set('Cache.SerializerPath', $this->config->get('purifier.cachePath'));
 * if ( ! $this->config->get('purifier.finalize')) {
 *     $config->autoFinalize = false;
 * }
 * $config->loadArray($this->getConfig());
 *
 * You must NOT delete the default settings
 * anything in settings should be compacted with params that needed to instance HTMLPurifier_Config.
 *
 * @link http://htmlpurifier.org/live/configdoc/plain.html
 */

return [
    'encoding'           => 'UTF-8',
    'finalize'           => true,
    'ignoreNonStrings'   => false,
    'cachePath'          => storage_path('app/purifier'),
    'cacheFileMode'      => 0755,
    'settings'      => [
        'default' => [
            'HTML.Doctype'             => 'HTML 4.01 Transitional',
            'HTML.Allowed'             => 'div[data-youtube-video|class|style|data-faq-block|data-faqs|contenteditable|data-quiz-block|data-question|data-options|data-correct|data-poll-block|data-image-slider|data-images|data-autoscroll|data-centerzoom|data-speed|data-social-embed|data-platform],b,strong,i,em,u,a[href|title|target|rel|class],ul,ol,li,p[style|class],br,span[style|class],img[width|height|alt|src|class|loading|decoding],iframe[src|width|height|class|frameborder|allow|allowfullscreen],h1,h2,h3,h4,h5,h6,blockquote,code,pre,table[class|style],thead,tbody,tr,th[colspan|rowspan|style|class],td[colspan|rowspan|style|class]',
            'CSS.AllowedProperties'    => 'font,font-size,font-weight,font-style,font-family,text-decoration,padding-left,color,background-color,text-align',
            'AutoFormat.AutoParagraph' => false,
            'AutoFormat.RemoveEmpty'   => false,
            'HTML.SafeIframe'          => 'true',
            'URI.SafeIframeRegexp'     => '%^(http://|https://|//)(www.youtube.com/embed/|player.vimeo.com/video/)%',
            'Attr.AllowedFrameTargets' => ['_blank'],
        ],
        'test'    => [
            'Attr.EnableID' => 'true',
        ],
        "youtube" => [
            "HTML.SafeIframe"      => 'true',
            "URI.SafeIframeRegexp" => "%^(http://|https://|//)(www.youtube.com/embed/|player.vimeo.com/video/)%",
        ],
        'custom_definition' => [
            'id'  => 'html5-definitions',
            'rev' => 1,
            'debug' => false,
            'elements' => [
                // http://developers.whatwg.org/sections.html
                ['section', 'Block', 'Flow', 'Common'],
                ['nav',     'Block', 'Flow', 'Common'],
                ['article', 'Block', 'Flow', 'Common'],
                ['aside',   'Block', 'Flow', 'Common'],
                ['header',  'Block', 'Flow', 'Common'],
                ['footer',  'Block', 'Flow', 'Common'],
				
				// Content model actually excludes several tags, not modelled here
                ['address', 'Block', 'Flow', 'Common'],
                ['hgroup', 'Block', 'Required: h1 | h2 | h3 | h4 | h5 | h6', 'Common'],
				
				// http://developers.whatwg.org/grouping-content.html
                ['figure', 'Block', 'Optional: (figcaption, Flow) | (Flow, figcaption) | Flow', 'Common'],
                ['figcaption', 'Inline', 'Flow', 'Common'],
				
				// http://developers.whatwg.org/the-video-element.html#the-video-element
                ['video', 'Block', 'Optional: (source, Flow) | (Flow, source) | Flow', 'Common', [
                    'src' => 'URI',
					'type' => 'Text',
					'width' => 'Length',
					'height' => 'Length',
					'poster' => 'URI',
					'preload' => 'Enum#auto,metadata,none',
					'controls' => 'Bool',
                ]],
                ['source', 'Block', 'Flow', 'Common', [
					'src' => 'URI',
					'type' => 'Text',
                ]],

				// http://developers.whatwg.org/text-level-semantics.html
                ['s',    'Inline', 'Inline', 'Common'],
                ['var',  'Inline', 'Inline', 'Common'],
                ['sub',  'Inline', 'Inline', 'Common'],
                ['sup',  'Inline', 'Inline', 'Common'],
                ['mark', 'Inline', 'Inline', 'Common'],
                ['wbr',  'Inline', 'Empty', 'Core'],
				
				// http://developers.whatwg.org/edits.html
                ['ins', 'Block', 'Flow', 'Common', ['cite' => 'URI', 'datetime' => 'CDATA']],
                ['del', 'Block', 'Flow', 'Common', ['cite' => 'URI', 'datetime' => 'CDATA']],
            ],
            'attributes' => [
                ['iframe', 'allowfullscreen', 'Bool'],
                ['table', 'height', 'Text'],
                ['td', 'border', 'Text'],
                ['th', 'border', 'Text'],
                ['tr', 'width', 'Text'],
                ['tr', 'height', 'Text'],
                ['tr', 'border', 'Text'],
            ],
        ],
        'custom_attributes' => [
            ['a', 'target', 'Enum#_blank,_self,_target,_top'],
            ['a', 'rel', 'Text'],
            ['img', 'loading', 'Text'],
            ['img', 'decoding', 'Text'],
            ['div', 'data-youtube-video', 'Text'],
            ['div', 'data-faq-block', 'Text'],
            ['div', 'data-faqs', 'Text'],
            ['div', 'contenteditable', 'Text'],
            ['div', 'data-quiz-block', 'Text'],
            ['div', 'data-question', 'Text'],
            ['div', 'data-options', 'Text'],
            ['div', 'data-correct', 'Text'],
            ['div', 'data-poll-block', 'Text'],
            ['div', 'data-image-slider', 'Text'],
            ['div', 'data-images', 'Text'],
            ['div', 'data-autoscroll', 'Text'],
            ['div', 'data-centerzoom', 'Text'],
            ['div', 'data-speed', 'Text'],
            ['div', 'data-social-embed', 'Text'],
            ['div', 'data-platform', 'Text'],
            ['iframe', 'class', 'Text'],
            ['iframe', 'allow', 'Text'],
            ['a', 'class', 'Text'],
            ['img', 'class', 'Text'],
            ['p', 'class', 'Text'],
        ],
        'custom_elements' => [
            ['u', 'Inline', 'Inline', 'Common'],
        ],
    ],

];
