/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { RouteInfo } from '../types';

interface SEOHandlerProps {
  route: RouteInfo;
}

export default function SEOHandler({ route }: SEOHandlerProps) {
  useEffect(() => {
    // Update Title
    document.title = route.meta.title;

    // Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', route.meta.description);

    // Inject JSON-LD Schema
    const schemaId = 'iqzyme-jsonld';
    let schemaScript = document.getElementById(schemaId) as HTMLScriptElement;
    if (schemaScript) {
      schemaScript.remove();
    }

    schemaScript = document.createElement('script');
    schemaScript.id = schemaId;
    schemaScript.type = 'application/ld+json';

    const isHomePage = route.path === '/';

    const schemaData = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': 'IQZYME Medtech Pvt. Ltd.',
      'url': window.location.origin,
      'logo': `${window.location.origin}/logo.png`,
      'description': isHomePage
        ? 'IQZYME is a global regulatory affairs, quality management systems and market access consulting firm serving medical device, IVD, digital health, pharmaceutical and cosmetics companies across CDSCO, FDA, EU MDR, IVDR, ISO 13485, MHRA, Health Canada, TGA, PMDA and 50+ jurisdictions.'
        : route.meta.description,
      'serviceType': [
        'Medical Device Regulatory Consulting',
        'QMS Consulting',
        'Clinical Evaluation Consulting',
        'SaMD Regulatory Consulting',
        'Cleanroom Facility Consulting',
        'ISO 13485 Implementation',
        'FDA 510(k) Consulting',
        'EU MDR Consulting',
        'CDSCO Licensing',
        'BIS Certification',
        'IPR & Patent/Trademark Consulting',
        'Post-Market Surveillance Consulting',
        'WHO Prequalification Consulting'
      ],
      'knowsAbout': [
        'Medical Device Regulatory Consulting',
        'QMS Consulting',
        'Clinical Evaluation Consulting',
        'SaMD Regulatory Consulting',
        'Cleanroom Facility Consulting',
        'ISO 13485 Implementation',
        'FDA 510(k) Consulting',
        'EU MDR Consulting',
        'CDSCO Licensing',
        'BIS Certification',
        'IPR & Patent/Trademark Consulting',
        'Post-Market Surveillance Consulting',
        'WHO Prequalification Consulting'
      ],
      'hasOfferCatalog': {
        '@type': 'OfferCatalog',
        'name': 'Regulatory & Compliance Services',
        'itemListElement': [
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Service',
              'name': 'Medical Device Regulatory Consulting'
            }
          },
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Service',
              'name': 'QMS Consulting'
            }
          },
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Service',
              'name': 'Clinical Evaluation Consulting'
            }
          },
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Service',
              'name': 'SaMD Regulatory Consulting'
            }
          },
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Service',
              'name': 'Cleanroom Facility Consulting'
            }
          },
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Service',
              'name': 'ISO 13485 Implementation'
            }
          },
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Service',
              'name': 'FDA 510(k) Consulting'
            }
          },
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Service',
              'name': 'EU MDR Consulting'
            }
          },
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Service',
              'name': 'CDSCO Licensing'
            }
          },
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Service',
              'name': 'BIS Certification'
            }
          },
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Service',
              'name': 'IPR & Patent/Trademark Consulting'
            }
          },
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Service',
              'name': 'Post-Market Surveillance Consulting'
            }
          },
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Service',
              'name': 'WHO Prequalification Consulting'
            }
          }
        ]
      },
      'contactPoint': {
        '@type': 'ContactPoint',
        'telephone': '+91 484 2955444',
        'contactType': 'regulatory consulting service',
        'areaServed': 'Worldwide',
        'availableLanguage': ['en']
      },
      'sameAs': [
        'https://www.linkedin.com/company/iqzyme',
        'https://twitter.com/iqzyme'
      ]
    };

    schemaScript.text = JSON.stringify(schemaData);
    document.head.appendChild(schemaScript);
  }, [route]);

  return null;
}
