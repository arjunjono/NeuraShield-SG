import { defineRules } from './helpers'

/* ---------------------------------------------------------------------------
   grooming.rules: online grooming escalation, tuned for Singapore youth.
   Grooming is not one phrase; it is a ladder climbed across a conversation:
   probe age and school, move to a private app, build a "special" bond,
   demand secrecy from parents, test boundaries, then push for a meeting.
   Each category is one rung. The combination layer and the child-safety
   floor in detectionEngine.js turn the rungs into a recognised pattern.
--------------------------------------------------------------------------- */

export default defineRules('grooming', 'Grooming Escalation Analyzer', {
  ageProbe: {
    label: 'Age or school probing',
    color: 'danger',
    weight: 13,
    technique: 'Isolation',
    // Teachers, coaches and relatives ask this every day. It only counts when
    // something covert (secrecy, a private app, gifts, photos) is also present.
    contextual: true,
    explain: {
      why: 'An unknown contact fixes on how old you are, which level you are in, or which school or CCA you are from.',
      use: 'Confirming the target is a minor, and pinpointing them by school or CCA, is the first move in grooming.',
      respond: 'You never owe a stranger your age, school, or level. Tell a trusted adult if someone keeps asking.',
    },
    patterns: [
      /\b(how old are you(?! turning)|how old (?:you|r u|are u)\b|what('?s| is) your age|which (sec|secondary|level|grade|class) are you( in)?|are you (still )?in (school|sec\s?\d)|what school (do you go to|are you (from|in))|which (cca|co-?curricular))\b/gi,
      /\b(how old are you (again|exactly)|(so )?you'?re (only |just )?(\d{1,2}|thirteen|fourteen|fifteen|twelve|sixteen)|(mature|grown up|wise|pretty|cute|different) (for|beyond) (your age|(a )?(\d{1,2}|thirteen|fourteen|fifteen|twelve|sixteen)( ?year ?old)?|someone (in|your))|for a (\d{1,2}|thirteen|fourteen|fifteen) year)\b/gi,
    ],
  },
  platformShift: {
    label: 'Move to a private app',
    color: 'danger',
    weight: 15,
    technique: 'Isolation',
    explain: {
      why: 'Pushes the chat off the public platform onto something private or disappearing: Telegram, WhatsApp, Snapchat, Discord, private DMs.',
      use: 'Private apps with vanishing messages remove oversight and evidence.',
      respond: 'Saying no to moving apps is not rude. A stranger who insists on a private, disappearing app is a warning sign.',
    },
    patterns: [
      /\b(add me on (telegram|whatsapp|snap(chat)?|insta(gram)?|wechat|discord)|let'?s (talk|chat|move) (on|to) (telegram|whatsapp|snap|private)|what'?s your (number|handle|snap|insta)|dm me|text me on|switch to)\b/gi,
      /\b((move|take|shift|switch) (this|it|our chat|things?) (to|onto|over to|somewhere) (private|another app|a private|somewhere)|(talk|chat) (somewhere|on something) (more )?private|somewhere (more )?private|a private (app|chat)|where (the )?messages (disappear|vanish)|add me somewhere)\b/gi,
    ],
  },
  trustGrooming: {
    label: 'Special-bond flattery',
    color: 'danger',
    weight: 12,
    technique: 'Flattery',
    explain: {
      why: 'Manufactures a "you are different, I understand you" bond, framed as seeing the young person more clearly than others do.',
      use: 'A fast, special connection makes later boundary-crossing feel like closeness instead of danger.',
      respond: 'Fast, intense praise from a stranger is a tool, not a compliment. Talk to someone you trust about it.',
    },
    patterns: [
      /\b(you'?re (so )?(mature|different|special) for your age|you'?re not like other (kids|girls|boys|teens)|i (really )?understand you|you can (tell|trust) me (anything|everything)|our (little )?secret|you'?re my favou?rite|i feel a connection)\b/gi,
      /\b((we have|we'?ve got|there'?s|i feel) (such )?a (real |special |deep )?connection|you are (so |very |really )?(mature|special|different from the others)|nobody (understands|gets) you like (i do|me))\b/gi,
    ],
  },
  secrecyGrooming: {
    label: 'Secrecy from parents or teachers',
    color: 'danger',
    weight: 15,
    technique: 'Isolation',
    explain: {
      why: 'Asks the young person to hide the chat or the relationship from parents, teachers, or friends.',
      use: 'Secrecy cuts the target off from the exact adults who would recognise grooming and step in.',
      respond: 'Anyone who wants to be hidden from your parents or teachers is exactly why you should tell them.',
    },
    patterns: [
      /\b(don'?t (tell|let) your (parents|mum|mom|dad|teacher|friends)|keep (this|us) (a )?secret|(this|it)('?s| is) (just )?between us|delete (this|these|our) (chat|messages?)|don'?t (screenshot|show anyone)|our secret)\b/gi,
      /\b(when (they'?re|your (parents|mum|mom|dad) (are|is)|everyone(?:'s| is)) (asleep|sleeping|not (home|around|looking))|are your parents strict|(it'?s|its) (ok,? )?(it'?s )?just us|nobody (reads|sees|will see) (our|these) (messages|chats?)|so (they|nobody|no one) (don'?t|doesn'?t|won'?t|can'?t) see)\b/gi,
      /\b(keep (our|these|this) (conversations?|chats?|messages?) (between us|private|secret|to yourself)|your (parents|mum|mom|dad|teachers?|family)( and (your )?\w+)? (would|will|wouldn'?t|won'?t|would not|will not|don'?t|do not) (not )?(understand|get it|get us|approve))\b/gi,
      /\b(keep (it|this|things?) (ours|between us|low key)|(our|just our) (own )?thing|no (need|point) (to )?(tell|mention|bring (this|it) up)( (at home|to your (parents|folks|family)))|(don'?t|best not|no need) (mention|bring (this|it) up|tell anyone)( (at home|to your (parents|folks|family)))|not (tell|mention) (this to )?(your (parents|folks|family)|at home)|don'?t (tell|let) (your )?(parents|folks|mum|dad|teacher))\b/gi,
    ],
  },
  boundaryTesting: {
    label: 'Boundary or photo requests',
    color: 'danger',
    weight: 18,
    technique: 'Pressure',
    explain: {
      why: 'Tests limits by asking whether you are alone, steering toward appearance, or asking for photos or camera.',
      use: 'Small, escalating tests make requests that started out clearly wrong feel normal.',
      respond: 'You never have to answer questions about your body or send a photo. Stop the chat and tell a trusted adult.',
    },
    patterns: [
      /\b(are you (home )?alone|is anyone (with you|around|home)|what are you wearing|send (me )?(a )?(pic|picture|photo|selfie)|can i see you|turn on (your )?(cam|camera|video)|you look|show me)\b/gi,
    ],
  },
  meetingRequest: {
    label: 'Isolated meeting request',
    color: 'danger',
    weight: 17,
    technique: 'Isolation',
    explain: {
      why: 'Pushes to meet alone, somewhere quiet or close to home (a void deck, a playground, near your block), or offers to come and pick you up.',
      use: 'The meeting is where online grooming becomes real-world danger. Being alone and low-visibility spots are chosen on purpose.',
      respond: 'Never meet an online-only contact. Tell a parent or teacher about anyone who asks, wherever they suggest.',
    },
    patterns: [
      /\b(come alone|come by yourself|by yourself ok|i'?ll (pick you up|come to your|come (get|find|to) you)|(i )?(can |could )?(come|come by|swing by|drop by|fetch you) (to |from )?(your )?(area|neighbou?rhood|block|place|estate|school)|meet (somewhere|someplace) (quiet|private)|just (you and me|the two of us|us two)|meet (up )?(at|by|near) (the )?(void deck|playground|stairwell|my place|my house|your place|blk|block)|i (come )?(fetch|pick) you)\b/gi,
      /\b(pick you up after school|come (find|get) you|see you alone)\b/gi,
    ],
  },
  meetingMention: {
    label: 'Suggests meeting up',
    color: 'danger',
    weight: 10,
    technique: 'Isolation',
    // "Meet me at the staff room" is normal from a teacher. Only counts when
    // something covert is also present in the chat.
    contextual: true,
    explain: {
      why: 'Suggests meeting in person or seeing you face to face.',
      use: 'On its own this is ordinary. From an online-only contact who is also asking for secrecy or a private chat, it is the step toward real-world harm.',
      respond: 'Only meet people you know in real life, in public, and tell a parent where you are going.',
    },
    patterns: [
      /\b(let'?s meet( up)?|meet me (at|near|by|after)|(can|could|shall) (we|i) (meet|see you)( in person)?|see you in person|meet (you )?in person|come over|meet up|meet (at|by|near) (the )?(mrt|station|bus stop|mall|park))\b/gi,
    ],
  },
  sextortion: {
    label: 'Sextortion or image threat',
    color: 'danger',
    weight: 24,
    technique: 'Fear',
    explain: {
      why: 'Threatens to share photos or videos unless you send more, pay, or keep quiet; or offers money for videos of you.',
      use: 'Fear of exposure is used to trap the young person into more images or payment, and into silence.',
      respond: 'Stop replying and do not send anything or pay. It is not your fault. Tell a trusted adult and report it; the police treat this seriously.',
    },
    patterns: [
      /\b((send|give) me (more|another)\b[^.!?\n]{0,30}\bor (i'?ll|i will|else)|i (saved|kept|have|still have|screenshotted) (the |your |those )?(pics?|pictures?|photos?|videos?|nudes?)|(share|post|send|leak|show) (them|it|your (pics?|photos?|videos?)) (to|with|on) (your|everyone)|everyone will see (them|it|your)|send (me )?(a |some |more )?(video|pics?|photos?)[^.!?\n]{0,30}(i'?ll|i will) (give|pay|send) you)\b/gi,
      /\b(if you send me a (video|pic|photo)|i'?ll (give|pay) you \$?\d+[^.!?\n]{0,30}(video|pics?|photos?))\b/gi,
    ],
  },
  giftLure: {
    label: 'Gift or money lure',
    color: 'danger',
    weight: 14,
    technique: 'Greed',
    explain: {
      why: 'Offers gifts, phone top-ups, game credits (Robux, diamonds, primogems), vouchers, or money to a young person.',
      use: 'Gifts create a sense of owing and of secrecy, and are a common hook aimed at minors.',
      respond: 'A stranger offering money, credits, or gifts wants something back. Say no and tell a trusted adult.',
    },
    patterns: [
      /\b(buy you|get you|send you|top ?up your|i'?ll pay for|free (skin|robux|diamonds|credits|voucher|v-?bucks)|(game|mobile) (credits?|top ?up)|treat you|my treat|gift for you)\b/gi,
    ],
  },
})
