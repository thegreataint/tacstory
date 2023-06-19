import DynamicSelect2 from '../components/DynamicSelect2';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction

export default {
  title: 'Custom/DynamicSelect2',
  component: DynamicSelect2,
  tags: ['autodocs'],
  argTypes: {
    options: {
      control: {
        type: 'array',
        value: [
          { value: 'option1', label: 'Option 1' },
          { value: 'option2', label: 'Option 2' },
          { value: 'option3', label: 'Option 3' },
        ]
      },
    },
    url: {
      control: {
        type: 'object',
        value: {
          baseUrl: 'https://api.lacasa.tacverse.com/v1/', 
          route: 'users', 
          hasPagination: true 
        }
      },
    },
      filter: {
        control: {
          type: 'object',
          value: {
            filterBy: 'name',
            serverSide: true,
            enabled: true
          }
        }
      },
    
    
     isMultiple: { type: 'boolean', defaultValue: false },
  }
};

const handleCreateClick = (query) => {
  console.log(query)
}
// const options = [
//   { value: 'option1', label: 'Option 1' },
//   { value: 'option2', label: 'Option 2' },
//   { value: 'option3', label: 'Option 3' },
// ];

export const Default = (args) => <DynamicSelect2 {...args}  handleCreate={handleCreateClick}/>;
