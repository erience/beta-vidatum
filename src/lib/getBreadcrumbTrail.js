// lib/getBreadcrumbTrail.js

import { menus } from "./breadcrumbData";

export function findBreadcrumbTrail(pathname, items = menus, trail = []) {
  for (const item of items) {
    if (item.path === pathname) {
      return [...trail, item];
    }

    if (item.children) {
      const result = findBreadcrumbTrail(pathname, item.children, [...trail, item]);
      if (result.length) return result;
    }
  }

  return [];
}
