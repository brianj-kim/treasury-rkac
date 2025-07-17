
const CURRENCY_FORMATTER = new Intl.NumberFormat("en-CA", {
  currency: "CAD",
  style: "currency"
});

export const formatCurrency = (amount: number) => {
  return CURRENCY_FORMATTER.format(amount);
}

const NUMBER_FORMATTER = new Intl.NumberFormat("en-CA");

export const formatNumber = (number: number) => {
  return NUMBER_FORMATTER.format(number);
}

export const formatDate = (date: Date) => {
  return date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
}