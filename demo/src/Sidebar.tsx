import { Menu, Typography } from "antd";
import { Options, options } from "./options";

interface SidebarProps {
  option: Options;
  setOption: React.Dispatch<React.SetStateAction<Options>>;
}

function Sidebar({ option, setOption }: SidebarProps): JSX.Element {
  return (
    <div>
      <Menu
        mode="inline"
        theme="dark"
        selectedKeys={[option]}
        items={Object.keys(options).map((key) => ({
          key,
          label: options[key as Options],
        }))}
        onSelect={({ key }) => setOption(key as Options)}
      />
    </div>
  );
}

export default Sidebar;
