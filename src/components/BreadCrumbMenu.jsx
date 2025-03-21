import { useLocation } from 'react-router-dom';
import { Breadcrumb } from 'antd';

function kebabToStartCase(str) {
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

const BreadcrumbMenu = () => {
  const location = useLocation();
  const snippets = location.pathname.split('/').filter((key) => key);

  const items = snippets.map((snippet, snippetIdx) => ({
    title: kebabToStartCase(snippet),
  }));

  function itemRender(currentRoute, params, items, paths) {
    // const isLast = currentRoute?.path === items[items.length - 1]?.path;

    return <span>{currentRoute.title}</span>;
  }

  return (
    <Breadcrumb
      itemRender={itemRender}
      items={items}
      params={location.pathname}
    />
  );
};

export default BreadcrumbMenu;
