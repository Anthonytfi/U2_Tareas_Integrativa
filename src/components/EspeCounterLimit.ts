import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';

export class EspeCounterLimit extends LitElement {
  static styles = css`
    :host {
      --color-primario: #003C71;
      --color-secundario: #FFD700;
      --spacing-8: 8px;
      --spacing-16: 16px;

      display: block;
      background-color: var(--color-primario);
      color: white;
      font-family: Arial, sans-serif;
      padding: var(--spacing-16);
      border-radius: 8px;
      text-align: center;
      max-width: 320px;
      margin: auto;
      user-select: none;
      border: 2px solid red; /* Depuración */
    }

    .counter {
      font-size: 2rem;
      margin-bottom: var(--spacing-16);
      font-weight: bold;
      border: 1px solid yellow; /* Depuración */
    }

    button {
      background-color: var(--color-secundario);
      color: var(--color-primario);
      border: none;
      padding: var(--spacing-8) var(--spacing-16);
      border-radius: 4px;
      cursor: pointer;
      font-size: 1.25rem;
      margin: 0 var(--spacing-8);
      transition: background-color 0.3s ease;
      border: 1px solid green; /* Depuración */
    }

    button:hover:not(:disabled) {
      background-color: #e6c200;
    }

    button:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
    }

    .message {
      margin-top: var(--spacing-8);
      color: var(--color-secundario);
      font-weight: bold;
      font-size: 1.1rem;
      animation: pulse 1.5s infinite alternate;
      border: 1px solid orange; /* Depuración */
    }

    @keyframes pulse {
      0% { opacity: 1; }
      100% { opacity: 0.6; }
    }
  `;

  static properties = {
    limit: { type: Number },
    count: { type: Number },
    isAtLimit: { type: Boolean },
  };

  // Estados internos 
  private _limit = 10;
  private _count = 0;
  private _isAtLimit = false;

  constructor() {
    super();
    console.log('Constructor de EspeCounterLimit ejecutado');
  }

  firstUpdated(changedProperties: Map<string, any>) {
    super.firstUpdated(changedProperties);
    this._limit = this._limit || 10; // Usa el valor del atributo o el predeterminado
    this._count = this._count || 0;
    this._isAtLimit = this._isAtLimit || false;
    console.log('firstUpdated:', this._count, this._limit, this._isAtLimit);
    this.requestUpdate(); 
  }

  updated(changedProps: Map<string, any>) {
    if (changedProps.has('limit') && this._limit < 0) {
      this._limit = 0;
    }
    console.log('Updated:', this._count, this._limit, this._isAtLimit);
  }

  render() {
    console.log('Renderizando:', this._count, this._limit, this._isAtLimit);
    return html`
      <div class="counter" role="status" aria-live="polite">${this._count}</div>
      <button @click=${this._decrement} ?disabled=${this._count <= 0} aria-label="Disminuir contador" tabindex="0" role="button">-</button>
      <button @click=${this._increment} ?disabled=${this._isAtLimit} aria-label="Aumentar contador" tabindex="0" role="button">+</button>
      ${this._isAtLimit ? html`<div class="message" role="alert" aria-live="assertive">¡Límite alcanzado!</div>` : ''}
    `;
  }

  private _increment() {
    console.log('Incrementando:', this._count, this._limit);
    if (this._count < this._limit) {
      this._count++;
      this.requestUpdate(); 
      if (this._count === this._limit) {
        this._isAtLimit = true;
        this._dispatchLimitReachedEvent();
      }
      this._dispatchUpdateEvent();
    }
  }

  private _decrement() {
    console.log('Decrementando:', this._count, this._limit);
    if (this._count > 0) {
      this._count--;
      this.requestUpdate(); 
      if (this._isAtLimit) {
        this._isAtLimit = false;
      }
      this._dispatchUpdateEvent();
    }
  }

  private _dispatchUpdateEvent() {
    this.dispatchEvent(new CustomEvent('contador-actualizado', {
      detail: { count: this._count },
      bubbles: true,
      composed: true,
    }));
  }

  private _dispatchLimitReachedEvent() {
    this.dispatchEvent(new CustomEvent('contador-al-limite', {
      detail: { limit: this._limit },
      bubbles: true,
      composed: true,
    }));
  }
}

customElements.define('espe-counter-limit', EspeCounterLimit);
console.log('EspeCounterLimit.ts cargado y registrado');