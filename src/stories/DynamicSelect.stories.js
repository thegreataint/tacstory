import DynamicSelect from '../components/DynamicSelect';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
export default {
  title: 'Custom/DynamicSelect',
  component: DynamicSelect,
  tags: ['autodocs'],
  argTypes: {
    baseUrl: {
      control: {
        type: 'text',
      },
    },
    route: {
      control: {
        type: 'text',
      },
    },
    // params:{
    //   control:{
    //     type:'object'
    //   }
    // },
    filterBy: {
      control: {
        type: 'text',
        vaule: 'name'
      }
    },
    placeholder:{
      control:{
        type:'text',
        defaultValue: 'Select Option..',
        value: 'Select Option..',
      }
    }
  }
};


export const Default = (args) => <DynamicSelect {...args}/>;
