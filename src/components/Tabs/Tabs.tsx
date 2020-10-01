import './Tabs.css';

import React, { createRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useChoiceGroup } from '../../hooks/useChoiceGroup/useChoiceGroup';
import { useForkRef } from '../../hooks/useForkRef/useForkRef';
import { IconProps, IconPropSize } from '../../icons/Icon/Icon';
import { cn } from '../../utils/bem';
import { getSizeByMap } from '../../utils/getSizeByMap';
import { PropsWithHTMLAttributesAndRef } from '../../utils/types/PropsWithHTMLAttributes';

import { cnTabsTab, TabsTab } from './Tab/TabsTab';

export const tabsSizes = ['m', 's'] as const;
export type TabsPropSize = typeof tabsSizes[number];
export const tabsDefaultSize: TabsPropSize = tabsSizes[0];

export const tabsViews = ['bordered', 'clear'] as const;
export type TabsPropView = typeof tabsViews[number];
export const tabsDefaultView: TabsPropView = tabsViews[0];

export type TabsPropGetLabel<ITEM> = (item: ITEM) => string | number;
export type TabsPropGetIcon<ITEM> = (item: ITEM) => React.FC<IconProps> | undefined;
export type TabsPropOnChange<ITEM> = (props: {
  e: React.MouseEvent<HTMLButtonElement>;
  value: ITEM | null;
}) => void;

export type RenderItem<ITEM, ELEMENT> = (props: {
  item: ITEM;
  ref: React.RefObject<ELEMENT>;
  key: string | number;
  onChange: React.MouseEventHandler<ELEMENT>;
  checked: boolean;
  label: string;
  icon?: React.FC<IconProps>;
  iconSize: IconPropSize;
  onlyIcon?: boolean;
  className: string;
}) => React.ReactElement | null;

type Props<ITEM = any, ITEM_ELEMENT = any> = PropsWithHTMLAttributesAndRef<
  {
    size?: TabsPropSize;
    onlyIcon?: boolean;
    view?: TabsPropView;
    iconSize?: IconPropSize;
    items: ITEM[];
    value?: ITEM | null;
    getIcon?: TabsPropGetIcon<ITEM>;
    getLabel: TabsPropGetLabel<ITEM>;
    children?: never;
    onChange: TabsPropOnChange<ITEM>;
    renderItem?: RenderItem<ITEM, ITEM_ELEMENT>;
  },
  HTMLDivElement
>;

export const cnTabs = cn('Tabs');

const renderItemDefault: RenderItem<unknown, HTMLButtonElement> = ({
  ref,
  key,
  onChange,
  checked,
  label,
  icon,
  iconSize,
  onlyIcon,
  className,
}) => {
  return (
    <TabsTab
      className={className}
      ref={ref}
      key={key}
      onChange={onChange}
      checked={checked}
      label={label}
      icon={icon}
      iconSize={iconSize}
      onlyIcon={onlyIcon}
    />
  );
};

type Tabs = <ITEM = unknown, ITEMELEMENT = HTMLButtonElement>(
  props: Props<ITEM, ITEMELEMENT>,
) => React.ReactElement | null;

const sizeMap: Record<TabsPropSize, IconPropSize> = {
  s: 'xs',
  m: 's',
};

export const Tabs: Tabs = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  const {
    size = tabsDefaultSize,
    className,
    items,
    view = tabsDefaultView,
    value,
    onlyIcon,
    getIcon,
    getLabel,
    onChange,
    iconSize: iconSizeProp,
    renderItem = renderItemDefault,
    ...otherProps
  } = props;

  type Item = typeof items[number];

  const { getOnChange, getChecked } = useChoiceGroup<Item, React.MouseEvent<HTMLButtonElement>>({
    value,
    getKey: getLabel,
    callBack: onChange,
    multiple: false,
  });

  const [mounted, setMounted] = useState<boolean>(false);

  const constructItemRefs: () => Record<string, React.RefObject<HTMLButtonElement>> = () => {
    const refs: Record<string, React.RefObject<HTMLButtonElement>> = {};
    for (const item of items) {
      refs[getLabel(item)] = createRef<HTMLButtonElement>();
    }
    return refs;
  };

  const buttonRefs = useMemo(constructItemRefs, [items, getLabel]);

  const rootRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  function setStyleForLine(
    tabsWidth: number,
    tabWidth: number,
    tabRatio: number,
    tabOffsetLeft: number,
  ) {
    if (lineRef.current) {
      const lineStyle = lineRef.current.style;
      lineStyle.setProperty('--tabsWidth', `${tabsWidth}px`);
      lineStyle.setProperty('--tabWidth', `${tabWidth}px`);
      lineStyle.setProperty('--tabRatio', `${tabRatio}`);
      lineStyle.setProperty('--tabOffsetLeft', `${tabOffsetLeft}px`);
    }
  }

  const updateLine = () => {
    if (rootRef.current && lineRef.current && buttonRefs) {
      const rootWidth = rootRef.current.offsetWidth;
      if (value) {
        const activeItemRef = buttonRefs[getLabel(value)];
        if (activeItemRef && activeItemRef.current) {
          const itemWidth = activeItemRef.current.offsetWidth;
          const itemOffsetLeft = activeItemRef.current.offsetLeft;
          setStyleForLine(rootWidth, itemWidth, itemWidth / rootWidth, itemOffsetLeft);
        }
      } else {
        setStyleForLine(rootWidth, 1, 0.00001, 1);
      }
    }
  };

  useEffect(() => {
    updateLine();
  });

  const onMount = useCallback(() => {
    updateLine();
    setMounted(true);
  }, [updateLine]);

  const withOutValue = !value;
  const iconSize = getSizeByMap(sizeMap, size, iconSizeProp);

  return (
    <div
      className={cnTabs({ size, view }, [className])}
      ref={useForkRef<HTMLDivElement>([ref, rootRef, onMount])}
      {...otherProps}
    >
      <div className={cnTabs('List')}>
        {items.map((item: unknown) => {
          return renderItem({
            item,
            ref: buttonRefs[getLabel(item)],
            key: getLabel(item),
            onChange: getOnChange(item),
            checked: getChecked(item),
            label: getLabel(item).toString(),
            icon: getIcon && getIcon(item),
            iconSize,
            onlyIcon,
            className: cnTabs('Tab'),
          });
        })}
      </div>
      <div className={cnTabs('WrapperRunningLine')}>
        <div className={cnTabs('RunningLine', { withOutValue, mounted })} ref={lineRef} />
      </div>
    </div>
  );
});

export { TabsTab, cnTabsTab };
