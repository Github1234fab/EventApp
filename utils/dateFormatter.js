// utils/dateFormatter.js
import dayjs from "dayjs";
import "dayjs/locale/fr"; // Import de la locale française
import relativeTime from "dayjs/plugin/relativeTime";
import localizedFormat from "dayjs/plugin/localizedFormat";

// Activer les plugins
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.locale("fr"); // Définir français par défaut

/**
 * Formate une date en français
 * @param {string} dateString - Date au format "YYYY-MM-DD" ou ISO
 * @param {string} format - Format souhaité
 * @returns {string} Date formatée
 */
export const formatDate = (dateString, format = "long") => {
  if (!dateString) return "Date non définie";

  const date = dayjs(dateString);
  
  if (!date.isValid()) return "Date invalide";

  switch (format) {
    case "long":
      // Ex: "samedi 4 octobre 2025"
      return date.format("dddd D MMMM YYYY");
    
    case "short":
      // Ex: "4 oct. 2025"
      return date.format("D MMM YYYY");
    
    case "full":
      // Ex: "samedi 4 octobre 2025 à 14h30"
      return date.format("dddd D MMMM YYYY [à] HH[h]mm");
    
    case "day":
      // Ex: "samedi 4 octobre"
      return date.format("dddd D MMMM");
    
    case "relative":
      // Ex: "dans 2 jours" ou "il y a 3 heures"
      return date.fromNow();
    
    case "calendar":
      // Ex: "Aujourd'hui", "Demain", "Lundi prochain"
      const today = dayjs();
      const tomorrow = today.add(1, "day");
      
      if (date.isSame(today, "day")) return "Aujourd'hui";
      if (date.isSame(tomorrow, "day")) return "Demain";
      if (date.isSame(today, "week")) return date.format("dddd");
      return date.format("dddd D MMMM");
    
    default:
      return date.format("DD/MM/YYYY");
  }
};

/**
 * Formate un horaire
 * @param {string} horaire - Ex: "18:00 - 22:00"
 * @returns {string} Horaire formaté
 */
export const formatHoraire = (horaire) => {
  if (!horaire) return "";
  
  // Remplacer les : par h
  // Ex: "18:00 - 22:00" → "18h00 - 22h00"
  return horaire.replace(/(\d+):(\d+)/g, "$1h$2");
};

/**
 * Combine date + horaire
 * @param {string} dateString 
 * @param {string} horaire 
 * @returns {string}
 */
export const formatDateHoraire = (dateString, horaire) => {
  const dateFormatted = formatDate(dateString, "long");
  
  if (!horaire) return dateFormatted;
  
  return `${dateFormatted} • ${formatHoraire(horaire)}`;
};

/**
 * Détermine si une date est passée
 * @param {string} dateString 
 * @returns {boolean}
 */
export const isPastDate = (dateString) => {
  if (!dateString) return false;
  return dayjs(dateString).isBefore(dayjs(), "day");
};

/**
 * Retourne le nombre de jours avant/après
 * @param {string} dateString 
 * @returns {number} Négatif si passé, positif si futur
 */
export const daysUntil = (dateString) => {
  if (!dateString) return null;
  return dayjs(dateString).diff(dayjs(), "day");
};