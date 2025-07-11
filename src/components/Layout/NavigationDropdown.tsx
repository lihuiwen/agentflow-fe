"use client";

import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

// 定义菜单项类型
interface MenuItem {
  title: string;
  href: string;
  description?: string;
}

// 定义菜单分类类型
interface MenuCategory {
  title: string;
  items: MenuItem[];
}

// 定义组件属性类型
interface NavigationDropdownProps {
  trigger: React.ReactNode; // 触发按钮
  categories: MenuCategory[]; // 菜单分类
}

export default function NavigationDropdown({
  trigger,
  categories,
}: NavigationDropdownProps) {
  // 控制下拉菜单的显示状态
  const [isOpen, setIsOpen] = useState(false);
  // 控制是否通过悬停触发
  const [isHovered, setIsHovered] = useState(false);
  // 引用下拉菜单容器
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 处理点击外部关闭菜单
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 处理菜单显示/隐藏
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      ref={dropdownRef}
    >
      {/* 触发按钮 */}
      <div onClick={handleToggle} className="cursor-pointer">
        {trigger}
      </div>

      {/* 下拉菜单 */}
      {(isOpen || isHovered) && (
        <div className="absolute top-full left-0 mt-2 w-[600px] bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-700 p-4 z-50">
          <div className="grid grid-cols-2 gap-4">
            {categories.map((category, index) => (
              <div key={index} className="space-y-2">
                {/* 分类标题 */}
                <h3 className="text-sm font-semibold text-gray-300 mb-2">
                  {category.title}
                </h3>
                {/* 分类下的菜单项 */}
                <div className="space-y-1">
                  {category.items.map((item, itemIndex) => (
                    <Link
                      key={itemIndex}
                      to={item.href}
                      className="block px-3 py-2 text-sm text-gray-300 hover:bg-gray-700/50 rounded-md transition-colors"
                    >
                      <div className="font-medium">{item.title}</div>
                      {item.description && (
                        <div className="text-xs text-gray-400">
                          {item.description}
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
