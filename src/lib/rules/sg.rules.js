import { defineRules } from './helpers'

/* ---------------------------------------------------------------------------
   sg.rules: Singapore-localised scam scripts
   Encodes the fraud typologies most often reported against local victims:
   impersonated local banks, telcos and government agencies, PayNow/PayLah!
   money movement, the "parcel held" delivery script, and job/task scams.
   These sit alongside the global rules, so generic scams are still caught.
--------------------------------------------------------------------------- */

export default defineRules('sg', 'Singapore Scam Analyzer', {
  sgBankImpersonation: {
    label: 'SG bank impersonation',
    color: 'primary',
    weight: 13,
    technique: 'Authority',
    contextual: true, // "I use DBS" is normal. Only scores alongside a real manipulation signal.
    explain: {
      why: 'Names a local bank (DBS, POSB, OCBC, UOB, Standard Chartered, Trust, GXS) or its banking app, usually alongside a security scare.',
      use: 'A familiar local bank name plus a locked-account story is one of the most common scam openers in Singapore.',
      respond: 'Local banks never send login links by chat. Open the official app yourself, or call the number on the back of your card.',
    },
    patterns: [
      /\b(dbs|posb|ocbc|uob|standard chartered|stanchart|trust bank|gxs bank|maybank|citibank|hsbc)\b/gi,
      /\b(paylah|paynow|ib ?secure|digibank|pib|internet banking)\b/gi,
    ],
  },
  sgTelcoImpersonation: {
    label: 'SG telco or Singpass impersonation',
    color: 'primary',
    weight: 13,
    technique: 'Authority',
    contextual: true,
    explain: {
      why: 'Poses as a local telco (Singtel, StarHub, M1, Simba, Circles.Life) or Singpass to force a "re-verification".',
      use: 'A Singpass or phone-line "suspension" scares people into handing over the credentials that unlock everything else.',
      respond: 'Singpass and telcos never ask you to re-verify through a chat link. Go to the official app directly.',
    },
    patterns: [
      /\b(singtel|starhub|m1|simba|circles\.?life|myrepublic)\b/gi,
      /\b(singpass|sing ?pass|corppass|face verification|myinfo)\b/gi,
    ],
  },
  sgGovImpersonation: {
    label: 'SG government agency impersonation',
    color: 'primary',
    weight: 15,
    technique: 'Authority',
    explain: {
      why: 'Claims to be a Singapore agency (IRAS, CPF, MOM, ICA, MOH, LTA, SPF, MAS), often about tax, a fine, immigration, or a payout.',
      use: 'Agencies carry real authority, so impersonating them turns a request into what feels like a legal order.',
      respond: 'No Singapore agency demands payment or personal details over chat. Check on the official .gov.sg site or hotline.',
    },
    patterns: [
      /\b(iras|cpf ?board|cpf|\bmom\b|ica|\bmoh\b|\blta\b|onemotoring|spf|singapore police|mas|gov\.?sg|govbenefits|gst voucher|assurance package)\b/gi,
      /\b(tax (refund|arrears|owing)|cpf (withdrawal|top ?up)|work pass|immigration (offence|matter)|traffic (fine|offence)|court (notice|summons) from)\b/gi,
      /\b(safety account|safe account|money laundering|clear your name|(assist|help) (with |in )?(the |an |our )?investigation|investigation officer|inspector \w+ from|you are (being |under )?investigat\w+|warrant (in|under) your name)\b/gi,
    ],
  },
  sgParcelScam: {
    label: 'SG parcel or delivery scam',
    color: 'warning',
    weight: 13,
    technique: 'Urgency',
    explain: {
      why: 'The "your parcel is held" script, naming a local courier (SingPost, Ninja Van, J&T, Qxpress, Shopee, Lazada) and asking for a fee or address update.',
      use: 'Almost everyone is expecting a delivery, so a held-parcel message feels believable enough to tap without thinking.',
      respond: 'Track parcels only in the courier\u2019s own app. A delivery fee demanded by SMS or chat is a scam.',
    },
    patterns: [
      /\b(singpost|sing ?post|ninja ?van|j&t|jt express|qxpress|speedpost|shopee ?(express|xpress)?|lazada)\b/gi,
      /\b(parcel|package|shipment) (is )?(held|on hold|pending|stuck|undelivered|cannot be delivered|failed delivery)\b/gi,
      /\b(redelivery|re-?delivery|clear (customs|the parcel)|delivery fee|address (is )?(incomplete|incorrect))\b/gi,
    ],
  },
  sgJobScam: {
    label: 'SG job or task scam',
    color: 'accent',
    weight: 14,
    technique: 'Greed',
    explain: {
      why: 'The "easy commission" job scam: like-and-earn, review tasks, or affiliate "missions" that need a top-up to unlock earnings.',
      use: 'Small early payouts build trust before the victim is asked to deposit their own money to "release" bigger commissions.',
      respond: 'No real job asks you to pay before you earn. Stop the moment a task needs a top-up or transfer.',
    },
    patterns: [
      /\b(part.?time (job|work) (from home)?|easy (commission|money|task)|like (and|&) earn|complete (tasks?|missions?)|top ?up to (unlock|release|continue)|commission (task|job)|hotel (review|booking) task|affiliate mission|boost (product )?(ratings|sales|reviews)|online assistants?|rate (the )?products|upgrade your (task |reviewer |member )?account|(after|complete) (the )?first \d+ tasks)\b/gi,
    ],
  },
  sgMoneyMule: {
    label: 'Money mule recruitment',
    color: 'accent',
    weight: 16,
    technique: 'Greed',
    explain: {
      why: 'Offers easy money for letting someone use, borrow, rent, or "receive payments" through your bank account, or for your banking login.',
      use: 'Scam syndicates need local accounts to move stolen money, and students are a main target. Letting them use yours is a crime even if you did not know where the money came from.',
      respond: 'Never let anyone use your bank account or Singpass. Walk away and tell a parent or teacher; police have charged teenagers as money mules.',
    },
    patterns: [
      /\b(use your (bank )?account|lend (us |me )?your (bank )?account|rent (out )?your (bank )?account|sell your (bank )?account|receive (some )?(payments?|money|funds|transfers?) (for us|into your account|on our behalf|through your account)|(then |and )transfer (it |them )?out|you keep \d+ ?%|keep \d+ ?% (commission|of it)|bank account for (rent|hire))\b/gi,
    ],
  },
  sgNewNumber: {
    label: '"New number" impersonation',
    color: 'primary',
    weight: 12,
    technique: 'Authority',
    explain: {
      why: 'Someone claims to be a family member or friend on a new number, usually because their phone "spoilt", and soon asks for money.',
      use: 'You trust the person they claim to be, and the "can’t call right now" excuse stops you checking their voice.',
      respond: 'Call the person on their old number, or ask something only they would know, before sending anything.',
    },
    patterns: [
      /\b((this is|it'?s) (my|me,? my) new (phone )?number|(i )?(changed|change) (my )?(phone )?number|(my )?(old )?phone (spoil|spoilt|broke|broken|drop(ped)? (into|in)|lost|kena)|(this|my new|this new) number (cannot|can'?t|unable to) (receive|take|answer) (any )?calls?)\b/gi,
    ],
  },
  sgEcommerce: {
    label: 'E-commerce or prepayment scam',
    color: 'warning',
    weight: 14,
    technique: 'Pressure',
    explain: {
      why: 'A fake buyer sends a link to "receive payment" (often claiming Carousell protection), or a seller wants payment first before shipping tickets or items.',
      use: 'E-commerce scams are among the most reported in Singapore. A real buyer never needs your card details to pay you.',
      respond: 'Only accept payment inside the app, and never pay a stranger upfront. Meet in person, check the item, then pay.',
    },
    patterns: [
      /\b(carousell (protection|payment|guarantee|delivery|safe ?pay)|paid (through|via|using) carousell|(receive|claim|accept) (the |your )?payment (via|through|by|from|using) (this|the) link|(click|tap) (this|the) link to (receive|claim|accept) (the |your )?(payment|money|funds)|(pay|paynow)( me)?( a)?( deposit)? first,? then (i|we) (ship|send|transfer|deliver|post|pass)|(transfer|send) (the )?(tickets?|item|it) (only )?after (you )?(pay|paynow))\b/gi,
    ],
  },
  sgLoanScam: {
    label: 'Unlicensed loan offer',
    color: 'accent',
    weight: 14,
    technique: 'Greed',
    explain: {
      why: 'Offers fast cash with no credit check, then asks for an admin or processing fee before releasing the loan.',
      use: 'The upfront fee is the scam. Licensed moneylenders in Singapore do not collect fees before giving a loan.',
      respond: 'Never pay a fee to receive a loan. Check moneylenders against the official Ministry of Law registry.',
    },
    patterns: [
      /\b(no (need )?(to )?check credit|no credit check|fast (loan |cash )?approval|instant (cash|loan)|loan (is )?(approved|available|ready)|need cash anot|ah ?long|(admin|processing|handling|activation) fee (first|upfront))\b/gi,
    ],
  },
  sgPayNowTransfer: {
    label: 'PayNow or local transfer request',
    color: 'accent',
    weight: 10,
    technique: 'Pressure',
    contextual: true, // "PayNow me for the food" between friends is normal
    explain: {
      why: 'Steers money toward PayNow, PayLah!, or a transfer to a mobile number, NRIC or UEN, which settles instantly.',
      use: 'Instant local transfers are gone before the victim realises, with no card-style chargeback.',
      respond: 'Only PayNow people you know in person. A PayNow request from a stranger or an "official" is a red flag.',
    },
    patterns: [
      /\b(paynow (to|me|this)|paylah|transfer to (this )?(number|mobile|nric|uen)|scan (this|the) (qr|paynow))\b/gi,
    ],
  },
})
