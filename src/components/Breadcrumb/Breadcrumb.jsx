// components/Breadcrumb.js
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { findBreadcrumbTrail } from "@/lib/getBreadcrumbTrail";

const Breadcrumb = () => {
  const pathname = usePathname();
  const trail = findBreadcrumbTrail(pathname);

  if (!trail.length) return null;

  return (
    <nav className="text-sm mb-2">
      <ol className="flex space-x-2 text-gray-600">
        {trail.map((item, index) => {
          const isLast = index === trail.length - 1;
          return (
            <li key={item.id} className="flex items-center">
              {!isLast ? (
                <Link
                  href={item.path || "#"}
                  className="hover:underline text-black-600"
                >
                  {item.name}
                </Link>
              ) : (
                <span className="text-gray-900 font-semibold">{item.name}</span>
              )}
              {!isLast && <span className="mx-2">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
