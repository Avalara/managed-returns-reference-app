import { Link, useLocation, useMatches } from 'react-router-dom';
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
  console.log('snippets', snippets);
  const matches = useMatches();
  console.log('matches', matches);

  // return snippets.map((snippet, snippetIdx) =>
  //   snippetIdx === snippets.length - 1 ? (
  //     <span key={snippetIdx}>{snippet}</span>
  //   ) : (
  //     <Link key={snippetIdx} to={`/${paths.join('/')}`}>
  //       {currentRoute.title}
  //     </Link>
  //   ),
  // );
  const items = snippets.map((snippet, snippetIdx) => {
    return { title: kebabToStartCase(snippet) };
  });

  function itemRender(currentRoute, params, items, paths) {
    // console.log('currentRoute', currentRoute);
    // console.log('params', params);
    // console.log('paths', paths);

    // return snippets.map((snippet, snippetIdx) =>
    //   snippetIdx === snippets.length - 1 ? (
    //     <span key={snippetIdx}>{snippet}</span>
    //   ) : (
    //     <Link key={snippetIdx} to={`/${paths.join('/')}`}>
    //       {currentRoute.title}
    //     </Link>
    //   ),
    // );
    const isLast = currentRoute?.path === items[items.length - 1]?.path;

    return isLast ? (
      <span>{currentRoute.title}</span>
    ) : (
      <span>{currentRoute.title}</span>
    );
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
