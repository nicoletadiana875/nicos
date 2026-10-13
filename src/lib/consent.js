"use client";

import { useEffect, useState } from "react";
import {
  CONSENT_MAX_AGE_DAYS,
  CONSENT_SCHEMA_VERSION,
  CONSENT_STORAGE_KEY,
  consentRequired,
  consentServices,
} from "@/config/consent.mjs";

export const CONSENT_EVENT = "consulente-consent-changed";
export const OPEN_PREFERENCES_EVENT = "open-cookie-preferences";

/** Impronta dell'elenco servizi: se cambia, il consenso va richiesto di nuovo. */
const servicesSignature = consentServices.map((s) => s.id).sort().join("|");

/**
 * Legge la scelta salvata. Restituisce null se non c'e', se e' scaduta
 * (oltre 6 mesi) o se l'elenco dei servizi e' cambiato.
 */
export function readConsent() {
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    const ageMs = Date.now() - Date.parse(saved.savedAt);
    const maxAgeMs = CONSENT_MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
    if (
      saved.schema !== CONSENT_SCHEMA_VERSION ||
      saved.services !== servicesSignature ||
      !Number.isFinite(ageMs) ||
      ageMs > maxAgeMs
    ) {
      return null;
    }
    return saved;
  } catch {
    return null;
  }
}

/** Salva la scelta (solo quando il consenso e' richiesto) e avvisa chi e' in ascolto. */
export function saveConsent(choices) {
  const record = {
    schema: CONSENT_SCHEMA_VERSION,
    services: servicesSignature,
    savedAt: new Date().toISOString(),
    choices,
  };
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
  } catch {
    // Archiviazione non disponibile: la scelta vale solo per questa visita
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: record }));
  return record;
}

/**
 * true solo se l'utente ha acconsentito alla categoria.
 * Senza una scelta registrata il risultato e' sempre false.
 */
export function useConsent(category) {
  const [granted, setGranted] = useState(false);

  useEffect(() => {
    const update = () => setGranted(Boolean(consentRequired && readConsent()?.choices?.[category]));
    update();
    window.addEventListener(CONSENT_EVENT, update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener(CONSENT_EVENT, update);
      window.removeEventListener("storage", update);
    };
  }, [category]);

  return granted;
}

/** Mostra i figli (es. uno script di terze parti) solo dopo il consenso alla categoria. */
export function ConsentGate({ category, children }) {
  const granted = useConsent(category);
  return granted ? children : null;
}
