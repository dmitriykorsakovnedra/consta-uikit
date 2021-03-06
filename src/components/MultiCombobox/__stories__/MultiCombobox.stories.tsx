import React from 'react';
import { boolean, select, text } from '@storybook/addon-knobs';

import { createMetadata, createStory } from '../../../utils/storybook';
import { DefaultPropForm, DefaultPropView, form, view } from '../../SelectComponents/types';
import {
  MultiCombobox,
  multiComboboxPropSize,
  multiComboboxPropSizeDefault,
} from '../MultiCombobox';

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import mdx from './MultiCombobox.mdx';

type SelectOption = {
  label: string;
  value: string;
};

type Group = { label: string; items: SelectOption[] };
type Option = SelectOption | Group;

const simpleItems = [
  { label: 'Neptunium', value: 'Neptunium' },
  { label: 'Plutonium', value: 'Plutonium' },
  { label: 'Americium', value: 'Americium' },
  { label: 'Curium', value: 'Curium' },
  { label: 'Berkelium', value: 'Berkelium' },
  {
    label: 'Californium Berkelium Curium Plutonium',
    value: 'Californium Berkelium Curium Plutonium',
  },
  { label: 'Einsteinium', value: 'Einsteinium' },
  { label: 'Fermium', value: 'Fermium' },
  { label: 'Mendelevium', value: 'Mendelevium' },
  { label: 'Nobelium', value: 'Nobelium' },
  { label: 'Lawrencium', value: 'Lawrencium' },
  { label: 'Rutherfordium', value: 'Rutherfordium' },
  { label: 'Dubnium', value: 'Dubnium' },
  { label: 'Seaborgium', value: 'Seaborgium' },
  { label: 'Bohrium', value: 'Bohrium' },
  { label: 'Hassium', value: 'Hassium' },
  { label: 'Meitnerium', value: 'Meitnerium' },
  { label: 'Darmstadtium', value: 'Darmstadtium' },
  { label: 'Roentgenium', value: 'Roentgenium' },
  { label: 'Copernicium', value: 'Copernicium' },
  { label: 'Nihonium', value: 'Nihonium' },
  { label: 'Flerovium', value: 'Flerovium' },
  { label: 'Moscovium', value: 'Moscovium' },
  { label: 'Livermorium', value: 'Livermorium' },
  { label: 'Tennessine', value: 'Tennessine' },
  { label: 'Oganesson', value: 'Oganesson' },
];

const groups = [
  {
    label: 'First',
    items: [
      { label: 'Neptunium', value: 'Neptunium' },
      { label: 'Plutonium', value: 'Plutonium' },
      { label: 'Americium', value: 'Americium' },
      { label: 'Curium', value: 'Curium' },
      { label: 'Berkelium', value: 'Berkelium' },
    ],
  },
  {
    label: 'Second',
    items: [
      {
        label: 'Californium Berkelium Curium Plutonium',
        value: 'Californium Berkelium Curium Plutonium',
      },
      { label: 'Einsteinium', value: 'Einsteinium' },
      { label: 'Fermium', value: 'Fermium' },
      { label: 'Mendelevium', value: 'Mendelevium' },
      { label: 'Nobelium', value: 'Nobelium' },
      { label: 'Lawrencium', value: 'Lawrencium' },
      { label: 'Rutherfordium', value: 'Rutherfordium' },
      { label: 'Dubnium', value: 'Dubnium' },
      { label: 'Seaborgium', value: 'Seaborgium' },
    ],
  },
  {
    label: 'Third',
    items: [
      { label: 'Bohrium', value: 'Bohrium' },
      { label: 'Hassium', value: 'Hassium' },
      { label: 'Meitnerium', value: 'Meitnerium' },
      { label: 'Darmstadtium', value: 'Darmstadtium' },
      { label: 'Roentgenium', value: 'Roentgenium' },
      { label: 'Copernicium', value: 'Copernicium' },
      { label: 'Nihonium', value: 'Nihonium' },
      { label: 'Flerovium', value: 'Flerovium' },
    ],
  },
  {
    label: 'Four',
    items: [
      { label: 'Moscovium', value: 'Moscovium' },
      { label: 'Livermorium', value: 'Livermorium' },
      { label: 'Tennessine', value: 'Tennessine' },
      { label: 'Oganesson', value: 'Oganesson' },
    ],
  },
];

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const getKnobs = () => ({
  disabled: boolean('disabled', false),
  size: select('size', multiComboboxPropSize, multiComboboxPropSizeDefault),
  view: select('view', view, DefaultPropView),
  form: select('form', form, DefaultPropForm),
  placeholder: text('placeholder', 'Placeholder'),
});

const Default = (props: {
  value?: SelectOption[];
  items?: Option[];
  getItemLabel?(item: Option): string;
  getGroupOptions?(option: Option): SelectOption[];
  onCreate?(str: string): void;
}): JSX.Element => {
  const getItemLabelDefault = (option: Option): string => option.label;
  const {
    items = simpleItems,
    getItemLabel = getItemLabelDefault,
    getGroupOptions,
    onCreate,
  } = props;

  const options = items;

  return (
    <div>
      <MultiCombobox
        {...getKnobs()}
        id="example"
        options={options}
        value={props.value}
        getOptionLabel={getItemLabel}
        getGroupOptions={getGroupOptions}
        onCreate={onCreate}
      />
    </div>
  );
};

export const DefaultStory = createStory(() => <Default />, {
  name: 'по умолчанию',
});

export const WithValueStory = createStory(() => <Default value={[simpleItems[4]]} />, {
  name: 'c заданным значением',
});

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const WithCreateStory = createStory(() => <Default onCreate={(): void => {}} />, {
  name: 'c cозданием новой опции',
});

export const WithGroupsStory = createStory(
  () => <Default items={groups} getGroupOptions={(group: Group): SelectOption[] => group.items} />,
  {
    name: 'c группами опций',
  },
);

export default createMetadata({
  title: 'Components|/MultiCombobox',
  parameters: {
    docs: {
      page: mdx,
    },
  },
});
