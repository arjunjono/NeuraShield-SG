/* One-tap demo conversations, written around the scam scripts and grooming
   patterns seen in Singapore. Each escalates over the chat so the risk
   timeline has a visible shape. None of these are in the evaluation set. */

export const SAMPLES = [
  {
    id: 'bank',
    emoji: '🏦',
    label: 'Bank OTP scam',
    text: `Unknown: DBS Security Alert: we detected an unauthorised transaction of $3,980 on your account.
You: What? I didn't make any transaction.
Unknown: This is the DBS fraud department. Your account will be locked in 30 minutes unless you verify your account immediately.
You: How do I verify?
Unknown: Log in here: dbs-secure-verify.xyz/login and read me the 6-digit OTP we just sent to your phone.
You: Shouldn't I call the bank myself?
Unknown: There is no time. Do not contact your branch, this is a confidential fraud case.`,
  },
  {
    id: 'real-otp',
    emoji: '✅',
    label: 'Real bank OTP text',
    text: `DBS: Your OTP for the PayNow transfer of SGD 45.00 to TAN JIA HUI is 739204. It expires in 5 minutes. Do not share this OTP with anyone. If you did not request this, call 1800 111 1111.`,
  },
  {
    id: 'parcel',
    emoji: '📦',
    label: 'Parcel scam',
    text: `Unknown: SingPost: your parcel is on hold. The address is incomplete and it cannot be delivered.
You: Which parcel?
Unknown: Your recent order lah. Pay the $2.30 redelivery fee to release it: singpost-redelivery.top
You: Why do I need to pay?
Unknown: Small fee only, standard one. Fast fast pay before it goes back to sender, don't worry very safe.`,
  },
  {
    id: 'job',
    emoji: '💼',
    label: 'Job task scam',
    text: `Unknown: Hi! Part-time job from home, earn $200 to $500 daily just by liking videos. Interested?
You: How does it work?
Unknown: Very easy one. Complete simple tasks and we pay commission.
You: Okay, sounds interesting.
Unknown: First you top up $50 to unlock your task account, then the commission is released to you. Trust me can, everyone is doing this.`,
  },
  {
    id: 'mule',
    emoji: '🎒',
    label: 'Money mule recruitment',
    text: `Unknown: hi bro, want to earn $500 a week easy? many students doing already
You: doing what?
Unknown: just let us use your bank account to receive some payments, then transfer out. you keep 10%
You: is that legal?
Unknown: confirm legal one, don't worry. just give me your ibanking login and we settle everything`,
  },
  {
    id: 'gov',
    emoji: '🏛️',
    label: 'Fake government payout',
    text: `Unknown: CPF Board: you are eligible for a $600 government assurance payout.
You: How do I get it?
Unknown: Register at cpf-payout-claim.xyz with your Singpass ID, password and bank details.
You: That sounds official.
Unknown: Claim before the deadline today or you forfeit the payout. Enter your details now.`,
  },
  {
    id: 'grooming',
    emoji: '🎮',
    label: 'Grooming',
    text: `Stranger: eh you're damn good at this game sia
You: haha thanks
Stranger: how old are you ah, which sec?
You: sec 2, 14
Stranger: you're so mature for your age. I can top up your game credits, my treat
You: really?
Stranger: ya, but add me on telegram first, more private. Don't tell your parents ah, it's our secret
Stranger: after that we meet up, I come to your area. meet at the void deck near your block, come alone ok`,
  },
  {
    id: 'romance',
    emoji: '❤️',
    label: 'Romance scam',
    text: `Alex: Good morning my love, I couldn't stop thinking about you all night. You're the only one who understands me.
You: Good morning! When are you coming to Singapore?
Alex: Soon, I promise. We're meant to be.
Alex: But something terrible happened. Customs is holding my luggage and I need to pay a $1,800 customs fee today.
You: Oh no... can't you pay it yourself?
Alex: My card doesn't work here. Please don't tell your family, they won't understand what we have.
Alex: You could PayNow to this number tonight. Trust me, I'll refund you the moment I land.`,
  },
  {
    id: 'safe',
    emoji: '💬',
    label: 'Normal chat',
    text: `Wei Jie: eh tonight steamboat still on?
You: ya confirm plus chop, 7pm at my place
Wei Jie: ok can, I PayNow you my share later
You: no need lah, settle next time
Wei Jie: paiseh, I bring the drinks then`,
  },
]
