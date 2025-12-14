import { Layout } from "antd";
import "./AppHeader.css";

const { Header } = Layout;

export default function AppHeader() {
  return (
    <Header className="app-header">
      <div className="app-header__wrapper">
        <div className="app-header__content">
          <h1 className="app-header__logo"><a href="/">🎬 КиноПоиск</a></h1>
        </div>
      </div>
    </Header>
  );
}
