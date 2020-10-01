import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import { IconProps } from '../../../icons/Icon/Icon';
import { IconCamera } from '../../../icons/IconCamera/IconCamera';
import { cnMixFocus } from '../../../mixs/MixFocus/MixFocus';
import { cnTabs, cnTabsTab, Tabs, tabsSizes, tabsViews } from '../Tabs';

type TabsProps = React.ComponentProps<typeof Tabs>;

const testId = cnTabs();

type Item = {
  name: string;
  icon: React.FC<IconProps>;
};

const items: Item[] = [
  {
    name: 'один',
    icon: IconCamera,
  },
  {
    name: 'два',
    icon: IconCamera,
  },
  {
    name: 'три',
    icon: IconCamera,
  },
];

const additionalClass = 'additionalClass';

const handleChange = jest.fn();

const renderComponent = (props: {
  size?: TabsProps['size'];
  view?: TabsProps['view'];
  onlyIcon?: TabsProps['onlyIcon'];
  renderItem?: TabsProps['renderItem'];
  onChange?: TabsProps['onChange'];
}) => {
  const value = items[0];

  return render(
    <Tabs
      {...props}
      items={items}
      value={value}
      onChange={props.onChange || handleChange}
      getLabel={(item) => `Name-${item.name}`}
      getIcon={(item) => item.icon}
      className={additionalClass}
      data-testid={testId}
    />,
  );
};

function getRender() {
  return screen.getByTestId(testId);
}

function getItems() {
  return getRender().querySelectorAll(`.${cnTabsTab()}`);
}

function getItem(index = 0) {
  return getItems()[index] as HTMLLabelElement;
}

function getIcon(index = 0) {
  return getRender().querySelectorAll(`.${cnTabsTab('Icon')}`)[index] as HTMLSpanElement;
}

describe('Компонент Tabs', () => {
  it('должен рендериться без ошибок', () => {
    expect(() => renderComponent({})).not.toThrow();
  });
  describe('проверка props', () => {
    describe('проверка items', () => {
      it(`количество совпадает с передоваемым`, () => {
        renderComponent({});
        const itemsRender = getItems();
        expect(itemsRender.length).toEqual(items.length);
      });
    });
    describe('проверка value', () => {
      it(`выбранному элементу присвоился модификатор "_checked"`, () => {
        renderComponent({});
        const item = getItem();
        expect(item).toHaveClass(cnTabsTab({ checked: true }));
      });
    });
    describe('проверка getLabel', () => {
      it(`label у элемента верный`, () => {
        renderComponent({});
        const item = getItem();
        expect(item.textContent).toEqual(`Name-${items[0].name}`);
      });
    });
    describe('проверка getIcon', () => {
      it(`иконка отображается`, () => {
        renderComponent({});
        const icon = getIcon();
        expect(icon).toHaveClass('IconCamera');
      });
    });
    describe('проверка onlyIcon', () => {
      it(`текст не отображается`, () => {
        renderComponent({ onlyIcon: true });
        const item = getItem();
        expect(item.textContent).toEqual('');
      });
      it(`присваивает класс`, () => {
        renderComponent({ onlyIcon: true });
        const item = getItem();
        expect(item).toHaveClass(cnTabsTab({ onlyIcon: true }));
      });
    });
    describe('проверка className', () => {
      it(`присвоился дополнительный класс`, () => {
        renderComponent({});
        const choiceGroup = getRender();
        expect(choiceGroup).toHaveClass(additionalClass);
      });
    });
    describe('проверка size', () => {
      tabsSizes.forEach((size) => {
        it(`присваивает класс для size=${size}`, () => {
          renderComponent({ size });
          const choiceGroup = getRender();
          expect(choiceGroup).toHaveClass(cnTabs({ size }));
        });
      });
    });
    describe('проверка view', () => {
      tabsViews.forEach((view) => {
        it(`присваивает класс для size=${view}`, () => {
          renderComponent({ view });
          const choiceGroup = getRender();
          expect(choiceGroup).toHaveClass(cnTabs({ view }));
        });
      });
    });
    describe('проверка onChange', () => {
      it(`клик по невыбраному элементу, должен вызвать callback c ожидаемыми параметрами`, () => {
        const handleChange = jest.fn();
        const elementIndex = 1;

        renderComponent({ onChange: handleChange });

        const item = getItem(elementIndex);
        fireEvent.click(item);

        expect(handleChange).toHaveBeenCalled();
        expect(handleChange).toHaveBeenCalledTimes(1);
        expect(handleChange).toHaveBeenCalledWith(
          expect.objectContaining({ value: items[elementIndex] }),
        );
      });
      it('клик по выбраному элементу, не должен вызвать callback', () => {
        const handleChange = jest.fn();

        renderComponent({ onChange: handleChange });

        const item = getItem(0);

        fireEvent.click(item);

        expect(handleChange).not.toHaveBeenCalled();
      });
    });
    describe('проверка renderItem', () => {
      it(`рендер элемента производится прокинутой функцией`, () => {
        const renderText = 'customRenderItem';
        renderComponent({ renderItem: ({ key }) => <div key={key}>{renderText}</div> });
        expect(getRender().textContent).toEqual(`${renderText}${renderText}${renderText}`);
      });
    });
  });
  it(`на элементах есть миксин ${cnMixFocus()}`, () => {
    renderComponent({});
    const item = getItem();
    expect(item).toHaveClass(cnMixFocus({ before: true }));
  });
});
