import "./App.css";
import { useState } from "react";
import { Layout, Typography } from "antd";
import WithExportable from "./examples/WithExportable";
import Sidebar from "./Sidebar";
import { Options } from "./options";
import WithSearchable from "./examples/WithSearchable";
import WithSearchableExportable from "./examples/WithSearchableExportable";

const Components: Record<Options, JSX.Element> = {
  searchable: <WithSearchable />,
  exportable: <WithExportable />,
  searchableExportable: <WithSearchableExportable />,
};

function App(): JSX.Element {
  const [activeOption, setActiveOption] = useState<Options>("searchable");

  return (
    <Layout
      style={{
        height: "100vh",
        maxHeight: "100vh",
        minHeight: "100vh",
      }}
    >
      <Layout.Content style={{ minHeight: "100%" }}>
        <Layout style={{ minHeight: "100%" }}>
          <Layout.Header
            style={{
              textAlign: "left",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              padding: 20,
            }}
          >
            <Typography.Title level={5} style={{ color: "white" }}>
              Ant Table Extensions
            </Typography.Title>
          </Layout.Header>
          <Layout style={{ minHeight: "100%" }}>
            <Layout.Sider>
              <Sidebar option={activeOption} setOption={setActiveOption} />
            </Layout.Sider>
            <Layout.Content
              style={{
                padding: 20,
              }}
            >
              {Components[activeOption]}
            </Layout.Content>
          </Layout>
        </Layout>
      </Layout.Content>
    </Layout>
  );
}

export default App;
