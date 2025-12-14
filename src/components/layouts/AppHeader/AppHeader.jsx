import { Layout } from "antd";
import "./AppHeader.css";

const { Header } = Layout;

export default function AppHeader() {
  return (
    <Header className="app-header">
      <div className="app-header__wrapper">
        <div className="app-header__content">
          <h1 className="app-header__logo">
            <a style={{color: "#e5e5e5"}} href="/">КиноМакс</a>
          </h1>
        </div>
      </div>
    </Header>
  );
}
