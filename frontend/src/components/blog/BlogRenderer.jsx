import React, { useMemo } from 'react';
import { renderMarkdown } from '../../utils/markdown';
import EditorialTheme from '../../themes/EditorialTheme';
import MinimalTheme from '../../themes/MinimalTheme';
import NeoBrutalistTheme from '../../themes/NeoBrutalistTheme';
import MagazineTheme from '../../themes/MagazineTheme';

export default function BlogRenderer({ blog, overrideStyle }) {
  const activeStyle = (overrideStyle || blog?.style || 'EDITORIAL').toUpperCase();

  const contentHtml = useMemo(() => {
    return renderMarkdown(blog?.content || '');
  }, [blog?.content]);

  switch (activeStyle) {
    case 'MINIMAL':
      return <MinimalTheme blog={blog} contentHtml={contentHtml} />;
    case 'NEO_BRUTALIST':
      return <NeoBrutalistTheme blog={blog} contentHtml={contentHtml} />;
    case 'MAGAZINE':
      return <MagazineTheme blog={blog} contentHtml={contentHtml} />;
    case 'EDITORIAL':
    default:
      return <EditorialTheme blog={blog} contentHtml={contentHtml} />;
  }
}
