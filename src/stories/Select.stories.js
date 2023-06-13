import { SelectOptions } from "../components/Select";

export default {
  title: 'Select',
  component : SelectOptions,
  argTypes: {
    api: {
      control: {
        type: 'text',
      },
    },
    params:{
      control:{
        type:'object'
      }
    }
  },
}

export const Default = (args) => <SelectOptions {...args}/>;
