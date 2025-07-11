import React, { ButtonHTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

// Button 类型定义
type ButtonType = "primary" | "default" | "dashed" | "text" | "link";
type ButtonSize = "large" | "middle" | "small";

// Button Props 接口
export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  type?: ButtonType;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  children?: ReactNode;
  block?: boolean;
  danger?: boolean;
  ghost?: boolean;
  href?: string;
  target?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

// 基础样式
const baseStyles = `
  inline-flex items-center justify-center gap-2 font-medium transition-all duration-200
  border border-solid rounded-md cursor-pointer select-none
  focus:outline-none focus:ring-2 focus:ring-offset-2
  disabled:cursor-not-allowed disabled:opacity-50
`;

// 尺寸样式
const sizeStyles = {
  small: "h-6 px-2 text-sm",
  middle: "h-8 px-4 text-sm",
  large: "h-10 px-6 text-base",
};

// 类型样式
const typeStyles = {
  primary: {
    normal:
      "bg-blue-600 border-blue-600 text-white hover:bg-blue-700 hover:border-blue-700 focus:ring-blue-500",
    ghost:
      "bg-transparent border-blue-600 text-blue-600 hover:bg-blue-50 hover:border-blue-700 focus:ring-blue-500",
    danger:
      "bg-red-600 border-red-600 text-white hover:bg-red-700 hover:border-red-700 focus:ring-red-500",
  },
  default: {
    normal:
      "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:ring-gray-500",
    ghost:
      "bg-transparent border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:ring-gray-500",
    danger:
      "bg-white border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 focus:ring-red-500",
  },
  dashed: {
    normal:
      "bg-white border-gray-300 border-dashed text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:ring-gray-500",
    ghost:
      "bg-transparent border-gray-300 border-dashed text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:ring-gray-500",
    danger:
      "bg-white border-red-300 border-dashed text-red-600 hover:bg-red-50 hover:border-red-400 focus:ring-red-500",
  },
  text: {
    normal:
      "bg-transparent border-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
    ghost:
      "bg-transparent border-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
    danger:
      "bg-transparent border-transparent text-red-600 hover:bg-red-50 focus:ring-red-500",
  },
  link: {
    normal:
      "bg-transparent border-transparent text-blue-600 hover:text-blue-800 focus:ring-blue-500 p-0 h-auto",
    ghost:
      "bg-transparent border-transparent text-blue-600 hover:text-blue-800 focus:ring-blue-500 p-0 h-auto",
    danger:
      "bg-transparent border-transparent text-red-600 hover:text-red-800 focus:ring-red-500 p-0 h-auto",
  },
};

// Loading 图标组件
const LoadingIcon: React.FC = () => (
  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

// Button 组件
const Button: React.FC<ButtonProps> = ({
  type = "default",
  size = "middle",
  loading = false,
  disabled = false,
  icon,
  children,
  block = false,
  danger = false,
  ghost = false,
  href,
  target,
  className,
  onClick,
  ...props
}) => {
  // 获取样式变体
  const getStyleVariant = () => {
    if (danger) return "danger";
    if (ghost) return "ghost";
    return "normal";
  };

  // 构建完整的 className
  const getClassName = () => {
    const variant = getStyleVariant();
    const styles = [
      baseStyles,
      sizeStyles[size],
      typeStyles[type][variant],
      block ? "w-full" : "",
      className || "",
    ];

    return twMerge(...styles);
  };

  // 处理点击事件
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (loading || disabled) return;
    onClick?.(event);
  };

  // 渲染图标
  const renderIcon = () => {
    if (loading) {
      return <LoadingIcon />;
    }
    if (icon) {
      return <span className="flex items-center">{icon}</span>;
    }
    return null;
  };

  // 如果是链接类型且有 href，渲染为 a 标签
  if (type === "link" && href) {
    return (
      <a
        href={href}
        target={target}
        className={getClassName()}
        {...(props as any)}
      >
        {renderIcon()}
        {children}
      </a>
    );
  }

  // 渲染按钮
  return (
    <button
      className={getClassName()}
      disabled={disabled || loading}
      onClick={handleClick}
      {...props}
    >
      {renderIcon()}
      {children}
    </button>
  );
};

export default Button;
