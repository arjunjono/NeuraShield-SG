import { defineRules } from './helpers'

export default defineRules('financial', 'Financial Request Analyzer', {
  financialRequest: {
    label: 'Financial request',
    color: 'accent',
    weight: 14,
    technique: 'Pressure',
    explain: {
      why: 'Directly asks you to send money, pay a fee, or make a deposit.',
      use: 'Every scam ends here: the earlier signals exist only to make this request feel reasonable.',
      respond: 'Never move money on request within a chat. Verify through an independent channel first.',
    },
    patterns: [
      /\b(send (me )?(the )?(money|funds|payment|cash|\$\s?\d)|transfer (the )?(money|funds|\$)|pay (the |a )?(fee|fine|deposit|invoice|penalty)|(processing|customs|shipping|small) fee|refund you|deposit \$?\d+|need \$?\d+|lend me)\b/gi,
      /\b(top ?up (\$?\d+|your account|to (unlock|release|continue|activate))|deposit (\$?\d+ )?to (unlock|release|start|activate)|pay (\$?\d+ )?(first|upfront) to)\b/gi,
      /\b(transfer (all )?(your )?(savings|money|funds|cash)|(transfer|send|paynow) \$?[\d,]+ to (my|a|this|the|our) (friend|account|number)|(make|pay|put in) a deposit( of \$?[\d,]+)?|deposit of \$?[\d,]+|(admin|handling|activation|upgrade) fee|(lend|borrow) (me )?\$[\d,]+|paynow (me )?\$?[\d,]+ (admin|deposit|fee|first))\b/gi,
    ],
  },
  paymentMethod: {
    label: 'Untraceable payment',
    color: 'accent',
    weight: 16,
    technique: 'Pressure',
    explain: {
      why: 'Demands payment through channels that cannot be reversed or traced: gift cards, wires, or crypto.',
      use: 'Cards and bank transfers can be recalled; gift card codes, wires, and crypto are gone the moment they are sent.',
      respond: 'No legitimate company or agency accepts gift cards or wire transfers as payment. Ever.',
    },
    patterns: [
      /\b((steam|apple|itunes|google play|amazon) (gift )?cards?|gift ?cards?|voucher codes?|scratch (off )?the code)\b/gi,
      /\b(wire (transfer|the money|it)|western union|moneygram|bank transfer to|routing number|swift code)\b/gi,
      /\b(bitcoin|btc|ethereum|eth|usdt|crypto( ?currency)?|wallet address|seed phrase)\b/gi,
    ],
  },
  p2pApp: {
    label: 'P2P payment app',
    color: 'accent',
    weight: 6,
    technique: 'Pressure',
    contextual: true, // "I'll venmo you for lunch" is normal between friends
    explain: {
      why: 'Steers payment toward peer-to-peer apps, often with "friends and family" to strip buyer protection.',
      use: 'P2P transfers between strangers have no dispute process: the money is treated as a gift.',
      respond: 'Only use P2P apps with people you know in real life, and never select "friends and family" for a purchase.',
    },
    patterns: [/\b(cash ?app|venmo|zelle|paypal friends (and|&) family)\b/gi],
  },
})
