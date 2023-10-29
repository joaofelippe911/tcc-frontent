export default function formatDateStringToDateAndTime(dateString) {
  return new Date(dateString).toLocaleDateString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}