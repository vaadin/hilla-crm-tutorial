import { Layout } from './views/view';
import '@vaadin/vaadin-app-layout';
import '@vaadin/vaadin-app-layout/vaadin-drawer-toggle';

import { views } from './routes';
import { uiStore } from './stores/app-store';
import { customElement } from 'lit/decorators';
import { css, html } from 'lit';

@customElement('main-layout')
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
      <vaadin-app-layout class="h-full">
        <header slot="navbar" class="w-full flex items-center px-m">
          <vaadin-drawer-toggle></vaadin-drawer-toggle>
          <h1 class="text-l m-m">Vaadin CRM</h1>
          <a href="/logout" class="ms-auto" ?hidden=${uiStore.offline}
            >Log out</a
          >
        </header>

        <div slot="drawer">
          <div class="flex flex-col h-full mx-m my-l spacing-b-m">
            ${views.map(
              (view) => html` <a href=${view.path}> ${view.title} </a> `
            )}
          </div>
        </div>
        <div class="h-full">
          <slot><!-- views go here --></slot>
        </div>
      </vaadin-app-layout>
    `;
  }
}
