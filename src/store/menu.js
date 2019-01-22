const items = [
  {
    title: '我的发文',
    icon: 'news',
    module: 'docflow',
    platform: 'master',
    children: [
      {
        title: '待发公文',
        path: '/draft',
        icon: 'caogao',
      },
      {
        title: '已发公文',
        path: '/draft/other',
        icon: 'doc1',
      },
    ],
  },
  {
    title: '中心发文',
    icon: 'news',
    module: 'docflow',
    platform: 'master',
    children: [
      {
        title: '在办公文',
        path: '/outbox',
        icon: 'doc1',
      },
      {
        title: '已办公文',
        path: '/outbox/done',
        icon: 'column',
      },
      {
        title: '归档公文',
        path: '/outbox/archive',
        icon: 'column',
      },
      {
        title: '公文回执',
        path: '/outbox/feedback',
        icon: 'column',
      },
    ],
  },
  {
    title: '收文管理',
    icon: 'news',
    module: 'docflow',
    platform: 'school',
    children: [
      {
        title: '待收公文',
        path: '/inbox/new',
        icon: 'caogao',
      },
      {
        title: '在办公文',
        path: '/inbox/read',
        icon: 'doc1',
      },
      {
        title: '已办公文',
        path: '/inbox/done',
        icon: 'column',
      },
    ],
  },
];

const MapMenu = (catalog = []) => item => ({
  title: item.title,
  options: {
    icon: item.icon,
    path: item.path,
    url: item.url,
    target: item.target,
    tooltip: item.tooltip,
    module: item.module,
    platform: item.platform,
    roles: item.roels,
    tags: item.tags,
    meta: { catalog: catalog.concat(item.title) },
  },
  children: (item.children || []).map(MapMenu(catalog.concat(item.title))),
});

// initial state
export const state = () => ({
  items: items.map(MapMenu()),
});
