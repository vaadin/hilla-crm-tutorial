import { css, customElement, html } from "lit-element";
import { Layout } from "./views/view";
import "@vaadin/vaadin-app-layout";
import "@vaadin/vaadin-app-layout/vaadin-drawer-toggle";
import "@vaadin/vaadin-notification";

import { views } from "./routes";
import { appState } from "./store/appstate";

@customElement("main-layout")
export class MainLayout extends Layout {
  static styles = css`
    :host {
      display: block;
      height: 100%;
      width: 100%;
    }
  `;
  render() {
    return html`
      <vaadin-app-layout class="full-size">
        <header slot="navbar" class="full-width v-flex v-items-center v-ph-m">
          <vaadin-drawer-toggle></vaadin-drawer-toggle>
          <h1 class="v-font-size-l v-m-m">Vaadin CRM</h1>
          <a href="/logout" class="v-ms-a" ?hidden=${appState.offline}
            >Log out</a
          >
        </header>

        <div slot="drawer">
          <div class="nav full-height v-mh-m v-mv-l gap-m v-flex v-flex-column">
            ${views.map(
              (view) => html` <a href=${view.path}> ${view.title} </a> `
            )}
          </div>
        </div>
        <div class="content full-height">
          <slot><!-- views go here --></slot>
        </div>
      </vaadin-app-layout>
      <vaadin-notification
        theme=${appState.message.error ? "error" : "contrast"}
        position="bottom-start"
        .opened=${appState.message.open}
        .renderer=${(root: HTMLElement) =>
          (root.textContent = appState.message.text)}
      ></vaadin-notification>
    `;
  }

  isActive(path: string) {
    return location.pathname === "/" + path ? "active" : "";
  }
}
