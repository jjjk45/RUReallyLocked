export const COLLATERAL = [
  { id: 'money',    label: '$20 to your partner',        desc: 'the classic motivator' },
  { id: 'meal',     label: 'owe them a meal',            desc: 'provide sustenance' },
  { id: 'mile',     label: 'run a mile',                 desc: '5280 feet or 1609.34 meters' },
  { id: 'bathroom', label: 'clean their bathroom/kitchen', desc: 'you miss, you scrub' },
  { id: 'dishes',   label: 'do their dishes',            desc: 'you miss, you scrub' },
]

export const COLLATERAL_LABELS = Object.fromEntries(COLLATERAL.map(c => [c.id, c.label]))

export const COLLATERAL_EMOJIS = {
  money:    '💵',
  meal:     '🍕',
  mile:     '🏃',
  bathroom: '🧹',
  dishes:   '🍽️',
}
