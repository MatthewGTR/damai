import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  breadcrumbs?: Array<{ name: string; item: string }>;
}

export function SEOHead({
  title = 'Pusat Jagaan Warga Tua Damai - Support Elderly Care',
  description = 'Support elderly care at Pusat Jagaan Warga Tua Damai. Make donations to help provide quality care, meals, healthcare, and comfort for seniors in need. Every contribution makes a difference.',
  keywords = 'old folk home, elderly care, senior care, donation, charity, elder support, nursing home, senior citizens, elderly assistance, donate to elderly, pusat jagaan',
  ogImage = 'https://your-domain.com/image.png',
  breadcrumbs = [{ name: 'Home', item: 'https://your-domain.com' }],
}: SEOHeadProps) {
  const location = useLocation();
  const currentUrl = `https://your-domain.com${location.pathname}`;

  useEffect(() => {
    document.title = title;

    const metaTags = [
      { name: 'description', content: description },
      { name: 'keywords', content: keywords },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: currentUrl },
      { property: 'og:image', content: ogImage },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: ogImage },
    ];

    metaTags.forEach(({ name, property, content }) => {
      const selector = name ? `meta[name="${name}"]` : `meta[property="${property}"]`;
      let element = document.querySelector(selector);

      if (!element) {
        element = document.createElement('meta');
        if (name) element.setAttribute('name', name);
        if (property) element.setAttribute('property', property);
        document.head.appendChild(element);
      }

      element.setAttribute('content', content);
    });

    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', currentUrl);

    let breadcrumbScript = document.querySelector('script[type="application/ld+json"][data-breadcrumb]');
    if (!breadcrumbScript) {
      breadcrumbScript = document.createElement('script');
      breadcrumbScript.setAttribute('type', 'application/ld+json');
      breadcrumbScript.setAttribute('data-breadcrumb', 'true');
      document.head.appendChild(breadcrumbScript);
    }

    const breadcrumbData = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: crumb.item,
      })),
    };

    breadcrumbScript.textContent = JSON.stringify(breadcrumbData);
  }, [title, description, keywords, ogImage, currentUrl, breadcrumbs]);

  return null;
}
