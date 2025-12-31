import { Layout } from "antd";
import "./AppSider.css";

const { Sider } = Layout;

export default function AppSider() {
  return (
    <Sider width="350px" className="app-sider">
      <div className="app-sider__wrapper">
        <div className="app-sider__content">
          <div className="app-sider__header">
            <img src="/src/assets/icons/settings.svg" className="app-sider__header-icon"></img>
            <h2 className="app-sider__header-title">Настройки</h2>
          </div>

          <div className="app-sider__section">
            <div className="app-sider__section-header">
              <img src="src/assets/icons/funnel.svg" className="app-sider__section-icon"></img>
              <h3 className="app-sider__title">Фильтры</h3>
            </div>
            <div className="app-sider__menu">
              <div className="app-sider__menu-item">
                <span className="app-sider__menu-label">Год выпуска</span>
                <div className="app-sider__menu-placeholder">—</div>
              </div>
              <div className="app-sider__menu-item">
                <span className="app-sider__menu-label">Рейтинг</span>
                <div className="app-sider__menu-placeholder">—</div>
              </div>
              <div className="app-sider__menu-item">
                <span className="app-sider__menu-label">Тип</span>
                <div className="app-sider__menu-placeholder">—</div>
              </div>
            </div>
          </div>

          <div className="app-sider__section">
            <div className="app-sider__section-header">
              <img src="src/assets/icons/drama.svg" className="app-sider__section-icon"></img>
              <h3 className="app-sider__title">Жанры</h3>
            </div>
            <div className="app-sider__menu">
              <div className="app-sider__menu-item">
                <span className="app-sider__menu-label">Все жанры</span>
                <div className="app-sider__menu-placeholder">—</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Sider>
  );
}
