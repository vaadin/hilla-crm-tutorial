import { uiStore } from 'Frontend/stores/app-store';
import '@vaadin/vaadin-login/vaadin-login-form';
import { View } from '../view';
import { customElement, state } from 'lit/decorators';
import { html } from 'lit';

@customElement('login-view')
export class LoginView extends View {
  @state()
  private error = false;

  connectedCallback() {
    super.connectedCallback();
    this.classList.add('flex', 'flex-col', 'items-center', 'justify-center');
    uiStore.logout();
  }

  render() {
    return html`
      <h1>Vaadin CRM</h1>
      <vaadin-login-form
        no-forgot-password
        @login=${this.login}
        .error=${this.error}
        ?disabled=${uiStore.offline}>
      </vaadin-login-form>
      ${uiStore.offline
        ? html` <b>You are offline. Login is only available while online.</b> `
        : html` <b>Log in with: user/userpass</b> `}
    `;
  }

  async login(e: CustomEvent) {
    try {
      await uiStore.login(e.detail.username, e.detail.password);
    } catch (e) {
      this.error = true;
    }
  }
}
