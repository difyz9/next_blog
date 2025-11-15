// 导航栏配置类型定义
// 参考 Docusaurus: https://docusaurus.io/docs/api/themes/configuration

export type NavbarStyle = 'default' | 'dark' | 'primary';

export type NavbarPosition = 'left' | 'right';

export type NavbarItemType = 'link' | 'dropdown' | 'search' | 'custom';

export interface NavbarLogoConfig {
  alt: string;
  src?: string;
  type?: 'gradient' | 'image';
  gradient?: {
    from: string;
    to: string;
  };
}

export interface BaseNavbarItem {
  position?: NavbarPosition;
  className?: string;
}

export interface LinkNavbarItem extends BaseNavbarItem {
  type?: 'link';
  label: string;
  href: string; // 必需属性
  icon?: 'github' | 'twitter' | 'discord' | string;
  target?: '_blank' | '_self';
  rel?: string;
}

export interface DropdownNavbarItem extends BaseNavbarItem {
  type: 'dropdown';
  label: string;
  items: (LinkNavbarItem | { type: 'html'; value: string })[];
}

export interface SearchNavbarItem extends BaseNavbarItem {
  type: 'search';
}

export interface CustomNavbarItem extends BaseNavbarItem {
  type: 'custom';
  component: string; // 组件名称，如 'ThemeToggle'
  props?: Record<string, any>;
}

export type NavbarItem = 
  | LinkNavbarItem 
  | DropdownNavbarItem 
  | SearchNavbarItem 
  | CustomNavbarItem;

export interface NavbarConfig {
  title?: string;
  logo?: NavbarLogoConfig;
  tagline?: string;
  hideOnScroll?: boolean;
  style?: NavbarStyle;
  items: NavbarItem[];
}

export interface TableOfContentsConfig {
  minHeadingLevel: number;
  maxHeadingLevel: number;
}

export interface ThemeConfig {
  colorMode?: {
    defaultMode: 'light' | 'dark';
    disableSwitch?: boolean;
    respectPrefersColorScheme?: boolean;
  };
  navbar: NavbarConfig;
  tableOfContents: TableOfContentsConfig;
  footer?: {
    style?: 'dark' | 'light';
    links?: Array<{
      title: string;
      items: Array<{
        label: string;
        to?: string;
        href?: string;
      }>;
    }>;
    copyright?: string;
  };
}
