export { ColorAvatar }    from './ui/ColorAvatar';
export { FilterField }    from './ui/FilterField';
export { Field }          from './ui/Field';
export { Pager }          from './ui/Pager';
export { SmallStat }      from './ui/SmallStat';
export { Toggle }         from './ui/Toggle';
export { Checkbox }       from './ui/Checkbox';
export { CreditCardArt, buildCardsForCustomer } from './business-components/CreditCardArt';
export { NetworkMark }    from './business-components/NetworkMark';
export { ProgramLogo }    from './business-components/ProgramLogo';

export function fmtMoney(n) {
  return '$ ' + Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
