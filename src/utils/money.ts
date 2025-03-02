export type FormatMoneyProps = {
  value: number;
  absolute?: boolean;
  hidden?: boolean;
};

export const formatMoney = ({ value, absolute, hidden }: FormatMoneyProps) => {
  if (hidden) {
    return '••••••••';
  }

  const amount = absolute ? Math.abs(value) : value;

  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};
